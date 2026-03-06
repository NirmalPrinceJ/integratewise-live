# IntegrateWise Live - Complete Navigation Map

> **Quick Navigation**: This file provides direct links to ALL important files in the repository, organized by topic. No blind zones.

## 🗺️ Complete File Map

### 📚 Core Documentation (Start Here)
| Document | Location | Purpose |
|----------|----------|---------|
| **System Specification** | [SYSTEM_SPECIFICATION.md](SYSTEM_SPECIFICATION.md) | 🔴 **CANONICAL** - Complete technical specification (L0-L3, 8-stage pipeline, dual-loop architecture) |
| AI Agent Navigation | [agents.md](agents.md) | **PRIMARY** - Complete agent navigation with architecture, workflows, and search patterns |
| Complete File Index | [NAVIGATION.md](NAVIGATION.md) | Comprehensive file index with all documentation links (you are here) |
| Repository Overview | [README.md](README.md) | Human-readable overview and getting started |
| Claude Code Guide | [CLAUDE.md](CLAUDE.md) | Claude Code specific navigation guide |

### 🏗️ Architecture & System Design
| Document | Location | Description |
|----------|----------|-------------|
| **System Specification** | [SYSTEM_SPECIFICATION.md](SYSTEM_SPECIFICATION.md) | 🔴 **CANONICAL** - L0-L3 architecture, 15 modules, 14 components, 8-stage pipeline, dual-loop, accelerators, data stores |
| Architecture Diagram | [docs/archive/ARCHITECTURE_DIAGRAM.md](docs/archive/ARCHITECTURE_DIAGRAM.md) | Complete system architecture and component relationships |
| Architecture Restructure | [docs/archive/ARCHITECTURE_DIAGRAM.md](docs/archive/ARCHITECTURE_DIAGRAM.md) | Restructuring plans and migration paths |
| Infrastructure Mapping | [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md) | Infrastructure topology, services, and deployment architecture |
| Database Schema | [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Complete database schema, tables, relationships, and migrations |
| How It Works | [docs/architecture/how-it-works.md](docs/architecture/how-it-works.md) | System flow from data ingestion to display |
| Component Contracts | [docs/architecture/component-contracts.md](docs/architecture/component-contracts.md) | Component interface contracts and responsibilities |

### 🔌 Backend Architecture (from integratewise-marketing)
| Document | Location | Description |
|----------|----------|-------------|
| API Reference | [docs/api/index.md](docs/api/index.md) | Hub Controller API endpoints and usage |
| Webhook Providers | [docs/webhooks/index.md](docs/webhooks/index.md) | 15+ webhook providers and ingestion |
| Spine Schemas | [docs/spine/schemas.md](docs/spine/schemas.md) | Spine entity schemas and data model |
| Spine Mapping Guides | [docs/spine/mapping-guides.md](docs/spine/mapping-guides.md) | Mapping external data to Spine entities |
| Security Model | [docs/security/index.md](docs/security/index.md) | Security architecture and threat model |
| RBAC/ABAC | [docs/security/rbac-abac.md](docs/security/rbac-abac.md) | Role & attribute-based access control |
| Integration Matrix | [docs/integrations/matrix.md](docs/integrations/matrix.md) | Connector matrix and supported integrations |
| Integration Modes | [docs/integrations/compare-modes.md](docs/integrations/compare-modes.md) | Integration mode comparison (webhook vs polling vs MCP) |
| CS Intelligence Lenses | [docs/lenses/index.md](docs/lenses/index.md) | Customer Success intelligence lenses |
| Services Packaging | [docs/services/index.md](docs/services/index.md) | Backend services architecture and packaging |
| Evidence Framework | [docs/evidence/index.md](docs/evidence/index.md) | Case studies and evidence-based decision framework |
| Templates | [docs/templates/index.md](docs/templates/index.md) | Workflow templates and accelerators |
| Weekly Planning OS | [docs/templates/weekly-planning-os.md](docs/templates/weekly-planning-os.md) | Weekly planning template |
| SSOT v2 Content | [docs/content/ssot-v2-content.md](docs/content/ssot-v2-content.md) | Single Source of Truth v2 content strategy |

### 📦 Shared Packages
| Package | Location | Description |
|---------|----------|-------------|
| Spine Types | [packages/types/src/spine/](packages/types/src/spine/) | TypeScript type definitions for Spine entities |

### 📐 Diagrams
| Diagram | Location | Description |
|---------|----------|-------------|
| How It Works (PlantUML) | [diagrams/how-it-works.puml](diagrams/how-it-works.puml) | System architecture diagram (PlantUML) |

### 🎨 UI/UX Design & Audits
| Document | Location | Description |
|----------|----------|-------------|
| Comprehensive UI/UX Audit | [docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md) | Full UI/UX audit with findings and recommendations |
| Figma Design System Audit | [docs/FIGMA_DESIGN_SYSTEM_AUDIT.md](docs/FIGMA_DESIGN_SYSTEM_AUDIT.md) | Design system documentation and component guidelines |
| Landing Page Audit | [docs/LANDING_PAGE_AUDIT_REPORT.md](docs/LANDING_PAGE_AUDIT_REPORT.md) | Landing page analysis and optimization recommendations |
| Figma Marketing Audit | [docs/FIGMA_MARKETING_AUDIT.md](docs/FIGMA_MARKETING_AUDIT.md) | Marketing site audit and strategy |

### 🚀 Implementation & Deployment
| Document | Location | Description |
|----------|----------|-------------|
| Phase 1 Implementation Guide | [docs/PHASE1_IMPLEMENTATION_GUIDE.md](docs/PHASE1_IMPLEMENTATION_GUIDE.md) | Step-by-step implementation guide for Phase 1 |
| Cloudflare Deployment Status | [docs/CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md) | Cloudflare Pages deployment configuration and status |
| Cloudflare Pages Deploy Guide | [docs/CLOUDFLARE_PAGES_DEPLOY_GUIDE.md](docs/CLOUDFLARE_PAGES_DEPLOY_GUIDE.md) | Cloudflare Pages deployment setup guide |
| Integration Plan | [docs/INTEGRATION_PLAN.md](docs/INTEGRATION_PLAN.md) | Integration strategy and connection patterns |
| Implementation Complete | [docs/IMPLEMENTATION_COMPLETE.md](docs/IMPLEMENTATION_COMPLETE.md) | Implementation completion checklist |
| Production Ready Signoff | [docs/PRODUCTION_READY_SIGNOFF.md](docs/PRODUCTION_READY_SIGNOFF.md) | Production readiness verification |
| Final Launch Signoff | [docs/FINAL_LAUNCH_SIGNOFF.md](docs/FINAL_LAUNCH_SIGNOFF.md) | Final launch approval and checklist |

### 📋 Planning & Optimization
| Document | Location | Description |
|----------|----------|-------------|
| Directory Consolidation Plan | [docs/DIRECTORY_CONSOLIDATION_PLAN.md](docs/DIRECTORY_CONSOLIDATION_PLAN.md) | Directory cleanup and consolidation strategy |
| Chat Sessions Feb 7-8 | [docs/CHAT_SESSIONS_FEB_7_8_2026.md](docs/CHAT_SESSIONS_FEB_7_8_2026.md) | Development session notes and decisions |

### 🔧 Configuration & Workflows
| File/Directory | Location | Purpose |
|----------------|----------|---------|
| CI Workflow | [.github/workflows/ci.yml](.github/workflows/ci.yml) | Build CI workflow |
| VSCode Settings | [.vscode/settings.json](.vscode/settings.json) | VSCode workspace settings |
| MCP Configuration | [.vscode/mcp.json](.vscode/mcp.json) | Model Context Protocol server config |
| Claude Settings | [.claude/settings.local.json](.claude/settings.local.json) | Claude Code local settings |
| Workspace Definition | [brainstorming.code-workspace](brainstorming.code-workspace) | Multi-folder workspace configuration |

## 📁 Directory Structure with Key Files

```
integratewise-live/
│
├── package.json                   ← Root monorepo package.json
├── CLAUDE.md                      ← Agent navigation guide
├── NAVIGATION.md                  ← This file - complete navigation
├── README.md                      ← Human-readable overview
│
├── apps/
│   └── web/
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       ├── vite.config.ts
│       └── src/
│           ├── App.tsx
│           ├── main.tsx
│           └── components/
│               ├── workspace/             ← Workspace shell & routing
│               ├── domains/               ← Domain shells
│               │   ├── account-success/   ← Account Success domain
│               │   ├── revops/            ← RevOps domain
│               │   ├── salesops/          ← SalesOps domain
│               │   └── personal/          ← Personal domain
│               ├── hydration/             ← Hydration fabric + Spine
│               ├── marketing/             ← Marketing ops domain
│               ├── ui/                    ← Radix UI components
│               ├── admin/                 ← Admin tools
│               ├── auth/                  ← Authentication
│               └── [other domains]/
│
├── docs/                                  ← All documentation
│   ├── ARCHITECTURE_DIAGRAM.md
│   ├── ARCHITECTURE_RESTRUCTURE.md
│   ├── CLOUDFLARE_DEPLOYMENT_STATUS.md
│   ├── CLOUDFLARE_PAGES_DEPLOY_GUIDE.md
│   ├── COMPREHENSIVE_UI_UX_AUDIT_REPORT.md
│   ├── DATABASE_SCHEMA.md
│   ├── DIRECTORY_CONSOLIDATION_PLAN.md
│   ├── FIGMA_DESIGN_SYSTEM_AUDIT.md
│   ├── FIGMA_MARKETING_AUDIT.md
│   ├── FINAL_LAUNCH_SIGNOFF.md
│   ├── IMPLEMENTATION_COMPLETE.md
│   ├── INFRASTRUCTURE_MAPPING.md
│   ├── INTEGRATION_PLAN.md
│   ├── LANDING_PAGE_AUDIT_REPORT.md
│   ├── PHASE1_IMPLEMENTATION_GUIDE.md
│   ├── PRODUCTION_READY_SIGNOFF.md
│   ├── CHAT_SESSIONS_FEB_7_8_2026.md
│   ├── api/                       ← API reference docs
│   ├── architecture/              ← System design docs
│   ├── content/                   ← SSOT content strategy
│   ├── evidence/                  ← Case studies & evidence
│   ├── integrations/              ← Connector matrix & modes
│   ├── lenses/                    ← CS intelligence lenses
│   ├── security/                  ← Security & RBAC/ABAC
│   ├── services/                  ← Backend services architecture
│   ├── spine/                     ← Spine schemas & mapping
│   ├── templates/                 ← Workflow templates
│   └── webhooks/                  ← Webhook providers docs
│
├── packages/
│   └── types/                     ← Shared TypeScript types
│       └── src/spine/             ← Spine entity type definitions
│
├── diagrams/
│   └── how-it-works.puml          ← Architecture diagram (PlantUML)
│
├── .github/workflows/
│   └── ci.yml                     ← CI build workflow
│
├── .vscode/
│   ├── settings.json              ← VSCode settings
│   └── mcp.json                   ← MCP server config
│
└── .claude/
    └── settings.local.json        ← Claude Code settings
```

## 🎯 Quick Access by Role

### For AI Agents (Claude, Copilot, etc.)
- **Start here:** [CLAUDE.md](CLAUDE.md)
- **Architecture:** [docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md)
- **Infrastructure:** [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)
- **Complete file list:** This document (NAVIGATION.md)

### For Frontend Developers
- **Architecture:** [docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md)
- **UI/UX Guidelines:** [docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md)
- **Design System:** [docs/FIGMA_DESIGN_SYSTEM_AUDIT.md](docs/FIGMA_DESIGN_SYSTEM_AUDIT.md)
- **Component Library:** [apps/web/src/components/ui/](apps/web/src/components/ui/)

### For DevOps/Infrastructure
- **Infrastructure Map:** [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)
- **Deployment Guide:** [docs/PHASE1_IMPLEMENTATION_GUIDE.md](docs/PHASE1_IMPLEMENTATION_GUIDE.md)
- **Cloudflare Config:** [docs/CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md)
- **Database Schema:** [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)

### For Backend Developers
- **API Reference:** [docs/api/index.md](docs/api/index.md)
- **Spine Schemas:** [docs/spine/schemas.md](docs/spine/schemas.md)
- **Services Architecture:** [docs/services/index.md](docs/services/index.md)
- **Security Model:** [docs/security/index.md](docs/security/index.md)
- **Webhook Providers:** [docs/webhooks/index.md](docs/webhooks/index.md)
- **Integration Matrix:** [docs/integrations/matrix.md](docs/integrations/matrix.md)
- **Spine Types:** [packages/types/src/spine/](packages/types/src/spine/)

### For Product/Project Managers
- **Project Overview:** [README.md](README.md)
- **Implementation Status:** [docs/IMPLEMENTATION_COMPLETE.md](docs/IMPLEMENTATION_COMPLETE.md)
- **Production Readiness:** [docs/PRODUCTION_READY_SIGNOFF.md](docs/PRODUCTION_READY_SIGNOFF.md)
- **Launch Checklist:** [docs/FINAL_LAUNCH_SIGNOFF.md](docs/FINAL_LAUNCH_SIGNOFF.md)

## 🔍 Search Patterns

**Find all markdown documentation:**
```bash
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*"
```

**Find architecture-related docs:**
```bash
find . -name "*ARCHITECTURE*.md" -o -name "*INFRASTRUCTURE*.md"
```

**Find audit and analysis reports:**
```bash
find . -name "*AUDIT*.md" -o -name "*REPORT*.md"
```

**Find implementation guides:**
```bash
find . -name "*IMPLEMENTATION*.md" -o -name "*GUIDE*.md" -o -name "*PLAN*.md"
```

## 📌 Critical Files for Agent Context

When an agent needs to understand the full system, they should read **in this order:**

1. **[NAVIGATION.md](NAVIGATION.md)** (this file) - Get complete file map
2. **[CLAUDE.md](CLAUDE.md)** - Understand agent workflow and navigation
3. **[docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md)** - System architecture
4. **[docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)** - Infrastructure topology
5. **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Data model
6. **[docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md)** - UI/UX guidelines

---

**Last Updated:** February 15, 2026
**Purpose:** Eliminate blind zones and ensure complete agent visibility into the codebase
