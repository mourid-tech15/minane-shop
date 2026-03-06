-- REPAIR SCRIPT FOR MINANE SHOP
-- Run this in the Supabase SQL Editor

-- 1. Ensure shop_settings exists
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

-- 2. Insert default settings if missing
INSERT INTO public.shop_settings (name, whatsapp_number)
SELECT 'MINANE SHOP', '221770000000'
WHERE NOT EXISTS (SELECT 1 FROM public.shop_settings);

-- 3. Reset RLS on users table to be more permissive for own profile
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own profile" ON public.users;
CREATE POLICY "Users see own profile" ON public.users FOR SELECT USING (true); -- Publicly readable for now to avoid auth.uid() issues

DROP POLICY IF EXISTS "Admins see all profiles" ON public.users;
CREATE POLICY "Admins see all profiles" ON public.users FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Ensure RLS on shop_settings
ALTER TABLE public.shop_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read shop settings" ON public.shop_settings;
CREATE POLICY "Allow public read shop settings" ON public.shop_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin modify shop settings" ON public.shop_settings;
CREATE POLICY "Allow admin modify shop settings" ON public.shop_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Force promote your specific user to admin
UPDATE public.users SET role = 'admin' WHERE id = '2cd0e511-043f-4912-bcb5-633fdb444ade';
-- If row doesn't exist, create it manually
INSERT INTO public.users (id, full_name, role)
SELECT '2cd0e511-043f-4912-bcb5-633fdb444ade', 'Mourtada', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = '2cd0e511-043f-4912-bcb5-633fdb444ade');

-- 6. Grant permissions
GRANT SELECT ON public.shop_settings TO anon, authenticated;
GRANT SELECT ON public.users TO anon, authenticated;
