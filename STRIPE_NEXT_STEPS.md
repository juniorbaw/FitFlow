# 🚀 STRIPE - PROCHAINES ÉTAPES

## ✅ CE QUI EST FAIT

1. **Installation Stripe** ✅
   - `npm install stripe @stripe/stripe-js`

2. **API Routes créées** ✅
   - `/api/stripe/checkout` - Crée session de paiement
   - `/api/stripe/webhook` - Reçoit events Stripe
   - `/api/stripe/portal` - Customer Portal

3. **Page Pricing créée** ✅
   - `/pricing` - 2 plans (Starter 47€, Pro 97€)
   - Design moderne FitFlow
   - Boutons fonctionnels

4. **Variables ajoutées** ✅
   - `STRIPE_PRODUCT_STARTER=prod_TyPu3MklJdRMpw`
   - `STRIPE_PRODUCT_PRO=prod_TyQ2uyeVIWNanX`
   - `STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_...`

5. **Settings page** ✅
   - Bouton "Gérer mon abonnement" existe déjà

6. **Build réussi** ✅
   - Pas d'erreurs
   - Déployé sur Vercel

---

## ⚠️ ACTION REQUISE - À FAIRE MAINTENANT

### ÉTAPE 1 : Créer les Prix dans Stripe (OBLIGATOIRE)

**IMPORTANT :** Vous avez les Product IDs, mais il faut créer des **Price IDs**.

1. Aller sur : https://dashboard.stripe.com/products
2. Passer en mode **LIVE** (toggle en haut à droite)

**Pour le produit STARTER :**
3. Cliquer sur `prod_TyPu3MklJdRMpw`
4. Cliquer **Add pricing**
5. Configurer :
   - Prix : `47.00 EUR`
   - Facturation : `Récurrent`
   - Fréquence : `Mensuel`
6. **Copier le Price ID** (commence par `price_...`)
7. Exemple : `price_1abc2def3ghi4jkl`

**Pour le produit PRO :**
8. Cliquer sur `prod_TyQ2uyeVIWNanX`
9. Répéter les étapes 4-7
10. Prix : `97.00 EUR`
11. **Copier le Price ID**

### ÉTAPE 2 : Mettre à jour le code

Ouvrir `Desktop/FitFlow Launch/app/api/stripe/checkout/route.ts`

Ligne 8-9, remplacer :
```typescript
const PRICE_IDS = {
  starter: process.env.STRIPE_PRODUCT_STARTER || process.env.STRIPE_PRICE_STARTER || 'prod_TyPu3MklJdRMpw',
  pro: process.env.STRIPE_PRODUCT_PRO || process.env.STRIPE_PRICE_PRO || 'prod_TyQ2uyeVIWNanX',
};
```

Par (avec VOS Price IDs) :
```typescript
const PRICE_IDS = {
  starter: 'price_VOTRE_PRICE_ID_STARTER_ICI',  // Remplacer
  pro: 'price_VOTRE_PRICE_ID_PRO_ICI',          // Remplacer
};
```

### ÉTAPE 3 : Obtenir la clé secrète LIVE

1. Aller sur : https://dashboard.stripe.com/apikeys
2. Passer en mode **LIVE**
3. Copier la **Secret key** (commence par `sk_live_...`)
4. **NE PAS** la mettre dans `.env.local` (sécurité)
5. On la mettra directement sur Vercel

### ÉTAPE 4 : Configurer le Webhook

1. Aller sur : https://dashboard.stripe.com/webhooks
2. Cliquer **Add endpoint**
3. **Endpoint URL :** `https://fit-flow-gamma.vercel.app/api/stripe/webhook`
4. **Events to send :**
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Cliquer **Add endpoint**
6. **Copier le Signing secret** (commence par `whsec_...`)

### ÉTAPE 5 : Ajouter les variables sur Vercel

1. Aller sur : https://vercel.com/juniorbaw/fit-flow/settings/environment-variables

