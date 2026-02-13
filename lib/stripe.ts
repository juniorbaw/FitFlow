import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const STRIPE_PLANS = {
  STARTER: {
    productId: process.env.STRIPE_PRODUCT_STARTER || 'prod_TyPu3MklJdRMpw',
    name: 'Starter',
    price: 47,
    currency: 'EUR',
    features: [
      '100 leads/mois',
      'Scoring IA basique',
      'Flows ManyChat standard',
      'Dashboard analytics',
      'Support email',
    ],
  },
  PRO: {
    productId: process.env.STRIPE_PRODUCT_PRO || 'prod_TyQ2uyeVIWNanX',
    name: 'Pro',
    price: 97,
    currency: 'EUR',
    features: [
      'Leads illimités',
      'Scoring IA avancé',
      'Flows ManyChat premium',
      'Dashboard analytics avancé',
      'Automatisation complète',
      'Support prioritaire',
      'Intégration Instagram API',
    ],
  },
} as const

export type PlanType = keyof typeof STRIPE_PLANS
