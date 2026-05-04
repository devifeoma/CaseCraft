import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { plan, interval } = await req.json();

        if (!process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({ error: 'Stripe keys are not configured. Please set them in .env.local' }, { status: 500 });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-02-24.acacia',
        });

        // 1. Get user from supabase
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                        } catch {}
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get or create Stripe customer
        const { data: subscription } = await supabase.from('subscriptions').select('stripe_customer_id').eq('user_id', user.id).single();
        let customerId = subscription?.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabase_user_id: user.id,
                }
            });
            customerId = customer.id;
            
            // Insert initial subscription record if it doesn't exist
            await supabase.from('subscriptions').upsert({
               user_id: user.id,
               stripe_customer_id: customerId,
               tier: 'free'
            }, { onConflict: 'user_id' });
        }

        // Determine price ID
        const priceId = interval === 'year' 
            ? process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID 
            : process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID;

        if (!priceId) {
            return NextResponse.json({ error: 'Stripe Price IDs are not configured. Please set them in .env.local' }, { status: 500 });
        }

        // 3. Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/#pricing`,
            metadata: {
                supabase_user_id: user.id,
            }
        });

        return NextResponse.json({ url: session.url });

    } catch (err: any) {
        console.error('Stripe checkout error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
