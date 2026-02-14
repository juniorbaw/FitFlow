# 🔗 CONFIGURATION COMPLÈTE META - Toutes les URLs

## 📍 OÙ CONFIGURER

**Meta for Developers Dashboard :**
https://developers.facebook.com/apps/907823931604024/

---

## 1️⃣ FACEBOOK LOGIN → SETTINGS

**URL :** https://developers.facebook.com/apps/907823931604024/fb-login/settings/

### **Valid OAuth Redirect URIs**

Ajouter ces 3 URLs (une par ligne) :

```
https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
https://fit-flow-gamma.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**Cliquer "Save Changes"** ✅

---

## 2️⃣ SETTINGS → BASIC

**URL :** https://developers.facebook.com/apps/907823931604024/settings/basic/

### **A. App Domains**

```
fit-flow-gamma.vercel.app
lryjyzqrhtepsvqlzzdy.supabase.co
```

### **B. URL de la politique de confidentialité** (Privacy Policy URL)

```
https://fit-flow-gamma.vercel.app/privacy
```

### **C. URL des conditions d'utilisation** (Terms of Service URL)

```
https://fit-flow-gamma.vercel.app/terms
```

### **D. URL de rappel pour les annulations d'autorisation** (Deauthorize Callback URL)

```
https://fit-flow-gamma.vercel.app/api/auth/deauthorize
```

### **E. URL de la demande de suppression des données** (Data Deletion Request URL)

```
https://fit-flow-gamma.vercel.app/api/auth/deletion
```

**Cliquer "Save Changes"** ✅

---

## 3️⃣ WEBHOOKS → INSTAGRAM

**URL :** https://developers.facebook.com/apps/907823931604024/webhooks/

### **Callback URL**

```
https://fit-flow-gamma.vercel.app/api/webhook/instagram
```

### **Verify Token**

```
fitflow_webhook_verify_token_2026_secure
```

### **Events à souscrire**

- ✅ **comments**
- ✅ **mentions**
- ✅ **messages**
- ✅ **messaging_postbacks**

**Cliquer "Verify and Save"** puis **"Subscribe"** ✅

---

## 4️⃣ INSTAGRAM → BASIC DISPLAY

**URL :** https://developers.facebook.com/apps/907823931604024/instagram-basic-display/basic-display/

### **Valid OAuth Redirect URIs**

```
https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
https://fit-flow-gamma.vercel.app/auth/callback
```

### **Deauthorize Callback URL**

```
https://fit-flow-gamma.vercel.app/api/auth/deauthorize
```

### **Data Deletion Request URL**

```
https://fit-flow-gamma.vercel.app/api/auth/deletion
```

**Cliquer "Save Changes"** ✅

---

## 📋 RÉCAPITULATIF - Copier-Coller Rapide

### ✅ URLs OAuth (Redirect)
```
https://lryjyzqrhtepsvqlzzdy.supabase.co/auth/v1/callback
https://fit-flow-gamma.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### ✅ URL Webhook Instagram
```
https://fit-flow-gamma.vercel.app/api/webhook/instagram
```

### ✅ Token Webhook
```
fitflow_webhook_verify_token_2026_secure
```

### ✅ URL Deauthorize
```
https://fit-flow-gamma.vercel.app/api/auth/deauthorize
```

### ✅ URL Data Deletion
```
https://fit-flow-gamma.vercel.app/api/auth/deletion
```

### ✅ URL Privacy Policy
```
https://fit-flow-gamma.vercel.app/privacy
```

### ✅ URL Terms of Service
```
https://fit-flow-gamma.vercel.app/terms
```

---

## ⚠️ PAGES MANQUANTES À CRÉER

Les pages `/privacy` et `/terms` n'existent pas encore.

**Options :**

### Option 1 : Générer avec un outil
- https://www.privacypolicygenerator.info/
- https://www.termsofservicegenerator.net/

### Option 2 : Utiliser les templates FitFlow

**Je peux créer ces pages pour vous** avec un contenu standard adapté à FitFlow.

**Voulez-vous que je crée ces pages maintenant ?** (Oui/Non)

---

## 🧪 VÉRIFIER QUE TOUT EST BON

### Checklist Meta Configuration

**Facebook Login :**
- [ ] 3 Redirect URIs ajoutées
- [ ] Save Changes cliqué

**Settings → Basic :**
- [ ] App Domains ajoutés
- [ ] Privacy Policy URL
- [ ] Terms URL
- [ ] Deauthorize URL
- [ ] Data Deletion URL
- [ ] Save Changes cliqué

**Webhooks :**
- [ ] Callback URL configurée
- [ ] Verify Token correct
- [ ] Événements souscrits
- [ ] Status : ✅ Active

**Instagram Basic Display :**
- [ ] Redirect URIs ajoutées
- [ ] Deauthorize URL
- [ ] Data Deletion URL
- [ ] Save Changes cliqué

---

## 🎯 APRÈS CONFIGURATION

**Test complet :**

1. **Aller sur :** https://fit-flow-gamma.vercel.app/login
2. **Cliquer "Se connecter avec Facebook"**
3. **Vérifier :**
   - Popup Facebook s'ouvre ✅
   - Demande permissions Instagram ✅
   - Redirection vers /dashboard ✅
   - Profil coach créé dans Supabase ✅

**Si erreur :**
- Vérifier les guides : `FACEBOOK_AUTH_FIX.md`
- Vérifier les logs Vercel
- Vérifier Supabase table coaches existe

---

## 📞 SUPPORT META

**Si Meta rejette votre app :**

**Raisons courantes :**
1. Privacy Policy manquante → Créer la page
2. Vidéo de démo insuffisante → Refaire la vidéo
3. Justification des permissions floue → Clarifier

**Ressources :**
- Meta App Review : https://developers.facebook.com/docs/app-review
- Meta Support : https://developers.facebook.com/support/

---

**Toutes vos URLs sont maintenant prêtes à copier-coller dans Meta ! 🚀**

*Déployement en cours sur Vercel...*
