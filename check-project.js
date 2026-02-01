// Script de diagnostic ClientWin
const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC DU PROJET CLIENTWIN\n');

// 1. Vérifier .env.local
console.log('1️⃣ Vérification .env.local...');
try {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
    const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    console.log(`   ✅ Fichier .env.local existe`);
    console.log(`   ${hasSupabaseUrl ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_URL`);
    console.log(`   ${hasSupabaseKey ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_ANON_KEY`);
    
    if (envContent.includes('REMPLACE') || envContent.includes('xxx')) {
      console.log('   ⚠️  ATTENTION: Clés non remplies détectées!');
    }
  } else {
    console.log('   ❌ Fichier .env.local MANQUANT!');
  }
} catch (err) {
  console.log('   ❌ Erreur:', err.message);
}

console.log('\n2️⃣ Vérification lib/supabase.ts...');
try {
  const supabasePath = path.join(process.cwd(), 'lib', 'supabase.ts');
  if (fs.existsSync(supabasePath)) {
    console.log('   ✅ lib/supabase.ts existe');
    const content = fs.readFileSync(supabasePath, 'utf8');
    if (content.includes('createClient')) {
      console.log('   ✅ Client Supabase configuré');
    } else {
      console.log('   ❌ Client Supabase non configuré');
    }
  } else {
    console.log('   ❌ lib/supabase.ts MANQUANT!');
  }
} catch (err) {
  console.log('   ❌ Erreur:', err.message);
}

console.log('\n3️⃣ Vérification pages auth...');
const authPages = [
  'app/(auth)/login/page.tsx',
  'app/(auth)/signup/page.tsx'
];

authPages.forEach(pagePath => {
  const fullPath = path.join(process.cwd(), pagePath);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${pagePath}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Vérifier si c'est encore du code de simulation
    if (content.includes('setTimeout') && content.includes('simulation')) {
      console.log(`   ⚠️  ${pagePath} utilise ENCORE du code de simulation!`);
    }
    
    if (!content.includes('supabase.auth')) {
      console.log(`   ❌ ${pagePath} N'appelle PAS Supabase!`);
    } else {
      console.log(`   ✅ ${pagePath} appelle Supabase correctement`);
    }
  } else {
    console.log(`   ❌ ${pagePath} MANQUANT!`);
  }
});

console.log('\n4️⃣ Vérification Dashboard...');
const dashboardPath = path.join(process.cwd(), 'app/dashboard/page.tsx');
if (fs.existsSync(dashboardPath)) {
  console.log('   ✅ app/dashboard/page.tsx existe');
  const content = fs.readFileSync(dashboardPath, 'utf8');
  if (content.includes('getUser')) {
    console.log('   ✅ Dashboard vérifie authentification');
  } else {
    console.log('   ❌ Dashboard ne vérifie PAS l\'authentification');
  }
} else {
  console.log('   ❌ Dashboard MANQUANT!');
}

console.log('\n5️⃣ Vérification package.json...');
try {
  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  const hasSupabase = pkg.dependencies && pkg.dependencies['@supabase/supabase-js'];
  
  console.log(`   ${hasSupabase ? '✅' : '❌'} @supabase/supabase-js`);
} catch (err) {
  console.log('   ❌ Erreur:', err.message);
}

console.log('\n📊 RÉSUMÉ:');
console.log('══════════════════════════════════════════════════');
console.log('Si tu vois des ❌ ou ⚠️  ci-dessus, ton projet a des problèmes.');
console.log('Copie TOUTE cette sortie et envoie-la moi pour que je corrige!');
console.log('══════════════════════════════════════════════════\n');