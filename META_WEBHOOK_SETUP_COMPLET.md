# 🔗 CONFIGURATION COMPLÈTE - Meta Webhook + Instagram Business

## 📋 INFORMATIONS NÉCESSAIRES

### ✅ URL Webhook FitFlow
```
https://fit-flow-gamma.vercel.app/api/webhook/instagram
```

### ✅ Token de vérification
```
fitflow_webhook_verify_token_2026_secure
```

### ✅ App ID Meta
```
907823931604024
```

---

## 🎯 ÉTAPE 1 : Convertir Instagram en compte Professionnel

**IMPORTANT :** Votre compte Instagram doit être **Business** ou **Creator**

### Si votre compte est Personnel :

1. **Ouvrir Instagram** sur mobile
2. **Profil** → Menu ☰ → **Paramètres et confidentialité**
3. **Type de compte et outils** → **Passer à un compte professionnel**
4. **Choisir une catégorie :**
   - "Coach sportif" ou "Coach de santé"
5. **Choisir "Créateur" ou "Entreprise"**
6. **Suivre les étapes** (coordonnées, catégorie, etc.)

✅ Votre compte est maintenant Professionnel !

---

## 🎯 ÉTAPE 2 : Créer une Page Facebook (si vous n'en avez pas)

Instagram Business/Creator doit être lié à une Page Facebook.

### Créer la Page :

1. **Aller sur :** https://www.facebook.com/pages/create
2. **Nom de la page :** "Votre Nom - Coach Fitness" (ex: "Sophie Martin - Coach Sport")
3. **Catégorie :** "Coach sportif" ou "Service de santé et beauté"
4. **Cliquer "Créer la page"**

✅ Page créée !

---

## 🎯 ÉTAPE 3 : Lier Instagram à la Page Facebook

1. **Sur Instagram (mobile) :**
   - Profil → Menu ☰ → **Paramètres**
   - **Compte** → **Lier votre page Facebook**
   - **Se connecter à Facebook**
   - **Sélectionner votre Page** créée à l'étape 2
   - **Autoriser**

OU

2. **Sur Facebook (desktop) :**
   - Aller sur votre Page
   - **Paramètres** → **Instagram**
   - **Connecter un compte**
   - **Se connecter avec Instagram**
   - **Autoriser**

✅ Instagram lié à Facebook !

---

## 🎯 ÉTAPE 4 : Configurer le Webhook dans Meta for Developers

### A. Activer les Webhooks

1. **Aller sur :** https://developers.facebook.com/apps/907823931604024/webhooks/

2. **Sélectionner "Instagram"** dans la liste des produits

3. **Cliquer "Configure Webhooks"** ou **"Edit Subscription"**

### B. Configurer l'URL et le token

| Champ | Valeur |
|-------|--------|
| **Callback URL** | `https://fit-flow-gamma.vercel.app/api/webhook/instagram` |
| **Verify Token** | `fitflow_webhook_verify_token_2026_secure` |

4. **Cliquer "Verify and Save"**

