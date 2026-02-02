-- Add Instagram and integration fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_access_token TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_business_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_connected BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS instagram_token_expires TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ghl_api_key TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ghl_location_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_dm_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS daily_dm_limit INTEGER DEFAULT 30;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auto_send_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'starter';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add GHL fields to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ghl_contact_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ghl_opportunity_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ghl_sync_status TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_ghl_message_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS comment_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS post_url TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS reasoning TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS dm_suggested TEXT;

-- Create subscriptions table if not exists
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT DEFAULT 'active',
  amount INTEGER,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);
CREATE INDEX IF NOT EXISTS idx_leads_comment_id ON leads(comment_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);

-- Enable RLS on subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');
