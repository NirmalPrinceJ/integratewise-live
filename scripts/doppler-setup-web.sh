#!/bin/bash

# Doppler Setup Script for Web App (apps/web)
# This script sets up Doppler configuration for the Next.js web application

set -e

PROJECT="integratewise"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
WEB_DIR="$ROOT_DIR/apps/web"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Doppler Setup for Web App (apps/web)                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Doppler CLI is installed
if ! command -v doppler &> /dev/null; then
    echo -e "${RED}❌ Doppler CLI is not installed${NC}"
    echo "Install with: brew install doppler"
    exit 1
fi

# Check Doppler authentication
echo -e "${BLUE}Checking Doppler authentication...${NC}"
if ! doppler whoami &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with Doppler${NC}"
    echo "Run: doppler login"
    exit 1
fi

# Check if project exists
echo -e "${BLUE}Checking project '$PROJECT'...${NC}"
if ! doppler projects get "$PROJECT" &> /dev/null; then
    echo -e "${RED}❌ Project '$PROJECT' not found${NC}"
    echo "Create it with: doppler projects create $PROJECT"
    exit 1
fi

echo -e "${GREEN}✅ Project '$PROJECT' exists${NC}"
echo ""

# Create configs for web app if they don't exist
echo -e "${BLUE}Creating Doppler configs for web app...${NC}"

for env in dev stg prd; do
    CONFIG_NAME="${env}_web"
    
    if doppler configs get "$CONFIG_NAME" --project "$PROJECT" &> /dev/null; then
        echo -e "${YELLOW}⚠️  Config '$CONFIG_NAME' already exists${NC}"
    else
        echo -e "${BLUE}Creating config: $CONFIG_NAME${NC}"
        doppler configs create "$CONFIG_NAME" --project "$PROJECT" --environment "$env"
        echo -e "${GREEN}✅ Created config: $CONFIG_NAME${NC}"
    fi
done

echo ""

# Set base secrets for web app
echo -e "${BLUE}Setting base secrets for web app...${NC}"

# Required secrets for web app
SECRETS=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "NEXT_PUBLIC_N8N_API_KEY"
    "NEXT_PUBLIC_N8N_BASE_URL"
    "NEXT_PUBLIC_OPENROUTER_API_KEY"
    "NEXT_PUBLIC_SPINE_V2_URL"
    "CRON_SECRET"
)

for CONFIG in dev_web stg_web prd_web; do
    echo -e "${BLUE}Configuring $CONFIG...${NC}"
    
    for SECRET in "${SECRETS[@]}"; do
        # Check if secret already exists
        if doppler secrets get "$SECRET" --project "$PROJECT" --config "$CONFIG" &> /dev/null; then
            echo -e "  ${YELLOW}⚠️  $SECRET already exists${NC}"
        else
            # Set placeholder value
            doppler secrets set "$SECRET" "PLACEHOLDER" --project "$PROJECT" --config "$CONFIG" --silent
            echo -e "  ${GREEN}✅ Set $SECRET${NC}"
        fi
    done
done

echo ""

# Create .env.doppler template
echo -e "${BLUE}Creating .env.doppler template...${NC}"
cat > "$WEB_DIR/.env.doppler" << 'EOF'
# Doppler Environment Template
# Copy this to .env.local or use: doppler secrets download --config dev_web --format env > .env.local

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_N8N_API_KEY=
NEXT_PUBLIC_N8N_BASE_URL=
NEXT_PUBLIC_OPENROUTER_API_KEY=
NEXT_PUBLIC_SPINE_V2_URL=
CRON_SECRET=
EOF

echo -e "${GREEN}✅ Created .env.doppler template${NC}"
echo ""

# Create doppler-run script for web
echo -e "${BLUE}Creating doppler-run-web.sh script...${NC}"
cat > "$SCRIPT_DIR/doppler-run-web.sh" << 'EOF'
#!/bin/bash

# Run Next.js web app with Doppler secrets
# Usage: ./scripts/doppler-run-web.sh [dev|stg|prd]

ENV=${1:-dev}
CONFIG="${ENV}_web"
PROJECT="integratewise"

echo "Running web app with Doppler config: $CONFIG"
cd apps/web
doppler run --project "$PROJECT" --config "$CONFIG" -- pnpm dev
EOF

chmod +x "$SCRIPT_DIR/doppler-run-web.sh"
echo -e "${GREEN}✅ Created doppler-run-web.sh${NC}"
echo ""

# Summary
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Doppler Setup Complete for Web App                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Doppler Configs Created:${NC}"
echo "  • dev_web  (Development)"
echo "  • stg_web  (Staging)"
echo "  • prd_web  (Production)"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Update secrets in Doppler dashboard:"
echo "     https://dashboard.doppler.com/workplace/projects/integratewise"
echo ""
echo "  2. Set actual secret values:"
echo "     doppler secrets set KEY_NAME --config dev_web --project integratewise"
echo ""
echo "  3. Run web app with Doppler:"
echo "     ./scripts/doppler-run-web.sh dev"
echo ""
echo "  4. Or download secrets to .env.local:"
echo "     doppler secrets download --config dev_web --format env > apps/web/.env.local"
echo ""
