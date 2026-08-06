-- ============================================
-- FITFLOW - COMPLETE DATABASE SCHEMA (FIXED)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: coaches
-- ============================================
CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  instagram_username TEXT,
  instagram_user_id TEXT,
  instagram_access_token TEXT,
  instagram_token_expires_at TIMESTAMPTZ,
  profile_picture_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'elite')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  ai_response_mode TEXT DEFAULT 'auto' CHECK (ai_response_mode IN ('auto', 'manual', 'suggestions')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: leads
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  instagram_username TEXT NOT NULL,
  instagram_user_id TEXT,
  profile_picture_url TEXT,
  comment_text TEXT,
  post_id TEXT,
  post_caption TEXT,
  ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 10),
  ai_category TEXT CHECK (ai_category IN ('vip', 'standard', 'low')),
  ai_analysis JSONB,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'dm_sent', 'responded', 'converted', 'ignored')),
  dm_sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: conversations
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  instagram_conversation_id TEXT,
  last_message_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'converted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: messages
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('coach', 'lead', 'ai')),
  message_text TEXT NOT NULL,
  instagram_message_id TEXT,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  ai_confidence DECIMAL(3,2),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: instagram_comments
-- ============================================
CREATE TABLE IF NOT EXISTS instagram_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  instagram_comment_id TEXT UNIQUE NOT NULL,
  instagram_post_id TEXT NOT NULL,
  instagram_username TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  replied BOOLEAN DEFAULT FALSE,
  reply_text TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: message_templates
-- ============================================
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('vip', 'standard', 'low', 'followup')),
  template_text TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  usage_count INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: automations
-- ============================================
CREATE TABLE IF NOT EXISTS automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT CHECK (trigger_type IN ('new_comment', 'new_dm', 'score_threshold', 'time_based')),
  trigger_conditions JSONB,
  action_type TEXT CHECK (action_type IN ('send_dm', 'send_template', 'notify', 'tag_lead')),
  action_config JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: analytics_daily
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_comments INTEGER DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  vip_leads INTEGER DEFAULT 0,
  standard_leads INTEGER DEFAULT 0,
  low_leads INTEGER DEFAULT 0,
  dms_sent INTEGER DEFAULT 0,
  responses_received INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  estimated_revenue DECIMAL(10,2) DEFAULT 0.00,
  average_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coach_id, date)
);

-- ============================================
-- TABLE: waitlist
-- ============================================
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  instagram_handle TEXT,
  referral_source TEXT,
  interested_plan TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'converted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: instagram_posts
-- ============================================
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  instagram_post_id TEXT UNIQUE NOT NULL,
  caption TEXT,
  media_url TEXT,
  permalink TEXT,
  timestamp TIMESTAMPTZ,
  total_comments INTEGER DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  ai_performance_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: feedback (for support page)
-- ============================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('bug', 'feature', 'improvement', 'other')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: revenue_tracking
-- ============================================
CREATE TABLE IF NOT EXISTS revenue_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  source TEXT CHECK (source IN ('fitflow_auto', 'manual', 'external')),
  description TEXT,
  payment_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON coaches(user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_instagram_user_id ON coaches(instagram_user_id);
CREATE INDEX IF NOT EXISTS idx_leads_coach_id ON leads(coach_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_ai_category ON leads(ai_category);
CREATE INDEX IF NOT EXISTS idx_conversations_coach_id ON conversations(coach_id);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_instagram_comments_coach_id ON instagram_comments(coach_id);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_coach_date ON analytics_daily(coach_id, date);
CREATE INDEX IF NOT EXISTS idx_feedback_coach_id ON feedback(coach_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_revenue_tracking_coach_id ON revenue_tracking(coach_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_tracking ENABLE ROW LEVEL SECURITY;

-- Policies for coaches table
DROP POLICY IF EXISTS "Coaches can view own profile" ON coaches;
DROP POLICY IF EXISTS "Coaches can update own profile" ON coaches;
DROP POLICY IF EXISTS "Anyone can insert coach profile" ON coaches;

CREATE POLICY "Coaches can view own profile" ON coaches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Coaches can update own profile" ON coaches FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert coach profile" ON coaches FOR INSERT WITH CHECK (true);

-- Policies for leads table
DROP POLICY IF EXISTS "Coaches can view own leads" ON leads;
DROP POLICY IF EXISTS "Coaches can insert own leads" ON leads;
DROP POLICY IF EXISTS "Coaches can update own leads" ON leads;

CREATE POLICY "Coaches can view own leads" ON leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = leads.coach_id AND coaches.user_id = auth.uid())
);
CREATE POLICY "Coaches can insert own leads" ON leads FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = leads.coach_id AND coaches.user_id = auth.uid())
);
CREATE POLICY "Coaches can update own leads" ON leads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = leads.coach_id AND coaches.user_id = auth.uid())
);

