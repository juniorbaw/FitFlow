# 📸 Guide d'installation Instagram pour ClientWin

Ce guide t'explique comment configurer complètement l'intégration Instagram.

## 🎯 Étape 1 : Créer l'application Meta (Facebook/Instagram)

### 1.1 Créer l'app

1. Va sur **https://developers.facebook.com/**
2. Connecte-toi avec ton compte Facebook
3. Clique sur **"My Apps"** → **"Create App"**
4. Choisis **"Business"** comme type d'app
5. Remplis les informations :
   - **Display Name**: `ClientWin`
   - **App Contact Email**: ton email professionnel
   - **Business Account**: crée-en un si nécessaire
6. Clique sur **"Create App"**

### 1.2 Ajouter le produit Instagram

1. Dans le dashboard de ton app, va dans **"Add Products"**
2. Trouve **"Instagram Graph API"** et clique sur **"Set Up"**
3. Instagram sera ajouté à tes produits

### 1.3 Configurer les paramètres de base

1. Va dans **Settings → Basic** (dans le menu latéral)
2. **Note ton App ID et App Secret** (tu en auras besoin plus tard)
3. Remplis les informations obligatoires :
   - **Privacy Policy URL**: ton site ou une page de politique de confidentialité
   - **Terms of Service URL**: ton site ou CGU
   - **App Domain**: `localhost` (pour le dev)

### 1.4 Configurer OAuth

1. Toujours dans **Settings → Basic**, descends jusqu'à **"Add Platform"**
2. Clique sur **"Website"**
3. Remplis :
   - **Site URL**: `http://localhost:3000`
4. Va dans **"Use cases"** → **"Customize"** → **"Authentication and account creation"**
5. Ajoute les **Valid OAuth Redirect URIs** :
   ```
   http://localhost:3000/api/auth/instagram/callback
   ```
6. Pour la production, ajoute aussi :
   ```
   https://ton-domaine.com/api/auth/instagram/callback
   ```

### 1.5 Obtenir les permissions Instagram

1. Va dans **"Use cases"** → **"Customize"**
2. Pour **"Other"**, ajoute ces permissions :
   - `instagram_basic`
   - `instagram_manage_comments`
   - `instagram_manage_messages`
   - `pages_show_list`
   - `pages_read_engagement`

⚠️ **IMPORTANT** : Certaines permissions nécessitent une **App Review** de Meta. Pour le développement, tu peux tester en mode "Development Mode" avec ton propre compte.

### 1.6 Passer en mode Live (optionnel pour dev)

- Pour tester, garde l'app en **"Development Mode"**
- Pour la production, tu devras soumettre ton app à la **"App Review"** de Meta

## 🔧 Étape 2 : Configurer les variables d'environnement

1. Ouvre le fichier [.env.local](.env.local) à la racine du projet
2. Remplace les valeurs Instagram :

```env
NEXT_PUBLIC_INSTAGRAM_APP_ID=TON_APP_ID_ICI
INSTAGRAM_APP_SECRET=TON_APP_SECRET_ICI
```

3. **REDÉMARRE le serveur Next.js** pour que les changements prennent effet :

```bash
npm run dev
```

## 🗄️ Étape 3 : Créer les tables Supabase

1. Va sur **https://supabase.com/** et ouvre ton projet
2. Va dans **SQL Editor** (menu latéral)
3. Copie-colle le contenu du fichier [supabase-schema.sql](supabase-schema.sql)
4. Clique sur **"Run"** pour exécuter le script

Cela va créer :
- ✅ Table `instagram_accounts` - pour stocker les tokens
- ✅ Table `instagram_messages` - pour logger les DM envoyés
- ✅ Table `campaigns` - pour les campagnes d'automatisation
- ✅ Table `processed_comments` - pour tracker les commentaires traités
- ✅ Policies RLS (Row Level Security) - sécurité des données

## 🧪 Étape 4 : Tester l'intégration

### 4.1 Démarrer le serveur

```bash
npm run dev
```

### 4.2 Tester le flux OAuth

1. Ouvre **http://localhost:3000**
2. Connecte-toi avec ton compte (ou crée-en un)
3. Va sur le **Dashboard**
4. Clique sur **"Connecter Instagram"**
5. Tu seras redirigé vers Instagram/Facebook pour autoriser l'app
6. Autorise les permissions demandées
7. Tu seras redirigé vers le dashboard avec Instagram connecté ✅

### 4.3 Vérifier dans Supabase

1. Va dans **Supabase → Table Editor → instagram_accounts**
2. Tu devrais voir une ligne avec :
   - Ton `user_id`
   - Le `instagram_user_id`
   - L'`access_token` (chiffré)
   - La date d'expiration du token

## 📡 Étape 5 : Utiliser les API

### Récupérer les informations du compte

```typescript
const response = await fetch('/api/instagram/account')
const data = await response.json()
console.log(data.account) // { id, username, accountType, mediaCount }
```

### Récupérer les commentaires

```typescript
const response = await fetch('/api/instagram/comments')
const data = await response.json()
console.log(data.comments) // Array de commentaires
```

### Envoyer un DM

```typescript
const response = await fetch('/api/instagram/send-dm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recipientId: '12345678',
    message: 'Salut ! Merci pour ton commentaire 👋'
  })
})
```

## 🚨 Problèmes courants

### Erreur : "Invalid redirect_uri"

**Solution** : Vérifie que tu as bien ajouté `http://localhost:3000/api/auth/instagram/callback` dans les OAuth Redirect URIs de ton app Meta.

### Erreur : "App not setup"

**Solution** : Assure-toi d'avoir bien ajouté le produit "Instagram Graph API" à ton app.

### Erreur : "Permissions error"

**Solution** : En mode Development, seuls les comptes liés à ton app (toi, les testeurs) peuvent autoriser. Ajoute des testeurs dans **Roles → Test Users**.

### Le token expire

**Solution** : Les tokens Instagram durent 60 jours. Il faudra implémenter un système de rafraîchissement automatique des tokens (à venir).

## 🔐 Sécurité

⚠️ **IMPORTANT** :

- **Ne commit JAMAIS** ton `.env.local` dans git
- **Ne partage JAMAIS** ton `INSTAGRAM_APP_SECRET`
- Les tokens sont sensibles - garde-les en sécurité
- Active RLS (Row Level Security) sur toutes les tables Supabase

## 📚 Documentation utile

- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Meta for Developers](https://developers.facebook.com/)
- [Supabase Documentation](https://supabase.com/docs)

## ✅ Checklist finale

- [ ] App Meta créée
- [ ] Instagram Graph API ajouté
- [ ] Permissions configurées
- [ ] OAuth Redirect URIs configurés
- [ ] App ID et Secret dans `.env.local`
- [ ] Tables Supabase créées
- [ ] Serveur redémarré
- [ ] Test de connexion Instagram réussi

## 🎉 Prochaines étapes

Maintenant que Instagram est connecté, tu peux :

1. **Créer une page pour voir les commentaires** ([app/dashboard/comments/page.tsx](app/dashboard/comments/page.tsx))
2. **Implémenter l'automatisation des DM** en réponse aux commentaires
3. **Créer un système de templates** pour personnaliser les messages
4. **Ajouter Calendly** pour booker des RDV automatiquement
5. **Mettre en place des webhooks** pour recevoir les commentaires en temps réel

Bon courage ! 🚀
