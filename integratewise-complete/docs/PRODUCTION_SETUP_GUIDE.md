# 🚀 Production Setup Guide

Complete step-by-step guide to configure all services for IntegrateWise OS production deployment.

---

## 📋 Setup Checklist

### Priority 1: Critical (Required for Go-Live) 🔴

- [ ] **Supabase** - Authentication & Backup DB
- [ ] **Neon** - Primary Database
- [ ] **Cloudflare** - Edge Infrastructure
- [ ] **Encryption Keys** - Security

### Priority 2: Important (Add within Week 1) 🟡

- [ ] **LemonSqueezy** - Payments
- [ ] **Groq** - Free AI
- [ ] **Sentry** - Error Tracking
- [ ] **PostHog** - Analytics

### Priority 3: Optional (Add Later) 🟢

- [ ] **n8n** - Workflow Automation
- [ ] **Slack/Discord** - Notifications
- [ ] **Additional Integrations**

---

## 🔴 Priority 1: Critical Services (30 minutes)

### 1. Supabase (5 min) ✅

**Purpose**: Authentication + Backup Database

**Steps**:
1. Go to https://supabase.com/dashboard
2. Sign in or create account
3. Click **New Project**
   - Name: `integratewise-prod`
   - Database Password: Generate strong password
   - Region: Choose closest to users
4. Wait 2 minutes for provisioning
5. Go to **Project Settings → API**
6. Copy these values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1...
   ```

**Free Tier**: 500 MB database, 2 GB bandwidth, 50 MB file storage

---

### 2. Neon (5 min) ✅

**Purpose**: Primary PostgreSQL Database

**Steps**:
1. Go to https://console.neon.tech/
2. Sign in with GitHub
3. Click **Create Project**
   - Name: `integratewise-prod`
   - Region: Same as Supabase
   - PostgreSQL version: 16 (latest)
4. Click **Create Project**
5. Copy **Connection String**:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

**Free Tier**: 512 MB storage, 1 GB data transfer

---

### 3. Cloudflare (10 min) ✅

**Purpose**: Workers, D1, KV, R2 Storage

#### 3.1 Account Setup
1. Go to https://dash.cloudflare.com/
2. Sign in or create account
3. Go to **Workers & Pages → Overview**
4. Copy **Account ID** from URL or right sidebar

#### 3.2 API Token
1. Go to **My Profile → API Tokens**
2. Click **Create Token**
3. Use **Edit Cloudflare Workers** template
4. Add permissions:
   - Account → D1 → Edit
   - Account → Workers KV Storage → Edit
   - Account → R2 → Edit
5. Click **Continue to Summary → Create Token**
6. Copy token (shown only once!)

#### 3.3 D1 Database
```bash
# From terminal
wrangler d1 create integratewise-spine-prod
# Copy database_id from output
```

#### 3.4 KV Namespace
```bash
wrangler kv:namespace create "CACHE"
# Copy id from output
```

#### 3.5 R2 Bucket
```bash
wrangler r2 bucket create integratewise-store
```

**Result**:
```
CLOUDFLARE_ACCOUNT_ID=abc123...
CLOUDFLARE_API_TOKEN=xxx...
CLOUDFLARE_D1_DATABASE_ID=xxx...
CLOUDFLARE_KV_NAMESPACE_ID=xxx...
CLOUDFLARE_R2_BUCKET=integratewise-store
```

**Free Tier**:
- D1: 10 GB storage, 50 million reads/day
- KV: 1 GB storage, 100k reads/day
- R2: 10 GB storage, 1 million Class A operations/month

---

### 4. Encryption Keys (2 min) ✅

**Purpose**: Secure data encryption

**Generate Keys**:
```bash
# Generate encryption key
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 64

# Generate webhook secret
openssl rand -base64 32

# Generate admin secret
openssl rand -base64 32
```

**Result**:
```
ENCRYPTION_KEY=generated-key-1
JWT_SECRET=generated-key-2
WEBHOOK_SECRET=generated-key-3
ADMIN_SECRET=generated-key-4
```

---

## 🟡 Priority 2: Important Services (1 hour)

### 5. LemonSqueezy (10 min) 💰

**Purpose**: Payment Processing (Simple alternative to Stripe)

**Steps**:
1. Go to https://app.lemonsqueezy.com/
2. Sign up for account
3. Complete onboarding
4. Go to **Settings → API**
5. Click **Create API Key**
6. Copy API Key
7. Go to **Settings → General** → Copy Store ID
8. Go to **Settings → Webhooks**
9. Create webhook:
   - URL: `https://integratewise.ai/api/webhooks/lemonsqueezy`
   - Events: Select all order events
   - Copy Signing Secret

