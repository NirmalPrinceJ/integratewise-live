# IntegrateWise OS — SaaS Implementation Phases (Detailed Prompts)

Each phase below is a self-contained prompt you can hand to an AI or developer. Every prompt references exact file paths, existing code patterns, and what to build.

---

## Phase 1: Plan Tiers Config + Paywall UI Components

### What exists
- `src/lib/entitlements.ts` — `FEATURE_GATES`, `featureAccess()`, `isPlanAtLeast()`, `planLabel()`
- `src/contexts/tenant-context.tsx` — `useTenant()` returns `{ plan, role, featureFlags, limits, usage, setPlan }`
- `src/components/ProtectedView.tsx` — gates by `viewId` using `useViewAccess()`, shows lock card + "Upgrade Plan" button
- `src/components/ui/progress.tsx` — `<Progress value={n} max={m} />` bar component
- `src/components/ui/badge.tsx`, `button.tsx`, `card.tsx` — UI primitives

### What to build

**1. `src/config/plan-tiers.ts`** (NEW)

Create a single-source-of-truth config for all 4 plan tiers. This drives the pricing page, upgrade prompts, and feature comparison.

```typescript
import type { EntitlementTier } from "@/config/os-shell-registry"

export interface PlanTier {
  id: EntitlementTier
  name: string
  tagline: string
  priceMonthly: number | null  // null = "Custom"
  priceAnnual: number | null
  limits: {
    users: number | null        // null = unlimited
    integrations: number | null
    aiSessions: number | null
    storageGb: number | null
    retentionDays: number | null
  }
  features: Record<string, boolean | string>  // feature key → true/false/"basic"/"governed"
  stripePriceIdMonthly?: string
  stripePriceIdAnnual?: string
  highlighted?: boolean  // for "Most Popular" badge
}

export const PLAN_TIERS: PlanTier[] = [...]
```

Populate `features` using the Feature Gating Matrix from the architecture doc. Feature keys should match `FEATURE_GATES` keys in `src/lib/entitlements.ts`. Include these sections:
- Worlds: `worlds.personal`, `worlds.work`, `worlds.accounts`
- Surfaces: `surfaces.spine`, `surfaces.context`, `surfaces.knowledge.team`, `surfaces.iq_hub`, `surfaces.actions`, `surfaces.audit`
- AI: `ai.chat`, `ai.situation_detection`, `ai.action_proposals`, `ai.auto_execution`, `ai.summarization`, `ai.root_cause`, `ai.impact_prediction`
- Governance: `governance.basic_approvals`, `governance.workflows`, `governance.risk_scoring`, `governance.separation_of_duties`, `compliance.frameworks`
- Admin: `admin.user_management`, `admin.role_preset`, `admin.custom_roles`, `admin.department_permissions`, `admin.sso`, `admin.scim`
- Integrations: `integrations.standard`, `integrations.premium`, `integrations.custom`, `integrations.webhooks`, `integrations.api`

Pricing from architecture doc:
- Personal: free
- Team: $29/user/month annual, $39/monthly
- Organization: $79/user/month annual, $99/monthly
- Enterprise: null (Custom)

Mark Organization tier as `highlighted: true`.

**2. `src/components/paywall/UpgradePrompt.tsx`** (NEW)

Three variants: `inline`, `full`, `banner`.

Props:
```typescript
{
  featureName: string
  requiredPlan: EntitlementTier
  currentPlan: EntitlementTier
  variant?: "inline" | "full" | "banner"
  className?: string
}
```

- `inline`: Single line with text + "Upgrade" button, fits inside a card or section. Uses `border-dashed border-primary/30 bg-primary/5` style.
- `full`: Centered card like existing `ProtectedView.tsx` (lock icon + title + description + CTA). Reuse the same visual pattern.
- `banner`: Full-width top bar with gradient background, dismissible. For page-level prompts.

All variants link to `/upgrade`. Use `planLabel()` from `src/lib/entitlements.ts` for display names. Import `Crown`, `Lock`, `ArrowRight` from `lucide-react`.

**3. `src/components/paywall/FeatureGate.tsx`** (NEW)

```typescript
interface FeatureGateProps {
  featureKey: string
  children: React.ReactNode
  fallback?: React.ReactNode
  variant?: "inline" | "full" | "banner"  // controls UpgradePrompt variant
}
```

Internally calls `featureAccess({ plan, featureFlags, featureKey })` from `src/lib/entitlements.ts` using `useTenant()`. If `hasAccess` is false, renders `fallback` or `<UpgradePrompt>` with the `requiredPlan` from the result.

This is the composable alternative to `ProtectedView` — works for any feature, not just nav views.

**4. `src/components/paywall/UsageMeter.tsx`** (NEW)

```typescript
interface UsageMeterProps {
  metricKey: string  // matches keys in tenant context limits/usage
  label: string
  className?: string
  compact?: boolean  // for sidebar/header use
}
```

Uses `useTenant()` to read `limits[metricKey]` and `usage[metricKey]`. Renders:
- Label text
- `<Progress>` bar from `src/components/ui/progress.tsx`
- Count: `{usage} / {limit}` or `{usage} / ∞` if unlimited
- Color: green default, `bg-amber-500` if usage >= 80% of limit, `bg-red-500` if >= 95%

When `compact` is true, render as single line without label.

**5. `src/components/paywall/PlanBadge.tsx`** (NEW)

```typescript
interface PlanBadgeProps {
  plan?: EntitlementTier  // defaults to current plan from useTenant()
  className?: string
}
```

Renders a `<Badge>` with plan-specific colors:
- Personal: `bg-slate-100 text-slate-700`
- Team: `bg-blue-100 text-blue-700`
- Organization: `bg-purple-100 text-purple-700`
- Enterprise: `bg-amber-100 text-amber-700`

