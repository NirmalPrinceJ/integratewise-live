# Environment Setup - Local & Production

## Overview

| Environment | Method | Use Case |
|-------------|--------|----------|
| **Local Dev** | `.env.local` file | Quick testing, development |
| **Staging/Prod** | **Doppler** | Secure secrets management |

Both use the **same direct Supabase connection** - just different ways to inject env vars.

---

## Option 1: Local Development (`.env.local`)

```bash
cd integratewise-complete/apps/web

# Create local env file
cp .env.local.example .env.local

# Edit with your Supabase credentials
nano .env.local
```

**`.env.local`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

OPENROUTER_API_KEY=sk-or-v1-...
GROQ_API_KEY=gsk-...
```

**Run:**
```bash
npm run dev
```

---

## Option 2: Staging/Production (Doppler)

### Why Doppler for Production?

| Feature | Benefit |
|---------|---------|
| **Secret Encryption** | Secrets encrypted at rest |
| **Access Control** | Who can see prod secrets |
| **Audit Logs** | Who changed what, when |
| **Rotation** | Easy secret rotation |
| **No .env files** | No secrets in code/repos |
| **Team Sharing** | Secure team collaboration |

### Setup

```bash
# 1. Install Doppler CLI
brew install doppler

# 2. Login
doppler login

# 3. Setup project
doppler setup
# ? Select project: integratewise
# ? Select config: prd_web (production)
```

### Doppler Configs Structure

```
integratewise/
├── dev_web          # Development web
├── stg_web          # Staging web  
└── prd_web          # Production web
```

### Set Secrets in Doppler

```bash
# Set individual secrets
doppler secrets set NEXT_PUBLIC_SUPABASE_URL "https://..." --config prd_web
doppler secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJ..." --config prd_web
doppler secrets set SUPABASE_SERVICE_ROLE_KEY "eyJ..." --config prd_web

# Or set multiple
doppler secrets upload --config prd_web << EOF
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
EOF
```

### Run with Doppler

```bash
# Development
doppler run --config dev_web -- npm run dev

# Staging
doppler run --config stg_web -- npm run dev

# Production (deploy)
doppler run --config prd_web -- vercel --prod
```

---

## Quick Reference

### Local Dev (No Doppler)
```bash
# Just use .env.local
npm run dev
```

### With Doppler
```bash
# Inject secrets from Doppler, then run
doppler run --config dev_web -- npm run dev
```

### Deploy to Vercel with Doppler
```bash
# Option 1: Direct
doppler run --config prd_web -- vercel --prod

# Option 2: Sync to Vercel first
./scripts/doppler-to-vercel.sh
vercel --prod
```

---

## Security Best Practices

### ✅ DO

- Use Doppler for production secrets
- Rotate secrets every 90 days
- Use service tokens for CI/CD
- Audit access logs regularly
- Use different secrets per environment

### ❌ DON'T

- Commit `.env.local` to git
- Share production secrets in Slack/email
- Use production secrets in local dev
- Hardcode secrets in code

---

## Files

| File | Purpose |
|------|---------|
| `.env.local.example` | Template for local development |
| `.env.local` | Your local secrets (gitignored) |
| `doppler.yaml` | Doppler project configuration |
| `scripts/doppler-to-vercel.sh` | Sync Doppler to Vercel |

---

## Troubleshooting

### "Doppler not authenticated"
```bash
doppler login
doppler whoami
```

### "Config not found"
```bash
# List available configs
doppler configs --project integratewise

# Switch config
doppler config set prd_web
```

### "Secret not found"
```bash
# View all secrets for config
doppler secrets --config prd_web
```
