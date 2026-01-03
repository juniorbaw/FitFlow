# Configuration OAuth Instagram - Guide Complet

## Informations de votre application

**URL publique Cloudflare** : `https://interventions-enemies-malpractice-night.trycloudflare.com`

**Instagram App ID** : `4318616691715057`

---

## 1️⃣ Vérifier et Ajouter Instagram Basic Display API

### Étape 1 : Accéder à votre application
Allez sur : https://developers.facebook.com/apps/4318616691715057

### Étape 2 : Vérifier que Instagram Basic Display est ajouté

**Navigation** : Tableau de bord → Produits

**Vérifiez** si "Instagram Basic Display" apparaît dans la liste des produits.

**Si ce n'est PAS le cas** :
1. Cliquez sur **"Ajouter un produit"** ou **"Add Products"**
2. Cherchez **"Instagram Basic Display"**
3. Cliquez sur **"Configurer"** ou **"Set Up"**

### Étape 3 : Créer une Instagram App

**Navigation** : Instagram Basic Display → Paramètres de base

1. Cliquez sur **"Créer une app"** ou **"Create New App"**
2. Donnez un nom d'affichage (ex: "ClientWin Instagram Bot")
3. Cliquez sur **"Créer l'app"**

### Étape 4 : Configurer les paramètres de base

**Navigation** : Paramètres → De base

**Domaines de l'app** : Ajoutez
```
interventions-enemies-malpractice-night.trycloudflare.com
```

**Sauvegardez** vos modifications.

---

## 2️⃣ Configurer Instagram Basic Display API

### Étape 1 : Accéder aux paramètres Instagram

**Navigation** : Produits → Instagram Basic Display API → Paramètres de base

### Étape 2 : Configurer les URLs de callback

**Valid OAuth Redirect URIs** :
```
https://interventions-enemies-malpractice-night.trycloudflare.com/api/auth/instagram/callback
```

**Deauthorize Callback URL** :
```
https://interventions-enemies-malpractice-night.trycloudflare.com/api/auth/instagram/deauthorize
```

**Data Deletion Request URL** :
```
https://interventions-enemies-malpractice-night.trycloudflare.com/api/auth/instagram/delete
```

**Sauvegardez** vos modifications.

---

## 3️⃣ Ajouter un utilisateur de test Instagram

### Étape 1 : Accéder aux rôles

**Navigation** : Roles → Instagram Testers

### Étape 2 : Ajouter votre compte

1. Cliquez sur **"Add Instagram Testers"**
2. Entrez votre nom d'utilisateur Instagram
3. Cliquez sur **"Submit"**

### Étape 3 : Accepter l'invitation

1. Connectez-vous sur Instagram (web ou mobile)
2. Allez dans **Paramètres → Apps et sites web → Invitations de testeur**
3. Acceptez l'invitation de votre application

---

## 4️⃣ Tester le flux OAuth

### Option A : Via le Dashboard (recommandé)

1. Accédez à : https://interventions-enemies-malpractice-night.trycloudflare.com/dashboard
2. Cliquez sur **"Connecter Instagram"**
3. Autorisez l'application sur Instagram
4. Vous serez redirigé vers le dashboard avec Instagram connecté

### Option B : Via l'URL directe

1. Accédez à : https://interventions-enemies-malpractice-night.trycloudflare.com/api/auth/instagram
2. Autorisez l'application
3. Vous serez redirigé automatiquement

---

## 5️⃣ Vérifier la connexion

Une fois Instagram connecté, vérifiez que :

✅ Le dashboard affiche "Instagram connecté !"
✅ Votre nom d'utilisateur Instagram s'affiche
✅ Vous pouvez voir vos posts et commentaires

---

## Dépannage

### Erreur : "Invalid platform app"

**Cause** : L'application n'a pas Instagram Basic Display API configuré correctement.

**Solution** :
1. Allez dans Meta Developer Console
2. Produits → Vérifiez que "Instagram Basic Display" est ajouté
3. Instagram Basic Display → Paramètres de base
4. **IMPORTANT** : Cliquez sur "Créer une app" si vous ne l'avez pas encore fait
5. L'App ID Instagram est DIFFÉRENT de votre Facebook App ID
6. Utilisez l'Instagram App ID (visible dans les paramètres Instagram Basic Display)
7. Mettez à jour votre `.env.local` avec le bon Instagram App ID

### Erreur : "URL Blocked: This redirect failed because..."

**Solution** : Vérifiez que l'URL de callback est exactement :
```
https://interventions-enemies-malpractice-night.trycloudflare.com/api/auth/instagram/callback
```

### Erreur : "Invalid OAuth access token"

**Solution** : Le token a expiré. Reconnectez-vous via le flux OAuth.

### Erreur : "App Not Set Up"

**Solution** : Assurez-vous que :
1. L'app est en mode "Development"
2. Vous êtes ajouté comme testeur Instagram
3. Vous avez accepté l'invitation

### L'URL Cloudflare ne fonctionne plus

**Solution** : L'URL Cloudflare change à chaque redémarrage. Si vous avez redémarré le tunnel :

1. Récupérez la nouvelle URL dans les logs
2. Mettez à jour `.env.local`
3. Mettez à jour les URLs dans Meta Developer Console
4. Redémarrez le serveur Next.js

---

## Notes importantes

⚠️ **Cloudflare Tunnel temporaire** : L'URL change à chaque redémarrage du tunnel. Pour une URL permanente :
- Déployez sur Vercel/Netlify
- Créez un compte Cloudflare et configurez un tunnel permanent
- Utilisez ngrok avec un compte payant

⚠️ **Mode Development** : En mode développement, seuls les testeurs ajoutés peuvent se connecter.

⚠️ **Permissions** : Instagram Basic Display API donne accès uniquement à :
- Profil utilisateur (`user_profile`)
- Médias utilisateur (`user_media`)

Pour envoyer des DMs, vous aurez besoin de migrer vers **Instagram Messaging API** (nécessite une Business Account).

---

## Prochaines étapes

Après avoir connecté Instagram avec succès :

1. ✅ Tester la récupération de vos posts
2. ✅ Tester la récupération des commentaires
3. 🔄 Migrer vers Instagram Messaging API pour les DMs
4. 🔄 Créer votre première campagne d'automatisation

---

**Besoin d'aide ?** Vérifiez la console du navigateur et les logs du serveur pour plus de détails sur les erreurs.
