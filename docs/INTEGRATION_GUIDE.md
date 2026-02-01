# 🔌 FitFlow - Guide d'Intégration Complet

## Vue d'Ensemble de l'Architecture

```
┌─────────────────┐     ┌─────────────┐     ┌─────────────────┐
│   FitFlow App   │────▶│   Supabase  │────▶│   n8n Cloud     │
│   (Next.js)     │◀────│   (Auth+DB) │◀────│   (Automation)  │
└─────────────────┘     └─────────────┘     └─────────────────┘
                                                     │
                              ┌──────────────────────┼──────────────────────┐
                              ▼                      ▼                      ▼
                        ┌──────────┐          ┌──────────┐          ┌──────────┐
                        │  Apify   │          │  Gemini  │          │   GHL    │
                        │ Scraping │          │    AI    │          │   CRM    │
                        └──────────┘          └──────────┘          └──────────┘
```

---

## 1️⃣ Configuration Supabase

### Étape 1: Créer le Projet
1. Aller sur [supabase.com](https://supabase.com)
2. Créer nouveau projet: "fitflow-production"
3. Région: EU West (Frankfurt pour RGPD)
4. Password: Générer mot de passe fort

### Étape 2: Variables d'Environnement
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx... # Pour API routes côté serveur
```

### Étape 3: Créer les Tables

**Exécuter dans SQL Editor:**

```sql
-- Profiles (étend auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  email TEXT,
  instagram_username TEXT,
  subscription_tier TEXT DEFAULT 'starter', -- starter/pro/elite
  daily_dm_limit INTEGER DEFAULT 30,
  auto_send_enabled BOOLEAN DEFAULT false,
  ghl_api_key TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  instagram_username TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 10),
  dm_suggested TEXT NOT NULL,
  reasoning TEXT,
  status TEXT DEFAULT 'pending', -- pending/sent/replied/converted/archived
  dm_sent_date TIMESTAMP,
  reply_received BOOLEAN DEFAULT false,
  reply_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  plan_type TEXT,
  amount NUMERIC(10,2),
  start_date DATE,
  end_date DATE,
  renewal_status TEXT DEFAULT 'active', -- active/pending/churned
  engagement_score INTEGER CHECK (engagement_score >= 1 AND engagement_score <= 10),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Templates
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  message_content TEXT NOT NULL,
  trigger_keywords TEXT[],
  include_calendly BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  template_id UUID REFERENCES message_templates,
  instagram_post_url TEXT,
  status TEXT DEFAULT 'active', -- active/paused
  total_dm_sent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Direct Messages
CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns,
  user_id UUID REFERENCES auth.users NOT NULL,
  instagram_username TEXT NOT NULL,
  message_sent TEXT,
  sent_at TIMESTAMP,
  response_received BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts (Scheduling)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  post_url TEXT,
  post_type TEXT, -- reel/post/carousel
  caption TEXT,
  scheduled_time TIMESTAMP,
  status TEXT DEFAULT 'scheduled', -- scheduled/published/failed
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Étape 4: Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own leads" ON leads
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own clients" ON clients
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own templates" ON message_templates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own campaigns" ON campaigns
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own DMs" ON direct_messages
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own posts" ON posts
  FOR ALL USING (auth.uid() = user_id);
```

### Étape 5: Storage (Optionnel - pour images)

```sql
-- Créer bucket pour avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Policy pour avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 2️⃣ Configuration n8n

### Étape 1: Créer Compte n8n Cloud
1. Aller sur [n8n.io](https://n8n.io)
2. Créer compte (plan Pro recommandé: 20$/mois)
3. Créer workspace: "fitflow-automation"

### Étape 2: Workflow Instagram Scraping

**Créer workflow: "Instagram Lead Detection"**

**Nodes:**
1. **Schedule Trigger** (every 10 minutes)
2. **Apify - Instagram Comment Scraper**
3. **Gemini AI - Lead Scoring**
4. **Gemini AI - DM Generation**
5. **HTTP Request - FitFlow Webhook**

**Configuration détaillée à venir dans section Apify/Gemini**

### Étape 3: Webhook URL
```
https://votre-domain.com/api/webhooks/scrape
```

---

## 3️⃣ Configuration Apify

### Étape 1: Créer Compte
1. [apify.com](https://apify.com)
2. Plan: Starter ($49/mois)
3. API Token: Settings → Integrations → API Token

### Étape 2: Actor Instagram Comments

**Actor recommandé:** `apify/instagram-comment-scraper`

**Configuration:**
```json
{
  "postUrls": ["https://www.instagram.com/p/XXX"],
  "maxComments": 100,
  "includeReplies": false
}
```

**Output Format:**
```json
{
  "username": "john_doe",
  "text": "Super contenu! Je suis intéressé",
  "timestamp": "2024-01-15T10:30:00Z",
  "likes": 5
}
```

---

## 4️⃣ Configuration Gemini AI

### Étape 1: API Key
1. [ai.google.dev](https://ai.google.dev)
2. Get API Key
3. Limite gratuite: 60 requêtes/minute

### Étape 2: Prompt Lead Scoring

```
Analyse ce commentaire Instagram d'un potentiel client pour un coach fitness.

Commentaire: "{comment_text}"
Username: "{username}"
Post context: "{post_caption}"

Donne-moi:
1. Score de 1 à 10 (intention d'achat)
2. Raison du score
3. Un DM personnalisé et naturel pour engager cette personne

Réponds en JSON:
{
  "score": 8,
  "reasoning": "...",
  "dm_suggested": "..."
}
```

---

## 5️⃣ Configuration Go HighLevel

### Pourquoi Go HighLevel?
✅ API officielle Meta/Instagram  
✅ Pas de risque de ban  
✅ CRM complet inclus  
✅ Automation workflows  
✅ $97/mois (ou $297 Agency Unlimited)  

### Étape 1: Setup Account
1. [gohighlevel.com](https://gohighlevel.com)
2. Plan: Agency Unlimited ($297/mois) - **Vous l'avez déjà!**
3. Créer sub-account pour FitFlow

### Étape 2: Connecter Instagram
1. Settings → Integrations → Instagram
2. Connect Instagram Business Account
3. Autoriser permissions
4. Récupérer API credentials

### Étape 3: API Configuration

**Variables d'environnement:**
```bash
GHL_API_KEY=xxx
GHL_LOCATION_ID=xxx
GHL_INSTAGRAM_INTEGRATION_ID=xxx
```

**Endpoint DM Send:**
```
POST https://rest.gohighlevel.com/v1/conversations/messages
Headers:
  Authorization: Bearer YOUR_API_KEY
  Version: 2021-07-28

Body:
{
  "type": "Instagram",
  "contactId": "xxx",
  "message": "Salut! Merci pour ton commentaire..."
}
```

### Étape 4: Webhook Callbacks
Setup webhook dans GHL pour recevoir les réponses:
```
https://votre-domain.com/api/webhooks/ghl-reply
```

---

## 6️⃣ Configuration Stripe (Paiements)

### Étape 1: Créer Compte
1. [stripe.com](https://stripe.com)
2. Activer mode live (après tests)

### Étape 2: Créer Products

**Starter:**
```
Prix: 199€/mois
ID: price_starter_199
```

**Pro:**
```
Prix: 499€/mois
ID: price_pro_499
```

**Elite:**
```
Prix: 999€/mois  
ID: price_elite_999
```

### Étape 3: Webhook
```
https://votre-domain.com/api/stripe/webhook
Events: checkout.session.completed, invoice.paid, subscription.deleted
```

---

## 7️⃣ Workflow Complet

### Processus End-to-End

**1. Scraping (n8n → Apify)**
- Toutes les 10 min
- Récupère nouveaux commentaires
- Filtre par mots-clés basiques

**2. Scoring (n8n → Gemini)**
- Analyse chaque commentaire
- Score 1-10
- Génère DM personnalisé

**3. Ingestion (n8n → FitFlow)**
```bash
POST /api/webhooks/scrape
{
  "user_id": "uuid",
  "instagram_username": "john_doe",
  "comment_text": "...",
  "score": 8,
  "dm_suggested": "...",
  "reasoning": "..."
}
```

**4. Affichage (FitFlow Dashboard)**
- Lead apparaît dans /leads
- Coach peut voir score + DM

**5. Envoi (Manuel ou Auto)**

**Si manuel (Starter):**
- Coach copie le DM
- Envoie manuellement sur Instagram

**Si auto (Pro/Elite):**
- Système trigger auto-send
- POST /api/webhooks/send-dm
- FitFlow → GHL → Instagram

**6. Tracking**
- Status: pending → sent
- Si réponse: reply_received = true
- Dashboard analytics mis à jour

---

## 8️⃣ Variables d'Environnement Complètes

```bash
# .env.local (Development)
# .env.production (Production)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# n8n
N8N_WEBHOOK_SECRET=xxx # Pour sécuriser webhook

# Apify
APIFY_API_TOKEN=xxx

# Gemini AI
GEMINI_API_KEY=xxx

# Go HighLevel
GHL_API_KEY=xxx
GHL_LOCATION_ID=xxx
GHL_INSTAGRAM_INTEGRATION_ID=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# App
NEXT_PUBLIC_APP_URL=https://fitflow.fr
```

---

## 9️⃣ Tests End-to-End

### Test 1: Lead Detection
1. Poster sur Instagram
2. Ajouter commentaire test: "Je suis intéressé!"
3. Attendre 10 min (ou trigger manuel n8n)
4. Vérifier lead dans /leads

### Test 2: DM Manual
1. Aller sur lead
2. Copier DM suggéré
3. Envoyer manuellement sur Instagram

### Test 3: DM Auto (Pro plan)
1. Lead avec score ≥ 7
2. Auto-send enabled
3. Vérifier status → sent
4. Vérifier DM reçu sur Instagram

### Test 4: Réponse Lead
1. Lead répond au DM
2. GHL webhook → FitFlow
3. reply_received = true
4. Notification coach

---

## 🚨 Troubleshooting

### Lead pas détecté
- ✅ Vérifier n8n workflow actif
- ✅ Vérifier Apify credits
- ✅ Vérifier URL post correcte
- ✅ Logs n8n pour erreurs

### DM pas envoyé
- ✅ Vérifier GHL API key valide
- ✅ Vérifier Instagram connecté dans GHL
- ✅ Vérifier daily_dm_limit pas atteint
- ✅ Logs API /api/webhooks/send-dm

### Score IA bizarre
- ✅ Vérifier Gemini API key
- ✅ Vérifier prompt template
- ✅ Vérifier rate limits (60/min)

---

## 📞 Support

**Technique:** support@fitflow.fr  
**Documentation:** docs.fitflow.fr  
**Discord:** discord.gg/fitflow  

---

**Dernière mise à jour:** 2026-02-01
