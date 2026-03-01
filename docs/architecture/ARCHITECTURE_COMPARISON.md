# IntegrateWise OS - Architecture Comparison

## Current State vs Previous Monorepo

---

## **CURRENT: Single Unified App (Active)**

### Structure
```
/ (root - Single Next.js 16 App)
├── app/(app)/                    # Protected routes
│   ├── Bridge
│   ├── Context
│   ├── Demo
│   ├── Evidence
│   ├── Knowledge (Inbox)
│   ├── Search
│   ├── Spine
│   └── Think (Kanban)
├── components/
│   ├── layouts/
│   │   ├── app-shell.tsx         # 4 Hats navigation
│   │   ├── kb-header.tsx         # Knowledge Bank header
│   │   └── page-layouts.tsx      # Layout templates
│   ├── spine/                    # Spine components
│   └── ui/                       # 61 shadcn components
└── lib/supabase/                 # Database queries
```

### Pages Built (48 total)
- **4 Hats Architecture**: Visionary, Missionary, Practitioner, Passenger
- **Knowledge Bank UI**: Think, Spine, Knowledge, Search, Evidence, Bridge, Context, Demo
- **Business**: Clients, Products, Services, CRM, Marketing, Website
- **CS**: Health Scores, Accounts, Meetings
- **Admin**: Users, RBAC, Billing, Audit, Monitoring
- **Core**: Today, Tasks, Metrics, Goals, IQ Hub, Integrations

---

## **PREVIOUS: Monorepo Structure (Deleted)**

### Structure (packages/ folder - removed Dec 2024)
```
packages/
├── hub/                          # Main SaaS app
│   ├── dashboard/
│   ├── customers/
│   ├── sales/
│   ├── finance/
│   ├── marketing/
│   ├── ops/
│   └── rnd/
├── website/                      # Marketing site
│   ├── index.html
│   ├── about/
│   └── pricing/
├── api/                          # Cloudflare Workers
└── webhooks/                     # Webhook handlers
```

### Pages Count: 50
- Hub Dashboard: 19 pages
- API Routes: 7 routes
- Marketing Website: 12 pages
- Documentation: 12 pages

---

## **Key Differences**

| Aspect | Previous Monorepo | Current Unified App |
|--------|-------------------|---------------------|
| **Architecture** | 4 separate packages | Single Next.js app |
| **Navigation** | Multi-app routing | 4 Hats context-aware |
| **Database** | Scattered queries | Unified lib/supabase |
| **Components** | Duplicated across packages | Shared components/ |
| **Auth** | Multiple auth flows | Single Supabase auth |
| **Deployment** | 4 separate deploys | Single Vercel deploy |
| **Styling** | Inconsistent | Standardized layouts |
| **Marketing Site** | Static HTML | Integrated Next.js |

---

## **Migration Timeline**

### Phase 1: Cleanup (Dec 15-17, 2024)
- Deleted packages/ directory (113 files)
- Removed duplicate components
- Fixed data leakage (hardcoded credentials)

### Phase 2: Rebuild (Dec 18-20, 2024)
- Implemented 4 Hats architecture
- Built 29-stage structure
- Created Knowledge Bank UI

### Phase 3: Data Integration (Dec 21-22, 2024)
- Connected 57 Supabase tables
- Implemented live data queries
- Added currency formatting (INR)

### Phase 4: UI Standardization (Dec 23-25, 2024)
- Created 3 layout templates
- Enhanced Think/Spine/Knowledge UIs
- Matched Knowledge Bank design system

---

## **Pages Mapping: Old → New**

### Hub Dashboard
| Old Route | New Route | Status |
|-----------|-----------|--------|
| `/hub/dashboard` | `/today` | ✅ Replaced |
| `/hub/customers` | `/business/clients` | ✅ Built |
| `/hub/sales` | `/business/crm/pipeline` | ✅ Built |
| `/hub/finance` | `/metrics` | ✅ Built |
| `/hub/marketing` | `/business/marketing/campaigns` | ✅ Built |
| `/hub/tasks` | `/tasks` | ✅ Built |
| `/hub/projects` | `/business/projects` | ⏳ Pending |
| `/hub/team` | `/admin/users` | ✅ Built |
| `/hub/investors` | N/A | ❌ Removed |

### Knowledge Bank (New)
| Route | Purpose | Status |
|-------|---------|--------|
| `/bridge` | 5-step workflow wizard | ✅ Built |
| `/think` | Kanban topic boards | ✅ Built |
| `/spine` | Truth store metrics | ✅ Built |
| `/knowledge` | Session summaries inbox | ✅ Built |
| `/search` | Discovery search | ✅ Built |
| `/evidence` | Autonomy timeline | ✅ Built |
| `/context` | Flow A + B fusion | ✅ Built |
| `/demo` | Demo mode | ✅ Built |

---

## **Technology Stack**

### Current
- **Framework**: Next.js 16.0.10
- **React**: 19.2
- **Database**: Supabase (57 tables)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **AI**: Groq
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel

### Previous
- **Hub**: Next.js 14
- **Website**: Static HTML
- **API**: Cloudflare Workers + Hono
- **Webhooks**: Cloudflare Workers
- **Database**: Multiple (Supabase + Neon)
- **Deployment**: Multiple (Vercel + Cloudflare)

---

## **File Count Comparison**

| Category | Previous | Current | Change |
|----------|----------|---------|--------|
| Total Files | 340+ | 229 | -111 |
| App Pages | 19 | 26 | +7 |
| Components | 60+ (duplicated) | 67 (shared) | +7 |
| API Routes | 7 | 4 | -3 |
| Docs | 12 | 12 | 0 |
| Config | 16 | 14 | -2 |

---

## **Benefits of Current Architecture**

1. **Simplified Deployment**: Single app vs 4 separate deployments
2. **Consistent UX**: Unified design system across all pages
3. **Better Performance**: Shared components and utilities
4. **Easier Maintenance**: One codebase to manage
5. **Role-Based Navigation**: 4 Hats context switching
6. **Live Data**: Direct Supabase integration (57 tables)
7. **Modern Stack**: Next.js 16 + React 19.2

---

## **What Was Removed**

- Static marketing website (HTML)
- Separate API package (Cloudflare Workers)
- Webhook handlers package
- Duplicate component libraries
- Multiple auth implementations
- Investor relations pages
- Separate documentation deployments

---

## **What Was Added**

- 4 Hats architecture (Visionary, Missionary, Practitioner, Passenger)
- Knowledge Bank UI (8 new pages)
- Unified layout system (3 templates)
- Spine visualization with metrics
- Context Flow A/B integration
- Think Kanban boards
- Evidence timeline
- Bridge workflow wizard

---

**Status**: Current architecture is production-ready with 48 built pages and 7 pending implementations.
