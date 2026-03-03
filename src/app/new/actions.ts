'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function extractFigmaData(url: string, vibe: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // 1. Extract file key from URL
    // Example URL: https://www.figma.com/file/xxxxx/Title
    const match = url.match(/file\/([a-zA-Z0-9]+)\//) || url.match(/design\/([a-zA-Z0-9]+)\//)
    const fileKey = match ? match[1] : null

    if (!fileKey && !url.includes('demo')) {
        throw new Error('Invalid Figma URL format')
    }

    // 2. We'd call the Figma API here:
    /*
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: { 'X-FIGMA-TOKEN': process.env.FIGMA_PERSONAL_ACCESS_TOKEN || '' }
    });
    const figmaJson = await response.json();
    */

    // 3. For now, simulate extracting the top-level frames
    // Let's pretend we parsed the JSON and extracted 3 images
    const mockExtractedFrames = [
        { name: 'Wireframes', nodeId: '0:1' },
        { name: 'Final UI', nodeId: '0:2' },
        { name: 'Components', nodeId: '0:3' }
    ]

    // 4. In reality, we would then call Figma's /images endpoint to get the JPG/PNG URLs for these nodes
    /*
    const imageRefs = mockExtractedFrames.map(f => f.nodeId).join(',');
    const imgResponse = await fetch(`https://api.figma.com/v1/images/${fileKey}?ids=${imageRefs}&format=png`, ...);
    const imageTokens = await imgResponse.json();
    // Download those URLs and push them into Supabase Storage
    // ...
    */

    // 5. Create the Project in DB
    const { data: project, error } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            title: 'New Case Study (Draft)',
            figma_url: url,
            vibe: vibe,
        })
        .select()
        .single()

    if (error) {
        // Note: this might fail locally without running the SQL migrations
        console.error('Failure saving to DB:', error)
        // We'll fallback to a mock ID just for UX demonstration 
        redirect('/builder/mock-id')
    }

    // 6. Create initial Sections for the builder based on the frames
    // ...

    redirect(`/builder/${project.id}`)
}
