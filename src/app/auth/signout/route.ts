import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // Sign out the user directly from Supabase
    await supabase.auth.signOut()

    // Clear cache and redirect back to login page
    revalidatePath('/', 'layout')

    return NextResponse.redirect(new URL('/login', request.url), {
        status: 302,
    })
}
