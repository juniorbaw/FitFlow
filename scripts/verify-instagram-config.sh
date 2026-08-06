#!/bin/bash

# Vérificateur complet de configuration Instagram OAuth
echo "🔍 Vérification complète de la configuration Instagram OAuth"
echo "============================================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Vérifier .env.local
echo "📋 Étape 1: Vérification de .env.local"
echo "---"

if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Fichier .env.local non trouvé${NC}"
    exit 1
fi

# Fonction pour vérifier une variable
check_env_var() {
    local var_name=$1
    local var_value=$(grep "^$var_name=" .env.local | cut -d'=' -f2 | tr -d '"')
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ $var_name: MANQUANTE${NC}"
        return 1
    else
        # Masquer les values sensibles
        if [[ "$var_name" == *"SECRET"* ]] || [[ "$var_name" == *"KEY"* ]]; then
            echo -e "${GREEN}✅ $var_name: Configurée${NC}"
        else
            echo -e "${GREEN}✅ $var_name: $var_value${NC}"
        fi
        return 0
    fi
}

check_env_var "NEXT_PUBLIC_INSTAGRAM_APP_ID"
check_env_var "INSTAGRAM_APP_SECRET"
check_env_var "SUPABASE_SERVICE_ROLE_KEY"

echo ""
echo "🔗 Étape 2: Vérification des URLs"
echo "---"

APP_URL=$(grep "^NEXT_PUBLIC_APP_URL=" .env.local | cut -d'=' -f2 | tr -d '"')
if [ -z "$APP_URL" ]; then
    APP_URL="https://fit-flow-gamma.vercel.app"
fi

echo "App URL: $APP_URL"
echo "Redirect URI attendu: $APP_URL/api/auth/instagram/callback"

echo ""
echo "📱 Étape 3: Vérification du code"
echo "---"

# Vérifier que le code Instagram existe
if [ -f "app/api/auth/instagram/route.ts" ]; then
    echo -e "${GREEN}✅ app/api/auth/instagram/route.ts existe${NC}"
else
    echo -e "${RED}❌ app/api/auth/instagram/route.ts MANQUANT${NC}"
fi

if [ -f "app/api/auth/instagram/callback/route.ts" ]; then
    echo -e "${GREEN}✅ app/api/auth/instagram/callback/route.ts existe${NC}"
else
    echo -e "${RED}❌ app/api/auth/instagram/callback/route.ts MANQUANT${NC}"
fi

echo ""
echo "✅ Vérification complète terminée!"
echo ""
echo "📝 Prochaines étapes:"
echo "  1. Si tout est ✅, lancez: npm run dev"
echo "  2. Allez à: http://localhost:3000/settings"
echo "  3. Cliquez sur 'Connect Instagram'"
echo "  4. Regardez la console pour les logs:"
echo "     - 📱 Instagram OAuth Request"
echo "     - 🔄 Exchanging code for access token"
echo "     - ❌ Token exchange error (si erreur)"
echo ""
echo "🐛 Si erreur, notez-la et partagez le message d'erreur exact!"
echo ""
