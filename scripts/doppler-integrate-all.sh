#!/usr/bin/env bash
set -e

# Comprehensive Doppler Integration Script
# Integrates Doppler with all Cloudflare Workers, Vercel, and CI/CD

PROJECT="integratewise"

echo "🔗 Doppler Integration for All Tools"
echo "====================================="
echo ""

# Check authentication
if ! doppler whoami &>/dev/null; then
  echo "❌ Not authenticated. Run: doppler login"
  exit 1
fi

echo "✅ Authenticated"
echo ""

# Step 1: Pull existing secrets from Cloudflare Workers
echo "📥 Step 1: Scanning existing secrets in Cloudflare Workers..."
echo ""

WORKER_SECRETS_FILE="/tmp/doppler-worker-secrets.txt"
> "$WORKER_SECRETS_FILE"

# Spine v2
echo "  → Checking spine-v2..."
if [ -f "services/spine-v2/wrangler.toml" ]; then
  wrangler secret list --env production -c services/spine-v2/wrangler.toml 2>/dev/null | jq -r '.[].name' 2>/dev/null >> "$WORKER_SECRETS_FILE" || true
fi

# Loader
echo "  → Checking loader..."
if [ -f "services/loader/wrangler.toml" ]; then
  wrangler secret list --env production -c services/loader/wrangler.toml 2>/dev/null | jq -r '.[].name' 2>/dev/null >> "$WORKER_SECRETS_FILE" || true
fi

# Normalizer
echo "  → Checking normalizer..."
if [ -f "services/normalizer/wrangler.toml" ]; then
  wrangler secret list --env production -c services/normalizer/wrangler.toml 2>/dev/null | jq -r '.[].name' 2>/dev/null >> "$WORKER_SECRETS_FILE" || true
fi

UNIQUE_SECRETS=$(sort -u "$WORKER_SECRETS_FILE" | wc -l | tr -d ' ')
echo ""
echo "Found $UNIQUE_SECRETS unique secrets across workers:"
sort -u "$WORKER_SECRETS_FILE" | sed 's/^/    ✓ /'
echo ""

# Step 2: Set up baseline secrets in Doppler
echo "📝 Step 2: Setting up baseline secrets in Doppler..."
echo ""

# Common secrets that all services need
BASELINE_SECRETS=(
  "NEON_DB_URL"
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "CRON_SECRET"
  "BUCKET_SIGNING_SECRET"
)

echo "Setting up production configs with baseline secrets..."
SERVICES=(
  "spine-v2" "loader" "normalizer" "connector" "cognitive-brain"
  "stream-gateway" "memory-consolidator" "workflow" "agents"
  "knowledge" "tenants" "admin" "billing" "govern" "act"
  "think" "views" "mcp-connector" "frontend"
)

for service in "${SERVICES[@]}"; do
  config_name="prd_${service}"
  echo "  → $config_name"

  # Set placeholder values (to be replaced during rotation)
  for secret_key in "${BASELINE_SECRETS[@]}"; do
    placeholder="<TO_BE_ROTATED>"
    # Check if secret already exists
    existing=$(doppler secrets get "$secret_key" --config "$config_name" --project "$PROJECT" --plain 2>/dev/null || echo "")
    if [ -z "$existing" ]; then
      echo "$placeholder" | doppler secrets set "$secret_key" --config "$config_name" --project "$PROJECT" --silent
      echo "    ✓ Set $secret_key (placeholder)"
    else
      echo "    → $secret_key already set"
    fi
  done
done

echo ""
echo "✅ Baseline secrets configured"
echo ""

# Step 3: Create Doppler <-> Cloudflare sync helper
echo "🔄 Step 3: Creating sync helpers..."
echo ""

cat > scripts/doppler-push.sh << 'PUSH_EOF'
#!/bin/bash
# Push secrets from Doppler to Cloudflare Workers

PROJECT="integratewise"
SERVICE=$1
ENV=${2:-production}

if [ -z "$SERVICE" ]; then
  echo "Usage: ./scripts/doppler-push.sh <service> [env]"
  echo "Example: ./scripts/doppler-push.sh spine-v2 production"
  exit 1
fi

# Map env to Doppler config prefix
case $ENV in
  production) CONFIG_PREFIX="prd" ;;
  staging) CONFIG_PREFIX="stg" ;;
  dev) CONFIG_PREFIX="dev" ;;
  *) echo "Unknown env: $ENV"; exit 1 ;;
esac

CONFIG_NAME="${CONFIG_PREFIX}_${SERVICE}"
WRANGLER_CONFIG="services/${SERVICE}/wrangler.toml"

if [ ! -f "$WRANGLER_CONFIG" ]; then
  echo "❌ Wrangler config not found: $WRANGLER_CONFIG"
  exit 1
fi

echo "🔄 Syncing $CONFIG_NAME → Cloudflare Workers ($ENV)"
echo ""

# Download secrets from Doppler
secrets_json=$(doppler secrets download --config "$CONFIG_NAME" --project "$PROJECT" --format json --no-file)

# Push to Cloudflare Workers
echo "$secrets_json" | jq -r 'to_entries[] | select(.key | startswith("NEXT_PUBLIC_") | not) | "\(.key)=\(.value)"' | while IFS='=' read -r key value; do
  echo "  → $key"
  echo "$value" | wrangler secret put "$key" --env "$ENV" -c "$WRANGLER_CONFIG" 2>/dev/null || true
