import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    full_name: string | null;
    phone: string | null;
    role: 'client' | 'admin';
}

interface AuthStore {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    initialized: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string) => Promise<void>;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set, get) => ({
    session: null,
    user: null,
    profile: null,
    loading: true,
    initialized: false,

    initialize: async () => {
        try {
            // Get initial session
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                set({ session, user: session.user, profile, loading: false, initialized: true });
            } else {
                set({ session: null, user: null, profile: null, loading: false, initialized: true });
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (_event, session) => {
                if (session) {
                    const { data: profile } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    set({ session, user: session.user, profile, loading: false });
                } else {
                    set({ session: null, user: null, profile: null, loading: false });
                }
            });
        } catch (error) {
            console.error('Error initializing auth:', error);
            set({ loading: false, initialized: true });
        }
    },

    signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    },

    signUp: async (email, password, fullName) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        if (error) throw error;
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },
}));
