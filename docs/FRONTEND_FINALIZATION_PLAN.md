# IntegrateWise Frontend Finalization Plan

## Executive Summary

We have **two frontend implementations** that need consolidation:
1. **Next.js (integratewise-complete/apps/web)** - Full-stack, production-ready
2. **Vite + React (business-operations-design)** - Design system, component library

**Decision**: Use Next.js as the primary framework, extract design system components from Vite app.

---

## Current State Analysis

### 1. Next.js App (integratewise-complete/apps/web)

#### ✅ Strengths
- **Full-stack**: API routes, SSR, middleware
- **Complete L0-L3 implementation**: All cognitive layers present
- **Multi-tenant**: Middleware handles tenant context
- **RBAC**: Role-based access control integrated
- **Auth**: Supabase Auth with middleware protection
- **Admin**: Comprehensive admin panel (40+ pages)
- **Multi-platform support**: Web, Desktop (Electron), Mobile (Expo)
- **Production deployment**: Cloudflare Workers, CI/CD

#### 📁 Architecture
```
app/
├── (app)/                    # Protected routes
│   ├── [role]/               # Role-based workspaces
│   │   ├── home/            # L1: Workspace Home
│   │   ├── spine/           # L2: SpineUI
│   │   ├── context/         # L2: ContextUI
│   │   ├── iq-hub/          # L2: KnowledgeUI
│   │   ├── evidence/        # L2: Evidence
│   │   ├── signals/         # L2: Signals
│   │   ├── think/           # L2: Think
│   │   ├── act/             # L2: Act
│   │   ├── govern/          # L2: Govern/HITL
│   │   ├── adjust/          # L2: Adjust
│   │   └── ...
│   ├── admin/               # Admin panel (comprehensive)
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── auth/                    # Auth pages
├── onboarding/              # L0: Onboarding
└── page.tsx                 # Landing page
```

#### 🎯 L0-L2 Coverage

| Layer | Implementation Status |
|-------|----------------------|
| **L0: Onboarding** | ✅ Complete (4-stage flow) |
| **L1: Workspace** | ✅ 15 modules implemented |
| **L2: Cognitive** | ✅ All 14 components present |

### 2. Vite App (business-operations-design)

#### ✅ Strengths
- **Design system**: Comprehensive UI components
- **Figma integration**: Direct Figma asset imports
- **Landing pages**: Marketing site components
- **Component library**: Rich set of UI primitives

#### ⚠️ Limitations
- **No SSR**: Client-side only
- **No API routes**: Static frontend only
- **Limited backend integration**: No middleware
- **No multi-tenancy**: Single-tenant architecture

---

## Consolidation Strategy

### Phase 1: Extract Design System (Week 1)

Move Vite app's UI components to Next.js:

```
packages/ui/                  # NEW: Shared UI library
├── components/              # From Vite app
│   ├── landing/            # Marketing components
│   ├── ui/                 # shadcn/ui primitives
│   └── shared/             # Shared utilities
├── hooks/                  # React hooks
├── lib/                    # Utilities
└── styles/                 # Global styles, themes
```

**Components to extract:**
- Landing page sections (Hero, Pricing, etc.)
- UI primitives (enhanced shadcn components)
- Animation components (framer-motion)
- Figma asset integration

### Phase 2: Merge L0 Onboarding (Week 1)

**Next.js has**: Basic onboarding page
**Vite has**: Rich onboarding-flow-new.tsx with role-domain selection

**Action**: Enhance Next.js onboarding with Vite's design

```typescript
// apps/web/app/onboarding/page.tsx (enhanced)
- 4-stage onboarding flow
- AI personality analysis
- Tool connection UI
- Context selection (Productivity Hub vs CS Platform)
- Role-domain modules from Vite
```

### Phase 3: Unified Component Architecture (Week 2)

Create consistent patterns:

```typescript
// Component Pattern
interface L1ModuleProps {
  tenantId: string;
  userId: string;
  role: UserRole;
  domain: Domain;
}

// All L1 modules follow this pattern
```

---

## Final Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14+ (App Router) |
| **Language** | TypeScript 5+ |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Animation** | Framer Motion |
| **State** | Zustand + React Query |
| **Auth** | Supabase Auth |
| **Database** | Neon PostgreSQL |
| **API** | Next.js API Routes + tRPC |
| **Deployment** | Cloudflare Pages |
| **Desktop** | Electron (Tauri future) |
| **Mobile** | Expo (React Native) |

### Directory Structure (Final)