Uses `planLabel()` for display text.

**6. `src/components/paywall/index.ts`** (NEW)

Barrel export for all paywall components.

### Verification
- Import `<FeatureGate featureKey="worlds.accounts">` in any page, set plan to "personal" via `setPlan()` in browser console, verify upgrade prompt shows.
- Import `<UsageMeter metricKey="ai.sessions" label="AI Sessions" />`, verify it renders with data from tenant context.
- `pnpm build` passes.

---

## Phase 2: Upgrade/Pricing Page

### What exists
- Phase 1 components: `PlanComparisonTable`, `UpgradePrompt`, `PlanBadge`
- `src/config/plan-tiers.ts` from Phase 1
- `src/lib/stripe/server.ts` — `createCheckoutSession()` already works
- `src/app/api/billing/checkout/route.ts` — POST endpoint creating Stripe checkout sessions
- Route group `(app)` for authenticated pages

### What to build

**1. `src/components/paywall/PlanComparisonTable.tsx`** (NEW)

A full pricing comparison grid driven by `PLAN_TIERS` from `src/config/plan-tiers.ts`.

Structure:
- 4-column grid (one per tier), responsive (stacks on mobile)
- Header per column: plan name, price (with annual/monthly toggle), tagline
- `highlighted` tier gets a "Most Popular" badge and ring border
- Current plan column shows "Current Plan" badge instead of CTA
- Higher tiers show "Upgrade" button, lower tiers show "Downgrade" (or hidden)

Feature rows grouped by section (Worlds, Surfaces, AI, Governance, Admin, Integrations):
- Boolean features: checkmark (✓) or dash (—)
- String features: display the string ("basic", "governed", "manual")
- Limit features: display the number or "Unlimited"

Props:
```typescript
{
  currentPlan: EntitlementTier
  billingCycle: "monthly" | "annual"
  onBillingCycleChange: (cycle: "monthly" | "annual") => void
  onSelectPlan: (plan: EntitlementTier) => void
}
```

Use existing UI primitives: `Card`, `Badge`, `Button`, `cn()`.

**2. `src/app/(app)/upgrade/page.tsx`** (NEW)

Full page with:
- Header: "Choose Your Plan" + subtitle
- Billing cycle toggle (monthly/annual) showing savings percentage
- `<PlanComparisonTable>` with current plan from `useTenant().plan`
- `onSelectPlan` handler:
  - If plan has `stripePriceIdMonthly`/`stripePriceIdAnnual` in config, POST to `/api/billing/checkout` with `priceId`, redirect to Stripe
  - If enterprise (no price), show "Contact Sales" modal/link
- FAQ section at bottom (collapsible accordion using Radix AccordionPrimitive if available, otherwise simple toggles)

**3. Update `src/components/ProtectedView.tsx`** (MODIFY)

Change the "Upgrade Plan" button `href` from `/upgrade` to include the feature context:
```tsx
<a href={`/upgrade?feature=${viewId}`}>
```

This way the upgrade page can highlight which feature triggered the upgrade.

**4. `src/app/(app)/upgrade/layout.tsx`** (NEW)

Simple layout wrapper — no sidebar needed, just centered max-width container within the app shell.

### Verification
- Navigate to `/upgrade` — see 4-tier comparison table with current plan highlighted
- Toggle monthly/annual — prices update
- Click "Upgrade" on a higher tier — redirects to Stripe checkout (or shows error if Stripe not configured, which is fine for now)
- From a locked feature, click "Upgrade Plan" — lands on `/upgrade?feature=...`
- `pnpm build` passes.

---

## Phase 3: Enhanced Admin Pages (Billing, Usage, Roles, Tenancy, Audit)

### What exists
- `src/app/(app)/admin/billing/page.tsx` → renders `<AdminBillingPage>` from `src/components/admin/pages/billing-page.tsx` — shows tenant plans table with mock data from `/api/admin/billing`
- `src/app/(app)/admin/usage/page.tsx` → renders `<AdminStubPage title="Usage">` — STUB
- `src/app/(app)/admin/roles/page.tsx` → renders `<AdminStubPage title="Roles">` — STUB
- `src/app/(app)/admin/features/page.tsx` → renders `<AdminStubPage title="Features">` — STUB
- `src/components/admin/pages/tenancy-page.tsx` — real component with tenant table, edit drawer
- `src/components/admin/pages/audit-page.tsx` — real component with audit log table
- `src/components/admin/pages/users-page.tsx` — real component with members table, invite modal
- Admin shared components: `DataTable`, `DetailDrawer`, `useAdminApi` hook
- `src/types/admin.ts` — defines `BillingPlan`, `Role`, `Member`, `AuditLogEntry`, `Tenant`
- Phase 1/2 components: `UsageMeter`, `PlanBadge`, `FeatureGate`, `PlanComparisonTable`

### What to build

**1. Enhance `src/components/admin/pages/billing-page.tsx`** (MODIFY)

Add above the existing DataTable:

a) **Plan Overview Card**: Shows current plan with `<PlanBadge>`, tenant name, billing cycle, next renewal date, seat count (`seatsUsed / seats`). "Change Plan" button linking to `/upgrade`.

b) **Usage Meters Section**: Grid of 4 `<UsageMeter>` components:
- `metricKey="ai.sessions"` label="AI Sessions"
- `metricKey="connectors.count"` label="Integrations"
- `metricKey="storageGb"` label="Storage"
- `metricKey="actionRuns"` label="Action Runs"

Read current values from `useTenant().usage` and `useTenant().limits`.

c) **Upgrade CTA**: If plan !== "enterprise", show an inline `<UpgradePrompt variant="inline">` at top.

