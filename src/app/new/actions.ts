'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function extractFigmaData(url: string, vibe: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Ensure the user's profile exists to satisfy the foreign key constraint on the projects table
    // Using Admin Client to bypass RLS for this auto-healing step since we already verified the user via getUser()
    const adminSupabase = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error: profileError } = await adminSupabase.from('profiles').upsert({ id: user.id, email: user.email || '' }, { onConflict: 'id' })
    if (profileError) {
        console.error('Failure saving profile to DB:', profileError)
        throw new Error(`Profile DB Error: ${profileError.message || JSON.stringify(profileError)} | Failed to heal account`)
    }

    // 1. Extract file key from URL
    // Example URL: https://www.figma.com/file/xxxxx/Title
    const match = url.match(/file\/([a-zA-Z0-9]+)\//) || url.match(/design\/([a-zA-Z0-9]+)\//)
    const fileKey = match ? match[1] : null

    // We no longer throw an error on invalid URLs to ensure local testing always creates a DB project
    // if (!fileKey && !url.includes('demo')) { ... }

    // 2. We'd call the Figma API here:
    /*
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: { 'X-FIGMA-TOKEN': process.env.FIGMA_PERSONAL_ACCESS_TOKEN || '' }
    });
    const figmaJson = await response.json();
    */

    // 3. For now, simulate extracting the top-level frames
    const mockExtractedFrames = [
        { name: 'Wireframes', nodeId: '0:1' },
        { name: 'Final UI', nodeId: '0:2' },
        { name: 'Components', nodeId: '0:3' }
    ]

    // 4. Create the Project in DB
    const { data: project, error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            title: 'New Case Study',
            figma_url: url,
            vibe: vibe,
        })
        .select()
        .single()

    if (error || !project) {
        console.error('Failure saving to DB:', error)
        throw new Error(`DB Error: ${error?.message || JSON.stringify(error)} | Failed to create project`)
    }

    // 6. Create initial Sections for the builder based on the frames
    // ...

    redirect(`/builder/${project.id}`)
}
