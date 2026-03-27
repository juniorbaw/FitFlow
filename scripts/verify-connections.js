#!/usr/bin/env node

/**
 * 🧪 SCRIPT DE VÉRIFICATION DES CONNEXIONS FITFLOW
 * 
 * Ce script teste toutes les connexions aux services externes
 */

require('dotenv').config({ path: '.env.local' });

const https = require('https');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Tests
async function testSupabase() {
  log('\n🗄️  TEST SUPABASE...', 'cyan');
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    log('❌ Variables manquantes: NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY', 'red');
    return false;
  }
  
  try {
    const response = await fetch(`${url}/rest/v1/`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    if (response.ok || response.status === 404) {
      log(`✅ Supabase connecté: ${url}`, 'green');
      return true;
    } else {
      log(`❌ Supabase erreur: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Supabase erreur: ${error.message}`, 'red');
    return false;
  }
}

async function testGemini() {
  log('\n🤖 TEST GEMINI AI...', 'cyan');
  
  const key = process.env.GEMINI_API_KEY;
  
  if (!key) {
    log('❌ Variable manquante: GEMINI_API_KEY', 'red');
    return false;
  }
  
  if (!key.startsWith('AIzaSy')) {
    log('❌ Format clé Gemini invalide (doit commencer par AIzaSy)', 'red');
    return false;
  }
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Say OK if you work' }]
          }]
        })
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      log('✅ Gemini AI connecté et fonctionnel', 'green');
      return true;
    } else {
      const error = await response.json();
      log(`❌ Gemini erreur: ${error.error?.message || response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Gemini erreur: ${error.message}`, 'red');
    return false;
  }
}

async function testStripe() {
  log('\n💳 TEST STRIPE...', 'cyan');
  
  const key = process.env.STRIPE_SECRET_KEY;
  
  if (!key) {
    log('❌ Variable manquante: STRIPE_SECRET_KEY', 'red');
    return false;
  }
  
  if (!key.startsWith('sk_')) {
    log('❌ Format clé Stripe invalide (doit commencer par sk_)', 'red');
    return false;
  }
  
  try {
    const response = await fetch('https://api.stripe.com/v1/products?limit=1', {
      headers: {
        'Authorization': `Bearer ${key}`
      }
    });
    
    if (response.ok) {
      log('✅ Stripe connecté', 'green');
      
      // Vérifier les price IDs
      const starter = process.env.STRIPE_PRICE_STARTER;
      const pro = process.env.STRIPE_PRICE_PRO;
      
      if (starter && pro) {
        log(`✅ Price IDs configurés:`, 'green');
        log(`   - Starter: ${starter}`, 'blue');
        log(`   - Pro: ${pro}`, 'blue');
      } else {
        log('⚠️  Price IDs manquants (STRIPE_PRICE_STARTER, STRIPE_PRICE_PRO)', 'yellow');
      }
      
      return true;
    } else {
      log(`❌ Stripe erreur: ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Stripe erreur: ${error.message}`, 'red');
    return false;
  }
}

function testInstagram() {
  log('\n📸 TEST INSTAGRAM CONFIG...', 'cyan');
  
  const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
  const secret = process.env.INSTAGRAM_APP_SECRET;
  const token = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
  
  if (!appId || !secret || !token) {
    log('❌ Variables Instagram manquantes', 'red');
    if (!appId) log('   - NEXT_PUBLIC_INSTAGRAM_APP_ID', 'red');
    if (!secret) log('   - INSTAGRAM_APP_SECRET', 'red');
    if (!token) log('   - INSTAGRAM_WEBHOOK_VERIFY_TOKEN', 'red');
    return false;
  }
  
  log(`✅ Instagram App ID: ${appId}`, 'green');
  log(`✅ App Secret configuré: ${secret.substring(0, 8)}...`, 'green');
  log(`✅ Webhook token configuré`, 'green');
  
  return true;
}

function testEnvVariables() {
  log('\n🔐 TEST VARIABLES D\'ENVIRONNEMENT...', 'cyan');
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  if (!appUrl) {
    log('❌ NEXT_PUBLIC_APP_URL non défini', 'red');
    return false;
  }
  
  log(`✅ App URL: ${appUrl}`, 'green');
  
  if (appUrl.includes('localhost')) {
    log('⚠️  Mode développement détecté', 'yellow');
  } else {
    log('✅ Mode production', 'green');
  }
  
  return true;
}

// Exécution
async function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('🧪 VÉRIFICATION DES CONNEXIONS FITFLOW', 'blue');
  log('='.repeat(60), 'blue');
  
  const results = {
    env: testEnvVariables(),
    instagram: testInstagram(),
    supabase: await testSupabase(),
    gemini: await testGemini(),
    stripe: await testStripe()
  };
  
  log('\n' + '='.repeat(60), 'blue');
  log('📊 RÉSULTATS FINAUX', 'blue');
  log('='.repeat(60), 'blue');
  
  const total = Object.keys(results).length;
  const success = Object.values(results).filter(r => r).length;
  
  log(`\n✅ ${success}/${total} services connectés`, success === total ? 'green' : 'yellow');
  
  if (success === total) {
    log('\n🎉 TOUTES LES CONNEXIONS SONT OK !', 'green');
    log('🚀 FitFlow est prêt à être déployé !', 'green');
  } else {
    log('\n⚠️  Certaines connexions ont échoué', 'yellow');
    log('📖 Consultez les guides de configuration correspondants', 'yellow');
  }
  
  log('\n' + '='.repeat(60) + '\n', 'blue');
  
  process.exit(success === total ? 0 : 1);
}

main().catch(error => {
  log(`\n❌ Erreur fatale: ${error.message}`, 'red');
  process.exit(1);
});
