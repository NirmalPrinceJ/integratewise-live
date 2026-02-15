# Implementation Roadmap

## Phase 1: UI Package Extraction (Days 1-3)

### Step 1.1: Create packages/ui Structure

```bash
mkdir -p packages/ui/{components,hooks,lib,styles}
cd packages/ui
pnpm init
```

### Step 1.2: Migrate shadcn Components

**From Vite**: `apps/business-operations-design/src/components/ui/`
**To**: `packages/ui/components/ui/`

Components to migrate:
```
accordion.tsx       → packages/ui/components/ui/accordion.tsx
alert-dialog.tsx    → packages/ui/components/ui/alert-dialog.tsx
alert.tsx           → packages/ui/components/ui/alert.tsx
aspect-ratio.tsx    → packages/ui/components/ui/aspect-ratio.tsx
avatar.tsx          → packages/ui/components/ui/avatar.tsx
badge.tsx           → packages/ui/components/ui/badge.tsx
button.tsx          → packages/ui/components/ui/button.tsx
calendar.tsx        → packages/ui/components/ui/calendar.tsx
card.tsx            → packages/ui/components/ui/card.tsx
carousel.tsx        → packages/ui/components/ui/carousel.tsx
chart.tsx           → packages/ui/components/ui/chart.tsx
checkbox.tsx        → packages/ui/components/ui/checkbox.tsx
command.tsx         → packages/ui/components/ui/command.tsx
dialog.tsx          → packages/ui/components/ui/dialog.tsx
drawer.tsx          → packages/ui/components/ui/drawer.tsx
dropdown-menu.tsx   → packages/ui/components/ui/dropdown-menu.tsx
form.tsx            → packages/ui/components/ui/form.tsx
input.tsx           → packages/ui/components/ui/input.tsx
label.tsx           → packages/ui/components/ui/label.tsx
popover.tsx         → packages/ui/components/ui/popover.tsx
scroll-area.tsx     → packages/ui/components/ui/scroll-area.tsx
select.tsx          → packages/ui/components/ui/select.tsx
sheet.tsx           → packages/ui/components/ui/sheet.tsx
sidebar.tsx         → packages/ui/components/ui/sidebar.tsx
sonner.tsx          → packages/ui/components/ui/sonner.tsx
table.tsx           → packages/ui/components/ui/table.tsx
tabs.tsx            → packages/ui/components/ui/tabs.tsx
tooltip.tsx         → packages/ui/components/ui/tooltip.tsx
... (and more)
```

### Step 1.3: Migrate Landing Components

**From Vite**: `apps/business-operations-design/src/components/landing/`
**To**: `packages/ui/components/landing/`

```
Hero.tsx              → packages/ui/components/landing/Hero.tsx
Navbar.tsx            → packages/ui/components/landing/Navbar.tsx
Pricing.tsx           → packages/ui/components/landing/Pricing.tsx
Problem.tsx           → packages/ui/components/landing/Problem.tsx
Footer.tsx            → packages/ui/components/landing/Footer.tsx
Integrations.tsx      → packages/ui/components/landing/Integrations.tsx
Comparison.tsx        → packages/ui/components/landing/Comparison.tsx
Differentiators.tsx   → packages/ui/components/landing/Differentiators.tsx
Audience.tsx          → packages/ui/components/landing/Audience.tsx
Pillars.tsx           → packages/ui/components/landing/Pillars.tsx
TechnicalPage.tsx     → packages/ui/components/landing/TechnicalPage.tsx
... (and more)
```

### Step 1.4: Update Tailwind Config

Create `packages/ui/styles/globals.css` that merges both apps' styles.

---

## Phase 2: Onboarding Merge (Days 4-5)

### Current State

**Next.js**: `apps/web/app/onboarding/page.tsx` (basic)
**Vite**: `apps/business-operations-design/src/components/onboarding/onboarding-flow-new.tsx` (rich)

### Target Structure

```typescript
// apps/web/app/onboarding/page.tsx
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
```

```typescript
// apps/web/components/onboarding/OnboardingFlow.tsx
// Merged implementation with:
// - Next.js: Data handling, API calls, auth
// - Vite: Visual design, animations, step flow

const STEPS = [
  { id: "entry", component: EntryStep },           // Name + AI Insights
  { id: "demo", component: LoaderDemoStep },       // AI Loader Demo
  { id: "context", component: ContextStep },       // Role-Domain selection
  { id: "connect", component: ToolConnectStep },   // Tool connection
];
```

