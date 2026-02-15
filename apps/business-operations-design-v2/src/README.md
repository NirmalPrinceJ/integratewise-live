# IntegrateWise Platform

> **Multi-Context B2B SaaS Workspace** with AI Intelligence Overlay  
> Built with React, TypeScript, Supabase, and Hono 12-Layer Architecture

---

## 🚀 Quick Start

### **Key Documentation Files**

| File | Purpose | Status |
|------|---------|--------|
| **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** | Complete directory organization & architecture map | ✅ Up to date |
| **[PAGE_STRUCTURE.md](./PAGE_STRUCTURE.md)** | Page hierarchy, routing, and navigation patterns | ✅ Up to date |
| **[FRAME_DEFINITIONS.md](./FRAME_DEFINITIONS.md)** | UI frame specifications & layout structures | ✅ Up to date |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Instant answers for common tasks | ✅ Up to date |
| **[ColorMigration.md](./guidelines/ColorMigration.md)** | Color system migration guide & checklist | ✅ Active |
| **[Guidelines.md](./guidelines/Guidelines.md)** | Architecture & development guidelines | ✅ Reference |
| **[colors.ts](./utils/colors.ts)** | Centralized color palette & utilities | ✅ Source of truth |
| **[globals.css](./styles/globals.css)** | CSS design tokens & theme variables | ✅ Active |

---

## 🎨 Color System (Teal-Blue Palette)

### **Brand Colors**
```css
Primary:    #0EA5E9  /* Sky Blue */
Accent:     #14B8A6  /* Teal */
Dark Base:  #0C1222  /* Navy Black */
CTA Pink:   #F54476  /* Brand Pop */
```

### **Usage Patterns**

```typescript
// Method 1: Import color constants
import { COLORS, TW_COLORS } from '@/utils/colors';

// Inline styles
style={{ backgroundColor: COLORS.primary }}

// Tailwind classes
className={`bg-${TW_COLORS.primary} text-white`}

// CSS variables (preferred for workspace contexts)
className="bg-[var(--iw-blue)] text-white"
```

