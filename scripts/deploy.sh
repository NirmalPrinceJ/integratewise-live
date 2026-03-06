#!/bin/bash
# IntegrateWise OS - Cloudflare Deployment Script
# Usage: ./scripts/deploy.sh [environment] [service]
# Examples:
#   ./scripts/deploy.sh staging          # Deploy all to staging
#   ./scripts/deploy.sh production       # Deploy all to production
#   ./scripts/deploy.sh staging loader   # Deploy only loader to staging

set -e

ENVIRONMENT=${1:-staging}
SERVICE=${2:-all}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  IntegrateWise OS - Cloudflare Deployment${NC}"
echo -e "${BLUE}  Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "${BLUE}  Service: ${YELLOW}$SERVICE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
    exit 1
fi

# Set environment-specific variables
if [[ "$ENVIRONMENT" == "production" ]]; then
    ENV_SUFFIX=""
    PAGES_BRANCH="main"
else
    ENV_SUFFIX="-staging"
    PAGES_BRANCH="staging"
fi

# List of all services with wrangler.toml
SERVICES=(
    "services/loader"
    "services/normalizer"
    "services/store"
    "services/spine"
    "services/think"
    "services/act"
    "services/govern"
    "services/gateway"
    "services/knowledge"
    "services/iq-hub"
    "services/mcp-connector"
    "services/admin"
)

# Deploy a single service
deploy_service() {
    local service_path=$1
    local service_name=$(basename $service_path)
    
    echo -e "\n${YELLOW}Deploying: ${service_name}${NC}"
    
    if [[ ! -f "$service_path/wrangler.toml" ]]; then
        echo -e "${RED}  ⚠ No wrangler.toml found, skipping${NC}"
        return 0
    fi
    
    cd "$service_path"
    
    if [[ "$ENVIRONMENT" == "staging" ]]; then
        # Deploy to staging environment
        pnpm wrangler deploy --env staging 2>/dev/null || pnpm wrangler deploy
    else
        # Deploy to production
        pnpm wrangler deploy
    fi
    
    cd - > /dev/null
    echo -e "${GREEN}  ✓ ${service_name} deployed${NC}"
}

# Deploy Next.js app to Cloudflare Pages
deploy_nextjs_app() {
    local app_path=$1
    local app_name=$(basename $app_path)
    
    echo -e "\n${YELLOW}Deploying Next.js App: ${app_name}${NC}"
    
    cd "$app_path"
    
    # Build the app
    echo -e "  Building..."
    pnpm build
    
    # Deploy to Cloudflare Pages
    echo -e "  Deploying to Cloudflare Pages..."
    pnpm wrangler pages deploy .vercel/output/static \
        --project-name="integratewise-os${ENV_SUFFIX}" \
        --branch="$PAGES_BRANCH"
    
    cd - > /dev/null
    echo -e "${GREEN}  ✓ ${app_name} deployed to Cloudflare Pages${NC}"
}

# Deploy all services
deploy_all_services() {
    echo -e "\n${BLUE}Deploying all Cloudflare Workers...${NC}"
    
    for service in "${SERVICES[@]}"; do
        if [[ -d "$service" ]]; then
            deploy_service "$service"
        fi
    done
}

# Main deployment logic
main() {
    # Ensure we're in the root directory
    if [[ ! -f "package.json" ]] || [[ ! -d "services" ]]; then
        echo -e "${RED}Error: Run this script from the repository root${NC}"
        exit 1
    fi
    
    # Check for wrangler
    if ! command -v wrangler &> /dev/null; then
        echo -e "${YELLOW}Installing wrangler...${NC}"
        pnpm add -g wrangler
    fi
    
    if [[ "$SERVICE" == "all" ]]; then
        # Deploy all services
        deploy_all_services
        
        # Deploy Next.js apps
        if [[ -d "apps/integratewise-os" ]]; then
            deploy_nextjs_app "apps/integratewise-os"
        fi
    elif [[ "$SERVICE" == "workers" ]]; then
        # Deploy only workers
        deploy_all_services
    elif [[ "$SERVICE" == "app" ]] || [[ "$SERVICE" == "ui" ]]; then
        # Deploy only the Next.js app
        deploy_nextjs_app "apps/integratewise-os"
    else
        # Deploy specific service
        local found=false
        for service in "${SERVICES[@]}"; do
            if [[ "$(basename $service)" == "$SERVICE" ]]; then
                deploy_service "$service"
                found=true
                break
            fi
        done
        
        if [[ "$found" == false ]]; then
            echo -e "${RED}Error: Service '$SERVICE' not found${NC}"
            echo -e "Available services: ${SERVICES[*]##*/}"
            exit 1
        fi
    fi
    
    echo -e "\n${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  ✓ Deployment Complete!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
}

main