Keep existing DataTable and DetailDrawer as-is.

**2. Create `src/components/admin/pages/usage-page.tsx`** (NEW)

Replace the stub. Build a real usage dashboard:

a) **Period Selector**: Current month dropdown, with date range display.

b) **Summary Cards Grid** (4 cards):
- AI Sessions: current / limit, trend arrow
- Integrations: active / limit
- Storage: used GB / limit GB
- API Calls: count / limit (if applicable)

Each card uses `<UsageMeter>` internally.

c) **Usage History Chart**: Placeholder for now — show a simple table of daily/weekly usage aggregates. Headers: Date | AI Sessions | API Calls | Storage Delta. Fetch from `/api/admin/usage` (will be mock initially).

d) **Alerts Section**: List of usage alerts (e.g., "AI sessions at 85% of monthly limit"). Use `<FeatureGate featureKey="surfaces.audit">` to gate alert configuration behind team+ plan.

Wire to admin route: Update `src/app/(app)/admin/usage/page.tsx` to import and render `<AdminUsagePage>` instead of `AdminStubPage`.

**3. Create `src/components/admin/pages/roles-page.tsx`** (NEW)

Replace the stub. Structure:

a) **Preset Roles Section**: Cards for each preset role (Owner, Admin, Manager, Practitioner, Readonly). Each card shows:
- Role name + description
- List of key permissions as badges
- Member count using that role
- Not editable (system roles)

Use the role definitions from the architecture doc section 3.4.

b) **Custom Roles Section**: Wrapped in `<FeatureGate featureKey="admin.custom_roles">`.
- "Create Custom Role" button opens modal
- Table of custom roles with: Name, Base Role, Member Count, Actions (edit/delete)
- Edit modal with:
  - Name, description, base role dropdown
  - Permission matrix: rows = resources (today, spine, context, knowledge, actions, audit, admin), columns = actions (view, create, edit, delete, execute, approve, admin) — checkboxes
  - Scope section: World checkboxes (personal/work/accounts), Department multi-select, Data classification checkboxes

Fetch from `/api/admin/roles`. For now, have the API return mock data matching the `Role` type from `src/types/admin.ts`.

Wire: Update `src/app/(app)/admin/roles/page.tsx` to render `<AdminRolesPage>`.

**4. Create `src/components/admin/pages/features-page.tsx`** (NEW)

Replace the stub. Admin feature flag management:

a) **Feature Gates Table**: List all entries from `FEATURE_GATES` in `src/lib/entitlements.ts`. Columns:
- Feature Key
- Minimum Plan (badge)
- Status (enabled/disabled toggle — read-only for now, just displays)
- Description (hardcoded map of feature key → human description)

b) **Tenant Overrides Section**: Wrapped in `<FeatureGate featureKey="admin.custom_roles">` (org+ only).
- Table showing feature flags specific to this tenant (from `featureFlags` in tenant context)
- "all" flag shows as special "All Features Enabled" banner

c) **Plan Comparison Preview**: Embed `<PlanComparisonTable>` in read-only mode showing what each plan gets.

Wire: Update `src/app/(app)/admin/features/page.tsx` to render `<AdminFeaturesPage>`.

**5. Enhance `src/components/admin/pages/tenancy-page.tsx`** (MODIFY)

Add to existing page:

a) **Workspace Section**: Below tenant table, add "Workspaces" card showing:
- List: Production (default), Staging, Development
- "Create Workspace" button gated behind `<FeatureGate featureKey="governance.workflows">`
- Each workspace row: name, environment badge, created date

b) **Domain Configuration**: Card for custom domains. Text input for domain, "Verify" button. Gated behind org+ plan.

**6. Enhance `src/components/admin/pages/audit-page.tsx`** (MODIFY)

Add to existing page:

a) **Filter Bar**: Above the DataTable, add filter inputs:
- Action type dropdown (login, create, update, delete, execute, approve)
- Actor search (text input)
- Date range (from/to date inputs)
- Resource type dropdown

b) **Export Button**: "Export CSV" button gated behind `<FeatureGate featureKey="surfaces.audit">`.

c) **Compliance Mode**: Banner at top gated behind `<FeatureGate featureKey="compliance.frameworks">` showing "Compliance Mode: SOC2 / HIPAA / GDPR" toggles.

**7. Create mock API endpoints for new pages:**

- `src/app/api/admin/usage/route.ts` (NEW) — returns mock usage data matching the dashboard structure
- Update `src/app/api/admin/roles/route.ts` (if stub, replace) — returns preset roles + mock custom roles matching `Role` type
- Update `src/app/api/admin/features/route.ts` (if stub, replace) — returns feature gates from `FEATURE_GATES` constant

Use the same pattern as existing admin APIs: import from `@/app/api/admin/_mock`, return `ok({ data, total })`.

### Verification
- Admin billing page shows plan card + usage meters + upgrade CTA
- Admin usage page shows 4 metric cards with progress bars
- Admin roles page shows 5 preset roles + custom roles section (locked on team plan, visible on org plan)
- Admin features page shows feature gates table + plan comparison
- Tenancy page shows workspace section
- Audit page shows filter bar
- Toggle plan via `setPlan('personal')` in console → verify feature gates lock sections
- `pnpm build` passes.

---

## Phase 4: OS Shell RBAC Enhancements + World Gating

### What exists
- `src/components/layouts/os-shell.tsx` — main shell with `ViewSwitchButton` and `NavItemButton` that call `useViewAccess()`
- Already disables nav items with `cursor-not-allowed` + `text-slate-300` when `!allowed`
- `src/contexts/world-scope.tsx` — `WorldScopeProvider` with `scope`, `department`, `setScope()`
- `src/hooks/useViewAccess.ts` — checks featureFlag, role, plan
- Phase 1 components: `PlanBadge`, `FeatureGate`

