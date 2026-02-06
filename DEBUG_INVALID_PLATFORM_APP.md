# 🚨 ERREUR: "Invalid platform app" - ACTION IMMÉDIATE

## ❌ Erreur:
```
Requête non valide: Les paramètres de demandes ne sont pas valides : Invalid platform app
```

## 🔍 Diagnostic
L'App ID `4318616691715057` **n'a PAS Instagram Graph API correctement configuré**.

---

## ✅ ACTION: Vérifier Facebook Developer (5 min)

### Allez à:
👉 https://developers.facebook.com/apps/4318616691715057/settings/basic

### Vérifiez ces éléments:

**1. Dans le menu gauche → Products:**
```
Cherchez: Instagram Graph API (pas "Instagram Basic Display")

❌ Si absent: 
   - Cliquez "Add Product"
   - Cherchez "Instagram Graph API"
   - Cliquez "Add" et attendez 3 min

✅ Si présent:
   - Cliquez dessus
   - Allez à "Settings" → "Configuration"
```

**2. Dans Settings/Configuration → Valid OAuth Redirect URIs:**
```
Doit contenir EXACTEMENT:
https://fit-flow-gamma.vercel.app/api/auth/instagram/callback

Si absent: Ajoutez-le et sauvegardez
```

**3. Dans Settings/Configuration → Scopes:**
```
✅ user_profile
✅ instagram_business_basic
✅ instagram_business_content_publish

Si non coché: Cochez-les
```

**4. Dans Settings → Basic → Roles:**
```
Vérifiez: Êtes-vous dans "Admins" ou "Testers"?

Si non: Vous devez être ajouté comme Admin/Tester
```

---

## ⚠️ Si l'app ne peut pas être récupérée

**L'app peut être supprimée ou invalide.**

### Créer une NOUVELLE app:

1. **Allez à:** https://developers.facebook.com/apps/
2. **Cliquez:** "Create App"
3. **Remplissez:**
   - Type: "Consumer"
   - Name: "FitFlow Instagram"
4. **Créez l'app**
5. **Notez le nouvel App ID et App Secret**
6. **Mettez à jour:**
   ```
   .env.local:
   NEXT_PUBLIC_INSTAGRAM_APP_ID=<NOUVEL_APP_ID>
   INSTAGRAM_APP_SECRET=<NOUVEL_SECRET>
   
   Vercel Dashboard:
   NEXT_PUBLIC_INSTAGRAM_APP_ID=<NOUVEL_APP_ID>
   INSTAGRAM_APP_SECRET=<NOUVEL_SECRET>
   ```
7. **Configurez les Redirect URIs et Scopes (comme ci-dessus)**
8. **Redéployez:**
   ```bash
   git push
   ```

---

## 🧪 Test local rapide:

```bash
cd "/Users/souleyjr/Desktop/FitFlow Launch"

# Vérifier l'App ID actuel
grep NEXT_PUBLIC_INSTAGRAM_APP_ID .env.local

# Lancer le serveur
npm run dev

# Allez à: http://localhost:3000/settings
# Cliquez "Connect Instagram"
# Regardez les logs pour l'erreur
```

---

## ✨ Une fois fixé:

```bash
git push
# Attendez 5 min le redeploy Vercel
# Testez: https://fit-flow-gamma.vercel.app/settings
```

