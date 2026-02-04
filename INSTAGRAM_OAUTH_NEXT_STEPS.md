# ✅ Instagram OAuth - Actions Requises

## 📋 Ce que j'ai fait:

✅ **Amélioré le code OAuth Instagram** avec:
- Logs détaillés pour le debugging
- Meilleure gestion des erreurs
- Messages d'erreur plus clairs
- Vérification complète de la configuration

✅ **Créé un guide complet**: `docs/INSTAGRAM_OAUTH_CONFIG.md`

✅ **Déployé automatiquement sur Vercel**

---

## 🔧 Actions à faire MAINTENANT:

### 1. Vérifiez votre App Facebook/Instagram

**Allez sur:** https://developers.facebook.com/apps/

**Pour votre app "FitFlow":**
- App ID: `2136424887099200`
- App Secret: `4d6b47bbbfac65d17e0b8f709be2b175`

### 2. Configurez le Redirect URI (C'EST IMPORTANT!)

**Allez à:** Settings → Basic → Product Name "Instagram" → Configuration

Ajoutez l'URL exacte dans **"Valid OAuth Redirect URIs"**:
```
https://fit-flow-gamma.vercel.app/api/auth/instagram/callback
```

**Pour le développement local**, ajoutez aussi:
```
http://localhost:3000/api/auth/instagram/callback
```

### 3. Configurez les App Domains

**Settings → Basic → App Domains:**
```
fit-flow-gamma.vercel.app
localhost
```

### 4. Vérifiez les Scopes

Dans Instagram → Configuration, vérifiez que ces scopes sont autorisés:
- ✅ `user_profile`
- ✅ `instagram_business_basic`  
- ✅ `instagram_business_content_publish`

---

## 🧪 Test après Configuration

1. **Attendez 5-10 min** que Facebook synchronise la config
2. **Allez sur:** https://fit-flow-gamma.vercel.app/settings
3. **Cliquez sur "Connect Instagram"**
4. **Vous devriez voir la page Instagram OAuth** (pas "Page n'est pas disponible")

---

## 🐛 Problèmes?

Si vous voyez toujours "Page n'est pas disponible":

### Vérifiez les logs Vercel:
1. Allez sur: https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez à **Deployments** → Dernier déploiement → **Logs**
4. Cherchez les messages `📱 Instagram OAuth` ou `❌`

### Erreurs courantes:

| Erreur | Cause | Solution |
|--------|-------|----------|
| `redirect_uri_mismatch` | URL non dans la liste blanche | Vérifiez l'URL exacte dans Instagram Developer |
| `invalid_client` | App ID/Secret invalide | Vérifiez que vous utilisez le bon app |
| `invalid_scope` | Scopes non autorisés | Activez les scopes dans Configuration |
| `access_denied` | Utilisateur a refusé | C'est normal, relancez |

---

## 📚 Documentation

- Guide complet: `docs/INSTAGRAM_OAUTH_CONFIG.md`
- Code OAuth: `app/api/auth/instagram/route.ts`
- Callback: `app/api/auth/instagram/callback/route.ts`

---

## ✨ Après que ça fonctionne

Une fois la connexion Instagram réussie:
1. ✅ L'utilisateur sera redirigé vers `/settings?success=instagram_connected`
2. ✅ Son compte Instagram sera sauvegardé dans Supabase
3. ✅ Le logo Instagram s'affichera sur la page settings
4. ✅ Il pourra déconnecter son compte

Bonne chance! 🚀
