-- ============================================
-- FITFLOW - ROW LEVEL SECURITY (RLS) POLICIES
-- Chaque coach ne voit QUE ses propres données
-- Version: 1.0
-- Date: 2026-02-11
-- ============================================

-- ============================================
-- 1. ACTIVER RLS SUR TOUTES LES TABLES
-- ============================================

ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLICIES POUR TABLE COACHES
-- ============================================

CREATE POLICY "Coaches can view their own profile"
  ON public.coaches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can update their own profile"
  ON public.coaches FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow insert for authenticated users"
  ON public.coaches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. POLICIES POUR TABLE LEADS
-- ============================================

CREATE POLICY "Coaches can view their own leads"
  ON public.leads FOR SELECT
  USING (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

CREATE POLICY "Coaches can insert their own leads"
  ON public.leads FOR INSERT
  WITH CHECK (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

CREATE POLICY "Coaches can update their own leads"
  ON public.leads FOR UPDATE
  USING (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

CREATE POLICY "Coaches can delete their own leads"
  ON public.leads FOR DELETE
  USING (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

-- ============================================
-- 4. POLICIES POUR TABLE POSTS
-- ============================================

CREATE POLICY "Coaches can view their own posts"
  ON public.posts FOR SELECT
  USING (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

CREATE POLICY "Coaches can insert their own posts"
  ON public.posts FOR INSERT
  WITH CHECK (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

CREATE POLICY "Coaches can update their own posts"
  ON public.posts FOR UPDATE
  USING (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()))
  WITH CHECK (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

-- ============================================
-- 5. POLICIES POUR TABLE DAILY_STATS
-- ============================================

CREATE POLICY "Coaches can view their own daily stats"
  ON public.daily_stats FOR SELECT
  USING (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

-- ============================================
-- 6. POLICIES POUR TABLE SUBSCRIPTIONS
-- ============================================

CREATE POLICY "Coaches can view their own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (coach_id IN (SELECT id FROM public.coaches WHERE user_id = auth.uid()));

-- ============================================
-- 7. FUNCTION WEBHOOK POUR MAKE.COM
-- ============================================

CREATE OR REPLACE FUNCTION public.insert_lead_from_webhook(
  p_webhook_token TEXT,
  p_username TEXT,
  p_comment TEXT,
  p_post_url TEXT,
  p_instagram_post_id TEXT,
  p_ai_score INTEGER,
  p_ai_reason TEXT,
  p_category TEXT,
  p_suggested_reply TEXT,
  p_manychat_subscriber_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_coach_id UUID;
  v_lead_id UUID;
BEGIN
  -- Vérifier le token et récupérer le coach_id
  SELECT id INTO v_coach_id
  FROM public.coaches
  WHERE webhook_token = p_webhook_token;
  
  IF v_coach_id IS NULL THEN
    RAISE EXCEPTION 'Invalid webhook token';
  END IF;
  
  -- Créer ou récupérer le post
  INSERT INTO public.posts (coach_id, instagram_post_id, post_url, post_type)
  VALUES (v_coach_id, p_instagram_post_id, p_post_url, 'image')
  ON CONFLICT (instagram_post_id) DO UPDATE SET updated_at = NOW();
  
  -- Créer le lead
  INSERT INTO public.leads (
    coach_id, username, comment, post_url, instagram_post_id,
    ai_score, ai_reason, category, suggested_reply,
    manychat_subscriber_id, status
  )
  VALUES (
    v_coach_id, p_username, p_comment, p_post_url, p_instagram_post_id,
    p_ai_score, p_ai_reason, p_category, p_suggested_reply,
    p_manychat_subscriber_id, 'new'
  )
  RETURNING id INTO v_lead_id;
  
  RETURN v_lead_id;
END;
$$;

-- ============================================
-- 8. FUNCTION GÉNÉRATION WEBHOOK TOKEN
-- ============================================

CREATE OR REPLACE FUNCTION public.generate_webhook_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$;

-- ============================================
-- 9. GRANT PERMISSIONS
-- ============================================

GRANT SELECT, INSERT, UPDATE ON public.coaches TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.posts TO authenticated;
GRANT SELECT ON public.daily_stats TO authenticated;
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_lead_from_webhook TO anon, authenticated;
