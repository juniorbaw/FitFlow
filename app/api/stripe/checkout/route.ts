import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { APP_CONFIG, STRIPE_CONFIG } from '@/lib/config';

const stripe = new Stripe(STRIPE_CONFIG.SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(request: NextRequest) {
  try {
    const { plan, user_id, email } = await request.json();

    if (!plan || !user_id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const priceId = STRIPE_CONFIG.prices[plan as keyof typeof STRIPE_CONFIG.prices];

    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: APP_CONFIG.callbacks.stripe.success(plan),
      cancel_url: APP_CONFIG.callbacks.stripe.cancel(),
      customer_email: email,
      metadata: {
        user_id,
        plan,
      },
      subscription_data: {
        trial_period_days: plan === 'starter' ? 7 : 14, // 14 jours pour Pro/Elite
        metadata: {
          user_id,
          plan,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
