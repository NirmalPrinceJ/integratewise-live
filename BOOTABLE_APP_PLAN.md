# IntegrateWise Web App — Bootable State Plan

## Current Architecture (What Actually Exists)

### Codebase Location
- **Source:** `/Users/nirmal/Github/integratewise-live/integratewise-complete/apps/web/`
- **Build copy:** `/tmp/iw-build/` (bypasses macOS `com.apple.provenance` permission block)
- **Package manager:** pnpm@9 (monorepo with 41 workspace projects)
- **Framework:** Next.js 16.0.10 (Turbopack)
- **DB:** Supabase (project: `hrrbciljsqxnmuwwnrnt`)
- **Secrets:** Doppler (prod) / `.env.local` (dev)

### Two Parallel UI Systems (Root Cause of Issues)

| System | Location | Layout | Auth | Data |
|--------|----------|--------|------|------|
| **V1 "Original"** | `src/app/(app)/` | `UnifiedShell` + RBAC + Domain Shells | `middleware.ts` → Supabase session check → redirect to `/auth/login` | Requires `profiles`, `tenants` tables |
| **V2 "Kimi's"** | `src/app/dashboard/`, `src/app/tasks/`, etc. | `DashboardLayout` (standalone sidebar) | None (blocked by V1 middleware) | All hardcoded mock data |

**V1** has 400+ pages inside `(app)/`, including admin panel with 40+ sub-pages. Uses:
- `UnifiedShell` → `useRBAC` hook → Supabase `profiles` table lookup → Domain shell injection
- `TenantProvider` → fetches `/api/tenant/context`  
- `middleware.ts` → catches ALL non-public routes, requires Supabase auth session
- Auth login at `/auth/login` using `auth-client.ts` → Cloudflare Auth Worker at `auth.integratewise.ai`

**V2** (Kimi's commit `bffe6a2`) added 16 standalone pages using a simple `DashboardLayout`. These pages:
- Work independently without any DB connection
- Render static mock data
- Use a simpler sidebar component
- Have a new login page at `/login-new` wired to direct Supabase auth

### The Conflict
The `middleware.ts` from V1 intercepts ALL routes and redirects unauthenticated users to `/auth/login`. Even after disabling it, **Turbopack caches the compiled middleware** and continues redirecting. The `.next` cache must be fully cleared + server restarted for middleware changes to take effect.

### What's NOT Set Up
- **No SQL schema** in Supabase — `profiles`, `tenants`, `roles`, `health_check` tables don't exist
- **No `/api/tenant/context`** route returning tenant data
- **No `exec_sql` RPC** stored procedure in Supabase
- **Auth worker** at `auth.integratewise.ai` is not deployed (V1's auth-client.ts points there)
- **27 Cloudflare Workers** referenced in docs — none deployed

---

## Plan: 3 Tasks to Bootable State

### Task 1: Fix Middleware + Clear Cache (5 min)
**Goal:** Allow all standalone pages to load without auth redirect

**Steps:**
1. Replace `middleware.ts` with a minimal version that ONLY protects `/(app)/` routes
2. Delete `.next/` cache completely
3. Restart dev server
4. Verify: `/dashboard`, `/test`, `/onboarding`, `/login-new` all load

**Why:** The Turbopack cache holds the compiled old middleware. Even renaming the file doesn't work without cache clear. The simplest fix is a clean middleware that only gates `(app)` routes.

### Task 2: Create Supabase Schema (10 min)  
**Goal:** Create the minimum tables so V1 auth + RBAC works

**Steps:**
1. Create SQL migration with:
   - `profiles` table (id, full_name, avatar_url, role, tenant_id, created_at)
   - `tenants` table (id, name, industry, plan, created_at)
   - `health_check` table (id, checked_at)
   - Basic RLS policies
2. Run migration against Supabase (via dashboard SQL editor or CLI)
3. Create a test user in Supabase Auth dashboard
4. Verify: `/test` page shows "Database Connected"

### Task 3: Wire Login → Dashboard Flow (10 min)
**Goal:** Complete auth flow: login → session → dashboard with real data

**Steps:**
1. Ensure `/login-new` calls `signInWithSupabaseEmail` (already done)
2. On success, redirect to `/dashboard`
3. Verify the Supabase session cookie is set
4. Dashboard loads (with static data for now — that's fine)

---

## Files Modified So Far (This Session)

| File | Change | Status |
|------|--------|--------|
| `apps/web/.env.local` | Created with Supabase credentials | ✅ Done |
| `apps/web/src/app/login-new/page.tsx` | Wired to `signInWithSupabaseEmail` + error handling | ✅ Done |
| `apps/web/src/components/shell/UnifiedShell.tsx` | Fixed lowercase imports + moved Search import | ✅ Done |
| `apps/web/src/app/page.tsx` | Redirect to `/login-new` instead of `/today` | ✅ Done |
| `apps/web/src/app/(app)/{accounts,integrations,knowledge,pipeline,settings,tasks}/` | Removed to fix parallel route conflicts | ✅ Done (in /tmp/iw-build) |
| `apps/web/src/middleware.ts` | Renamed to `.disabled` (but Turbopack cache didn't pick it up) | ⚠️ Needs proper fix |

## Key Insight: macOS Provenance Block
The source directory has `com.apple.provenance` extended attributes (macOS Sequoia security) that prevent:
- `mkdir` inside the directory (pnpm install fails)
- `cp` of `.env.local` 

**Workaround:** Copy to `/tmp/iw-build/`, install there, run from there. All code changes need to be made in BOTH locations (source for git, /tmp for running).

## Doppler Note
Production uses Doppler for secrets. The `.env.local` approach is for local dev only. Both paths are supported by `provider.ts` which reads `process.env.NEXT_PUBLIC_SUPABASE_URL` regardless of source.