### **Migration Status**
- ✅ **Completed:** 5 files (App, Hero, Audience, color system)
- ✅ **Compliant:** 12+ files (website/*, auth/*, onboarding/*)
- 🔄 **In Progress:** 16 files, 113 instances remaining
  - 6 workspace components (DashboardShell, intelligence-overlay, etc.)
  - 10 landing pages (Navbar, Pricing, Pillars, etc.)

See **[ColorMigration.md](./guidelines/ColorMigration.md)** for detailed checklist.

---

## 📁 Project Structure Overview

```
/
├── App.tsx                    # Entry point (RouterProvider)
├── PROJECT_STRUCTURE.md       # Complete directory documentation
├── README.md                  # This file
│
├── components/
│   ├── landing/              # Marketing site (28 files)
│   ├── website/              # Website workspace (6 files) ✅
│   ├── domains/              # Deep Dive shells (4 domains)
│   │   ├── account-success/  # CSM workspace (18+ views)
│   │   ├── revops/           # RevOps workspace
│   │   ├── salesops/         # SalesOps workspace
│   │   └── personal/         # Personal workspace
│   ├── business-ops/         # Business Ops context (10 views)
│   ├── sales/                # Sales context (7 views)
│   ├── marketing/            # Marketing context (6 views)
│   ├── auth/                 # Login/Signup ✅
│   ├── onboarding/           # User onboarding ✅
│   ├── admin/                # RBAC & tenant management
│   ├── spine/                # SSOT data system
│   ├── ui/                   # Shadcn components (45+)
│   └── ...
│
├── styles/
│   └── globals.css           # Teal-Blue CSS variables ✅
│
├── utils/
│   ├── colors.ts             # Color palette & utilities ✅
│   └── supabase/
│
├── guidelines/
│   ├── ColorMigration.md     # Migration guide ✅
│   └── Guidelines.md         # Architecture guidelines
│
└── supabase/functions/server/
    ├── index.tsx             # Hono server entry
    ├── spine.tsx             # SSOT logic
    ├── intelligence.tsx      # AI layer
    └── ...
```

See **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** for complete 180+ file directory tree.

---

## 🏗️ Architecture Highlights

### **12-Layer System**
```
L12: Intelligence Overlay (AI Agents)
L11: Goal Framework (OKRs)
L10: Domain Shells (Account Success, RevOps, Personal, SalesOps)
L9:  Workspace Contexts (10 switchable contexts)
L8:  L1 Modules (Dashboard views)
L7:  Integration Hub
L6:  Edge Corrections
L5:  Spine (SSOT)
L4:  Event Normalization
L3:  API Gateway
L2:  Platform Adapters
L1:  External Platforms
```

### **10 Workspace Contexts**
1. Website - Content & blog management
2. Sales - Pipeline, deals, forecasting
3. Marketing - Campaigns, email studio
4. Business Ops - Workflows, automation
5. Customer Success - Health scores
6. Finance - Revenue tracking
7. Product - Roadmap management
8. Engineering - API logs
9. Admin - RBAC, tenant settings
10. Analytics - Cross-workspace insights

### **4 Domain Deep Dives**
- **Account Success** - 17+ specialized CSM views
- **Personal** - Individual productivity
- **RevOps** - Revenue operations intelligence
- **SalesOps** - Sales operations analytics

---

## 🎯 Current Focus: Color Migration

### **What's Been Done** ✅
1. Created centralized color system (`/utils/colors.ts`)
2. Documented migration guide (`/guidelines/ColorMigration.md`)
3. Updated key landing pages (Hero, Audience)
4. Fixed page flash issue in routing (`/App.tsx`)
5. Verified CSS variable compliance (`/styles/globals.css`)

### **What's Next** 🔄
1. **Workspace Components** (High Priority - User Facing)
   - DashboardShell.tsx (23 instances)
   - intelligence-overlay-new.tsx (7 instances)
   - architecture-visualization.tsx (6 instances)
   - 3 smaller files (3 instances total)

2. **Landing Pages** (Marketing Site)
   - 10 files with 74 instances total
   - Focus: Navbar, Pricing, Pillars

3. **QA & Cleanup**
   - Visual consistency check
   - Remove legacy color references
   - Update documentation

---

## 📚 Development Guidelines

### **Color Usage Rules**
1. **New components** - Use imports from `/utils/colors.ts`
2. **Workspace contexts** - Use CSS variables (`var(--iw-blue)`)
3. **Landing pages** - Direct hex values for simplicity
4. **Never use** - Legacy colors `#3F5185` or `#1E2A4A`

### **Import Conventions**
```typescript
// Colors
import { COLORS, TW_COLORS, UI_COLORS } from '@/utils/colors';

// Spine data
import { useSpineProjection } from '@/components/spine/spine-client';

// UI components
import { Button } from '@/components/ui/button';

// Domain shells
import { AccountSuccessShell } from '@/components/domains/account-success/shell';
```

### **Protected Files** 🔒
- `/components/figma/ImageWithFallback.tsx` - Do not modify

---

## 🔗 Key Links

- **[Complete Directory Structure](./PROJECT_STRUCTURE.md)** - 180+ file organization map
- **[Color Migration Guide](./guidelines/ColorMigration.md)** - Step-by-step migration checklist
- **[Color Palette Source](./utils/colors.ts)** - TypeScript color constants
- **[CSS Design Tokens](./styles/globals.css)** - Theme variables
- **[Architecture Guidelines](./guidelines/Guidelines.md)** - System design principles

---

## 📊 Project Stats

- **Total Files:** 180+
- **Components:** 120+
- **Workspace Contexts:** 10
- **Domain Shells:** 4 (with 30+ specialized views)
- **Architecture Layers:** 12
- **UI Components:** 45+ (Shadcn)
- **Color Migration Progress:** 11% complete (17/150+ files)

---

## 💡 Quick Commands

```bash
# View complete project structure
cat PROJECT_STRUCTURE.md

# Check color migration status
cat guidelines/ColorMigration.md

# Review color palette
cat utils/colors.ts

# View design tokens
cat styles/globals.css
```

---

**Platform Version:** 1.0.0  
**Last Updated:** February 12, 2026  
**Status:** 🟡 Color Migration In Progress