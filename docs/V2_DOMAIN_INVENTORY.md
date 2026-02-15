# V2 Domain Inventory - Complete

## Source
**Location**: `apps/business-operations-design-v2/src/components/domains/`

## Domains Available (4 Complete Shells)

### 1. Account Success ⭐ MOST COMPLETE
```
domains/account-success/
├── shell.tsx                    # Domain container
├── dashboard.tsx                # Overview dashboard
├── intelligence-overlay.tsx     # L2 AI overlay
├── accounts-view.tsx            # Account list
├── contacts-view.tsx            # Contact management
├── documents-view.tsx           # Document hub
├── meetings-view.tsx            # Meetings
├── projects-view.tsx            # Projects
├── tasks-view.tsx               # Task management
└── views/                       # 17 SPECIALIZED VIEWS
    ├── account-master-view.tsx
    ├── api-portfolio-view.tsx
    ├── business-context-view.tsx
    ├── capabilities-view.tsx
    ├── company-growth-view.tsx
    ├── engagement-log-view.tsx
    ├── initiatives-view.tsx
    ├── insights-view.tsx
    ├── people-team-view.tsx
    ├── platform-health-view.tsx
    ├── product-client-view.tsx
    ├── risk-register-view.tsx
    ├── stakeholder-outcomes-view.tsx
    ├── strategic-objectives-view.tsx
    ├── success-plans-view.tsx
    ├── task-manager-view.tsx
    └── value-streams-view.tsx
```

### 2. RevOps
```
domains/revops/
├── shell.tsx                    # Domain container
├── dashboard.tsx                # Revenue dashboard
└── revops-views.tsx             # 8 VIEWS
    ├── PipelineView
    ├── ForecastView
    ├── QuotaView
    ├── AnalyticsView
    ├── CohortView
    ├── TeamView
    └── MetricsView
```

### 3. SalesOps
```
domains/salesops/
├── shell.tsx                    # Domain container
├── dashboard.tsx                # Sales dashboard
└── salesops-views.tsx           # 7 VIEWS
    ├── PipelineKanban
    ├── DealsView
    ├── ContactsView
    ├── ActivitiesView
    ├── SequencesView
    └── SalesAnalyticsView
```

### 4. Personal
```
domains/personal/
├── shell.tsx                    # Domain container
├── dashboard.tsx                # Personal dashboard
└── personal-views.tsx           # Personal views
```

## Shared Domain Components

```
domains/
├── domain-sidebar.tsx           # Reusable domain sidebar
├── domain-types.ts              # Domain configurations
└── spine-projection.ts          # Data projections
```

## Domain Configuration

```typescript
// domain-types.ts
export type DomainId = 
  | "integratewise-apac"    // Admin console
  | "personal"              // Personal workspace
  | "account-success"       // Customer Success
  | "revops"                // Revenue Operations
  | "salesops";             // Sales Operations

// Each domain has:
// - Unique color gradient
// - Icon
// - Suggested connectors
// - Default role
// - Spine projection type
```

## Shell Architecture (All Domains)

```
┌─────────────────────────────────────────────────────────┐
│  Domain Shell Pattern                                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┬──────────────────────────────────────────┐│
│  │Domain   │  Top Bar (Domain Label + Actions)        ││
│  │Sidebar  ├──────────────────────────────────────────┤│
│  │(240px)  │                                          ││
│  │         │           VIEW CONTENT                   ││
│  │ • View1 │          (Switchable)                    ││
│  │ • View2 │                                          ││
│  │ • View3 │                                          ││
│  │         │                                          ││
│  └─────────┴──────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## Design System to Follow

**From V2 + Modern SaaS Design**:
- **Primary**: Purple `#3F3182` (Modern SaaS) OR Navy `#2D4A7C` (V2)
- **Accent**: Pink `#E94B8A`
- **Surface**: Dark theme `#0C1222`, `#151B2B`, `#1E2535`
- **Text**: White primary, muted secondary
- **Tokens**: 7-layer design token system

## Implementation Path

### Option A: Use V2 As-Is (Recommended)
- Use existing domain shells
- Use existing sidebar components
- Use existing view components
- Integrate with Next.js backend

### Option B: Merge with Modern SaaS Design
- Keep V2 component structure
- Apply Modern SaaS color system
- Use 7-layer token architecture
- Update to Universal Hub pattern

## What We Have

| Component | Status | Location |
|-----------|--------|----------|
| Account Success Shell | ✅ Complete | `domains/account-success/shell.tsx` |
| RevOps Shell | ✅ Complete | `domains/revops/shell.tsx` |
| SalesOps Shell | ✅ Complete | `domains/salesops/shell.tsx` |
| Personal Shell | ✅ Complete | `domains/personal/shell.tsx` |
| Domain Sidebar | ✅ Complete | `domains/domain-sidebar.tsx` |
| 17 CS Views | ✅ Complete | `domains/account-success/views/` |
| 8 RevOps Views | ✅ Complete | `domains/revops/revops-views.tsx` |
| 7 SalesOps Views | ✅ Complete | `domains/salesops/salesops-views.tsx` |

## Recommendation

**Use V2 domain shells directly** - they're production-ready with:
- Complete navigation
- View switching
- Responsive design
- Dark theme
- TypeScript types
- Spine integration

Just need to:
1. Copy domain components to Next.js
2. Wire up to backend APIs
3. Add auth protection
4. Deploy
