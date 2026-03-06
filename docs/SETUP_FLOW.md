# Setup Flow Diagram

## Complete Journey: Local Dev → Production

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 1: SUPABASE SETUP                               │
│                         (2 minutes)                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  https://app.supabase.com                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  1. Create Project                                                  │    │
│  │  2. Go to Settings → API                                            │    │
│  │  3. Copy:                                                           │    │
│  │     • URL → NEXT_PUBLIC_SUPABASE_URL                                │    │
│  │     • anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY                   │    │
│  │     • service_role → SUPABASE_SERVICE_ROLE_KEY                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 2: LOCAL ENV SETUP                              │
│                         (1 minute)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  apps/web/.env.local                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co                    │    │
│  │  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...                            │    │
│  │  SUPABASE_SERVICE_ROLE_KEY=eyJhbG...                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Command: cp .env.local.example .env.local                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 3: DATABASE MIGRATIONS                            │
│                         (1 minute)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Option A: Automatic (with psql)                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ./scripts/setup-supabase.sh                                        │    │
│  │  └── Runs: sql-migrations/001_supabase_schema.sql                   │    │
│  │      └── Creates: tenants, profiles, audit_log tables               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Option B: Manual (Supabase Dashboard)                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  1. https://app.supabase.com/project/_/sql                          │    │
│  │  2. New Query → Paste: sql-migrations/001_supabase_schema.sql       │    │
│  │  3. Run                                                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 4: RUN & TEST                                   │
│                         (1 minute)                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Terminal Commands                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  cd apps/web                                                        │    │
│  │  npm install          ← Install dependencies                        │    │
│  │  npm run dev          ← Start dev server                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Open Browser:                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  http://localhost:3000/test                                         │    │
│  │                                                                     │    │
│  │  ✅ Database Connected                                              │    │
│  │  Users: 0                                                           │    │
│  │  Source: .env.local                                                 │    │
│  │                                                                     │    │
│  │  [Sign Up] [Sign In]                                                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ All tests pass?
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│         NO - Debug            │   │      YES - Continue           │
│                               │   │                               │
│  Check:                       │   │  1. Implement Figma design    │
│  • .env.local values          │   │  2. Deploy to production      │
│  • Supabase project status    │   │                               │
│  • Migrations ran             │   │                               │
│                               │   │                               │
└───────────────────────────────┘   └───────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 5: PRODUCTION DEPLOY                              │
│                         (with Doppler)                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Doppler (Secure Secrets)                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  doppler secrets set NEXT_PUBLIC_SUPABASE_URL "..." --config prd_web│    │
│  │  doppler secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY "..." --config prd_web  │
│  │  doppler secrets set SUPABASE_SERVICE_ROLE_KEY "..." --config prd_web      │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Deploy:                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ./scripts/deploy-web.sh prd                                        │    │
│  │  └── doppler run --config prd_web -- vercel --prod                  │    │
│  │      └── Deploys to: https://app.integratewise.ai                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Time Estimates

| Step | Time | Commands |
|------|------|----------|
| Supabase Setup | 2 min | Web UI clicks |
| Local Env | 1 min | `cp .env.local.example .env.local` |
| Migrations | 1 min | `./scripts/setup-supabase.sh` |
| Run & Test | 1 min | `npm install && npm run dev` |
| **Total to Test** | **5 min** | - |
| Production Deploy | 5 min | `./scripts/deploy-web.sh prd` |

---

## File Reference

| You Edit | Purpose |
|----------|---------|
| `apps/web/.env.local` | Local Supabase credentials |
| Doppler `prd_web` | Production secrets |

| You Run | Purpose |
|---------|---------|
| `./scripts/setup-supabase.sh` | Setup database |
| `npm run dev` | Start dev server |
| `./scripts/deploy-web.sh prd` | Deploy production |

| You Visit | Purpose |
|-----------|---------|
| `http://localhost:3000/test` | Test connection |
| `http://localhost:3000/auth/login` | Test login UI |

---

## Ready?

1. ✅ Get Supabase credentials
2. ✅ Set `.env.local`
3. ✅ Run migrations
4. ✅ `npm run dev`
5. ✅ Visit `/test`
6. ➡️ **Share Figma design for implementation**
