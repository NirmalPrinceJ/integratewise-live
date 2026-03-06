#!/bin/bash

# Push L1/L2 Separation to Bitbucket
# This script commits and pushes the L1/L2 architecture work

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║   Push L1/L2 Separation to Bitbucket                  ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if we're in a git repo
if [ ! -d .git ]; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}Current branch: ${CURRENT_BRANCH}${NC}"

# Show status
echo ""
echo -e "${BLUE}Git Status:${NC}"
git status --short

echo ""
read -p "Continue with commit and push? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "Aborted."
    exit 0
fi

# Add files
echo ""
echo -e "${BLUE}Adding files...${NC}"
git add .

# Show what will be committed
echo ""
echo -e "${BLUE}Files to be committed:${NC}"
git diff --cached --stat

# Commit
echo ""
echo -e "${BLUE}Creating commit...${NC}"

COMMIT_MSG="feat: Production setup with full service stack

- Add comprehensive .env.production.template
- Add PRODUCTION_SETUP_GUIDE.md with step-by-step instructions
- Add interactive setup-production.sh wizard
- Configure Supabase, Neon, Cloudflare
- Add LemonSqueezy, Groq, PostHog, Sentry support
- Add Supabase Auth implementation
- Update Bitbucket pipeline for production deployment
- Keep multi-platform architecture (Supabase + Cloudflare)

Services configured:
✅ Supabase (Auth + Backup DB)
✅ Neon (Primary PostgreSQL)
✅ Cloudflare (Workers, D1, KV, R2)
✅ LemonSqueezy (Payments)
✅ Groq (Free AI)
✅ PostHog (Analytics)
✅ Sentry (Error Tracking)
✅ n8n (Workflows)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git commit -m "$COMMIT_MSG"

echo -e "${GREEN}✓ Commit created${NC}"

# Push to Bitbucket
echo ""
echo -e "${BLUE}Pushing to Bitbucket...${NC}"

# Check remote
REMOTE=$(git remote -v | grep origin | grep push | awk '{print $2}')
echo "Remote: $REMOTE"

if [[ $REMOTE == *"bitbucket.org"* ]]; then
    echo -e "${GREEN}✓ Bitbucket remote detected${NC}"
else
    echo -e "${YELLOW}Warning: Remote doesn't appear to be Bitbucket${NC}"
    read -p "Continue anyway? (y/n): " continue_push
    if [ "$continue_push" != "y" ]; then
        echo "Aborted."
        exit 0
    fi
fi

# Push
git push origin "$CURRENT_BRANCH"

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}║   ✓ Successfully pushed to Bitbucket!                 ║${NC}"
echo -e "${GREEN}║                                                        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${BLUE}Branch: ${CURRENT_BRANCH}${NC}"
echo -e "${BLUE}Commit: $(git rev-parse --short HEAD)${NC}"
echo ""

# Show next steps based on branch
if [ "$CURRENT_BRANCH" = "main" ]; then
    echo -e "${YELLOW}📋 Next Steps (Production):${NC}"
    echo "1. Go to Bitbucket pipeline"
    echo "2. Wait for tests to pass"
    echo "3. Approve production deployment"
    echo "4. Monitor health checks"
elif [ "$CURRENT_BRANCH" = "staging" ]; then
    echo -e "${YELLOW}📋 Next Steps (Staging):${NC}"
    echo "1. Pipeline will auto-deploy to staging"
    echo "2. Test at: https://staging.integratewise.ai"
    echo "3. If good, merge to main for production"
else
    echo -e "${YELLOW}📋 Next Steps:${NC}"
    echo "1. Create PR to staging or main"
    echo "2. Review and merge"
    echo "3. Pipeline will deploy automatically"
fi

echo ""
echo -e "${BLUE}View pipeline: https://bitbucket.org/integratewise/brainstroming/pipelines${NC}"
echo ""
