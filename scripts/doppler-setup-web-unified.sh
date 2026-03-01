#!/bin/bash
# ============================================================================
# Doppler Setup for IntegrateWise Unified Frontend (Vite)
# ============================================================================
# Creates Doppler configs for web-unified across all environments.
# Migrates NEXT_PUBLIC_* keys from old web config to VITE_* format.
#
# Usage: ./scripts/doppler-setup-web-unified.sh
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT="integratewise"

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║       Doppler Setup — IntegrateWise Unified Frontend               ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Check Doppler auth
if ! doppler whoami > /dev/null 2>&1; then
    echo -e "${RED}Error: Not authenticated with Doppler${NC}"
    echo "Run: doppler login"
    exit 1
fi

echo -e "${BLUE}Project: $PROJECT${NC}"
echo ""

# ─── Create configs for each environment ──────────────────────────────────────

for ENV in dev stg prd; do
    CONFIG="${ENV}_web-unified"

    echo -e "${BLUE}▶ Setting up config: $CONFIG${NC}"

    # Create the config (skip if exists)
    doppler configs create "$CONFIG" --project "$PROJECT" 2>/dev/null || \
        echo -e "  ${YELLOW}Config $CONFIG already exists${NC}"

    # ─── Migrate from old web config if it exists ──────────────────────────
    OLD_CONFIG="${ENV}_web"
    OLD_SECRETS=""

    if doppler secrets --config "$OLD_CONFIG" --project "$PROJECT" > /dev/null 2>&1; then
        echo -e "  ${BLUE}Migrating from $OLD_CONFIG...${NC}"

        # Pull Supabase URL
        SUPABASE_URL=$(doppler secrets get NEXT_PUBLIC_SUPABASE_URL --config "$OLD_CONFIG" --project "$PROJECT" --plain 2>/dev/null || \
                       doppler secrets get SUPABASE_URL --config "$OLD_CONFIG" --project "$PROJECT" --plain 2>/dev/null || echo "")

        SUPABASE_ANON_KEY=$(doppler secrets get NEXT_PUBLIC_SUPABASE_ANON_KEY --config "$OLD_CONFIG" --project "$PROJECT" --plain 2>/dev/null || \
                           doppler secrets get SUPABASE_ANON_KEY --config "$OLD_CONFIG" --project "$PROJECT" --plain 2>/dev/null || echo "")

        POSTHOG_KEY=$(doppler secrets get NEXT_PUBLIC_POSTHOG_KEY --config "$OLD_CONFIG" --project "$PROJECT" --plain 2>/dev/null || echo "")

        SENTRY_DSN=$(doppler secrets get SENTRY_DSN --config "$OLD_CONFIG" --project "$PROJECT" --plain 2>/dev/null || echo "")

        APP_URL=$(doppler secrets get NEXT_PUBLIC_APP_URL --config "$OLD_CONFIG" --project "$PROJECT" --plain 2>/dev/null || echo "")

        SPINE_URL=$(doppler secrets get NEXT_PUBLIC_SPINE_V2_URL --config "$OLD_CONFIG" --project "$PROJECT" --plain 2>/dev/null || echo "")
    fi

    # ─── Set secrets (prefer migrated values, fall back to defaults) ───────

    if [ -n "$SUPABASE_URL" ]; then
        doppler secrets set VITE_SUPABASE_URL "$SUPABASE_URL" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${GREEN}✓ VITE_SUPABASE_URL${NC}"
    else
        doppler secrets set VITE_SUPABASE_URL "https://hrrbciljsqxnmuwwnrnt.supabase.co" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${GREEN}✓ VITE_SUPABASE_URL (default)${NC}"
    fi

    if [ -n "$SUPABASE_ANON_KEY" ]; then
        doppler secrets set VITE_SUPABASE_ANON_KEY "$SUPABASE_ANON_KEY" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${GREEN}✓ VITE_SUPABASE_ANON_KEY${NC}"
    else
        doppler secrets set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhycmJjaWxqc3F4bm11d3ducm50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2Mzc0MjUsImV4cCI6MjA4NTIxMzQyNX0.Af158eQ6-KoS-zlKslALN0SiprqkVFeId4iaV2sOXuY" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${GREEN}✓ VITE_SUPABASE_ANON_KEY (default)${NC}"
    fi

    # API Base URL — maps to Gateway Worker
    if [ -n "$SPINE_URL" ]; then
        doppler secrets set VITE_API_BASE_URL "$SPINE_URL" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${GREEN}✓ VITE_API_BASE_URL (from spine URL)${NC}"
    elif [ "$ENV" == "prd" ]; then
        doppler secrets set VITE_API_BASE_URL "https://gateway.integratewise.workers.dev" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${GREEN}✓ VITE_API_BASE_URL (production default)${NC}"
    elif [ "$ENV" == "stg" ]; then
        doppler secrets set VITE_API_BASE_URL "https://gateway-staging.integratewise.workers.dev" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${GREEN}✓ VITE_API_BASE_URL (staging default)${NC}"
    else
        doppler secrets set VITE_API_BASE_URL "" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${YELLOW}✓ VITE_API_BASE_URL (empty — local mock mode)${NC}"
    fi

    # Optional analytics
    if [ -n "$POSTHOG_KEY" ]; then
        doppler secrets set VITE_POSTHOG_KEY "$POSTHOG_KEY" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${GREEN}✓ VITE_POSTHOG_KEY${NC}"
    fi

    if [ -n "$SENTRY_DSN" ]; then
        doppler secrets set VITE_SENTRY_DSN "$SENTRY_DSN" --config "$CONFIG" --project "$PROJECT"
        echo -e "  ${GREEN}✓ VITE_SENTRY_DSN${NC}"
    fi

    echo ""
done

# ─── Summary ──────────────────────────────────────────────────────────────────

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                      Setup Complete!                                ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Configs created:"
echo -e "  ${GREEN}dev_web-unified${NC}  — Local development (mock mode, no backend)"
echo -e "  ${GREEN}stg_web-unified${NC}  — Staging (staging Workers)"
echo -e "  ${GREEN}prd_web-unified${NC}  — Production (production Workers)"
echo ""
echo -e "Commands:"
echo -e "  ${BLUE}doppler run --config dev_web-unified -- npm run dev${NC}      # Local dev"
echo -e "  ${BLUE}doppler run --config prd_web-unified -- npm run build${NC}    # Production build"
echo ""
echo -e "Deploy to Cloudflare Pages:"
echo -e "  ${BLUE}cd apps/web-unified${NC}"
echo -e "  ${BLUE}doppler run --config prd_web-unified -- wrangler pages deploy dist --project-name=integratewise${NC}"
echo ""
echo -e "Verify secrets:"
echo -e "  ${BLUE}doppler secrets --config prd_web-unified --project integratewise${NC}"
