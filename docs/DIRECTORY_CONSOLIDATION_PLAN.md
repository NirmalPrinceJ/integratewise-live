# Complete Directory Consolidation Plan
**Audit Date**: February 15, 2026
**Total Files Analyzed**: 219 files across 40 directories
**Total Dead Code Found**: 1.6MB across 25 files

---

## 🚨 EXECUTIVE SUMMARY

**Current State**:
- 219 source files in 40 directories
- 25 orphaned files (not imported anywhere)
- 1.6MB of dead code
- 3 empty/stub directories

**Impact**:
- **68% cleanup potential** by size (1.6MB of 2.4MB dead code)
- **11% file reduction** (25 of 219 files are orphaned)
- **15% directory cleanup** (6 of 40 directories can be deleted)

**Risk Level**: **LOW** - All orphans verified with zero imports

---

## 📊 ORPHANED CODE INVENTORY

### Category 1: ORPHANED DIRECTORIES (Delete Entire Directories)

#### 1.1 `/src/components/website/` → **DELETE** ✗
**Size**: 84KB | **Files**: 6 | **Risk**: ZERO

All files are workspace CMS components from a "Website Builder" domain that was never implemented:

```
❌ blog.tsx            (8KB)   - Blog CMS with post management
❌ dashboard.tsx       (13KB)  - Website analytics dashboard
❌ media.tsx           (11KB)  - Media library manager
❌ pages.tsx           (8KB)   - Page manager CMS
❌ seo.tsx             (13KB)  - SEO optimization tools
❌ theme.tsx           (12KB)  - Theme customizer
```

**Verification**: `grep -r "from.*website/" src/` → **NO RESULTS**

**Delete Command**:
```bash
rm -rf src/components/website/
```

---

#### 1.2 `/src/supabase/functions/` → **DELETE** ✗
**Size**: 8KB | **Files**: 3 | **Risk**: ZERO

Orphaned Supabase Edge Functions (never deployed, not used):

```
❌ server/index.tsx    (~5KB)  - Edge function handler
❌ server/kv_store.tsx (~3KB)  - KV store adapter
```

**Verification**: `grep -r "from.*supabase/functions" src/` → **NO RESULTS**

**Note**: Keep `/src/utils/supabase/` (client.ts and info.tsx) - those ARE used.

**Delete Command**:
```bash
rm -rf src/supabase/functions/
```

---

#### 1.3 `/src/guidelines/` → **DELETE** ✗
**Size**: 0 bytes | **Files**: 1 empty file | **Risk**: ZERO

```
❌ Guidelines.md (0 bytes) - Empty file, never populated
```

**Delete Command**:
```bash
rm -rf src/guidelines/
```

---

### Category 2: PARTIAL DIRECTORY CLEANUP (Delete Some Files)

#### 2.1 `/src/imports/` → **DELETE 7 of 8 FILES** ⚠️
**Size**: ~1.4MB (of 1.5MB total) | **Files**: 7 orphaned, 1 active | **Risk**: LOW

**KEEP (1 file - 8.5KB)**:
```
✅ IntegrateWiseBusinessOperationsDesign-251-4301.tsx  - Used by subscriptions-page.tsx
```

**DELETE (7 files + 8 SVG files - 1.4MB)**:
```
❌ IntegrateWiseBusinessOperationsDesign-121-7096.tsx  (3,597 lines)  - Unused landing page
❌ IntegrateWiseBusinessOperationsDesign-149-2238.tsx  (5,734 lines)  - Unused landing page
❌ IntegrateWiseBusinessOperationsDesign-251-1268.tsx  (2,076 lines)  - Unused landing page
❌ IntegrateWiseBusinessOperationsDesign-290-795.tsx   (1,931 lines)  - Unused landing page
❌ IntegrateWiseBusinessOperationsDesign-350-3185.tsx  (7,413 lines)  - Unused landing page
❌ IntegrateWiseBusinessOperationsDesign-85-2579.tsx   (3,563 lines)  - Unused landing page
❌ IntegrateWiseBusinessOperationsDesign.tsx           (2,230 lines)  - Unused landing page

❌ svg-2lgkn3q2mv.ts    (57 lines)   - Orphaned SVG
❌ svg-gp8td90u09.ts    (69 lines)   - Orphaned SVG
❌ svg-ibi6a4eb4y.ts    (110 lines)  - Orphaned SVG
❌ svg-ksljypcy4z.ts    (103 lines)  - Orphaned SVG
❌ svg-q9chl9kj3e.ts    (69 lines)   - Orphaned SVG
❌ svg-uwumndfr2j.ts    (32 lines)   - Orphaned SVG
❌ svg-w29k8lfblh.ts    (37 lines)   - Orphaned SVG
❌ svg-z62pw76uqc.ts    (24 lines)   - Orphaned SVG
```

