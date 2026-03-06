#!/bin/bash

# Update pnpm-lock.yaml for new workspace structure
# This script regenerates the lockfile after monorepo restructuring

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Update pnpm-lock.yaml for Workspace Restructure        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo "Install with: npm install -g pnpm"
    exit 1
fi

echo -e "${BLUE}Step 1: Removing old node_modules...${NC}"
echo "This ensures a clean install"
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf services/*/node_modules

echo -e "${GREEN}✅ Cleaned up node_modules${NC}"
echo ""

echo -e "${BLUE}Step 2: Regenerating pnpm-lock.yaml...${NC}"
echo -e "${YELLOW}⚠️  This will take 5-10 minutes depending on your connection${NC}"
echo ""

# Install without frozen lockfile to regenerate
pnpm install --no-frozen-lockfile

echo ""
echo -e "${GREEN}✅ Lockfile regenerated!${NC}"
echo ""

echo -e "${BLUE}Step 3: Verifying lockfile structure...${NC}"

# Check if the new structure is present
if grep -q "apps/web:" pnpm-lock.yaml; then
    echo -e "${GREEN}✅ apps/web workspace detected in lockfile${NC}"
else
    echo -e "${RED}❌ apps/web workspace NOT found in lockfile${NC}"
    echo "Something went wrong. Check the output above."
    exit 1
fi

if grep -q "turbo:" pnpm-lock.yaml | grep -q "devDependencies"; then
    echo -e "${GREEN}✅ turbo in root devDependencies${NC}"
fi

echo ""
echo -e "${BLUE}Step 4: Testing install with frozen lockfile...${NC}"
pnpm install --frozen-lockfile

echo ""
echo -e "${GREEN}✅ Lockfile is now consistent!${NC}"
echo ""

echo -e "${BLUE}Step 5: Git status${NC}"
git status --short pnpm-lock.yaml

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Lockfile Update Complete!                              ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Next steps:"
echo "  1. Review the changes: git diff pnpm-lock.yaml | head -50"
echo "  2. Commit: git add pnpm-lock.yaml && git commit -m 'fix: regenerate pnpm-lock.yaml for workspace restructure'"
echo "  3. Push: git push"
echo ""
echo -e "${YELLOW}Note: The lockfile change will be large (thousands of lines)${NC}"
echo -e "${YELLOW}      This is expected when restructuring a monorepo${NC}"
echo ""