2. Ajouter ces 3 variables :

   **Variable 1 :**
   - Name : `STRIPE_SECRET_KEY`
   - Value : `sk_live_VOTRE_CLE_SECRETE` (de l'étape 3)
   - Environment : Production

   **Variable 2 :**
   - Name : `STRIPE_WEBHOOK_SECRET`
   - Value : `whsec_VOTRE_WEBHOOK_SECRET` (de l'étape 4)
   - Environment : Production

   **Variable 3 :**
   - Name : `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Value : `pk_live_51SwR7C7hDRiRaxtlixCLNYgP9lazGqlt7td4NPrOv1k84qnd9Qcm5t4UDHvyqY6OWKTVPnur2RQPEc1wD8MOueJ600ihfyhtNl`
   - Environment : Production

3. Cliquer **Save**

### ÉTAPE 6 : Redéployer

Après avoir ajouté les Price IDs dans le code (étape 2) :

```bash
cd "Desktop/FitFlow Launch"
git add app/api/stripe/checkout/route.ts
git commit -m "feat: add Stripe LIVE price IDs"
git push origin main
```

Vercel redéploiera automatiquement (~2 min)

---

## 🧪 TESTER (Mode Test d'abord)

### Test 1 : Checkout Flow

1. Aller sur : https://fit-flow-gamma.vercel.app/pricing
2. Cliquer **"Choisir Starter"**
3. Vous devriez être redirigé vers Stripe
4. **Carte de test :**
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`
5. Compléter le paiement
6. Vérifier redirection vers `/dashboard?success=true`

### Test 2 : Webhook

Après le paiement, vérifier dans Supabase :
```sql
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 1;
```

Devrait voir :
- `status = 'active'`
- `plan = 'starter'`

### Test 3 : Customer Portal

1. Aller sur `/settings`
2. Cliquer **"Gérer mon abonnement"**
3. Vous devriez voir le Stripe Customer Portal
4. Tester annulation, upgrade, etc.

---

## 📋 CHECKLIST COMPLÈTE

**Configuration Stripe :**
- [ ] Price créé pour Starter (47€/mois) → Price ID copié
- [ ] Price créé pour Pro (97€/mois) → Price ID copié
- [ ] Clé secrète LIVE copiée
- [ ] Webhook configuré (endpoint + events)
- [ ] Signing secret du webhook copié

**Code :**
- [ ] Price IDs ajoutés dans `route.ts` ligne 8-9
- [ ] Code commité et pushé

**Vercel :**
- [ ] `STRIPE_SECRET_KEY` ajouté
- [ ] `STRIPE_WEBHOOK_SECRET` ajouté
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ajouté
- [ ] App redéployée

**Tests :**
- [ ] Test paiement avec carte 4242...
- [ ] Vérification webhook dans Supabase
- [ ] Test Customer Portal
- [ ] Test upgrade/downgrade

---

## 🎯 RÉSULTAT ATTENDU

Une fois tout configuré :

1. **Coach va sur `/pricing`**
2. **Clique "Choisir Starter"**
3. **Paye 47€ sur Stripe**
4. **Webhook active l'abonnement dans Supabase**
5. **Coach est redirigé vers `/dashboard`**
6. **Son plan est actif et les features débloquées**

---

## 📞 AIDE

Si vous avez besoin d'aide :

1. **Envoyer screenshot** de l'erreur
2. **Logs Stripe** : https://dashboard.stripe.com/logs
3. **Logs Vercel** : https://vercel.com/juniorbaw/fit-flow/logs

---

## 💡 APRÈS LES TESTS

Une fois que tout fonctionne en mode test :

1. **Basculer en mode LIVE**
2. **Tester avec une vraie carte** (sera débité)
3. **Annuler immédiatement** après le test
4. **Lancer officiellement** FitFlow Pro ! 🚀

---

**Commencez par l'ÉTAPE 1 : Créer les Prix dans Stripe** 👆

Dites-moi quand vous avez les Price IDs et je vous aide à finaliser ! 😊