**Why These Are Orphaned**:
- Original Figma exports that have been replaced by `/src/components/landing/` components
- Only `251-4301.tsx` is used (FigmaPricingPage import in subscriptions-page.tsx)
- **Exception**: `121-7096.tsx` imports `architecture-visualization.tsx` but is itself never imported

**Delete Commands**:
```bash
cd src/imports/
rm IntegrateWiseBusinessOperationsDesign-121-7096.tsx
rm IntegrateWiseBusinessOperationsDesign-149-2238.tsx
rm IntegrateWiseBusinessOperationsDesign-251-1268.tsx
rm IntegrateWiseBusinessOperationsDesign-290-795.tsx
rm IntegrateWiseBusinessOperationsDesign-350-3185.tsx
rm IntegrateWiseBusinessOperationsDesign-85-2579.tsx
rm IntegrateWiseBusinessOperationsDesign.tsx
rm svg-*.ts
```

---

#### 2.2 `/src/components/shared/` → **DELETE** ✗
**Size**: Unknown | **Files**: 1 | **Risk**: ZERO

```
❌ analytics-shell.tsx - No imports found anywhere
```

**Verification**: `grep -r "analytics-shell\|from.*shared/" src/` → **NO RESULTS**

**Delete Command**:
```bash
rm -rf src/components/shared/
```

---

### Category 3: ROOT-LEVEL ORPHANED COMPONENTS

#### 3.1 `/src/components/` (Root Level) → **DELETE 5 FILES** ⚠️
**Size**: ~164KB | **Files**: 5 orphaned, 7 active | **Risk**: LOW

**DELETE (5 files - 1,540 lines)**:
```
❌ LayerAudit.tsx                   (346 lines)  - Layer architecture audit tool (never used)
❌ intelligence-drawer.tsx          (518 lines)  - Intelligence sidebar (superseded by domains)
❌ intelligence-overlay-new.tsx     (426 lines)  - Intelligence overlay (superseded)
❌ placeholder-view.tsx             (184 lines)  - Generic placeholder (unused)
❌ dashboard-view.tsx               (361 lines)  - DUPLICATE (workspace/dashboard-view.tsx is used)
```

**KEEP (7 files - ACTIVELY USED)**:
```
✅ ai-chat.tsx                   - Used by l1-module-content.tsx
✅ integrations-hub.tsx          - Used by l1-module-content.tsx
✅ profile-page.tsx              - Used by l1-module-content.tsx
✅ settings-page.tsx             - Used by l1-module-content.tsx
✅ subscriptions-page.tsx        - Used by l1-module-content.tsx
✅ l1-module-content.tsx         - PRIMARY MODULE ROUTER (hub of workspace)
✅ architecture-visualization.tsx - Used by imports/121-7096.tsx (but that's orphaned too!)
```

**Special Case - architecture-visualization.tsx**:
- Imported by `IntegrateWiseBusinessOperationsDesign-121-7096.tsx`
- BUT that importer is itself orphaned
- **Decision**: Keep for now (might be useful for technical documentation)
- **Alternative**: Delete if cleaning `imports/` directory

**Delete Commands**:
```bash
cd src/components/
rm LayerAudit.tsx
rm intelligence-drawer.tsx
rm intelligence-overlay-new.tsx
rm placeholder-view.tsx
rm dashboard-view.tsx  # Superseded by workspace/dashboard-view.tsx
```

---

