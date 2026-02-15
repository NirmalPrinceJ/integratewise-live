# IntegrateWise Documentation Index

> **Navigation hub for all platform documentation**

---

## 📖 Core Documentation

### **Getting Started**
| Document | Location | Purpose |
|----------|----------|---------|
| **README** | [`/README.md`](../README.md) | Project overview & quick start |
| **Quick Reference** | [`/QUICK_REFERENCE.md`](../QUICK_REFERENCE.md) | Instant answers for common tasks |
| **Project Structure** | [`/PROJECT_STRUCTURE.md`](../PROJECT_STRUCTURE.md) | Complete directory organization (180+ files) |
| **Page Structure** | [`/PAGE_STRUCTURE.md`](../PAGE_STRUCTURE.md) | Routing, navigation, and page hierarchy |
| **Frame Definitions** | [`/FRAME_DEFINITIONS.md`](../FRAME_DEFINITIONS.md) | UI frames, layouts, and shell components |
| **Architecture Guidelines** | [`/guidelines/Guidelines.md`](./Guidelines.md) | System design principles |

### **Color System** 🎨
| Document | Location | Purpose |
|----------|----------|---------|
| **Color Migration Guide** | [`/guidelines/ColorMigration.md`](./ColorMigration.md) | Step-by-step migration checklist |
| **Color Palette (TS)** | [`/utils/colors.ts`](../utils/colors.ts) | TypeScript constants & utilities |
| **CSS Design Tokens** | [`/styles/globals.css`](../styles/globals.css) | CSS variables & theme system |

---

## 🎨 Color System Quick Reference

### **Active Palette (Teal-Blue)**
```css
Primary Sky Blue:  #0EA5E9  (was #3F5185)
Accent Teal:       #14B8A6  (new)
Navy Black:        #0C1222  (was #1E2A4A)
CTA Pink:          #F54476  (existing)
```

### **Migration Status**
- ✅ **System Files:** 3/3 complete
  - `/utils/colors.ts` - Color constants
  - `/styles/globals.css` - CSS variables
  - `/guidelines/ColorMigration.md` - Migration guide

- ✅ **Updated Components:** 4/4
  - `/App.tsx` - Router & page flash fix
  - `/components/landing/Hero.tsx`
  - `/components/landing/Audience.tsx`
  - `/components/landing/AudiencePage.tsx`

- ✅ **Compliant (No Changes Needed):** 12+ files
  - All `/components/website/*` files (6)
  - All `/components/domains/*` shells (4+)
  - `/components/auth/*` files (2)

- 🔄 **Pending Update:** 16 files, 113 instances
  - **Workspace:** 6 files, 39 instances
  - **Landing:** 10 files, 74 instances

### **Usage Patterns**

```typescript
// Import color constants
import { COLORS, TW_COLORS, UI_COLORS } from '@/utils/colors';

// Method 1: Direct hex (simplest for migration)
className="bg-[#0EA5E9] text-white"

// Method 2: Tailwind with constants
className={`bg-${TW_COLORS.primary} text-white`}

// Method 3: CSS variables (preferred for workspaces)
className="bg-[var(--iw-blue)] text-white"

// Method 4: Inline styles
style={{ backgroundColor: COLORS.primary }}
```

---

## 🏗️ Architecture Overview

### **12-Layer System**
```
┌─────────────────────────────────────────┐
│ L12: Intelligence Overlay (AI)          │
│ L11: Goal Framework (OKRs)              │
│ L10: Domain Shells (4 specialized)      │
│ L9:  Workspace Contexts (10 switchable) │
│ L8:  L1 Modules (Dashboard views)       │
│ L7:  Integration Hub                    │
│ L6:  Edge Corrections                   │
│ L5:  Spine (SSOT)                       │
│ L4:  Event Normalization                │
│ L3:  API Gateway                        │
│ L2:  Platform Adapters                  │
│ L1:  External Platforms                 │
└─────────────────────────────────────────┘
```

### **Component Organization**

```
/components/
├── 📂 landing/              # Marketing site (28 files)
│   ├── Hero.tsx             # ✅ Updated
│   ├── Audience.tsx         # ✅ Updated
│   ├── AudiencePage.tsx     # ✅ Updated
│   ├── Navbar.tsx           # 🔄 9 instances
│   ├── Footer.tsx           # 🔄 1 instance
│   ├── Pricing.tsx          # 🔄 9 instances
│   ├── PricingPage.tsx      # 🔄 15 instances
│   └── ...
│
├── 📂 website/              # Website workspace ✅
│   ├── dashboard.tsx        # Uses CSS variables
│   ├── blog.tsx             # Uses CSS variables
│   └── ... (4 more)
│
├── 📂 domains/              # Deep Dive shells ✅
│   ├── account-success/     # 18+ CSM views
│   ├── revops/              # RevOps views
│   ├── salesops/            # SalesOps views
│   └── personal/            # Personal views
│
├── 📂 business-ops/         # Business Ops context
├── 📂 sales/                # Sales context
├── 📂 marketing/            # Marketing context
├── 📂 auth/                 # Login/Signup ✅
├── 📂 onboarding/           # User onboarding ✅
├── 📂 admin/                # RBAC & tenant mgmt
├── 📂 spine/                # SSOT data system
├── 📂 ui/                   # Shadcn (45+ components)
│
└── DashboardShell.tsx       # 🔄 23 instances (HIGH PRIORITY)
```

