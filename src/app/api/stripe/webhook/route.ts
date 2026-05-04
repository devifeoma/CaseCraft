import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Stripe keys not configured' }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-02-24.acacia',
    });

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // We need the service role key to bypass RLS and update the subscriptions table
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                
                // If this is a subscription checkout, update the user tier
                if (session.mode === 'subscription' && session.subscription) {
                    const customerId = session.customer as string;
                    const subscriptionId = session.subscription as string;
                    const userId = session.metadata?.supabase_user_id;

                    if (userId) {
                        await supabaseAdmin.from('subscriptions').upsert({
                            user_id: userId,
                            stripe_customer_id: customerId,
                            stripe_subscription_id: subscriptionId,
                            tier: 'pro',
                            updated_at: new Date().toISOString()
                        }, { onConflict: 'user_id' });
                    }
                }
                break;
            }
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const status = subscription.status;

                // Only 'active' and 'trialing' mean they have paid access
                const tier = (status === 'active' || status === 'trialing') ? 'pro' : 'free';

                await supabaseAdmin
                    .from('subscriptions')
                    .update({ 
                        tier, 
                        stripe_subscription_id: subscription.id,
                        updated_at: new Date().toISOString()
                    })
                    .eq('stripe_customer_id', customerId);
                
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error('Error processing webhook:', err);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
