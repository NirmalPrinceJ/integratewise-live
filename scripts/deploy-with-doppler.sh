#!/bin/bash
# ============================================================================
# Deploy IntegrateWise with Doppler
# ============================================================================
# Usage: ./deploy-with-doppler.sh [service] [environment]
# Examples:
#   ./deploy-with-doppler.sh web production
#   ./deploy-with-doppler.sh spine-v2 staging
#   ./deploy-with-doppler.sh all production
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Arguments
SERVICE=${1:-web}
ENV=${2:-staging}

# Validate environment
if [[ ! "$ENV" =~ ^(dev|stg|prd|development|staging|production)$ ]]; then
    echo -e "${RED}Error: Invalid environment '$ENV'${NC}"
    echo "Valid: dev, stg, prd (or development, staging, production)"
    exit 1
fi

# Normalize environment
ENV_SHORT=$(echo "$ENV" | sed 's/development/dev/' | sed 's/staging/stg/' | sed 's/production/prd/')

# Services
ALL_SERVICES="web-unified spine-v2 loader normalizer connector cognitive-brain stream-gateway memory-consolidator workflow agents"

# Function to deploy web-unified (Cloudflare Pages via Vite)
deploy_web() {
    local env=$1
    local config="${ENV_SHORT}_web-unified"

    echo -e "${BLUE}▶ Deploying web-unified (Cloudflare Pages) with config: $config${NC}"

    cd apps/web-unified

    # Build with Doppler-injected VITE_* env vars
    doppler run --config "$config" -- npm run build

    # Deploy to Cloudflare Pages
    if [ "$env" == "prd" ] || [ "$env" == "production" ]; then
        wrangler pages deploy dist --project-name=integratewise --branch=main
    else
        wrangler pages deploy dist --project-name=integratewise --branch="$env"
    fi

    cd ../..
    echo -e "${GREEN}✓ Web-unified deployed to Cloudflare Pages${NC}"
}

# Function to deploy worker (Cloudflare)
deploy_worker() {
    local service=$1
    local env=$2
    local config="${ENV_SHORT}_${service}"
    
    echo -e "${BLUE}▶ Deploying $service (Cloudflare) with config: $config${NC}"
    
    if [ ! -d "services/$service" ]; then
        echo -e "${YELLOW}⚠ Service directory not found: services/$service${NC}"
        return 1
    fi
    
    cd "services/$service"
    doppler run --config "$config" -- wrangler deploy
    cd ../..
    
    echo -e "${GREEN}✓ $service deployed${NC}"
}

# Main deployment logic
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║           Deploy IntegrateWise with Doppler                          ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Environment: ${YELLOW}$ENV_SHORT${NC}"
echo -e "Service: ${YELLOW}$SERVICE${NC}"
echo ""

# Check Doppler auth
if ! doppler whoami > /dev/null 2>&1; then
    echo -e "${RED}Error: Not authenticated with Doppler${NC}"
    echo "Run: doppler login"
    exit 1
fi

# Deploy based on service
if [ "$SERVICE" == "all" ]; then
    echo -e "${BLUE}Deploying all services...${NC}"
    echo ""
    
    # Deploy web first
    deploy_web "$ENV_SHORT"
    echo ""
    
    # Deploy workers
    for svc in $ALL_SERVICES; do
        if [ "$svc" != "web" ]; then
            deploy_worker "$svc" "$ENV_SHORT" || true
            echo ""
        fi
    done
    
    echo -e "${GREEN}✅ All services deployed!${NC}"
    
elif [ "$SERVICE" == "web" ] || [ "$SERVICE" == "web-unified" ]; then
    deploy_web "$ENV_SHORT"
    
else
    deploy_worker "$SERVICE" "$ENV_SHORT"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                      Deployment Complete!                             ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
