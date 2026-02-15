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
