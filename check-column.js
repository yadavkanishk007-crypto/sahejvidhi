const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumn() {
    try {
        const { data, error } = await supabase.from('content').select('author_name').limit(1);
        if (error) {
            console.log('Error selecting author_name:', error.message);
        } else {
            console.log('Column author_name exists.');
        }
    } catch (err) {
        console.error('Exception:', err);
    }
}

checkColumn();
