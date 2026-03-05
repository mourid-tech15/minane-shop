import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface ShopSettings {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  whatsapp_number: string;
  email: string | null;
  address: string | null;
}

interface ShopStore {
  settings: ShopSettings | null;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<ShopSettings>) => Promise<void>;
}

export const useShop = create<ShopStore>((set, get) => ({
  settings: null,
  loading: true,
  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .select('*')
        .single();

      if (data) {
        set({ settings: data });
      } else if (error && error.code === 'PGRST116') {
        // No settings found, might need to initialize
        console.log('No settings found in database');
      }
    } catch (err) {
      console.error('Error fetching shop settings:', err);
    } finally {
      set({ loading: false });
    }
  },
  updateSettings: async (newSettings) => {
    const currentSettings = get().settings;
    if (!currentSettings) return;

    try {
      const { data, error } = await supabase
        .from('shop_settings')
        .update({ ...newSettings, updated_at: new Date().toISOString() })
        .eq('id', currentSettings.id)
        .select()
        .single();

      if (data) {
        set({ settings: data });
      }
      if (error) throw error;
    } catch (err) {
      console.error('Error updating shop settings:', err);
      throw err;
    }
  },
}));
