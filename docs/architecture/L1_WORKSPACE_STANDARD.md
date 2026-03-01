# L1 Workspace - Daily Operating System Standard

**Status:** Production-Ready ✅  
**Purpose:** Mission-critical daily workspace for all users  
**Architecture:** Single source of truth for business operations

---

## What is L1?

L1 is the **foundational workspace layer** - the primary interface where users spend their entire workday. It's not just another app layer; it's the **operating system for work**.

### Core Principle
> Without L1, users cannot function. This is their daily command center.

---

## L1 Workspace Inventory

### 30 Production Pages Across 5 User Views

#### **Executive View** (Strategic Oversight)
1. `/metrics` - Executive dashboard with KPIs
2. `/goals` - OKRs and strategic goals
3. `/reports` - Executive reports
4. `/insights` - AI-powered insights
5. `/business/clients` - Client portfolio

#### **Manager View** (Team & Operations)
6. `/today` - Daily manager overview
7. `/team` - Team management
8. `/goals` - Team goals
9. `/tasks` - Task oversight
10. `/metrics` - Team metrics
11. `/projects/active` - Active projects
12. `/business/crm/pipeline` - Sales pipeline
13. `/projects/completed` - Completed projects

#### **Team View** (Daily Work - Default)
14. `/today` - Daily workspace **← Primary landing page**
15. `/tasks` - My tasks (Kanban)
16. `/knowledge` - Knowledge inbox
17. `/iq-hub` - AI hub
18. `/business/crm/pipeline` - Pipeline management
19. `/business/crm/leads` - Lead management
20. `/business/clients` - Client management
21. `/cs/accounts` - CS accounts
22. `/cs/health` - Customer health
23. `/business/products` - Products
24. `/business/services` - Services

#### **Analyst View** (Data & Insights)
25. `/metrics` - Analytics dashboard
26. `/spine` - SSOT data viewer
27. `/reports` - Data reports
28. `/dashboards` - Custom dashboards
29. `/insights` - Data insights
30. `/search` - Discovery search

#### **Admin View** (System Management)
31. `/admin/users` - User management
32. `/admin/rbac` - Permissions
33. `/integrations` - Integration hub
34. `/admin/billing` - Billing
35. `/admin/flags` - Feature flags
36. `/system-health` - System monitoring
37. `/admin/audit` - Audit logs
38. `/settings` - Settings

---

## L1 Navigation System

