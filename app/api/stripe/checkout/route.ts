import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-01-28.clover',
});

const PRICE_IDS = {
  starter: process.env.STRIPE_PRODUCT_STARTER || process.env.STRIPE_PRICE_STARTER || 'prod_TyPu3MklJdRMpw',
  pro: process.env.STRIPE_PRODUCT_PRO || process.env.STRIPE_PRICE_PRO || 'prod_TyQ2uyeVIWNanX',
};

export async function POST(request: NextRequest) {
  try {
    const { plan, user_id, email } = await request.json();

    if (!plan || !user_id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];

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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success&plan=${plan}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=canceled`,
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
