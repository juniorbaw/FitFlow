# � ERREUR: "Invalid platform app" - DIAGNOSTIC ET SOLUTION

## ❌ Erreur reçue
```
Requête non valide: Les paramètres de demandes ne sont pas valides : Invalid platform app
```

## 🔍 Cause
L'App ID `4318616691715057` **n'a PAS le produit Instagram Graph API correctement configuré**.

---

## ✅ SOLUTION IMMÉDIATE

### Étape 1: Allez vérifier votre app
**URL:** https://developers.facebook.com/apps/4318616691715057/

### Étape 2: Vérifiez que Instagram Graph API est installé

**Menu gauche → Products (Produits)**

**Cas A: Instagram n'est PAS dans la liste**
- Cliquez **"Add Product"** ou **"+ Produit"**
- Cherchez **"Instagram Graph API"** (PAS "Instagram Basic Display")
- Cliquez **"Add"** ou **"Ajouter"**
- Attendez 2-3 minutes que l'installation finisse

**Cas B: Instagram EST dans la liste**
- Cliquez dessus
- Allez à **Settings** ou **Configuration**
- Vérifiez:
  - ✅ **Valid OAuth Redirect URIs**: `https://fit-flow-gamma.vercel.app/api/auth/instagram/callback`
  - ✅ **Scopes activés**: `user_profile`, `instagram_business_basic`, `instagram_business_content_publish`

### Étape 3: Vérifiez les Roles

**Settings → Basic → Roles**
- Vous devez être **Admin** ou **Tester** (ou l'app en Live)

### Étape 4: Attendez et testez

Attendez 2-3 minutes, puis:
```bash
git push
# Attendez 5 min que Vercel redéploie
# Allez à https://fit-flow-gamma.vercel.app/settings
# Cliquez "Connect Instagram"
```

---

## ⚠️ Si l'app est vraiment cassée

Si après ces vérifications ça marche toujours pas, l'app peut être **corrompue ou supprimée**.

### Option: Créer une NOUVELLE app

1. **Allez à:** https://developers.facebook.com/apps/
2. **Cliquez:** "Create App" ou "Créer une app"
3. **Type:** "Consumer"
4. **Nom:** "FitFlow Instagram OAuth" ou autre
5. **Créez l'app**
6. **Ajoutez le produit "Instagram Graph API"**
7. **Configurez les Redirect URIs et Scopes**
8. **Notez le nouvel App ID et App Secret**
9. **Mettez à jour `.env.local` et Vercel** avec les nouvelles valeurs
10. **Testez**

---

## 📋 CHECKLIST pour l'app existante

- [ ] J'ai vérifié: https://developers.facebook.com/apps/4318616691715057/
- [ ] Instagram Graph API est dans Products
- [ ] Settings → Configuration contient le Redirect URI
- [ ] Scopes sont activés
- [ ] Je suis Admin ou Tester
- [ ] J'ai attendu 2-3 min après modifications

---

## 💡 Commandes de test

```bash
cd "/Users/souleyjr/Desktop/FitFlow Launch"

# Vérifier l'App ID
grep NEXT_PUBLIC_INSTAGRAM_APP_ID .env.local

# Tester localement
npm run dev
# Allez à http://localhost:3000/settings
# Cliquez "Connect Instagram"
```
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
