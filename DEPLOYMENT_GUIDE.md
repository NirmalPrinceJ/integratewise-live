# IntegrateWise Deployment Guide

Complete step-by-step guide to deploy IntegrateWise to production using **Doppler** for secrets management.

---

## Prerequisites

- Node.js 18+ installed
- Doppler CLI installed (`brew install doppler`)
- Supabase account (free tier works)
- Cloudflare account (for hosting)
- GitHub account (for OAuth)

---

## Step 1: Doppler Setup (5 minutes)

### 1.1 Login to Doppler

```bash
doppler login
```

### 1.2 Create Doppler Project

```bash
# Create project
doppler projects create integratewise

# Setup local configuration
cd integratewise-complete/apps/web
doppler setup
# Select: integratewise → dev
```

### 1.3 Configure Secrets

Add these secrets to your Doppler project (`dev`, `staging`, and `prod` environments):

```bash
# Required secrets
doppler secrets set VITE_SUPABASE_URL "https://your-project.supabase.co"
doppler secrets set VITE_SUPABASE_ANON_KEY "eyJhbG..."
doppler secrets set SUPABASE_SERVICE_KEY "your-service-role-key"

# Optional secrets
doppler secrets set OPENROUTER_API_KEY "your-key"
doppler secrets set N8N_WEBHOOK_SECRET "your-secret"
```

**Get Supabase credentials:**
1. Go to [supabase.com](https://supabase.com) dashboard
2. Project Settings → API
3. Copy Project URL and anon key

---

## Step 2: Database Setup (10 minutes)

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - Name: `integratewise-prod`
   - Database Password: Generate a strong one
   - Region: Choose closest to your users
4. Wait for project creation (~2 minutes)

### 2.2 Apply SQL Migrations

**Via Supabase Dashboard:**

1. Go to Supabase Dashboard → SQL Editor
2. Run migrations in order:
   - `001_supabase_schema.sql` through `049_*.sql`
   - **CRITICAL**: `050_rls_policies.sql` (enables security)

**Via Supabase CLI:**

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login and link
supabase login
supabase link --project-ref your-project-ref

# Run migrations
for f in integratewise-complete/sql-migrations/*.sql; do
  echo "Applying: $f"
  supabase db execute < "$f"
done
```

### 2.3 Verify RLS is Enabled

Run in SQL Editor:

```sql
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'spine_entities', 'knowledge_insights', 'actions')
ORDER BY tablename;
```

All should show `rls_enabled = true`.

---

## Step 3: Authentication Setup (5 minutes)

### 3.1 Configure OAuth Providers

**Google OAuth:**
1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Create OAuth client ID (Web application)
3. Authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret

**GitHub OAuth:**
1. GitHub Settings → Developer settings → OAuth Apps
2. New OAuth App
3. Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`

### 3.2 Add OAuth to Supabase

1. Supabase Dashboard → Authentication → Providers
2. Enable Google and GitHub
3. Paste Client IDs and Secrets
4. Save

---

## Step 4: Build & Test (5 minutes)

### 4.1 Install Dependencies

```bash
cd integratewise-complete/apps/web
npm install
```

### 4.2 Run Deployment Check

```bash
cd /Users/nirmal/Github/integratewise-live
./scripts/deploy-check.sh
```

### 4.3 Run Tests

```bash
cd integratewise-complete/apps/web
doppler run -- npm test
```

### 4.4 Build for Production

```bash
cd integratewise-complete/apps/web
doppler run -- npm run build
```

Output in `dist/` folder.

---

## Step 5: Deploy to Cloudflare Pages (5 minutes)

### 5.1 Configure Doppler Integration

1. Doppler Dashboard → Integrations
2. Add Cloudflare Pages integration
3. Connect your Cloudflare account
4. Select project and configure sync

### 5.2 Deploy via CLI

```bash
cd integratewise-complete/apps/web

# Deploy with Doppler secrets
doppler run -- wrangler pages deploy dist --project-name=integratewise
```

### 5.3 Set Custom Domain (Optional)

1. Cloudflare Dashboard → Pages → Your Project
2. Custom Domains → Set up custom domain
3. Follow DNS configuration

---

## Doppler Workflow Cheat Sheet

```bash
# Development
doppler run -- npm run dev

# Testing
doppler run -- npm test

# Build
doppler run -- npm run build

# Deploy
doppler run -- wrangler pages deploy dist

# View secrets
doppler secrets

# Edit secrets
doppler secrets edit

# Switch environment
doppler configure set config=prod
doppler run -- npm run build
```

---

## Post-Deployment Verification

### Health Checklist

- [ ] Visit deployed URL - site loads
- [ ] Sign up with email - success
- [ ] Log out and log back in - success
- [ ] Navigate to Dashboard - loads with data
- [ ] Create a task - appears in list
- [ ] View Accounts page - entities load

### Verify Database

Check Supabase Dashboard → Table Editor:
- Records appear in `profiles` after signup
- Records appear in `spine_entities` when created

### Check RLS

Try accessing data without auth:
```javascript
fetch('https://your-project.supabase.co/rest/v1/spine_entities', {
  headers: { 'apikey': 'anon-key' }
})
// Should return empty array
```

---

## Troubleshooting

### Build Fails

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
doppler run -- npm run build
```

### Doppler Not Working

```bash
# Re-authenticate
doppler login

# Reconfigure project
doppler setup

# Verify secrets
doppler secrets get VITE_SUPABASE_URL --plain
```

### Database Connection Errors

1. Verify Doppler secrets are correct
2. Check Supabase project is active
3. Verify RLS policies applied

### Auth Not Working

1. Check OAuth redirect URLs match exactly
2. Verify email confirmation settings in Supabase
3. Check browser console for CORS errors

---

## Security Checklist

Before going live:

- [ ] RLS enabled on all tables
- [ ] OAuth redirect URLs configured
- [ ] No secrets in git history
- [ ] Doppler configured for prod environment
- [ ] Custom domain has SSL enabled
- [ ] Service keys only in backend/workers

---

## Environment Structure

```
Doppler Project: integratewise
├── dev          # Local development
├── staging      # Pre-production
└── prod         # Production

Each environment contains:
├── VITE_SUPABASE_URL
├── VITE_SUPABASE_ANON_KEY
├── SUPABASE_SERVICE_KEY (backend only)
└── Optional: OPENROUTER_API_KEY, etc.
```

---

## Support

If issues:

1. Run `./scripts/deploy-check.sh` for diagnostics
2. Check Doppler logs: `doppler activity`
3. Check Supabase logs in Dashboard → Logs
4. Check Cloudflare Pages build logs

---

**Estimated Total Time: 30 minutes**

**Key Difference: No .env files — all secrets managed via Doppler.**
