# 📱 Guide Complet: Où Mettre les IDs et Secrets Instagram

## 🎯 Vue d'ensemble rapide

| Variable | Valeur | Où la mettre | Public? |
|----------|--------|---------------|---------|
| `NEXT_PUBLIC_INSTAGRAM_APP_ID` | `4318616691715057` | Vercel + `.env.local` | ✅ OUI (public) |
| `INSTAGRAM_APP_SECRET` | `a667e928daee99ec432b7a829394dc6a` | Vercel + `.env.local` | ❌ NON (secret) |
| `SUPABASE_SERVICE_ROLE_KEY` | [jwt token] | Vercel + `.env.local` | ❌ NON (secret) |

---

## 🔍 C'est quoi chaque variable?

### 1️⃣ `NEXT_PUBLIC_INSTAGRAM_APP_ID`
- **C'est quoi**: L'ID de votre app Facebook/Instagram (créée sur developers.facebook.com)
- **Valeur**: `4318616691715057`
- **Visibilité**: **PUBLIQUE** (le préfixe `NEXT_PUBLIC_` le rend visible côté client)
- **Utilisé où**:
  - `app/api/auth/instagram/route.ts` (ligne 37) → redirection vers Instagram OAuth
  - `app/api/auth/instagram/callback/route.ts` (ligne 64) → échange du code en token

### 2️⃣ `INSTAGRAM_APP_SECRET`
- **C'est quoi**: La clé secrète de votre app Facebook/Instagram
- **Valeur**: `a667e928daee99ec432b7a829394dc6a`
- **Visibilité**: **PRIVÉE/SERVEUR SEULEMENT** (PAS de `NEXT_PUBLIC_`)
- **Utilisé où**:
  - `app/api/auth/instagram/callback/route.ts` (ligne 68) → pour signer l'échange du code
  - **JAMAIS exposé au navigateur**

### 3️⃣ `SUPABASE_SERVICE_ROLE_KEY`
- **C'est quoi**: Clé secrète de Supabase pour les opérations serveur
- **Valeur**: JWT token commençant par `eyJ...`
- **Visibilité**: **PRIVÉE/SERVEUR SEULEMENT**
- **Utilisé où**:
  - `app/api/auth/instagram/callback/route.ts` (ligne 80+) → sauvegarder le compte Instagram

---

## 📍 OÙ METTRE CES VARIABLES

### Option 1: Fichier `.env.local` (développement local)

**Fichier:** `~/Desktop/FitFlow Launch/.env.local`

Ajoutez/vérifiez ces lignes:
```
# Instagram OAuth
NEXT_PUBLIC_INSTAGRAM_APP_ID=4318616691715057
INSTAGRAM_APP_SECRET=a667e928daee99ec432b7a829394dc6a

# Supabase
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**⚠️ Important:**
- `.env.local` est ignoré par Git (voir `.gitignore`)
- C'est où Node.js les charge en dev avec `npm run dev`
- Les variables publiques (avec `NEXT_PUBLIC_`) sont aussi visibles côté client

### Option 2: Vercel Dashboard (production/preview)

**URL:** https://vercel.com/dashboard/fit-flow/settings/environment-variables

**Étapes:**
1. Cliquez **"Add New"**
2. **Name:** `NEXT_PUBLIC_INSTAGRAM_APP_ID`
   - **Value:** `4318616691715057`
   - **Environments:** Cochez "Production", "Preview", "Development"
   - **Save**
3. Répétez pour `INSTAGRAM_APP_SECRET` et `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Important:**
- Les variables sans `NEXT_PUBLIC_` sont serveur SEULEMENT
- Même si vous les ajoutez, elles ne seront pas visibles côté client
- Elles sont injectées à la compilation/runtime du serveur

---

## 🔄 Flux d'authentification Instagram

Voici où chaque variable est utilisée:

