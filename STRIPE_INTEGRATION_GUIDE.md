# 💳 GUIDE INTÉGRATION STRIPE - FitFlow

## ✅ Ce qui a été fait

### 1. Variables d'environnement ajoutées

Dans `.env.local` :
```bash
# Stripe LIVE Products (Vos vrais IDs)
STRIPE_PRODUCT_STARTER=prod_TyPu3MklJdRMpw
STRIPE_PRODUCT_PRO=prod_TyQ2uyeVIWNanX
STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_51SwR7C7hDRiRaxtlixCLNYgP9lazGqlt7td4NPrOv1k84qnd9Qcm5t4UDHvyqY6OWKTVPnur2RQPEc1wD8MOueJ600ihfyhtNl

# Clés de test existantes (pour dev local)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. API Routes créées/mises à jour

✅ **`/api/stripe/checkout`** (ligne 8-9 mise à jour)
- Accepte : `{ plan: 'starter' | 'pro', user_id, email }`
- Crée une session Stripe Checkout
- Redirige vers Stripe pour paiement
- Success URL: `/dashboard?success=true`
- Cancel URL: `/pricing?canceled=true`

✅ **`/api/stripe/webhook`** (déjà existant)
- Écoute les événements Stripe
- `checkout.session.completed` → Active l'abonnement
- `customer.subscription.deleted` → Désactive
- `invoice.paid` → Renouvellement

✅ **`/api/stripe/portal`** (déjà existant)
- Crée un lien vers le Stripe Customer Portal
- Le coach peut gérer son abonnement

### 3. Page Pricing créée

✅ **`/app/pricing/page.tsx`**
- 2 plans : Starter (47€) et Pro (97€)
- Design moderne cohérent FitFlow
- Boutons "Choisir Starter" et "Démarrer avec Pro"
- Appelle `/api/stripe/checkout`
- Responsive mobile parfait

### 4. Page Settings

✅ **Bouton "Gérer mon abonnement"** (ligne 265-271)
- Appelle `/api/stripe/portal`
- Ouvre le Stripe Customer Portal
- Le coach peut upgrader, downgrader, annuler

---

## 🔧 CONFIGURATION NÉCESSAIRE

### Étape 1 : Obtenir votre clé secrète Stripe LIVE

1. Aller sur : https://dashboard.stripe.com/apikeys
2. Passer en mode **LIVE** (toggle en haut)
3. Copier la **Secret key** (commence par `sk_live_...`)
4. Dans `.env.local`, remplacer :
   ```bash
   STRIPE_SECRET_KEY=sk_live_VOTRE_VRAIE_CLE_ICI
   ```

### Étape 2 : Créer les prix (prices) pour vos produits

Dans Stripe Dashboard :

1. Aller sur **Products** → https://dashboard.stripe.com/products
2. Cliquer sur **prod_TyPu3MklJdRMpw** (Starter)
3. Ajouter un prix :
   - Prix : **47 EUR**
   - Récurrence : **Mensuel**
   - Copier le **Price ID** (commence par `price_...`)
4. Répéter pour **prod_TyQ2uyeVIWNanX** (Pro)
   - Prix : **97 EUR**
   - Récurrence : **Mensuel**

### Étape 3 : Mettre à jour le code avec les Price IDs

Dans `app/api/stripe/checkout/route.ts`, ligne 8-9, vous avez actuellement les **Product IDs**.

**IMPORTANT :** Stripe Checkout nécessite des **Price IDs**, pas des Product IDs.

Remplacer :
```typescript
const PRICE_IDS = {
  starter: 'prod_TyPu3MklJdRMpw',  // ❌ Product ID
  pro: 'prod_TyQ2uyeVIWNanX',      // ❌ Product ID
}
```

Par :
```typescript
const PRICE_IDS = {
  starter: 'price_VOTRE_PRICE_ID_STARTER',  // ✅ Price ID
  pro: 'price_VOTRE_PRICE_ID_PRO',          // ✅ Price ID
}
```

### Étape 4 : Configurer le Webhook Stripe

1. Aller sur : https://dashboard.stripe.com/webhooks
2. Cliquer **Add endpoint**
3. URL : `https://fit-flow-gamma.vercel.app/api/stripe/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Copier le **Signing secret** (commence par `whsec_...`)
6. Dans `.env.local` et Vercel :
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SIGNING_SECRET
   ```

### Étape 5 : Ajouter les variables sur Vercel

1. Aller sur : https://vercel.com/juniorbaw/fit-flow/settings/environment-variables
2. Ajouter :
   - `STRIPE_SECRET_KEY` = `sk_live_...`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...`
   - `STRIPE_PRODUCT_STARTER` = `prod_TyPu3MklJdRMpw`
   - `STRIPE_PRODUCT_PRO` = `prod_TyQ2uyeVIWNanX`
   - `STRIPE_PUBLISHABLE_KEY_LIVE` = `pk_live_...`
3. Redéployer l'app

---

## 🧪 TESTER LE SYSTÈME

### Test 1 : Checkout Flow