### What to build

**1. Enhance OS Shell sidebar header** (`src/components/layouts/os-shell.tsx`)

Add `<PlanBadge />` next to the tenant name in the sidebar header area. Import from `src/components/paywall/PlanBadge`.

**2. Improve locked nav item UX**

Currently locked items are just grayed out. Enhance:
- Add a small `Lock` icon (12px, from lucide-react) after the label text for locked items
- Wrap in a tooltip (use Radix TooltipPrimitive or a simple `title` attribute) showing: `"{reason} — Click to upgrade"` where reason comes from `useViewAccess().reason`
- On click of a locked item, navigate to `/upgrade?feature={item.featureFlag}` instead of doing nothing

**3. Add "Upgrade" link in sidebar footer**

If any nav items in the current view are locked (i.e., `useViewAccess` returns `allowed: false` for any item), show a small footer section at bottom of sidebar:
```
─── Unlock more features ───
[Crown icon] Upgrade to {nextPlanLabel}
```

Where `nextPlanLabel` is the next tier above the current plan. Link to `/upgrade`.

**4. World scope gating in world switcher**

In the world/view switcher area of os-shell.tsx, wrap world options with access checks:
- Personal world: always enabled
- Work world: check `featureAccess({ ..., featureKey: "worlds.work" })`. If locked, show lock icon + tooltip
- Accounts world: check `featureAccess({ ..., featureKey: "worlds.accounts" })`. If locked, show lock icon + tooltip
- Admin: check role is `owner` or `admin`. If not, hide entirely (don't just lock)

Use `featureAccess()` from `src/lib/entitlements.ts` with `useTenant()` values.

**5. Department count gating**

For team plan, only 3 departments should be accessible in Work world. In the department list within os-shell.tsx:
- Read `plan` from `useTenant()`
- If plan === "team", only enable the first 3 department views. Lock the rest with `<Lock>` icon + tooltip "Upgrade to Organization for all 12 departments"
- If plan === "org" or "enterprise", enable all departments

The "first 3" can be determined by order in the registry, or you can hardcode: Operations, Sales, Marketing as the defaults for team plan.

**6. Plan switcher for demo/testing**

Add a small developer-only plan switcher dropdown at the very bottom of the sidebar (only visible when `process.env.NODE_ENV === "development"` or when a `?debug=true` query param is present):
- Dropdown with 4 options: Personal, Team, Organization, Enterprise
- On change, calls `setPlan()` from `useTenant()`
- Styled subtly: small text, muted colors

This enables testing all plan states without backend changes.

### Verification
- Plan badge visible in sidebar header
- Locked nav items show lock icon + tooltip
- Clicking locked item navigates to `/upgrade`
- World switcher shows lock on Accounts world when on team plan
- Only 3 departments enabled on team plan, all 12 on org plan
- Debug plan switcher works (change plan, see UI update immediately)
- Sidebar footer shows "Upgrade" link when features are locked
- `pnpm build` passes.

---

## Phase 5: Settings Pages (Billing, Security, Team)

### What exists
- `src/app/(app)/settings/` — pages for profile, security, notifications, language, appearance
- `src/app/(app)/settings/security/page.tsx` — exists (need to read to see current content)
- `src/lib/stripe/server.ts` — `createBillingPortalSession()`, `createCheckoutSession()`
- `src/app/api/billing/checkout/route.ts` — working checkout endpoint
- Phase 1-4 components available

### What to build

**1. `src/app/(app)/settings/billing/page.tsx`** (NEW)

User-facing billing page (not the admin control plane version):

a) **Current Plan Card**: Plan name + badge, billing cycle, next renewal date. "Change Plan" links to `/upgrade`.

b) **Usage Summary**: Compact grid of `<UsageMeter compact>` for the 3-4 key metrics.

c) **Payment Management**: "Manage Payment Methods" button that calls POST to a new API route that creates a Stripe billing portal session and redirects. Wrapped in a check: if no Stripe configured, show "Contact admin" instead.

d) **Invoice History**: Table showing recent invoices. Fetch from a new `/api/billing/invoices` route. Columns: Date, Amount, Status (paid/pending/failed), PDF link. For now, return mock data.

**2. Create `/api/billing/portal/route.ts`** (NEW if not exists, or enhance)

POST endpoint:
- Authenticate user via Supabase
- Look up Stripe customer ID (from user metadata or a lookup table)
- Call `createBillingPortalSession(customerId, returnUrl)` from `src/lib/stripe/server.ts`
- Return `{ url }` for client redirect
- If Stripe not configured, return 503

**3. Create `/api/billing/invoices/route.ts`** (NEW)

GET endpoint:
- Authenticate user
- For now, return mock invoice data: `[{ id, date, amount, status, pdfUrl }]`
- Later: fetch from Stripe `stripe.invoices.list({ customer })`

**4. Enhance `src/app/(app)/settings/security/page.tsx`** (MODIFY)

Add sections below existing content:

a) **SSO/SAML Section**: Wrapped in `<FeatureGate featureKey="admin.sso">`.
- SSO Provider dropdown (Okta, Azure AD, Google Workspace, Custom SAML)
- "Configure SSO" button (links to admin settings or shows config modal)
- Status indicator (Not configured / Active / Error)

b) **MFA Enforcement**: Wrapped in `<FeatureGate featureKey="compliance.frameworks">` (enterprise only).
- Toggle: "Require MFA for all users"
- Description text explaining the policy

c) **API Keys Section**: Wrapped in `<FeatureGate featureKey="integrations.api">`.
- Table of API keys: Name, Key (masked), Created, Last Used, Actions (revoke)
- "Create API Key" button with name input modal
- For now, mock data

