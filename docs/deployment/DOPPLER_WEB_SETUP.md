# Doppler Setup for Web App (apps/web)

**Date**: 2026-02-10
**Status**: ✅ **READY FOR CONFIGURATION**

---

## Overview

This document describes the Doppler configuration for the Next.js web application in the `apps/web/` directory.

## Doppler Configs

| Config | Environment | Purpose |
|--------|-------------|---------|
| `dev_web` | Development | Local development |
| `stg_web` | Staging | Staging deployment |
| `prd_web` | Production | Production deployment |

## Required Secrets

The web app requires these environment variables:

| Secret | Description |
|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `NEXT_PUBLIC_N8N_API_KEY` | n8n workflow API key |
| `NEXT_PUBLIC_N8N_BASE_URL` | n8n instance base URL |
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | OpenRouter AI API key |
| `NEXT_PUBLIC_SPINE_V2_URL` | Spine v2 API URL |
| `CRON_SECRET` | Secret for cron job authentication |

## Quick Start

### 1. Run Setup Script

```bash
./scripts/doppler-setup-web.sh
```

This creates:
- Doppler configs: `dev_web`, `stg_web`, `prd_web`
- Placeholder secrets (you'll need to update with real values)
- `apps/web/doppler.yaml` - Doppler configuration file
- `apps/web/.env.doppler` - Template file
- `scripts/doppler-run-web.sh` - Helper script

### 2. Update Secrets

Via Doppler Dashboard:
```bash
# Open Doppler dashboard
open https://dashboard.doppler.com/workplace/projects/integratewise
```

Or via CLI:
```bash
# Set a secret for development
doppler secrets set NEXT_PUBLIC_SUPABASE_URL \
  --config dev_web \
  --project integratewise

# Set all secrets from .env file
doppler secrets upload .env.local \
  --config dev_web \
  --project integratewise
```

### 3. Run Web App with Doppler

```bash
# Development (uses dev_web config)
./scripts/doppler-run-web.sh dev

# Staging (uses stg_web config)
./scripts/doppler-run-web.sh stg

# Production (uses prd_web config)
./scripts/doppler-run-web.sh prd
```

### 4. Download Secrets to .env.local (Alternative)

If you prefer using `.env.local` instead of `doppler run`:

```bash
# Download dev secrets
doppler secrets download \
  --config dev_web \
  --project integratewise \
  --format env > apps/web/.env.local

# Or use the shorthand
cd apps/web && doppler secrets download --config dev_web --format env > .env.local
```

## Monorepo Integration

### With Turbo

The root `turbo.json` is configured to work with Doppler:

```json
{
  "globalDependencies": ["**/.env.*local"]
}
```

### With pnpm

Install dependencies:
```bash
pnpm install
```

This installs dependencies for all workspaces including `apps/web`.

## File Structure

```
apps/web/
├── doppler.yaml          # Doppler configuration
├── .env.doppler          # Template file
├── .env.local            # Local secrets (gitignored)
└── package.json          # App dependencies
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Deploy Web App

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Doppler
        uses: dopplerhq/cli-action@v1
        
      - name: Deploy to Vercel
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN_WEB }}
        run: |
          doppler secrets download --config prd_web --format env > .env
          vercel --prod
```

### Vercel Integration

Sync Doppler secrets to Vercel:

```bash
# Install Vercel integration
doppler integrations create vercel

# Or use the existing script
./scripts/doppler-to-vercel.sh
```

## Troubleshooting

### Doppler CLI Not Authenticated

```bash
doppler login
```

### Config Not Found

```bash
# List available configs
doppler configs --project integratewise

# Create missing config
doppler configs create dev_web --project integratewise --environment dev
```

### Secrets Not Loading

```bash
# Verify secrets are set
doppler secrets --config dev_web --project integratewise

# Test with doppler run
doppler run --config dev_web --project integratewise -- printenv | grep NEXT_PUBLIC
```

## Security Notes

- ✅ `.env.local` is gitignored
- ✅ `doppler.yaml` does not contain secrets
- ✅ Service role keys are never exposed to frontend
- ✅ Use `NEXT_PUBLIC_` prefix only for client-side secrets

## Related Documentation

- [Doppler Integration Complete](./DOPPLER_INTEGRATION_COMPLETE.md) - Backend services setup
- [Main README](./README.md) - Project overview

---

**Status**: Ready for secret configuration
