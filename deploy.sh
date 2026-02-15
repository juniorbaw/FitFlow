#!/bin/bash

# 🚀 FITFLOW - SCRIPT DE DÉPLOIEMENT AUTOMATISÉ
# Usage: ./deploy.sh [staging|production]

set -e  # Arrêter si erreur

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   🚀 FITFLOW DEPLOYMENT SCRIPT 🚀    ║"
echo "╔════════════════════════════════════════╗"
echo -e "${NC}"

# Vérifier l'environnement
ENV=${1:-staging}
if [[ "$ENV" != "staging" && "$ENV" != "production" ]]; then
  echo -e "${RED}❌ Environnement invalide. Usage: ./deploy.sh [staging|production]${NC}"
  exit 1
fi

echo -e "${BLUE}📦 Environnement: ${ENV}${NC}"
echo ""

# Étape 1: Vérifier que nous sommes dans le bon répertoire
echo -e "${YELLOW}🔍 Vérification du répertoire...${NC}"
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Fichier package.json non trouvé. Êtes-vous dans le bon répertoire?${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Répertoire correct${NC}"
echo ""

# Étape 2: Vérifier les fichiers .env
echo -e "${YELLOW}🔍 Vérification des variables d'environnement...${NC}"
if [ ! -f ".env.local" ]; then
  echo -e "${RED}❌ Fichier .env.local non trouvé!${NC}"
  exit 1
fi
echo -e "${GREEN}✅ .env.local trouvé${NC}"

# Vérifier les variables critiques
REQUIRED_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "NEXT_PUBLIC_INSTAGRAM_APP_ID"
  "INSTAGRAM_APP_SECRET"
  "STRIPE_SECRET_KEY"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "GEMINI_API_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
  if ! grep -q "^${var}=" .env.local; then
    echo -e "${RED}❌ Variable manquante: ${var}${NC}"
    exit 1
  fi
done
echo -e "${GREEN}✅ Toutes les variables d'environnement sont présentes${NC}"
echo ""

# Étape 3: Installer les dépendances
echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
npm install --quiet
echo -e "${GREEN}✅ Dépendances installées${NC}"
echo ""

# Étape 4: Linter et formater le code
echo -e "${YELLOW}🔧 Vérification du code (linting)...${NC}"
if npm run lint --quiet; then
  echo -e "${GREEN}✅ Linting réussi${NC}"
else
  echo -e "${YELLOW}⚠️  Warnings détectés (non bloquant)${NC}"
fi
echo ""

# Étape 5: Build de production
echo -e "${YELLOW}🏗️  Build de production...${NC}"
if npm run build; then
  echo -e "${GREEN}✅ Build réussi${NC}"
else
  echo -e "${RED}❌ Build échoué!${NC}"
  exit 1
fi
echo ""

# Étape 6: Vérifier git status
echo -e "${YELLOW}📝 Vérification du statut Git...${NC}"
if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  Des fichiers non commités détectés:${NC}"
  git status -s
  echo ""
  read -p "Voulez-vous continuer le déploiement? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Déploiement annulé${NC}"
    exit 1
  fi
fi
echo -e "${GREEN}✅ Git status OK${NC}"
echo ""

# Étape 7: Commit et push (si production)
if [[ "$ENV" == "production" ]]; then
  echo -e "${YELLOW}📤 Commit des changements...${NC}"
  
  COMMIT_MSG="🚀 Deploy to production - $(date +'%Y-%m-%d %H:%M:%S')"
  
  git add .
  git commit -m "$COMMIT_MSG" || echo "Rien à commiter"
  
  echo -e "${YELLOW}🔼 Push vers origin...${NC}"
  BRANCH=$(git branch --show-current)
  git push origin "$BRANCH"
  
  echo -e "${GREEN}✅ Code pushed vers GitHub${NC}"
  echo ""
fi

# Étape 8: Déployer sur Vercel
echo -e "${YELLOW}🚀 Déploiement sur Vercel...${NC}"

if [[ "$ENV" == "production" ]]; then
  echo -e "${BLUE}🌐 Déploiement PRODUCTION...${NC}"
  npx vercel --prod --yes
else
  echo -e "${BLUE}🧪 Déploiement STAGING...${NC}"
  npx vercel --yes
fi

echo ""
echo -e "${GREEN}✅ Déploiement réussi!${NC}"
echo ""

# Étape 9: Afficher les URLs
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS! 🎉${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo ""

if [[ "$ENV" == "production" ]]; then
  echo -e "${GREEN}🌐 URL Production: https://fit-flow-gamma.vercel.app${NC}"
else
  echo -e "${GREEN}🧪 URL Staging: Vérifier dans la sortie Vercel ci-dessus${NC}"
fi

echo ""
echo -e "${YELLOW}📋 PROCHAINES ÉTAPES:${NC}"
echo "1. Tester le site déployé"
echo "2. Vérifier les webhooks Instagram/Stripe"
echo "3. Tester une connexion Instagram"
echo "4. Vérifier Supabase (tables, RLS)"
echo "5. Lancer les campagnes marketing!"
echo ""

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🚀 BONNE CHANCE AVEC FITFLOW! 🚀${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
