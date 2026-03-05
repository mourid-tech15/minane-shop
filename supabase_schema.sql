-- DAROU ÉLÉGANCE - Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (extending auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    stripe_payment_id TEXT,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Order Items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

-- RLS POLICIES

-- Products: Anyone can read active products, only admins can modify
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow admin all products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Categories: Anyone can read, only admins can modify
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow admin all categories" ON public.categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Orders: Users see their own, admins see all
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins see all orders" ON public.orders FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Users: Users see own profile, admins see all
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own profile" ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins see all profiles" ON public.users FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- FUNCTIONS & TRIGGERS

-- 6. Shop Settings table
CREATE TABLE IF NOT EXISTS public.shop_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'MINANE SHOP',
    logo_url TEXT,
    description TEXT,
    whatsapp_number TEXT DEFAULT '221770000000',
    email TEXT,
    address TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Shop Settings
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read shop settings" ON public.shop_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin modify shop settings" ON public.shop_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Insert default settings if not exists
INSERT INTO public.shop_settings (name, whatsapp_number)
SELECT 'MINANE SHOP', '221770000000'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_settings);

-- Automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'client');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
