# 🔧 Fix: "Invalid platform app" Error

Cette erreur signifie que votre application Facebook n'a pas correctement configuré Instagram Basic Display API.

---

## Solution rapide

### Étape 1: Accéder à Meta Developer Console

Allez sur: https://developers.facebook.com/apps/4318616691715057

### Étape 2: Vérifier les produits installés

1. Dans le menu de gauche, cliquez sur **"Tableau de bord"** ou **"Dashboard"**
2. Regardez la section **"Produits"** ou **"Products"**
3. Cherchez **"Instagram Basic Display"**

### Étape 3: Installer Instagram Basic Display (si absent)

**Si vous ne voyez PAS "Instagram Basic Display" dans vos produits:**

1. Cliquez sur **"+ Ajouter des produits"** ou **"+ Add Products"**
2. Trouvez **"Instagram Basic Display"**
3. Cliquez sur **"Configurer"** ou **"Set Up"**

### Étape 4: Créer l'app Instagram (CRUCIAL)

**Navigation**: Instagram Basic Display → Paramètres de base

1. Vous devriez voir une section **"Instagram App ID"** et **"Instagram App Secret"**
2. **Si ces champs sont VIDES**, cliquez sur **"Créer une app"** ou **"Create New App"**
3. Remplissez le formulaire:
   - **Display Name**: ClientWin Bot (ou un nom de votre choix)
   - **Privacy Policy URL**: `https://interventions-enemies-malpractice-night.trycloudflare.com/privacy`
   - **Terms of Service URL**: `https://interventions-enemies-malpractice-night.trycloudflare.com/terms`
4. Cliquez sur **"Créer"**

### Étape 5: Récupérer le VRAI Instagram App ID

Après avoir créé l'app Instagram:

1. Vous verrez maintenant **"Instagram App ID"** et **"Instagram App Secret"**
2. **COPIEZ l'Instagram App ID** (il est différent de votre Facebook App ID !)

### Étape 6: Mettre à jour votre .env.local

Ouvrez `/Users/souleyjr/Documents/MesProjets/clientwin/.env.local`

Remplacez:
```env
INSTAGRAM_APP_ID=4318616691715057
INSTAGRAM_APP_SECRET=a667e928daee99ec432b7a829394dc6a
```

Par les NOUVELLES valeurs que vous venez de copier depuis Instagram Basic Display:
```env
INSTAGRAM_APP_ID=VOTRE_NOUVEAU_INSTAGRAM_APP_ID
INSTAGRAM_APP_SECRET=VOTRE_NOUVEAU_INSTAGRAM_APP_SECRET
```

### Étape 7: Configurer les URLs de callback

Dans **Instagram Basic Display → Paramètres de base**:

**Valid OAuth Redirect URIs**:
```
https://interventions-enemies-malpractice-night.trycloudflare.com/api/auth/instagram/callback
```

**Deauthorize Callback URL**:
```
https://interventions-enemies-malpractice-night.trycloudflare.com/api/auth/instagram/deauthorize
```

**Data Deletion Request URL**:
```
https://interventions-enemies-malpractice-night.trycloudflare.com/api/auth/instagram/delete
```

Cliquez sur **"Enregistrer les modifications"** ou **"Save Changes"**

### Étape 8: Créer les pages privacy et terms (temporaires)

Nous devons créer ces pages car Meta les demande:

```bash
mkdir -p app/privacy app/terms
```

Créez `app/privacy/page.tsx`:
```tsx
export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p>Your privacy policy content here.</p>
    </div>
  )
}
```

Créez `app/terms/page.tsx`:
```tsx
export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p>Your terms of service content here.</p>
    </div>
  )
}
```

### Étape 9: Redémarrer le serveur Next.js

Pour que les nouvelles variables d'environnement soient prises en compte:

```bash
# Arrêter le serveur (Ctrl + C)
# Puis redémarrer
npm run dev
```

### Étape 10: Ajouter un testeur Instagram

**Navigation**: Roles → Instagram Testers

1. Cliquez sur **"Add Instagram Testers"**
2. Entrez votre nom d'utilisateur Instagram
3. Cliquez sur **"Submit"**

**Sur Instagram** (web ou mobile):
1. Allez dans **Paramètres → Apps et sites web → Invitations de testeur**
2. Acceptez l'invitation

### Étape 11: Tester à nouveau

Accédez à:
```
https://interventions-enemies-malpractice-night.trycloudflare.com/dashboard
```

Cliquez sur **"Connecter Instagram"**

---

## Checklist de vérification

Avant de tester, assurez-vous que:

- [ ] Instagram Basic Display est dans vos produits
- [ ] Vous avez CRÉÉ une Instagram App (pas juste la Facebook App)
- [ ] Vous utilisez le bon Instagram App ID (pas le Facebook App ID)
- [ ] Les 3 URLs de callback sont configurées
- [ ] Les pages /privacy et /terms existent
- [ ] Vous êtes ajouté comme testeur Instagram
- [ ] Vous avez accepté l'invitation sur Instagram
- [ ] Le serveur Next.js a été redémarré
- [ ] L'App est en mode "Development"

---

## Comprendre la différence

**Facebook App ID** (4318616691715057) ≠ **Instagram App ID**

- La **Facebook App** est le conteneur principal
- **Instagram Basic Display** est un produit dans cette app
- Quand vous créez une "Instagram App", vous obtenez un NOUVEL App ID
- C'est CE nouvel ID qu'il faut utiliser dans `.env.local`

---

## Besoin d'aide?

Si l'erreur persiste:

1. Vérifiez la console du navigateur (F12)
2. Vérifiez les logs du serveur Next.js
3. Assurez-vous que l'app est en mode "Development" (pas "Live")
4. Vérifiez que l'URL Cloudflare n'a pas changé

---

**Une fois configuré, vous ne devriez plus voir cette erreur!**
