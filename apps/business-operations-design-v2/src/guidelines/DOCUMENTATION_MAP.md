# IntegrateWise Documentation Map

```
                    📚 INTEGRATEWIISE DOCUMENTATION STRUCTURE
                    =========================================

┌─────────────────────────────────────────────────────────────────────────────┐
│                          🏠 ROOT DIRECTORY                                   │
│                                                                              │
│  README.md ─────────────────────┐                                          │
│  Quick start, overview, links   │                                          │
│  Status: ✅ Complete             │                                          │
│                                  │                                          │
│  PROJECT_STRUCTURE.md ──────────┤                                          │
│  Complete 180+ file directory   │                                          │
│  Status: ✅ Complete             │                                          │
│                                  │                                          │
│  App.tsx ───────────────────────┤                                          │
│  Entry point, router setup      │                                          │
│  Status: ✅ Updated (Teal-Blue)  │                                          │
└──────────────────────────────────┘                                          │
                │                                                              │
                ├──────────────┬──────────────┬──────────────┬────────────────┤
                │              │              │              │                │
                ▼              ▼              ▼              ▼                ▼
                                                                              
    ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐
    │  📂 styles/   │  │  📂 utils/    │  │  📂 guidelines│  │ 📂 components│
    └───────────────┘  └───────────────┘  └───────────────┘  └──────────────┘
            │                  │                  │                   │
            │                  │                  │                   │
            ▼                  ▼                  ▼                   ▼

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐
│  globals.css     │  │  colors.ts       │  │  INDEX.md        │  │  120+ files    │
│  ─────────────   │  │  ──────────      │  │  ────────        │  │  ──────────    │
│  CSS variables   │  │  TS constants    │  │  Doc navigator   │  │  React comps   │
│  Design tokens   │  │  Helper funcs    │  │  Quick ref       │  │  Workspaces    │
│  :root & .dark   │  │  COLORS obj      │  │  Status table    │  │  Landing site  │
│                  │  │  TW_COLORS       │  │  Links to all    │  │  Domains       │
│  ✅ Teal-Blue    │  │  UI_COLORS       │  │                  │  │  ✅/🔄 Mixed   │
│  ✅ Complete     │  │  ✅ Complete     │  │  ✅ Complete     │  │  Status        │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └────────────────┘
        │                     │                      │                      │
        │                     │                      │                      │
        └─────────────────────┴──────────────────────┴──────────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │  ColorMigration.md           │
                        │  ──────────────────           │
                        │  Migration guide             │
                        │  File-by-file checklist      │
                        │  Usage examples              │
                        │  Before/after patterns       │
                        │                              │
                        │  ✅ Complete                 │
                        └──────────────────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │  Guidelines.md               │
                        │  ──────────────               │
                        │  Architecture principles     │
                        │  System design               │
                        │  12-layer overview           │
                        │                              │
                        │  ✅ Complete                 │
                        └──────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                           📊 COLOR SYSTEM FLOW
═══════════════════════════════════════════════════════════════════════════════

                            Legacy Colors (OLD)
                            ───────────────────
                            #3F5185 (Old Blue)
                            #1E2A4A (Old Navy)
                                    │
                                    │ MIGRATION
                                    │
                                    ▼
                            New Colors (ACTIVE)
                            ──────────────────
                            #0EA5E9 (Sky Blue)
                            #14B8A6 (Teal)
                            #0C1222 (Navy Black)
                            #F54476 (Pink CTA)
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │ CSS Vars     │ │ TS Constants │ │ Direct Hex   │
            │ ──────────   │ │ ──────────── │ │ ──────────   │
            │ var(--iw-*)  │ │ COLORS.prim  │ │ className=   │
            │              │ │ TW_COLORS.*  │ │ "bg-[#...]"  │
            │ Used by:     │ │              │ │              │
            │ • website/*  │ │ Used by:     │ │ Used by:     │
            │ • domains/*  │ │ • New comps  │ │ • Landing/*  │
            └──────────────┘ └──────────────┘ └──────────────┘


═══════════════════════════════════════════════════════════════════════════════
                         🎯 MIGRATION STATUS TRACKER
═══════════════════════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────────────────────┐
    │                    PROGRESS: 11% Complete                            │
    │  [████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  17/150+ files        │
    └─────────────────────────────────────────────────────────────────────┘

    ✅ COMPLETED (5 files)
    ├── App.tsx
    ├── landing/Hero.tsx
    ├── landing/Audience.tsx
    ├── landing/AudiencePage.tsx
    └── utils/colors.ts (NEW)

    ✅ COMPLIANT (12+ files - no changes needed)
    ├── website/* (6 files)
    ├── domains/* (4+ shells)
    ├── auth/* (2 files)
    └── onboarding/* (1 file)

    🔄 WORKSPACE COMPONENTS (6 files, 39 instances)
    ├── DashboardShell.tsx               [█████████████████████  ] 23
    ├── intelligence-overlay-new.tsx     [███████                ] 7
    ├── architecture-visualization.tsx   [██████                 ] 6
    ├── dashboard-view.tsx               [█                      ] 1
    ├── integrations-hub.tsx             [█                      ] 1
    └── LayerAudit.tsx                   [█                      ] 1

    🔄 LANDING PAGES (10 files, 74 instances)
    ├── PricingPage.tsx                  [███████████████        ] 15
    ├── TechnicalPage.tsx                [█████████████          ] 13+
    ├── sections.tsx                     [████████████████████   ] 20+
    ├── Navbar.tsx                       [█████████              ] 9
    ├── Pillars.tsx                      [█████████              ] 9
    ├── Pricing.tsx                      [█████████              ] 9
    ├── Comparison.tsx                   [█████                  ] 5
    ├── Differentiators.tsx              [████                   ] 4
    ├── Integrations.tsx                 [████                   ] 4
    ├── DifferentiatorsDetail.tsx        [███                    ] 3
    ├── GenericPage.tsx                  [██                     ] 2
    └── Footer.tsx                       [█                      ] 1


═══════════════════════════════════════════════════════════════════════════════
                         📖 DOCUMENTATION QUICK LINKS
═══════════════════════════════════════════════════════════════════════════════

    START HERE
    ──────────
    📄 /README.md
       └─→ Project overview, quick start, key stats

    DETAILED REFERENCE
    ──────────────────
    📄 /PROJECT_STRUCTURE.md
       └─→ Complete 180+ file directory tree
       └─→ Architecture diagrams
       └─→ Component relationships
       └─→ Import patterns

    COLOR SYSTEM
    ────────────
    📄 /guidelines/ColorMigration.md
       └─→ Migration checklist
       └─→ Before/after examples
       └─→ File-by-file tracking

    📄 /utils/colors.ts
       └─→ TypeScript constants
       └─→ Helper functions
       └─→ Gradient definitions

    📄 /styles/globals.css
       └─→ CSS variables
       └─→ Light/dark themes
       └─→ Design tokens

    NAVIGATION
    ──────────
    📄 /guidelines/INDEX.md
       └─→ Documentation hub
       └─→ Quick reference tables
       └─→ Status legends
       └─→ Search tips

    ARCHITECTURE
    ────────────
    📄 /guidelines/Guidelines.md
       └─→ System design principles
       └─→ 12-layer architecture
       └─→ Development patterns


═══════════════════════════════════════════════════════════════════════════════
                          🔍 FIND INFORMATION FAST
═══════════════════════════════════════════════════════════════════════════════

    NEED TO...                           GO TO...
    ──────────                           ────────
    Get project overview                 /README.md
    Find a specific file                 /PROJECT_STRUCTURE.md
    Check migration status               /guidelines/ColorMigration.md
    Use color constants                  /utils/colors.ts
    Understand architecture              /guidelines/Guidelines.md
    Navigate all docs                    /guidelines/INDEX.md
    Check CSS variables                  /styles/globals.css

    SEARCH COMMANDS
    ───────────────
    # Find old colors
    grep -r "#3F5185\|#1E2A4A" components/

    # Find color imports
    grep -r "from '@/utils/colors'" components/

    # View file structure
    cat PROJECT_STRUCTURE.md

    # Check migration progress
    cat guidelines/ColorMigration.md


═══════════════════════════════════════════════════════════════════════════════
                            ✨ KEY RELATIONSHIPS
═══════════════════════════════════════════════════════════════════════════════

    globals.css ──────┐
    (CSS vars)        │
                      ├──→ website/* components (uses var(--iw-*))
    colors.ts ────────┤
    (TS constants)    │
                      └──→ New components (imports COLORS)
                      
    ColorMigration.md ────→ Tracks all updates
                      │
                      └──→ References colors.ts patterns
                      
    PROJECT_STRUCTURE.md ──→ Maps all 180+ files
                      │
                      └──→ Shows component relationships
                      
    INDEX.md ──────────────→ Links everything together
                      │
                      └──→ Quick reference hub


═══════════════════════════════════════════════════════════════════════════════
                              📊 STATISTICS
═══════════════════════════════════════════════════════════════════════════════

    Total Files:              180+
    React Components:         120+
    Documentation Files:      5
    Color System Files:       3
    
    Migration Progress:       11%
    Files Updated:            5
    Files Compliant:          12+
    Files Remaining:          16
    Instances Remaining:      113
    
    Workspace Contexts:       10
    Domain Shells:            4
    Specialized Views:        30+
    Architecture Layers:      12
    UI Components:            45+


═══════════════════════════════════════════════════════════════════════════════

Version: 1.0 | Last Updated: February 12, 2026 | Status: 🟡 Migration in Progress

═══════════════════════════════════════════════════════════════════════════════
```
