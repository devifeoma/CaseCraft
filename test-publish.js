const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testPublish() {
    console.log("Testing project publish update...");
    const projectId = "39c96011-4142-437e-bd31-2fa7ab55128b"; // the ID from the URL
    const userId = "f37be714-d5ec-48a1-8061-ec370114dc7e";

    const { error } = await supabase
        .from('projects')
        .update({
            is_published: true,
            password_hash: null
        })
        .eq('id', projectId)
        .eq('user_id', userId);

    if (error) {
        console.error("Publish DB Error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Success: Project published!");
    }
}

testPublish();
