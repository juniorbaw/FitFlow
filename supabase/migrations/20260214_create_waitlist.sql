-- ============================================
-- FITFLOW - Table Waitlist pour Leads Pré-Inscription
-- ============================================

CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'demo-video-page',
  video_completion INTEGER DEFAULT 0,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  is_converted BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_is_converted ON public.waitlist(is_converted);

-- RLS (Row Level Security)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut s'inscrire
CREATE POLICY "Anyone can insert into waitlist"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Les utilisateurs authentifiés peuvent voir leur propre entrée
CREATE POLICY "Users can view own waitlist entry"
  ON public.waitlist
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM auth.users WHERE email = waitlist.email
  ));

-- Policy: Service role peut tout voir (pour admin/analytics)
CREATE POLICY "Service role has full access"
  ON public.waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fonction pour auto-convertir quand user s'inscrit
CREATE OR REPLACE FUNCTION public.mark_waitlist_converted()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.waitlist
  SET 
    is_converted = TRUE,
    converted_at = NOW(),
    user_id = NEW.id
  WHERE email = NEW.email
    AND is_converted = FALSE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur création de user
DROP TRIGGER IF EXISTS on_user_created_mark_waitlist ON auth.users;
CREATE TRIGGER on_user_created_mark_waitlist
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.mark_waitlist_converted();

-- Vues utiles pour analytics
CREATE OR REPLACE VIEW public.waitlist_stats AS
SELECT 
  DATE(created_at) as date,
  source,
  COUNT(*) as total_signups,
  COUNT(CASE WHEN is_converted THEN 1 END) as conversions,
  ROUND(100.0 * COUNT(CASE WHEN is_converted THEN 1 END) / NULLIF(COUNT(*), 0), 2) as conversion_rate,
  AVG(video_completion) as avg_video_completion
FROM public.waitlist
GROUP BY DATE(created_at), source
ORDER BY date DESC, total_signups DESC;

COMMENT ON TABLE public.waitlist IS 'Liste d''attente pour leads pré-inscription FitFlow';
COMMENT ON COLUMN public.waitlist.video_completion IS 'Pourcentage de vidéo regardée (0-100)';
COMMENT ON COLUMN public.waitlist.source IS 'Page source du lead (demo-video-page, landing, etc)';
