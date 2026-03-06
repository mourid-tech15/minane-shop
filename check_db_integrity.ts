import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function checkDatabase() {
    console.log('--- DB INTEGRITY CHECK ---');

    const tables = ['users', 'categories', 'products', 'orders', 'order_items', 'shop_settings'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`Table [${table}]: ERROR - ${error.message}`);
        } else {
            console.log(`Table [${table}]: OK (${data.length} rows found)`);
        }
    }

    const adminUid = '2cd0e511-043f-4912-bcb5-633fdb444ade';
    console.log(`\n--- CHECKING ADMIN UID: ${adminUid} ---`);
    const { data: admin, error: adminError } = await supabase
        .from('users')
        .select('*')
        .eq('id', adminUid)
        .maybeSingle();

    if (adminError) console.error('Admin fetch error:', adminError.message);
    else if (admin) console.log('Admin Profile Found:', admin);
    else console.log('Admin Profile MISSING in users table.');
}

checkDatabase();