```
integratewise-live/
├── apps/
│   ├── web/                    # Primary Next.js app
│   │   ├── app/
│   │   │   ├── (app)/         # Protected workspace
│   │   │   ├── api/           # API routes
│   │   │   ├── auth/          # Auth pages
│   │   │   ├── onboarding/    # L0
│   │   │   └── page.tsx       # Landing
│   │   ├── components/        # App-specific components
│   │   ├── hooks/             # App hooks
│   │   ├── lib/               # Utilities
│   │   └── middleware.ts      # Auth/Tenant/RBAC
│   │
│   ├── desktop/               # Electron app
│   │   ├── src/
│   │   │   ├── main/         # Main process
│   │   │   └── preload/      # Preload scripts
│   │   └── package.json
│   │
│   └── mobile/                # Expo app
│       ├── app/              # Expo Router
│       └── package.json
│
├── packages/
│   ├── ui/                    # Shared UI library
│   │   ├── components/       # React components
│   │   ├── hooks/            # Shared hooks
│   │   └── styles/           # Tailwind config
│   │
│   ├── connectors/            # Tool integrations
│   ├── accelerators/          # Domain intelligence
│   ├── rbac/                  # RBAC system
│   ├── tenancy/               # Multi-tenant utilities
│   ├── auth/                  # Auth utilities
│   ├── config/                # Shared config
│   ├── types/                 # Shared types
│   └── lib/                   # Shared utilities
│
├── services/                  # Backend services
│   ├── act/                  # Act engine
│   ├── think/                # Think engine
│   ├── govern/               # Governance
│   ├── loader/               # 8-stage pipeline
│   ├── spine/                # SSOT service
│   └── ...
│
├── infra/                     # Infrastructure
│   ├── deploy/               # Deployment scripts
│   ├── terraform/            # IaC (future)
│   └── configs/              # Environment configs
│
└── docs/                     # Documentation
```

---

## L0-L1-L2 Component Matrix

### L0: Onboarding

| Component | Next.js | Vite | Status |
|-----------|---------|------|--------|
| Entry + AI Insights | ✅ Basic | ✅ Rich | **Merge** |
| AI Loader Demo | ✅ | ❌ | Keep |
| Context Selection | ✅ | ✅ Role-domain | **Merge** |
| Tool Connect | ✅ | ✅ Design | **Merge** |
| First Hydration | ✅ | ❌ | Keep |

### L1: Workspace Modules (15 modules)

| Module | Next.js | Vite | Final |
|--------|---------|------|-------|
| Home | ✅ | ✅ | Next.js + Vite design |
| Accounts | ✅ | ✅ | Next.js + Vite design |
| Contacts | ✅ | ✅ | Next.js + Vite design |
| Meetings | ✅ | ❌ | Keep |
| Docs | ✅ | ❌ | Keep |
| Tasks | ✅ | ✅ | Next.js + Vite design |
| Calendar | ✅ | ✅ | Next.js + Vite design |
| Notes | ✅ | ❌ | Keep |
| Knowledge Space | ✅ | ❌ | Keep |
| Team | ✅ | ❌ | Keep |
| Pipeline | ✅ | ❌ | Keep |
| Risks | ✅ | ✅ | Next.js + Vite design |
| Expansion | ✅ | ❌ | Keep |
| Analytics | ✅ | ✅ | Next.js + Vite design |

### L2: Cognitive Components (14 components)

| Component | Next.js | Vite | Status |
|-----------|---------|------|--------|
| SpineUI | ✅ | ✅ | **Merge design** |
| ContextUI | ✅ | ❌ | Keep |
| KnowledgeUI | ✅ | ❌ | Keep |
| Evidence | ✅ | ❌ | Keep |
| Signals | ✅ | ❌ | Keep |
| Think | ✅ | ❌ | Keep |
| Act | ✅ | ❌ | Keep |
| HITL | ✅ | ❌ | Keep |
| Govern | ✅ | ❌ | Keep |
| Adjust | ✅ | ❌ | Keep |
| Repeat | ✅ | ❌ | Keep |
| AuditUI | ✅ | ❌ | Keep |
| AgentConfig | ✅ | ❌ | Keep |
| DigitalTwin | ✅ | ❌ | Keep |

---

## Key Features Analysis

### 1. Connectors Page

**Next.js Implementation**:
- Route: `/app/(app)/admin/connectors/page.tsx`
- API: `/app/api/connectors/route.ts`
- Features: OAuth, status, sync

**Vite Implementation**:
- Component: `integrations-hub.tsx`
- Features: Visual hub, tool cards

**Final**: Merge Vite's visual design into Next.js connector management

### 2. Accelerators

**Next.js Implementation**:
- Package: `packages/accelerators/`
- API: `/app/api/accelerators/`
- UI: `/app/(app)/admin/predictions/`

**Vite Implementation**:
- No equivalent

**Final**: Keep Next.js implementation, enhance UI

### 3. RBAC System