1. Aller sur : https://fit-flow-gamma.vercel.app/pricing
2. Cliquer **"Choisir Starter"**
3. Vérifier que vous êtes redirigé vers Stripe
4. Utiliser une carte de test :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`
5. Compléter le paiement
6. Vérifier redirection vers `/dashboard?success=true`

### Test 2 : Webhook

1. Après le paiement, vérifier dans Supabase :
   ```sql
   SELECT * FROM subscriptions 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
2. Vérifier que `status = 'active'`
3. Vérifier dans `coaches` que `subscription_tier` est mis à jour

### Test 3 : Customer Portal

1. Aller sur `/settings`
2. Cliquer **"Gérer mon abonnement"**
3. Vérifier ouverture du Stripe Customer Portal
4. Tester upgrade/downgrade/annulation

---

## 📊 FLUX COMPLET

```
┌──────────────────────────────────────────────────┐
│ 1. Coach clique "Choisir Starter" sur /pricing  │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│ 2. Appel API : POST /api/stripe/checkout        │
│    Body: { plan: 'starter', user_id, email }    │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│ 3. Stripe crée une Checkout Session              │
│    → Redirection vers Stripe                     │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│ 4. Coach entre ses infos de paiement             │
│    → Valide le paiement                          │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│ 5. Stripe webhook → /api/stripe/webhook         │
│    Event: checkout.session.completed             │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│ 6. Webhook met à jour Supabase :                │
│    - subscriptions (nouveau record)              │
│    - coaches (subscription_tier, customer_id)    │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│ 7. Redirection vers /dashboard?success=true     │
│    → Coach voit son plan activé                  │
└──────────────────────────────────────────────────┘
```

---

## 🔐 SÉCURITÉ

### Variables sensibles

❌ **NE JAMAIS commit :**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

✅ **Uniquement dans :**
- `.env.local` (local)
- Vercel Environment Variables (production)

### Vérification Webhook

Le code vérifie la signature Stripe :
```typescript
event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
)
```

Impossible de fake un webhook sans le secret.

---

## 🎯 PROCHAINES ÉTAPES

### Court terme (aujourd'hui)

1. **Obtenir les Price IDs Stripe**
   - Créer les prix dans Stripe Dashboard
   - Mettre à jour `PRICE_IDS` dans le code

2. **Configurer le webhook**
   - URL : `https://fit-flow-gamma.vercel.app/api/stripe/webhook`
   - Copier le signing secret

3. **Déployer sur Vercel**
   - Ajouter toutes les variables
   - Redéployer

4. **Tester en mode test**
   - Carte : `4242 4242 4242 4242`
   - Vérifier le flux complet

### Moyen terme

5. **Migration test → live**
   - Basculer vers les clés LIVE
   - Tester avec une vraie carte

6. **Ajouter features Premium**
   - Désactiver certaines features pour Starter
   - Ajouter des limites (leads/mois)

7. **Analytics Stripe**
   - MRR (Monthly Recurring Revenue)
   - Churn rate
   - Upgrades/downgrades

---

## 📋 CHECKLIST AVANT LE LIVE

- [ ] Clé secrète LIVE dans Vercel
- [ ] Webhook configuré et testé
- [ ] Price IDs corrects (pas Product IDs)
- [ ] Test complet en mode test
- [ ] Stripe Customer Portal activé
- [ ] Emails de confirmation Stripe configurés
- [ ] Page /pricing accessible
- [ ] Bouton Settings → Gérer abonnement fonctionne
- [ ] Migration données test → Supabase OK

---

## 🐛 ERREURS COURANTES

### 1. "No such price: prod_xxx"

**Cause :** Vous utilisez un Product ID au lieu d'un Price ID

**Solution :** Créer un prix dans Stripe Dashboard et utiliser le Price ID

### 2. "Invalid API Key"

**Cause :** Clé secrète incorrecte ou mode test/live non cohérent

**Solution :** Vérifier que toutes les clés sont en mode LIVE

### 3. "Webhook signature verification failed"

**Cause :** `STRIPE_WEBHOOK_SECRET` incorrect

**Solution :** Copier le bon signing secret depuis Stripe Dashboard

### 4. "Customer does not exist"

**Cause :** Le coach n'a pas de `stripe_customer_id` dans Supabase

**Solution :** Le code crée automatiquement un customer, vérifier les logs

---

## 💡 ASTUCES PRO

### Tester les webhooks localement

Installer Stripe CLI :
```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Voir les logs Stripe

Dashboard → Developers → Logs

### Tester les différents scénarios

- Paiement réussi
- Paiement échoué
- Abonnement annulé
- Upgrade Starter → Pro
- Downgrade Pro → Starter

---

## 📞 SUPPORT

**Stripe Dashboard :** https://dashboard.stripe.com
**Documentation :** https://stripe.com/docs/billing/subscriptions/checkout
**Webhooks :** https://dashboard.stripe.com/webhooks

---

**Prêt à lancer FitFlow avec Stripe !** 🚀

*Dernière mise à jour : 13 février 2026*
