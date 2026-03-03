'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        // In free-tier projects, email signups are heavily rate-limited.
        // If we hit an error (and it isn't just that the user already exists), fallback to the Admin API to force-create the account.
        const isAlreadyRegistered = error.message.toLowerCase().includes('already registered')

        if (!isAlreadyRegistered && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.log('Signup error intercepted (likely rate limit). Attempting to bypass via Supabase Admin API...')

            const adminSupabase = createAdminClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            )

            const { error: adminError } = await adminSupabase.auth.admin.createUser({
                email: data.email,
                password: data.password,
                email_confirm: true
            })

            if (adminError) {
                console.error('Supabase Admin Sign Up Error:', adminError)
                redirect(`/login?error=${encodeURIComponent(adminError.message)}`)
            }

            // The user is created, but we need a session on the client. Sign them in.
            const { error: signInError } = await supabase.auth.signInWithPassword(data)

            if (signInError) {
                console.error('Sign In via Admin Creation Error:', signInError)
                redirect(`/login?error=${encodeURIComponent(signInError.message)}`)
            }
        } else {
            console.error('Supabase Sign Up Error:', error)
            redirect(`/login?error=${encodeURIComponent(error.message)}`)
        }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}
