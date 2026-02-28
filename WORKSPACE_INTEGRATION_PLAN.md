# IntegrateWise Workspace Integration Plan

## Repository Structure Overview

```
/Users/nirmal/Github/
│
├── integratewise-brainstroming/          ← ORIGINAL REPOSITORY
│   ├── README.md
│   ├── agents.md                         ← Canonical architecture spec
│   ├── NAVIGATION.md
│   ├── SYSTEM_SPECIFICATION.md
│   │
│   ├── apps/
│   │   ├── frontend-figma/               ← 185+ components, Figma export
│   │   │   ├── src/components/           ← Domain shells, UI components
│   │   │   ├── src/supabase/             ← Database config
│   │   │   └── ...
│   │   ├── business-operations-design/
│   │   └── business-operations-design-v2/
│   │
│   ├── docs/                             ← Infrastructure docs
│   │   ├── INFRASTRUCTURE_MAPPING.md
│   │   ├── DATABASE_SCHEMA.md
│   │   └── ...
│   │
│   └── integratewise-complete/           ← CONSOLIDATED WORK
│       ├── apps/web/                     ← Unified Vite app (our work)
│       ├── sql-migrations/               ← 49 migrations
│       └── ...
│
└── integratewise-live/                   ← CURRENT WORKING DIRECTORY
    └── (symlinked to integratewise-complete)
```

---

## Current State Analysis

### Location 1: `integratewise-brainstroming/apps/frontend-figma/`
**Status:** Original Figma export, 185+ components
- ✅ Complete UI component library
- ✅ Domain shells (5 domains)
- ✅ Landing pages
- ⚠️ Old architecture (pre-L0-L3)
- ❌ Not bound to backend

### Location 2: `integratewise-brainstroming/integratewise-complete/apps/web/`
**Status:** Our consolidated work
- ✅ Unified Vite + React app
- ✅ 8 API modules (L3)
- ✅ 8 React hooks (L2)
- ✅ 6 app pages (partial L1)
- ✅ 12 domain views
- ✅ Auth system
- ⚠️ Missing 9 L1 modules
- ⚠️ Missing L0 onboarding

---

## Integration Strategy

### Phase 1: Component Migration (From frontend-figma to web)

**Source:** `apps/frontend-figma/src/components/`
**Target:** `integratewise-complete/apps/web/src/components/`

| Component Type | Count | Action |
|----------------|-------|--------|
| UI primitives (Button, Input, etc.) | 45 | ✅ Already have (shadcn) |
| Domain shells | 5 | 🔄 Migrate and enhance |
| Layout components | 12 | 🔄 Review and adapt |
| Marketing sections | 24 | ✅ Already have |
| Utility components | 8 | 🔄 Migrate as needed |

**Migration Rules:**
1. Keep shadcn/ui components (better maintained)
2. Migrate domain-specific layouts
3. Adapt Figma components to new data binding
4. Preserve animations and interactions

### Phase 2: Domain Shell Integration

**Current (frontend-figma):** 5 domain shells
- Account Success
- RevOps
- SalesOps
- Personal
- Marketing

**Target (AGENTS.md):** 12 domain views
- Customer Success ← Account Success
- RevOps ← RevOps
- Sales ← SalesOps
- Marketing ← Marketing
- Personal ← Personal
- Product & Eng ← NEW
- Finance ← NEW
- Service ← NEW
- Procurement ← NEW
- IT Admin ← NEW
- Education ← NEW
- BizOps ← NEW

**Action:** Expand 5 shells to 12, using existing as base

### Phase 3: L0-L3 Wiring

**Current State:**
- L3: ✅ Complete (8 API modules)
- L2: ⚠️ Partial (5 of 14 components)
- L1: ⚠️ Partial (6 of 15 modules)
- L0: ❌ Missing (login only)

**Integration Work:**
```
frontend-figma components
    ↓ Extract domain layouts
integratewise-complete/apps/web
    ↓ Wire to hooks
Hooks (useDomainEntities, etc.)
    ↓ Call APIs
API modules (entities, dashboard)
    ↓ Query
Supabase (spine_entities)
```