**Next.js Implementation**:
```
packages/rbac/
├── src/
│   ├── roles.ts           # Role definitions
│   ├── permissions.ts     # Permission matrix
│   └── checks.ts          # Access checks
├── hooks/use-rbac.ts
└── sql-migrations/031_rbac_system.sql
```

**Admin UI**:
- `/app/(app)/admin/rbac-manager/page.tsx`
- `/app/(app)/admin/roles/page.tsx`
- `/app/(app)/admin/permissions/page.tsx`

**Status**: ✅ Complete and production-ready

### 4. Tenant Control

**Next.js Implementation**:
```
packages/tenancy/
├── src/
│   ├── tenant-context.tsx
│   ├── tenant-guard.tsx
│   └── utils.ts
```

**Middleware**: `middleware.ts` handles tenant isolation

**Admin UI**:
- `/app/(app)/admin/tenancy/page.tsx`
- `/app/(app)/admin/provisioning/page.tsx`

**Status**: ✅ Complete with RLS enforcement

### 5. Multi-Platform Support

| Platform | Framework | Status |
|----------|-----------|--------|
| **Web** | Next.js | ✅ Production |
| **Desktop** | Electron | ✅ Ready |
| **Mobile** | Expo | ✅ Ready |

**Shared Code**: All platforms use `packages/*` for core logic

### 6. Multi-Provider Support

**Auth Providers**:
- Supabase Auth (primary)
- Google OAuth
- Email/Password

**AI Providers**:
- OpenRouter (multi-model)
- Anthropic Claude
- OpenAI GPT

**Tool Providers** (Connectors):
- Salesforce
- HubSpot
- Slack
- Notion
- 20+ more

### 7. Configs

**Next.js Config Structure**:
```
configs/
├── root/
│   ├── firebase.json
│   ├── turbo.json
│   └── ...
├── templates/
│   └── environment templates
└── scripts/
    └── config generation
```

**Environment Management**:
- `.env.local` (local)
- `.env.development`
- `.env.staging`
- `.env.production`

### 8. Auth System

**Implementation**:
- Supabase Auth
- Middleware protection
- JWT tokens
- Session management
- MFA ready

**Pages**:
- `/auth/login`
- `/auth/sign-up`
- `/auth/callback`
- `/auth/error`

**Status**: ✅ Complete

### 9. Admin Panel

**40+ Admin Pages**:
- User management
- Role/permission management
- Tenant management
- Connector management
- Audit logs
- System observability
- Release management
- Feature flags

**Status**: ✅ Comprehensive

### 10. Release Control System

**Implementation**:
```
.github/workflows/
├── deploy.yml              # Main deployment
└── cloudflare-pages-deploy.md

scripts/
├── deploy.sh
├── deployment/
│   └── verify-deployment.mjs
└── deploy-adaptive-spine.sh
```

**Admin UI**:
- `/app/(app)/admin/releases/page.tsx`

**Features**:
- GitHub Actions CI/CD
- Staging/Production environments
- Deployment verification
- Rollback capability

**Status**: ✅ Production-ready

---

## Action Items

### Week 1: Foundation

- [ ] Create `packages/ui/` from Vite components
- [ ] Merge onboarding flows
- [ ] Set up shared component library
- [ ] Configure Turborepo properly

### Week 2: Consolidation

- [ ] Migrate landing pages to Next.js
- [ ] Update L1 modules with Vite design
- [ ] Consolidate theme/styles
- [ ] Test all routes

### Week 3: Cleanup

- [ ] Remove Vite app
- [ ] Update documentation
- [ ] Verify all features work
- [ ] Run E2E tests

### Week 4: Deployment

- [ ] Deploy to staging
- [ ] Performance testing
- [ ] Production deployment
- [ ] Monitor and iterate

---

## Decision Matrix

| Feature | Source | Action |
|---------|--------|--------|
| **Framework** | Next.js | ✅ Keep |
| **Design System** | Vite | 🔀 Extract to `packages/ui` |
| **L0 Onboarding** | Both | 🔀 Merge |
| **L1 Modules** | Next.js | ✅ Keep, enhance with Vite design |
| **L2 Components** | Next.js | ✅ Keep |
| **Landing Pages** | Vite | 🔀 Migrate to Next.js |
| **RBAC** | Next.js | ✅ Keep |
| **Tenant** | Next.js | ✅ Keep |
| **Multi-platform** | Next.js | ✅ Keep |
| **API Routes** | Next.js | ✅ Keep |
| **Auth** | Next.js | ✅ Keep |
| **Admin** | Next.js | ✅ Keep |
| **Release Control** | Next.js | ✅ Keep |

---

## Summary

**Keep**: Next.js as primary framework (95% of codebase)
**Extract**: Design system components from Vite app
**Merge**: Onboarding flow enhancements
**Migrate**: Landing pages
**Remove**: Vite app after migration

**Result**: Single, unified Next.js monorepo with all features.
