# Configuration Instagram OAuth - Guide Complet

## 🚨 Problème: "Page n'est pas disponible" au login Instagram

Le message d'erreur "Page n'est pas disponible" signifie que:
1. L'URL de redirection n'est PAS sur la liste blanche dans Instagram Developer
2. Ou l'App ID/Secret est invalide ou révoqué

---

## ✅ SOLUTION: Configurer Instagram Developer Dashboard

### Étape 1: Accédez à votre application Facebook

1. Allez sur [developers.facebook.com](https://developers.facebook.com)
2. Connectez-vous avec votre compte
3. Allez à **"My Apps"** (Mes apps)
4. Sélectionnez l'app **"FitFlow"**

### Étape 2: Vérifiez les credentials

**Settings → Basic:**
- ✅ App ID: `2136424887099200` (doit correspondre à `NEXT_PUBLIC_INSTAGRAM_APP_ID`)
- ✅ App Secret: `4d6b47bbbfac65d17e0b8f709be2b175` (doit correspondre à `INSTAGRAM_APP_SECRET`)
- ❌ **SI CES VALEURS SONT DIFFÉRENTES**: Mettez à jour votre `.env.local`

### Étape 3: Configurez Instagram Product

1. Dans le menu latéral gauche, trouvez **"Instagram"**
2. Allez à **"Instagram Graph API"** → **"Configuration"** (ou **"Settings"**)
3. Dans la section **"Valid OAuth Redirect URIs"**, ajoutez:

```
https://fit-flow-gamma.vercel.app/api/auth/instagram/callback
```

**Pour le développement local**, ajoutez aussi:
```
http://localhost:3000/api/auth/instagram/callback
```

### Étape 4: Configurez les Scopes (Portées)

Dans les paramètres Instagram, assurez-vous que les scopes suivants sont activés:
- ✅ `user_profile`
- ✅ `instagram_business_basic`
- ✅ `instagram_business_content_publish`

### Étape 5: Vérifiez le Domain Whitelist

**Settings → Basic → App Domains:**

Ajoutez les domaines:
```
fit-flow-gamma.vercel.app
localhost
```

---

## 🔍 Vérification de votre Configuration

### URL de Redirection Complète

Votre redirect URI doit être **EXACTEMENT**:
```
https://fit-flow-gamma.vercel.app/api/auth/instagram/callback
```

Pas d'espaces, pas de différences mineures!

### Variables d'Environnement

Vérifiez votre `.env.local`:
```
NEXT_PUBLIC_INSTAGRAM_APP_ID=2136424887099200
INSTAGRAM_APP_SECRET=4d6b47bbbfac65d17e0b8f709be2b175
NEXT_PUBLIC_APP_URL=https://fit-flow-gamma.vercel.app
```

---

## 🐛 Debugging

Si vous avez toujours des problèmes:

### 1. Vérifiez les logs Vercel

Allez sur [vercel.com](https://vercel.com) → votre projet → Deployments → Logs

Cherchez les messages avec:
- `📱 Instagram OAuth Request:`
- `❌ Instagram error:` (pour voir l'erreur exacte d'Instagram)

### 2. Testez localement

Pour tester en développement:

```bash
npm run dev
# Ouvrez: http://localhost:3000/settings
```

Vérifiez que vous avez ajouté `http://localhost:3000/api/auth/instagram/callback` dans Instagram Developer.

### 3. Erreurs courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `invalid_request` | Credentials invalides | Vérifiez App ID & Secret |
| `invalid_scope` | Scopes non autorisés | Activez les scopes dans Instagram Developer |
| `redirect_uri_mismatch` | URL de redirection incorrecte | Vérifiez la configuration du redirect URI |
| `access_denied` | L'utilisateur a refusé | C'est normal, relancez |

---

## ✨ Après Configuration

1. **Committez les changements**:
```bash
git add -A
git commit -m "Improve Instagram OAuth debugging"
git push
```

2. **Vercel redéploiera automatiquement**

3. **Testez le login Instagram** depuis `/settings`

4. **Vérifiez les logs** pour vous assurer que tout fonctionne

---

## 📚 Ressources

- [Meta OAuth Documentation](https://developers.facebook.com/docs/facebook-login/guides-and-tutorials)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Troubleshooting OAuth](https://developers.facebook.com/docs/facebook-login/troubleshooting)
