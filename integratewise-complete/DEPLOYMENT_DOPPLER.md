# 🚀 Deployment with Doppler

## Overview

All environment variables are managed through **Doppler**. No `.env` files are needed for deployment.

```
┌─────────────────────────────────────────────────────────────────┐
│                        DOPPLER                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐    │
│  │  dev    │  │  stg    │  │  prd    │  │  Cloudflare     │    │
│  │ (dev_)  │  │ (stg_)  │  │ (prd_)  │  │  Workers        │    │
│  └────┬────┘  └────┬────┘  └────┬────┘  └─────────────────┘    │
│       │            │            │                               │
│       └────────────┴────────────┘                               │
│                    │                                            │
│                    ▼                                            │
│              Vercel Frontend                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

```bash
# Install Doppler CLI
brew install doppler  # macOS
# or
scoop install doppler  # Windows
# or
curl -Ls https://cli.doppler.com/install.sh | sh  # Linux

# Login
doppler login

# Verify
doppler whoami
```

---

## 🔧 Environment Structure

### Doppler Configs

```
integratewise/
├── dev/
│   ├── dev_web                 # Next.js frontend (dev)
│   ├── dev_spine-v2           # Spine service (dev)
│   ├── dev_loader             # Loader service (dev)
│   ├── dev_normalizer         # Normalizer service (dev)
│   ├── dev_connector          # Connector service (dev)
│   ├── dev_cognitive-brain    # Cognitive service (dev)
│   ├── dev_stream-gateway     # Gateway service (dev)
│   ├── dev_memory-consolidator
│   └── dev_workflow
├── stg/
│   ├── stg_web
│   ├── stg_spine-v2
│   └── ... (same services)
└── prd/
    ├── prd_web
    ├── prd_spine-v2
    └── ... (same services)
```

---

## 🔐 Required Secrets

### Frontend (web)

```bash
# Supabase (Primary Database & Auth)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

# Cloudflare Workers
NEXT_PUBLIC_SPINE_V2_URL
WORKER_GROQ_URL
WORKER_AI_URL

# AI Providers
OPENROUTER_API_KEY
GROQ_API_KEY

# Billing
LEMONSQUEEZY_API_KEY
LEMONSQUEEZY_STORE_ID
LEMONSQUEEZY_WEBHOOK_SECRET

# Monitoring
SENTRY_DSN
NEXT_PUBLIC_POSTHOG_KEY

# App
NEXT_PUBLIC_APP_URL
```

### Workers (each service)

```bash
# Supabase (Database)
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

# AI Providers
GROQ_API_KEY
OPENROUTER_API_KEY

# Cloudflare
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN

# Service-specific
CRON_SECRET
BUCKET_SIGNING_SECRET
```

---

## 🚀 Deployment Commands

### 1. Deploy Frontend (Vercel)

```bash
# Setup Doppler integration
cd integratewise-complete/apps/web

# Option A: Use Doppler CLI with Vercel
doppler run --config prd_web -- vercel --prod

# Option B: Sync secrets to Vercel first
../scripts/doppler-to-vercel.sh
vercel --prod
```

### 2. Deploy Workers (Cloudflare)

```bash
# Deploy specific service
cd integratewise-complete/services/spine-v2

# With Doppler
doppler run --config prd_spine-v2 -- wrangler deploy

# Or use the helper script
cd integratewise-complete
./scripts/doppler-push.sh spine-v2 production
```

### 3. Deploy All Workers

```bash
#!/bin/bash
# deploy-all.sh

SERVICES="spine-v2 loader normalizer connector cognitive-brain stream-gateway memory-consolidator workflow agents"
ENV="production"  # or "staging"

for service in $SERVICES; do
  echo "Deploying $service..."
  ./scripts/doppler-push.sh $service $ENV
done

echo "All services deployed!"
```

---

## 🔄 Migration: Neon → Supabase

### Step 1: Update Doppler Secrets

```bash
# For each environment (dev, stg, prd)
for env in dev stg prd; do
  # Web config
  doppler secrets set DATABASE_URL "postgresql://..." --config ${env}_web
  doppler secrets set DIRECT_URL "postgresql://..." --config ${env}_web
  
  # Remove Neon (optional - keep for rollback)
  # doppler secrets delete NEON_DATABASE_URL --config ${env}_web
  
  # Worker configs
  for service in spine-v2 loader normalizer connector cognitive-brain; do
    doppler secrets set SUPABASE_URL "https://..." --config ${env}_${service}
    doppler secrets set SUPABASE_SERVICE_ROLE_KEY "..." --config ${env}_${service}
  done
done
```

### Step 2: Verify Secrets

```bash
# Check web secrets
doppler secrets --config prd_web

# Check worker secrets
doppler secrets --config prd_spine-v2
```

### Step 3: Deploy with New Secrets

```bash
# Deploy all with new Supabase config
./scripts/deploy-all.sh
```

---

## 🛠️ Local Development

```bash
# Start with Doppler (no .env files needed)
cd integratewise-complete/apps/web
doppler run --config dev_web -- npm run dev

# Or with turbo
cd integratewise-complete
doppler run --config dev_web -- turbo dev
```

---

## 📊 Managing Secrets

### View Secrets
```bash
doppler secrets --config prd_web
```

### Set Secret
```bash
doppler secrets set KEY_NAME value --config prd_web
```

### Delete Secret
```bash
doppler secrets delete KEY_NAME --config prd_web
```

### Compare Environments
```bash
doppler secrets --config dev_web
doppler secrets --config prd_web
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` files**
   ```gitignore
   # .gitignore
   .env*
   !.env.example
   ```

2. **Use service tokens for CI/CD**
   ```bash
   # Create service token
   doppler configs tokens create GITHUB_ACTIONS --config prd_web
   ```

3. **Rotate secrets regularly**
   ```bash
   ./scripts/rotate-secrets.sh
   ```

4. **Access control**
   - Limit who can access `prd` configs
   - Use `dev` for development
   - Use `stg` for staging/testing

---

## 🐛 Troubleshooting

### Doppler not authenticated
```bash
doppler login
doppler whoami
```

### Wrong config
```bash
# Check current config
doppler config

# Set config
doppler config set dev_web --project integratewise
```

### Missing secrets
```bash
# Download as .env for debugging
doppler secrets download --config prd_web --format env > .env.debug
# Check .env.debug (don't commit!)
rm .env.debug
```

---

## 📚 References

- `docs/deployment/DOPPLER_INTEGRATION_COMPLETE.md` - Original integration docs
- `scripts/doppler-push.sh` - Push to Cloudflare Workers
- `scripts/doppler-to-vercel.sh` - Sync to Vercel
- `scripts/rotate-secrets.sh` - Secret rotation