d) **IP Whitelisting**: Wrapped in `<FeatureGate featureKey="compliance.frameworks">` (enterprise only).
- Text area for allowed IP ranges (CIDR notation)
- "Save" button

**5. `src/app/(app)/settings/team/page.tsx`** (NEW)

Non-admin team view (read-only for non-admin users):

a) **Team Members List**: Table showing name, role badge, department badges, status. Fetch from `/api/admin/users` (same endpoint, but this page is read-only).

b) **Invite Section**: If user role is admin/owner, show "Invite Member" button (same flow as admin users page). If not, show "Ask your admin to invite team members."

c) **Department Overview**: Cards showing departments the current user belongs to (from tenant context or user metadata).

### Verification
- Settings → Billing shows plan card, usage meters, payment management button
- Settings → Security shows SSO section locked behind org plan, MFA behind enterprise
- Settings → Team shows team member list
- On personal plan, SSO/MFA/API sections show upgrade prompts
- `pnpm build` passes.

---

## Phase 6: Database Schema + Real Tenant Resolution

### What exists
- `sql-migrations/` directory with existing migrations (002-030 + flow-a/)
- `src/lib/supabase/server.ts` — `createClient()` for server-side Supabase
- `src/lib/auth.ts` — `getSession()`, `requireAuth()`
- `src/app/api/tenant/context/route.ts` — returns hardcoded DEFAULT, accepts `?plan=` and `?role=` overrides
- `src/contexts/tenant-context.tsx` — fetches from `/api/tenant/context`
- `middleware.ts` — Supabase auth + onboarding check
- `src/types/admin.ts` — `Tenant`, `Member`, `Role` types already defined

### What to build

**1. `sql-migrations/100_multi_tenant_schema.sql`** (NEW)

```sql
-- Enable UUID extension if not already
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domains TEXT[] DEFAULT '{}',
  plan TEXT NOT NULL DEFAULT 'personal' CHECK (plan IN ('personal','team','org','enterprise')),
  status TEXT NOT NULL DEFAULT 'trial' CHECK (status IN ('active','trial','suspended','disabled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tenant members (links auth.users to tenants)
CREATE TABLE IF NOT EXISTS tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'practitioner' CHECK (role IN ('owner','admin','manager','practitioner','readonly')),
  departments TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','invited','suspended')),
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- 3. Plan features (defines limits per plan)
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  limit_value INTEGER,  -- NULL means unlimited
  config JSONB DEFAULT '{}',
  UNIQUE(plan, feature_key)
);

-- 4. Tenant-specific feature flags (overrides)
CREATE TABLE IF NOT EXISTS tenant_feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  flag_key TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, flag_key)
);

-- 5. Tenant usage tracking
CREATE TABLE IF NOT EXISTS tenant_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  metric_key TEXT NOT NULL,
  value BIGINT NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, metric_key, period_start)
);

-- 6. Custom roles (for org+ plans)
CREATE TABLE IF NOT EXISTS custom_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  base_role TEXT NOT NULL CHECK (base_role IN ('owner','admin','manager','practitioner','readonly')),
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, name)
);

-- 7. Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  environment TEXT DEFAULT 'production' CHECK (environment IN ('production','staging','development')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenant_members_user ON tenant_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_members_tenant ON tenant_members(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_lookup ON tenant_usage(tenant_id, metric_key, period_start);
CREATE INDEX IF NOT EXISTS idx_tenant_feature_flags_tenant ON tenant_feature_flags(tenant_id);

-- RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only see their own tenants
CREATE POLICY tenant_members_own ON tenant_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY tenants_via_membership ON tenants FOR SELECT
  USING (id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY plan_features_public ON plan_features FOR SELECT
  USING (TRUE);  -- plan features are public config

CREATE POLICY tenant_flags_own ON tenant_feature_flags FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY tenant_usage_own ON tenant_usage FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY custom_roles_own ON custom_roles FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));

CREATE POLICY workspaces_own ON workspaces FOR SELECT
  USING (tenant_id IN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid()));
```

**2. `sql-migrations/100_seed_plan_features.sql`** (NEW)

Seed `plan_features` with limits from the architecture doc:
```sql
INSERT INTO plan_features (plan, feature_key, enabled, limit_value) VALUES
  -- Personal limits
  ('personal', 'users', true, 1),
  ('personal', 'connectors.count', true, 3),
  ('personal', 'ai.sessions', true, 1000),
  ('personal', 'storageGb', true, 5),
  ('personal', 'retentionDays', true, 7),
  -- Team limits
  ('team', 'users', true, 25),
  ('team', 'connectors.count', true, 15),
  ('team', 'ai.sessions', true, 10000),
  ('team', 'storageGb', true, 50),
  ('team', 'retentionDays', true, 30),
  -- Org limits
  ('org', 'users', true, 250),
  ('org', 'connectors.count', true, NULL),  -- unlimited
  ('org', 'ai.sessions', true, 50000),
  ('org', 'storageGb', true, 500),
  ('org', 'retentionDays', true, 90),
  -- Enterprise limits (all unlimited)
  ('enterprise', 'users', true, NULL),
  ('enterprise', 'connectors.count', true, NULL),
  ('enterprise', 'ai.sessions', true, NULL),
  ('enterprise', 'storageGb', true, NULL),
  ('enterprise', 'retentionDays', true, NULL)
ON CONFLICT (plan, feature_key) DO NOTHING;
```

**3. `src/lib/tenant.ts`** (NEW)

Server-side tenant resolution:

