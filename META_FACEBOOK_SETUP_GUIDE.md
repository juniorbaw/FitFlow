# 🔐 GUIDE COMPLET - Configuration Meta/Facebook pour FitFlow

## 📋 INFORMATIONS DE VOTRE APP

**App ID :** `907823931604024`
**App Name :** FitFlow

---

## ✅ ÉTAPE 1 : Configuration dans Meta for Developers

### 1.1 Aller sur Meta for Developers

URL : https://developers.facebook.com/apps/907823931604024/

### 1.2 Configurer Facebook Login

1. Dans le menu gauche → **Facebook Login** → **Settings**
2. **Valid OAuth Redirect URIs** - Ajouter ces 3 URLs :

```
https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
https://fit-flow-gamma.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

3. **Cliquer Save Changes**

### 1.3 Configurer Instagram Basic Display

1. Menu gauche → **Instagram Basic Display**
2. **Valid OAuth Redirect URIs** - Ajouter :

```
https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
https://fit-flow-gamma.vercel.app/auth/callback
```

3. **Cliquer Save Changes**

### 1.4 Permissions à demander

Dans **App Review** → **Permissions and Features**, demander :

**Pour Instagram :**
- ✅ `instagram_basic` (Approuvé automatiquement)
- ✅ `instagram_manage_comments` (Demander review)
- ✅ `instagram_manage_messages` (Demander review)
- ✅ `pages_show_list` (Approuvé automatiquement)
- ✅ `pages_read_engagement` (Demander review)

**Pour Facebook :**
- ✅ `email` (Approuvé automatiquement)
- ✅ `public_profile` (Approuvé automatiquement)

### 1.5 Récupérer les clés

1. **Settings** → **Basic**
2. Copier :
   - **App ID :** `907823931604024`
   - **App Secret :** (cliquer Show, copier)

---

## ✅ ÉTAPE 2 : Configuration dans Supabase

### 2.1 Aller dans Supabase Dashboard

URL : https://lryjyzqrhtepsvqlzzdy.supabase.co/project/_/auth/providers

### 2.2 Activer Facebook Provider

1. Cliquer sur **Facebook**
2. Toggle **Enable Facebook** : ON
3. Remplir :
   - **Facebook client ID :** `907823931604024`
   - **Facebook client secret :** (votre App Secret copié)
4. **Scopes** - Ajouter :
   ```
   email,public_profile,instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement
   ```
5. **Cliquer Save**

### 2.3 Copier le Callback URL Supabase

Supabase vous donne une URL :
```
https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
```

**Retourner dans Meta (étape 1.2)** et vérifier qu'elle est bien dans les Redirect URIs.

---

## ✅ ÉTAPE 3 : Tester l'authentification

### Test en local (localhost:3000)

1. Démarrer le serveur :
   ```bash
   cd "Desktop/FitFlow Launch"
   npm run dev
   ```

2. Aller sur : http://localhost:3000/login

3. Cliquer **"Se connecter avec Facebook"**

4. Vous devriez voir :
   - Popup Facebook
   - Demande de permissions
   - Redirection vers /dashboard

### Test en production

1. Aller sur : https://fit-flow-gamma.vercel.app/login
2. Même processus
3. Vérifier dans Supabase → Authentication → Users

---

## 🔧 CONFIGURATION AVANCÉE

### Mode Test vs Mode Live

**Mode Test (Development)** :
- Seuls les testeurs de l'app peuvent se connecter
- Ajouter des testeurs : Settings → Roles → Add Testers

**Mode Live (Production)** :
- Soumettre l'app pour review (App Review)
- Demander les permissions nécessaires
- Une fois approuvé, n'importe qui peut se connecter

### Permissions Instagram - Justification pour Review

Quand vous soumettez pour review, Meta demande **pourquoi** vous avez besoin de ces permissions :

**instagram_manage_comments :**
```
FitFlow détecte automatiquement les leads potentiels dans les commentaires Instagram 
et envoie une réponse automatique. Cette permission est nécessaire pour lire et 
répondre aux commentaires des utilisateurs.
```

**instagram_manage_messages :**
```
FitFlow envoie des messages personnalisés automatiques aux utilisateurs qui ont 
commenté des posts Instagram. Cette permission est nécessaire pour engager la 
conversation en DM.
```

**pages_read_engagement :**
```
FitFlow analyse les statistiques d'engagement des posts Instagram pour aider les 
coachs à optimiser leur contenu.
```

### Vidéo de démo pour App Review

Meta demande une vidéo montrant comment l'app utilise les permissions :

1. Enregistrer votre écran (Loom/QuickTime)
2. Montrer :
   - Login Facebook
   - Connexion Instagram
   - Détection d'un commentaire
   - Envoi d'un DM automatique
3. Uploader sur YouTube (unlisted)
4. Copier le lien dans App Review

---

## 📊 DONNÉES STOCKÉES DANS SUPABASE

Après connexion Facebook/Instagram, Supabase stocke :

```sql
-- Table: auth.users
{
  "id": "uuid",
  "email": "coach@example.com",
  "user_metadata": {
    "provider": "facebook",
    "facebook_id": "123456789",
    "instagram_id": "987654321",
    "instagram_username": "coach_fitness",
    "instagram_profile_picture": "https://...",
    "access_token": "EAAMY...",  -- Token Instagram
    "token_expires_at": "2026-05-01"
  }
}

