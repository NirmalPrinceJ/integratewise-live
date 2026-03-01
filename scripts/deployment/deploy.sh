#!/bin/bash

# Deployment Script: Adaptive Spine Implementation
# Run this to deploy Loader + Connector services to Cloudflare

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$SCRIPT_DIR/../.."

echo "🚀 Adaptive Spine Deployment Script"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${BLUE}📋 Prerequisites Check${NC}"
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
echo "${BLUE}🔐 Phase 1: Wrangler Authentication${NC}"
echo ""

if wrangler whoami &> /dev/null; then
    echo -e "${GREEN}✅ Already authenticated with Cloudflare${NC}"
else
    echo -e "${YELLOW}⚠️  Not authenticated. Starting login...${NC}"
    wrangler login
fi

echo ""

# Phase 2: Set Loader Secrets
echo "${BLUE}🔑 Phase 2: Configure Loader Secrets${NC}"
echo ""

cd "$REPO_ROOT/services/cloudflare-workers"

read -p "Enter Neon connection string (DATABASE_URL): " NEON_URL
if [ -z "$NEON_URL" ]; then
    echo -e "${RED}❌ Neon URL cannot be empty${NC}"
    exit 1
fi

# Set Neon DB URL secret
echo "$NEON_URL" | wrangler secret put NEON_DB_URL --config wrangler.loader.toml
echo -e "${GREEN}✅ NEON_DB_URL set${NC}"

# Generate and set bucket signing secret
BUCKET_SECRET=$(openssl rand -hex 32)
echo "$BUCKET_SECRET" | wrangler secret put BUCKET_SIGNING_SECRET --config wrangler.loader.toml
echo -e "${GREEN}✅ BUCKET_SIGNING_SECRET generated and set${NC}"
echo "   Secret: $BUCKET_SECRET"

echo ""

# Phase 3: Deploy Loader Worker
echo "${BLUE}🚀 Phase 3: Deploy Loader Worker${NC}"
echo ""

wrangler deploy --config wrangler.loader.toml
LOADER_URL=$(wrangler deployments list --config wrangler.loader.toml | grep -oP 'https://[^ ]+' | head -1)

if [ -z "$LOADER_URL" ]; then
    LOADER_URL="https://integratewise-loader.ACCOUNT_ID.workers.dev"
fi

echo -e "${GREEN}✅ Loader deployed${NC}"
echo "   URL: $LOADER_URL"

echo ""

# Phase 4: Set Connector Secrets
echo "${BLUE}🔑 Phase 4: Configure Connector Secrets${NC}"
echo ""

# Neon URL (same as loader)
echo "$NEON_URL" | wrangler secret put NEON_DB_URL --config wrangler.connector.toml
echo -e "${GREEN}✅ NEON_DB_URL set${NC}"

# Generate encryption key
ENCRYPTION_KEY=$(openssl rand -hex 32)
echo "$ENCRYPTION_KEY" | wrangler secret put CONNECTOR_ENCRYPTION_KEY --config wrangler.connector.toml
echo -e "${GREEN}✅ CONNECTOR_ENCRYPTION_KEY generated${NC}"

# Callback URL (ask user)
read -p "Enter connector callback URL (e.g., https://your-domain.com/api/connectors/callback): " CALLBACK_URL
if [ -n "$CALLBACK_URL" ]; then
    echo "$CALLBACK_URL" | wrangler secret put CONNECTOR_CALLBACK_URL --config wrangler.connector.toml
    echo -e "${GREEN}✅ CONNECTOR_CALLBACK_URL set${NC}"
fi

# OAuth secrets (with prompts)
echo ""
echo "Enter OAuth credentials (leave blank to skip):"
echo ""

read -p "Salesforce Client ID: " SF_CLIENT_ID
if [ -n "$SF_CLIENT_ID" ]; then
    echo "$SF_CLIENT_ID" | wrangler secret put SALESFORCE_CLIENT_ID --config wrangler.connector.toml
    read -p "Salesforce Client Secret: " SF_CLIENT_SECRET
    echo "$SF_CLIENT_SECRET" | wrangler secret put SALESFORCE_CLIENT_SECRET --config wrangler.connector.toml
    echo -e "${GREEN}✅ Salesforce credentials set${NC}"
fi

read -p "Google Client ID: " GOOGLE_CLIENT_ID
if [ -n "$GOOGLE_CLIENT_ID" ]; then
    echo "$GOOGLE_CLIENT_ID" | wrangler secret put GOOGLE_CLIENT_ID --config wrangler.connector.toml
    read -p "Google Client Secret: " GOOGLE_CLIENT_SECRET
    echo "$GOOGLE_CLIENT_SECRET" | wrangler secret put GOOGLE_CLIENT_SECRET --config wrangler.connector.toml
    echo -e "${GREEN}✅ Google credentials set${NC}"
fi

echo ""

# Phase 5: Deploy Connector Worker
echo "${BLUE}🚀 Phase 5: Deploy Connector Manager${NC}"
echo ""

wrangler deploy --config wrangler.connector.toml
CONNECTOR_URL=$(wrangler deployments list --config wrangler.connector.toml | grep -oP 'https://[^ ]+' | head -1)

if [ -z "$CONNECTOR_URL" ]; then
    CONNECTOR_URL="https://integratewise-connector-manager.ACCOUNT_ID.workers.dev"
fi

echo -e "${GREEN}✅ Connector deployed${NC}"
echo "   URL: $CONNECTOR_URL"

echo ""

# Phase 6: Update Frontend Environment
echo "${BLUE}🔧 Phase 6: Update Frontend Environment${NC}"
echo ""

cd "$REPO_ROOT"

# Update .env.local
if [ -f ".env.local" ]; then
    # Backup existing
    cp .env.local .env.local.backup
    echo -e "${GREEN}✅ Backed up .env.local${NC}"
fi

# Add environment variables
cat >> .env.local << EOF

# Adaptive Spine Deployment URLs
NEXT_PUBLIC_LOADER_URL=$LOADER_URL
NEXT_PUBLIC_CONNECTOR_URL=$CONNECTOR_URL
EOF

echo -e "${GREEN}✅ Updated .env.local${NC}"
echo "   NEXT_PUBLIC_LOADER_URL=$LOADER_URL"
echo "   NEXT_PUBLIC_CONNECTOR_URL=$CONNECTOR_URL"

echo ""

# Phase 7: Summary
echo "${BLUE}📋 Deployment Summary${NC}"
echo ""
echo -e "${GREEN}✅ All workers deployed!${NC}"
echo ""
echo "Next steps:"
echo "1. Run SQL migrations (if not already done):"
echo "   psql \$DATABASE_URL -f sql-migrations/032_spine_department_streams.sql"
echo "   psql \$DATABASE_URL -f sql-migrations/033_spine_accounts_intelligence.sql"
echo "   psql \$DATABASE_URL -f sql-migrations/034_spine_progressive_universal.sql"
echo "   psql \$DATABASE_URL -f sql-migrations/035_spine_adaptive_registry.sql"
echo ""
echo "2. Populate expected fields for completeness scoring"
echo ""
echo "3. Test end-to-end: Upload CSV to bucket → Verify adaptive observation"
echo ""
echo "4. Documentation: See DEPLOYMENT_CHECKLIST.md"
echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
