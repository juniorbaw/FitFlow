/**
 * ============================================
 * FITFLOW - Configuration Centralisée
 * ============================================
 * 
 * Toutes les URLs et configurations importantes en un seul endroit.
 * Plus de hardcoding d'URLs partout dans le code !
 */

// ── URLs de l'application ──
export const APP_CONFIG = {
  // URL de base (production ou dev)
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://fit-flow-gamma.vercel.app',
  
  // URLs spécifiques
  urls: {
    home: '/',
    signup: '/signup',
    login: '/login',
    dashboard: '/dashboard',
    pricing: '/pricing',
    demo: '/demo-video',
    settings: '/settings',
    onboarding: '/onboarding',
  },
  
  // Callback URLs pour OAuth
  callbacks: {
    instagram: () => `${APP_CONFIG.APP_URL}/api/auth/instagram/callback`,
    stripe: {
      success: (plan: string) => `${APP_CONFIG.APP_URL}/dashboard?checkout=success&plan=${plan}`,
      cancel: () => `${APP_CONFIG.APP_URL}/pricing?checkout=canceled`,
    },
    auth: () => `${APP_CONFIG.APP_URL}/api/auth/callback`,
  },
  
  // Webhooks
  webhooks: {
    instagram: () => `${APP_CONFIG.APP_URL}/api/webhook/instagram`,
    stripe: () => `${APP_CONFIG.APP_URL}/api/webhook/stripe`,
    lead: () => `${APP_CONFIG.APP_URL}/api/webhook/lead`,
  },
  
  // API routes internes
  api: {
    instagram: {
      connect: () => `${APP_CONFIG.APP_URL}/api/instagram/connect`,
      comments: (userId: string) => `${APP_CONFIG.APP_URL}/api/instagram/comments?user_id=${userId}`,
    },
    ai: {
      analyze: () => `${APP_CONFIG.APP_URL}/api/ai/analyze`,
    },
    auth: {
      deletion: (id?: string) => id 
        ? `${APP_CONFIG.APP_URL}/api/auth/deletion?id=${id}`
        : `${APP_CONFIG.APP_URL}/api/auth/deletion`,
      deauthorize: () => `${APP_CONFIG.APP_URL}/api/auth/deauthorize`,
    },
  },
} as const

// ── Instagram Configuration ──
export const INSTAGRAM_CONFIG = {
  APP_ID: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || '',
  APP_SECRET: process.env.INSTAGRAM_APP_SECRET || '',
  WEBHOOK_VERIFY_TOKEN: process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || '',
  
  // Scopes requis
  scopes: [
    'instagram_basic',
    'instagram_manage_comments',
    'instagram_manage_messages',
    'pages_show_list',
    'pages_read_engagement',
  ],
  
  // Graph API
  graphAPI: {
    version: 'v21.0',
    baseUrl: 'https://graph.facebook.com/v21.0',
  },
} as const

// ── Supabase Configuration ──
export const SUPABASE_CONFIG = {
  URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
} as const

// ── Stripe Configuration ──
export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  
  prices: {
    starter: process.env.STRIPE_PRICE_STARTER || '',
    pro: process.env.STRIPE_PRICE_PRO || '',
    elite: process.env.STRIPE_PRICE_ELITE || '',
  },
} as const

// ── Gemini AI Configuration ──
export const AI_CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  model: 'gemini-2.0-flash-exp',
} as const

// ── Plans Tarifaires ──
export const PRICING_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 47,
    currency: 'EUR',
    interval: 'mois',
    features: [
      'Automatisation Instagram',
      'IA Gemini avancée',
      'Lead scoring 1-10',
      '500 DMs/mois',
      'Dashboard analytics',
      'Support email',
    ],
    stripePriceId: STRIPE_CONFIG.prices.starter,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 97,
    currency: 'EUR',
    interval: 'mois',
    features: [
      'Tout du Starter +',
      'DMs illimités',
      'Templates IA custom',
      'Multi-comptes Instagram',
      'Webhooks personnalisés',
      'Support prioritaire',
    ],
    stripePriceId: STRIPE_CONFIG.prices.pro,
    popular: true,
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 197,
    currency: 'EUR',
    interval: 'mois',
    features: [
      'Tout du Pro +',
      'White-label complet',
      'API access',
      'Analytics avancés',
      'Onboarding dédié',
      'Support 24/7',
    ],
    stripePriceId: STRIPE_CONFIG.prices.elite,
  },
} as const

// ── Validation de la configuration ──
export function validateConfig() {
  const errors: string[] = []
  
  if (!APP_CONFIG.APP_URL.startsWith('http')) {
    errors.push('NEXT_PUBLIC_APP_URL doit commencer par http:// ou https://')
  }
  
  if (!INSTAGRAM_CONFIG.APP_ID) {
    errors.push('NEXT_PUBLIC_INSTAGRAM_APP_ID est requis')
  }
  
  if (!SUPABASE_CONFIG.URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL est requis')
  }
  
  if (!SUPABASE_CONFIG.ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY est requis')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ── Helpers ──
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Client-side
    return window.location.origin
  }
  
  // Server-side
  return APP_CONFIG.APP_URL
}

export function isDev() {
  return process.env.NODE_ENV === 'development'
}

export function isProd() {
  return process.env.NODE_ENV === 'production'
}

// ── Export default pour usage simple ──
export default APP_CONFIG
