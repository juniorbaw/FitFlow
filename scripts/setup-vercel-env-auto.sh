#!/bin/bash

# Script pour configurer les variables d'environnement sur Vercel
# Préalable: 'vercel' doit être installé (npm install -g vercel) et authentifié (vercel login)

set -e

echo "🔧 Configuration automatique des variables d'environnement Vercel"
echo "================================================================"
echo ""

# Vérifier que Vercel CLI est disponible
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non trouvé. Installez-le avec:"
    echo "   npm install -g vercel"
    exit 1
fi

# Charger les variables depuis .env.local
if [ ! -f .env.local ]; then
    echo "❌ Fichier .env.local non trouvé"
    exit 1
fi

source .env.local

echo "📝 Variables à configurer sur Vercel:"
echo "  1. NEXT_PUBLIC_INSTAGRAM_APP_ID=$NEXT_PUBLIC_INSTAGRAM_APP_ID"
echo "  2. INSTAGRAM_APP_SECRET=$INSTAGRAM_APP_SECRET"
echo "  3. SUPABASE_SERVICE_ROLE_KEY=***"
echo ""

echo "⚙️  Ajout des variables sur Vercel..."
echo ""

# Vérifier que les variables existent
if [ -z "$NEXT_PUBLIC_INSTAGRAM_APP_ID" ]; then
    echo "❌ NEXT_PUBLIC_INSTAGRAM_APP_ID manquante dans .env.local"
    exit 1
fi

if [ -z "$INSTAGRAM_APP_SECRET" ]; then
    echo "❌ INSTAGRAM_APP_SECRET manquante dans .env.local"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local"
    exit 1
fi

# Ajouter les variables via Vercel CLI
echo "✓ Pushing NEXT_PUBLIC_INSTAGRAM_APP_ID..."
vercel env add NEXT_PUBLIC_INSTAGRAM_APP_ID "$NEXT_PUBLIC_INSTAGRAM_APP_ID" < <(echo -e "production\npreview\ndevelopment") || true

echo "✓ Pushing INSTAGRAM_APP_SECRET..."
vercel env add INSTAGRAM_APP_SECRET "$INSTAGRAM_APP_SECRET" < <(echo -e "production\npreview\ndevelopment") || true

echo "✓ Pushing SUPABASE_SERVICE_ROLE_KEY..."
vercel env add SUPABASE_SERVICE_ROLE_KEY "$SUPABASE_SERVICE_ROLE_KEY" < <(echo -e "production\npreview\ndevelopment") || true

echo ""
echo "✅ Variables configurées sur Vercel!"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Committez et poussez pour déclencher un redéploiement:"
echo "     git push"
echo "  2. Attendez que le déploiement finisse (3-5 min)"
echo "  3. Testez: https://fit-flow-gamma.vercel.app/settings"
echo ""
