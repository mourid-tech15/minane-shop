import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkPolicies() {
    console.log('--- RLS POLICIES CHECK ---');

    // Checking policies via RPC or direct select if enabled (might fail)
    const { data, error } = await supabase
        .rpc('get_policies'); // This function usually doesn't exist by default

    if (error) {
        console.log('RPC get_policies not found. Trying information_schema...');
        // We can't easily check RLS policies via regular PostgREST select unless a view exists.
    }

    // Let's try to see if we can read the users as a NON-admin user (using the anon key)
    const anonSupabase = createClient(
        process.env.VITE_SUPABASE_URL || '',
        process.env.VITE_SUPABASE_ANON_KEY || ''
    );

    console.log('\n--- TESTING ACCESS WITH ANON KEY (Expected to fail/be empty) ---');
    const { data: users, error: uError } = await anonSupabase.from('users').select('*');
    console.log('Anon Users:', uError ? uError.message : users.length + ' rows');

    console.log('\n--- RE-EXAMINING ADMIN PROFILE DATA ---');
    const { data: adminRecord, error: aError } = await supabase
        .from('users')
        .select('*')
        .eq('id', '2cd0e511-043f-4912-bcb5-633fdb444ade')
        .single();

    if (adminRecord) {
        console.log('Profile found with Service Role:', adminRecord);
    } else {
        console.log('Profile NOT found even with Service Role. Wait, check_db_integrity said it was found?!');
    }
}

checkPolicies();
