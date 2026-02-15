# IntegrateWise Page Structure & Routing

> **Complete page hierarchy, routing architecture, and navigation patterns**

---

## 🗺️ Page Architecture Overview

IntegrateWise uses **React Router's Data mode** with a multi-layered page structure supporting:
- **Marketing Site** (28 page components)
- **Workspace Application** (10 switchable contexts)
- **Deep Dive Domains** (4 specialized shells with 30+ views)
- **Admin & Settings** (User management, RBAC, tenant config)

---

## 📁 Route Structure

```typescript
/routes.ts Configuration
========================

createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      // MARKETING SITE
      { index: true, Component: Home },           // Landing page
      { path: "audience", Component: AudiencePage },
      { path: "pricing", Component: PricingPage },
      { path: "technical", Component: TechnicalPage },
      { path: "problem", Component: ProblemPage },
      { path: "differentiators", Component: DifferentiatorsDetail },
      { path: "product/:productId", Component: GenericPage },
      
      // AUTHENTICATION
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
      
      // WORKSPACE APPLICATION
      { 
        path: "workspace", 
        Component: WorkspaceShell,
        children: [
          // 10 SWITCHABLE CONTEXTS
          { path: "website", Component: WebsiteDashboard },
          { path: "sales", Component: SalesDashboard },
          { path: "marketing", Component: MarketingDashboard },
          { path: "business-ops", Component: BusinessOpsDashboard },
          { path: "customer-success", Component: CustomerSuccessDashboard },
          { path: "finance", Component: FinanceDashboard },
          { path: "product", Component: ProductDashboard },
          { path: "engineering", Component: EngineeringDashboard },
          { path: "admin", Component: AdminDashboard },
          { path: "analytics", Component: AnalyticsDashboard },
          
          // DEEP DIVE DOMAINS
          { path: "domain/account-success", Component: AccountSuccessShell },
          { path: "domain/personal", Component: PersonalShell },
          { path: "domain/revops", Component: RevOpsShell },
          { path: "domain/salesops", Component: SalesOpsShell },
        ]
      },
      
      // USER MANAGEMENT
      { path: "profile", Component: ProfilePage },
      { path: "settings", Component: SettingsPage },
      { path: "subscriptions", Component: SubscriptionsPage },
      { path: "onboarding", Component: OnboardingFlow },
      
      // FALLBACK
      { path: "*", Component: NotFound },
    ],
  },
]);
```

---

## 🏗️ Page Hierarchy & Frame Structure

### **LEVEL 1: Marketing Site** (Public)
```
┌─────────────────────────────────────────────────────────────┐
│                     MARKETING SITE                          │
│                     Layout: /landing/Layout.tsx             │
├─────────────────────────────────────────────────────────────┤
│  Frame: Public Landing                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Navbar (Sticky)                  [Login] [Sign Up]   │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  Page Content (Dynamic)                              │   │
│  │  • Hero.tsx                                          │   │
│  │  • Audience.tsx                                      │   │
│  │  • Problem.tsx                                       │   │
│  │  • Pillars.tsx                                       │   │
│  │  • Differentiators.tsx                               │   │
│  │  • Integrations.tsx                                  │   │
│  │  • Pricing.tsx                                       │   │
│  │  • Comparison.tsx                                    │   │
│  │                                                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Footer (Dark)                                        │   │
│  │  Links · About · Contact · Legal                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Pages:
├── / (index)              → Hero + sections
├── /audience              → Target audience breakdown
├── /pricing               → Pricing tiers & comparison
├── /technical             → Technical architecture details
├── /problem               → Problem statement
├── /differentiators       → Feature differentiators
└── /product/:productId    → Dynamic product pages
```

