# IntegrateWise Live - Agent Navigation Guide

> **Purpose**: This file provides AI agents (Claude Code, GitHub Copilot, etc.) with complete codebase visibility and navigation. All critical documents, architecture decisions, and implementation guides are indexed here.

## 🎯 Repository Overview

This is the **IntegrateWise OS Live** monorepo containing:
1. **Frontend Application** - Figma-exported React UI (`apps/frontend-figma/`)
2. **Architecture Documentation** - Design decisions, schemas, infrastructure
3. **Implementation Guides** - Deployment, integration, and phase rollout plans

## 📂 Critical Documents Index

### Architecture & Design
- **[docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md)** - Complete system architecture
- **[docs/ARCHITECTURE_RESTRUCTURE.md](docs/ARCHITECTURE_RESTRUCTURE.md)** - Restructuring plans
- **[docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)** - Infrastructure topology
- **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Database schema and relationships
- **[docs/architecture/how-it-works.md](docs/architecture/how-it-works.md)** - System flow documentation
- **[docs/architecture/component-contracts.md](docs/architecture/component-contracts.md)** - Component contracts

### Backend Architecture
- **[docs/api/index.md](docs/api/index.md)** - Hub Controller API reference
- **[docs/spine/schemas.md](docs/spine/schemas.md)** - Spine entity schemas
- **[docs/spine/mapping-guides.md](docs/spine/mapping-guides.md)** - Data mapping guides
- **[docs/services/index.md](docs/services/index.md)** - Services architecture and packaging
- **[docs/webhooks/index.md](docs/webhooks/index.md)** - Webhook providers (15+)
- **[docs/security/index.md](docs/security/index.md)** - Security architecture
- **[docs/security/rbac-abac.md](docs/security/rbac-abac.md)** - Role & attribute-based access control
- **[docs/integrations/matrix.md](docs/integrations/matrix.md)** - Integration connector matrix
- **[docs/integrations/compare-modes.md](docs/integrations/compare-modes.md)** - Integration modes comparison

### Frontend UI/UX
- **[docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md)** - Complete UI/UX audit
- **[docs/FIGMA_DESIGN_SYSTEM_AUDIT.md](docs/FIGMA_DESIGN_SYSTEM_AUDIT.md)** - Design system documentation
- **[docs/LANDING_PAGE_AUDIT_REPORT.md](docs/LANDING_PAGE_AUDIT_REPORT.md)** - Landing page analysis
- **[docs/FIGMA_MARKETING_AUDIT.md](docs/FIGMA_MARKETING_AUDIT.md)** - Marketing site audit

### Implementation & Deployment
- **[docs/PHASE1_IMPLEMENTATION_GUIDE.md](docs/PHASE1_IMPLEMENTATION_GUIDE.md)** - Step-by-step implementation
- **[docs/CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md)** - Deployment configuration
- **[docs/INTEGRATION_PLAN.md](docs/INTEGRATION_PLAN.md)** - Integration strategy
- **[docs/PRODUCTION_READY_SIGNOFF.md](docs/PRODUCTION_READY_SIGNOFF.md)** - Production readiness checklist
- **[docs/FINAL_LAUNCH_SIGNOFF.md](docs/FINAL_LAUNCH_SIGNOFF.md)** - Launch approval

### Planning & Optimization
- **[docs/DIRECTORY_CONSOLIDATION_PLAN.md](docs/DIRECTORY_CONSOLIDATION_PLAN.md)** - Cleanup and consolidation plan
- **[docs/CHAT_SESSIONS_FEB_7_8_2026.md](docs/CHAT_SESSIONS_FEB_7_8_2026.md)** - Development session notes

## 🏗️ Codebase Structure

