import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    image_url: string | null;
    category_id: string | null;
    stock: number;
    is_active: boolean;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

interface AdminStore {
    products: Product[];
    categories: Category[];
    loading: boolean;
    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
    updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
}

export const useAdmin = create<AdminStore>((set, get) => ({
    products: [],
    categories: [],
    loading: false,

    fetchProducts: async () => {
        set({ loading: true });
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            set({ products: data || [] });
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            set({ loading: false });
        }
    },

    fetchCategories: async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            if (error) throw error;
            set({ categories: data || [] });
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    },

    addProduct: async (product) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert(product)
                .select()
                .single();
            if (error) throw error;
            set({ products: [data, ...get().products] });
        } catch (err) {
            console.error('Error adding product:', err);
            throw err;
        }
    },

    updateProduct: async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            set({
                products: get().products.map((p) => (p.id === id ? data : p)),
            });
        } catch (err) {
            console.error('Error updating product:', err);
            throw err;
        }
    },

    deleteProduct: async (id) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            set({ products: get().products.filter((p) => p.id !== id) });
        } catch (err) {
            console.error('Error deleting product:', err);
            throw err;
        }
    },
}));
