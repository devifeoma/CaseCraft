'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

// Helper to create server client inside actions
async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

export async function generateCaseStudyCopy(goal: string, constraints: string, outcome: string) {
  // 1. In a real app, this would call OpenAI or Gemini via their respective SDKs.
  // Example for OpenAI:
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4o',
  //   messages: [{
  //     role: 'system', 
  //     content: `You are an expert UX copywriter framing a case study.Given the core Goal: ${ goal }, Constraints: ${ constraints }, and Outcome: ${ outcome }, generate a professional 300 - word introduction section outlining the problem and proposed solution.`
  //   }]
  // })

  // 2. We resolve the fake wait time:
  await new Promise((resolve) => setTimeout(resolve, 2500))

  // 3. Fake Response:
  const generatedCopy = `
## The Challenge
The primary goal was to ** ${goal.toLowerCase()}**.However, we were faced with several significant limitations, chiefly: ${constraints}. 

This meant the standard approaches wouldn't work. We had to rethink the core interaction paradigm to ensure a seamless experience that balanced both usability and technical guardrails.

## Our Approach
To tackle this, we initiated a comprehensive review of the user journey.By focusing on the critical path, we designed a streamlined flow that abstracted the underlying complexity away from the user.We relied heavily on progressive disclosure and contextual cues.

The result was a robust system that not only met the constraints but also elevated the overall aesthetic—lean, functional, and highly polished.

## The Outcome
Ultimately, the project was a resounding success. ** ${outcome}**.This validated our hypothesis that a constraint - driven design approach often yields the most innovative, user - centric solutions.
  `.trim()

  return { copy: generatedCopy }
}

export async function saveProjectSections(projectId: string, sections: any[]) {
  // Bypass DB operation for demo routes
  if (projectId.includes('demo') || projectId.includes('mock')) return { success: true }

  const supabase = await getSupabase()

  // Check Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  // Very basic wipe & replace for auto-save (In a prod app, you'd upsert by ID)
  const { error: deleteError } = await supabase
    .from('sections')
    .delete()
    .eq('project_id', projectId)

  if (deleteError) {
    throw new Error("Failed to clear old sections: " + deleteError.message)
  }

  if (sections.length === 0) return { success: true }

  // Insert new sorted array
  const { error: insertError } = await supabase
    .from('sections')
    .insert(
      sections.map((sec, index) => ({
        project_id: projectId,
        type: sec.type,
        content: sec.content,
        sort_order: index
      }))
    )

  if (insertError) {
    throw new Error("Failed to save sections: " + insertError.message)
  }

  return { success: true }
}

export async function publishProject(projectId: string, password?: string) {
  // Bypass DB operation for demo routes
  if (projectId.includes('demo') || projectId.includes('mock')) return { success: true }

  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  let passwordHash = null

  if (password && password.trim() !== '') {
    // Check if user is Pro
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .single()

    if (subscription?.tier !== 'pro') {
      throw new Error("Password protection is a Pro feature. Please upgrade your account.")
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10)
    passwordHash = await bcrypt.hash(password, salt)
  }

  const { error } = await supabase
    .from('projects')
    .update({
      is_published: true,
      password_hash: passwordHash
    })
    .eq('id', projectId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error("Failed to publish project")
  }

  return { success: true }
}

export async function checkIsPro() {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', user.id)
    .single()

  return subscription?.tier === 'pro'
}