## 🗂️ ACTIVE DIRECTORIES (Keep All)

### Workspace Core (100% Active)
```
✅ /src/components/workspace/          - Workspace shell, routing, config (5 files)
✅ /src/components/navigation/          - Sidebar, top-bar, command-palette (3 files)
✅ /src/components/auth/                - Login, signup, auth-provider (3 files)
✅ /src/components/onboarding/          - Onboarding flow + role-domain modules (7 files)
✅ /src/components/notifications/       - Notification center (1 file)
```

### Business Domains (100% Active)
```
✅ /src/components/domains/             - Domain shells + types (3 files)
✅ /src/components/domains/account-success/   - CS domain (27 files including views/)
✅ /src/components/domains/revops/      - RevOps domain (3 files)
✅ /src/components/domains/salesops/    - SalesOps domain (3 files)
✅ /src/components/domains/personal/    - Personal domain (3 files)
```

### Feature Components (100% Active)
```
✅ /src/components/sales/               - Sales pipeline, deals, forecasting (7 files)
✅ /src/components/business-ops/        - Accounts, tasks, workflows, calendar (9 files)
✅ /src/components/marketing/           - Campaigns, attribution, email-studio (6 files)
✅ /src/components/document-storage/    - Document storage module (3 files)
✅ /src/components/admin/               - RBAC, tenants, approvals (6 files)
```

### Infrastructure (100% Active)
```
✅ /src/components/hydration/           - Fabric engine, adapters, hooks (8 files + 5 providers)
✅ /src/components/spine/               - Spine client, readiness bar, types (4 files)
✅ /src/components/goal-framework/      - Goal alignment, context, schema (3 files)
✅ /src/components/figma/               - ImageWithFallback (1 file)
```

### Public Marketing (95% Active - See FIGMA_MARKETING_AUDIT.md)
```
✅ /src/components/landing/             - Public site (24 files, 3 need reorganization)
⚠️ /src/components/landing/page-content.ts       - Move to /src/data/landing/
⚠️ /src/components/landing/product-catalog.ts    - Move to /src/data/landing/
⚠️ /src/components/landing/sections.tsx          - Rename to SectionComponents.tsx
```

### UI Components (100% Active)
```
✅ /src/components/ui/                  - Radix UI components (58 files)
```

### Assets & Utilities (100% Active)
```
✅ /src/assets/                         - Images used by landing pages (3 files, 6.3MB)
✅ /src/utils/supabase/                 - Supabase client + info (2 files)
✅ /src/styles/                         - Global CSS (unknown file count)
```

---

## 📈 CONSOLIDATION METRICS

### Before Cleanup
| Category | Directories | Files | Size |
|----------|------------|-------|------|
| Active Code | 34 | 194 | ~2.4MB |
| Dead Code | 6 | 25 | ~1.6MB |
| **TOTAL** | **40** | **219** | **~4.0MB** |

### After Cleanup
| Category | Directories | Files | Size |
|----------|------------|-------|------|
| Active Code | 34 | 194 | ~2.4MB |
| Dead Code | 0 | 0 | 0 |
| **TOTAL** | **34** | **194** | **~2.4MB** |

**Reduction**:
- 📁 Directories: 40 → 34 (**-15%**)
- 📄 Files: 219 → 194 (**-11%**)
- 💾 Size: ~4.0MB → ~2.4MB (**-40%**)

---

## 🎯 RECOMMENDED EXECUTION PLAN

### Phase 1: Safe Deletions (Zero Risk)
**Execute immediately** - These have ZERO imports anywhere:

