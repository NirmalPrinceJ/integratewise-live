#!/bin/bash

# IntegrateWise OS - Production Setup Wizard
# This script helps you configure all production services interactively

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Output file
ENV_FILE=".env.local"

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   IntegrateWise OS - Production Setup Wizard             ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${YELLOW}This wizard will help you configure production services.${NC}"
echo ""
echo "You can skip optional services and add them later."
echo ""

read -p "Press Enter to continue..."

# Function to add variable to env file
add_env_var() {
    local key=$1
    local value=$2
    echo "${key}=${value}" >> "$ENV_FILE"
}

# Function to prompt for value
prompt_value() {
    local prompt=$1
    local default=$2
    local secret=$3

    if [ -n "$default" ]; then
        prompt="$prompt (default: $default)"
    fi

    if [ "$secret" = "true" ]; then
        read -sp "$prompt: " value
        echo ""
    else
        read -p "$prompt: " value
    fi

    if [ -z "$value" ] && [ -n "$default" ]; then
        value="$default"
    fi

    echo "$value"
}

# Backup existing .env.local
if [ -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Backing up existing .env.local to .env.local.backup${NC}"
    cp "$ENV_FILE" "${ENV_FILE}.backup"
fi

# Create new env file
> "$ENV_FILE"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  PRIORITY 1: Critical Services (Required)${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# === SUPABASE ===
echo -e "${BLUE}1. Supabase (Authentication)${NC}"
echo "Get keys from: https://app.supabase.com/project/_/settings/api"
echo ""

SUPABASE_URL=$(prompt_value "Supabase URL" "https://your-project.supabase.co")
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "$SUPABASE_URL"

SUPABASE_ANON=$(prompt_value "Supabase Anon Key" "" "true")
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "$SUPABASE_ANON"

SUPABASE_SERVICE=$(prompt_value "Supabase Service Role Key" "" "true")
add_env_var "SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_SERVICE"

echo -e "${GREEN}✓ Supabase configured${NC}"
echo ""

# === NEON ===
echo -e "${BLUE}2. Neon (Primary Database)${NC}"
echo "Get from: https://console.neon.tech/app/projects"
echo ""

DATABASE_URL=$(prompt_value "Neon Connection String (DATABASE_URL)" "" "true")
add_env_var "DATABASE_URL" "$DATABASE_URL"

echo -e "${GREEN}✓ Neon configured${NC}"
echo ""

# === CLOUDFLARE ===
echo -e "${BLUE}3. Cloudflare (Edge Infrastructure)${NC}"
echo "Get from: https://dash.cloudflare.com/"
echo ""

CF_ACCOUNT=$(prompt_value "Cloudflare Account ID")
add_env_var "CLOUDFLARE_ACCOUNT_ID" "$CF_ACCOUNT"

CF_TOKEN=$(prompt_value "Cloudflare API Token" "" "true")
add_env_var "CLOUDFLARE_API_TOKEN" "$CF_TOKEN"

echo ""
read -p "Do you have D1/KV/R2 already? (y/n): " has_resources

if [ "$has_resources" = "y" ]; then
    CF_D1=$(prompt_value "D1 Database ID")
    add_env_var "CLOUDFLARE_D1_DATABASE_ID" "$CF_D1"

    CF_KV=$(prompt_value "KV Namespace ID")
    add_env_var "CLOUDFLARE_KV_NAMESPACE_ID" "$CF_KV"

    CF_R2=$(prompt_value "R2 Bucket Name" "integratewise-store")
    add_env_var "CLOUDFLARE_R2_BUCKET" "$CF_R2"
else
    echo "Run these commands to create resources:"
    echo "  wrangler d1 create integratewise-spine-prod"
    echo "  wrangler kv:namespace create \"CACHE\""
    echo "  wrangler r2 bucket create integratewise-store"
fi

echo -e "${GREEN}✓ Cloudflare configured${NC}"
echo ""

# === ENCRYPTION ===
echo -e "${BLUE}4. Encryption Keys (Generating)${NC}"
echo ""

ENCRYPTION_KEY=$(openssl rand -base64 32)
add_env_var "ENCRYPTION_KEY" "$ENCRYPTION_KEY"

JWT_SECRET=$(openssl rand -base64 64)
add_env_var "JWT_SECRET" "$JWT_SECRET"

WEBHOOK_SECRET=$(openssl rand -base64 32)
add_env_var "WEBHOOK_SECRET" "$WEBHOOK_SECRET"

ADMIN_SECRET=$(openssl rand -base64 32)
add_env_var "ADMIN_SECRET" "$ADMIN_SECRET"

echo -e "${GREEN}✓ Encryption keys generated${NC}"
echo ""

# === PRIORITY 2 ===
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  PRIORITY 2: Important Services (Recommended)${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

read -p "Configure Priority 2 services now? (y/n): " config_p2

if [ "$config_p2" = "y" ]; then

    # LemonSqueezy
    echo ""
    echo -e "${BLUE}5. LemonSqueezy (Payments)${NC}"
    echo "Get from: https://app.lemonsqueezy.com/settings/api"
    echo ""
    read -p "Configure LemonSqueezy? (y/n): " config_ls

    if [ "$config_ls" = "y" ]; then
        LS_KEY=$(prompt_value "LemonSqueezy API Key" "" "true")
        add_env_var "LEMONSQUEEZY_API_KEY" "$LS_KEY"

        LS_STORE=$(prompt_value "LemonSqueezy Store ID")
        add_env_var "LEMONSQUEEZY_STORE_ID" "$LS_STORE"
        add_env_var "NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID" "$LS_STORE"

        LS_WEBHOOK=$(prompt_value "LemonSqueezy Webhook Secret" "" "true")
        add_env_var "LEMONSQUEEZY_WEBHOOK_SECRET" "$LS_WEBHOOK"

        echo -e "${GREEN}✓ LemonSqueezy configured${NC}"
    fi

    # Groq
    echo ""
    echo -e "${BLUE}6. Groq (Free AI)${NC}"
    echo "Get from: https://console.groq.com/keys"
    echo ""
    read -p "Configure Groq? (y/n): " config_groq

    if [ "$config_groq" = "y" ]; then
        GROQ_KEY=$(prompt_value "Groq API Key" "" "true")
        add_env_var "GROQ_API_KEY" "$GROQ_KEY"
        echo -e "${GREEN}✓ Groq configured${NC}"
    fi

    # PostHog
    echo ""
    echo -e "${BLUE}7. PostHog (Analytics)${NC}"
    echo "Get from: https://app.posthog.com/project/settings"
    echo ""
    read -p "Configure PostHog? (y/n): " config_ph

    if [ "$config_ph" = "y" ]; then
        PH_KEY=$(prompt_value "PostHog API Key")
        add_env_var "NEXT_PUBLIC_POSTHOG_KEY" "$PH_KEY"

        PH_HOST=$(prompt_value "PostHog Host" "https://app.posthog.com")
        add_env_var "NEXT_PUBLIC_POSTHOG_HOST" "$PH_HOST"

        echo -e "${GREEN}✓ PostHog configured${NC}"
    fi

    # Sentry
    echo ""
    echo -e "${BLUE}8. Sentry (Error Tracking)${NC}"
    echo "Get from: https://sentry.io/settings/projects/"
    echo ""
    read -p "Configure Sentry? (y/n): " config_sentry

    if [ "$config_sentry" = "y" ]; then
        SENTRY_DSN=$(prompt_value "Sentry DSN" "" "true")
        add_env_var "SENTRY_DSN" "$SENTRY_DSN"
        add_env_var "NEXT_PUBLIC_SENTRY_DSN" "$SENTRY_DSN"

        echo -e "${GREEN}✓ Sentry configured${NC}"
    fi
fi

# === APP CONFIGURATION ===
echo ""
echo -e "${BLUE}App Configuration${NC}"
echo ""

APP_URL=$(prompt_value "Production URL" "https://integratewise.ai")
add_env_var "NEXT_PUBLIC_APP_URL" "$APP_URL"
add_env_var "NEXT_PUBLIC_API_URL" "https://gateway.integratewise.ai"

add_env_var "NODE_ENV" "production"
add_env_var "ENVIRONMENT" "production"

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Configuration Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Configuration saved to: ${ENV_FILE}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Review the configuration: cat ${ENV_FILE}"
echo "2. Add variables to Bitbucket: Repository Settings → Variables"
echo "3. Run database migrations: pnpm run migrate"
echo "4. Test locally: pnpm dev"
echo "5. Deploy to staging: git push origin staging"
echo ""
echo -e "${BLUE}See docs/PRODUCTION_SETUP_GUIDE.md for detailed instructions${NC}"
echo ""

# Offer to copy to clipboard (macOS)
if command -v pbcopy &> /dev/null; then
    read -p "Copy configuration to clipboard? (y/n): " copy_clip
    if [ "$copy_clip" = "y" ]; then
        cat "$ENV_FILE" | pbcopy
        echo -e "${GREEN}✓ Copied to clipboard${NC}"
    fi
fi

echo ""
echo -e "${GREEN}Setup complete! 🎉${NC}"
