import { createClient } from '@/utils/supabase/server'

export type SubscriptionTier = 'free' | 'pro'

export async function getUserSubscriptionTier(userId: string): Promise<SubscriptionTier> {
    const supabase = await createClient()

    // This is a placeholder for actual Subscription logic
    // In a real app we would check a 'subscriptions' table
    // const { data } = await supabase.from('subscriptions').select('tier').eq('user_id', userId).single()

    return 'free'
}
