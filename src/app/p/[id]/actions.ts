'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function verifyProjectPassword(projectId: string, password: string) {
    const supabase = await createClient()

    // Fetch project's password hash
    const { data: project, error } = await supabase
        .from('projects')
        .select('password_hash')
        .eq('id', projectId)
        .single()

    if (error || !project) {
        throw new Error("Project not found.")
    }

    if (!project.password_hash) {
        // Project doesn't have a password, shouldn't be here
        return { success: true }
    }

    // Compare password
    const isValid = await bcrypt.compare(password, project.password_hash)

    if (!isValid) {
        throw new Error("Incorrect password.")
    }

    // Set unlocking cookie
    const cookieStore = await cookies()
    cookieStore.set(`casecraft_unlocked_${projectId}`, 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return { success: true }
}