---

## File Sync Strategy

### Critical Files to Sync

| File | Location | Action |
|------|----------|--------|
| `agents.md` | Root | ✅ Reference architecture |
| `NAVIGATION.md` | Root | ✅ Maintain navigation |
| `SYSTEM_SPECIFICATION.md` | Root | ✅ Reference spec |
| Domain shell components | `apps/frontend-figma/` | 🔄 Migrate to web app |
| UI components | `apps/frontend-figma/` | ⚠️ Review against shadcn |
| Marketing pages | `apps/frontend-figma/` | ✅ Already migrated |
| SQL migrations | `integratewise-complete/` | ✅ Current work |
| API modules | `integratewise-complete/apps/web/` | ✅ Current work |

### One-Way Sync (Current Work → Main)

```bash
# From: integratewise-live/integratewise-complete/apps/web
# To:   integratewise-brainstroming/integratewise-complete/apps/web

rsync -av --progress \
  apps/web/src/lib/api/ \
  ../integratewise-brainstroming/integratewise-complete/apps/web/src/lib/api/

rsync -av --progress \
  apps/web/src/hooks/ \
  ../integratewise-brainstroming/integratewise-complete/apps/web/src/hooks/

rsync -av --progress \
  sql-migrations/ \
  ../integratewise-brainstroming/integratewise-complete/sql-migrations/
```

### Two-Way Sync (Components)

```bash
# Review and adapt Figma components
# Manual process for domain shells
```

---

## Recommended Workflow

### For Testing Tomorrow:

**Option A: Use Current Location (integratewise-live)**
```bash
cd /Users/nirmal/Github/integratewise-live/integratewise-complete/apps/web
./scripts/quick-start.sh
```
- ✅ All our work is here
- ✅ Latest bindings
- ✅ Ready to test

**Option B: Use Main Repository (integratewise-brainstroming)**
```bash
cd /Users/nirmal/Github/integratewise-brainstroming/integratewise-complete/apps/web
npm run dev
```
- ⚠️ Need to verify sync
- ⚠️ May have older versions

**Recommendation:** Option A for testing, sync to B after verification

---

## Consolidation Checklist

### Pre-Test (Done)
- ✅ Build succeeds
- ✅ No errors
- ✅ All imports work
- ✅ 98% pre-flight score

### Post-Test (After Tomorrow)
- [ ] Sync working code to main repo
- [ ] Migrate domain shells from frontend-figma
- [ ] Build missing L1 modules
- [ ] Build L0 onboarding
- [ ] Complete L2 components

### Final State (Target)
```
integratewise-brainstroming/
├── apps/
│   ├── web/                    ← Unified app (merged)
│   │   ├── src/components/     ← shadcn + migrated shells
│   │   ├── src/lib/api/        ← L3 APIs
│   │   ├── src/hooks/          ← L2 hooks
│   │   └── ...
│   └── frontend-figma/         ← Archive/reference
├── docs/                       ← Infrastructure
└── sql-migrations/             ← Database
```

---

## Quick Commands

### Test Current Work
```bash
cd /Users/nirmal/Github/integratewise-live
./scripts/preflight-check.sh
./scripts/quick-start.sh
```

### Sync to Main Repo
```bash
cd /Users/nirmal/Github/integratewise-live
rsync -av integratewise-complete/apps/web/src/lib/api/ \
  ../integratewise-brainstroming/integratewise-complete/apps/web/src/lib/api/
```

### Reference Original Components
```bash
cd /Users/nirmal/Github/integratewise-brainstroming
ls apps/frontend-figma/src/components/domains/
```

---

## Summary

**Current Working Directory:** `integratewise-live` ← **TEST HERE**
**Main Repository:** `integratewise-brainstroming` ← **SYNC HERE AFTER**
**Original Components:** `apps/frontend-figma/` ← **MIGRATE FROM**

**Workflow:**
1. Test in `integratewise-live` tomorrow
2. Fix any issues found
3. Sync working code to main repo
4. Migrate domain shells from frontend-figma
5. Build missing modules

**Status:** Ready for testing, components available for migration
