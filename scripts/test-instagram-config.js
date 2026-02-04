#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration Instagram OAuth
 * Usage: node scripts/test-instagram-config.js
 */

require('dotenv').config({ path: '.env.local' })

console.log('\n🔍 Vérification de la Configuration Instagram OAuth\n')
console.log('=' .repeat(60))

// Vérifier les variables d'environnement
const checks = [
  {
    name: 'NEXT_PUBLIC_INSTAGRAM_APP_ID',
    value: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID,
    required: true,
    expected: '2136424887099200'
  },
  {
    name: 'INSTAGRAM_APP_SECRET',
    value: process.env.INSTAGRAM_APP_SECRET,
    required: true,
    expected: '4d6b47bbbfac65d17e0b8f709be2b175'
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    value: process.env.NEXT_PUBLIC_APP_URL,
    required: true,
    expected: 'https://fit-flow-gamma.vercel.app'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: process.env.NEXT_PUBLIC_SUPABASE_URL,
    required: true
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    value: process.env.SUPABASE_SERVICE_ROLE_KEY,
    required: true
  }
]

let allValid = true

checks.forEach(check => {
  const status = check.value ? '✅' : '❌'
  const match = check.expected ? check.value === check.expected : true
  const matchStatus = match ? '' : ' ⚠️ Valeur inattendue'
  
  console.log(`${status} ${check.name}${matchStatus}`)
  
  if (check.value) {
    const displayed = check.value.length > 30 
      ? check.value.substring(0, 27) + '...'
      : check.value
    console.log(`   └─ ${displayed}`)
  }
  
  if (!check.value && check.required) {
    allValid = false
  }
})

console.log('\n' + '='.repeat(60))

// Construire et afficher l'URL de redirection
const appUrl = process.env.NEXT_PUBLIC_APP_URL
const redirectUri = `${appUrl}/api/auth/instagram/callback`

console.log('\n🔗 Redirect URI Configuration:')
console.log(`   └─ ${redirectUri}`)

console.log('\n📋 Configuration Instagram Developer requise:')
console.log(`   1. Valid OAuth Redirect URIs:`)
console.log(`      • ${redirectUri}`)
console.log(`      • http://localhost:3000/api/auth/instagram/callback (dev)`)
console.log(`\n   2. App Domains:`)
console.log(`      • fit-flow-gamma.vercel.app`)
console.log(`      • localhost`)
console.log(`\n   3. Scopes autorisés:`)
console.log(`      • user_profile`)
console.log(`      • instagram_business_basic`)
console.log(`      • instagram_business_content_publish`)

console.log('\n' + '='.repeat(60))

if (allValid) {
  console.log('\n✅ Toutes les variables d\'environnement sont configurées!')
  console.log('\n📝 Prochaines étapes:')
  console.log('   1. Visitez: https://developers.facebook.com/apps/')
  console.log('   2. Sélectionnez votre app "FitFlow"')
  console.log('   3. Allez à Instagram → Configuration')
  console.log('   4. Vérifiez que le Redirect URI ci-dessus est dans la liste blanche')
  console.log('   5. Déployez et testez: https://fit-flow-gamma.vercel.app/settings\n')
} else {
  console.log('\n❌ Des variables d\'environnement manquent!')
  console.log('   Vérifiez votre fichier .env.local\n')
  process.exit(1)
}

console.log('=' .repeat(60) + '\n')
