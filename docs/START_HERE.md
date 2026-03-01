# 🚀 Start Here - IntegrateWise Setup

## 5-Minute Quick Start

### Step 1: Get Supabase Credentials (2 min)

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create new project (or use existing)
3. Go to **Project Settings** → **API**
4. Copy these values:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Setup Environment (1 min)

```bash
cd integratewise-complete/apps/web

# Create env file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
EOF

# Edit with your actual values
nano .env.local
```

### Step 3: Setup Database (1 min)

```bash
# Run setup script (requires psql)
../../scripts/setup-supabase.sh

# Or manually via Supabase Dashboard:
# 1. Open SQL Editor
# 2. Run: sql-migrations/001_supabase_schema.sql
# 3. Run: sql-migrations/031_rbac_system.sql
```

### Step 4: Run & Test (1 min)

```bash
npm install
npm run dev
```

Open [http://localhost:3000/test](http://localhost:3000/test)

You should see:
- ✅ Database Connected
- User count (0 if fresh, or existing count)
- Auth test form

---

## What You Can Test

| URL | What It Tests |
|-----|---------------|
| `/test` | Database + Auth connection |
| `/auth/login` | Login page UI |
| `/` | Home page (requires login) |

---

## Troubleshooting

### "Missing Supabase environment variables"
```bash
# Check .env.local exists
cat apps/web/.env.local

# Should show:
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### "Database connection failed"
- Check Supabase project is active (not paused)
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Try: `psql $DATABASE_URL -c "SELECT 1;"`

### "profiles table not found"
```bash
# Run migrations manually via Supabase Dashboard
# SQL Editor → New Query → Paste from:
cat sql-migrations/001_supabase_schema.sql | pbcopy  # macOS
cat sql-migrations/031_rbac_system.sql | pbcopy       # macOS
```

### Auth fails
- Check email confirmation settings in Supabase:
  - Authentication → Settings → Email
  - Disable "Confirm email" for testing (optional)

---

## Next Steps After Testing

### 1. Production Setup (with Doppler)

```bash
# Install Doppler
brew install doppler
doppler login

# Set production secrets
doppler secrets set NEXT_PUBLIC_SUPABASE_URL "https://..." --config prd_web
doppler secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJ..." --config prd_web
doppler secrets set SUPABASE_SERVICE_ROLE_KEY "eyJ..." --config prd_web

# Deploy
./scripts/deploy-web.sh prd
```

### 2. Run Migrations for Full Schema

```bash
# Run all 47 migrations (or select ones you need)
for f in sql-migrations/*.sql; do
  echo "Running $f..."
  psql "$DIRECT_URL" -f "$f" || true
done
```

### 3. Implement Your Figma Design

Once you share the Figma file, I'll implement it using:
- Existing shadcn/ui components (50+)
- Your Supabase backend
- The test page structure

---

## Project Structure

```
integratewise-complete/
├── apps/web/                    # Next.js frontend
│   ├── .env.local               # Your local secrets
│   ├── src/
│   │   ├── app/test/page.tsx    # ✅ Test page (start here)
│   │   ├── app/auth/login/      # Login page
│   │   ├── lib/database/        # Direct Supabase connection
│   │   └── components/ui/       # 50+ shadcn components
│   └── package.json
├── sql-migrations/              # 47 database migrations
│   ├── 001_supabase_schema.sql  # Core schema
│   └── 031_rbac_system.sql      # RBAC (150+ roles)
├── scripts/
│   ├── setup-supabase.sh        # Setup helper
│   └── deploy-web.sh            # Deploy with Doppler
└── START_HERE.md                # This file
```

---

## Status Checklist

- [ ] Created Supabase project
- [ ] Copied credentials to `.env.local`
- [ ] Ran database migrations
- [ ] `npm install` completed
- [ ] `npm run dev` running
- [ ] `/test` page shows "Connected"
- [ ] Can sign up test user
- [ ] Can sign in test user

**When all checked → Ready for Figma implementation!**

---

## Quick Commands

```bash
# Start dev server
cd apps/web && npm run dev

# Test database
psql $DATABASE_URL -c "SELECT COUNT(*) FROM profiles;"

# View Supabase logs
open https://app.supabase.com/project/_/logs

# Deploy staging
../../scripts/deploy-web.sh stg

# Deploy production
../../scripts/deploy-web.sh prd
```

---

## Need Help?

| Issue | Check |
|-------|-------|
| Database connection | `/test` page |
| Auth not working | Supabase Auth settings |
| Migrations failing | `sql-migrations/001_supabase_schema.sql` |
| Deploy failing | Doppler config `prd_web` |

**Ready when you are! Share your Figma design and I'll implement it.** 🎨
