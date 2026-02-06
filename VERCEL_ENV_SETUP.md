# ⚡ Configuration Vercel - Guide Pas à Pas

## Pourquoi cette étape?
Les variables dans `.env.local` ne sont que **locales**. Pour que Vercel puisse les utiliser en production/preview, vous DEVEZ les ajouter à Vercel Dashboard.

---

## 📍 Lien direct
👉 **Cliquez ici:** https://vercel.com/dashboard/fit-flow/settings/environment-variables

---

## 📝 Variables à ajouter

Vous devez ajouter **3 variables** sur Vercel:

### 1️⃣ NEXT_PUBLIC_INSTAGRAM_APP_ID

```
Name: NEXT_PUBLIC_INSTAGRAM_APP_ID
Value: 4318616691715057
Environments: ✅ Development ✅ Preview ✅ Production
```

### 2️⃣ INSTAGRAM_APP_SECRET

```
Name: INSTAGRAM_APP_SECRET
Value: a667e928daee99ec432b7a829394dc6a
Environments: ✅ Development ✅ Preview ✅ Production
```

### 3️⃣ SUPABASE_SERVICE_ROLE_KEY

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Voir .env.local - cherchez SUPABASE_SERVICE_ROLE_KEY=]
Environments: ✅ Development ✅ Preview ✅ Production
```

---

## 🔧 Étapes pour ajouter les variables

### Étape 1: Allez à Vercel Settings

1. Ouvrez: https://vercel.com/dashboard/fit-flow/settings/environment-variables
2. Vous êtes dans **Settings → Environment Variables**

### Étape 2: Ajouter NEXT_PUBLIC_INSTAGRAM_APP_ID

1. Cliquez sur **"Add New"** (bouton gris/bleu en haut à droite)
2. Dans le champ **"Name"** tapez: `NEXT_PUBLIC_INSTAGRAM_APP_ID`
3. Dans le champ **"Value"** tapez: `4318616691715057`
4. Cochez les 3 cases d'environnement:
   - ☑️ Development
   - ☑️ Preview
   - ☑️ Production
5. Cliquez **"Save"**

### Étape 3: Ajouter INSTAGRAM_APP_SECRET

1. Cliquez **"Add New"** (à nouveau)
2. **Name**: `INSTAGRAM_APP_SECRET`
3. **Value**: `a667e928daee99ec432b7a829394dc6a`
4. ☑️ Tous les environnements
5. **Save**

### Étape 4: Ajouter SUPABASE_SERVICE_ROLE_KEY

1. Cliquez **"Add New"**
2. **Name**: `SUPABASE_SERVICE_ROLE_KEY`
3. **Value**: Ouvrez votre `.env.local` et copiez la valeur entière de `SUPABASE_SERVICE_ROLE_KEY=...`
   ```bash
   # Commande pour afficher la valeur:
   grep SUPABASE_SERVICE_ROLE_KEY .env.local
   ```
4. ☑️ Tous les environnements
5. **Save**

---

## ⏱️ Attendez confirmation

Après avoir ajouté chaque variable, Vercel montre un message vert "Added".

---

## 🚀 Redéployez

Après avoir ajouté TOUTES les variables:

1. Ouvrez un terminal dans le projet
2. Lancez:
   ```bash
   git push
   ```
3. Attendez 3-5 minutes que Vercel redéploie

---

## 🧪 Testez

Après le redéploiement:

1. Allez à: https://fit-flow-gamma.vercel.app/settings
2. Cliquez **"Connect Instagram"**
3. Vous devriez voir la page Instagram OAuth (pas "app_not_configured")

---

## ✅ Checklist

- [ ] Variable 1 (NEXT_PUBLIC_INSTAGRAM_APP_ID) ajoutée ✅
- [ ] Variable 2 (INSTAGRAM_APP_SECRET) ajoutée ✅
- [ ] Variable 3 (SUPABASE_SERVICE_ROLE_KEY) ajoutée ✅
- [ ] `git push` lancé
- [ ] Redéploiement finalisé (regardez Vercel → Deployments)
- [ ] Testé sur https://fit-flow-gamma.vercel.app/settings

---

## 🐛 Problèmes?

### Les variables n'apparaissent pas dans Vercel
- Actualisez la page (Ctrl+F5 ou Cmd+Shift+R)
- Vérifiez que vous êtes dans le bon project (fit-flow)

### Erreur "app_not_configured" toujours
- Vérifiez que `NEXT_PUBLIC_INSTAGRAM_APP_ID` est vraiment là
- Vérifiez la valeur exacte: `4318616691715057`
- Attendez 2 minutes après l'ajout (Vercel peut avoir du délai)

### Erreur "redirect_uri_mismatch" ou "invalid_client"
- Vérifiez que `INSTAGRAM_APP_SECRET` est correct
- Vérifiez sur Facebook Developer que l'App ID correspond

---

## 💡 Rappel: Différence entre les types de variables

| Type | Visible côté client? | Visible côté serveur? | Utilisation |
|------|----------------------|----------------------|-------------|
| `NEXT_PUBLIC_*` | ✅ OUI | ✅ OUI | Public data (API keys) |
| Autres | ❌ NON | ✅ OUI | Secrets (DB passwords, API secrets) |

**Donc:**
- `NEXT_PUBLIC_INSTAGRAM_APP_ID` = publique, safe de l'ajouter n'importe où
- `INSTAGRAM_APP_SECRET` = secrets, SEULEMENT côté serveur, JAMAIS côté client