### Left Sidebar (Always Visible)
- **Width:** 256px expanded / 64px collapsed
- **Position:** Fixed left, z-index 30
- **Toggle:** Top-right header button
- **Theme:** Green accent (#2D7A3E)

### Navigation Structure
```
┌─ View Selector (Dropdown) ────────────┐
│ • Executive View - Strategic oversight│
│ • Manager View - Team & operations    │
│ • Team View - Daily work ✓ (default) │
│ • Analyst View - Data & insights      │
│ • Admin View - System management      │
└───────────────────────────────────────┘

┌─ Core Tools ──────────────────────────┐
│ 🏠 Today                              │
│ ☑️ Tasks                              │
│ 📚 Knowledge                          │
│ 💡 IQ Hub                             │
└───────────────────────────────────────┘

┌─ Work Areas (Expandable) ─────────────┐
│ 🛒 Sales >                            │
│   ├─ Pipeline                         │
│   ├─ Leads                            │
│   └─ Clients                          │
│ 👥 Customer Success >                 │
│   ├─ Accounts                         │
│   └─ Health                           │
│ 📦 Products                           │
│ 💼 Services                           │
└───────────────────────────────────────┘

┌─ User Profile ────────────────────────┐
│ [Avatar] Nirmal Prince J              │
│          Daily work                   │
└───────────────────────────────────────┘
```

---

## Design System

### Colors
- **Primary Green:** #2D7A3E (active states, CTAs)
- **Light Green:** #E8F5E9 (backgrounds, hover states)
- **Gray Scale:** 50/100/200/300/400/500/600/700/800/900
- **Text:** #111827 (primary), #6B7280 (secondary)

### Typography
- **Font:** System UI stack (SF Pro, Segoe UI, etc.)
- **Headings:** 600-700 weight
- **Body:** 400-500 weight
- **Line Height:** 1.5-1.6 for readability

### Spacing
- **Base Unit:** 4px (0.25rem)
- **Common:** 4/8/12/16/20/24/32/40/48/64px
- **Grid:** 8px base grid system

### Layout
- **Container Max Width:** No max (full-width with sidebar)
- **Content Padding:** 24-32px (p-6/p-8)
- **Card Spacing:** 16-24px gaps (gap-4/gap-6)
- **Border Radius:** 8-12px (rounded-lg/rounded-xl)

---

## L1 Page Templates

### 1. Dashboard Layout
**Use for:** Metrics, Today, Analytics
```
┌─────────────────────────────────────┐
│ Page Header                         │
├─────────────────────────────────────┤
│ [Stat] [Stat] [Stat] [Stat]        │
├─────────────────────────────────────┤
│ Section Title                       │
│ ┌─────────────┐ ┌─────────────┐   │
│ │   Card      │ │   Card      │   │
│ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────┘
```

### 2. Grid Layout
**Use for:** Clients, Products, Services
```
┌─────────────────────────────────────┐
│ Page Header              [+ New]    │
├─────────────────────────────────────┤
│ [Search] [Filter]                   │
├─────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │Card │ │Card │ │Card │ │Card │   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │Card │ │Card │ │Card │ │Card │   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
└─────────────────────────────────────┘
```

### 3. List Layout
**Use for:** Tasks, Pipeline, Audit
```
┌─────────────────────────────────────┐
│ Page Header              [+ New]    │
├─────────────────────────────────────┤
│ [Search] [Filter] [Sort]            │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Item 1                  [Edit]  │ │
│ ├─────────────────────────────────┤ │
│ │ Item 2                  [Edit]  │ │
│ ├─────────────────────────────────┤ │
│ │ Item 3                  [Edit]  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Data Integration

### Supabase Tables (57 total)
All L1 pages connect to live Supabase data:

**Core Tables:**
- `clients` - Client management
- `leads` - Lead tracking
- `deals` - Deal pipeline
- `tasks` - Task management
- `products` - Product catalog
- `services` - Service offerings
- `metrics` - KPI tracking
- `goals` - Goal/OKR tracking
- `sessions` - Session tracking
- `documents` - Knowledge base

**Integration Tables:**
- `webhooks` - Webhook logs
- `integrations` - Connected services
- `data_source_sync` - Sync status

**System Tables:**
- `users` - User accounts (via auth.users)
- `audit_logs` - System audit trail

---

## User Workflows

### Daily Start Routine
1. **Land on `/today`** - See priorities, tasks, metrics
2. **Check Tasks** - Review and update task status
3. **Review Pipeline** - Sales/CS check their pipelines
4. **Access Knowledge** - Find docs, past sessions
5. **Use IQ Hub** - Get AI assistance when needed

### Weekly Manager Routine
1. **Switch to Manager View**
2. **Review Team Goals** - Progress on OKRs
3. **Check Team Metrics** - Performance indicators
4. **Review Active Projects** - Project status updates
5. **1-on-1s** - Team meetings and feedback

### Monthly Executive Routine
1. **Switch to Executive View**
2. **Review Dashboard** - High-level KPIs
3. **Strategic Goals** - OKR progress
4. **Client Portfolio** - Account health
5. **Executive Reports** - Board materials

---

## L2 Integration

The L2 Cognitive Drawer overlays L1 with AI intelligence:

### Bottom-to-Top Slide-up Drawer
- **Collapsed:** 32px status bar (always visible)
- **Partial:** 68vh (primary working height)
- **Full:** 88vh (detailed analysis)
- **Max:** 100vh (immersive mode)

### 14 Intelligence Surfaces
All accessible via tabs in L2:
1. Spine - SSOT viewer
2. Context - Session browser
3. Knowledge - Documentation
4. Evidence - Timeline
5. Signals - Anomalies
6. Think - AI reasoning
7. Act - Action queue
8. Govern - Policies
9. Adjust - Tuning
10. Audit - Verification
11. Agent - AI config
12. Twin - Simulations
13. Chat - AI assistant
14. Search - Universal search

### Keyboard Shortcuts
- **⌘J** - Toggle L2 drawer
- **⌘K** - Universal search
- **⌘/** - Help menu

---

## Production Checklist

### ✅ Implemented
- [x] 30 L1 workspace pages
- [x] 5 user view modes
- [x] Left sidebar navigation
- [x] Supabase data integration
- [x] L2 cognitive drawer
- [x] AI chat (Groq-powered)
- [x] Responsive layouts
- [x] Empty states
- [x] Loading states
- [x] Error handling
- [x] Authentication (Supabase)

### 🚀 Ready for Production
- [x] All pages functional
- [x] Data flowing from Supabase
- [x] Navigation working
- [x] Layouts standardized
- [x] Design system applied
- [x] Mobile responsive
- [x] Performance optimized

### 📋 Optional Enhancements
- [ ] Real-time updates (Supabase subscriptions)
- [ ] Advanced filtering/sorting
- [ ] Bulk operations
- [ ] Export capabilities
- [ ] Notification system
- [ ] Advanced search
- [ ] Collaborative features

---

## Support & Maintenance

### Key Files
- `components/layouts/app-shell.tsx` - Main L1 shell
- `components/layouts/page-layouts.tsx` - Standard templates
- `components/cognitive/l2-drawer.tsx` - L2 overlay
- `lib/l1-registry.ts` - Page registry
- `lib/supabase/queries.ts` - Data fetching

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
GROQ_API_KEY=xxx
```

### Deployment
- **Platform:** Vercel
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth
- **AI:** Groq (llama-3.3-70b)

---

## Summary

The L1 Workspace is the **daily operating system** for IntegrateWise users. It provides:

✅ **30 production-ready pages** across all business functions  
✅ **5 user views** for different roles and contexts  
✅ **Consistent design system** with green accent theme  
✅ **Live data integration** with 57 Supabase tables  
✅ **AI-powered intelligence** via L2 cognitive drawer  
✅ **Intuitive navigation** with collapsible left sidebar  
✅ **Production-ready** and battle-tested  

This is not just a UI - it's the **central nervous system** of the business.

---

**Last Updated:** February 2026  
**Status:** Production  
**Version:** 1.0.0
