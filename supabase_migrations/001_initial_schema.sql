-- ============================================
-- FITFLOW - SCHÉMA SUPABASE COMPLET
-- Version: 1.0
-- Date: 2026-02-11
-- ============================================

-- ============================================
-- 1. TABLE COACHES (utilisateurs coachs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  
  -- Instagram & Meta
  instagram_username TEXT,
  instagram_id TEXT,
  facebook_page_id TEXT,
  access_token TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Plan & Subscription
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'agency')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due')),
  
  -- Intégrations
  manychat_api_key TEXT,
  webhook_url TEXT,
  webhook_token TEXT,
  
  -- Configuration
  business_name TEXT,
  niche TEXT,
  message_style TEXT,
  auto_send_enabled BOOLEAN DEFAULT false,
  daily_dm_limit INTEGER DEFAULT 50,
  daily_dm_count INTEGER DEFAULT 0,
  
  -- Onboarding
  onboarding_complete BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON public.coaches(user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_email ON public.coaches(email);
CREATE INDEX IF NOT EXISTS idx_coaches_webhook_token ON public.coaches(webhook_token);

-- ============================================
-- 2. TABLE LEADS (leads générés)
-- ============================================
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  
  username TEXT NOT NULL,
  comment TEXT NOT NULL,
  post_url TEXT,
  instagram_post_id TEXT,
  
  ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 10),
  ai_reason TEXT,
  category TEXT CHECK (category IN ('vip', 'standard', 'low')),
  suggested_reply TEXT,
  
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'dm_sent', 'replied', 'converted', 'lost')),
  revenue DECIMAL(10, 2) DEFAULT 0,
  conversion_date TIMESTAMPTZ,
  
  manychat_subscriber_id TEXT,
  dm_sent_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_coach_id ON public.leads(coach_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_category ON public.leads(category);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- ============================================
-- 3. TABLE POSTS (posts Instagram trackés)
-- ============================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  
  instagram_post_id TEXT UNIQUE NOT NULL,
  post_url TEXT NOT NULL,
  caption TEXT,
  post_type TEXT CHECK (post_type IN ('image', 'video', 'reel', 'carousel')),
  
  total_leads INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  avg_score DECIMAL(3, 1),
  
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_coach_id ON public.posts(coach_id);
CREATE INDEX IF NOT EXISTS idx_posts_instagram_id ON public.posts(instagram_post_id);

-- ============================================
-- 4. TABLE DAILY_STATS (statistiques quotidiennes)
-- ============================================
CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  total_leads INTEGER DEFAULT 0,
  vip_leads INTEGER DEFAULT 0,
  standard_leads INTEGER DEFAULT 0,
  low_leads INTEGER DEFAULT 0,
  
  dms_sent INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  revenue DECIMAL(10, 2) DEFAULT 0,
  avg_score DECIMAL(3, 1),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(coach_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_coach_id ON public.daily_stats(coach_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_stats(date DESC);

-- ============================================
-- 5. TABLE SUBSCRIPTIONS (abonnements Stripe)
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
  
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'agency')),
  billing_period TEXT CHECK (billing_period IN ('monthly', 'annual')),
  amount DECIMAL(10, 2) NOT NULL,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_coach_id ON public.subscriptions(coach_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON public.coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at BEFORE UPDATE ON public.daily_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