**✅ Meta va vérifier votre webhook** (en appelant GET sur l'URL)

Si tout est bon, vous verrez : ✅ **"Callback URL verified"**

---

### C. Sélectionner les événements

Après vérification, cocher ces événements :

- ✅ **comments** - Nouveaux commentaires
- ✅ **mentions** - Mentions dans stories
- ✅ **messages** - Messages directs
- ✅ **messaging_postbacks** - Réponses automatiques

5. **Cliquer "Save"**

✅ Webhook configuré !

---

## 🎯 ÉTAPE 5 : Ajouter votre compte Instagram de test

Pour tester en mode Development :

1. **Aller sur :** https://developers.facebook.com/apps/907823931604024/roles/test-users/

2. **Instagram Tester :**
   - Cliquer **"Add Instagram Testers"**
   - Entrer votre **username Instagram**
   - Cliquer **"Submit"**

3. **Accepter l'invitation :**
   - Aller sur Instagram (mobile)
   - Paramètres → Apps et sites web
   - Invitations → **Accepter**

✅ Compte de test ajouté !

---

## 🎯 ÉTAPE 6 : Demander les Permissions Instagram (App Review)

Pour passer en mode LIVE (tout le monde peut se connecter) :

### A. Permissions à demander

1. **Aller sur :** https://developers.facebook.com/apps/907823931604024/app-review/permissions/

2. **Demander ces permissions :**

| Permission | Nécessaire pour |
|------------|-----------------|
| `instagram_basic` | ✅ Auto-approuvé |
| `instagram_manage_comments` | Lire et répondre aux commentaires |
| `instagram_manage_messages` | Envoyer des DMs |
| `pages_show_list` | Lister les pages liées |
| `pages_read_engagement` | Voir les stats |
| `pages_messaging` | Envoyer messages |

3. **Pour chaque permission, cliquer "Request"**

---

### B. Justification à fournir

**Pour `instagram_manage_comments` :**
```
FitFlow aide les coachs fitness à détecter automatiquement les leads potentiels 
dans leurs commentaires Instagram et à leur répondre de manière personnalisée. 
Cette permission est nécessaire pour lire les commentaires et y répondre.
```

**Pour `instagram_manage_messages` :**
```
FitFlow envoie des messages directs personnalisés automatiques aux utilisateurs 
qui ont commenté des posts Instagram pour les engager dans une conversation. 
Cette permission est nécessaire pour envoyer des DMs via l'API.
```

**Pour `pages_messaging` :**
```
FitFlow automatise l'envoi de messages aux prospects détectés via les commentaires 
Instagram, en utilisant l'API officielle Meta pour une communication professionnelle.
```

---

### C. Vidéo de démo (OBLIGATOIRE)

Meta demande une vidéo montrant comment votre app utilise les permissions.

**À montrer dans la vidéo (2-3 min) :**

1. **Login avec Facebook/Instagram**
2. **Dashboard FitFlow** avec liste des leads
3. **Un commentaire Instagram** arrive
4. **FitFlow détecte le commentaire** (montrer dans dashboard)
5. **Un DM automatique est envoyé** (montrer dans Instagram)
6. **Dashboard met à jour les stats**

**Outils pour enregistrer :**
- Loom : https://loom.com
- QuickTime (Mac)
- OBS Studio (gratuit)

**Uploader sur YouTube** (unlisted) et copier le lien dans App Review

4. **Soumettre la review** → Attendre 3-7 jours

---

## 🎯 ÉTAPE 7 : Tester le Webhook

### Test en local (avant déploiement)

1. **Démarrer le serveur :**
   ```bash
   npm run dev
   ```

2. **Utiliser ngrok pour exposer localhost :**
   ```bash
   ngrok http 3000
   ```

3. **Copier l'URL ngrok** (ex: `https://abc123.ngrok.io`)

4. **Dans Meta Webhooks :**
   - Callback URL : `https://abc123.ngrok.io/api/webhook/instagram`
   - Verify Token : `fitflow_webhook_verify_token_2026_secure`

5. **Tester :**
   - Commenter un de vos posts Instagram
   - Vérifier les logs dans le terminal
   - Vérifier que le lead apparaît dans Supabase

---

### Test en production (après déploiement)

1. **URL déjà configurée :**
   ```
   https://fit-flow-gamma.vercel.app/api/webhook/instagram
   ```

2. **Tester :**
   - Commenter un post Instagram
   - Vérifier logs Vercel : https://vercel.com/juniorbaw/fit-flow/logs
   - Vérifier Supabase : `SELECT * FROM leads ORDER BY created_at DESC`

---

## 🧪 VÉRIFIER QUE ÇA MARCHE

### Checklist

- [ ] Instagram converti en Professionnel
- [ ] Page Facebook créée et liée
- [ ] Webhook configuré dans Meta
- [ ] Token de vérification correct
- [ ] Événements sélectionnés (comments, messages)
- [ ] Compte de test ajouté (mode Dev)
- [ ] Permissions demandées (App Review)
- [ ] Vidéo de démo uploadée

### Test manuel

1. **Poster une photo/vidéo sur Instagram**
2. **Commenter votre propre post** : "Combien coûte ton programme ?"
3. **Vérifier :**
   - Logs Vercel : webhook reçu
   - Supabase : lead créé dans table `leads`
   - Dashboard FitFlow : lead apparaît

---

## 🚨 ERREURS COURANTES

### "Callback URL could not be verified"

**Cause :** Token de vérification incorrect ou route non déployée

**Solution :**
- Vérifier que l'app est déployée sur Vercel
- Vérifier le token : `fitflow_webhook_verify_token_2026_secure`
- Vérifier la route existe : https://fit-flow-gamma.vercel.app/api/webhook/instagram

### "Instagram account not eligible"

**Cause :** Compte Instagram pas en mode Business/Creator

**Solution :** Convertir le compte (Étape 1)

### "No Page connected"

**Cause :** Instagram pas lié à une Page Facebook

**Solution :** Créer et lier la Page (Étapes 2-3)

### "Permission denied"

**Cause :** Permissions Instagram pas approuvées

**Solution :**
- En mode Dev : Ajouter compte de test
- En mode Live : Soumettre App Review

---

## 📊 FLUX COMPLET

```
1. Coach poste sur Instagram
          ↓
2. Utilisateur commente "Combien coûte ton programme ?"
          ↓
3. Instagram envoie webhook → FitFlow
   POST https://fit-flow-gamma.vercel.app/api/webhook/instagram
          ↓
4. FitFlow crée un lead dans Supabase
          ↓
5. FitFlow envoie le lead à Make.com
          ↓
6. Make.com → Gemini AI score le lead (1-10)
          ↓
7. Make.com → ManyChat envoie DM automatique
          ↓
8. Coach voit le lead dans /dashboard
```

---

## 🎯 RÉSUMÉ - URLs et Tokens

**App Meta :** https://developers.facebook.com/apps/907823931604024

**Webhook URL :**
```
https://fit-flow-gamma.vercel.app/api/webhook/instagram
```

**Verify Token :**
```
fitflow_webhook_verify_token_2026_secure
```

**Événements à activer :**
- comments
- mentions  
- messages
- messaging_postbacks

---

**Suivez ces étapes dans l'ordre et votre webhook sera opérationnel ! 🚀**

*Temps estimé : 20-30 minutes*