```typescript
import { SupabaseClient } from "@supabase/supabase-js"
import type { EntitlementTier, Role } from "@/config/os-shell-registry"

export type TenantContext = {
  tenantId: string
  tenantName: string
  plan: EntitlementTier
  role: Role
  featureFlags: string[]
  limits: Record<string, number | "unlimited">
  usage: Record<string, number>
}

export async function resolveTenantContext(supabase: SupabaseClient): Promise<TenantContext | null> {
  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // 2. Get tenant membership
  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id, role, tenants(id, name, slug, plan, status)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (!membership) return null

  const tenant = membership.tenants as any
  const plan = tenant.plan as EntitlementTier
  const role = membership.role as Role

  // 3. Get plan limits
  const { data: planFeatures } = await supabase
    .from("plan_features")
    .select("feature_key, limit_value")
    .eq("plan", plan)

  const limits: Record<string, number | "unlimited"> = {}
  for (const pf of planFeatures ?? []) {
    limits[pf.feature_key] = pf.limit_value === null ? "unlimited" : pf.limit_value
  }

  // 4. Get tenant feature flags
  const { data: flags } = await supabase
    .from("tenant_feature_flags")
    .select("flag_key")
    .eq("tenant_id", tenant.id)
    .eq("enabled", true)

  const featureFlags = (flags ?? []).map(f => f.flag_key)

  // 5. Get current usage (current month)
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]

  const { data: usageRows } = await supabase
    .from("tenant_usage")
    .select("metric_key, value")
    .eq("tenant_id", tenant.id)
    .eq("period_start", periodStart)

  const usage: Record<string, number> = {}
  for (const u of usageRows ?? []) {
    usage[u.metric_key] = Number(u.value)
  }

  return {
    tenantId: tenant.id,
    tenantName: tenant.name,
    plan,
    role,
    featureFlags,
    limits,
    usage,
  }
}
```

**4. Update `src/app/api/tenant/context/route.ts`** (MODIFY)

Replace hardcoded response with real resolution, falling back to demo data:

```typescript
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { resolveTenantContext } from "@/lib/tenant"
import type { EntitlementTier, Role } from "@/config/os-shell-registry"

const DEMO_DEFAULT = { /* keep existing DEFAULT object as fallback */ }

export async function GET(request: Request) {
  const url = new URL(request.url)
  const planOverride = url.searchParams.get("plan") as EntitlementTier | null
  const roleOverride = url.searchParams.get("role") as Role | null

  try {
    const supabase = await createClient()
    const ctx = await resolveTenantContext(supabase)

    if (ctx) {
      return NextResponse.json({
        ...ctx,
        ...(planOverride ? { plan: planOverride } : null),
        ...(roleOverride ? { role: roleOverride } : null),
      })
    }
  } catch (e) {
    console.warn("Tenant resolution failed, using demo fallback:", e)
  }

  // Fallback to demo data
  return NextResponse.json({
    ...DEMO_DEFAULT,
    ...(planOverride ? { plan: planOverride } : null),
    ...(roleOverride ? { role: roleOverride } : null),
  })
}
```

**5. Update `middleware.ts`** (MODIFY)

After the auth check (line 64), add tenant header injection:

```typescript
// After: if (!user) { redirect to login }

// Inject tenant context headers for downstream API routes
try {
  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single()

  if (membership) {
    response.headers.set("x-tenant-id", membership.tenant_id)
    response.headers.set("x-tenant-role", membership.role)
  }
} catch {
  // Non-blocking: if tenant lookup fails, continue without headers
}
```

**6. Seed migration for demo tenant** (`sql-migrations/100_seed_demo_tenant.sql`)

Create a demo tenant so existing demo logins continue working:

```sql
-- Create demo tenant
INSERT INTO tenants (id, name, slug, plan, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Acme Corp', 'acme-corp', 'team', 'active')
ON CONFLICT (slug) DO NOTHING;

-- Create default production workspace
INSERT INTO workspaces (tenant_id, name, slug, environment) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Production', 'production', 'production')
ON CONFLICT (tenant_id, slug) DO NOTHING;
```

### Verification
- Run migration against Supabase
- Create a test user + tenant_member row via SQL
- Login → `/api/tenant/context` returns real tenant data
- If no tenant_member exists, demo fallback still works
- Middleware sets `x-tenant-id` header on responses
- `pnpm build` passes.

---

## Phase 7: Server-Side API Enforcement + Usage Metering

### What exists
- `src/lib/auth.ts` — `getSession()`, `requireAuth()`
- `src/lib/audit.ts` — `logAuditEvent()` inserts to `audit_logs` table
- `src/lib/tenant.ts` from Phase 6 — `resolveTenantContext()`
- `src/lib/entitlements.ts` — `featureAccess()`, `isPlanAtLeast()`
- `src/lib/cache.ts` — in-memory cache with TTL
- `src/lib/supabase/server.ts` — `createClient()`, admin client
- `middleware.ts` sets `x-tenant-id` and `x-tenant-role` headers
- ~70 API routes under `src/app/api/`

### What to build

**1. `src/lib/api-guard.ts`** (NEW)

Composable wrapper for API route handlers:

