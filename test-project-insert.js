const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Using service role to bypass RLS for debugging
const supabase = createClient(supabaseUrl, supabaseKey);

async function testProjectInsert() {
    console.log("Testing project insertion...");

    // Use the known user ID from the previous test
    const userId = "f37be714-d5ec-48a1-8061-ec370114dc7e";

    const { data: project, error } = await supabase
        .from('projects')
        .insert({
            user_id: userId,
            title: 'Test Debug Project',
            figma_url: 'https://figma.com/demo',
            vibe: 'minimal',
        })
        .select()
        .single();

    if (error) {
        console.error("DB Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Success:", project);
    }
}

testProjectInsert();
