# 🔧 Fix: app_not_configured Error

## ❌ Problème

L'erreur **"Erreur de connexion Instagram: app_not_configured"** signifie que les variables d'environnement n'ont pas été configurées sur Vercel.

## 🔍 Cause

Les variables d'environnement `.env.local` sont **locales seulement**. Elles ne sont PAS envoyées à Vercel par défaut. De plus, la variable Instagram n'avait pas le préfixe `NEXT_PUBLIC_` nécessaire.

### Variables qui manquent sur Vercel:
```
NEXT_PUBLIC_INSTAGRAM_APP_ID = 4318616691715057
INSTAGRAM_APP_SECRET = a667e928daee99ec432b7a829394dc6a
SUPABASE_SERVICE_ROLE_KEY = [voir .env.local]
```

---

## ✅ SOLUTION

### Étape 1: Allez au dashboard Vercel

1. **URL:** https://vercel.com/dashboard/fit-flow/settings/environment-variables
2. Connectez-vous si nécessaire

### Étape 2: Ajoutez les variables manquantes

Cliquez sur "Add New" et ajoutez:

#### Variable 1:
- **Name:** `NEXT_PUBLIC_INSTAGRAM_APP_ID`
- **Value:** `4318616691715057`
- **Select Environments:** Development + Preview + Production
- **Click:** Add

#### Variable 2:
- **Name:** `INSTAGRAM_APP_SECRET`
- **Value:** `a667e928daee99ec432b7a829394dc6a`
- **Select Environments:** Development + Preview + Production
- **Click:** Add

#### Variable 3 (si elle n'existe pas):
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** (voir ci-dessous)
- **Select Environments:** Development + Preview + Production
- **Click:** Add

Pour la valeur de `SUPABASE_SERVICE_ROLE_KEY`, allez dans votre `.env.local`:
```bash
grep "SUPABASE_SERVICE_ROLE_KEY" .env.local
```

Et copiez la valeur (le JWT token).

### Étape 3: Redéployez

Une fois les variables ajoutées:

```bash
cd "/Users/souleyjr/Desktop/FitFlow Launch"
git push
```

Vercel redéploiera automatiquement avec les nouvelles variables.

---

## 🧪 Test après déploiement

1. **Attendez 2-3 min** que le build finisse sur Vercel
2. **Allez sur:** https://fit-flow-gamma.vercel.app/settings
3. **Cliquez sur "Connect Instagram"**
4. **Vous devriez voir** la page Instagram OAuth (pas "app_not_configured")

---

## 📋 Variables d'environnement Vercel actuelles

Vérifiez que vous avez **AU MINIMUM** ces variables:

```
✅ NEXT_PUBLIC_INSTAGRAM_APP_ID = 4318616691715057
✅ INSTAGRAM_APP_SECRET = a667e928daee99ec432b7a829394dc6a
✅ NEXT_PUBLIC_APP_URL = https://fit-flow-gamma.vercel.app
✅ NEXT_PUBLIC_SUPABASE_URL = https://lophxncjsbmkfxhjdgkp.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY = [your key]
✅ SUPABASE_SERVICE_ROLE_KEY = [your key]
```

---

## 🐛 Si ça marche toujours pas

1. **Vérifiez le log Vercel:**
   - Allez à: https://vercel.com/dashboard/fit-flow/deployments
   - Dernier déploiement → **Logs**
   - Cherchez: `📱 Instagram OAuth Request`
   - L'App ID devrait être affiché

2. **Vérifiez la configuration Instagram Developer:**
   - https://developers.facebook.com/apps/
   - Valid OAuth Redirect URIs: `https://fit-flow-gamma.vercel.app/api/auth/instagram/callback`

3. **Clear the browser cache:**
   - Appuyez sur Cmd+Shift+Delete (macOS) ou Ctrl+Shift+Delete (Windows)
   - Clear browsing data
   - Rechargez la page

---

## 💡 Autres notes

- Le fichier `.env.local` est ignoré par Git (c'est normal pour la sécurité)
- Les variables d'environnement de Vercel sont gérées dans le dashboard
- Utilisez le préfixe `NEXT_PUBLIC_` pour les variables visibles côté client
- Les variables sans ce préfixe sont serveur seulement

