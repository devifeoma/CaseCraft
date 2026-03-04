'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const location = formData.get('location') as string
    const jobTitle = formData.get('jobTitle') as string
    const avatarFile = formData.get('avatar') as File | null

    let avatarUrl = formData.get('currentAvatarUrl') as string

    // Handle avatar upload if a new file is provided
    if (avatarFile && avatarFile.size > 0) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile)

        if (uploadError) {
            console.error('Error uploading avatar:', uploadError)
            // Note: If the user hasn't created the 'avatars' bucket, this will fail.
            // We'll proceed with other updates even if avatar fails rather than crashing entirely.
            if (uploadError.message.includes('bucket')) {
                console.warn('Avatars bucket may not exist yet.');
            }
        } else {
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            avatarUrl = data.publicUrl
        }
    }

    // Upsert profile data
    const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            location: location,
            job_title: jobTitle,
            avatar_url: avatarUrl,
        })

    if (updateError) {
        console.error('Error updating profile:', updateError)
        throw new Error('Failed to update profile')
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
}
