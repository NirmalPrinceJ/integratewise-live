# IntegrateWise Live - Complete Navigation Map

> **Quick Navigation**: This file provides direct links to ALL important files in the repository, organized by topic. No blind zones.

## 🗺️ Complete File Map

### 📚 Core Documentation (Start Here)
| Document | Location | Purpose |
|----------|----------|---------|
| Agent Navigation Guide | [CLAUDE.md](CLAUDE.md) | Complete agent navigation with architecture, implementation guides, and search tips |
| Repository Overview | [README.md](README.md) | Human-readable overview and getting started |
| This Navigation Map | [NAVIGATION.md](NAVIGATION.md) | Comprehensive file index (you are here) |

### 🏗️ Architecture & System Design
| Document | Location | Description |
|----------|----------|-------------|
| Architecture Diagram | [docs/ARCHITECTURE_DIAGRAM.md](docs/ARCHITECTURE_DIAGRAM.md) | Complete system architecture and component relationships |
| Architecture Restructure | [docs/ARCHITECTURE_RESTRUCTURE.md](docs/ARCHITECTURE_RESTRUCTURE.md) | Restructuring plans and migration paths |
| Infrastructure Mapping | [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md) | Infrastructure topology, services, and deployment architecture |
| Database Schema | [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Complete database schema, tables, relationships, and migrations |

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
│   └── frontend-figma/
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
│   └── CHAT_SESSIONS_FEB_7_8_2026.md
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
- **Component Library:** [apps/frontend-figma/src/components/ui/](apps/frontend-figma/src/components/ui/)

### For DevOps/Infrastructure
- **Infrastructure Map:** [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)
- **Deployment Guide:** [docs/PHASE1_IMPLEMENTATION_GUIDE.md](docs/PHASE1_IMPLEMENTATION_GUIDE.md)
- **Cloudflare Config:** [docs/CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md)
- **Database Schema:** [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)

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