### **LEVEL 2: Authentication** (Public)
```
┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION PAGES                        │
│                  Frame: Centered Auth                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │        [LOGO]                                        │   │
│  │                                                       │   │
│  │    ┌─────────────────────────────────┐              │   │
│  │    │  Login / Signup Form             │              │   │
│  │    │  • Email/Password fields         │              │   │
│  │    │  • OAuth buttons                 │              │   │
│  │    │  • Terms & Privacy links         │              │   │
│  │    └─────────────────────────────────┘              │   │
│  │                                                       │   │
│  │    [Already have account? / Sign up]                │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Pages:
├── /login                 → Login form
└── /signup                → Registration form
```

### **LEVEL 3: Workspace Application** (Authenticated)
```
┌─────────────────────────────────────────────────────────────┐
│                    WORKSPACE SHELL                          │
│               Component: DashboardShell.tsx                 │
│               Frame: Sidebar + Content                      │
├─────────────────────────────────────────────────────────────┤
│  ┌────────┬────────────────────────────────────────────┐   │
│  │        │  Top Bar                                   │   │
│  │        │  [Context Name] [Search] [Cmd+K] [👤]     │   │
│  │ Side   ├────────────────────────────────────────────┤   │
│  │ bar    │                                            │   │
│  │        │  Main Content Area                         │   │
│  │ • Logo │  (Dynamic Context Views)                   │   │
│  │ • Nav  │                                            │   │
│  │ • Ctx  │  ┌──────────────────────────────────────┐ │   │
│  │ • AI   │  │ Dashboard KPIs                       │ │   │
│  │        │  ├──────────────────────────────────────┤ │   │
│  │ [10    │  │ Charts & Visualizations              │ │   │
│  │  Ctxs] │  ├──────────────────────────────────────┤ │   │
│  │        │  │ Data Tables                          │ │   │
│  │        │  ├──────────────────────────────────────┤ │   │
│  │        │  │ Action Buttons & Workflows           │ │   │
│  │        │  └──────────────────────────────────────┘ │   │
│  │        │                                            │   │
│  └────────┴────────────────────────────────────────────┘   │
│                                                             │
│  Intelligence Overlay (Floating)                           │
│  [AI Chat Drawer - Right Side]                             │
└─────────────────────────────────────────────────────────────┘

Workspace Routes:
├── /workspace/website              → Website content management
├── /workspace/sales                → Sales pipeline & deals
├── /workspace/marketing            → Marketing campaigns
├── /workspace/business-ops         → Business operations & workflows
├── /workspace/customer-success     → CS health scores & renewals
├── /workspace/finance              → Revenue & invoicing
├── /workspace/product              → Product roadmap
├── /workspace/engineering          → API logs & integrations
├── /workspace/admin                → RBAC & tenant management
└── /workspace/analytics            → Cross-workspace analytics
```

### **LEVEL 4: Deep Dive Domains** (Specialized Views)
```
┌─────────────────────────────────────────────────────────────┐
│                   DOMAIN DEEP DIVE SHELL                    │
│            Component: domains/[domain]/shell.tsx            │
│            Frame: Domain Sidebar + Multi-View               │
├─────────────────────────────────────────────────────────────┤
│  ┌────────┬────────────────────────────────────────────┐   │
│  │ Domain │  Domain Top Bar                            │   │
│  │ Side   │  [Domain Name] [← Back] [View Selector]    │   │
│  │ bar    ├────────────────────────────────────────────┤   │
│  │        │                                            │   │
│  │ Views: │  Specialized View Content                  │   │
│  │        │                                            │   │
│  │ • View │  Example: Account Success Domain           │   │
│  │   1-17 │  ┌──────────────────────────────────────┐ │   │
│  │        │  │ Account Master View                  │ │   │
│  │ [Intel │  │ • Account details                    │ │   │
│  │  Panel]│  │ • Health score timeline              │ │   │
│  │        │  │ • Risk indicators                    │ │   │
│  │ [Spine │  ├──────────────────────────────────────┤ │   │
│  │  Ready]│  │ Platform Health View                 │ │   │
│  │        │  │ • Integration status                 │ │   │
│  │        │  │ • API health                         │ │   │
│  │        │  │ • Usage metrics                      │ │   │
│  │        │  └──────────────────────────────────────┘ │   │
│  │        │                                            │   │
│  └────────┴────────────────────────────────────────────┘   │
│                                                             │
│  Intelligence Overlay (Domain-Specific)                    │
└─────────────────────────────────────────────────────────────┘

Domain Routes:
├── /workspace/domain/account-success
│   ├── /view/account-master         → Account overview
│   ├── /view/business-context       → Business context
│   ├── /view/people-team            → People & team structure
│   ├── /view/platform-health        → Platform health
│   ├── /view/risk-register          → Risk management
│   ├── /view/strategic-objectives   → Strategy & objectives
│   ├── /view/success-plans          → Success planning
│   └── ... (10 more views)
│
├── /workspace/domain/personal
│   ├── /view/dashboard              → Personal dashboard
│   ├── /view/tasks                  → Task management
│   └── /view/calendar               → Calendar view
│
├── /workspace/domain/revops
│   ├── /view/dashboard              → RevOps dashboard
│   ├── /view/pipeline               → Revenue pipeline
│   └── /view/forecasting            → Revenue forecasting
│
└── /workspace/domain/salesops
    ├── /view/dashboard              → SalesOps dashboard
    ├── /view/performance            → Sales performance
    └── /view/territories            → Territory management
```

