# IntegrateWise OS - Complete Route Map

## Overview
This document provides a comprehensive map of all routes, pages, and features in the IntegrateWise OS application. The app follows Linear's minimal design aesthetic throughout.

## Architecture

### View System
The OS is organized around **Views** (departments/contexts) with consistent navigation across all views:

- **Personal** - Individual user workspace
- **Ops** - Operations department
- **Sales** - Sales department
- **Marketing** - Marketing department
- **CS** - Customer Success department
- **Projects** - Project management
- **Accounts** - Account management
- **Admin** - System administration

### World Scopes
- **Personal** - Individual user data
- **Work** - Departmental/team data (ops, sales, marketing, cs, projects)
- **Accounts** - Account intelligence data
- **Admin** - System configuration and management

## Standard Navigation (All Work Views)

Each non-admin view includes these standard pages:

### Core Pages
- **Home** (`/[view]/home`) - Dashboard with KPIs, active situations, and goals
- **Today** (`/[view]/today`) - Today's focused view
- **Tasks** (`/[view]/tasks`) - Task management
- **Goals** (`/[view]/goals`) - Goal tracking and progress

### OS Surfaces
- **Spine** (`/[view]/spine`) - Truth layer - canonical events and facts
- **Context** (`/[view]/context`) - Context layer - documents, emails, and artifacts
- **IQ Hub** (`/[view]/iq-hub`) - Knowledge layer - AI-generated insights
- **Agent** (`/[view]/agent`) - AI agent interface
- **Brainstorming** (`/[view]/brainstorming`) - Collaborative ideation

### Profile
- **Profile** (`/[view]/profile`) - User profile and preferences

## Complete Route Listing

### Personal View (`/personal/`)
✅ `/personal/home` - Personal dashboard
✅ `/personal/today` - Today's personal view
✅ `/personal/tasks` - Personal tasks
✅ `/personal/goals` - Personal goals
✅ `/personal/spine` - Personal truth layer
✅ `/personal/context` - Personal context
✅ `/personal/iq-hub` - Personal IQ Hub
✅ `/personal/agent` - Personal AI agent
✅ `/personal/brainstorming` - Personal brainstorming
✅ `/personal/profile` - Personal profile

### Operations View (`/ops/`)
✅ `/ops/home` - Operations dashboard
✅ `/ops/today` - Today's operations
✅ `/ops/tasks` - Operations tasks
✅ `/ops/goals` - Operations goals
✅ `/ops/spine` - Operations truth layer
✅ `/ops/context` - Operations context
✅ `/ops/iq-hub` - Operations IQ Hub
✅ `/ops/agent` - Operations AI agent
✅ `/ops/brainstorming` - Operations brainstorming
✅ `/ops/profile` - Operations profile

#### Ops Objects
✅ `/projects` - Project management
✅ `/sessions` - Work sessions

### Sales View (`/sales/`)
✅ `/sales/home` - Sales dashboard
✅ `/sales/today` - Today's sales
✅ `/sales/tasks` - Sales tasks
✅ `/sales/goals` - Sales goals
✅ `/sales/spine` - Sales truth layer
✅ `/sales/context` - Sales context
✅ `/sales/iq-hub` - Sales IQ Hub
✅ `/sales/agent` - Sales AI agent
✅ `/sales/brainstorming` - Sales brainstorming
✅ `/sales/profile` - Sales profile

#### Sales Objects
✅ `/sales/leads` - Lead management
✅ `/sales/pipeline` - Sales pipeline

### Marketing View (`/marketing/`)
✅ `/marketing/home` - Marketing dashboard
✅ `/marketing/today` - Today's marketing
✅ `/marketing/tasks` - Marketing tasks
✅ `/marketing/goals` - Marketing goals
✅ `/marketing/spine` - Marketing truth layer
✅ `/marketing/context` - Marketing context
✅ `/marketing/iq-hub` - Marketing IQ Hub
✅ `/marketing/agent` - Marketing AI agent
✅ `/marketing/brainstorming` - Marketing brainstorming
✅ `/marketing/profile` - Marketing profile

#### Marketing Objects
✅ `/marketing/content` - Content library
✅ `/marketing/website` - Website manager