**Result**:
```
LEMONSQUEEZY_API_KEY=xxx
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=xxx
```

**Pricing**: 5% + payment processor fees

---

### 6. Groq (2 min) 🤖

**Purpose**: Fast, Free AI Inference (Llama 3, Mixtral)

**Steps**:
1. Go to https://console.groq.com/
2. Sign in with Google/GitHub
3. Go to **API Keys**
4. Click **Create API Key**
5. Copy key (starts with `gsk_`)

**Result**:
```
GROQ_API_KEY=gsk_xxx
```

**Free Tier**:
- Llama 3: 14,400 requests/day
- Mixtral: 14,400 requests/day
- Very fast inference (< 100ms)

---

### 7. Sentry (5 min) 🐛

**Purpose**: Error Tracking & Monitoring

**Steps**:
1. Go to https://sentry.io/
2. Sign up (free tier)
3. Create **New Project**
   - Platform: Next.js
   - Name: `integratewise-prod`
4. Copy **DSN** (shown immediately)
5. Go to **Settings → Auth Tokens**
6. Create token with `project:releases` scope

**Result**:
```
SENTRY_DSN=https://xxx@oyyy.ingest.sentry.io/zzz
SENTRY_AUTH_TOKEN=xxx
```

**Free Tier**: 5,000 events/month

---

### 8. PostHog (5 min) 📊

**Purpose**: Product Analytics & Feature Flags

**Steps**:
1. Go to https://app.posthog.com/
2. Sign up (free tier)
3. Create organization & project
4. Go to **Project Settings**
5. Copy **Project API Key**
6. Copy **Host** (usually `https://app.posthog.com`)

**Result**:
```
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Free Tier**: 1 million events/month

---

## 🟢 Priority 3: Optional Services (Add Later)

### 9. n8n (Self-Hosted Workflow Automation)

**Option A: Cloud**:
1. Go to https://n8n.io/
2. Sign up for cloud (starts at $20/month)

**Option B: Self-Host**:
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Result**:
```
N8N_WEBHOOK_URL=https://n8n.yourdomain.com/webhook
N8N_API_KEY=your-api-key
```

---

### 10. Slack (Notifications)

1. Go to https://api.slack.com/apps
2. Create New App
3. Add **Incoming Webhooks**
4. Copy Webhook URL

```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
```

---

### 11. Discord (Notifications)

1. Go to your Discord server
2. Server Settings → Integrations → Webhooks
3. Create Webhook
4. Copy URL

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx
```

---

## 📝 Configuration Steps

### Step 1: Create .env.local

```bash
# Copy template
cp .env.production.template .env.local

# Edit with your values
nano .env.local
```

### Step 2: Add to Bitbucket

Go to **Repository Settings → Repository Variables**:
- Add each variable
- Mark as **Secured** ✅
- Add to both `staging` and `production` environments

### Step 3: Add to Cloudflare

For each Worker service:
```bash
cd services/gateway
wrangler secret put SUPABASE_URL
wrangler secret put DATABASE_URL
# etc.
```

Or use `wrangler.toml`:
```toml
[env.production.vars]
ENVIRONMENT = "production"

[env.production.secrets]
# Reference secrets in Cloudflare dashboard
```

---

## 🔒 Security Best Practices

1. **Never commit secrets** to git
2. **Use different keys** for staging vs production
3. **Rotate secrets** every 90 days
4. **Use strong passwords** (min 32 chars)
5. **Enable 2FA** on all services
6. **Monitor API usage** regularly
7. **Set up billing alerts**

---

## ✅ Verification Checklist

Once configured, verify each service:

```bash
# Test Neon connection
psql $DATABASE_URL -c "SELECT version();"

# Test Supabase
curl https://your-project.supabase.co/rest/v1/ \
  -H "apikey: your-anon-key"

# Test Cloudflare
wrangler whoami

# Test AI
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"
```

---

## 📞 Support

- **Supabase**: https://supabase.com/docs
- **Neon**: https://neon.tech/docs
- **Cloudflare**: https://developers.cloudflare.com/
- **LemonSqueezy**: https://docs.lemonsqueezy.com/
- **Groq**: https://console.groq.com/docs
- **Sentry**: https://docs.sentry.io/
- **PostHog**: https://posthog.com/docs

---

## 🎉 Next Steps

After configuration:
1. Run migrations (Task #3)
2. Deploy to staging (Task #6)
3. Test everything
4. Deploy to production (Task #8)
