# 🔧 FIX - Erreur 400 Stripe Checkout

## ❌ ERREURS

```
/api/stripe/checkout:1 Failed to load resource: the server responded with a status of 400
lryjyzqrhtepsvqlzzdy.supabase.co/rest/v1/coaches:1 Failed to load resource: the server responded with a status of 404
```

## 🔍 CAUSES

1. **Table `coaches` n'existe pas** → Erreur 404
2. **Impossible de récupérer le coach** → Checkout échoue → Erreur 400

---

## ✅ SOLUTION COMPLÈTE

### ÉTAPE 1 : Créer la table coaches (PRIORITÉ)

**Aller sur Supabase SQL Editor :**
```
https://lryjyzqrhtepsvqlzzdy.supabase.co/project/_/sql
```

**Exécuter ce SQL :**

```sql
-- 1. Créer la table coaches
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

-- 2. Index
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON public.coaches(user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_stripe_customer_id ON public.coaches(stripe_customer_id);

-- 3. RLS (Row Level Security)
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- 4. Policies
CREATE POLICY "Users can view own coach profile"
  ON public.coaches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coach profile"
  ON public.coaches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own coach profile"
  ON public.coaches FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Policy pour le service role (API routes)
CREATE POLICY "Service role can manage all coaches"
  ON public.coaches
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

**Cliquer RUN** ✅

---

### ÉTAPE 2 : Créer un profil coach de test

Si vous avez déjà un compte utilisateur, créez le profil coach :

```sql
-- Vérifier vos utilisateurs
SELECT id, email FROM auth.users;

-- Créer le profil coach pour votre utilisateur
-- REMPLACER 'your-user-id' par votre vrai user_id
INSERT INTO public.coaches (user_id, email, subscription_tier, subscription_status)
VALUES (
  'YOUR_USER_ID_HERE',  -- Remplacer par votre user_id
  'your-email@example.com',  -- Remplacer par votre email
  'free',
  'trial'
);
```

---

### ÉTAPE 3 : Vérifier que ça marche

```sql
-- Vérifier que le coach existe
SELECT * FROM public.coaches;
```

**Résultat attendu :** Au moins 1 ligne avec vos données

---

### ÉTAPE 4 : Tester le checkout

1. **Se déconnecter et se reconnecter** sur l'app
2. **Aller sur /pricing**
3. **Cliquer "Choisir Starter"**
4. **Plus d'erreur 400 !** ✅

---

## 🚨 SI ÇA NE MARCHE TOUJOURS PAS

### Erreur : "Coach not found"

**Cause :** Le profil coach n'a pas été créé lors de la connexion

**Solution temporaire :** Créer manuellement le profil (voir Étape 2)

**Solution permanente :** Vérifier que `/auth/callback` crée bien le profil

---

### Erreur : "Invalid plan"

**Cause :** Le paramètre `plan` n'est pas `starter` ou `pro`

**Solution :** Vérifier le code dans `/pricing/page.tsx`

```typescript
// Doit être exactement "starter" ou "pro"
handlePlanSelect('starter')  // ✅
handlePlanSelect('Starter')  // ❌ (majuscule)
```

---

### Erreur : "No such price"

**Cause :** Les Price IDs Stripe sont incorrects

**Solution :** Vérifier dans `app/api/stripe/checkout/route.ts`

```typescript
const PRICE_IDS = {
  starter: 'price_1T0T4G7hDRiRaxtlqjTdXrnG',  // Vérifier
  pro: 'price_1T0TCs7hDRiRaxtlBshj4vHL',      // Vérifier
};
```

Comparer avec Stripe Dashboard → Products

---

## 🔧 DEBUG ÉTAPE PAR ÉTAPE

### 1. Vérifier que la table existe

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'coaches';
```

**Si vide :** Exécuter l'Étape 1

---

### 2. Vérifier que votre profil coach existe

```sql
SELECT c.* 
FROM public.coaches c
JOIN auth.users u ON u.id = c.user_id
WHERE u.email = 'VOTRE_EMAIL@example.com';
```

**Si vide :** Exécuter l'Étape 2

---

### 3. Tester l'API en direct

```bash
# Récupérer votre access token
# Aller sur : https://fit-flow-gamma.vercel.app
# F12 → Application → Local Storage → sb-*-auth-token

# Tester l'API
curl -X POST https://fit-flow-gamma.vercel.app/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"plan":"starter","user_id":"YOUR_USER_ID","email":"your@email.com"}'
```

---

## 📋 CHECKLIST COMPLÈTE

**Supabase :**
- [ ] Table `coaches` créée
- [ ] RLS activée sur `coaches`
- [ ] Policies configurées
- [ ] Profil coach existe pour votre utilisateur

**Stripe :**
- [ ] Price IDs corrects dans le code
- [ ] `STRIPE_SECRET_KEY` configurée sur Vercel
- [ ] Webhook configuré

**Application :**
- [ ] Se déconnecter et reconnecter
- [ ] Tester /pricing → Cliquer sur un plan
- [ ] Plus d'erreur 400

---

## 🎯 RÉSULTAT ATTENDU

Après avoir suivi toutes les étapes :

1. **Clic sur "Choisir Starter"** → Pas d'erreur
2. **Redirection vers Stripe Checkout** → ✅
3. **URL Stripe visible** → `https://checkout.stripe.com/...`

---

**Suivez ces étapes dans l'ordre et ça marchera ! 🚀**