-- Table: coaches
{
  "id": "uuid",
  "user_id": "uuid (FK auth.users)",
  "instagram_username": "coach_fitness",
  "instagram_id": "987654321",
  "access_token": "EAAMY...",  -- Pour API Instagram
  "token_expires_at": "2026-05-01",
  "subscription_tier": "starter",
  "subscription_status": "active"
}
```

---

## 🧪 TESTER AVEC DES UTILISATEURS TEST

### Ajouter un utilisateur test

1. Meta Dashboard → **Roles** → **Test Users**
2. Cliquer **Add**
3. Créer un utilisateur de test
4. Copier le login/password
5. Utiliser ces identifiants pour tester la connexion

### Connecter un compte Instagram de test

1. Meta Dashboard → **Instagram** → **Test Users**
2. Lier un compte Instagram de test
3. Utiliser ce compte pour tester les permissions Instagram

---

## 🚨 ERREURS COURANTES

### Erreur : "Invalid OAuth Redirect URI"

**Cause :** L'URL de callback n'est pas dans les Redirect URIs autorisées

**Solution :**
1. Vérifier Meta → Facebook Login → Valid OAuth Redirect URIs
2. Ajouter EXACTEMENT l'URL de callback Supabase
3. Pas d'espace, pas de slash en fin d'URL

### Erreur : "This app is in development mode"

**Cause :** L'app n'est pas en mode Live

**Solution :**
1. Ajouter votre compte en tant que testeur
2. Ou soumettre l'app pour review

### Erreur : "Permission denied: instagram_manage_comments"

**Cause :** Permission pas encore approuvée par Meta

**Solution :**
1. Utiliser un compte test pour développer
2. Soumettre l'app pour review avec justification + vidéo

### Erreur : "Token expired"

**Cause :** Le access_token Instagram expire après 60 jours

**Solution :**
1. Implémenter le refresh automatique du token
2. Ou demander à l'utilisateur de se reconnecter

---

## 📋 CHECKLIST COMPLÈTE

**Configuration Meta :**
- [ ] App créée (ID: 907823931604024)
- [ ] Facebook Login configuré
- [ ] Instagram Basic Display configuré
- [ ] Redirect URIs ajoutées
- [ ] App Secret copié

**Configuration Supabase :**
- [ ] Provider Facebook activé
- [ ] App ID et Secret ajoutés
- [ ] Scopes configurés
- [ ] Callback URL copié dans Meta

**Test :**
- [ ] Login Facebook fonctionne en local
- [ ] Login Facebook fonctionne en prod
- [ ] Instagram username récupéré
- [ ] Access token stocké dans Supabase
- [ ] Redirection vers dashboard OK

**Production :**
- [ ] App Review soumise
- [ ] Permissions approuvées
- [ ] Mode Live activé
- [ ] Vidéo de démo uploadée

---

## 🎯 PROCHAINE ÉTAPE

Une fois la configuration Meta terminée :

1. **Tester le login** sur /login
2. **Vérifier Supabase** que les données sont stockées
3. **Implémenter l'onboarding** (4 étapes)
4. **Connecter ManyChat** avec le access_token

---

**Tout est prêt ! Continuez la configuration Meta et dites-moi quand c'est fait !** 🚀