done

echo ""
echo "✅ Synced $SERVICE"
PUSH_EOF

chmod +x scripts/doppler-push.sh

cat > scripts/doppler-pull.sh << 'PULL_EOF'
#!/bin/bash
# Pull secrets from Cloudflare Workers to Doppler (for migration)

PROJECT="integratewise"
SERVICE=$1
ENV=${2:-production}

if [ -z "$SERVICE" ]; then
  echo "Usage: ./scripts/doppler-pull.sh <service> [env]"
  exit 1
fi

case $ENV in
  production) CONFIG_PREFIX="prd" ;;
  staging) CONFIG_PREFIX="stg" ;;
  dev) CONFIG_PREFIX="dev" ;;
  *) echo "Unknown env: $ENV"; exit 1 ;;
esac

CONFIG_NAME="${CONFIG_PREFIX}_${SERVICE}"
WRANGLER_CONFIG="services/${SERVICE}/wrangler.toml"

echo "⬇️  Pulling secrets from $SERVICE ($ENV) → Doppler ($CONFIG_NAME)"
echo ""
echo "⚠️  Note: Cloudflare Workers API doesn't allow reading secret values"
echo "   You'll need to manually copy values"
echo ""

# List secrets from worker
secret_names=$(wrangler secret list --env "$ENV" -c "$WRANGLER_CONFIG" 2>/dev/null | jq -r '.[].name' 2>/dev/null || echo "")

if [ -z "$secret_names" ]; then
  echo "No secrets found in worker"
  exit 0
fi

echo "Found secrets:"
for name in $secret_names; do
  echo "  - $name"
done
echo ""
echo "To migrate, run:"
echo "  doppler secrets set $name --config $CONFIG_NAME --project $PROJECT"
PULL_EOF

chmod +x scripts/doppler-pull.sh

echo "✅ Created sync helpers:"
echo "   ./scripts/doppler-push.sh <service> [env]  # Doppler → Cloudflare"
echo "   ./scripts/doppler-pull.sh <service> [env]  # Cloudflare → Doppler (manual)"
echo ""

# Step 4: Set up Vercel integration
echo "🚀 Step 4: Vercel integration..."
echo ""

cat > scripts/doppler-to-vercel.sh << 'VERCEL_EOF'
#!/bin/bash
# Sync Doppler secrets to Vercel

PROJECT="integratewise"
CONFIG_NAME="prd_frontend"

echo "🚀 Syncing Doppler → Vercel"
echo ""

# Download public + private secrets
secrets_json=$(doppler secrets download --config "$CONFIG_NAME" --project "$PROJECT" --format json --no-file)

# Push to Vercel (requires vercel-cli)
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI not installed"
  echo "   Install: npm i -g vercel"
  exit 1
fi

echo "$secrets_json" | jq -r 'to_entries[] | "\(.key)=\(.value)"' | while IFS='=' read -r key value; do
  echo "  → $key"
  echo "$value" | vercel env add "$key" production --force 2>/dev/null || true
done

echo ""
echo "✅ Synced to Vercel"
VERCEL_EOF

chmod +x scripts/doppler-to-vercel.sh

echo "✅ Created Vercel sync script: ./scripts/doppler-to-vercel.sh"
echo ""

# Step 5: Generate CI/CD tokens
echo "🔐 Step 5: Generating CI/CD tokens..."
echo ""

TOKENS_FILE="doppler-tokens.txt"
echo "# Doppler Service Tokens for CI/CD" > $TOKENS_FILE
echo "# Generated: $(date)" >> $TOKENS_FILE
echo "# Add these to GitHub Secrets" >> $TOKENS_FILE
echo "" >> $TOKENS_FILE

for service in "${SERVICES[@]}"; do
  config_name="prd_${service}"
  token_name="${service}-cicd"

  # Try to create token (skip if exists)
  token=$(doppler configs tokens create "$token_name" --config "$config_name" --project "$PROJECT" --plain --max-age 0 2>&1 || echo "exists")

  if [ "$token" != "exists" ] && [[ "$token" == dp.st.* ]]; then
    echo "DOPPLER_TOKEN_${service^^}=$token" >> $TOKENS_FILE
    echo "  ✅ Generated: DOPPLER_TOKEN_${service^^}"
  else
    echo "  → Token for $service already exists"
  fi
done

echo ""
echo "✅ Tokens saved to: $TOKENS_FILE"
echo "   Add these to GitHub Secrets"
echo ""

# Step 6: Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Doppler Integration Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Rotate secrets:"
echo "   ./scripts/rotate-secrets.sh"
echo ""
echo "2. Push to workers:"
echo "   ./scripts/doppler-push.sh spine-v2 production"
echo "   ./scripts/doppler-push.sh loader production"
echo "   # ... repeat for all services"
echo ""
echo "3. Sync to Vercel:"
echo "   ./scripts/doppler-to-vercel.sh"
echo ""
echo "4. Add CI/CD tokens to GitHub:"
echo "   cat doppler-tokens.txt"
echo ""
echo "5. Update GitHub Actions workflow:"
echo "   - Add DOPPLER_TOKEN_* secrets"
echo "   - Use: doppler run -- wrangler deploy"
echo ""
