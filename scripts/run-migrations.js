#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration Supabase
const SUPABASE_URL = 'https://lryjyzqrhtepsvqlzzdy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local');
  process.exit(1);
}

async function executeSql(sql, description) {
  console.log(`\n🔄 Exécution: ${description}...`);
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      // Utiliser l'API PostgreSQL REST directement
      const pgResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sql',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: sql
      });

      if (!pgResponse.ok) {
        const error = await pgResponse.text();
        console.error(`❌ Erreur: ${error}`);
        return false;
      }
    }

    console.log(`✅ ${description} - Terminé`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur lors de l'exécution: ${error.message}`);
    return false;
  }
}

async function runMigrations() {
  console.log('🚀 Exécution des migrations Supabase...\n');

  const migrationsDir = path.join(__dirname, '..', 'supabase_migrations');
  
  // Lire les fichiers de migration
  const migration1 = fs.readFileSync(path.join(migrationsDir, '001_initial_schema.sql'), 'utf8');
  const migration2 = fs.readFileSync(path.join(migrationsDir, '002_rls_policies.sql'), 'utf8');

  // Exécuter les migrations
  const result1 = await executeSql(migration1, 'Migration 001 - Schéma initial');
  if (!result1) {
    console.log('\n⚠️  Migration 001 a échoué via API. Veuillez exécuter manuellement dans Supabase SQL Editor.');
  }

  const result2 = await executeSql(migration2, 'Migration 002 - RLS Policies');
  if (!result2) {
    console.log('\n⚠️  Migration 002 a échoué via API. Veuillez exécuter manuellement dans Supabase SQL Editor.');
  }

  console.log('\n📋 ALTERNATIVE: Exécution manuelle');
  console.log('Si les migrations n\'ont pas fonctionné via l\'API, suivez ces étapes:');
  console.log('\n1. Aller sur: https://lryjyzqrhtepsvqlzzdy.supabase.co/project/_/sql');
  console.log('2. Cliquer "New Query"');
  console.log('3. Copier le contenu de: supabase_migrations/001_initial_schema.sql');
  console.log('4. Cliquer "Run"');
  console.log('5. Répéter pour: supabase_migrations/002_rls_policies.sql');
  console.log('\n✅ Les fichiers SQL sont prêts à être copiés-collés!');
}

runMigrations().catch(console.error);