### Role-Domain Modules

**From Vite**: `apps/business-operations-design/src/components/onboarding/role-domain/`
**To**: `apps/web/components/onboarding/role-domain/`

```
role-domain/
├── account-success/
│   └── modules.ts
├── business-ops/
│   └── modules.ts
├── marketing/
│   └── modules.ts
├── revops/
│   └── modules.ts
└── salesops/
    └── modules.ts
```

---

## Phase 3: Landing Page Migration (Days 6-7)

### Current State

**Next.js**: `apps/web/app/page.tsx` (basic)
**Vite**: Full landing page in `App.tsx`

### Migration Plan

Replace `apps/web/app/page.tsx`:

```typescript
import {
  Navbar,
  Hero,
  Problem,
  Pillars,
  Audience,
  Comparison,
  Differentiators,
  Integrations,
  Pricing,
  Footer,
} from "@integratewise/ui/landing";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Problem />
      <Pillars />
      <Audience />
      <Comparison />
      <Differentiators />
      <Integrations />
      <Pricing />
      <Footer />
    </main>
  );
}
```

---

## Phase 4: Admin & Connectors Enhancement (Days 8-10)

### Connectors Page

**Current Next.js**: `apps/web/app/(app)/admin/connectors/page.tsx`
**Enhance with**: Vite's `integrations-hub.tsx` design

```typescript
// Enhanced connectors page with:
// - Visual hub layout (from Vite)
// - OAuth flow handling (from Next.js)
// - Status indicators (from Next.js)
// - Tool categories (from Vite)
```

### Accelerators Page

**Current**: `apps/web/app/(app)/admin/predictions/page.tsx`
**Enhance**: Better visual design from Vite patterns

---

## Phase 5: Testing & Cleanup (Days 11-14)

### Testing Checklist

- [ ] All L0 onboarding steps work
- [ ] All L1 modules render correctly
- [ ] All L2 components function
- [ ] Landing page renders
- [ ] Auth flows work
- [ ] Admin panel accessible
- [ ] RBAC permissions enforced
- [ ] Multi-tenant isolation works
- [ ] API routes respond
- [ ] E2E tests pass

### Cleanup Tasks

- [ ] Remove `apps/business-operations-design/`
- [ ] Remove `apps/frontend-figma/`
- [ ] Update root README.md
- [ ] Verify `integratewise-complete/` merge
- [ ] Flatten structure (final step)

---

## File Mapping Reference

### Critical Files to Migrate

| Vite Path | Next.js Path | Priority |
|-----------|--------------|----------|
| `components/onboarding/onboarding-flow-new.tsx` | `components/onboarding/OnboardingFlow.tsx` | P0 |
| `components/onboarding/role-domain/**` | `components/onboarding/role-domain/**` | P0 |
| `components/landing/**` | `packages/ui/components/landing/**` | P0 |
| `components/ui/**` | `packages/ui/components/ui/**` | P1 |
| `components/spine/**` | `components/spine/**` | P1 |
| `components/goal-framework/**` | `components/goal-framework/**` | P1 |
| `components/hydration/**` | `components/hydration/**` | P1 |
| `components/workspace/**` | `components/workspace/**` | P1 |
| `index.css` | `packages/ui/styles/globals.css` | P1 |

---

## Commands to Run

```bash
# 1. Setup packages/ui
mkdir -p packages/ui && cd packages/ui
pnpm init

# 2. Copy components
cp -r ../../apps/business-operations-design/src/components/ui/* ./components/ui/
cp -r ../../apps/business-operations-design/src/components/landing/* ./components/landing/

# 3. Install dependencies
pnpm add framer-motion lucide-react clsx tailwind-merge

# 4. Update imports in migrated files
# Replace: "@/components/ui/" → "@integratewise/ui/components/ui/"
# Replace: "figma:" → proper asset imports

# 5. Build packages/ui
pnpm build

# 6. Update apps/web to use packages
# Add to apps/web/package.json:
# "@integratewise/ui": "workspace:*"

# 7. Test
pnpm dev
```

---

## Success Criteria

- [ ] Single Next.js app runs all features
- [ ] No Vite dependencies remain
- [ ] All 15 L1 modules functional
- [ ] All 14 L2 components accessible
- [ ] L0 onboarding 4-stage flow works
- [ ] Landing page matches design
- [ ] RBAC enforces permissions
- [ ] Multi-tenant isolation verified
- [ ] All platforms (web/desktop/mobile) build
- [ ] CI/CD pipeline passes