```typescript
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { resolveTenantContext, type TenantContext } from "@/lib/tenant"
import { featureAccess, isPlanAtLeast } from "@/lib/entitlements"
import { logAuditEvent, extractClientInfo } from "@/lib/audit"
import type { EntitlementTier, Role } from "@/config/os-shell-registry"

type GuardOptions = {
  requiredRole?: Role[]
  requiredPlan?: EntitlementTier
  featureKey?: string
  auditAction?: string
}

type GuardedContext = {
  supabase: SupabaseClient
  tenant: TenantContext
  request: Request
}

type GuardedHandler = (ctx: GuardedContext) => Promise<NextResponse>

export function withTenantAuth(handler: GuardedHandler, options: GuardOptions = {}) {
  return async (request: Request): Promise<NextResponse> => {
    // 1. Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Tenant resolution
    const tenant = await resolveTenantContext(supabase)
    if (!tenant) {
      return NextResponse.json({ error: "No tenant found" }, { status: 403 })
    }

    // 3. Role check
    if (options.requiredRole && !options.requiredRole.includes(tenant.role)) {
      return NextResponse.json(
        { error: "Insufficient role", required: options.requiredRole },
        { status: 403 }
      )
    }

    // 4. Plan check
    if (options.requiredPlan && !isPlanAtLeast(tenant.plan, options.requiredPlan)) {
      return NextResponse.json(
        { error: "Plan upgrade required", requiredPlan: options.requiredPlan },
        { status: 403 }
      )
    }

    // 5. Feature check
    if (options.featureKey) {
      const access = featureAccess({
        plan: tenant.plan,
        featureFlags: tenant.featureFlags,
        featureKey: options.featureKey,
      })
      if (!access.hasAccess) {
        return NextResponse.json(
          { error: "Feature not available", reason: access.reason, requiredPlan: access.requiredPlan },
          { status: 403 }
        )
      }
    }

    // 6. Audit log (if configured)
    if (options.auditAction) {
      const clientInfo = extractClientInfo(request)
      logAuditEvent("", {
        actor_user_id: user.id,
        org_id: tenant.tenantId,
        action: options.auditAction,
        ip_address: clientInfo.ipAddress,
        user_agent: clientInfo.userAgent,
      })
    }

    // 7. Execute handler
    return handler({ supabase, tenant, request })
  }
}
```

**2. `src/lib/usage.ts`** (NEW)

Usage tracking and limit checking:

```typescript
import { SupabaseClient } from "@supabase/supabase-js"

export async function incrementUsage(
  supabase: SupabaseClient,
  tenantId: string,
  metricKey: string,
  amount: number = 1
): Promise<void> {
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

  // UPSERT: increment if exists, insert if not
  await supabase.rpc("increment_usage", {
    p_tenant_id: tenantId,
    p_metric_key: metricKey,
    p_amount: amount,
    p_period_start: periodStart,
    p_period_end: periodEnd,
  })
}

export async function checkUsageLimit(
  supabase: SupabaseClient,
  tenantId: string,
  plan: string,
  metricKey: string
): Promise<{ allowed: boolean; current: number; limit: number | null }> {
  // Get limit
  const { data: planFeature } = await supabase
    .from("plan_features")
    .select("limit_value")
    .eq("plan", plan)
    .eq("feature_key", metricKey)
    .single()

  const limit = planFeature?.limit_value ?? null  // null = unlimited

  if (limit === null) return { allowed: true, current: 0, limit: null }

  // Get current usage
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]

  const { data: usage } = await supabase
    .from("tenant_usage")
    .select("value")
    .eq("tenant_id", tenantId)
    .eq("metric_key", metricKey)
    .eq("period_start", periodStart)
    .single()

  const current = Number(usage?.value ?? 0)

  return { allowed: current < limit, current, limit }
}
```

**3. SQL function for atomic usage increment** — add to migration:

```sql
CREATE OR REPLACE FUNCTION increment_usage(
  p_tenant_id UUID,
  p_metric_key TEXT,
  p_amount BIGINT,
  p_period_start DATE,
  p_period_end DATE
) RETURNS VOID AS $$
BEGIN
  INSERT INTO tenant_usage (tenant_id, metric_key, value, period_start, period_end, updated_at)
  VALUES (p_tenant_id, p_metric_key, p_amount, p_period_start, p_period_end, NOW())
  ON CONFLICT (tenant_id, metric_key, period_start)
  DO UPDATE SET value = tenant_usage.value + p_amount, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

**4. Apply `withTenantAuth` to critical routes** (MODIFY)

Start with these high-value routes:

a) `/api/admin/tenants/route.ts`:
```typescript
export const GET = withTenantAuth(async ({ supabase, tenant }) => {
  // query tenants table
}, { requiredRole: ["owner", "admin"] })
```

b) `/api/admin/billing/route.ts` — guard with `requiredRole: ["owner", "admin"]`

c) `/api/ai/chat/route.ts` — add usage check:
```typescript
export const POST = withTenantAuth(async ({ supabase, tenant, request }) => {
  const usageCheck = await checkUsageLimit(supabase, tenant.tenantId, tenant.plan, "ai.sessions")
  if (!usageCheck.allowed) {
    return NextResponse.json({ error: "AI session limit exceeded", ...usageCheck }, { status: 429 })
  }
  await incrementUsage(supabase, tenant.tenantId, "ai.sessions")
  // ... existing chat logic
}, { featureKey: "ai.chat" })
```

d) `/api/connectors/*/route.ts` — check `connectors.count` limit on creation

e) `/api/audit/route.ts` — guard with `requiredPlan: "team"`

Migrate routes incrementally. Each route that isn't wrapped yet continues to work with demo behavior. Do NOT wrap all 70 routes at once — prioritize the ones above.

**5. Update `/api/admin/usage/route.ts`** (MODIFY)

Replace mock with real data using `withTenantAuth`:

```typescript
export const GET = withTenantAuth(async ({ supabase, tenant }) => {
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]

  const { data: usage } = await supabase
    .from("tenant_usage")
    .select("metric_key, value")
    .eq("tenant_id", tenant.tenantId)
    .eq("period_start", periodStart)

  return NextResponse.json({
    success: true,
    data: {
      period: periodStart,
      metrics: usage ?? [],
      limits: tenant.limits,
    }
  })
}, { requiredRole: ["owner", "admin"] })
```

### Verification
- Call `/api/admin/tenants` without auth → 401
- Call with non-admin role → 403
- Call `/api/ai/chat` until limit exceeded → 429 with usage info
- Check `tenant_usage` table shows incremented values
- Audit log captures guarded operations
- Unguarded routes still work with demo behavior
- `pnpm build` passes.

---

## Phase 8: Real Auth + SSO Backend

### What exists
- `src/app/api/auth/login/route.ts` — MOCK with hardcoded users
- `src/lib/auth.ts` — `signInWithPassword()`, `signUp()`, `signOut()` using Supabase
- `src/lib/admin-auth.ts` — cookie-based stub
- `middleware.ts` — Supabase auth check already works
- `src/app/(app)/settings/security/page.tsx` — SSO UI from Phase 5
- Supabase Auth already configured (env vars present)
- `src/app/api/webhooks/stripe/route.ts` — handles checkout.session.completed to update user with Stripe customer ID

### What to build

**1. Update `src/app/api/auth/login/route.ts`** (MODIFY)

Replace MOCK_USERS with real Supabase auth:

```typescript
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  // Look up tenant membership
  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id, role, tenants(name, plan)")
    .eq("user_id", data.user.id)
    .eq("status", "active")
    .single()

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || email.split("@")[0],
      role: membership?.role || "practitioner",
      tenantId: membership?.tenant_id || null,
    },
    session: { access_token: data.session?.access_token },
  })
}
```

**2. Create `src/app/api/auth/signup/route.ts`** (NEW or MODIFY if exists)

```typescript
export async function POST(request: Request) {
  const { email, password, name, tenantName } = await request.json()

  const supabase = await createClient()

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, onboarding_complete: false } },
  })
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

  // 2. Create tenant (using admin client to bypass RLS)
  const adminSupabase = createAdminClient()
  const slug = tenantName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const { data: tenant, error: tenantError } = await adminSupabase
    .from("tenants")
    .insert({ name: tenantName, slug, plan: "personal", status: "trial" })
    .select()
    .single()

  if (tenantError) return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 })

  // 3. Create tenant membership (owner)
  await adminSupabase.from("tenant_members").insert({
    tenant_id: tenant.id,
    user_id: authData.user!.id,
    role: "owner",
    status: "active",
  })

  // 4. Create default workspace
  await adminSupabase.from("workspaces").insert({
    tenant_id: tenant.id,
    name: "Production",
    slug: "production",
    environment: "production",
  })

  return NextResponse.json({
    user: { id: authData.user!.id, email },
    tenant: { id: tenant.id, name: tenantName },
  })
}
```

**3. Update `src/lib/admin-auth.ts`** (MODIFY)

Replace cookie-based stub:

```typescript
import { createClient } from "@/lib/supabase/server"

export async function verifyAdminSession(): Promise<{ userId: string; tenantId: string; role: string } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: membership } = await supabase
    .from("tenant_members")
    .select("tenant_id, role")
    .eq("user_id", user.id)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
    .single()

  if (!membership) return null

  return { userId: user.id, tenantId: membership.tenant_id, role: membership.role }
}

export async function requireAdmin() {
  const session = await verifyAdminSession()
  if (!session) throw new Error("Admin access required")
  return session
}
```

**4. `src/app/api/auth/sso/route.ts`** (NEW)

SSO initiation for org+ plans:

```typescript
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { domain } = await request.json()

  const supabase = await createClient()

  // Supabase handles SAML SSO via signInWithSSO
  const { data, error } = await supabase.auth.signInWithSSO({ domain })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ url: data.url })
}
```

Note: This requires SAML provider configuration in Supabase dashboard (Settings → Authentication → SSO). The actual SAML provider setup (Okta, Azure AD, etc.) is done through Supabase CLI or dashboard, not in application code.

**5. Create `/api/auth/invite/route.ts`** (NEW)

Invite a user to a tenant:

```typescript
export async function POST(request: Request) {
  // 1. Verify caller is admin/owner via withTenantAuth
  // 2. Create auth user with generateLink (invite)
  // 3. Insert tenant_member with status: "invited"
  // 4. Send invite email (via Supabase invite or custom)
}
```

Use `withTenantAuth` with `requiredRole: ["owner", "admin"]`.

**6. Update onboarding flow**

Update `src/app/(app)/onboarding/` to:
- Create tenant + workspace on completion (if not exists)
- Set `onboarding_complete: true` in user metadata
- Insert first `tenant_member` row with role `"owner"`

### Verification
- Sign up new account → tenant created → redirected to onboarding
- Login with real credentials → session established → tenant context loaded
- Admin auth rejects non-admin users
- SSO endpoint returns SAML redirect URL (if configured)
- Invite creates pending tenant_member
- `pnpm build` passes.

---

## Phase Summary

| Phase | Focus | Key Deliverables | Dependencies |
|-------|-------|-----------------|-------------|
| 1 | Paywall UI Components | FeatureGate, UpgradePrompt, UsageMeter, PlanBadge, plan-tiers.ts | None |
| 2 | Pricing Page | /upgrade page, PlanComparisonTable, Stripe checkout wiring | Phase 1 |
| 3 | Admin Pages | Billing, Usage, Roles, Features pages (real UI, mock data) | Phase 1 |
| 4 | OS Shell Gating | Lock icons, world gating, dept gating, plan switcher | Phase 1 |
| 5 | Settings Pages | Billing settings, SSO UI, API keys UI, Team page | Phase 1-4 |
| 6 | Database Schema | SQL migration, real tenant resolution, middleware headers | Phase 1-5 UI done |
| 7 | API Enforcement | withTenantAuth, usage metering, server-side guards | Phase 6 |
| 8 | Real Auth + SSO | Real login, signup with tenant creation, SSO backend | Phase 6-7 |