### **LEVEL 5: User Management** (Settings)
```
┌─────────────────────────────────────────────────────────────┐
│                   USER MANAGEMENT PAGES                     │
│                   Frame: Simple Layout                      │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [← Back to Workspace]                               │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  Settings / Profile / Subscriptions Content          │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ Tabs: Profile | Security | Billing | Team     │  │   │
│  │  ├────────────────────────────────────────────────┤  │   │
│  │  │                                                │  │   │
│  │  │  Form fields / Settings panels                │  │   │
│  │  │  • User info                                  │  │   │
│  │  │  • Password                                   │  │   │
│  │  │  • Subscription plan                          │  │   │
│  │  │  • Team members                               │  │   │
│  │  │                                                │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Pages:
├── /profile               → User profile & avatar
├── /settings              → Application settings
├── /subscriptions         → Billing & subscriptions
└── /onboarding            → First-time user setup flow
```

---

## 🎨 Frame Definitions

### **Frame 1: Marketing Landing**
- **Layout:** Navbar + Content + Footer
- **Navigation:** Sticky top navbar with scroll behavior
- **Color Scheme:** Light background, white sections, Teal-Blue accents
- **Responsive:** Mobile hamburger menu, stacked sections
- **Components Used:**
  - `Navbar.tsx` (header)
  - `Footer.tsx` (footer)
  - Dynamic page content
  - CTA buttons throughout

### **Frame 2: Centered Authentication**
- **Layout:** Centered card on gradient background
- **Navigation:** Minimal (logo + link to switch auth mode)
- **Color Scheme:** Dark gradient background, white form card
- **Responsive:** Mobile-friendly form, stacked inputs
- **Components Used:**
  - `LoginPage.tsx`
  - `SignupPage.tsx`
  - Form validation
  - OAuth buttons

### **Frame 3: Workspace Shell**
- **Layout:** Sidebar (left) + Top Bar + Content Area
- **Navigation:** 
  - Sidebar: Vertical navigation with context switcher
  - Top Bar: Search, Cmd+K palette, user menu
- **Color Scheme:** 
  - Sidebar: `#0C1222` (Navy Black)
  - Content: Light gray background
  - Active: `#0EA5E9` (Sky Blue)
- **Responsive:** 
  - Desktop: Fixed sidebar (256px)
  - Mobile: Collapsible drawer
- **Components Used:**
  - `DashboardShell.tsx` (container)
  - `sidebar.tsx` (navigation)
  - `top-bar.tsx` (header)
  - `intelligence-overlay-new.tsx` (AI layer)
  - Context-specific dashboards

