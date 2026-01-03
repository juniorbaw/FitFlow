-- ═══════════════════════════════════════════════════════════════
-- SCHEMA SUPABASE POUR CLIENTWIN
-- ═══════════════════════════════════════════════════════════════

-- Table pour stocker les tokens Instagram des utilisateurs
CREATE TABLE IF NOT EXISTS instagram_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instagram_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Un utilisateur ne peut avoir qu'un seul compte Instagram connecté
  UNIQUE(user_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_instagram_accounts_user_id ON instagram_accounts(user_id);

-- ═══════════════════════════════════════════════════════════════

-- Table pour logger les messages Instagram envoyés
CREATE TABLE IF NOT EXISTS instagram_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Métadonnées optionnelles
  comment_id TEXT,
  media_id TEXT,
  campaign_id UUID
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_instagram_messages_user_id ON instagram_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_messages_sent_at ON instagram_messages(sent_at);

-- ═══════════════════════════════════════════════════════════════

-- Table pour les campagnes d'automatisation
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  message_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(is_active);

-- ═══════════════════════════════════════════════════════════════

-- Table pour tracker les commentaires traités
CREATE TABLE IF NOT EXISTS processed_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id TEXT NOT NULL,
  media_id TEXT NOT NULL,
  commenter_username TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  dm_sent BOOLEAN DEFAULT false,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,

  -- Un commentaire ne doit être traité qu'une seule fois
  UNIQUE(comment_id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_processed_comments_user_id ON processed_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_processed_comments_processed_at ON processed_comments(processed_at);

-- ═══════════════════════════════════════════════════════════════

-- RLS (Row Level Security) - Sécurité au niveau des lignes
-- Les utilisateurs ne peuvent voir que leurs propres données

ALTER TABLE instagram_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_comments ENABLE ROW LEVEL SECURITY;

-- Policies pour instagram_accounts
CREATE POLICY "Users can view their own Instagram accounts"
  ON instagram_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Instagram accounts"
  ON instagram_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Instagram accounts"
  ON instagram_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Instagram accounts"
  ON instagram_accounts FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour instagram_messages
CREATE POLICY "Users can view their own messages"
  ON instagram_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON instagram_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies pour campaigns
CREATE POLICY "Users can view their own campaigns"
  ON campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own campaigns"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON campaigns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- Policies pour processed_comments
CREATE POLICY "Users can view their own processed comments"
  ON processed_comments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own processed comments"
  ON processed_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_instagram_accounts_updated_at
  BEFORE UPDATE ON instagram_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
