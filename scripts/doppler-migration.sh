#!/bin/bash
set -e

# Doppler Migration Script for IntegrateWise
# This script migrates all secrets from .env files and wrangler configs to Doppler

PROJECT="integratewise"
ENVS=("dev" "stg" "prd")  # Doppler uses: dev, stg, prd

echo "🔐 Doppler Migration for IntegrateWise"
echo "======================================="
echo ""

# Check if authenticated
if ! doppler whoami &>/dev/null; then
  echo "❌ Not authenticated. Run: doppler login"
  exit 1
fi

echo "✅ Authenticated as: $(doppler whoami)"
echo ""

# Step 1: Create project
echo "📦 Step 1: Creating Doppler project..."
if doppler projects get $PROJECT &>/dev/null; then
  echo "  → Project '$PROJECT' already exists"
else
  doppler projects create $PROJECT
  echo "  ✅ Created project: $PROJECT"
fi
echo ""

# Step 2: Create environments
echo "🌍 Step 2: Creating environments..."
for env in "${ENVS[@]}"; do
  if doppler environments get $env --project $PROJECT &>/dev/null; then
    echo "  → Environment '$env' already exists"
  else
    # Doppler requires both name and slug (they can be the same)
    doppler environments create $env $env --project $PROJECT
    echo "  ✅ Created environment: $env"
  fi
done
echo ""

# Step 3: Create configs for each service
echo "⚙️  Step 3: Creating service configs..."

SERVICES=(
  "spine-v2"
  "loader"
  "normalizer"
  "connector"
  "cognitive-brain"
  "stream-gateway"
  "memory-consolidator"
  "workflow"
  "agents"
  "knowledge"
  "tenants"
  "admin"
  "billing"
  "govern"
  "act"
  "think"
  "views"
  "mcp-connector"
  "frontend"
)

for service in "${SERVICES[@]}"; do
  for env in "${ENVS[@]}"; do
    # Doppler requires env-prefixed config names: dev_service, stg_service, prd_service
    config_name="${env}_${service}"
    if doppler configs get $config_name --project $PROJECT &>/dev/null; then
      echo "  → Config '$config_name' already exists"
    else
      doppler configs create $config_name --project $PROJECT --environment $env
      echo "  ✅ Created config: $config_name"
    fi
  done
done
echo ""

# Step 4: Migrate secrets from .env.local
echo "🔑 Step 4: Migrating secrets from .env.local..."
if [ -f ".env.local" ]; then
  # Parse .env.local and upload to production configs
  while IFS='=' read -r key value; do
    # Skip comments and empty lines
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue

    # Remove quotes from value
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")

    # Upload to all production configs (prd_service naming)
    for service in "${SERVICES[@]}"; do
      config_name="prd_${service}"
      echo "  → Setting $key in $config_name"
      echo "$value" | doppler secrets set "$key" --config $config_name --project $PROJECT --silent
    done
  done < .env.local
  echo "  ✅ Migrated secrets from .env.local"
else
  echo "  ⚠️  .env.local not found"
fi
echo ""

# Step 5: Generate service tokens for CI/CD
echo "🔗 Step 5: Generating service tokens..."
for service in "${SERVICES[@]}"; do
  token_name="${service}-cicd"
  config_name="prd_${service}"
  echo "  → Generating token for $config_name"
  token=$(doppler configs tokens create "$token_name" --config "$config_name" --project $PROJECT --plain --max-age 0 2>&1 || echo "exists")
  if [ "$token" != "exists" ]; then
    echo "  ✅ Token: $token_name"
    echo "     Store in GitHub Secrets: DOPPLER_TOKEN_${service^^}"
  else
    echo "  → Token $token_name already exists"
  fi
done
echo ""

echo "✅ Doppler migration complete!"
echo ""
echo "Next steps:"
echo "1. Rotate compromised secrets (run: ./scripts/rotate-secrets.sh)"
echo "2. Update wrangler.toml files to use Doppler"
echo "3. Update CI/CD workflows with Doppler tokens"
echo "4. Delete local .env files (git rm .env.local)"
