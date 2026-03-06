# TRUE Unified Shell Proposal

## Problem
Current Next.js app has **3 competing shells** + **V2 domain shells not integrated**:

| Shell | Location | Status |
|-------|----------|--------|
| UnifiedShell | `components/layouts/unified-shell.tsx` | ✅ Currently used |
| AppShell | `components/app-shell.tsx` | ❌ Orphaned |
| OsShell | `components/layouts/os-shell.tsx` | ❌ Orphaned |
| AccountSuccessShell (V2) | `apps/business-operations-design-v2/...` | ❌ Not integrated |
| RevOpsShell (V2) | `apps/business-operations-design-v2/...` | ❌ Not integrated |
| SalesOpsShell (V2) | `apps/business-operations-design-v2/...` | ❌ Not integrated |

## Solution: TRUE Unified Shell

Merge V2 domain shells with Next.js backend.

### Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TRUE UNIFIED SHELL                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────┬──────────────────────────────────────────────────┐ │
│  │            │  TOP BAR                                          │ │
│  │   MAIN     │  [Logo] [CTX: CS ▼] [Breadcrumb]    [🔔] [👤]    │ │
│  │  SIDEBAR   ├──────────────────────────────────────────────────┤ │
│  │            │                                                   │ │
│  │ • Today    │           CONTENT AREA                            │ │
│  │ • Tasks    │                                                   │ │
│  │ • Calendar │    ┌─────────────────────────────────────────┐    │ │
│  │ • Docs     │    │                                         │    │ │
│  │            │    │   V2 Domain Shell Injected Here         │    │ │
│  │ ─────────  │    │                                         │    │ │
│  │ Deep Dive →│    │   • AccountSuccessShell                 │    │ │
│  │ • Risk     │    │   • RevOpsShell                         │    │ │
│  │ • Health   │    │   • SalesOpsShell                       │    │ │
│  │ • Success  │    │   • PersonalShell                       │    │ │
│  │            │    │                                         │    │ │
│  │ ─────────  │    │   Or V2 views directly:                 │    │ │
│  │ • AI 🤖    │    │   • account-master-view                 │    │ │
│  │ • Settings │    │   • risk-register-view                  │    │ │
│  │            │    │   • (17 CS views total)                 │    │ │
│  │            │    │                                         │    │ │
│  └────────────┴────┴─────────────────────────────────────────┘    │ │
│                                                                     │
│  L2 INTELLIGENCE (⌘J)                                               │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ • Signals • Think • Evidence • Act • Audit                     ││
│  └────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

## Implementation

### File Structure

```
app/(app)/
├── layout.tsx                    # TRUE Unified Shell wrapper
├── page.tsx                      # Hub home (redirect to default CTX)
├── [ctx]/                        # Context routes
│   ├── layout.tsx                # CTX-specific layout
│   ├── page.tsx                  # CTX dashboard
│   └── deep/                     # Deep dive routes
│       └── [view]/page.tsx       # V2 domain views
```

### Components

```
components/
├── shell/
│   ├── UnifiedShell.tsx          # Main shell container
│   ├── MainSidebar.tsx           # Main navigation (Today, Tasks, etc.)
│   ├── TopBar.tsx                # Header with CTX switcher
│   └── IntelligencePanel.tsx     # L2 overlay/drawer
│
├── domains/                      # V2 shells (copied & adapted)
│   ├── account-success/
│   │   ├── Shell.tsx             # AccountSuccessShell
│   │   ├── Dashboard.tsx
│   │   └── views/                # 17 views
│   │       ├── AccountMasterView.tsx
│   │       ├── RiskRegisterView.tsx
│   │       └── ...
│   ├── revops/
│   │   ├── Shell.tsx
│   │   └── views/
│   ├── salesops/
│   │   ├── Shell.tsx
│   │   └── views/
│   └── personal/
│       ├── Shell.tsx
│       └── views/
│
└── navigation/
    ├── CTXSwitcher.tsx           # Context dropdown
    ├── CommandPalette.tsx        # ⌘K search
    └── Breadcrumb.tsx            # Navigation path
```

## What Gets Replaced

