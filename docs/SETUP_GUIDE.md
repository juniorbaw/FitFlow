# 🚀 FitFlow - Guide de Configuration Complet

## Étape 1: Configuration Meta/Instagram

### 1.1 Créer une App Meta
1. Allez sur [Meta for Developers](https://developers.facebook.com/)
2. Créez une nouvelle app de type "Business"
3. Ajoutez le produit "Instagram Basic Display" et "Instagram Graph API"

### 1.2 Configurer OAuth
1. Dans les paramètres de l'app, ajoutez:
   - **OAuth Redirect URIs**: `https://votre-domaine.com/api/auth/callback`
   - **Deauthorize Callback URL**: `https://votre-domaine.com/api/auth/deauthorize`
   - **Data Deletion Request URL**: `https://votre-domaine.com/api/auth/delete`

### 1.3 Webhooks Instagram
1. Configurez un webhook avec l'URL: `https://votre-domaine.com/api/instagram/webhook`
2. Verify Token: Utilisez la valeur de `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
3. Abonnez-vous aux événements: `comments`, `mentions`, `messages`

### 1.4 Variables d'environnement Meta
```env
INSTAGRAM_APP_ID=votre_app_id
INSTAGRAM_APP_SECRET=votre_app_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=un_token_aleatoire_secure
```

---

## Étape 2: Configuration Google Gemini

1. Allez sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez une clé API
3. Ajoutez à `.env`:
```env
GEMINI_API_KEY=AIzaSy...
```

---

## Étape 3: Configuration Go High Level

Les utilisateurs configureront leur propre clé GHL dans l'interface FitFlow.

### Pour tester en dev:
1. Connectez-vous à Go High Level
2. Allez dans Settings → Integrations → API
3. Créez une clé API
4. Notez votre Location ID (dans l'URL du dashboard)

**Note**: Chaque utilisateur de FitFlow aura sa propre clé GHL stockée dans `profiles.ghl_api_key`

---

## Étape 4: Configuration Stripe

### 4.1 Créer les produits
1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com/)
2. Créez 3 produits avec abonnement récurrent:
   - **Starter**: 199€/mois (ou 7 jours d'essai)
   - **Pro**: 499€/mois (14 jours d'essai)
   - **Elite**: 999€/mois (14 jours d'essai)

### 4.2 Copier les Price IDs
Pour chaque produit, copiez le `price_xxx` ID

### 4.3 Configurer les Webhooks
1. Dans Stripe Dashboard → Developers → Webhooks
2. Ajoutez un endpoint: `https://votre-domaine.com/api/stripe/webhook`
3. Événements à écouter:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.paid`
4. Copiez le Webhook Secret

### 4.4 Variables d'environnement Stripe
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_xxx
STRIPE_PRICE_ELITE=price_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## Étape 5: Configuration Supabase

### 5.1 Créer le projet
1. Allez sur [Supabase](https://supabase.com/)
2. Créez un nouveau projet

### 5.2 Exécuter le schéma
1. Allez dans SQL Editor
2. Exécutez le contenu de `supabase-schema.sql`
3. Puis exécutez `supabase-schema-update.sql`

### 5.3 Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

⚠️ **Important**: Le Service Role Key doit rester SECRET!

---

## Étape 6: Déploiement Vercel

### 6.1 Push le code
```bash
git add .
git commit -m "feat: Complete FitFlow integration"
git push origin main
```

### 6.2 Importer sur Vercel
1. Connectez votre repo GitHub à Vercel
2. Ajoutez TOUTES les variables d'environnement

### 6.3 Configurer les Cron Jobs
Les cron jobs sont automatiquement configurés via `vercel.json`:
- **Scrape**: Toutes les 2 heures
- **Daily Report**: 9h chaque matin
- **Reset Counts**: Minuit chaque jour

**Important**: Générez et ajoutez `CRON_SECRET` pour sécuriser les cron jobs:
```bash
openssl rand -base64 32
```

---

## Étape 7: Configuration post-déploiement

### 7.1 Mettre à jour les URLs dans Meta
Remplacez `votre-domaine.com` par votre vraie URL Vercel dans:
- OAuth Redirect URIs
- Webhook URLs

### 7.2 Tester les intégrations
1. **Instagram**: Cliquez sur "Connecter Instagram" dans Settings
2. **Stripe**: Essayez un checkout (mode test)
3. **Webhooks**: Utilisez les outils de test Meta/Stripe

---

## Étape 8: Premiers utilisateurs

### 8.1 Créer un compte
1. Allez sur `/signup`
2. Créez un compte test

### 8.2 Connecter Instagram
1. Allez dans Settings
2. Cliquez "Connecter Instagram"
3. Autorisez l'accès

### 8.3 Configurer GHL (optionnel)
1. Dans Settings, ajoutez votre clé API GHL
2. Ajoutez votre Location ID

### 8.4 Tester le scraping
1. Publiez un post Instagram
2. Ajoutez un commentaire de test
3. Attendez le cron ou déclenchez manuellement via `/api/cron/scrape` (avec le bon header Authorization)

---

## Checklist finale

- [ ] Meta App créée et configurée
- [ ] Instagram OAuth fonctionne
- [ ] Gemini API clé valide
- [ ] Stripe produits créés
- [ ] Stripe webhooks configurés
- [ ] Supabase schéma exécuté
- [ ] Variables d'environnement ajoutées sur Vercel
- [ ] App déployée sur Vercel
- [ ] Cron secret généré et ajouté
- [ ] Test de connexion Instagram réussi
- [ ] Test de checkout Stripe réussi
- [ ] Premier lead scrappé avec succès

---

## Support

- **Docs Meta**: https://developers.facebook.com/docs/instagram-api
- **Docs Gemini**: https://ai.google.dev/docs
- **Docs Stripe**: https://stripe.com/docs/api
- **Docs Supabase**: https://supabase.com/docs
- **Docs Vercel Cron**: https://vercel.com/docs/cron-jobs

---

🎉 **Félicitations! FitFlow est maintenant opérationnel!**
