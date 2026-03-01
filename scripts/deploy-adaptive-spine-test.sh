#!/bin/bash

# Deployment Script: Adaptive Spine Implementation (Test Mode)
# Run this to deploy Loader + Connector services to Cloudflare (without secrets)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$SCRIPT_DIR/.."

echo "🚀 Adaptive Spine Deployment Script (Test Mode)"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Prerequisites Check${NC}"
echo ""

# Check wrangler
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ wrangler not found${NC}"
    echo "Install: npm install -g wrangler"
    exit 1
fi
echo -e "${GREEN}✅ wrangler installed${NC} ($(wrangler --version))"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js installed${NC} ($(node --version))"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm not found${NC}"
    echo "Install: npm install -g pnpm"
    exit 1
fi
echo -e "${GREEN}✅ pnpm installed${NC} ($(pnpm --version))"

echo ""

# Phase 1: Check Wrangler Authentication
echo -e "${BLUE}🔐 Phase 1: Wrangler Authentication${NC}"
echo ""

if wrangler whoami &> /dev/null; then
    echo -e "${GREEN}✅ Already authenticated with Cloudflare${NC}"
    wrangler whoami
else
    echo -e "${YELLOW}⚠️  Not authenticated. Starting login...${NC}"
    wrangler login
fi

echo ""

# Phase 2: Deploy Loader Worker
echo -e "${BLUE}🚀 Phase 2: Deploy Loader Worker (Test)${NC}"
echo ""

cd "$REPO_ROOT/services/cloudflare-workers"

echo "Deploying loader..."
wrangler deploy --config wrangler.loader.toml

echo -e "${GREEN}✅ Loader deployed${NC}"

# Get deployment URL
echo ""
echo "Getting deployment details..."
wrangler deployments list --config wrangler.loader.toml | head -10

echo ""

# Phase 3: Deploy Connector Worker
echo -e "${BLUE}🚀 Phase 3: Deploy Connector Manager (Test)${NC}"
echo ""

echo "Deploying connector..."
wrangler deploy --config wrangler.connector.toml

echo -e "${GREEN}✅ Connector deployed${NC}"

# Get deployment URL
echo ""
echo "Getting deployment details..."
wrangler deployments list --config wrangler.connector.toml | head -10

echo ""

# Phase 4: Summary
echo -e "${BLUE}📋 Deployment Summary${NC}"
echo ""
echo -e "${GREEN}✅ Test deployment complete!${NC}"
echo ""
echo -e "${YELLOW}⚠️  Note: Secrets have NOT been configured${NC}"
echo ""
echo "Next steps:"
echo "1. Configure secrets using wrangler:"
echo "   cd services/cloudflare-workers"
echo "   echo 'YOUR_NEON_URL' | wrangler secret put NEON_DB_URL --config wrangler.loader.toml"
echo "   echo 'YOUR_SECRET' | wrangler secret put BUCKET_SIGNING_SECRET --config wrangler.loader.toml"
echo "   echo 'YOUR_NEON_URL' | wrangler secret put NEON_DB_URL --config wrangler.connector.toml"
echo "   echo 'YOUR_KEY' | wrangler secret put CONNECTOR_ENCRYPTION_KEY --config wrangler.connector.toml"
echo ""
echo "2. Run SQL migrations (if not already done):"
echo "   psql \$DATABASE_URL -f sql-migrations/032_spine_department_streams.sql"
echo "   psql \$DATABASE_URL -f sql-migrations/033_spine_accounts_intelligence.sql"
echo "   psql \$DATABASE_URL -f sql-migrations/034_spine_progressive_universal.sql"
echo "   psql \$DATABASE_URL -f sql-migrations/035_spine_adaptive_registry.sql"
echo ""
echo "3. For full deployment with secrets, run:"
echo "   ./scripts/deploy-adaptive-spine.sh"
echo ""
echo -e "${GREEN}🎉 Test deployment complete!${NC}"