### Customer Success View (`/cs/`)
✅ `/cs/home` - CS dashboard
✅ `/cs/today` - Today's CS
✅ `/cs/tasks` - CS tasks
✅ `/cs/goals` - CS goals
✅ `/cs/spine` - CS truth layer
✅ `/cs/context` - CS context
✅ `/cs/iq-hub` - CS IQ Hub
✅ `/cs/agent` - CS AI agent
✅ `/cs/brainstorming` - CS brainstorming
✅ `/cs/profile` - CS profile

#### CS Objects
✅ `/cs/customers` - Customer list
✅ `/cs/customers/[id]` - Customer detail
✅ `/cs/health` - Customer health

### Projects View (`/projects/`)
✅ `/projects/home` - Projects dashboard
✅ `/projects/today` - Today's projects
✅ `/projects/tasks` - Project tasks
✅ `/projects/goals` - Project goals
✅ `/projects/spine` - Projects truth layer
✅ `/projects/context` - Projects context
✅ `/projects/iq-hub` - Projects IQ Hub
✅ `/projects/agent` - Projects AI agent
✅ `/projects/brainstorming` - Projects brainstorming
✅ `/projects/profile` - Projects profile

### Accounts View (`/accounts/`)
✅ `/accounts/home` - Accounts dashboard
✅ `/accounts/today` - Today's accounts
✅ `/accounts/tasks` - Account tasks
✅ `/accounts/goals` - Account goals
✅ `/accounts/spine` - Accounts truth layer
✅ `/accounts/context` - Accounts context
✅ `/accounts/iq-hub` - Accounts IQ Hub
✅ `/accounts/agent` - Accounts AI agent
✅ `/accounts/brainstorming` - Accounts brainstorming
✅ `/accounts/profile` - Accounts profile

### Admin View (`/admin/`)

#### Control Plane
✅ `/admin/iq-hub` - IQ Hub management
✅ `/admin/policies` - Policy management
✅ `/admin/features` - Feature flags
✅ `/admin/releases` - Release management

#### Identity & Access
✅ `/admin/users` - User management
✅ `/admin/roles` - Role management
✅ `/admin/permissions` - Permission management
✅ `/admin/iam` - Identity and access

#### Tenant & Billing
✅ `/admin/billing` - Billing management
✅ `/admin/usage` - Usage tracking
✅ `/admin/tenancy` - Tenant management

#### Integrations
✅ `/admin/data-sources` - Data source management
✅ `/admin/webhooks` - Webhook management
✅ `/admin/connectors` - Connector management

#### Audit
✅ `/admin/audit` - Audit log
✅ `/admin/executions` - Execution logs
✅ `/admin/migrations` - Migration history

#### Additional Admin
✅ `/admin/today` - Admin daily view
✅ `/admin/actions` - Action management
✅ `/admin/schema` - Schema management
✅ `/admin/governance` - Governance rules
✅ `/admin/knowledge-governance` - Knowledge governance
✅ `/admin/registry` - Registry management
✅ `/admin/observability` - Observability dashboard
✅ `/admin/provisioning` - Provisioning management
✅ `/admin/tools` - Admin tools

### Global Routes
✅ `/` - Root (redirects to appropriate view)
✅ `/integrations` - Integration marketplace
✅ `/data-sources` - Data source management
✅ `/settings` - User settings
✅ `/customers` - Global customer view

### Legacy/Standalone Routes
✅ `/operations/today` - Operations today (legacy)
✅ `/operations/tasks` - Operations tasks (legacy)
✅ `/operations/goals` - Operations goals (legacy)
✅ `/operations/strategy` - Strategy view
✅ `/tasks` - Global tasks
✅ `/goals` - Global goals
✅ `/today` - Global today view
✅ `/signals` - Live signals view
✅ `/spine` - Global spine view
✅ `/context` - Global context view
✅ `/iq-hub` - Global IQ Hub
✅ `/brainstorming` - Global brainstorming
✅ `/knowledge` - Knowledge management
✅ `/act` - Action execution
✅ `/think` - Thinking/analysis
✅ `/loader` - Data loader
✅ `/insights` - Insights dashboard
✅ `/metrics` - Metrics dashboard
✅ `/pipeline` - Pipeline management
✅ `/shadow` - Shadow mode (debugging)

