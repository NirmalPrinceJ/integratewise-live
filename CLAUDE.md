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
│       │   │   ├── landing/       # Marketing landing pages
│       │   │   └── ui/            # Radix UI component library
│       │   ├── imports/           # Figma-exported page components
│       │   └── utils/             # Utility modules (Supabase client)
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── package.json
├── docs/                          # All documentation (architecture, audits, guides)
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
- **Landing Pages** ([apps/frontend-figma/src/components/landing/](apps/frontend-figma/src/components/landing/))

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