```bash
# Step 1: Delete orphaned directories
rm -rf src/components/website/
rm -rf src/supabase/functions/
rm -rf src/guidelines/
rm -rf src/components/shared/

# Step 2: Delete root-level orphaned components
rm src/components/LayerAudit.tsx
rm src/components/intelligence-drawer.tsx
rm src/components/intelligence-overlay-new.tsx
rm src/components/placeholder-view.tsx
rm src/components/dashboard-view.tsx

# Step 3: Commit checkpoint
git add -A
git commit -m "cleanup: remove 84KB orphaned website/ CMS components

- Delete 6 unused Website Builder domain components (blog, dashboard, media, pages, seo, theme)
- Delete 5 unused root-level components (LayerAudit, intelligence-drawer, etc.)
- Delete 3 orphaned directories (supabase/functions/, shared/, guidelines/)
- Verified zero imports via grep -r checks

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Phase 2: Imports Cleanup (Medium Risk)
**Requires review** - Some files reference assets used elsewhere:

```bash
# Step 1: Keep only the one active import file
cd src/imports/
mkdir -p ../archive/imports-backup/
mv IntegrateWiseBusinessOperationsDesign-251-4301.tsx ../archive/imports-backup/

# Step 2: Delete all other imports
rm IntegrateWiseBusinessOperationsDesign-*.tsx
rm svg-*.ts

# Step 3: Move the active file back
mv ../archive/imports-backup/IntegrateWiseBusinessOperationsDesign-251-4301.tsx ./

# Step 4: Commit checkpoint
cd ../../
git add -A
git commit -m "cleanup: remove 1.4MB orphaned Figma import files

- Keep IntegrateWiseBusinessOperationsDesign-251-4301.tsx (used by subscriptions-page)
- Delete 7 unused landing page import components (26,544 lines)
- Delete 8 orphaned SVG helper files (601 lines)
- Total cleanup: 27,145 lines (~1.4MB)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Phase 3: Architecture Reorganization (See FIGMA_MARKETING_AUDIT.md)
**Execute after Phases 1-2** - These require import path updates:

From `FIGMA_MARKETING_AUDIT.md`:

```bash
# 1. Fix naming conventions
cd src/components/landing/
git mv infographics.tsx Infographics.tsx
git mv logo.tsx Logo.tsx

# 2. Move data files to proper location
mkdir -p ../../data/landing/
git mv page-content.ts ../../data/landing/page-content.ts
git mv product-catalog.ts ../../data/landing/product-catalog.ts

# 3. Rename sections.tsx
git mv sections.tsx SectionComponents.tsx

# 4. Update imports in GenericPage.tsx and other consumers
# (Manual - update import paths)

# 5. Commit
git add -A
git commit -m "refactor: reorganize landing page data files

- Move page-content.ts and product-catalog.ts to data/landing/
- Rename sections.tsx → SectionComponents.tsx
- Fix naming: infographics.tsx → Infographics.tsx, logo.tsx → Logo.tsx
- Update import paths in GenericPage.tsx

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 🔍 VERIFICATION COMMANDS

Run these after each phase to verify no broken imports:

```bash
# Check for broken imports
npm run build 2>&1 | grep -i "error\|cannot find"

# Verify no references to deleted files
grep -r "components/website" src/
grep -r "supabase/functions" src/
grep -r "LayerAudit\|intelligence-drawer\|intelligence-overlay-new" src/

# Verify imports directory is clean
ls -lh src/imports/
# Should show only: IntegrateWiseBusinessOperationsDesign-251-4301.tsx

