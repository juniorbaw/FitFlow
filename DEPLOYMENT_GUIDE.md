# 🚀 GUIDE DE DÉPLOIEMENT FITFLOW

## ✅ CE QUI A ÉTÉ FAIT

### 1. Base de données Supabase
- ✅ Schéma complet créé (`supabase_migrations/001_initial_schema.sql`)
  - Table `coaches` (profils utilisateurs)
  - Table `leads` (leads générés)
  - Table `posts` (posts Instagram trackés)
  - Table `daily_stats` (statistiques quotidiennes)
  - Table `subscriptions` (abonnements Stripe)
  
- ✅ RLS Policies configurées (`supabase_migrations/002_rls_policies.sql`)
  - Chaque coach ne voit QUE ses propres données
  - Fonction `insert_lead_from_webhook()` pour Make.com
  - Génération automatique de webhook tokens

### 2. Authentification
- ✅ Page `/login` avec Facebook OAuth
- ✅ Page `/signup` avec onboarding 4 étapes
- ✅ Callback OAuth (`/api/auth/callback`)
- ✅ Middleware de protection des routes
- ✅ Clients Supabase (client + server)

### 3. Paiements Stripe
- ✅ `/api/stripe/checkout` - Créer session de paiement
- ✅ `/api/stripe/portal` - Accès portail client
- ✅ `/api/stripe/webhook` - Gestion des events (à mettre à jour)

### 4. API Routes
- ✅ `/api/leads` - Liste des leads (GET)
- ✅ `/api/leads/[id]` - Mise à jour lead (PATCH)
- ✅ `/api/stats` - Stats quotidiennes (GET)
- ✅ `/api/stats/overview` - Stats agrégées (GET)
- ✅ `/api/posts` - Posts Instagram (GET)
- ✅ `/api/webhook/lead` - Webhook Make.com (POST)

### 5. Frontend
- ✅ Nouveau `PricingSection` (Starter 47€ + Pro 147€)
- ✅ Dashboard existant (à connecter aux vraies données)
- ✅ Pages login/signup créées

---

## 🔧 ÉTAPES DE DÉPLOIEMENT

### Étape 1: Configurer Supabase

