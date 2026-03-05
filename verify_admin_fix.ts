import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function verifyUser() {
    const targetEmail = 'mmourtada15@gmail.com';

    // 1. Get user from Auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    const authUser = users.find(u => u.email === targetEmail);

    if (!authUser) {
        console.log('User not found in Auth.');
        return;
    }

    console.log(`Auth User found: ${authUser.email} (${authUser.id})`);

    // 2. Refresh public profile
    const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (profileError) {
        console.log('Profile error:', profileError.message, profileError.details);

        // Try to create it if it doesn't exist
        console.log('Attempting to force create/update profile...');
        const { error: upsertError } = await supabase
            .from('users')
            .upsert({
                id: authUser.id,
                full_name: authUser.user_metadata?.full_name || 'Admin',
                role: 'admin'
            });

        if (upsertError) console.error('Upsert error:', upsertError);
        else console.log('Profile successfully created/updated as admin.');
    } else {
        console.log('Current Profile:', profile);
        if (profile.role !== 'admin') {
            console.log('Role is not admin. Updating...');
            await supabase.from('users').update({ role: 'admin' }).eq('id', authUser.id);
            console.log('Role updated to admin.');
        }
    }
}

verifyUser();
