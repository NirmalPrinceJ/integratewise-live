# IntegrateWise Project Structure

> **Last Updated:** February 12, 2026  
> **Color System:** Teal-Blue Atmospheric (`#0EA5E9` primary, `#14B8A6` accent, `#0C1222` dark base)

## 📁 Directory Organization

```
/
├── 📄 App.tsx                          # Main entry point (RouterProvider for multi-page routing)
├── 📄 PROJECT_STRUCTURE.md             # This file - complete project documentation
│
├── 📂 components/                      # All React components
│   ├── 📂 landing/                     # Marketing site (28 files)
│   │   ├── Hero.tsx                    # ✅ Updated to Teal-Blue
│   │   ├── Audience.tsx                # ✅ Updated to Teal-Blue
│   │   ├── AudiencePage.tsx            # ✅ Updated to Teal-Blue
│   │   ├── Navbar.tsx                  # 🔄 Needs color update (9 instances)
│   │   ├── Footer.tsx                  # 🔄 Needs color update (1 instance)
│   │   ├── Pricing.tsx                 # 🔄 Needs color update (9 instances)
│   │   ├── PricingPage.tsx             # 🔄 Needs color update (15 instances)
│   │   ├── Pillars.tsx                 # 🔄 Needs color update (9 instances)
│   │   ├── Comparison.tsx              # 🔄 Needs color update (5 instances)
│   │   ├── Differentiators.tsx         # 🔄 Needs color update (4 instances)
│   │   ├── DifferentiatorsDetail.tsx   # 🔄 Needs color update (3 instances)
│   │   ├── Integrations.tsx            # 🔄 Needs color update (4 instances)
│   │   ├── GenericPage.tsx             # 🔄 Needs color update (2 instances)
│   │   ├── TechnicalPage.tsx           # 🔄 Needs color update (13+ instances)
│   │   ├── sections.tsx                # 🔄 Needs color update (20+ instances)
│   │   └── ... (23 more files)
│   │
│   ├── 📂 website/                     # Website workspace context (6 files)
│   │   ├── dashboard.tsx               # ✅ Uses CSS variables (compliant)
│   │   ├── blog.tsx                    # ✅ Uses CSS variables (compliant)
│   │   ├── pages.tsx                   # ✅ Uses CSS variables (compliant)
│   │   ├── seo.tsx                     # ✅ Uses CSS variables (compliant)
│   │   ├── media.tsx                   # ✅ Uses CSS variables (compliant)
│   │   └── theme.tsx                   # ✅ Uses CSS variables (compliant)
│   │
│   ├── 📂 domains/                     # Deep Dive domain shells
│   │   ├── 📂 account-success/         # CSM workspace with 18+ views
│   │   │   ├── shell.tsx               # Domain shell wrapper
│   │   │   ├── dashboard.tsx           # Main CSM dashboard
│   │   │   ├── intelligence-overlay.tsx # AI overlay for CSM
│   │   │   ├── 📂 views/               # 17 specialized views
│   │   │   │   ├── account-master-view.tsx
│   │   │   │   ├── business-context-view.tsx
│   │   │   │   ├── people-team-view.tsx
│   │   │   │   ├── platform-health-view.tsx
│   │   │   │   ├── risk-register-view.tsx
│   │   │   │   └── ... (12 more views)
│   │   │   └── ... (data files)
│   │   │
│   │   ├── 📂 revops/                  # RevOps workspace
│   │   │   ├── shell.tsx
│   │   │   ├── dashboard.tsx
│   │   │   └── revops-views.tsx
│   │   │
│   │   ├── 📂 salesops/                # SalesOps workspace
│   │   │   ├── shell.tsx
│   │   │   ├── dashboard.tsx
│   │   │   └── salesops-views.tsx
│   │   │
│   │   ├── 📂 personal/                # Personal workspace
│   │   │   ├── shell.tsx
│   │   │   ├── dashboard.tsx
│   │   │   └── personal-views.tsx
│   │   │
│   │   ├── domain-sidebar.tsx          # Shared domain navigation
│   │   ├── domain-types.ts             # Domain type definitions
│   │   └── spine-projection.ts         # Spine data projections
│   │
│   ├── 📂 business-ops/                # Business Ops workspace (10 views)
│   │   ├── dashboard.tsx
│   │   ├── accounts.tsx
│   │   ├── workflows.tsx
│   │   ├── workflow-canvas.tsx
│   │   ├── calendar-view.tsx
│   │   ├── analytics-view.tsx
│   │   └── ... (4 more files)
│   │
│   ├── 📂 sales/                       # Sales workspace (7 views)
│   │   ├── dashboard.tsx
│   │   ├── pipeline.tsx
│   │   ├── deals.tsx
│   │   ├── forecasting.tsx
│   │   └── ... (3 more files)
│   │
│   ├── 📂 marketing/                   # Marketing workspace (6 views)
│   │   ├── dashboard.tsx
│   │   ├── campaigns.tsx
│   │   ├── email-studio.tsx
│   │   └── ... (3 more files)
│   │
│   ├── 📂 auth/                        # Authentication pages
│   │   ├── login-page.tsx              # ✅ Uses Teal-Blue palette
│   │   └── signup-page.tsx             # ✅ Uses Teal-Blue palette
│   │
│   ├── 📂 onboarding/                  # User onboarding flow
│   │   └── onboarding-flow.tsx         # ✅ Uses Teal-Blue palette
│   │
│   ├── 📂 admin/                       # Admin & RBAC features
│   │   ├── tenant-manager.tsx
│   │   ├── rbac-manager.tsx
│   │   ├── user-management.tsx
│   │   ├── approval-workflows.tsx
│   │   └── ... (types & data)
│   │
│   ├── 📂 spine/                       # SSOT Spine system
│   │   ├── spine-client.tsx            # React hooks for Spine data
│   │   ├── readiness-bar.tsx           # Data readiness indicator
│   │   ├── domain-data-registry.ts     # Domain projections registry
│   │   └── types.ts
│   │
│   ├── 📂 goal-framework/              # OKR/Goal system
│   │   ├── goal-context.tsx
│   │   ├── goal-alignment-bar.tsx
│   │   └── goal-schema.ts
│   │
│   ├── 📂 document-storage/            # Document management
│   │   ├── document-storage.tsx
│   │   ├── types.ts
│   │   └── mock-data.ts
│   │
│   ├── 📂 notifications/               # Notification center
│   │   └── notification-center.tsx
│   │
│   ├── 📂 shared/                      # Shared components
│   │   └── analytics-shell.tsx
│   │
│   ├── 📂 ui/                          # Shadcn UI components (45+ files)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   └── ... (41 more components)
│   │
│   ├── 📂 figma/                       # Protected Figma utilities
│   │   └── ImageWithFallback.tsx       # 🔒 Protected - do not edit
│   │
│   ├── DashboardShell.tsx              # 🔄 Main workspace shell (23 instances to update)
│   ├── workspace-shell.tsx             # Workspace container
│   ├── sidebar.tsx                     # Main navigation sidebar
│   ├── top-bar.tsx                     # Top navigation bar
│   ├── intelligence-overlay-new.tsx    # 🔄 AI overlay (7 instances to update)
│   ├── intelligence-drawer.tsx         # AI drawer component
│   ├── command-palette.tsx             # Cmd+K palette
│   ├── ai-chat.tsx                     # AI chat interface
│   ├── dashboard-view.tsx              # 🔄 Dashboard view (1 instance to update)
│   ├── integrations-hub.tsx            # 🔄 Integrations hub (1 instance to update)
│   ├── architecture-visualization.tsx  # 🔄 Architecture diagram (6 instances to update)
│   ├── LayerAudit.tsx                  # 🔄 Layer audit view (1 instance to update)
│   ├── l1-module-content.tsx           # L1 module content
│   ├── profile-page.tsx                # User profile
│   ├── settings-page.tsx               # Settings page
│   ├── subscriptions-page.tsx          # Subscriptions management
│   └── placeholder-view.tsx            # Placeholder component
│
├── 📂 styles/                          # Global styles & design tokens
│   └── globals.css                     # ✅ Teal-Blue CSS variables system
│
├── 📂 utils/                           # Utility functions
│   ├── colors.ts                       # ✅ Centralized color palette (NEW)
│   └── 📂 supabase/
│       └── info.tsx
│
├── 📂 guidelines/                      # Project documentation
│   ├── ColorMigration.md               # ✅ Color migration guide (NEW)
│   └── Guidelines.md                   # Architecture guidelines
│
├── 📂 imports/                         # Figma imported assets
│   ├── IntegrateWiseBusinessOperationsDesign.tsx
│   ├── svg-*.ts                        # SVG vector graphics (6 files)
│   └── ... (5 more Figma component files)
│
├── 📂 supabase/functions/server/       # Backend API (Hono server)
│   ├── index.tsx                       # Main server entry
│   ├── gateway.tsx                     # API gateway
│   ├── spine.tsx                       # Spine SSOT logic
│   ├── intelligence.tsx                # AI intelligence layer
│   ├── domains.tsx                     # Domain projections
│   ├── pipeline.tsx                    # Data pipeline
│   └── kv_store.tsx                    # Key-value store
│
└── 📄 Attributions.md                  # Third-party attributions
```

