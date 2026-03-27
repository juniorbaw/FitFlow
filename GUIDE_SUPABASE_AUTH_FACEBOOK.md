# 🔐 GUIDE COMPLET - Configuration Supabase Auth Facebook

**Temps estimé : 10-15 minutes**

---

## ✅ **PRÉREQUIS**

- Meta App ID: `907823931604024` (déjà configurée)
- Accès Supabase Dashboard: https://supabase.com/dashboard/project/lryjyzqrhtepsvqlzzdy

---

## 📋 **ÉTAPES À SUIVRE**

### **ÉTAPE 1 : Activer Facebook Auth dans Supabase (3 min)**

1. Allez sur : https://supabase.com/dashboard/project/lryjyzqrhtepsvqlzzdy/auth/providers

2. Cherchez "Facebook" dans la liste des providers

3. Cliquez sur le toggle pour **activer** Facebook

4. Remplissez les champs :
   - **Facebook Client ID** : `907823931604024`
   - **Facebook Client Secret** : `5a1bdf56455a043bf6efafc5f60d82e7` (dans votre .env.local : INSTAGRAM_APP_SECRET)

5. **Redirect URL** à ajouter dans Meta :
   ```
   https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
   ```

6. Cliquez **Save**

---

### **ÉTAPE 2 : Configurer Meta App (5 min)**

1. Allez sur : https://developers.facebook.com/apps/907823931604024/fb-login/settings/

2. Dans **Valid OAuth Redirect URIs**, ajoutez :
   ```
   https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
   https://fit-flow-gamma.vercel.app/auth/callback
   ```

3. Activez **"Use Strict Mode for Redirect URIs"**

4. Cliquez **Save Changes**

---

### **ÉTAPE 3 : Vérifier les Variables Vercel (3 min)**

1. Allez sur : https://vercel.com/dashboard

2. Sélectionnez le projet **fit-flow-gamma**

3. **Settings** → **Environment Variables**

4. Vérifiez que ces variables existent :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://lryjyzqrhtepsvqlzzdy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_INSTAGRAM_APP_ID=907823931604024
   INSTAGRAM_APP_SECRET=5a1bdf56455a043bf6efafc5f60d82e7
   ```

5. Si elles manquent, ajoutez-les avec les valeurs de `.env.local`

---

### **ÉTAPE 4 : Tester l'Authentification (2 min)**

1. Allez sur : https://fit-flow-gamma.vercel.app/login

2. Cliquez sur **"Se connecter avec Facebook"**

3. Autorisez l'application

4. Vous devriez être redirigé vers `/dashboard`

5. **Vérifiez dans Supabase** : https://supabase.com/dashboard/project/lryjyzqrhtepsvqlzzdy/auth/users
   → Vous devriez voir votre compte créé

---

## 🐛 **DÉPANNAGE**

### **Erreur : "Invalid redirect URI"**
➜ Vérifiez que l'URL `https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback` est bien dans Meta

### **Erreur : "Application not authorized"**
➜ Votre Meta App doit être en mode "Development" OU vous devez être ajouté comme testeur

### **Rien ne se passe**
➜ Ouvrez la console Chrome (F12) et cherchez des erreurs JavaScript

---

## ✅ **CONFIRMATION QUE ÇA MARCHE**

Une fois connecté, vous devriez :
- ✅ Voir votre email dans le header du dashboard
- ✅ Pouvoir accéder à `/dashboard` sans être redirigé
- ✅ Voir vos données dans Supabase Auth

---

## 📞 **BESOIN D'AIDE ?**

Si vous bloquez, envoyez-moi :
1. Une capture d'écran de l'erreur
2. L'URL où ça bloque
3. Les logs de la console (F12)

---

**Une fois cette configuration terminée, je pourrai connecter le dashboard aux vraies données demain matin !**

Junior - 15 février 2026, 23h
