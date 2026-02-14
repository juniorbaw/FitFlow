# 🔧 FIX - Erreur 404 Table "coaches" Supabase

## ❌ ERREUR

```
lryjyzqrhtepsvqlzzdy.supabase.co/rest/v1/coaches:1 
Failed to load resource: the server responded with a status of 404
```

## 🔍 CAUSE

La table `coaches` n'existe pas dans votre base de données Supabase.

---

## ✅ SOLUTION - Créer les tables manquantes

### ÉTAPE 1 : Vérifier les tables existantes

1. **Aller sur Supabase SQL Editor**
   ```
   https://lryjyzqrhtepsvqlzzdy.supabase.co/project/_/sql
   ```

2. **Exécuter cette requête :**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

3. **Vérifier si ces tables existent :**
   - `coaches`
   - `leads`
   - `posts`
   - `daily_stats`
   - `subscriptions`

---

### ÉTAPE 2 : Créer la table coaches

**Copier-coller ce SQL dans Supabase SQL Editor :**

```sql
-- Table: coaches
CREATE TABLE IF NOT EXISTS public.coaches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  instagram_username VARCHAR(100),
  instagram_id VARCHAR(100),
  access_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'trial',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  webhook_url TEXT,
  manychat_api_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON public.coaches(user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_instagram_id ON public.coaches(instagram_id);
CREATE INDEX IF NOT EXISTS idx_coaches_stripe_customer_id ON public.coaches(stripe_customer_id);

-- RLS (Row Level Security)
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own coach profile
CREATE POLICY "Users can view own coach profile"
  ON public.coaches
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own coach profile
CREATE POLICY "Users can insert own coach profile"
  ON public.coaches
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own coach profile
CREATE POLICY "Users can update own coach profile"
  ON public.coaches
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Cliquer RUN** ✅

---

### ÉTAPE 3 : Créer la table leads

```sql
-- Table: leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE NOT NULL,
  instagram_username VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  source VARCHAR(50) DEFAULT 'instagram_comment',
  status VARCHAR(50) DEFAULT 'new',
  ai_score INTEGER DEFAULT 5,
  comment_text TEXT,
  dm_sent BOOLEAN DEFAULT FALSE,
  dm_sent_at TIMESTAMP WITH TIME ZONE,
  converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMP WITH TIME ZONE,
  revenue DECIMAL(10,2) DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_leads_coach_id ON public.leads(coach_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON public.leads(ai_score);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Coaches can view their own leads
CREATE POLICY "Coaches can view own leads"
  ON public.leads
  FOR SELECT
  USING (
    coach_id IN (
      SELECT id FROM public.coaches WHERE user_id = auth.uid()
    )
  );

-- Policy: Allow webhook to insert leads (service role)
CREATE POLICY "Service role can insert leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Coaches can update their own leads
CREATE POLICY "Coaches can update own leads"
  ON public.leads
  FOR UPDATE
  USING (
    coach_id IN (
      SELECT id FROM public.coaches WHERE user_id = auth.uid()
    )
  );
```

**Cliquer RUN** ✅

---

### ÉTAPE 4 : Créer la table posts

```sql
-- Table: posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  post_url TEXT,
  post_type VARCHAR(50) DEFAULT 'image',
  total_leads INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  avg_score DECIMAL(3,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coach_id, post_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_posts_coach_id ON public.posts(coach_id);
CREATE INDEX IF NOT EXISTS idx_posts_post_id ON public.posts(post_id);

-- RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Coaches can view own posts"
  ON public.posts
  FOR SELECT
  USING (
    coach_id IN (
      SELECT id FROM public.coaches WHERE user_id = auth.uid()
    )
  );
```

**Cliquer RUN** ✅

---

### ÉTAPE 5 : Créer la table daily_stats

```sql
-- Table: daily_stats
CREATE TABLE IF NOT EXISTS public.daily_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_leads INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  vip_leads INTEGER DEFAULT 0,
  dms_sent INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coach_id, date)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_daily_stats_coach_id ON public.daily_stats(coach_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON public.daily_stats(date);

-- RLS
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Coaches can view own daily stats"
  ON public.daily_stats
  FOR SELECT
  USING (
    coach_id IN (
      SELECT id FROM public.coaches WHERE user_id = auth.uid()
    )
  );
```

**Cliquer RUN** ✅

---

### ÉTAPE 6 : Créer la table subscriptions

```sql
-- Table: subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID REFERENCES public.coaches(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id VARCHAR(255) NOT NULL UNIQUE,
  stripe_customer_id VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_subscriptions_coach_id ON public.subscriptions(coach_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON public.subscriptions(stripe_subscription_id);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Coaches can view own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (
    coach_id IN (
      SELECT id FROM public.coaches WHERE user_id = auth.uid()
    )
  );
```

**Cliquer RUN** ✅

---

## 🧪 VÉRIFICATION

Après avoir créé toutes les tables, vérifier :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Résultat attendu :**
- ✅ coaches
- ✅ daily_stats
- ✅ leads
- ✅ posts
- ✅ subscriptions

---

## 🎯 TESTER L'APPLICATION

1. **Redémarrer l'app** (ou rafraîchir la page)
2. **Aller sur /login**
3. **Se connecter**
4. **Vérifier qu'il n'y a plus d'erreur 404**

---

## 💾 SAUVEGARDER LES MIGRATIONS

Pour ne pas perdre ce travail, créer les fichiers de migration :

**Créer :** `supabase_migrations/001_initial_schema.sql`

Copier tout le SQL ci-dessus dans ce fichier.

---

**Toutes les tables sont maintenant créées ! 🎉**
