# IntegrateWise Live - Agent Navigation Guide

> **For AI Agents (Claude Code, GitHub Copilot, Cursor, etc.)**: This file provides complete navigation and context for understanding the IntegrateWise OS codebase.

## 🎯 Quick Start for Agents

When you need to understand this codebase, read these files **in order**:

1. **[SYSTEM_SPECIFICATION.md](SYSTEM_SPECIFICATION.md)** - 🔴 **CANONICAL** technical specification (L0-L3 architecture, 8-stage pipeline, dual-loop, 15 modules, 14 components)
2. **[agents.md](agents.md)** (this file) - Agent navigation and workflow
3. **[NAVIGATION.md](NAVIGATION.md)** - Complete file index with all documentation links
4. **[apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md](apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md)** - System architecture
5. **[docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)** - Infrastructure topology
6. **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Data model

## 📂 Critical Documents Index

### Architecture & Design
| Document | Location | Purpose |
|----------|----------|---------|
| **System Specification** | [SYSTEM_SPECIFICATION.md](SYSTEM_SPECIFICATION.md) | 🔴 **CANONICAL** - Complete L0-L3 architecture, 8-stage pipeline, dual-loop, accelerators, data stores |
| Architecture Diagram | [apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md](apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md) | Complete system architecture and component relationships |
| Architecture Restructure | [apps/frontend-figma/src/ARCHITECTURE_RESTRUCTURE.md](apps/frontend-figma/src/ARCHITECTURE_RESTRUCTURE.md) | Restructuring plans and migration paths |
| Infrastructure Mapping | [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md) | Infrastructure topology, services, deployment architecture |
| Database Schema | [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Complete database schema, tables, relationships |

### Frontend UI/UX
| Document | Location | Purpose |
|----------|----------|---------|
| Comprehensive UI/UX Audit | [apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md) | Full UI/UX audit with findings and recommendations |
| Figma Design System | [apps/frontend-figma/src/FIGMA_DESIGN_SYSTEM_AUDIT.md](apps/frontend-figma/src/FIGMA_DESIGN_SYSTEM_AUDIT.md) | Design system documentation and component guidelines |
| Landing Page Audit | [apps/frontend-figma/src/LANDING_PAGE_AUDIT_REPORT.md](apps/frontend-figma/src/LANDING_PAGE_AUDIT_REPORT.md) | Landing page analysis and optimization |

### Implementation & Deployment
| Document | Location | Purpose |
|----------|----------|---------|
| Phase 1 Implementation | [docs/PHASE1_IMPLEMENTATION_GUIDE.md](docs/PHASE1_IMPLEMENTATION_GUIDE.md) | Step-by-step implementation guide |
| Cloudflare Deployment | [docs/CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md) | Deployment configuration and status |
| Integration Plan | [apps/frontend-figma/src/INTEGRATION_PLAN.md](apps/frontend-figma/src/INTEGRATION_PLAN.md) | Integration strategy and patterns |
| Production Ready Signoff | [apps/frontend-figma/src/PRODUCTION_READY_SIGNOFF.md](apps/frontend-figma/src/PRODUCTION_READY_SIGNOFF.md) | Production readiness verification |

### Planning & Optimization
| Document | Location | Purpose |
|----------|----------|---------|
| Directory Consolidation | [apps/frontend-figma/DIRECTORY_CONSOLIDATION_PLAN.md](apps/frontend-figma/DIRECTORY_CONSOLIDATION_PLAN.md) | Directory cleanup strategy |
| Session Notes | [docs/CHAT_SESSIONS_FEB_7_8_2026.md](docs/CHAT_SESSIONS_FEB_7_8_2026.md) | Development session notes and decisions |

## 🗂️ Codebase Structure

```
integratewise-live/
│
├── 📖 agents.md                    ← You are here - Agent navigation
├── 📖 NAVIGATION.md                ← Complete file index
├── 📖 README.md                    ← Human-readable overview
├── 📖 CLAUDE.md                    ← Claude Code specific guide
│
├── apps/
│   └── frontend-figma/             ← Main React application
│       ├── src/
│       │   ├── App.tsx             ← Application entry point
│       │   │
│       │   ├── 📄 ARCHITECTURE_DIAGRAM.md       ← System architecture
│       │   ├── 📄 ARCHITECTURE_RESTRUCTURE.md   ← Restructuring plans
│       │   ├── 📄 COMPREHENSIVE_UI_UX_AUDIT_REPORT.md
│       │   ├── 📄 FIGMA_DESIGN_SYSTEM_AUDIT.md
│       │   ├── 📄 INTEGRATION_PLAN.md
│       │   ├── 📄 PRODUCTION_READY_SIGNOFF.md
│       │   │
│       │   └── components/
│       │       ├── workspace/
│       │       │   └── workspace-shell-new.tsx  ← Main shell
│       │       │
│       │       ├── domains/
│       │       │   ├── account-success/         ← Account Success domain
│       │       │   ├── revops/                  ← RevOps domain
│       │       │   ├── salesops/                ← SalesOps domain
│       │       │   ├── personal/                ← Personal domain
│       │       │   ├── marketing/               ← Marketing domain
│       │       │   └── domain-sidebar.tsx       ← Domain navigation
│       │       │
│       │       ├── hydration/                   ← Hydration fabric + Spine
│       │       │   ├── hydration-fabric.tsx
│       │       │   ├── spine-context.tsx
│       │       │   └── providers.tsx
│       │       │
│       │       ├── landing/                     ← Landing pages
│       │       ├── ui/                          ← Radix UI components
│       │       ├── admin/                       ← Admin tools
│       │       └── auth/                        ← Authentication
│       │
│       ├── 📄 DIRECTORY_CONSOLIDATION_PLAN.md
│       ├── 📄 FIGMA_MARKETING_AUDIT.md
│       ├── package.json
│       └── vite.config.ts
│
├── docs/                           ← Infrastructure documentation
│   ├── 📄 CLOUDFLARE_DEPLOYMENT_STATUS.md
│   ├── 📄 DATABASE_SCHEMA.md
│   ├── 📄 INFRASTRUCTURE_MAPPING.md
│   ├── 📄 PHASE1_IMPLEMENTATION_GUIDE.md
│   └── 📄 CHAT_SESSIONS_FEB_7_8_2026.md
│
├── .github/workflows/              ← CI/CD workflows
│   └── cloudflare-pages-deploy.md
│
├── .vscode/                        ← VSCode configuration
│   ├── settings.json
│   └── mcp.json                    ← MCP server config
│
└── .claude/                        ← Claude Code settings
    └── settings.local.json
```

## 🤖 Agent Workflow Recommendations

### For Understanding the System
1. **Start with architecture**: Read [ARCHITECTURE_DIAGRAM.md](apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md) for complete system overview
2. **Check infrastructure**: Review [INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md) for deployment topology
3. **Understand data model**: Consult [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) for database structure
4. **Review UI/UX guidelines**: Check [COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md)

### For Making Code Changes
1. **Check relevant documentation first**:
   - Architecture docs ([ARCHITECTURE_DIAGRAM.md](apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md), [ARCHITECTURE_RESTRUCTURE.md](apps/frontend-figma/src/ARCHITECTURE_RESTRUCTURE.md))
   - UI/UX audits ([COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md))
   - Integration patterns ([INTEGRATION_PLAN.md](apps/frontend-figma/src/INTEGRATION_PLAN.md))
2. **Review component structure** in the target domain
3. **Follow established patterns** from existing components
4. **Update relevant documentation** if you make architectural changes

### For Deployment & Infrastructure
1. **Check deployment status**: [CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md)
2. **Review implementation guide**: [PHASE1_IMPLEMENTATION_GUIDE.md](docs/PHASE1_IMPLEMENTATION_GUIDE.md)
3. **Verify production readiness**: [PRODUCTION_READY_SIGNOFF.md](apps/frontend-figma/src/PRODUCTION_READY_SIGNOFF.md)

## 🔍 Search Patterns for Agents

### Find Architecture Documentation
```bash
# All architecture docs
find . -name "*ARCHITECTURE*.md" -o -name "*INFRASTRUCTURE*.md"

# System design docs
grep -r "architecture\|design\|system" --include="*.md" apps/frontend-figma/src/ docs/
```

### Find Component Documentation
```bash
# All components
find apps/frontend-figma/src/components -name "*.tsx" -o -name "*.ts"

# Specific domain components
find apps/frontend-figma/src/components/domains/{domain-name} -name "*.tsx"
```

### Find Implementation Guides
```bash
# All implementation and planning docs
find . -name "*IMPLEMENTATION*.md" -o -name "*GUIDE*.md" -o -name "*PLAN*.md"
```

### Find Audit Reports
```bash
# All audit and analysis reports
find . -name "*AUDIT*.md" -o -name "*REPORT*.md"
```

## 🎨 Key Domain Components

### Account Success Domain
- **Location**: [apps/frontend-figma/src/components/domains/account-success/](apps/frontend-figma/src/components/domains/account-success/)
- **Components**: Account health, customer success metrics, engagement tracking
- **Entry Point**: Account success dashboard

### RevOps Domain
- **Location**: [apps/frontend-figma/src/components/domains/revops/](apps/frontend-figma/src/components/domains/revops/)
- **Components**: Revenue operations, pipeline management, forecasting
- **Entry Point**: RevOps dashboard

### SalesOps Domain
- **Location**: [apps/frontend-figma/src/components/domains/salesops/](apps/frontend-figma/src/components/domains/salesops/)
- **Components**: Sales operations, deal management, quota tracking
- **Entry Point**: SalesOps dashboard

### Personal Domain
- **Location**: [apps/frontend-figma/src/components/domains/personal/](apps/frontend-figma/src/components/domains/personal/)
- **Components**: Personal workspace, tasks, notes, calendar
- **Entry Point**: Personal dashboard

### Marketing Domain
- **Location**: [apps/frontend-figma/src/components/domains/marketing/](apps/frontend-figma/src/components/domains/marketing/)
- **Components**: Marketing campaigns, analytics, content management
- **Entry Point**: Marketing dashboard

## 🔌 Core Integration Components

### Hydration Fabric
- **Location**: [apps/frontend-figma/src/components/hydration/](apps/frontend-figma/src/components/hydration/)
- **Purpose**: Manages data hydration and real-time updates across domains
- **Key Files**:
  - `hydration-fabric.tsx` - Main hydration logic
  - `spine-context.tsx` - Spine integration context
  - `providers.tsx` - Provider composition

### Workspace Shell
- **Location**: [apps/frontend-figma/src/components/workspace/](apps/frontend-figma/src/components/workspace/)
- **Purpose**: Main application shell and layout management
- **Key File**: `workspace-shell-new.tsx`

## 📊 Tech Stack Context

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI components
- **Styling**: Tailwind CSS (via component library)
- **State Management**: Context API + Hydration Fabric

### Infrastructure
- **Hosting**: Cloudflare Pages
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Secrets**: Doppler
- **CI/CD**: GitHub Actions

### Development
- **Package Manager**: npm
- **Code Editor**: VSCode with Claude Code integration
- **Version Control**: Git with conventional commits

## 🚨 Important Conventions

### File Naming
- Components: PascalCase (e.g., `WorkspaceShell.tsx`)
- Utilities: kebab-case (e.g., `format-date.ts`)
- Documentation: SCREAMING_SNAKE_CASE (e.g., `ARCHITECTURE_DIAGRAM.md`)

### Documentation Location
- **Architecture docs**: [apps/frontend-figma/src/](apps/frontend-figma/src/)
- **Infrastructure docs**: [docs/](docs/)
- **Component docs**: Co-located with components
- **Navigation**: Root level ([agents.md](agents.md), [NAVIGATION.md](NAVIGATION.md))

### Code Organization
- **Domain-driven**: Components organized by business domain
- **Shared components**: In [apps/frontend-figma/src/components/ui/](apps/frontend-figma/src/components/ui/)
- **Cross-cutting concerns**: In [apps/frontend-figma/src/components/hydration/](apps/frontend-figma/src/components/hydration/)

## 💡 Tips for Effective Agent Collaboration

1. **Always check documentation first** before making assumptions about architecture
2. **Use NAVIGATION.md** to find relevant files quickly
3. **Update documentation** when you make significant changes
4. **Follow existing patterns** rather than inventing new ones
5. **Check git history** for context on why decisions were made
6. **Reference implementation guides** for deployment procedures
7. **Consult UI/UX audits** before making interface changes

## 🔗 External Resources

- **Repository**: https://github.com/NirmalPrinceJ/integratewise-live
- **Cloudflare Dashboard**: (See [CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md))
- **Supabase Dashboard**: (See [INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md))

---

**Last Updated**: February 15, 2026
**Purpose**: Provide AI agents with complete navigation and context for the IntegrateWise OS codebase
**Maintained by**: IntegrateWise Development Team
