# 🚀 Guide de Connexion - FitFlow

**Date : 18 février 2026**

---

## 📊 **ÉTAT ACTUEL DE VOTRE PROJET**

### ✅ **Ce qui est déployé**
- **URL Production** : https://fit-flow-h6b6fzv80-souleymanes-projects-02da0143.vercel.app/
- **URL Alternative** : https://fit-flow-gamma.vercel.app
- **Statut** : Déployé et protégé par authentification (normal)
- **Backend** : Supabase connecté
- **IA** : Gemini API configurée

### 📦 **Technologies utilisées**
- **Frontend** : Next.js 16.1.1 + React 19 + Tailwind CSS
- **Backend** : Supabase (Auth + Database)
- **IA** : Google Gemini 2.5-flash
- **Paiements** : Stripe (à configurer)
- **OAuth** : Facebook/Instagram

---

## 🔧 **CONFIGURATION LOCALE**

### **1. Variables d'environnement manquantes**

J'ai créé un fichier `.env.local` pour vous. Vous devez le compléter avec vos clés Supabase :

```bash
# Ouvrez ce fichier et remplissez les valeurs manquantes :
# FitFlow/.env.local
```

**Clés à récupérer depuis Supabase :**

1. Allez sur : https://supabase.com/dashboard/project/lryjyzqrhtepsvqlzzdy/settings/api

2. Copiez ces valeurs dans `.env.local` :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (déjà rempli)
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

3. Pour Instagram App Secret :
   - Allez sur : https://developers.facebook.com/apps/4318616691715057/settings/basic/
   - Copiez **App Secret** → `INSTAGRAM_APP_SECRET`

---

## 🚀 **DÉMARRAGE LOCAL**

### **Installation (en cours...)**
```bash
cd FitFlow
npm install  # Installation en cours...
```

### **Une fois l'installation terminée :**
```bash
# 1. Vérifier que .env.local est rempli
cat .env.local

# 2. Lancer le serveur de développement
npm run dev

# 3. Ouvrir dans votre navigateur
# http://localhost:3000
```

---

## 🔐 **ACCÈS À VOTRE APPLICATION DÉPLOYÉE**

### **Pourquoi vous voyez une erreur 401 ?**

C'est **NORMAL** ! Votre application est protégée par authentification.

### **Comment accéder au dashboard ?**

**Option 1 : Créer un compte**
1. Allez sur : https://fit-flow-gamma.vercel.app/signup
2. Connectez-vous avec Facebook
3. Vous serez redirigé vers `/dashboard`

**Option 2 : Se connecter**
1. Allez sur : https://fit-flow-gamma.vercel.app/login
2. Connectez-vous avec Facebook
3. Accédez à votre dashboard

---

## 📋 **ROUTES DISPONIBLES**

### **Pages publiques (pas besoin de login) :**
- `/` - Landing page
- `/login` - Page de connexion
- `/signup` - Inscription
- `/pricing` - Tarifs
- `/demo-video` - Démo vidéo
- `/support` - Support

### **Pages protégées (nécessitent authentification) :**
- `/dashboard` - Tableau de bord principal
- `/onboarding` - Configuration initiale
- `/settings` - Paramètres
- `/schedule` - Planning

---

## 🗄️ **DONNÉES SUPABASE ACTUELLES**

D'après la livraison du 16 février :

```
✅ Coaches: 1 (demo.coach@example.com)
✅ Leads: 3 vrais leads
✅ Conversations: 3
✅ Messages: 6
```

**Tables Supabase :**
- `coaches` - Profils des coachs
- `leads` - Prospects Instagram
- `conversations` - Fils de discussion
- `messages` - Messages échangés

---

## ⚙️ **VÉRIFICATIONS IMPORTANTES**

### **1. Variables d'environnement Vercel**

Vérifiez que ces variables sont bien configurées sur Vercel :

1. Allez sur : https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Vérifiez la présence de :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_INSTAGRAM_APP_ID`
   - `GEMINI_API_KEY` ← **IMPORTANT pour l'IA**

### **2. Configuration Facebook OAuth**

Vérifiez les Redirect URIs dans Meta Developers :

1. Allez sur : https://developers.facebook.com/apps/4318616691715057/fb-login/settings/
2. Valid OAuth Redirect URIs doit contenir :
   ```
   https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
   https://fit-flow-gamma.vercel.app/auth/callback
   ```

---

## 🧪 **TESTER LE PROJET**

### **Test complet du flow :**

```bash
# 1. Vérifier l'installation
npm run build

# 2. Tester en local
npm run dev

# 3. Tester la connexion Supabase
node scripts/verify-connections.js

# 4. Tester Instagram (si configuré)
node scripts/test-instagram-config.js
```

---

## 🐛 **DÉPANNAGE**

### **Erreur : "Supabase client not initialized"**
→ Vérifiez que `.env.local` contient les bonnes clés Supabase

### **Erreur : "Invalid redirect URI" (Facebook)**
→ Vérifiez les URLs dans Meta Developers

### **Le dashboard ne charge pas**
→ Ouvrez la console (F12) et vérifiez les erreurs réseau

### **"Module not found"**
→ Relancez `npm install`

---

## 📞 **PROCHAINES ÉTAPES**

### **Court terme (aujourd'hui) :**
1. ✅ Installer les dépendances (en cours)
2. ⏳ Compléter `.env.local` avec vos clés
3. ⏳ Tester en local avec `npm run dev`
4. ⏳ Se connecter au dashboard

### **Moyen terme (cette semaine) :**
1. Configurer l'intégration Instagram Business API
2. Tester le Content AI Analyzer
3. Ajouter vos propres données de test
4. Configurer Stripe pour les paiements

### **Long terme (ce mois) :**
1. Inviter des bêta testeurs
2. Lancer en bêta privée
3. Affiner l'IA selon les retours
4. Préparer le lancement public

---

## 📚 **DOCUMENTATION DISPONIBLE**

Dans le dossier `docs/` :
- `SETUP_GUIDE.md` - Guide complet d'installation
- `INTEGRATION_GUIDE.md` - Intégrations tierces
- `GHL_INTEGRATION_GUIDE.md` - GoHighLevel
- `N8N_WORKFLOWS.md` - Automatisations n8n

À la racine :
- `LIVRAISON_FINALE_16FEV.md` - État de la dernière livraison
- `GUIDE_SUPABASE_AUTH_FACEBOOK.md` - Configuration Facebook

---

## ✅ **CHECKLIST DE DÉMARRAGE**

- [ ] `npm install` terminé
- [ ] `.env.local` complété avec les clés Supabase
- [ ] `.env.local` complété avec Instagram App Secret
- [ ] `npm run dev` fonctionne
- [ ] Accès à http://localhost:3000
- [ ] Connexion Facebook testée
- [ ] Dashboard accessible
- [ ] Données Supabase visibles

---

## 🎯 **OBJECTIF**

**Vous devriez pouvoir :**
1. Lancer le projet en local
2. Vous connecter avec Facebook
3. Voir votre dashboard avec les vraies données
4. Tester l'analyseur de contenu IA
5. Naviguer dans toutes les pages

---

**Créé par Rovo Dev - 18 février 2026**