### **Frame 4: Domain Deep Dive**
- **Layout:** Domain Sidebar (left) + View Selector + Content
- **Navigation:**
  - Domain Sidebar: 17+ specialized views
  - View Selector: Dropdown or tabs
  - Breadcrumbs: Show current path
- **Color Scheme:**
  - Sidebar: Lighter than workspace sidebar
  - Content: White cards on light gray
  - Accents: Teal for domain-specific highlights
- **Responsive:**
  - Desktop: Dual sidebar (workspace + domain)
  - Mobile: Single view with view selector
- **Components Used:**
  - `shell.tsx` (domain wrapper)
  - `domain-sidebar.tsx` (navigation)
  - `dashboard.tsx` (domain dashboard)
  - 17+ view components
  - `intelligence-overlay.tsx` (domain-specific AI)

### **Frame 5: Settings & Admin**
- **Layout:** Simple header + content (no persistent sidebar)
- **Navigation:** Back button + tabs within page
- **Color Scheme:** Clean white/gray, standard form styling
- **Responsive:** Mobile-friendly form layout
- **Components Used:**
  - `ProfilePage.tsx`
  - `SettingsPage.tsx`
  - `SubscriptionsPage.tsx`
  - Form components

---

## 🔄 Navigation Patterns

### **Context Switching**
```typescript
// User clicks context in sidebar
Current: /workspace/sales
↓ Click "Marketing" in sidebar
New: /workspace/marketing

// Navigation preserved across context switches
// State maintained via URL params
```

### **Deep Dive Entry**
```typescript
// From workspace context
Current: /workspace/customer-success
↓ Click "Deep Dive: Account Success"
New: /workspace/domain/account-success

// Breadcrumb: Workspace > Customer Success > Account Success Domain
```

### **View Switching (Within Domain)**
```typescript
// Within Account Success domain
Current: /workspace/domain/account-success/view/account-master
↓ Select "Platform Health" from sidebar
New: /workspace/domain/account-success/view/platform-health

// No full page reload - smooth transition
```

### **Intelligence Overlay**
```typescript
// AI overlay available in all workspace/domain views
// Toggleable via:
// - Sidebar button
// - Keyboard shortcut (Cmd+I)
// - Floating button

State: intelligence-overlay-new.tsx (drawer)
Position: Right side, overlay on content
Persistent: Yes (state preserved across navigation)
```

---

## 🧭 URL Structure & Patterns

### **Marketing Site**
```
https://integratewise.com/
https://integratewise.com/audience
https://integratewise.com/pricing
https://integratewise.com/technical
https://integratewise.com/product/deal-predictor
```

### **Authentication**
```
https://integratewise.com/login
https://integratewise.com/signup
https://integratewise.com/onboarding
```

### **Workspace**
```
https://integratewise.com/workspace/sales
https://integratewise.com/workspace/marketing
https://integratewise.com/workspace/business-ops
```

### **Domains**
```
https://integratewise.com/workspace/domain/account-success
https://integratewise.com/workspace/domain/account-success/view/account-master
https://integratewise.com/workspace/domain/account-success/view/platform-health
https://integratewise.com/workspace/domain/revops/view/pipeline
```

### **User Management**
```
https://integratewise.com/profile
https://integratewise.com/settings
https://integratewise.com/subscriptions
```

---

## 🎯 Page Component Mapping

### **Marketing Site Components** (28 files)
| Route | Component | Frame |
|-------|-----------|-------|
| `/` | `Hero + sections` | Marketing Landing |
| `/audience` | `AudiencePage.tsx` | Marketing Landing |
| `/pricing` | `PricingPage.tsx` | Marketing Landing |
| `/technical` | `TechnicalPage.tsx` | Marketing Landing |
| `/problem` | `ProblemPage.tsx` | Marketing Landing |
| `/differentiators` | `DifferentiatorsDetail.tsx` | Marketing Landing |

