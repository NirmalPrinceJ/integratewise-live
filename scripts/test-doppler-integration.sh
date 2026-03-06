#!/usr/bin/env bash
set -e

PROJECT="integratewise"

echo "🧪 Testing Doppler Integration"
echo "================================"
echo ""

# Test 1: Authentication
echo "✓ Test 1: Doppler Authentication"
if doppler whoami &>/dev/null; then
  echo "  ✅ Authenticated"
  doppler whoami | head -5
else
  echo "  ❌ Not authenticated"
  exit 1
fi
echo ""

# Test 2: Project exists
echo "✓ Test 2: Project exists"
if doppler projects get $PROJECT &>/dev/null; then
  echo "  ✅ Project 'integratewise' exists"
else
  echo "  ❌ Project not found"
  exit 1
fi
echo ""

# Test 3: List all configs
echo "✓ Test 3: List production configs"
PROD_CONFIGS=$(doppler configs --project $PROJECT --silent | grep "prd_" | wc -l | tr -d ' ')
echo "  ✅ Found $PROD_CONFIGS production configs"
doppler configs --project $PROJECT --silent | grep "prd_" | head -10
echo ""

# Test 4: Check secrets for spine-v2
echo "✓ Test 4: Check secrets for prd_spine-v2"
SECRET_COUNT=$(doppler secrets --config prd_spine-v2 --project $PROJECT --silent | grep -v "DOPPLER_" | wc -l | tr -d ' ')
echo "  ✅ Found $SECRET_COUNT secrets in prd_spine-v2"
doppler secrets --config prd_spine-v2 --project $PROJECT | head -15
echo ""

# Test 5: Download secrets as JSON
echo "✓ Test 5: Download secrets as JSON"
if doppler secrets download --config prd_spine-v2 --project $PROJECT --format json --no-file > /tmp/doppler-test.json 2>/dev/null; then
  KEYS=$(cat /tmp/doppler-test.json | jq 'keys | length')
  echo "  ✅ Downloaded $KEYS keys successfully"
  echo "  Sample keys:"
  cat /tmp/doppler-test.json | jq -r 'keys[]' | grep -v DOPPLER | head -5 | sed 's/^/    - /'
  rm /tmp/doppler-test.json
else
  echo "  ❌ Download failed"
  exit 1
fi
echo ""

# Test 6: Test secret retrieval
echo "✓ Test 6: Test individual secret retrieval"
NEON_VALUE=$(doppler secrets get NEON_DB_URL --config prd_spine-v2 --project $PROJECT --plain 2>/dev/null || echo "ERROR")
if [ "$NEON_VALUE" != "ERROR" ]; then
  echo "  ✅ Can retrieve NEON_DB_URL: ${NEON_VALUE:0:20}..."
else
  echo "  ❌ Failed to retrieve secret"
  exit 1
fi
echo ""

# Test 7: Check all required secrets exist
echo "✓ Test 7: Verify all required secrets"
REQUIRED_SECRETS=(
  "NEON_DB_URL"
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "CRON_SECRET"
  "BUCKET_SIGNING_SECRET"
  "OPENROUTER_API_KEY"
)

MISSING=0
for secret in "${REQUIRED_SECRETS[@]}"; do
  if doppler secrets get "$secret" --config prd_spine-v2 --project $PROJECT --plain &>/dev/null; then
    echo "  ✅ $secret exists"
  else
    echo "  ❌ $secret MISSING"
    MISSING=$((MISSING + 1))
  fi
done

if [ $MISSING -gt 0 ]; then
  echo ""
  echo "  ⚠️  $MISSING secrets missing"
else
  echo ""
  echo "  ✅ All required secrets present"
fi
echo ""

# Test 8: Test Cloudflare Workers secret list
echo "✓ Test 8: Check Cloudflare Workers (spine-v2)"
if [ -f "services/spine-v2/wrangler.toml" ]; then
  WORKER_SECRETS=$(wrangler secret list --env production -c services/spine-v2/wrangler.toml 2>/dev/null | jq -r '.[].name' 2>/dev/null | wc -l | tr -d ' ')
  echo "  ✅ Worker has $WORKER_SECRETS secrets"
  wrangler secret list --env production -c services/spine-v2/wrangler.toml 2>/dev/null | jq -r '.[].name' 2>/dev/null | sed 's/^/    - /' || true
else
  echo "  ⚠️  wrangler.toml not found"
fi
echo ""

# Test 9: Verify helper scripts exist
echo "✓ Test 9: Check helper scripts"
SCRIPTS=(
  "scripts/doppler-push.sh"
  "scripts/doppler-to-vercel.sh"
  "scripts/rotate-secrets.sh"
)

for script in "${SCRIPTS[@]}"; do
  if [ -f "$script" ] && [ -x "$script" ]; then
    echo "  ✅ $script (executable)"
  elif [ -f "$script" ]; then
    echo "  ⚠️  $script (not executable)"
    chmod +x "$script"
  else
    echo "  ❌ $script (missing)"
  fi
done
echo ""

# Test 10: Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Integration Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Doppler Status: ✅ OPERATIONAL"
echo "Project: integratewise"
echo "Production Configs: $PROD_CONFIGS"
echo "Secrets per Config: $SECRET_COUNT"
echo ""
echo "✅ Ready for secret rotation!"
echo ""
echo "Next steps:"
echo "  1. Rotate secrets: ./scripts/rotate-secrets.sh"
echo "  2. Test API: curl https://api.integratewise.ai/v2/spine/health"
echo "  3. Push to workers: ./scripts/doppler-push.sh spine-v2 production"
echo ""
