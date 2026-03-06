# UI Comparison Analysis: Next.js vs Vite

## Executive Summary

| Aspect | Next.js (integratewise-complete) | Vite (business-operations-design) |
|--------|-----------------------------------|-----------------------------------|
| **Files** | 916 TSX/TS | 226 TSX/TS |
| **Framework** | Next.js 14+ App Router | Vite + React |
| **Styling** | Tailwind v3 + CSS Variables | Tailwind v4 + CSS Variables |
| **Theme** | Navy (#2D4A7C) + Light/Dark | Emerald + Gray Dark |
| **Fonts** | System fonts | Plus Jakarta Sans + JetBrains Mono |
| **Animation** | Framer Motion | Framer Motion (heavier use) |
| **Backend** | Full API + Middleware | None |
| **Auth** | Supabase Auth | Supabase Auth (client-only) |
| **Landing** | Basic redirect | Rich marketing site |
| **Onboarding** | 4-step (Identity→Context→Connect→Spine) | 4-step (Role→Integration→Upload→Accelerator) |

---

## Detailed Component Comparison

### 1. Design System

#### Next.js
```css
/* Primary: Navy Blue - IntegrateWise Brand */
--primary: #2D4A7C;
--primary-foreground: #FFFFFF;

/* Domain Tokens */
--iw-website: #00bcd4;
--iw-marketing: #e91e63;
--iw-sales: #2196f3;
--iw-ops: #ff9800;
--iw-cs: #4caf50;
```

#### Vite
```css
/* Custom Fonts */
font-family: 'Plus Jakarta Sans', sans-serif;
font-family: 'JetBrains Mono', monospace;

/* Visual Style */
- Heavy use of gradients (bg-gradient-to-b)
- Large blur effects (blur-[150px])
- Glow effects (shadow-[0_20px_60px...])
- Crisis-themed design (red alerts, warnings)
```

**Winner**: Vite has more polished visual design
**Action**: Merge Vite's visual patterns into Next.js

---

### 2. Onboarding Flow

#### Next.js (`onboarding-flow.tsx`)
```
Step 1: Identity (Name + Role)
Step 2: Context (CTX selection: BIZOPS, CS, SALES, MARKETING)
Step 3: Connect (6 connectors: Salesforce, HubSpot, etc.)
Step 4: Spine (Initialization)
```
**Features**:
- Background glow effects
- Progress stepper
- Dark theme
- Form validation

#### Vite (`onboarding-flow-new.tsx`)
```
Step 1: Role & Domain (10 domains: CS, Sales, RevOps, Marketing, etc.)
Step 2: Integration (3 categories: CRM, Task, Workspace)
Step 3: Upload Files (2-10MB, Markdown/Doc/Txt/CSV)
Step 4: Accelerator (department-specific, payment gated)
→ Then: Loader Phase 1 → Workspace
```
**Features**:
- Rich domain selection with icons
- Integration categories
- File upload support
- Accelerator selection
- Role-domain modules

**Winner**: Vite has richer UX and more domains
**Action**: Merge Vite's steps with Next.js backend

---

### 3. Landing Page

#### Next.js (`page.tsx`)
```typescript
export default function HomePage() {
  redirect("/today")  // Just redirects!
}
```
**Status**: ❌ No landing page

#### Vite (Full landing site)
```
components/landing/
├── Hero.tsx              # Crisis-themed hero
├── Navbar.tsx            # Navigation
├── Problem.tsx           # Problem statement
├── Pillars.tsx           # Key pillars
├── Audience.tsx          # Target audience
├── Comparison.tsx        # Competitor comparison
├── Differentiators.tsx   # Unique selling points
├── Integrations.tsx      # Tool integrations
├── Pricing.tsx           # Pricing table
├── Footer.tsx            # Footer
├── FounderStory.tsx      # Founder narrative
└── [+ 10 more pages]
```

**Winner**: Vite has complete marketing site
**Action**: Migrate all landing components to Next.js

---

### 4. L1 Workspace Modules

#### Next.js (Complete - 15 modules)
```
app/(app)/
├── personal/          # Personal workspace
├── cs/               # Customer Success
├── sales/            # Sales
├── marketing/        # Marketing
├── ops/              # Operations
├── engineering/      # Engineering
├── finance/          # Finance
├── people/           # People/HR
├── projects/         # Projects
├── business/         # Business
└── [5 more...]
```

Each module has:
- Home page
- Domain-specific views
- L2 cognitive access
- Full RBAC integration

#### Vite (Design-focused)
```
components/
├── domains/
│   ├── account-success/    # Rich CS views
│   ├── personal/          # Personal views
│   ├── revops/           # Revenue Ops
│   └── salesops/         # Sales Ops
├── workspace/
│   └── workspace-shell-new.tsx
└── business-ops/
    └── [various views]
```

**Winner**: Next.js has more modules, Vite has better design
**Action**: Enhance Next.js modules with Vite's visual design

---

### 5. L2 Cognitive Components

#### Next.js (Complete implementation)
```
app/(app)/
├── spine/           # SpineUI
├── context/         # ContextUI
├── iq-hub/          # KnowledgeUI
├── evidence/        # Evidence
├── signals/         # Signals
├── think/           # Think
├── act/             # Act
├── govern/          # Govern/HITL
├── adjust/          # Adjust
└── [+ 4 more...]
```

Each has:
- Full page implementation
- API integration
- Real data connection

#### Vite (Partial/Design)
```
components/
├── spine/
│   └── spine-client.tsx
├── intelligence-overlay-new.tsx
├── intelligence-drawer.tsx
└── [limited implementation]
```

**Winner**: Next.js has complete L2
**Action**: Keep Next.js, enhance UI with Vite patterns

---

### 6. UI Component Library

Both use shadcn/ui with similar components:

| Component | Next.js | Vite | Notes |
|-----------|---------|------|-------|
| Button | ✅ | ✅ | Similar |
| Card | ✅ | ✅ | Similar |
| Dialog | ✅ | ✅ | Similar |
| Input | ✅ | ✅ | Similar |
| Table | ✅ | ✅ | Similar |
| Chart | ✅ | ✅ | Recharts |
| Empty States | ✅ Custom | ✅ Custom | Different designs |
| Loading | ✅ | ✅ | Vite has more variants |

**Winner**: Tie - both have good foundations
**Action**: Consolidate into `packages/ui`

---

### 7. Styling Approach

#### Next.js
- Tailwind v3
- CSS Variables in `:root`
- HSL color format
- Navy primary brand
- System fonts

#### Vite
- Tailwind v4 (newer)
- CSS Variables with `@layer theme`
- Hex color format
- Emerald/emerald success theme
- Custom fonts (Plus Jakarta Sans)

**Winner**: Vite has more modern Tailwind
**Action**: Upgrade Next.js to Tailwind v4, merge Vite fonts

---

## Migration Priority Matrix

### P0: Critical (Must Migrate)

| Component | Source | Effort | Impact |
|-----------|--------|--------|--------|
| Landing pages | Vite | High | 🔴 Critical |
| Onboarding flow | Vite | High | 🔴 Critical |
| Global styles | Vite | Medium | 🔴 Critical |
| Fonts | Vite | Low | 🟡 High |

### P1: High Priority

| Component | Source | Effort | Impact |
|-----------|--------|--------|--------|
| UI components | Both | Medium | 🟡 High |
| Domain views | Vite | Medium | 🟡 High |
| Animations | Vite | Low | 🟢 Medium |

### P2: Nice to Have

| Component | Source | Effort | Impact |
|-----------|--------|--------|--------|
| Marketing components | Vite | Low | 🟢 Medium |
| Utility components | Next.js | Low | 🟢 Low |

---

## Recommended Consolidation Strategy

### Step 1: Foundation (Week 1)
1. Create `packages/ui` with Vite's component base
2. Upgrade Next.js to Tailwind v4
3. Merge Vite's fonts and CSS variables
4. Set up shared theme system

### Step 2: Landing & Marketing (Week 1-2)
1. Migrate all landing components to Next.js
2. Create proper `page.tsx` with full landing site
3. Update routing logic (show landing for unauthenticated)

### Step 3: Onboarding (Week 2)
1. Merge Vite's onboarding flow steps
2. Integrate with Next.js API/backend
3. Add file upload functionality
4. Connect role-domain modules

### Step 4: Enhancement (Week 3)
1. Enhance L1 modules with Vite's visual design
2. Improve L2 component styling
3. Add Vite's animation patterns

### Step 5: Cleanup (Week 4)
1. Remove Vite app
2. Flatten structure
3. Test all flows
4. Deploy

---

## Key Differences Summary

| Feature | Next.js | Vite | Keep |
|---------|---------|------|------|
| Backend/API | ✅ Full | ❌ None | Next.js |
| Auth/Security | ✅ Complete | ⚠️ Client-only | Next.js |
| RBAC | ✅ 40+ admin pages | ❌ None | Next.js |
| Multi-tenant | ✅ Middleware | ❌ None | Next.js |
| Landing/Marketing | ❌ None | ✅ Complete | Vite |
| Visual Design | ⚠️ Basic | ✅ Polished | Vite |
| Onboarding UX | ⚠️ Simple | ✅ Rich | Vite |
| L1 Modules | ✅ 15 modules | ⚠️ Partial | Next.js |
| L2 Cognitive | ✅ Complete | ⚠️ Partial | Next.js |
| Fonts/Typography | ⚠️ System | ✅ Custom | Vite |
| Animations | ⚠️ Basic | ✅ Rich | Vite |

---

## Final Verdict

**Next.js = 70%** (Backend, Auth, RBAC, Multi-tenant, L1/L2 modules)
**Vite = 30%** (Landing, Marketing, Visual Design, Onboarding UX)

**Strategy**: Keep Next.js framework, extract Vite's visual layer, merge onboarding.
