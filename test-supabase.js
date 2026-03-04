// test-supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gjdgjwqaxeqmijcmcmzq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZGdqd3FheGVxbWlqY21jbXpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ4NzA2OSwiZXhwIjoyMDg4MDYzMDY5fQ.tKrhi_i8tKunW3Ym4OiRMECJV3X4yrQK193szZZm3YU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
    console.log('Testing Supabase connection...');

    // 1. Check if the columns exist in profiles table
    console.log('\n--- Checking profiles table schema ---');
    const { data: profiles, error: profileErr } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, location, job_title')
        .limit(1);

    if (profileErr) {
        console.error('❌ Error checking profiles table:', profileErr.message);
    } else {
        console.log('✅ Profiles table exists and contains the requested columns.');
    }

    // 2. Check update profile error
    console.log('\n--- Simulating profile update ---');
    const { data: authUsers, error: usersErr } = await supabase.auth.admin.listUsers();

    if (usersErr) {
        console.error('❌ Failed to list auth users:', usersErr.message);
        return;
    }

    if (authUsers && authUsers.users && authUsers.users.length > 0) {
        const firstUser = authUsers.users[0];
        console.log(`Trying to update profile for user ${firstUser.id}...`);

        const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
                id: firstUser.id,
                email: firstUser.email,
                first_name: 'Test',
                last_name: 'User',
                location: 'Internet',
                job_title: 'Tester',
            });

        if (updateError) {
            console.error('❌ Upsert error details:', JSON.stringify(updateError, null, 2));
        } else {
            console.log('✅ Upsert succeeded.');
        }
    } else {
        console.log('No users found to test with.');
    }
}

testSupabase();
