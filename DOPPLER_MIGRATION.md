# Doppler Infrastructure Migration

**Date:** February 27, 2026  
**Purpose:** Standardize secrets management on Doppler, remove .env file confusion

---

## Changes Made

### 1. Removed Local .env Workflow

**Deleted:**
- `scripts/setup-env.sh` — No longer needed
- `apps/web/.env.example` — Not used with Doppler

**Reason:** Doppler manages all secrets centrally. No local .env files.

### 2. Updated Documentation

**Modified Files:**
- `AGENTS.md` — Added Doppler to infrastructure stack
- `DEPLOYMENT_GUIDE.md` — Complete Doppler-based deployment workflow
- `scripts/deploy-check.sh` — Checks Doppler instead of .env files

### 3. Updated Source Code Comments

**Modified:**
- `apps/web/src/lib/api/supabase.ts` — Added Doppler workflow note
- `apps/web/src/test/setup.ts` — Added note about Doppler

---

## New Doppler Workflow

### Development

```bash
# Start dev server with Doppler
cd integratewise-complete/apps/web
doppler run -- npm run dev

# Or configure once
doppler setup  # Select: integratewise → dev
doppler run -- npm run dev
```

### Build

```bash
# Build with production secrets
doppler run -- npm run build
```

### Deploy

```bash
# Deploy to Cloudflare Pages with Doppler
doppler run -- wrangler pages deploy dist
```

---

## Required Doppler Secrets

Configure these in your Doppler project (dev/staging/prod):

| Secret | Description | Example |
|--------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbG...` |
| `SUPABASE_SERVICE_KEY` | Service role key | `eyJhbG...` (backend only) |
| `OPENROUTER_API_KEY` | AI inference | Optional |
| `N8N_WEBHOOK_SECRET` | Workflow auth | Optional |

---

## Doppler Project Structure

```
integratewise (Doppler Project)
├── dev environment
│   ├── VITE_SUPABASE_URL=https://dev-project.supabase.co
│   └── VITE_SUPABASE_ANON_KEY=...
├── staging environment
│   ├── VITE_SUPABASE_URL=https://staging-project.supabase.co
│   └── VITE_SUPABASE_ANON_KEY=...
└── prod environment
    ├── VITE_SUPABASE_URL=https://prod-project.supabase.co
    └── VITE_SUPABASE_ANON_KEY=...
```

---

## Migration from .env to Doppler

### For Developers

1. **Install Doppler CLI:**
   ```bash
   brew install doppler
   # or
   scoop install doppler  # Windows
   ```

2. **Login:**
   ```bash
   doppler login
   ```

3. **Setup Project:**
   ```bash
   cd integratewise-complete/apps/web
   doppler setup
   # Select: integratewise → dev
   ```

4. **Migrate Secrets:**
   If you have an existing .env file:
   ```bash
   # Add each secret to Doppler
   doppler secrets set VITE_SUPABASE_URL "value"
   doppler secrets set VITE_SUPABASE_ANON_KEY "value"
   ```

5. **Delete .env:**
   ```bash
   rm .env .env.local .env.*.local
   ```

6. **Update .gitignore:**
   ```bash
   # Already done - .env files are ignored
   ```

---

## Benefits of Doppler

| Feature | Benefit |
|---------|---------|
| **Centralized Secrets** | One source of truth for all environments |
| **No .env Files** | No risk of committing secrets |
| **Environment Switching** | Easy dev/staging/prod switching |
| **Secret Rotation** | Automatic rotation support |
| **Audit Logs** | Track who accessed what secrets |
| **Team Sharing** | Secure team secret sharing |
| **CI/CD Integration** | Native GitHub Actions, etc. support |

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Deploy with Doppler
  uses: dopplerhq/secrets-fetch-action@v1
  with:
    doppler-token: ${{ secrets.DOPPLER_TOKEN }}
    inject-env-vars: true
- name: Build
  run: npm run build
```

### Cloudflare Pages

1. Doppler Dashboard → Integrations
2. Connect Cloudflare Pages
3. Secrets auto-sync on deploy

---

## Security Improvements

| Before (.env) | After (Doppler) |
|---------------|-----------------|
| Files scattered on dev machines | Centralized vault |
| Risk of committing secrets | No local files to commit |
| Manual sync across team | Automatic sync |
| No audit trail | Full access logging |
| Hard to rotate | One-click rotation |

---

## Commands Reference

```bash
# Login
doppler login

# Setup project
doppler setup

# View secrets
doppler secrets

# Set secret
doppler secrets set KEY value

# Run command with secrets
doppler run -- npm run dev
doppler run -- npm run build
doppler run -- wrangler pages deploy dist

# Switch environment
doppler configure set config=staging
doppler configure set config=prod

# View activity
doppler activity
```

---

## Verification

Run the deployment check to verify Doppler setup:

```bash
cd /Users/nirmal/Github/integratewise-live
./scripts/deploy-check.sh
```

Expected output:
```
✓ Doppler CLI installed
✓ Doppler authenticated
✓ Doppler project configured
✓ VITE_SUPABASE_URL configured in Doppler
✓ VITE_SUPABASE_ANON_KEY configured in Doppler
✓ Build succeeds with Doppler secrets
...
🎉 All critical checks passed! Ready for deployment.
```

---

## Questions?

See:
- `DEPLOYMENT_GUIDE.md` — Full deployment instructions
- `AGENTS.md` — Architecture documentation
- [Doppler Docs](https://docs.doppler.com)
