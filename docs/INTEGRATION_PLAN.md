# 🔧 Complete Integration Plan — Bringing All Components Intact

## 📊 Component Inventory Summary

### Total Components Discovered: **115+ files** across 16 folders

| Folder | Files | Purpose | Status | Integration Priority |
|--------|-------|---------|--------|---------------------|
| **admin/** | 6 | User management, RBAC, tenants, approvals | ✅ KEEP | P1 - Admin view |
| **auth/** | 2 | Login, SignUp | ✅ KEEP | P0 - Already integrated |
| **business-ops/** | 9 | Accounts, analytics, calendar, docs, tasks, workflows | ✅ KEEP | P1 - BizOps domain |
| **domains/** | 25+ | Account Success (17 views), Personal, RevOps, SalesOps | ⚠️ REFACTOR | P0 - Core architecture |
| **document-storage/** | 3 | Document management system | ✅ KEEP | P2 - Feature module |
| **goal-framework/** | 3 | Goal alignment, schema, context | ✅ KEEP | P1 - Cross-domain |
| **landing/** | 21 | Marketing site pages | ✅ KEEP | P3 - Public site |
| **marketing/** | 6 | Campaigns, email, forms, attribution | ✅ KEEP | P1 - Marketing domain |
| **notifications/** | 1 | Notification center | ✅ KEEP | P1 - Global feature |
| **onboarding/** | 2 | OLD + NEW onboarding flows | ⚠️ CONSOLIDATE | P0 - Core flow |
| **sales/** | 7 | Pipeline, deals, forecasting, quotes | ✅ KEEP | P1 - Sales domain |
| **shared/** | 1 | Analytics shell (reusable) | ✅ KEEP | P2 - Shared utilities |
| **spine/** | 4 | Data registry, readiness bar, client, types | ✅ KEEP | P0 - Core infrastructure |
| **ui/** | 52 | Shadcn components (accordion, dialog, etc.) | ✅ KEEP | P0 - Design system |
| **website/** | 6 | Blog, pages, SEO, theme, media | ✅ KEEP | P3 - CMS features |
| **workspace/** | 3 | NEW architecture (config, loader, shell) | ✅ KEEP | P0 - Core architecture |

**Root-level components:** 13 additional files (workspace-shell.tsx, sidebar.tsx, command-palette.tsx, etc.)

---

## 🎯 Architecture Conflict Analysis

### ❌ **Problem: Two Competing Architectures**

**OLD Architecture (workspace-shell.tsx):**
```
- 10 contexts (CTX_CS, CTX_SALES, CTX_SUPPORT, etc.)
- Context switcher dropdown in sidebar
- Modules mapped per context (CTX_MODULES)
- Uses: TopBar, Sidebar, L1ModuleContent
- Deeply integrated with spine-client
```

**NEW Architecture (workspace-shell-new.tsx):**
```
- 2 views (Personal, Work)
- 12 domains (CUSTOMER_SUCCESS, SALES, REVOPS, etc.)
- View tabs in header (not dropdown)
- Uses: workspace-config.ts for domain navigation
- No context switcher
```

### 🔥 **Critical Conflicts:**

1. **`/components/domains/` has deep Account Success views (17 files) that expect OLD architecture**
2. **`workspace-shell.tsx` (OLD) vs `workspace-shell-new.tsx` (NEW)**
3. **`onboarding-flow.tsx` (OLD) vs `onboarding-flow-new.tsx` (NEW)**
4. **Domain folders (account-success, personal, revops, salesops) use OLD shell pattern**
5. **CTX-based routing vs Domain-based routing**

---

## 🧩 Integration Strategy

### **Phase 1: Consolidation (P0 — Critical)**

#### 1.1 Onboarding Flow
**Action:** Consolidate onboarding flows

```
KEEP: onboarding-flow-new.tsx (4-step flow)
DEPRECATE: onboarding-flow.tsx (5-step old flow)

Why?
- New flow matches your spec (domain, connectors, files, accelerator)
- Old flow uses OrgType + CTXEnum (deprecated)
- New flow is cleaner and simpler
```

**Migration Path:**
- ✅ onboarding-flow-new.tsx is already complete
- ❌ Remove onboarding-flow.tsx references from App.tsx (already done)
- ⚠️ Update any links in docs/guides

---

#### 1.2 Workspace Shell
**Action:** Bridge OLD and NEW architectures

**Option A: Clean Break (Recommended)**
```typescript
// Use NEW architecture as default
<WorkspaceShellNew 
  domain={selectedDomain} 
  userName={userName} 
/>

// OLD architecture available via feature flag
if (FEATURE_FLAGS.useLegacyWorkspace) {
  return <WorkspaceShell initialCtx={activeCtx} />
}
```

**Option B: Gradual Migration**
```typescript
// Map OLD contexts to NEW domains
const CTX_TO_DOMAIN_MAP: Record<CTXEnum, Domain> = {
  CTX_CS: "CUSTOMER_SUCCESS",
  CTX_SALES: "SALES",
  CTX_BIZOPS: "BIZOPS",
  CTX_MARKETING: "MARKETING",
  CTX_PM: "PRODUCT_ENGINEERING",
  CTX_SUPPORT: "SERVICE",
  CTX_TECH: "IT_ADMIN",
  CTX_HR: "PERSONAL",
  CTX_FINANCE: "FINANCE",
  CTX_LEGAL: "PERSONAL",
};

// Wrapper component
function WorkspaceShellUnified({ domain, userName, children }) {
  const useNewArchitecture = true; // Toggle
  
  if (useNewArchitecture) {
    return <WorkspaceShellNew domain={domain} userName={userName} />;
  } else {
    const ctx = DOMAIN_TO_CTX_MAP[domain];
    return <WorkspaceShell initialCtx={ctx} />;
  }
}
```

**Recommendation:** Option A (Clean Break)
- Your NEW architecture is superior
- OLD architecture has too much complexity
- Gradual migration adds tech debt

---

#### 1.3 Domain Deep Dives
**Action:** Refactor `/components/domains/` structure

**Current Structure:**
```
domains/
├── account-success/
│   ├── shell.tsx (uses OLD architecture)
│   ├── dashboard.tsx
│   ├── accounts-view.tsx
│   ├── views/ (17 deep views)
│   └── ...
├── personal/
│   ├── shell.tsx (uses OLD architecture)
│   └── ...
├── revops/
│   ├── shell.tsx (uses OLD architecture)
│   └── ...
└── salesops/
    ├── shell.tsx (uses OLD architecture)
    └── ...
```

**Problem:** Each domain has its own `shell.tsx` that wraps OLD architecture

**Solution:**
```
Step 1: Remove domain-specific shells
- DELETE: domains/account-success/shell.tsx
- DELETE: domains/personal/shell.tsx
- DELETE: domains/revops/shell.tsx
- DELETE: domains/salesops/shell.tsx

Step 2: Use NEW WorkspaceShellNew as universal shell
- WorkspaceShellNew renders domain-specific content based on workspace-config.ts

Step 3: Keep domain-specific views as content modules
- KEEP: domains/account-success/views/* (17 views)
- KEEP: domains/account-success/dashboard.tsx
- KEEP: domains/account-success/accounts-view.tsx
- etc.

Step 4: Wire views into NEW navigation
- Update workspace-config.ts navigation paths to load these views
```

**Example:**
```typescript
// In workspace-config.ts
CUSTOMER_SUCCESS: {
  workNavigation: [
    {
      label: "Core",
      items: [
        { 
          id: "dashboard", 
          label: "Dashboard", 
          icon: "LayoutDashboard", 
          path: "/work/dashboard",
          component: () => import("./domains/account-success/dashboard") // 👈 WIRE HERE
        },
        { 
          id: "accounts", 
          label: "Accounts", 
          icon: "Building2", 
          path: "/work/accounts",
          component: () => import("./domains/account-success/accounts-view") // 👈 WIRE HERE
        },
      ]
    }
  ]
}
```

---

### **Phase 2: Domain Content Wiring (P1 — Important)**

#### 2.1 Map Existing Components to NEW Domains

| NEW Domain | Existing Components to Wire | Location |
|------------|----------------------------|----------|
| **CUSTOMER_SUCCESS** | dashboard.tsx, accounts-view.tsx, contacts-view.tsx, meetings-view.tsx, tasks-view.tsx, documents-view.tsx, projects-view.tsx, csm-calendar.tsx, + 17 deep views | `/components/domains/account-success/` |
| **SALES** | dashboard.tsx, pipeline.tsx, deals.tsx, contacts.tsx, forecasting.tsx, activities.tsx, quotes.tsx | `/components/sales/` |
| **MARKETING** | dashboard.tsx, campaigns.tsx, email-studio.tsx, forms.tsx, attribution.tsx, social.tsx | `/components/marketing/` |
| **BIZOPS** | dashboard.tsx, accounts.tsx, analytics-view.tsx, calendar-view.tsx, documents.tsx, integrations.tsx, tasks.tsx, workflow-canvas.tsx, workflows.tsx | `/components/business-ops/` |
| **REVOPS** | dashboard.tsx, revops-views.tsx | `/components/domains/revops/` |
| **PERSONAL** | dashboard.tsx, personal-views.tsx | `/components/domains/personal/` |
| **PRODUCT_ENGINEERING** | (Need to create or reuse from business-ops) | TBD |
| **FINANCE** | (Need to create or reuse from business-ops) | TBD |
| **SERVICE** | (Need to create or reuse from business-ops) | TBD |
| **PROCUREMENT** | (Need to create or reuse from business-ops) | TBD |
| **IT_ADMIN** | user-management.tsx, rbac-manager.tsx, tenant-manager.tsx, approval-workflows.tsx | `/components/admin/` |
| **STUDENT_TEACHER** | (Need to create) | TBD |

---

#### 2.2 Create Dynamic Content Router

**File:** `/components/workspace/content-router.tsx`

```typescript
import { lazy, Suspense } from "react";
import type { Domain } from "./workspace-config";

// Lazy-load domain content
const DOMAIN_CONTENT: Record<Domain, Record<string, React.LazyExoticComponent<any>>> = {
  CUSTOMER_SUCCESS: {
    dashboard: lazy(() => import("../domains/account-success/dashboard")),
    accounts: lazy(() => import("../domains/account-success/accounts-view")),
    contacts: lazy(() => import("../domains/account-success/contacts-view")),
    meetings: lazy(() => import("../domains/account-success/meetings-view")),
    tasks: lazy(() => import("../domains/account-success/tasks-view")),
    documents: lazy(() => import("../domains/account-success/documents-view")),
    projects: lazy(() => import("../domains/account-success/projects-view")),
    // Add all 17 deep views here
  },
  SALES: {
    dashboard: lazy(() => import("../sales/dashboard")),
    pipeline: lazy(() => import("../sales/pipeline")),
    deals: lazy(() => import("../sales/deals")),
    contacts: lazy(() => import("../sales/contacts")),
    forecasting: lazy(() => import("../sales/forecasting")),
    activities: lazy(() => import("../sales/activities")),
    quotes: lazy(() => import("../sales/quotes")),
  },
  MARKETING: {
    dashboard: lazy(() => import("../marketing/dashboard")),
    campaigns: lazy(() => import("../marketing/campaigns")),
    email: lazy(() => import("../marketing/email-studio")),
    forms: lazy(() => import("../marketing/forms")),
    attribution: lazy(() => import("../marketing/attribution")),
    social: lazy(() => import("../marketing/social")),
  },
  // ... map all 12 domains
};

export function ContentRouter({ domain, moduleId }: { domain: Domain; moduleId: string }) {
  const Content = DOMAIN_CONTENT[domain]?.[moduleId];
  
  if (!Content) {
    return <div>Module not found: {moduleId}</div>;
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}
```

---

#### 2.3 Update workspace-shell-new.tsx to Use Content Router

```typescript
// In workspace-shell-new.tsx
import { ContentRouter } from "./content-router";

export function WorkspaceShellNew({ domain, userName }: WorkspaceShellNewProps) {
  const [activeView, setActiveView] = useState<WorkspaceView>("WORK");
  const [activeModuleId, setActiveModuleId] = useState("dashboard");
  
  return (
    <div>
      <header>{/* View tabs: Personal | Work */}</header>
      
      <div className="flex">
        <nav>{/* Left navigation */}</nav>
        
        <main>
          {activeView === "PERSONAL" ? (
            <ContentRouter domain="PERSONAL" moduleId={activeModuleId} />
          ) : (
            <ContentRouter domain={domain} moduleId={activeModuleId} />
          )}
        </main>
      </div>
    </div>
  );
}
```

---

### **Phase 3: Shared Components (P1 — Important)**

#### 3.1 Global Components (Available in All Domains)

These should be accessible from anywhere:

| Component | Location | Used By | Integration |
|-----------|----------|---------|-------------|
| **command-palette.tsx** | `/components/` | Global (Cmd+K) | ✅ Already imported in workspace-shell-new.tsx |
| **notification-center.tsx** | `/components/notifications/` | Global (header bell icon) | ⚠️ Wire into WorkspaceShellNew header |
| **ai-chat.tsx** | `/components/` | Global (Cmd+K AI) | ⚠️ Wire into CommandPalette |
| **intelligence-drawer.tsx** | `/components/` | Global (AI insights) | ⚠️ Wire as slide-up panel |
| **intelligence-overlay-new.tsx** | `/components/` | Global (L2 AI layer) | ⚠️ Wire as overlay (hidden by default) |
| **integrations-hub.tsx** | `/components/` | Settings/Admin | ⚠️ Wire into IT_ADMIN domain |
| **settings-page.tsx** | `/components/` | User menu | ⚠️ Wire into user menu dropdown |
| **profile-page.tsx** | `/components/` | User menu | ⚠️ Wire into user menu dropdown |
| **subscriptions-page.tsx** | `/components/` | Settings | ⚠️ Wire into settings page |

**Action:**
```typescript
// Update workspace-shell-new.tsx header
<header>
  <button onClick={() => setNotificationCenterOpen(true)}>
    <Bell />
  </button>
  
  {notificationCenterOpen && (
    <NotificationCenter onClose={() => setNotificationCenterOpen(false)} />
  )}