---

## 📋 File Status Reference

### **✅ Completed Files**
| File | Type | Changes |
|------|------|---------|
| `/App.tsx` | Core | Router + page flash fix |
| `/components/landing/Hero.tsx` | Landing | Color migration |
| `/components/landing/Audience.tsx` | Landing | Color migration |
| `/components/landing/AudiencePage.tsx` | Landing | Color migration |
| `/utils/colors.ts` | System | New color palette |
| `/guidelines/ColorMigration.md` | Docs | New migration guide |

### **✅ Compliant Files (No Changes Needed)**
| Directory | Files | Status |
|-----------|-------|--------|
| `/components/website/*` | 6 | Uses CSS variables |
| `/components/domains/*` | 4+ shells | Uses design tokens |
| `/components/auth/*` | 2 | Already Teal-Blue |
| `/components/onboarding/*` | 1 | Already Teal-Blue |

### **🔄 High Priority (User-Facing Workspace)**
| File | Instances | Impact |
|------|-----------|--------|
| `DashboardShell.tsx` | 23 | Main workspace shell |
| `intelligence-overlay-new.tsx` | 7 | AI overlay |
| `architecture-visualization.tsx` | 6 | Architecture diagram |
| `dashboard-view.tsx` | 1 | Dashboard view |
| `integrations-hub.tsx` | 1 | Integrations hub |
| `LayerAudit.tsx` | 1 | Layer audit |

### **🔄 Medium Priority (Marketing Site)**
| File | Instances | Impact |
|------|-----------|--------|
| `Navbar.tsx` | 9 | Site navigation |
| `Pillars.tsx` | 9 | Features section |
| `Pricing.tsx` | 9 | Pricing component |
| `PricingPage.tsx` | 15 | Full pricing page |
| `TechnicalPage.tsx` | 13+ | Technical details |
| `sections.tsx` | 20+ | Reusable sections |
| `Comparison.tsx` | 5 | Comparison table |
| `Differentiators.tsx` | 4 | Feature differentiators |
| `Integrations.tsx` | 4 | Integrations showcase |
| `DifferentiatorsDetail.tsx` | 3 | Detailed features |

---

## 🎯 Current Priorities

### **Phase 1: System Setup** ✅
- [x] Create color constants file (`/utils/colors.ts`)
- [x] Document migration guide (`/guidelines/ColorMigration.md`)
- [x] Verify CSS variables (`/styles/globals.css`)
- [x] Create project structure docs

### **Phase 2: Workspace Components** 🔄
- [ ] Update `DashboardShell.tsx` (23 instances)
- [ ] Update `intelligence-overlay-new.tsx` (7 instances)
- [ ] Update `architecture-visualization.tsx` (6 instances)
- [ ] Update 3 smaller workspace files (3 instances)

### **Phase 3: Landing Pages** 🔄
- [ ] Update `Navbar.tsx` (9 instances)
- [ ] Update `Pricing.tsx` + `PricingPage.tsx` (24 instances)
- [ ] Update `Pillars.tsx` (9 instances)
- [ ] Update `TechnicalPage.tsx` + `sections.tsx` (33+ instances)
- [ ] Update 4 smaller landing files (16 instances)

### **Phase 4: QA & Cleanup** ⏭️
- [ ] Visual consistency check
- [ ] Cross-browser testing
- [ ] Remove legacy color references
- [ ] Update documentation

---

## 🔍 Finding Information

### **Need to find...**
- **Color usage patterns** → [`/utils/colors.ts`](../utils/colors.ts)
- **Migration checklist** → [`/guidelines/ColorMigration.md`](./ColorMigration.md)
- **File locations** → [`/PROJECT_STRUCTURE.md`](../PROJECT_STRUCTURE.md)
- **Architecture design** → [`/guidelines/Guidelines.md`](./Guidelines.md)
- **CSS variables** → [`/styles/globals.css`](../styles/globals.css)
- **Quick overview** → [`/README.md`](../README.md)

### **Common Tasks**

```bash
# View project structure
cat PROJECT_STRUCTURE.md

# Check color migration status
cat guidelines/ColorMigration.md

# Review color constants
cat utils/colors.ts

# Check CSS design tokens
cat styles/globals.css

# Search for old colors
grep -r "#3F5185\|#1E2A4A" components/
```

---

## 📊 Project Statistics

| Metric | Count |
|--------|-------|
| Total Files | 180+ |
| React Components | 120+ |
| Workspace Contexts | 10 |
| Domain Shells | 4 |
| Specialized Views | 30+ |
| Architecture Layers | 12 |
| UI Components | 45+ |
| **Color Migration** | **11% complete** |
| Files Updated | 5/150+ |
| Instances Remaining | 113 |

---

## 🔗 External Resources

- **Tech Stack:** React 18, TypeScript, Tailwind v4, Supabase, Hono
- **UI Library:** Shadcn/ui (45+ components)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Design System:** Custom Teal-Blue palette

---

## 🚦 Status Legend

| Icon | Status | Meaning |
|------|--------|---------|
| ✅ | Complete | Fully updated & tested |
| 🔄 | In Progress | Currently being updated |
| ⏭️ | Pending | Not started yet |
| 🔒 | Protected | Do not modify |

---

**Documentation Version:** 1.0  
**Last Updated:** February 12, 2026  
**Maintained By:** IntegrateWise Team