-- Policies for conversations table
DROP POLICY IF EXISTS "Coaches can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Coaches can insert own conversations" ON conversations;
DROP POLICY IF EXISTS "Coaches can update own conversations" ON conversations;

CREATE POLICY "Coaches can view own conversations" ON conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = conversations.coach_id AND coaches.user_id = auth.uid())
);
CREATE POLICY "Coaches can insert own conversations" ON conversations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = conversations.coach_id AND coaches.user_id = auth.uid())
);
CREATE POLICY "Coaches can update own conversations" ON conversations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = conversations.coach_id AND coaches.user_id = auth.uid())
);

-- Policies for messages table
DROP POLICY IF EXISTS "Coaches can view own messages" ON messages;
DROP POLICY IF EXISTS "Coaches can insert messages" ON messages;

CREATE POLICY "Coaches can view own messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    JOIN coaches ON coaches.id = conversations.coach_id 
    WHERE conversations.id = messages.conversation_id AND coaches.user_id = auth.uid()
  )
);
CREATE POLICY "Coaches can insert messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations 
    JOIN coaches ON coaches.id = conversations.coach_id 
    WHERE conversations.id = messages.conversation_id AND coaches.user_id = auth.uid()
  )
);

-- Policies for instagram_comments
DROP POLICY IF EXISTS "Coaches can view own comments" ON instagram_comments;
DROP POLICY IF EXISTS "Coaches can insert own comments" ON instagram_comments;

CREATE POLICY "Coaches can view own comments" ON instagram_comments FOR SELECT USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = instagram_comments.coach_id AND coaches.user_id = auth.uid())
);
CREATE POLICY "Coaches can insert own comments" ON instagram_comments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = instagram_comments.coach_id AND coaches.user_id = auth.uid())
);

-- Policies for other tables
DROP POLICY IF EXISTS "Coaches can manage own templates" ON message_templates;
CREATE POLICY "Coaches can manage own templates" ON message_templates FOR ALL USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = message_templates.coach_id AND coaches.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Coaches can manage own automations" ON automations;
CREATE POLICY "Coaches can manage own automations" ON automations FOR ALL USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = automations.coach_id AND coaches.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Coaches can view own analytics" ON analytics_daily;
CREATE POLICY "Coaches can view own analytics" ON analytics_daily FOR SELECT USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = analytics_daily.coach_id AND coaches.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Coaches can view own posts" ON instagram_posts;
CREATE POLICY "Coaches can view own posts" ON instagram_posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = instagram_posts.coach_id AND coaches.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Coaches can manage own feedback" ON feedback;
CREATE POLICY "Coaches can manage own feedback" ON feedback FOR ALL USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = feedback.coach_id AND coaches.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Coaches can manage own revenue" ON revenue_tracking;
CREATE POLICY "Coaches can manage own revenue" ON revenue_tracking FOR ALL USING (
  EXISTS (SELECT 1 FROM coaches WHERE coaches.id = revenue_tracking.coach_id AND coaches.user_id = auth.uid())
);

-- Waitlist is public for inserts
DROP POLICY IF EXISTS "Anyone can join waitlist" ON waitlist;
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_coaches_updated_at ON coaches;
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_message_templates_updated_at ON message_templates;
CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_automations_updated_at ON automations;
CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feedback_updated_at ON feedback;
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