</header>
```

---

#### 3.2 Domain-Scoped Shared Components

| Component | Used By | Integration |
|-----------|---------|-------------|
| **goal-alignment-bar.tsx** | All domains (top of dashboard) | ⚠️ Add to dashboard header in ContentRouter |
| **document-storage/** | All domains (docs module) | ⚠️ Wire as shared feature |
| **analytics-shell.tsx** | All domains (analytics module) | ⚠️ Wire as shared analytics wrapper |

---

### **Phase 4: Missing Domains (P2 — Nice to Have)**

You configured 12 domains but only have content for 6. Need to create:

| Domain | Status | Action |
|--------|--------|--------|
| **PRODUCT_ENGINEERING** | ❌ Missing | Create dashboard + views OR reuse business-ops |
| **FINANCE** | ❌ Missing | Create dashboard + views OR reuse business-ops |
| **SERVICE** | ❌ Missing | Create dashboard + views OR reuse business-ops |
| **PROCUREMENT** | ❌ Missing | Create dashboard + views OR stub |
| **STUDENT_TEACHER** | ❌ Missing | Create dashboard + views OR stub |

**Recommendation:**
- **Short-term:** Create placeholder dashboards that say "Coming soon"
- **Long-term:** Build domain-specific content or reuse from business-ops

**Example Placeholder:**
```typescript
// /components/domains/product-engineering/dashboard.tsx
export function ProductEngineeringDashboard() {
  return (
    <div className="p-6">
      <h1>Product & Engineering</h1>
      <p>Dashboard coming soon. Track sprints, features, bugs, and releases.</p>
    </div>
  );
}
```

---

### **Phase 5: Clean Up (P3 — Later)**

#### 5.1 Deprecate OLD Architecture Files

**Files to Remove (After NEW Architecture is Stable):**
```
❌ /components/workspace-shell.tsx (OLD shell)
❌ /components/sidebar.tsx (OLD sidebar)
❌ /components/top-bar.tsx (OLD top bar)
❌ /components/l1-module-content.tsx (OLD content router)
❌ /components/onboarding/onboarding-flow.tsx (OLD onboarding)
❌ /components/domains/account-success/shell.tsx (OLD domain shell)
❌ /components/domains/personal/shell.tsx (OLD domain shell)
❌ /components/domains/revops/shell.tsx (OLD domain shell)
❌ /components/domains/salesops/shell.tsx (OLD domain shell)
```

**When to Remove:**
- ✅ After NEW architecture is fully functional
- ✅ After all domain content is wired into ContentRouter
- ✅ After QA testing confirms no regressions
- ✅ After feature flag confirms production stability

---

## 📋 Step-by-Step Implementation Plan

### **Week 1: Core Architecture (P0)**

**Day 1-2: Fix Module Loading Error**
- [ ] Debug "Importing a module script failed" error
- [ ] Ensure onboarding-flow-new.tsx, loader-phase1.tsx, workspace-shell-new.tsx load correctly
- [ ] Test full flow: Landing → Login → Onboarding → Loader → Workspace

**Day 3-4: Create Content Router**
- [ ] Build `/components/workspace/content-router.tsx`
- [ ] Map Customer Success domain (6 core views + 17 deep views)
- [ ] Map Sales domain (7 views)
- [ ] Map Marketing domain (6 views)
- [ ] Test navigation between views

**Day 5: Wire Shared Components**
- [ ] Add NotificationCenter to header
- [ ] Add CommandPalette (Cmd+K)
- [ ] Add user menu (profile, settings, logout)
- [ ] Add welcome banner (first 7 days)

---

### **Week 2: Domain Content (P1)**

**Day 1-2: Map Remaining Domains**
- [ ] Map BizOps domain (9 views)
- [ ] Map RevOps domain (2 views)
- [ ] Map Personal domain (2 views)
- [ ] Map IT Admin domain (4 views from /admin/)

**Day 3-4: Create Missing Domains**
- [ ] Product Engineering: Create placeholder dashboard
- [ ] Finance: Create placeholder dashboard
- [ ] Service: Create placeholder dashboard
- [ ] Procurement: Create placeholder dashboard
- [ ] Student/Teacher: Create placeholder dashboard

**Day 5: Test All Domains**
- [ ] Switch between all 12 domains
- [ ] Verify navigation works for each
- [ ] Verify dashboard loads for each
- [ ] Test Personal view (universal for all domains)

---

### **Week 3: Polish & Integration (P2)**

**Day 1: Goal Framework**
- [ ] Add goal-alignment-bar to all dashboards
- [ ] Wire goal-context provider
- [ ] Test goal schema integration

**Day 2: AI Layer**
- [ ] Wire intelligence-drawer (slide-up panel)
- [ ] Connect ai-chat to CommandPalette
- [ ] Test Cmd+K AI interactions

**Day 3: Shared Features**
- [ ] Wire document-storage module
- [ ] Wire analytics-shell wrapper
- [ ] Test integrations-hub

**Day 4: Admin Features**
- [ ] Wire RBAC manager
- [ ] Wire tenant manager
- [ ] Wire approval workflows
- [ ] Wire user management

**Day 5: QA Testing**
- [ ] Test all 12 domains end-to-end
- [ ] Test Personal view
- [ ] Test all shared components
- [ ] Test keyboard shortcuts (Cmd+K)

---

### **Week 4: Cleanup & Launch (P3)**

**Day 1-2: Deprecate OLD Architecture**
- [ ] Remove workspace-shell.tsx
- [ ] Remove sidebar.tsx, top-bar.tsx
- [ ] Remove l1-module-content.tsx
- [ ] Remove onboarding-flow.tsx (old)
- [ ] Remove domain-specific shells

**Day 3: Documentation**
- [ ] Update ARCHITECTURE_RESTRUCTURE.md
- [ ] Update ARCHITECTURE_DIAGRAM.md
- [ ] Create COMPONENT_CATALOG.md (list all 115+ components)
- [ ] Create DOMAIN_CONTENT_MAP.md (which views belong to which domain)

**Day 4: Final Testing**
- [ ] End-to-end regression testing
- [ ] Performance testing (lazy loading)
- [ ] Mobile responsiveness testing
- [ ] Accessibility testing

**Day 5: Launch**
- [ ] Merge NEW architecture as default
- [ ] Archive OLD architecture files (don't delete yet, just move to `/archive/`)
- [ ] Deploy to production
- [ ] Monitor for errors

---

## 🚨 Critical Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Import error prevents app from loading** | 🔴 Critical | Fix immediately (Week 1, Day 1-2) |
| **Deep Account Success views don't work with NEW architecture** | 🟡 High | Test thoroughly, create adapter if needed |
| **Missing content for 5 domains** | 🟢 Low | Create placeholders, build over time |
| **OLD architecture still referenced in some places** | 🟡 Medium | Gradual deprecation, feature flag |
| **Performance issues with lazy loading** | 🟢 Low | Monitor, optimize if needed |

---

## ✅ Success Criteria

**Functional:**
- [ ] All 12 domains load without errors
- [ ] Navigation works between Personal and Work views
- [ ] Domain-specific content renders correctly
- [ ] Shared components (notifications, AI, goals) work globally
- [ ] Admin features work in IT_ADMIN domain

**Technical:**
- [ ] No console errors
- [ ] Fast initial load (<3s)
- [ ] Smooth navigation (<500ms)
- [ ] No memory leaks
- [ ] Clean architecture (no OLD references)

**User Experience:**
- [ ] Onboarding flow completes in <2 min
- [ ] Loader Phase 1 shows progress (60s)
- [ ] Dashboard shows data immediately (no empty state)
- [ ] Keyboard shortcuts work (Cmd+K)
- [ ] Mobile responsive

---

## 📊 Final Component Mapping

### **NEW Architecture Files (Keep & Use):**
```
✅ /components/onboarding/onboarding-flow-new.tsx
✅ /components/workspace/workspace-config.ts
✅ /components/workspace/loader-phase1.tsx
✅ /components/workspace/workspace-shell-new.tsx
⚠️ /components/workspace/content-router.tsx (TO CREATE)
```

### **Content Files (Keep & Wire):**
```
✅ /components/domains/account-success/* (25 files)
✅ /components/sales/* (7 files)
✅ /components/marketing/* (6 files)
✅ /components/business-ops/* (9 files)
✅ /components/admin/* (6 files)
✅ /components/domains/revops/* (3 files)
✅ /components/domains/personal/* (3 files)
```

### **Shared Components (Keep & Wire):**
```
✅ /components/command-palette.tsx
✅ /components/notifications/notification-center.tsx
✅ /components/ai-chat.tsx
✅ /components/intelligence-drawer.tsx
✅ /components/intelligence-overlay-new.tsx
✅ /components/goal-framework/* (3 files)
✅ /components/document-storage/* (3 files)
✅ /components/shared/analytics-shell.tsx
✅ /components/integrations-hub.tsx
✅ /components/settings-page.tsx
✅ /components/profile-page.tsx
✅ /components/subscriptions-page.tsx
```

### **UI Components (Keep):**
```
✅ /components/ui/* (52 Shadcn components)
```

### **Landing Pages (Keep):**
```
✅ /components/landing/* (21 files)
✅ /components/website/* (6 files)
```

### **Infrastructure (Keep):**
```
✅ /components/spine/* (4 files)
✅ /components/auth/* (2 files)
```

### **OLD Architecture Files (Deprecate After Migration):**
```
❌ /components/workspace-shell.tsx (OLD)
❌ /components/sidebar.tsx (OLD)
❌ /components/top-bar.tsx (OLD)
❌ /components/l1-module-content.tsx (OLD)
❌ /components/onboarding/onboarding-flow.tsx (OLD)
❌ /components/domains/*/shell.tsx (OLD domain shells)
```

---

## 🎯 Next Immediate Action

**Priority 1: Fix the Import Error**

The "Importing a module script failed" error is blocking everything. Let's debug this first:

1. **Check if files are valid TypeScript**
2. **Check for circular dependencies**
3. **Check for missing exports**
4. **Check browser console for detailed error**

Once that's fixed, we can proceed with the integration plan.

---

**Total Effort Estimate:** 4 weeks (160 hours)
- Week 1: 40 hours (Core architecture)
- Week 2: 40 hours (Domain content)
- Week 3: 40 hours (Polish & integration)
- Week 4: 40 hours (Cleanup & launch)

**Team Size:** 1-2 developers

**Risk Level:** Medium (manageable with careful testing)

---

Ready to proceed? Let me know if you want me to:
1. **Fix the import error first** (most urgent)
2. **Create the content-router.tsx** (next step)
3. **Wire a specific domain** (e.g., Customer Success)
4. **Something else**
