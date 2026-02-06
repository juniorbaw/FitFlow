# 📱 Configuration Facebook Developer - Guide Complet

## 🔗 Lien direct
👉 https://developers.facebook.com/apps/

---

## 📋 Ce que vous devez configurer

### Partie 1: Vérifier les credentials basiques

**URL:** https://developers.facebook.com/apps/ → Sélectionnez **FitFlow** → **Settings** → **Basic**

✅ Vérifiez/notez:
- **App ID**: Doit être `4318616691715057`
- **App Secret**: Doit être `a667e928daee99ec432b7a829394dc6a`
- **App Domains**: Doit contenir `fit-flow-gamma.vercel.app`

Si des valeurs diffèrent, **mettez à jour `.env.local` et Vercel** avec les bonnes valeurs.

---

### Partie 2: Configurer Instagram OAuth Redirect URI

⚠️ **C'EST LA PARTIE LA PLUS IMPORTANTE**

**URL:** https://developers.facebook.com/apps/ → **FitFlow** → **Products** (menu gauche) → **Instagram** (ou cherchez "Instagram Graph API")

Puis cliquez sur **"Instagram Graph API"** → **"Settings"** ou **"Configuration"**

#### Où ajouter le Redirect URI:

Cherchez la section **"Valid OAuth Redirect URIs"** (ou "Redirect URIs")

Ajoutez exactement ces 2 URLs:

**1. Production:**
```
https://fit-flow-gamma.vercel.app/api/auth/instagram/callback
```

**2. Development (facultatif, pour tester localement):**
```
http://localhost:3000/api/auth/instagram/callback
```

✅ **Sauvegardez** (bouton "Save" ou similaire)

---

### Partie 3: Configurer les Scopes

Toujours dans Instagram → Settings/Configuration

Vérifiez que ces **scopes** sont **activés/cochés**:
- ✅ `user_profile`
- ✅ `instagram_business_basic`
- ✅ `instagram_business_content_publish`

Si ce ne sont pas les bons, cherchez la section "Scopes" ou "Permissions" et activez-les.

---

### Partie 4: État de l'App (Live vs Development)

**URL:** https://developers.facebook.com/apps/ → **FitFlow** → **Settings** → **Basic**

Cherchez la section **"App Status"**:

- Si l'app est en **"Development"**: Seuls les admins et testers peuvent se connecter
- Si l'app est en **"Live"**: N'importe qui peut se connecter

**👉 Pour tester comme utilisateur normal:**
1. Allez à **Settings** → **Roles**
2. Ajoutez votre adresse email comme **Admin** ou **Tester** (développement)
3. OU changez l'app en **"Live"** (production)

---

## 🔧 Étapes rapides pour configurer

### 1️⃣ Ouvrez Facebook Developer
- URL: https://developers.facebook.com/apps/
- Cliquez sur **FitFlow**

### 2️⃣ Allez à Instagram Settings
- Menu gauche → **Products**
- Trouvez **Instagram Graph API**
- Cliquez sur **Settings** ou **Configuration**

### 3️⃣ Ajoutez le Redirect URI
- Section **"Valid OAuth Redirect URIs"**
- Ajoutez: `https://fit-flow-gamma.vercel.app/api/auth/instagram/callback`
- Click: **Add URI** ou **Save**

### 4️⃣ Vérifiez les Scopes
- Assurez-vous que `user_profile`, `instagram_business_basic`, et `instagram_business_content_publish` sont ✅

### 5️⃣ Testez localement (optionnel)
- Ajoutez aussi: `http://localhost:3000/api/auth/instagram/callback`
- Cliquez **Add URI** et **Save**

### 6️⃣ Vérifiez l'état de l'app
- Settings → Basic → **App Status**
- Si Development: Assurez-vous d'être dans les **Roles** → **Admins/Testers**

---

## ❓ Questions fréquentes

### Q: Où trouver "Valid OAuth Redirect URIs"?
**A:** Instagram Settings/Configuration. Si vous ne voyez pas cette section:
1. Assurez-vous que l'**Instagram Graph API** product est additionné
2. Sinon, cliquez **Add Product** → cherchez **Instagram** → **Add**

### Q: L'URL doit-elle avoir un trailing slash?
**A:** NON. Utilisez exactement: `https://fit-flow-gamma.vercel.app/api/auth/instagram/callback` (pas `/...callback/`)

### Q: Pourquoi "app_not_configured"?
**A:** Généralement parce que:
1. Le Redirect URI n'est pas dans la liste blanche
2. L'App ID ou Secret est incorrect
3. Vercel n'a pas les variables d'environnement

### Q: Comment tester si le Redirect URI est correct?
**A:** Allez à http://localhost:3000/settings (en dev) ou https://fit-flow-gamma.vercel.app/settings (en prod), cliquez "Connect Instagram", regardez le navigateur:
- Si vous êtes redirigé vers **instagram.com/oauth...** = Bon!
- Si vous voyez **"Page n'est pas disponible"** = Redirect URI incorrect ou App ID/Secret mauvais

---

## ✅ Checklist complète

- [ ] **Settings → Basic**:
  - [ ] App ID noté: `4318616691715057`
  - [ ] App Secret noté: `a667e928daee99ec432b7a829394dc6a`
  - [ ] App Domains: `fit-flow-gamma.vercel.app` ✅

- [ ] **Instagram → Configuration**:
  - [ ] Valid OAuth Redirect URIs:
    - [ ] `https://fit-flow-gamma.vercel.app/api/auth/instagram/callback` ✅
    - [ ] `http://localhost:3000/api/auth/instagram/callback` (optionnel dev) ✅
  - [ ] Scopes activés:
    - [ ] `user_profile` ✅
    - [ ] `instagram_business_basic` ✅
    - [ ] `instagram_business_content_publish` ✅

- [ ] **App Status**:
  - [ ] Vous êtes admin/tester (ou app est Live)

---

## 📞 Support

Si vous êtes bloqué:
1. Vérifiez les **logs Vercel** (Deployments → Logs)
2. Cherchez les messages:
   - `📱 Instagram OAuth Request:` → Vérifiez l'App ID
   - `❌ Token exchange error:` → Vérifiez l'App Secret
   - `redirect_uri_mismatch` → Vérifiez le Redirect URI
3. Partagez le message d'erreur exact avec le support