### **Workspace Context Components** (10 contexts)
| Route | Component | Frame |
|-------|-----------|-------|
| `/workspace/website` | `website/dashboard.tsx` | Workspace Shell |
| `/workspace/sales` | `sales/dashboard.tsx` | Workspace Shell |
| `/workspace/marketing` | `marketing/dashboard.tsx` | Workspace Shell |
| `/workspace/business-ops` | `business-ops/dashboard.tsx` | Workspace Shell |
| `/workspace/customer-success` | `customer-success/dashboard.tsx` | Workspace Shell |
| `/workspace/admin` | `admin/tenant-manager.tsx` | Workspace Shell |

### **Domain Components** (4 domains, 30+ views)
| Route | Component | Frame |
|-------|-----------|-------|
| `/workspace/domain/account-success` | `domains/account-success/shell.tsx` | Domain Deep Dive |
| `/workspace/domain/account-success/view/*` | `domains/account-success/views/*.tsx` | Domain Deep Dive |
| `/workspace/domain/revops` | `domains/revops/shell.tsx` | Domain Deep Dive |
| `/workspace/domain/salesops` | `domains/salesops/shell.tsx` | Domain Deep Dive |
| `/workspace/domain/personal` | `domains/personal/shell.tsx` | Domain Deep Dive |

---

## 🔐 Route Protection & Access Control

### **Public Routes** (No auth required)
- `/` (home)
- `/audience`
- `/pricing`
- `/technical`
- `/problem`
- `/differentiators`
- `/login`
- `/signup`

### **Protected Routes** (Auth required)
- `/workspace/*` (all workspace contexts)
- `/workspace/domain/*` (all domains)
- `/profile`
- `/settings`
- `/subscriptions`
- `/onboarding`

### **Admin Routes** (Admin role required)
- `/workspace/admin`
- `/workspace/admin/tenant-manager`
- `/workspace/admin/rbac-manager`
- `/workspace/admin/user-management`

---

## 📊 Page Load Performance

### **Critical Rendering Path**
1. **App.tsx** - Router initialization
2. **Route matching** - Determine current page
3. **Shell loading** - Load frame (Marketing, Workspace, Domain)
4. **Content loading** - Load specific page component
5. **Data fetching** - Spine projections, API calls (if applicable)

### **Optimization Strategies**
- **Code splitting:** Each route lazy-loaded
- **Prefetching:** Hover-based route prefetching
- **Caching:** Spine data cached in memory
- **Skeleton screens:** Loading states for async data

---

## 🎬 Navigation Flow Examples

### **Example 1: Landing to Workspace**
```
1. User visits: https://integratewise.com/
2. Views Hero + features
3. Clicks "Sign Up" → /signup
4. Completes registration
5. Redirected to: /onboarding
6. Completes onboarding
7. Lands at: /workspace/website (default context)
```

### **Example 2: Context Switching**
```
1. User in: /workspace/sales
2. Clicks "Marketing" in sidebar
3. Navigates to: /workspace/marketing
4. Sidebar updates active state
5. Content area swaps to marketing dashboard
```

### **Example 3: Deep Dive Navigation**
```
1. User in: /workspace/customer-success
2. Clicks "Deep Dive: Account Success"
3. Enters domain: /workspace/domain/account-success
4. Domain sidebar appears with 17 views
5. Clicks "Platform Health" view
6. View loads: /workspace/domain/account-success/view/platform-health
7. Intelligence overlay provides context-aware insights
```

---

## 🚀 Future Expansion

### **Planned Page Types**
- Reports & Analytics pages
- Team collaboration pages
- API documentation browser
- Workflow builder canvas
- Integration marketplace

### **Routing Enhancements**
- Modal routes (e.g., `/workspace/sales?modal=create-deal`)
- Query-based filtering (e.g., `/workspace/sales?status=open&owner=me`)
- Deep linking to specific views
- Shareable URLs with state preservation

---

**Version:** 1.0  
**Last Updated:** February 12, 2026  
**Status:** ✅ Production Architecture
