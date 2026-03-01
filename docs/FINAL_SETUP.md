# Final Setup - Local Dev + Doppler Production

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT (Local)                              │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  .env.local file                                                │   │
│  │  NEXT_PUBLIC_SUPABASE_URL=...                                   │   │
│  │  NEXT_PUBLIC_SUPABASE_ANON_KEY=...                              │   │
│  └───────────────────────────┬─────────────────────────────────────┘   │
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  npm run dev                                                    │   │
│  │  http://localhost:3000/test                                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ git push
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PRODUCTION (Doppler + Vercel)                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Doppler (Secure Secrets)                                       │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                         │   │
│  │  │ dev_web │  │ stg_web │  │ prd_web │                         │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘                         │   │
│  │       │            │            │                               │   │
│  │       └────────────┴────────────┘                               │   │
│  │                    │                                            │   │
│  │  doppler run --config prd_web -- vercel --prod                 │   │
│  └────────────────────┼────────────────────────────────────────────┘   │
│                       │                                                 │
│                       ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Vercel Production                                              │   │
│  │  https://app.integratewise.ai                                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Local Development (5 minutes)

```bash
cd integratewise-complete/apps/web

# Create env file
cp .env.local.example .env.local

# Edit with your Supabase credentials
# Get from: https://app.supabase.com/project/_/settings/api
nano .env.local
```

**`.env.local`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
```

```bash
# Install & run
npm install
npm run dev

# Test at: http://localhost:3000/test
```

### 2. Production Deployment (with Doppler)

```bash
# Deploy to staging
./scripts/deploy-web.sh stg

# Deploy to production
./scripts/deploy-web.sh prd
```

---

## File Structure

```
apps/web/
├── .env.local.example          # Template for local dev
├── .env.local                  # Your local secrets (gitignored)
├── src/
│   ├── lib/
│   │   ├── database/
│   │   │   └── provider.ts     # Direct Supabase connection
│   │   ├── supabase/
│   │   │   ├── client.ts       # Supabase client
│   │   │   └── auth.ts         # Direct Supabase auth
│   │   └── auth-client.ts      # Cloudflare Access auth (production)
│   └── app/
│       ├── test/
│       │   └── page.tsx        # Connection & auth test page
│       └── auth/
│           └── login/
│               └── page.tsx    # Login page

scripts/
├── deploy-web.sh               # Deploy with Doppler
└── doppler-*.sh                # Doppler helper scripts

ENVIRONMENT_SETUP.md            # Detailed env setup guide
FINAL_SETUP.md                  # This file
```

---

## Why This Setup?

| Aspect | Local (.env.local) | Production (Doppler) |
|--------|-------------------|----------------------|
| **Speed** | Fast, no network calls | Secure injection |
| **Security** | OK for dev only | Encrypted, audited |
| **Team Sharing** | Manual | Centralized |
| **Secret Rotation** | Manual | Automated |
| **Access Control** | Anyone with file | Role-based |

---

## Commands Reference

### Local Development
```bash
# Standard
npm run dev

# With Doppler (optional)
doppler run --config dev_web -- npm run dev
```

### Testing
```bash
# Test Supabase connection
open http://localhost:3000/test

# Test login flow
open http://localhost:3000/auth/login
```

### Deployment
```bash
# Deploy script
./scripts/deploy-web.sh [dev|stg|prd]

# Manual with Doppler
doppler run --config prd_web -- vercel --prod
```

### Doppler Management
```bash
# View secrets
doppler secrets --config prd_web

# Set secret
doppler secrets set KEY value --config prd_web

# List configs
doppler configs --project integratewise
```

---

## Status

| Component | Status | Location |
|-----------|--------|----------|
| Database Provider | ✅ | Direct Supabase |
| Auth (Supabase) | ✅ | `lib/supabase/auth.ts` |
| Auth (Cloudflare) | ✅ | `lib/auth-client.ts` |
| Test Page | ✅ | `/test` |
| Doppler Deploy | ✅ | `scripts/deploy-web.sh` |

---

## Next Steps

1. ✅ **Local Test**: Set `.env.local`, run `npm run dev`, test at `/test`
2. ✅ **Doppler Setup**: Create configs, add secrets
3. ✅ **Staging Deploy**: Run `./scripts/deploy-web.sh stg`
4. ✅ **Production Deploy**: Run `./scripts/deploy-web.sh prd`
