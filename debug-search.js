const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSearch(query) {
    console.log(`Testing search for: "${query}"`);

    // Test RPC
    const { data: rpcData, error: rpcError } = await supabase.rpc('link_search', { query_text: query });
    if (rpcError) {
        console.log('RPC Error (Expected if not exists):', rpcError.message);
    } else {
        console.log(`RPC returned ${rpcData?.length} results`);
    }

    // Test Fallback
    const { data: fallbackData, error: fallbackError } = await supabase
        .from('content')
        .select('*')
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
        .eq('status', 'published') // Ensure status column exists and logic is correct
        .limit(5);

    if (fallbackError) {
        console.error('Fallback Query Error:', fallbackError);
    } else {
        console.log(`Fallback returned ${fallbackData?.length} results:`);
        fallbackData?.forEach(d => console.log(`- ${d.title} (${d.type})`));
    }
}

testSearch('court');
