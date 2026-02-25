#!/bin/bash
# ============================================================================
# Deploy Web App with Doppler
# ============================================================================
# Usage: ./deploy-web.sh [environment]
#   environment: dev | stg | prd (default: stg)
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Environment
ENV=${1:-stg}

# Normalize environment name
if [ "$ENV" == "dev" ] || [ "$ENV" == "development" ]; then
    CONFIG="dev_web"
    VERCEL_TARGET=""
elif [ "$ENV" == "stg" ] || [ "$ENV" == "staging" ]; then
    CONFIG="stg_web"
    VERCEL_TARGET=""
elif [ "$ENV" == "prd" ] || [ "$ENV" == "production" ]; then
    CONFIG="prd_web"
    VERCEL_TARGET="--prod"
else
    echo -e "${RED}Error: Invalid environment '$ENV'${NC}"
    echo "Valid: dev, stg, prd (or development, staging, production)"
    exit 1
fi

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║           Deploy IntegrateWise Web                                  ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Environment: ${YELLOW}$ENV${NC}"
echo -e "Doppler Config: ${YELLOW}$CONFIG${NC}"
echo ""

# Check Doppler auth
if ! doppler whoami > /dev/null 2>&1; then
    echo -e "${RED}Error: Not authenticated with Doppler${NC}"
    echo "Run: doppler login"
    exit 1
fi

# Verify config exists
echo -e "${BLUE}▶ Checking Doppler config...${NC}"
if ! doppler configs get "$CONFIG" --project integratewise > /dev/null 2>&1; then
    echo -e "${RED}Error: Config '$CONFIG' not found in Doppler${NC}"
    echo "Available configs:"
    doppler configs --project integratewise
    exit 1
fi
echo -e "${GREEN}✓ Config exists${NC}"

# Verify required secrets
echo -e "${BLUE}▶ Checking required secrets...${NC}"
REQUIRED_SECRETS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
)

MISSING_SECRETS=()
for secret in "${REQUIRED_SECRETS[@]}"; do
    if ! doppler secrets get "$secret" --config "$CONFIG" --project integratewise > /dev/null 2>&1; then
        MISSING_SECRETS+=("$secret")
    fi
done

if [ ${#MISSING_SECRETS[@]} -gt 0 ]; then
    echo -e "${RED}Error: Missing required secrets:${NC}"
    for secret in "${MISSING_SECRETS[@]}"; do
        echo "  - $secret"
    done
    echo ""
    echo "Set them with:"
    for secret in "${MISSING_SECRETS[@]}"; do
        echo "  doppler secrets set $secret --config $CONFIG"
    done
    exit 1
fi
echo -e "${GREEN}✓ All required secrets present${NC}"

# Build
echo ""
echo -e "${BLUE}▶ Building...${NC}"
cd apps/web
doppler run --config "$CONFIG" --project integratewise -- npm run build

# Deploy
echo ""
echo -e "${BLUE}▶ Deploying to Vercel...${NC}"
if [ -n "$VERCEL_TARGET" ]; then
    doppler run --config "$CONFIG" --project integratewise -- vercel "$VERCEL_TARGET"
else
    doppler run --config "$CONFIG" --project integratewise -- vercel
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                      Deployment Complete!                             ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
