#!/bin/bash

# Script pour configurer les variables d'environnement sur Vercel
# Usage: ./scripts/setup-vercel-env.sh

echo "🔧 Configuration des variables d'environnement Vercel"
echo "==========================================="
echo ""
echo "Les variables suivantes doivent être ajoutées à Vercel:"
echo ""
echo "📱 Instagram Configuration:"
echo "   NEXT_PUBLIC_INSTAGRAM_APP_ID: 4318616691715057"
echo "   INSTAGRAM_APP_SECRET: a667e928daee99ec432b7a829394dc6a"
echo ""
echo "🗄️  Supabase Configuration:"
echo "   NEXT_PUBLIC_SUPABASE_URL: https://lophxncjsbmkfxhjdgkp.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY: [voir .env.local]"
echo "   SUPABASE_SERVICE_ROLE_KEY: [voir .env.local]"
echo ""
echo "📝 Instructions:"
echo "   1. Allez sur: https://vercel.com/dashboard/fit-flow/settings/environment-variables"
echo "   2. Ajoutez chaque variable ci-dessus"
echo "   3. Pour les valeurs, voir le fichier .env.local"
echo "   4. Cliquez sur 'Save'"
echo "   5. Redéployez le projet"
echo ""
echo "✅ Après configuration, relancez le build:"
echo "   git push"
echo ""
