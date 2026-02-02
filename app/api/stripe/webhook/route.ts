import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-01-28.clover',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;

        if (userId && plan) {
          // Create subscription record
          await supabase.from('subscriptions').insert({
            user_id: userId,
            plan: plan,
            stripe_subscription_id: session.subscription as string,
            status: 'active',
            amount: plan === 'starter' ? 199 : plan === 'pro' ? 499 : 999,
          });

          // Update user tier
          await supabase
            .from('profiles')
            .update({
              subscription_tier: plan,
              stripe_customer_id: session.customer as string,
              auto_send_enabled: plan !== 'starter',
              daily_dm_limit: plan === 'starter' ? 0 : plan === 'pro' ? 30 : 50,
            })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);

        // Downgrade to starter
        const { data } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (data?.user_id) {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'starter',
              auto_send_enabled: false,
              daily_dm_limit: 0,
            })
            .eq('id', data.user_id);
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as any;
        
        if (invoice.subscription && typeof invoice.subscription === 'string') {
          await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              current_period_end: new Date((invoice.lines.data[0]?.period?.end || 0) * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', invoice.subscription);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}
