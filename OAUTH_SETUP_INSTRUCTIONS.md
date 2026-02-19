# 🔐 CONFIGURATION OAUTH FACEBOOK (URGENT)

## Étape 1: Facebook App Dashboard

Allez sur: https://developers.facebook.com/apps/4318616691715057/

## Étape 2: Configure Facebook Login

1. **Products** → **Facebook Login** → **Settings**
2. **Valid OAuth Redirect URIs**, ajoutez:
   ```
   https://fit-flow-gamma.vercel.app/auth/callback
   https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
3. **Save Changes**

## Étape 3: Supabase Dashboard

Allez sur: https://supabase.com/dashboard/project/lryjyzqrhtepsvqlzzdy/auth/providers

1. **Facebook provider** → **Enabled**
2. **Facebook Client ID**: `4318616691715057`
3. **Facebook Client Secret**: (votre secret)
4. **Authorized Client IDs** (laissez vide)
5. **Skip nonce check**: OFF
6. **Save**

## Étape 4: Test

1. Allez sur https://fit-flow-gamma.vercel.app/login
2. Click "Se connecter avec Facebook"
3. Devrait rediriger vers Facebook
4. Autoriser l'app
5. Retour automatique vers /dashboard

## ❌ ERREUR ACTUELLE

"URI redirigée n'est pas approuvée"

**Cause**: L'URL callback n'est pas dans la whitelist Facebook

**Fix**: Faire Étapes 1-2 ci-dessus

---

## ✅ AUTH EMAIL - SUPABASE CONFIG

Pour que l'auth email marche SANS confirmation:

1. Supabase Dashboard → **Authentication** → **Email Auth**
2. **Confirm email**: DISABLED
3. **Save**

Sinon, l'utilisateur doit confirmer son email avant de se connecter.
