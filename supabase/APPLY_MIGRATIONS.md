# 🗄️ GUIDE D'APPLICATION DES MIGRATIONS SUPABASE

## 📋 **MIGRATIONS DISPONIBLES**

```
supabase/migrations/
├── 20260214_create_waitlist.sql       → Table waitlist
└── 20260214_complete_schema.sql       → Schema complet (PRINCIPAL)
```

---

## 🚀 **MÉTHODE 1 : VIA SUPABASE DASHBOARD (RECOMMANDÉ)**

### **Étape 1 : Accéder au SQL Editor**

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet FitFlow
3. Cliquez sur **"SQL Editor"** dans le menu gauche
4. Cliquez sur **"New query"**

### **Étape 2 : Copier le schema complet**

```bash
cat supabase/migrations/20260214_complete_schema.sql
```

### **Étape 3 : Exécuter la migration**

1. Collez tout le contenu dans l'éditeur SQL
2. Cliquez sur **"Run"** (ou Cmd+Enter / Ctrl+Enter)
3. Attendez la confirmation : ✅ **"Success. No rows returned"**

### **Étape 4 : Vérifier les tables créées**

Allez dans **"Table Editor"** et vérifiez que vous avez :

- ✅ `coaches` (utilisateurs)
- ✅ `instagram_accounts` (comptes Instagram connectés)
- ✅ `leads` (prospects capturés)
- ✅ `messages` (historique messages)
- ✅ `message_templates` (templates IA)
- ✅ `analytics` (statistiques)
- ✅ `subscriptions` (abonnements Stripe)
- ✅ `waitlist` (liste d'attente)

---

## 🔐 **MÉTHODE 2 : VIA SUPABASE CLI (DÉVELOPPEURS)**

### **Installation Supabase CLI**

```bash
# macOS
brew install supabase/tap/supabase

# NPM
npm install -g supabase
```

### **Initialisation du projet**

```bash
cd "Desktop/FitFlow Launch"

# Lier au projet distant
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Votre PROJECT_REF se trouve dans :
# Dashboard > Settings > General > Reference ID
```

### **Application des migrations**

```bash
# Appliquer toutes les migrations
supabase db push

# OU appliquer une migration spécifique
supabase db push --file supabase/migrations/20260214_complete_schema.sql
```

---

## 🧪 **VÉRIFICATION POST-MIGRATION**

### **Test SQL rapide**

Exécutez dans le SQL Editor :

```sql
-- Vérifier toutes les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Devrait retourner :
-- analytics
-- coaches
-- instagram_accounts
-- leads
-- message_templates
-- messages
-- subscriptions
-- waitlist
```

### **Test Row Level Security (RLS)**

```sql
-- Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Toutes les tables doivent avoir rowsecurity = true
```

---

## 🔧 **CONFIGURATION AUTH SUPABASE**

### **Étape 1 : Activer les providers**

Dashboard > Authentication > Providers

✅ **Email** (activé par défaut)
✅ **Magic Link** (optionnel)

### **Étape 2 : Configurer les URLs**

Dashboard > Authentication > URL Configuration

```
Site URL: https://fit-flow-gamma.vercel.app
Redirect URLs: 
  - https://fit-flow-gamma.vercel.app/auth/callback
  - https://fit-flow-gamma.vercel.app/dashboard
  - http://localhost:3000/auth/callback (dev)
  - http://localhost:3000/dashboard (dev)
```

### **Étape 3 : Configurer les emails**

Dashboard > Authentication > Email Templates

**Confirm signup** :
```
Subject: Confirmez votre compte FitFlow
Body: Cliquez ici pour confirmer : {{ .ConfirmationURL }}
```

---

## 🎯 **DONNÉES DE TEST (OPTIONNEL)**

### **Créer un coach de test**

```sql
-- Créer via Supabase Auth d'abord
-- Dashboard > Authentication > Users > Add User
-- Email: test@fitflow.com
-- Password: Test123456!

-- Puis lier les données :
INSERT INTO coaches (id, email, full_name, subscription_status)
VALUES (
  'USER_UUID_FROM_AUTH', -- Remplacer par l'UUID généré
  'test@fitflow.com',
  'Test Coach',
  'trial'
);
```

### **Créer un lead de test**

```sql
INSERT INTO leads (
  coach_id,
  instagram_username,
  instagram_user_id,
  comment_text,
  score,
  status
) VALUES (
  'COACH_UUID',
  '@test_fitness',
  '123456789',
  'Salut ! J''aimerais perdre 5kg avant l''été, tu proposes quoi comme coaching ?',
  9,
  'nouveau'
);
```

---

## 🚨 **TROUBLESHOOTING**

### **Erreur : "relation already exists"**

```sql
-- Réinitialiser complètement (⚠️ SUPPRIME TOUTES LES DONNÉES)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Puis réexécuter 20260214_complete_schema.sql
```

### **Erreur : "permission denied for schema public"**

Vérifiez que vous utilisez bien le **Service Role Key** dans vos variables d'environnement.

### **RLS bloque mes requêtes**

```sql
-- Temporairement désactiver RLS pour debug (DEV ONLY!)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Ne JAMAIS faire ça en production !
```

---

## ✅ **CHECKLIST FINALE**

Après migration, vérifiez :

- [ ] Toutes les 8 tables sont créées
- [ ] RLS est activé sur toutes les tables
- [ ] Les indexes sont créés (performance)
- [ ] Les triggers sont actifs (updated_at)
- [ ] Auth URLs configurées
- [ ] Test de création d'un compte
- [ ] Test de création d'un lead

---

## 🆘 **BESOIN D'AIDE ?**

Si vous bloquez :

1. Vérifiez les logs : Dashboard > Database > Logs
2. Testez la connexion : `scripts/verify-connections.js`
3. Contactez-moi avec l'erreur exacte

---

**Une fois la migration appliquée avec succès, passez à la configuration Instagram !** 🚀
