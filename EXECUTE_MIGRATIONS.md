# 🗄️ EXÉCUTER LES MIGRATIONS SUPABASE

## Étapes simples (5 minutes)

### 1. Aller sur Supabase SQL Editor
🔗 https://lryjyzqrhtepsvqlzzdy.supabase.co/project/_/sql

### 2. Migration 001 - Schéma initial

1. Cliquer sur **"New Query"**
2. Copier TOUT le contenu de: `supabase_migrations/001_initial_schema.sql`
3. Coller dans l'éditeur
4. Cliquer **"Run"** ou Cmd+Enter
5. Attendre ~5 secondes

✅ Vous devriez voir: "Success. No rows returned"

### 3. Migration 002 - RLS Policies

1. Cliquer sur **"New Query"** (nouvelle query)
2. Copier TOUT le contenu de: `supabase_migrations/002_rls_policies.sql`
3. Coller dans l'éditeur
4. Cliquer **"Run"**
5. Attendre ~5 secondes

✅ Vous devriez voir: "Success. No rows returned"

### 4. Vérifier que ça a fonctionné

Exécuter cette requête dans une nouvelle query:

```sql
-- Vérifier les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('coaches', 'leads', 'posts', 'daily_stats', 'subscriptions');
```

✅ Vous devriez voir 5 lignes (les 5 tables)

### 5. Vérifier les RLS

```sql
-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('coaches', 'leads', 'posts', 'daily_stats', 'subscriptions');
```

✅ Toutes les tables doivent avoir `rowsecurity = true`

---

## 🎉 C'est tout !

Vos migrations sont exécutées. Passez à l'étape suivante du déploiement.