## Design System - Linear Style

### Colors
- **Primary Background**: `bg-white`
- **Borders**: `border-slate-200/60` (subtle, semi-transparent)
- **Text Primary**: `text-slate-900`
- **Text Secondary**: `text-slate-600`
- **Text Tertiary**: `text-slate-500`
- **Success**: `text-emerald-600`, `bg-emerald-50`
- **Warning**: `text-amber-600`, `bg-amber-50`
- **Error**: `text-rose-600`, `bg-rose-50`
- **Info**: `text-blue-600`, `bg-blue-50`

### Typography
- **Page Title**: `text-sm font-semibold text-slate-900`
- **Section Title**: `text-xs font-medium text-slate-600`
- **Body**: `text-xs text-slate-700`
- **Caption**: `text-xs text-slate-500`

### Spacing
- **Card Gap**: `gap-3` (12px)
- **Section Gap**: `gap-4` (16px)
- **Padding Small**: `p-2` (8px)
- **Padding Medium**: `p-3` (12px)

### Components
- **Card**: `bg-white border-slate-200/60 rounded-md hover:shadow-sm`
- **Button**: `rounded-md px-2.5 py-1.5 text-xs`
- **Badge**: `rounded text-xs border`
- **Progress Bar**: `h-1.5`

### Interaction States
- **Hover**: `hover:shadow-sm`, `hover:bg-slate-50`
- **Active**: `bg-slate-100`
- **Focus**: `focus:ring-2 focus:ring-slate-400`
- **Transition**: `transition-all` or `transition-colors`

## Key Features

### Shell Components
- **OS Shell** - Main application shell with sidebar, topbar, and view tabs
- **Signal Strip** - Live horizontal signal display with real-time updates
- **Situations Panel** - Active situations requiring attention
- **Evidence Drawer** - Bottom cognitive view with multi-layer evidence
- **Action Bar** - Action approval and execution interface
- **Knowledge Panel** - Right sidebar knowledge display

### Data Layers
1. **Spine (Truth)** - Canonical events and facts from systems of record
2. **Context** - Unstructured documents, emails, conversations
3. **IQ Hub (Knowledge)** - AI-generated insights, analyses, and recommendations

### Plan Gating
- **Personal** - Individual tier features
- **Team** - Team collaboration features
- **Org** - Organization-wide features
- **Enterprise** - Advanced enterprise features

### Role-Based Access Control (RBAC)
- **Owner** - Full system access
- **Admin** - Administrative access
- **Manager** - Department management access
- **Practitioner** - Standard user access
- **Readonly** - View-only access

## Navigation Structure

### Sidebar (Left)
- World scope selector (Personal/Work/Accounts/Admin)
- Core navigation items
- Ops objects (for ops view)
- OS surfaces
- Profile

### Top Bar
- View tabs (Ops, Sales, Marketing, CS, Projects, Admin)
- Global search
- Notifications
- User menu

### Bottom
- Evidence drawer (collapsible)
- Action bar (contextual)

## API Routes

### Signals
- `GET /api/signals?scope={scope}` - Fetch signals for scope

### Situations
- `GET /api/situations?scope={scope}` - Fetch situations for scope

### Tenant
- `GET /api/tenant/context` - Tenant context and configuration

### Admin
- `GET /api/admin/users` - User management
- `GET /api/admin/roles` - Role management
- `GET /api/admin/permissions` - Permission management
- `GET /api/admin/billing` - Billing information
- `GET /api/admin/today` - Admin daily summary

### Documents
- `GET /api/documents` - Fetch documents

## Status

✅ **Complete** - All 100+ routes implemented and styled with Linear design
✅ **Personal View** - All 10 pages created
✅ **Accounts View** - All 10 pages created
✅ **Admin View** - All 27 control plane routes
✅ **Design System** - Linear styling applied throughout
✅ **Shell Components** - All core components styled and wired
✅ **Dev Server** - Running successfully on http://localhost:3000

## Next Steps

1. Test all navigation flows
2. Implement view-specific page content
3. Add feature-specific components
4. Set up plan gating logic
5. Implement RBAC enforcement
6. Add comprehensive E2E tests
