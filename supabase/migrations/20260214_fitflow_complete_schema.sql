-- ================================================
-- FITFLOW - SCHÉMA COMPLET SUPABASE
-- ================================================
-- Ce script crée toutes les tables nécessaires pour FitFlow
-- Exécutez-le dans le SQL Editor de Supabase
-- ================================================

-- 1. Table des coachs (utilisateurs)
CREATE TABLE IF NOT EXISTS public.coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  instagram_username TEXT,
  instagram_user_id TEXT UNIQUE,
  instagram_access_token TEXT,
  instagram_token_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'free', -- free, starter, pro, elite
  subscription_plan TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table des leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
  instagram_username TEXT NOT NULL,
  instagram_user_id TEXT,
  full_name TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  followers_count INTEGER,
  engagement_rate DECIMAL(5,2),
  
  -- Lead scoring
  lead_score INTEGER CHECK (lead_score >= 0 AND lead_score <= 10),
  lead_quality TEXT, -- hot, warm, cold
  
  -- Informations de contact
  email TEXT,
  phone TEXT,
  location TEXT,
  
  -- Statut
  status TEXT DEFAULT 'new', -- new, contacted, qualified, converted, lost
  last_interaction_at TIMESTAMPTZ,
  
  -- Tracking
  source TEXT, -- comment, dm, mention, story
  first_message TEXT,
  notes TEXT,
  tags TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des conversations (DM Instagram)
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  instagram_thread_id TEXT UNIQUE,
  last_message_at TIMESTAMPTZ,
  unread_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, archived, closed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table des messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  instagram_message_id TEXT UNIQUE,
  sender_type TEXT NOT NULL, -- coach, lead
  message_text TEXT,
  message_type TEXT, -- text, image, video, audio, story_reply
  media_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table des commentaires Instagram
CREATE TABLE IF NOT EXISTS public.instagram_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  instagram_comment_id TEXT UNIQUE NOT NULL,
  instagram_post_id TEXT NOT NULL,
  post_caption TEXT,
  comment_text TEXT NOT NULL,
  parent_comment_id TEXT,
  is_replied BOOLEAN DEFAULT FALSE,
  reply_text TEXT,
  replied_at TIMESTAMPTZ,
  ai_analysis JSONB, -- Résultat de l'analyse IA
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table des templates de messages
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT, -- welcome, followup, objection, closing
  template_text TEXT NOT NULL,
  variables JSONB, -- {name}, {goal}, etc.
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table des automations
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL, -- comment, dm, mention, score
  trigger_conditions JSONB,
  action_type TEXT NOT NULL, -- send_dm, send_email, add_tag, update_score
  action_config JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  runs_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Table des analytics
CREATE TABLE IF NOT EXISTS public.analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Métriques leads
  new_leads INTEGER DEFAULT 0,
  hot_leads INTEGER DEFAULT 0,
  warm_leads INTEGER DEFAULT 0,
  cold_leads INTEGER DEFAULT 0,
  
  -- Métriques conversations
  messages_sent INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  conversations_started INTEGER DEFAULT 0,
  
  -- Métriques conversions
  qualified_leads INTEGER DEFAULT 0,
  converted_leads INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coach_id, date)
);

-- 9. Table waitlist (pour la landing page)
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  instagram_username TEXT,
  business_type TEXT, -- coach_fitness, coach_nutrition, personal_trainer
  current_client_count INTEGER,
  source TEXT, -- landing_page, demo_video, referral
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'pending', -- pending, invited, converted
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Table des posts Instagram (pour analyse)
CREATE TABLE IF NOT EXISTS public.instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE,
  instagram_post_id TEXT UNIQUE NOT NULL,
  caption TEXT,
  media_type TEXT, -- image, video, carousel
  media_url TEXT,
  permalink TEXT,
  like_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2),
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES POUR PERFORMANCE
-- ================================================

CREATE INDEX IF NOT EXISTS idx_leads_coach_id ON public.leads(coach_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_coach_id ON public.conversations(coach_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_comments_coach_id ON public.instagram_comments(coach_id);
CREATE INDEX IF NOT EXISTS idx_analytics_coach_date ON public.analytics_daily(coach_id, date DESC);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Policies pour coaches (accès à leurs propres données)
CREATE POLICY "Coaches can view own data" ON public.coaches
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Coaches can update own data" ON public.coaches
  FOR UPDATE USING (auth.uid() = id);

-- Policies pour leads
CREATE POLICY "Coaches can view own leads" ON public.leads
  FOR ALL USING (coach_id = auth.uid());

-- Policies pour conversations
CREATE POLICY "Coaches can view own conversations" ON public.conversations
  FOR ALL USING (coach_id = auth.uid());

-- Policies pour messages
CREATE POLICY "Coaches can view own messages" ON public.messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE coach_id = auth.uid()
    )
  );

-- Policies pour comments
CREATE POLICY "Coaches can view own comments" ON public.instagram_comments
  FOR ALL USING (coach_id = auth.uid());

-- Policies pour templates
CREATE POLICY "Coaches can manage own templates" ON public.message_templates
  FOR ALL USING (coach_id = auth.uid());

-- Policies pour automations
CREATE POLICY "Coaches can manage own automations" ON public.automations
  FOR ALL USING (coach_id = auth.uid());

-- Policies pour analytics
CREATE POLICY "Coaches can view own analytics" ON public.analytics_daily
  FOR SELECT USING (coach_id = auth.uid());

-- Policies pour posts
CREATE POLICY "Coaches can view own posts" ON public.instagram_posts
  FOR ALL USING (coach_id = auth.uid());

-- Waitlist publique (INSERT only)
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (true);

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON public.coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON public.automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ================================================

-- Décommentez pour créer un coach de test
/*
INSERT INTO public.coaches (email, full_name, instagram_username, subscription_status, onboarding_completed)
VALUES ('demo@fitflow.com', 'Coach Demo', 'coach_demo', 'pro', true)
ON CONFLICT (email) DO NOTHING;
*/

-- ================================================
-- FIN DU SCRIPT
-- ================================================

-- Vérification que tout a bien été créé
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'coaches', 'leads', 'conversations', 'messages', 
    'instagram_comments', 'message_templates', 'automations',
    'analytics_daily', 'waitlist', 'instagram_posts'
  )
ORDER BY table_name;
