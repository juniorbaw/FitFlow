# ⚡ ACTIONS IMMÉDIATES - Ce qui vous bloque MAINTENANT

## 🔴 PRIORITÉ ABSOLUE (30 minutes)

### 1. Créer la table `coaches` dans Supabase (5 min)

**Guide :** `SUPABASE_TABLE_FIX.md`

**Action :**
1. Aller sur : https://lryjyzqrhtepsvqlzzdy.supabase.co/project/_/sql
2. Copier-coller le SQL du guide
3. Cliquer RUN
4. ✅ Plus d'erreur 404

**BLOQUE :** Erreur 404 sur /coaches, Login ne marche pas

---

### 2. Configurer Facebook Provider dans Supabase (10 min)

**Guide :** `FACEBOOK_AUTH_FIX.md`

**Action :**
1. **Aller sur Meta Dashboard :**
   - https://developers.facebook.com/apps/907823931604024/settings/basic/
   - Copier l'App Secret (cliquer "Show")

2. **Aller sur Supabase :**
   - https://lryjyzqrhtepsvqlzzdy.supabase.co/project/_/auth/providers
   - Cliquer sur Facebook
   - Toggle ON "Enable Sign in with Facebook"
   - App ID : `907823931604024`
   - App Secret : (coller ce que vous avez copié)
   - Scopes : `email,public_profile,instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement`
   - Cliquer SAVE

3. **Retour sur Meta Dashboard :**
   - https://developers.facebook.com/apps/907823931604024/fb-login/settings/
   - Valid OAuth Redirect URIs → Ajouter :
     ```
     https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
     https://fit-flow-gamma.vercel.app/auth/callback
     http://localhost:3000/auth/callback
     ```
   - Save Changes

**BLOQUE :** Erreur "ID app non valide"

---

### 3. Ajouter STRIPE_SECRET_KEY sur Vercel (5 min)

**Guide :** `STRIPE_FINAL_STEPS.md`

**Action :**
1. **Obtenir la clé :**
   - https://dashboard.stripe.com/apikeys
   - Passer en mode LIVE
   - Copier la Secret key (sk_live_...)

2. **Ajouter sur Vercel :**
   - https://vercel.com/juniorbaw/fit-flow/settings/environment-variables
   - Add New
   - Name : `STRIPE_SECRET_KEY`
   - Value : (coller la clé)
   - Environment : Production
   - Save

3. **Redéployer :**
   - Aller sur deployments
   - Cliquer sur le dernier
   - Menu ⋮ → Redeploy

**BLOQUE :** Erreur 400 Stripe checkout

---

## ✅ RÉSULTAT ATTENDU

Après ces 3 actions (30 min) :

1. ✅ Login Facebook fonctionne
2. ✅ Profil coach créé automatiquement
3. ✅ Paiement Stripe fonctionne
4. ✅ Redirection vers dashboard OK

**L'application sera 100% fonctionnelle !** 🎉

---

## 📋 CHECKLIST

**Supabase :**
- [ ] Table coaches créée (SQL exécuté)
- [ ] Provider Facebook activé
- [ ] App ID + Secret configurés
- [ ] Scopes corrects

**Meta :**
- [ ] Redirect URIs ajoutées (3 URLs)
- [ ] App Secret copié

**Stripe :**
- [ ] STRIPE_SECRET_KEY ajoutée sur Vercel
- [ ] App redéployée

**Test :**
- [ ] Aller sur /login
- [ ] Cliquer "Se connecter avec Facebook"
- [ ] Popup Facebook s'ouvre
- [ ] Redirection vers /dashboard
- [ ] Profil coach visible dans Supabase

---

## 🚨 SI VOUS AVEZ UN PROBLÈME

### "Table coaches n'existe pas"
→ Exécuter le SQL dans Supabase (Action 1)

### "ID app non valide"
→ Vérifier provider Facebook actif (Action 2)

### "Erreur 400 checkout"
→ Vérifier STRIPE_SECRET_KEY (Action 3)

---

## 🎯 APRÈS CES 3 ACTIONS

**Vous pourrez :**
1. Se connecter avec Facebook
2. Accéder au dashboard
3. Payer avec Stripe
4. Tester avec un vrai lead

**Ensuite :**
1. Générer vidéo NotebookLM
2. Tester avec 1 coach beta
3. Lancer la prospection !

---

**COMMENCEZ PAR L'ACTION 1 (la plus importante) !** 👆

*Ces 3 actions débloquent TOUT le reste.*