```
integratewise-live/
├── apps/
│   └── frontend-figma/           # React + Vite frontend
│       ├── src/
│       │   ├── components/        # UI components
│       │   │   ├── domains/       # Domain-specific (Account Success, RevOps, etc.)
│       │   │   ├── workspace/     # Workspace shell and routing
│       │   │   ├── hydration/     # Hydration fabric + Spine integration
│       │   │   ├── marketing/     # Marketing domain (campaigns, attribution)
│       │   │   └── ui/            # Radix UI component library
│       │   ├── imports/           # Figma-exported page components
│       │   └── utils/             # Utility modules (Supabase client)
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── package.json
├── packages/
│   └── types/                     # Shared TypeScript types
│       └── src/spine/             # Spine entity type definitions
├── docs/                          # All documentation
│   ├── api/                       # API reference
│   ├── architecture/              # System design docs
│   ├── content/                   # SSOT content strategy
│   ├── evidence/                  # Case studies
│   ├── integrations/              # Connector matrix & modes
│   ├── lenses/                    # CS intelligence lenses
│   ├── security/                  # Security & RBAC/ABAC
│   ├── services/                  # Backend services architecture
│   ├── spine/                     # Spine schemas & mapping
│   ├── templates/                 # Workflow templates
│   └── webhooks/                  # Webhook provider docs
├── diagrams/                      # Architecture diagrams (PlantUML)
├── .github/workflows/             # CI/CD pipelines
├── .vscode/                       # VSCode workspace config
├── package.json                   # Root monorepo package.json
├── CLAUDE.md                      # This file - agent navigation
└── README.md                      # Human-readable overview
```

## 🎨 Frontend Architecture

**Tech Stack:**
- React 18 + TypeScript
- Vite (build tool)
- Radix UI (component library)
- React Router (navigation)

**Key Components:**
- **Workspace Shell** ([apps/frontend-figma/src/components/workspace/workspace-shell-new.tsx](apps/frontend-figma/src/components/workspace/workspace-shell-new.tsx))
- **Domain Shells** ([apps/frontend-figma/src/components/domains/](apps/frontend-figma/src/components/domains/))
  - Account Success
  - RevOps
  - SalesOps
  - Personal
  - Marketing
- **Hydration Fabric** ([apps/frontend-figma/src/components/hydration/](apps/frontend-figma/src/components/hydration/))
- **Marketing Domain** ([apps/frontend-figma/src/components/marketing/](apps/frontend-figma/src/components/marketing/))

## 🔌 Infrastructure

**Hosting:** Cloudflare Pages
**Backend:** Supabase
**Secrets:** Doppler
**CI/CD:** GitHub Actions (see `.github/workflows/`)

See [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md) for complete topology.

## 🚀 Quick Start for Agents

### To understand the system:
1. Read [docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md)
2. Review [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)
3. Check [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)

### To work on frontend:
1. Navigate to `apps/frontend-figma/`
2. Check [docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md)
3. Review component structure in `src/components/`

### To work on backend:
1. Read [docs/api/index.md](docs/api/index.md) for API reference
2. Check [docs/spine/schemas.md](docs/spine/schemas.md) for data model
3. Review [docs/services/index.md](docs/services/index.md) for services architecture
4. Check [packages/types/src/spine/](packages/types/src/spine/) for TypeScript types
5. Review [docs/webhooks/index.md](docs/webhooks/index.md) for webhook integrations

### To deploy:
1. Follow [docs/PHASE1_IMPLEMENTATION_GUIDE.md](docs/PHASE1_IMPLEMENTATION_GUIDE.md)
2. Check [docs/CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md)

## 🔍 Search Tips for Agents

**Finding architecture decisions:**
```bash
grep -r "architecture\|design decision" docs/*.md
```

**Finding component documentation:**
```bash
find apps/frontend-figma/src/components -name "*.tsx"
```

**Finding infrastructure config:**
```bash
ls docs/*.md .github/workflows/*.yml
```

## 📝 Important Notes for Agents

1. **All documentation** is centralized in the `docs/` directory
2. **Frontend source code** is in `apps/frontend-figma/src/`
3. **Audit reports** contain critical UI/UX decisions
4. **PRODUCTION_READY_SIGNOFF.md** and **FINAL_LAUNCH_SIGNOFF.md** track deployment readiness

## 🤖 Agent Workflow Recommendations

**For code changes:**
1. Check relevant docs in `docs/` first (architecture, audits)
2. Review component structure in target domain
3. Consult `docs/INTEGRATION_PLAN.md` for integration patterns
4. Follow patterns in existing components

**For infrastructure changes:**
1. Start with `docs/INFRASTRUCTURE_MAPPING.md`
2. Check `docs/CLOUDFLARE_DEPLOYMENT_STATUS.md`
3. Review `docs/PHASE1_IMPLEMENTATION_GUIDE.md`
4. Update relevant deployment docs after changes

**For new features:**
1. Read `docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md` for design patterns
2. Check `docs/FIGMA_DESIGN_SYSTEM_AUDIT.md` for component guidelines
3. Follow domain-specific patterns in `components/domains/`
4. Update architecture docs as needed

---

**Last Updated:** February 15, 2026
**Maintained by:** IntegrateWise Development Team + Claude Code Agents