| Current | Replacement |
|---------|-------------|
| `UnifiedShell` | New `UnifiedShell` with domain injection |
| `CTXSidebar` | `MainSidebar` (simpler, no CTX in sidebar) |
| `AppShell` | ❌ Delete |
| `OsShell` | ❌ Delete |
| `os-shell-registry.ts` | ❌ Delete (use V2 shells) |

## What Gets Integrated

| V2 Component | Integration |
|--------------|-------------|
| `AccountSuccessShell` | Injected into `/cs/*` routes |
| `RevOpsShell` | Injected into `/revops/*` routes |
| `SalesOpsShell` | Injected into `/salesops/*` routes |
| `PersonalShell` | Injected into `/personal/*` routes |
| `DomainSidebar` | Used inside each domain shell |
| 17 CS views | Routed to `/cs/deep/[view]` |

## Routing

```typescript
// Current: Fragmented
// - /cs/home → Generic page
// - /cs/spine → Generic spine
// - Missing: Deep dive views

// NEW: Unified with V2
const ROUTES = {
  // Hub
  '/': 'Hub Home',
  
  // Contexts with V2 shells
  '/cs': 'AccountSuccessShell',
  '/cs/deep/account-master': 'AccountMasterView',
  '/cs/deep/risk-register': 'RiskRegisterView',
  // ... 15 more deep views
  
  '/revops': 'RevOpsShell',
  '/revops/pipeline': 'PipelineView',
  '/revops/forecast': 'ForecastView',
  // ... 6 more views
  
  '/salesops': 'SalesOpsShell',
  '/salesops/pipeline': 'PipelineKanban',
  '/salesops/deals': 'DealsView',
  // ... 5 more views
  
  '/personal': 'PersonalShell',
  
  // L2 Cognitive (unified)
  '/signals': 'SignalsView',
  '/think': 'ThinkView',
  '/act': 'ActView',
  '/govern': 'GovernView',
  '/audit': 'AuditView',
};
```

## Data Flow

```
User clicks "Risk Register"
  ↓
Route: /cs/deep/risk-register
  ↓
Main Shell renders (sidebar, topbar)
  ↓
Content area injects RiskRegisterView (from V2)
  ↓
V2 view calls Next.js API: /api/risk-register
  ↓
Data displays with V2 styling + Next.js backend
```

## Steps to Implement

### Step 1: Delete Orphaned Shells
```bash
rm components/app-shell.tsx
rm components/layouts/os-shell.tsx
rm config/os-shell-registry.ts
```

### Step 2: Copy V2 Shells
```bash
cp -r apps/business-operations-design-v2/src/components/domains/* \
  apps/web/src/components/domains/
```

### Step 3: Adapt V2 Shells
Update imports:
- `useSpine` → use Next.js spine client
- API calls → use Next.js `/api/*` routes
- Styles → merge with Next.js Tailwind config

### Step 4: Create New UnifiedShell
```typescript
// components/shell/UnifiedShell.tsx
export function UnifiedShell({ children }) {
  return (
    <div className="h-screen flex">
      <MainSidebar />           {/* Today, Tasks, Calendar */}
      <div className="flex-1 flex flex-col">
        <TopBar />              {/* CTX switcher */}
        <main>{children}</main>  {/* V2 shell injected here */}
      </div>
      <IntelligencePanel />     {/* L2 overlay */}
    </div>
  );
}
```

### Step 5: Route Mapping
```typescript
// app/(app)/[ctx]/layout.tsx
export default function CtxLayout({ params, children }) {
  const shell = getShellForCTX(params.ctx); // Returns V2 shell
  return <shell.Layout>{children}</shell.Layout>;
}
```

## Result

| Before | After |
|--------|-------|
| 3 competing shells | 1 unified shell |
| V2 shells unused | V2 shells integrated |
| Orphaned pages | Clean routing |
| CTX in sidebar | CTX in topbar |
| Generic views | Rich V2 domain views |

## Migration Checklist

- [ ] Delete `AppShell`
- [ ] Delete `OsShell`
- [ ] Delete `os-shell-registry.ts`
- [ ] Copy V2 domain shells
- [ ] Update V2 imports for Next.js
- [ ] Create new `UnifiedShell`
- [ ] Route V2 views
- [ ] Test all domains
- [ ] Deploy