---

## 🎨 Color System Architecture

### **Active Color Palette** ✅
Defined in **3 interconnected files:**

1. **`/styles/globals.css`** - CSS Variables (Design Tokens)
   - `:root` and `.dark` theme tokens
   - `--iw-*` brand color variables
   - Used by: All `website/*` components, domain shells

2. **`/utils/colors.ts`** - TypeScript Constants (NEW)
   - `COLORS` - Hex color constants
   - `TW_COLORS` - Tailwind-compatible strings
   - `UI_COLORS` - Contextual mappings
   - `GRADIENTS` - Gradient definitions
   - Helper functions: `withOpacity()`, `bgColor()`, `textColor()`

3. **`/guidelines/ColorMigration.md`** - Migration Tracking
   - Legacy → new color mappings
   - File-by-file migration checklist
   - Usage examples & patterns

### **Color Mapping Reference**

| Legacy Color | New Color | Name | Usage |
|-------------|-----------|------|-------|
| `#3F5185` | `#0EA5E9` | Sky Blue | Primary buttons, accents, links |
| `#1E2A4A` | `#0C1222` | Navy Black | Sidebar, dark sections, headers |
| `#344573` | `#0284C7` | Primary Dark | Gradients, hover states |
| N/A | `#14B8A6` | Teal | Accent color, success indicators |
| N/A | `#F54476` | Pink | CTA buttons, brand highlights |