1. **Aller sur Supabase** (https://lryjyzqrhtepsvqlzzdy.supabase.co)

2. **Exécuter les migrations SQL:**
   - SQL Editor → New Query
   - Copier le contenu de `supabase_migrations/001_initial_schema.sql`
   - Run
   - Copier le contenu de `supabase_migrations/002_rls_policies.sql`
   - Run

3. **Configurer Facebook OAuth:**
   - Authentication → Providers → Facebook
   - Activer Facebook Provider
   - Client ID: `907823931604024`
   - Client Secret: (depuis .env.local `INSTAGRAM_APP_SECRET`)
   - Callback URL: Copier l'URL fournie par Supabase
   - Aller sur Meta Developers: https://developers.facebook.com/apps/907823931604024
   - Valid OAuth Redirect URIs: Coller l'URL de callback Supabase
   - Sauvegarder

4. **Vérifier que les tables existent:**
   ```sql
   SELECT * FROM coaches LIMIT 1;
   SELECT * FROM leads LIMIT 1;
   SELECT * FROM posts LIMIT 1;
   ```

### Étape 2: Configurer Stripe

1. **Créer les Price IDs:**
   - Aller sur Stripe Dashboard: https://dashboard.stripe.com/test/products
   
   **Starter Monthly (47€):**
   - Create Product → "FitFlow Starter"
   - Recurring → Monthly → 47 EUR
   - Copier le Price ID → Ajouter à `.env.local` comme `STRIPE_PRICE_STARTER_MONTHLY`
   
   **Starter Annual (38€):**
   - Même produit → Add another price
   - Recurring → Yearly → 456 EUR (38€ × 12)
   - Copier le Price ID → `STRIPE_PRICE_STARTER_ANNUAL`
   
   **Pro Monthly (147€):**
   - Create Product → "FitFlow Pro"
   - Recurring → Monthly → 147 EUR
   - Copier le Price ID → `STRIPE_PRICE_PRO_MONTHLY`
   
   **Pro Annual (118€):**
   - Même produit → Add another price
   - Recurring → Yearly → 1416 EUR (118€ × 12)
   - Copier le Price ID → `STRIPE_PRICE_PRO_ANNUAL`

2. **Configurer le Webhook:**
   - Developers → Webhooks → Add endpoint
   - URL: `https://fit-flow-gamma.vercel.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`
   - Copier le Signing Secret → `STRIPE_WEBHOOK_SECRET`

### Étape 3: Mettre à jour .env.local

Ajouter/vérifier ces variables:

```bash
# Supabase (déjà configuré)
NEXT_PUBLIC_SUPABASE_URL=https://lryjyzqrhtepsvqlzzdy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe (à mettre à jour)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_STARTER_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...

# Meta/Instagram (déjà configuré)
NEXT_PUBLIC_INSTAGRAM_APP_ID=907823931604024
INSTAGRAM_APP_SECRET=...

# App
NEXT_PUBLIC_APP_URL=https://fit-flow-gamma.vercel.app
```

### Étape 4: Intégrer PricingSection

Le code est déjà créé dans `components/PricingSection.tsx`.

Pour l'intégrer dans `app/page.tsx`, remplacer la section pricing actuelle (lignes 430-460 environ) par:

```tsx
import { PricingSection } from '@/components/PricingSection'

// Dans le JSX, remplacer toute la section pricing par:
<PricingSection />
```

### Étape 5: Mettre à jour le webhook Stripe

Le fichier `app/api/stripe/webhook/route.ts` doit être mis à jour pour utiliser les nouvelles tables `coaches` et `subscriptions` au lieu de `profiles`.

Les modifications nécessaires ont été documentées mais nécessitent une édition manuelle du fichier.

### Étape 6: Tester localement

```bash
cd ~/Desktop/FitFlow\ Launch
npm run dev
```

Tester:
1. ✅ Homepage → Nouveau pricing visible
2. ✅ `/login` → Bouton Facebook Login
3. ✅ `/signup` → Flow d'onboarding
4. ✅ `/dashboard` → Accessible après login

### Étape 7: Déployer sur Vercel

```bash
# Ajouter les variables d'environnement sur Vercel
vercel env add STRIPE_PRICE_STARTER_MONTHLY
vercel env add STRIPE_PRICE_STARTER_ANNUAL
vercel env add STRIPE_PRICE_PRO_MONTHLY
vercel env add STRIPE_PRICE_PRO_ANNUAL

# Déployer
git add .
git commit -m "feat: complete FitFlow implementation with Supabase, Stripe, OAuth"
git push origin main

# Ou déployer directement
vercel --prod
```

---

## 🧪 TESTS À FAIRE

### Test 1: Inscription complète
1. Aller sur `/signup`
2. Connecter avec Facebook
3. Choisir un plan (Starter ou Pro)
4. Payer avec Stripe (mode test: `4242 4242 4242 4242`)
5. Compléter la configuration
6. Vérifier redirection vers `/dashboard`

### Test 2: Webhook Make.com
```bash
curl -X POST https://fit-flow-gamma.vercel.app/api/webhook/lead \
  -H "Content-Type: application/json" \
  -H "x-webhook-token: VOTRE_TOKEN_ICI" \
  -d '{
    "username": "testuser",
    "comment_text": "Salut! Je suis intéressé par ton coaching",
    "post_url": "https://instagram.com/p/test",
    "instagram_post_id": "test123",
    "ai_score": 9,
    "category": "vip",
    "ai_reason": "Client motivé, budget confirmé"
  }'
```

### Test 3: Dashboard
1. Login → Dashboard
2. Vérifier que les onglets s'affichent
3. (Actuellement en mock data, connecter aux vraies données plus tard)

---

## 📊 PROCHAINES ÉTAPES

### Phase 1: Connecter le Dashboard aux vraies données ⏳
- Modifier `app/dashboard/page.tsx` pour fetcher depuis Supabase
- Connecter `OverviewTab`, `LeadsTab`, `PostsTab`, `RevenueTab` aux API routes

### Phase 2: Tester le flow complet
- Créer un vrai compte coach
- Connecter Make.com → Webhook
- Générer de vrais leads
- Vérifier dans le dashboard

### Phase 3: Make.com Configuration
- Configurer le Scenario 1 dans Make.com
- Webhook URL: `https://fit-flow-gamma.vercel.app/api/webhook/lead`
- Header: `x-webhook-token: [récupérer depuis Supabase coaches.webhook_token]`

---

## 🔑 RÉCUPÉRER LE WEBHOOK TOKEN

Pour chaque coach, récupérer son token unique:

```sql
-- Dans Supabase SQL Editor
SELECT id, email, webhook_token 
FROM coaches 
WHERE email = 'email@du-coach.com';
```

Ce token doit être utilisé dans Make.com pour authentifier les appels webhook.

---

## ✅ CHECKLIST FINALE

- [ ] Migrations SQL exécutées sur Supabase
- [ ] Facebook OAuth configuré (Supabase + Meta Developers)
- [ ] Stripe Price IDs créés et ajoutés au .env
- [ ] Stripe Webhook configuré
- [ ] Variables d'environnement sur Vercel
- [ ] PricingSection intégré sur homepage
- [ ] Build local réussi (`npm run build`)
- [ ] Déployé sur Vercel
- [ ] Test inscription complète
- [ ] Test webhook Make.com

---

**🎉 Une fois tout terminé, FitFlow sera 100% opérationnel !**

Le système pourra:
- ✅ Accueillir de nouveaux coachs via Facebook OAuth
- ✅ Gérer les abonnements Stripe (Starter/Pro)
- ✅ Recevoir les leads depuis Make.com
- ✅ Afficher les stats dans le dashboard
- ✅ Tracker les conversions et le revenue
