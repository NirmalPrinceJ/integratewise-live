#!/bin/bash
set -e

# ============================================================================
# Sync Doppler Secrets → Cloudflare Workers
# ============================================================================
# Run this after rotating secrets to push them to all Workers.
#
# NOTE: web-unified does NOT use this script. It is a Cloudflare Pages
# project and gets its VITE_* env vars at BUILD TIME via:
#   doppler run --config prd_web-unified -- npm run build
# See: scripts/deploy-with-doppler.sh  /  .github/workflows/deploy.yml
# ============================================================================
# Usage:
#   ./sync-doppler-to-workers.sh              # Sync all services (production)
#   ./sync-doppler-to-workers.sh staging       # Sync all services (staging)
#   ./sync-doppler-to-workers.sh production spine-v2  # Sync one service
# ============================================================================

PROJECT="integratewise"
TARGET_ENV="${1:-production}"
TARGET_SERVICE="${2:-}"

# Normalize env name to Doppler prefix
case "$TARGET_ENV" in
  production|prd) DOPPLER_PREFIX="prd" ; WRANGLER_ENV="production" ;;
  staging|stg)    DOPPLER_PREFIX="stg" ; WRANGLER_ENV="staging" ;;
  dev|development) DOPPLER_PREFIX="dev" ; WRANGLER_ENV="development" ;;
  *) echo "❌ Unknown environment: $TARGET_ENV"; exit 1 ;;
esac

echo "🔄 Syncing Doppler → Cloudflare Workers"
echo "========================================"
echo "  Environment : $WRANGLER_ENV (Doppler prefix: ${DOPPLER_PREFIX}_)"
[ -n "$TARGET_SERVICE" ] && echo "  Service     : $TARGET_SERVICE"
echo ""

# All Worker services (NOT web-unified — it uses Cloudflare Pages)
ALL_SERVICES=(
  spine-v2
  loader
  normalizer
  cognitive-brain
  stream-gateway
  memory-consolidator
  workflow
  agents
  knowledge
  tenants
  admin
  billing
  govern
  act
  think
  views
  mcp-connector
  store
  iq-hub
  gateway
)

# If a specific service was requested, filter
if [ -n "$TARGET_SERVICE" ]; then
  SERVICES=("$TARGET_SERVICE")
else
  SERVICES=("${ALL_SERVICES[@]}")
fi

# Check prerequisites
if ! command -v doppler &>/dev/null; then
  echo "❌ Doppler CLI not found. Install: https://docs.doppler.com/docs/install-cli"
  exit 1
fi
if ! command -v wrangler &>/dev/null; then
  echo "❌ Wrangler CLI not found. Install: npm i -g wrangler"
  exit 1
fi
if ! doppler whoami &>/dev/null; then
  echo "❌ Not authenticated with Doppler. Run: doppler login"
  exit 1
fi

SYNCED=0
FAILED=0

for service in "${SERVICES[@]}"; do
  config_name="${DOPPLER_PREFIX}_${service}"
  wrangler_toml="services/$service/wrangler.toml"

  # Check wrangler.toml exists
  if [ ! -f "$wrangler_toml" ]; then
    echo "⚠️  Skipping $service — no $wrangler_toml"
    ((FAILED++)) || true
    continue
  fi

  echo "📦 Syncing $service (config: $config_name)..."

  # Download secrets from Doppler as JSON
  secrets_json=$(doppler secrets download \
    --config "$config_name" \
    --project "$PROJECT" \
    --format json \
    --no-file 2>/dev/null) || {
    echo "  ⚠️  Could not fetch Doppler config $config_name — skipping"
    ((FAILED++)) || true
    continue
  }

  # Extract secret keys and values, push to Cloudflare
  echo "$secrets_json" | jq -r 'to_entries[] | "\(.key)=\(.value)"' | while IFS='=' read -r key value; do
    # Skip VITE_* keys — they are for the frontend (web-unified), not Workers
    if [[ "$key" == VITE_* ]]; then
      continue
    fi
    # Skip NEXT_PUBLIC_* keys — legacy, deprecated
    if [[ "$key" == NEXT_PUBLIC_* ]]; then
      continue
    fi
    # Skip Doppler metadata keys
    if [[ "$key" == DOPPLER_* ]]; then
      continue
    fi

    echo "  → $key"
    echo "$value" | wrangler secret put "$key" \
      --env "$WRANGLER_ENV" \
      -c "$wrangler_toml" 2>/dev/null || true
  done

  echo "  ✅ Synced $service"
  ((SYNCED++)) || true
  echo ""
done

echo ""
echo "════════════════════════════════════════"
echo "  ✅ Synced: $SYNCED   ⚠️ Skipped: $FAILED"
echo "════════════════════════════════════════"
echo ""
echo "Verify with:"
echo "  wrangler secret list --env $WRANGLER_ENV -c services/spine-v2/wrangler.toml"