---

## 🏗️ Architecture Layers (12-Layer System)

```
┌─────────────────────────────────────────────────────────┐
│  L12: Intelligence Overlay (AI Agents)                  │
├─────────────────────────────────────────────────────────┤
│  L11: Goal Framework (OKRs)                             │
├─────────────────────────────────────────────────────────┤
│  L10: Domain Shells (Account Success, RevOps, etc.)     │
├─────────────────────────────────────────────────────────┤
│  L9:  Workspace Contexts (10 switchable contexts)       │
├─────────────────────────────────────────────────────────┤
│  L8:  L1 Modules (Dashboard views)                      │
├─────────────────────────────────────────────────────────┤
│  L7:  Integration Hub                                   │
├─────────────────────────────────────────────────────────┤
│  L6:  Edge Corrections Layer                            │
├─────────────────────────────────────────────────────────┤
│  L5:  Spine (SSOT - Single Source of Truth)             │
├─────────────────────────────────────────────────────────┤
│  L4:  Event Normalization Pipeline                      │
├─────────────────────────────────────────────────────────┤
│  L3:  API Gateway                                       │
├─────────────────────────────────────────────────────────┤
│  L2:  Platform Adapters                                 │
├─────────────────────────────────────────────────────────┤
│  L1:  External Platforms (Salesforce, HubSpot, etc.)    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Color Migration Status

### ✅ **Completed (5 files)**
- `/App.tsx` - Router + page flash fix
- `/components/landing/Hero.tsx` - Hero section
- `/components/landing/Audience.tsx` - Audience section
- `/components/landing/AudiencePage.tsx` - Audience page
- `/utils/colors.ts` - Color system (NEW)
- `/guidelines/ColorMigration.md` - Migration guide (NEW)

### ✅ **Compliant (6 files - no changes needed)**
- All `/components/website/*` - Uses CSS variable system
- All `/components/domains/*` - Uses design tokens
- `/components/auth/*` - Already using Teal-Blue
- `/components/onboarding/*` - Already using Teal-Blue

### 🔄 **Pending Update (16 files, 113 instances)**

**Workspace Components (6 files, 39 instances):**
1. `DashboardShell.tsx` - 23 instances
2. `intelligence-overlay-new.tsx` - 7 instances
3. `architecture-visualization.tsx` - 6 instances
4. `dashboard-view.tsx` - 1 instance
5. `integrations-hub.tsx` - 1 instance
6. `LayerAudit.tsx` - 1 instance

**Landing Pages (10 files, 74 instances):**
1. `Navbar.tsx` - 9 instances
2. `Pillars.tsx` - 9 instances
3. `Pricing.tsx` - 9 instances
4. `PricingPage.tsx` - 15 instances
5. `TechnicalPage.tsx` - 13+ instances
6. `sections.tsx` - 20+ instances
7. `Comparison.tsx` - 5 instances
8. `Differentiators.tsx` - 4 instances
9. `Integrations.tsx` - 4 instances
10. `DifferentiatorsDetail.tsx` - 3 instances

---

## 📦 Key Features & Capabilities

### **10 Switchable Workspace Contexts**
1. Website - Content management
2. Sales - Pipeline, deals, forecasting
3. Marketing - Campaigns, email, social
4. Business Ops - Workflows, accounts, tasks
5. Customer Success - Health scores, renewals
6. Finance - Revenue, invoicing
7. Product - Roadmap, features
8. Engineering - Integrations, API logs
9. Admin - RBAC, tenant management
10. Analytics - Cross-workspace insights

### **4 Domain "Deep Dive" Shells**
1. **Account Success** - 17+ specialized CSM views
2. **Personal** - Individual productivity workspace
3. **RevOps** - Revenue operations intelligence
4. **SalesOps** - Sales operations analytics

### **AI Intelligence Overlay**
- ChurnShield, DealPredictor, LeadScorer agents
- Contextual AI chat in every workspace
- Intelligence drawer with real-time insights

### **SSOT Spine System**
- Canonical data normalization
- Multi-source entity resolution
- Domain-specific projections
- Real-time data readiness tracking

---

## 🔗 File Relationships & Dependencies

### **Import Patterns**

```typescript
// Color system imports
import { COLORS, TW_COLORS, UI_COLORS } from '@/utils/colors';

// Spine data hooks
import { useSpineProjection } from '@/components/spine/spine-client';

// UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Domain shells
import { AccountSuccessShell } from '@/components/domains/account-success/shell';
```

### **Critical Dependencies**

```
App.tsx
  ├─→ /routes.ts (Router configuration)
  │
  ├─→ DashboardShell.tsx (Main workspace)
  │   ├─→ sidebar.tsx (Navigation)
  │   ├─→ top-bar.tsx (Top navigation)
  │   ├─→ intelligence-overlay-new.tsx (AI layer)
  │   └─→ [Context-specific components]
  │
  └─→ /components/landing/* (Marketing site)
      ├─→ Navbar.tsx (Shared navigation)
      └─→ Footer.tsx (Shared footer)
```

---

## 🚀 Quick Reference

### **Color Migration Commands**

```typescript
// Old pattern (needs updating)
className="bg-[#3F5185] text-white"

// New pattern - Option 1: Direct hex
className="bg-[#0EA5E9] text-white"

// New pattern - Option 2: Color constants
import { TW_COLORS } from '@/utils/colors';
className={`bg-${TW_COLORS.primary} text-white`}

// New pattern - Option 3: CSS variables
className="bg-[var(--iw-blue)] text-white"
```

### **Protected Files** 🔒
- `/components/figma/ImageWithFallback.tsx` - Do not modify

### **Next Steps**
1. ✅ Color system established (`/utils/colors.ts`)
2. ✅ Migration guide created (`/guidelines/ColorMigration.md`)
3. 🔄 Update workspace components (6 files)
4. 🔄 Update landing pages (10 files)
5. ⏭️ Visual QA & consistency check
6. ⏭️ Remove legacy color references

---

**Project Structure Version:** 1.0  
**Last Verified:** February 12, 2026  
**Total Files:** 180+  
**Architecture:** 12-layer with SSOT Spine
