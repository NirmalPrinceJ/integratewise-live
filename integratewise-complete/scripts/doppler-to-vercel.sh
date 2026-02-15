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

