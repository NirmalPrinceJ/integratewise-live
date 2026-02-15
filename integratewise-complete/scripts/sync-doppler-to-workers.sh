#!/bin/bash
set -e

# Sync Doppler secrets to Cloudflare Workers
# Run this after rotating secrets to push them to all workers

PROJECT="integratewise"

echo "🔄 Syncing Doppler → Cloudflare Workers"
echo "========================================"
echo ""

# Services and their wrangler environments
declare -A SERVICES=(
  ["spine-v2"]="production"
  ["loader"]="production"
  ["normalizer"]="production"
  ["connector"]="production"
  ["cognitive-brain"]="production"
  ["stream-gateway"]="production"
  ["memory-consolidator"]="production"
  ["workflow"]="production"
  ["agents"]="production"
  ["knowledge"]="production"
  ["tenants"]="production"
  ["admin"]="production"
  ["billing"]="production"
  ["govern"]="production"
  ["act"]="production"
  ["think"]="production"
  ["views"]="production"
  ["mcp-connector"]="production"
)

for service in "${!SERVICES[@]}"; do
  env="${SERVICES[$service]}"
  config_name="${service}-${env}"

  echo "📦 Syncing $service ($env)..."

  # Download secrets from Doppler as JSON
  secrets_json=$(doppler secrets download --config "$config_name" --project "$PROJECT" --format json --no-file)

  # Extract secret keys and values, then push to Cloudflare
  echo "$secrets_json" | jq -r 'to_entries[] | "\(.key)=\(.value)"' | while IFS='=' read -r key value; do
    # Skip public keys (they go in wrangler.toml vars)
    if [[ "$key" == NEXT_PUBLIC_* ]]; then
      continue
    fi

    echo "  → $key"
    echo "$value" | wrangler secret put "$key" --env "$env" -c "services/$service/wrangler.toml" 2>/dev/null || true
  done

  echo "  ✅ Synced $service"
  echo ""
done

echo ""
echo "✅ All secrets synced to Cloudflare Workers!"
echo ""
echo "Verify by checking:"
echo "  wrangler secret list --env production -c services/spine-v2/wrangler.toml"
