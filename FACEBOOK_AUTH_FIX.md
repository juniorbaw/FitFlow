# 🔧 FIX - Erreur Facebook "ID d'app non valide"

## ❌ ERREUR

```
ID d'app non valide
L'identifiant d'application fourni ne semble pas valide.
```

## 🔍 CAUSES POSSIBLES

### 1. Supabase Facebook Provider pas configuré

**Vérification :**
1. Aller sur : https://lryjyzqrhtepsvqlzzdy.supabase.co/project/_/auth/providers
2. Chercher **Facebook** dans la liste
3. Vérifier si **Enable Sign in with Facebook** est ON

**Si pas configuré, voici comment faire :**

---

## ✅ SOLUTION COMPLÈTE

### ÉTAPE 1 : Configurer Supabase Auth Provider

1. **Aller sur Supabase Dashboard**
   ```
   https://lryjyzqrhtepsvqlzzdy.supabase.co/project/_/auth/providers
   ```

2. **Cliquer sur Facebook** dans la liste des providers

3. **Activer et configurer :**
   - **Enable Sign in with Facebook :** Toggle ON ✅
   - **Facebook client ID :** `907823931604024`
   - **Facebook client secret :** [À récupérer dans Meta]
   - **Authorize redirect URL :** (automatique, copier cette URL)

4. **Scopes :** Ajouter exactement ceci :
   ```
   email,public_profile,instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement
   ```

5. **Cliquer Save**

---

### ÉTAPE 2 : Récupérer le Facebook App Secret

1. **Aller sur Meta for Developers**
   ```
   https://developers.facebook.com/apps/907823931604024/settings/basic/
   ```

2. **Settings → Basic**

3. **App Secret :**
   - Cliquer sur **Show**
   - Copier la clé (commence par quelque chose comme `a1b2c3d4e5f6...`)

4. **Retourner sur Supabase** (Étape 1, point 3)
   - Coller dans **Facebook client secret**
   - Cliquer **Save**

---

### ÉTAPE 3 : Configurer Meta (Redirect URIs)

1. **Dans Meta for Developers**
   ```
   https://developers.facebook.com/apps/907823931604024/fb-login/settings/
   ```

2. **Facebook Login → Settings**

3. **Valid OAuth Redirect URIs** - Ajouter ces 3 URLs (une par ligne) :
   ```
   https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
   https://fit-flow-gamma.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

4. **Cliquer Save Changes**

---

### ÉTAPE 4 : Vérifier les variables d'environnement

Dans le fichier `.env.local`, vous devriez avoir :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lryjyzqrhtepsvqlzzdy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# PAS besoin de variables Facebook dans .env.local
# Tout est géré par Supabase Auth Provider
```

---

## 🧪 TESTER

1. **Redémarrer le serveur local** (si en dev local)
   ```bash
   npm run dev
   ```

2. **Aller sur /login**
   ```
   http://localhost:3000/login
   OU
   https://fit-flow-gamma.vercel.app/login
   ```

3. **Cliquer "Se connecter avec Facebook"**

4. **Résultat attendu :**
   - Popup Facebook s'ouvre ✅
   - Demande de permissions ✅
   - Pas d'erreur "ID app non valide" ✅

---

## 🚨 SI ÇA NE MARCHE TOUJOURS PAS

### Erreur : "App not set up correctly"

**Cause :** Mode développement Meta

**Solution :**
1. Meta Dashboard → **App Mode** (en haut)
2. Si mode **Development** :
   - Ajouter votre compte comme **Testeur**
   - Settings → Roles → **Add Testers**
   - Ajouter votre compte Facebook

### Erreur : "Invalid redirect_uri"

**Cause :** URL de callback mal configurée

**Solution :**
1. Vérifier que les 3 URLs sont EXACTEMENT comme dans Étape 3
2. Pas d'espace, pas de slash `/` en fin d'URL

### Erreur : "Permissions not granted"

**Cause :** Permissions Instagram pas encore approuvées

**Solution :**
1. Pour tester, utiliser seulement `email,public_profile`
2. Les permissions Instagram seront demandées après App Review

---

## 📋 CHECKLIST COMPLÈTE

**Configuration Supabase :**
- [ ] Provider Facebook activé
- [ ] App ID `907823931604024` ajouté
- [ ] App Secret ajouté (récupéré de Meta)
- [ ] Scopes configurés
- [ ] Callback URL copié

**Configuration Meta :**
- [ ] Valid OAuth Redirect URIs ajoutées (3 URLs)
- [ ] App Secret récupéré
- [ ] Mode Development (testeurs ajoutés) ou Live

**Test :**
- [ ] Clic bouton Facebook ouvre popup
- [ ] Pas d'erreur "ID app non valide"
- [ ] Redirection vers /auth/callback fonctionne

---

## 🎯 RÉSULTAT ATTENDU

Une fois tout configuré :

1. Utilisateur clique **"Se connecter avec Facebook"**
2. Popup Facebook s'ouvre
3. Facebook demande les permissions
4. Utilisateur autorise
5. **Redirection vers `/auth/callback`**
6. **Profil coach créé dans Supabase**
7. **Redirection vers `/onboarding` ou `/dashboard`**

---

**Suivez ces étapes dans l'ordre et ça marchera ! 🚀**
