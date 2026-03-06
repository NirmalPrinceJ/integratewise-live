# UI Versions Comparison

## Overview

Three versions of the UI exist in this repository:

| Version | Location | Files | Key Features |
|---------|----------|-------|--------------|
| **V1** | `apps/business-operations-design/` | 248 | Original Figma export |
| **V2** | `apps/business-operations-design-v2/` | 222 | **Complete workspace shell** |
| **Next.js** | `integratewise-complete/apps/web/` | 916 | Production app |

---

## V1: Original (apps/business-operations-design/)

### Components
- Basic landing pages
- Onboarding flow
- UI primitives (shadcn)
- Domain views (partial)
- Missing: Workspace shell, sidebar, top-bar

### Documentation
- DIRECTORY_CONSOLIDATION_PLAN.md
- FIGMA_MARKETING_AUDIT.md
- COMPREHENSIVE_UI_UX_AUDIT_REPORT.md
- FIGMA_DESIGN_SYSTEM_AUDIT.md

### Status
⚠️ Incomplete - missing app shell components

---

## V2: Complete Workspace (apps/business-operations-design-v2/) ⭐ RECOMMENDED

### New Components (Not in V1)

#### Workspace Shell
```
src/components/
├── DashboardShell.tsx          # Main app container
├── sidebar.tsx                 # 256px workspace sidebar
├── top-bar.tsx                 # 64px header with search/notifications
├── command-palette.tsx         # CMD+K search
└── workspace-shell.tsx         # Shell wrapper
```

#### Domain Deep Dive
```
src/components/domains/
├── account-success/
│   ├── shell.tsx               # Domain container
│   ├── dashboard.tsx           # Overview
│   └── views/                  # 17 specialized views
│       ├── account-master-view.tsx
│       ├── business-context-view.tsx
│       ├── risk-register-view.tsx
│       └── ... (14 more)
├── personal/
├── revops/
└── salesops/
```

#### Frame Documentation
```
src/
├── FRAME_DEFINITIONS.md        # 5 frame types spec
├── PAGE_STRUCTURE.md           # Complete routing
├── ARCHITECTURE_REALITY_CHECK.md
├── COLOR_MIGRATION_STATUS.md
├── PROJECT_STRUCTURE.md
└── QUICK_REFERENCE.md
```

### 5 Frame Types Defined

| Frame | Use Case | Layout |
|-------|----------|--------|
| **Frame 1** | Marketing Landing | Navbar + Content + Footer |
| **Frame 2** | Auth | Centered card on gradient |
| **Frame 3** | Workspace Shell | Sidebar + TopBar + Content + Intelligence |
| **Frame 4** | Domain Deep Dive | Dual sidebar + Views |
| **Frame 5** | Settings | Header + Tabbed content |

### V2 Key Files for Figma

| File | Purpose |
|------|---------|
| `FRAME_DEFINITIONS.md` | Complete frame specifications |
| `PAGE_STRUCTURE.md` | Routing architecture |
| `sidebar.tsx` | Navigation component |
| `top-bar.tsx` | Header component |
| `DashboardShell.tsx` | Main layout |
| `domains/*/shell.tsx` | Domain containers |

---

## Next.js: Production (integratewise-complete/apps/web/)

### Strengths
- Full backend integration
- API routes
- Auth middleware
- Multi-tenant
- RBAC complete
- All L1/L2 modules

### Components
- 916 TSX/TS files
- 15 L1 modules
- 14 L2 components
- 40+ admin pages

---

## Recommendation

### For Figma Design
**Use V2** (`business-operations-design-v2/`):
- Complete frame definitions
- Workspace shell components
- Domain deep dive patterns
- Comprehensive documentation

### For Implementation
**Merge V2 UI into Next.js**:
- V2 visual design + frames
- Next.js backend + auth
- Combine for production

---

## File Structure Summary

```
apps/
├── business-operations-design/          # V1: Original (skip)
├── business-operations-design-v2/       # V2: ✅ USE THIS
│   ├── src/
│   │   ├── FRAME_DEFINITIONS.md         # ← Start here
│   │   ├── PAGE_STRUCTURE.md
│   │   ├── components/
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── top-bar.tsx
│   │   │   └── domains/
│   │   └── ...
│   └── ...
└── frontend-figma/                      # Legacy (skip)

integratewise-complete/
└── apps/web/                            # Next.js: Backend
    ├── src/
    │   ├── app/                         # Routes
    │   ├── components/                  # UI components
    │   └── ...
    └── ...
```

---

## Quick Start

### For Designers
1. Read: `apps/business-operations-design-v2/src/FRAME_DEFINITIONS.md`
2. Reference: `apps/business-operations-design-v2/src/components/sidebar.tsx`
3. Reference: `apps/business-operations-design-v2/src/components/top-bar.tsx`

### For Developers
1. Use Next.js as base (`integratewise-complete/apps/web/`)
2. Extract UI from V2 components
3. Merge visual design with backend