```
1. Utilisateur clique "Connect Instagram" (settings page)
   ↓
2. Redirect vers /api/auth/instagram?user_id=...
   ↓
3. Code utilise NEXT_PUBLIC_INSTAGRAM_APP_ID pour construire:
   https://api.instagram.com/oauth/authorize?client_id=4318616691715057&...
   ↓
4. Utilisateur se connecte à Instagram et approuve
   ↓
5. Instagram redirige vers:
   https://fit-flow-gamma.vercel.app/api/auth/instagram/callback?code=...&state=...
   ↓
6. Code reçoit le 'code'
   ↓
7. Code POST request à Instagram avec:
   - client_id: NEXT_PUBLIC_INSTAGRAM_APP_ID (4318616691715057)
   - client_secret: INSTAGRAM_APP_SECRET (a667e928daee99ec432b7a829394dc6a)
   - code: reçu d'Instagram
   - redirect_uri: https://fit-flow-gamma.vercel.app/api/auth/instagram/callback
   ↓
8. Instagram valide et renvoi l'access_token
   ↓
9. Code utilise l'access_token pour récupérer les info du compte
   ↓
10. Code sauvegarde dans Supabase avec SUPABASE_SERVICE_ROLE_KEY
```

---

## ⚠️ Erreurs courantes et solutions

### Erreur: "Erreur de connexion Instagram: app_not_configured"
**Cause:** `NEXT_PUBLIC_INSTAGRAM_APP_ID` manquante sur Vercel (ou pas de prefix `NEXT_PUBLIC_`)
**Solution:** Ajouter sur Vercel avec le bon prefix

### Erreur: "invalid_client" ou "invalid_request"
**Cause:** `INSTAGRAM_APP_SECRET` incorrect ou pas configuré sur Vercel
**Solution:** Vérifier la valeur exacte sur Facebook Developer > Settings > Basic

### Erreur: "redirect_uri_mismatch"
**Cause:** L'URL de redirection n'est pas dans Facebook Developer
**Solution:** Ajouter `https://fit-flow-gamma.vercel.app/api/auth/instagram/callback` dans Instagram > Configuration > Valid OAuth Redirect URIs

### Erreur: "invalid_grant"
**Cause:** Le code a expiré (>10 minutes) ou App ID/Secret incompatible
**Solution:** Relancer le flux, vérifier que les credentials sont corrects

---

## ✅ Checklist de configuration

- [ ] `.env.local` contient `NEXT_PUBLIC_INSTAGRAM_APP_ID=4318616691715057`
- [ ] `.env.local` contient `INSTAGRAM_APP_SECRET=a667e928daee99ec432b7a829394dc6a`
- [ ] `.env.local` contient `SUPABASE_SERVICE_ROLE_KEY=...`
- [ ] Vercel Dashboard > Settings > Environment Variables:
  - [ ] `NEXT_PUBLIC_INSTAGRAM_APP_ID` (Production/Preview/Development)
  - [ ] `INSTAGRAM_APP_SECRET` (Production/Preview/Development)
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (Production/Preview/Development)
- [ ] Facebook Developer > Your App > Instagram > Configuration:
  - [ ] Valid OAuth Redirect URIs: `https://fit-flow-gamma.vercel.app/api/auth/instagram/callback`
  - [ ] App Domains: `fit-flow-gamma.vercel.app`
- [ ] L'app Facebook est en **Live** ou l'utilisateur est admin/tester

---

## 🚀 Pour tester

### En développement local:
```bash
cd ~/Desktop/FitFlow\ Launch
npm run dev
# Ouvrez http://localhost:3000/settings
# Cliquez "Connect Instagram"
# Regardez la console pour les logs: 📱 Instagram OAuth Request
```

### En production:
```bash
git push  # Déclenche un redeploy Vercel
# Allez à https://fit-flow-gamma.vercel.app/settings
# Cliquez "Connect Instagram"
# Vérifiez les logs Vercel: Deployments > Logs
```