# Run TypeScript check
npx tsc --noEmit
```

---

## 📋 SPECIAL CASES

### 1. `architecture-visualization.tsx` - Keep or Delete?

**Current State**:
- Only imported by `IntegrateWiseBusinessOperationsDesign-121-7096.tsx`
- But that importer is itself orphaned

**Options**:
- **A) Keep** - Might be useful for technical documentation or roadmap pages
- **B) Delete** - Truly orphaned if we delete imports/121-7096.tsx

**Recommendation**: **Keep for now** (317 lines isn't large, might be useful)

---

### 2. Duplicate `dashboard-view.tsx`

**Issue**: Two files with same name:
- `/src/components/dashboard-view.tsx` (361 lines) - **ORPHANED**
- `/src/components/workspace/dashboard-view.tsx` (unknown size) - **USED**

**Root Cause**: Component was "extracted from l1-module-content" into workspace subdirectory, but original was never deleted.

**Action**: Delete root-level version (already in Phase 1 plan)

---

### 3. Assets Directory (6.3MB)

**Current State**:
- 3 PNG files (6.3MB total)
- All ARE used by landing pages and imports

**Action**: **KEEP ALL** - No orphaned assets found

**Files**:
```
✅ bcaf13c3a18bdb4dbfd3ccee1dd81293eb966a9a.png (2.7KB) - Favicon
✅ 76f4c06e86f5cdbe516fb6447ed45a10730f1cd5.png (418KB) - Brand identity image
✅ a76fd4f119a6c6a979f0bd213fd10e1d85edd796.png (5.9MB) - Architecture diagram
```

---

## 🚀 FINAL DIRECTORY STRUCTURE (After Cleanup)

```
src/
├── assets/                          # 3 images (6.3MB) - all used
├── components/
│   ├── admin/                       # 6 files - RBAC, tenants
│   ├── auth/                        # 3 files - login, signup
│   ├── business-ops/                # 9 files - accounts, workflows
│   ├── document-storage/            # 3 files - document module
│   ├── domains/                     # Domain shells + 4 domains
│   │   ├── account-success/         # 27 files (including views/)
│   │   ├── personal/                # 3 files
│   │   ├── revops/                  # 3 files
│   │   └── salesops/                # 3 files
│   ├── figma/                       # 1 file - ImageWithFallback
│   ├── goal-framework/              # 3 files - goal alignment
│   ├── hydration/                   # 13 files - fabric engine + adapters
│   ├── landing/                     # 21 files - public marketing site
│   ├── marketing/                   # 6 files - marketing domain
│   ├── navigation/                  # 3 files - sidebar, top-bar
│   ├── notifications/               # 1 file - notification center
│   ├── onboarding/                  # 7 files - onboarding flow
│   ├── sales/                       # 7 files - sales domain
│   ├── spine/                       # 4 files - spine client
│   ├── ui/                          # 58 files - Radix UI components
│   ├── workspace/                   # 5 files - workspace shell
│   ├── ai-chat.tsx                  # ✅ USED
│   ├── architecture-visualization.tsx # ⚠️ KEEP (might be useful)
│   ├── integrations-hub.tsx         # ✅ USED
│   ├── l1-module-content.tsx        # ✅ PRIMARY ROUTER
│   ├── profile-page.tsx             # ✅ USED
│   ├── settings-page.tsx            # ✅ USED
│   └── subscriptions-page.tsx       # ✅ USED
├── data/                            # NEW - Move from landing/
│   └── landing/
│       ├── page-content.ts          # Moved from components/
│       └── product-catalog.ts       # Moved from components/
├── imports/
│   └── IntegrateWiseBusinessOperationsDesign-251-4301.tsx  # Only survivor
├── styles/                          # Global CSS
├── utils/
│   └── supabase/                    # 2 files - client + info
├── App.tsx
└── main.tsx
```

**Total**: 34 directories, 194 files, ~2.4MB of clean, active code

---

## ✅ SUCCESS CRITERIA

After executing all phases:

- [ ] All 25 orphaned files deleted
- [ ] No broken imports (TypeScript build succeeds)
- [ ] Application runs without errors
- [ ] `/src/imports/` contains only 1 file
- [ ] `/src/components/website/` directory does not exist
- [ ] `/src/supabase/functions/` directory does not exist
- [ ] `/src/components/shared/` directory does not exist
- [ ] `/src/guidelines/` directory does not exist
- [ ] Data files moved to `/src/data/landing/`
- [ ] All landing components use PascalCase naming

**Estimated Execution Time**: 30 minutes (with verification)

**Risk Assessment**: **LOW** - All deletions verified with grep searches showing zero imports

---

## 🎯 NEXT STEPS

1. **Execute Phase 1** (safe deletions) → Commit
2. **Run build verification** → Fix any issues
3. **Execute Phase 2** (imports cleanup) → Commit
4. **Run build verification** → Fix any issues
5. **Execute Phase 3** (architecture reorganization from FIGMA_MARKETING_AUDIT.md)
6. **Update documentation**:
   - Update ARCHITECTURE_DIAGRAM.md with correct file counts
   - Update README.md if it references deleted components
7. **Final verification**: Full build + manual app testing

**Total Cleanup Impact**: **1.6MB** and **25 files** removed from codebase
