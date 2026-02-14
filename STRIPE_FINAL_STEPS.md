# 🎯 STRIPE - ÉTAPES FINALES (5 minutes)

## ✅ FAIT - Price IDs corrects dans le code

```typescript
const PRICE_IDS = {
  starter: 'price_1T0T4G7hDRiRaxtlqjTdXrnG',  ✅
  pro: 'price_1T0TCs7hDRiRaxtlBshj4vHL',     ✅
};
```

Code déployé sur Vercel ! 🚀

---

## ⚠️ RESTE À FAIRE (OBLIGATOIRE)

### ÉTAPE 1 : Ajouter la clé secrète sur Vercel (2 min)

1. Aller sur : https://dashboard.stripe.com/apikeys
2. Passer en mode **LIVE** (toggle en haut)
3. Copier la **Secret key** (commence par `sk_live_...`)
4. Aller sur : https://vercel.com/juniorbaw/fit-flow/settings/environment-variables
5. Cliquer **Add New**
6. Ajouter :
   - **Name :** `STRIPE_SECRET_KEY`
   - **Value :** `sk_live_VOTRE_CLE` (celle copiée à l'étape 3)
   - **Environment :** Cocher **Production**
7. Cliquer **Save**

### ÉTAPE 2 : Configurer le Webhook Stripe (3 min)

1. Aller sur : https://dashboard.stripe.com/webhooks
2. Cliquer **Add endpoint**
3. **Endpoint URL :**
   ```
   https://fit-flow-gamma.vercel.app/api/stripe/webhook
   ```
4. **Events to send :**
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Cliquer **Add endpoint**
6. **Copier le Signing secret** (commence par `whsec_...`)
7. Retourner sur Vercel : https://vercel.com/juniorbaw/fit-flow/settings/environment-variables
8. Ajouter :
   - **Name :** `STRIPE_WEBHOOK_SECRET`
   - **Value :** `whsec_VOTRE_SECRET` (copié à l'étape 6)
   - **Environment :** **Production**
9. Cliquer **Save**

### ÉTAPE 3 : Redéployer (1 clic)

1. Aller sur : https://vercel.com/juniorbaw/fit-flow
2. Cliquer sur le dernier déploiement
3. Menu **⋮** → **Redeploy**
4. Confirmer
5. Attendre ~2 minutes

---

## 🧪 TESTER

Une fois les étapes ci-dessus faites :

1. Aller sur : https://fit-flow-gamma.vercel.app/pricing
2. Cliquer **"Choisir Starter"**
3. Vous devriez voir la page Stripe Checkout
4. Tester avec carte :
   - Numéro : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`
5. Valider le paiement
6. Vous devriez être redirigé vers `/dashboard?success=true`

---

## ✅ RÉSULTAT ATTENDU

Après paiement :
- ✅ Redirection vers dashboard
- ✅ Abonnement activé dans Supabase
- ✅ Coach peut gérer son abo dans `/settings`

---

## 🎉 C'EST TOUT !

Une fois ces 3 étapes faites, votre système Stripe est LIVE ! 🚀

Les paiements fonctionneront et les abonnements seront automatiquement gérés.

---

**Faites ces 3 étapes maintenant et dites-moi quand c'est fait !** 💪
