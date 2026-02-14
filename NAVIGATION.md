# IntegrateWise Live - Complete Navigation Map

> **Quick Navigation**: This file provides direct links to ALL important files in the repository, organized by topic. No blind zones.

## 🗺️ Complete File Map

### 📚 Core Documentation (Start Here)
| Document | Location | Purpose |
|----------|----------|---------|
| AI Agent Navigation | [agents.md](agents.md) | **PRIMARY** - Complete agent navigation with architecture, workflows, and search patterns |
| Complete File Index | [NAVIGATION.md](NAVIGATION.md) | Comprehensive file index with all documentation links (you are here) |
| Repository Overview | [README.md](README.md) | Human-readable overview and getting started |
| Claude Code Guide | [CLAUDE.md](CLAUDE.md) | Claude Code specific navigation guide |

### 🏗️ Architecture & System Design
| Document | Location | Description |
|----------|----------|-------------|
| Architecture Diagram | [apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md](apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md) | Complete system architecture and component relationships |
| Architecture Restructure | [apps/frontend-figma/src/ARCHITECTURE_RESTRUCTURE.md](apps/frontend-figma/src/ARCHITECTURE_RESTRUCTURE.md) | Restructuring plans and migration paths |
| Infrastructure Mapping | [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md) | Infrastructure topology, services, and deployment architecture |
| Database Schema | [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | Complete database schema, tables, relationships, and migrations |

### 🎨 UI/UX Design & Audits
| Document | Location | Description |
|----------|----------|-------------|
| Comprehensive UI/UX Audit | [apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md) | Full UI/UX audit with findings and recommendations |
| Figma Design System Audit | [apps/frontend-figma/src/FIGMA_DESIGN_SYSTEM_AUDIT.md](apps/frontend-figma/src/FIGMA_DESIGN_SYSTEM_AUDIT.md) | Design system documentation and component guidelines |
| Landing Page Audit | [apps/frontend-figma/src/LANDING_PAGE_AUDIT_REPORT.md](apps/frontend-figma/src/LANDING_PAGE_AUDIT_REPORT.md) | Landing page analysis and optimization recommendations |
| Figma Marketing Audit | [apps/frontend-figma/FIGMA_MARKETING_AUDIT.md](apps/frontend-figma/FIGMA_MARKETING_AUDIT.md) | Marketing site audit and strategy |

### 🚀 Implementation & Deployment
| Document | Location | Description |
|----------|----------|-------------|
| Phase 1 Implementation Guide | [docs/PHASE1_IMPLEMENTATION_GUIDE.md](docs/PHASE1_IMPLEMENTATION_GUIDE.md) | Step-by-step implementation guide for Phase 1 |
| Cloudflare Deployment Status | [docs/CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md) | Cloudflare Pages deployment configuration and status |
| Integration Plan | [apps/frontend-figma/src/INTEGRATION_PLAN.md](apps/frontend-figma/src/INTEGRATION_PLAN.md) | Integration strategy and connection patterns |
| Implementation Complete | [apps/frontend-figma/src/IMPLEMENTATION_COMPLETE.md](apps/frontend-figma/src/IMPLEMENTATION_COMPLETE.md) | Implementation completion checklist |
| Production Ready Signoff | [apps/frontend-figma/src/PRODUCTION_READY_SIGNOFF.md](apps/frontend-figma/src/PRODUCTION_READY_SIGNOFF.md) | Production readiness verification |
| Final Launch Signoff | [apps/frontend-figma/src/FINAL_LAUNCH_SIGNOFF.md](apps/frontend-figma/src/FINAL_LAUNCH_SIGNOFF.md) | Final launch approval and checklist |

### 📋 Planning & Optimization
| Document | Location | Description |
|----------|----------|-------------|
| Directory Consolidation Plan | [apps/frontend-figma/DIRECTORY_CONSOLIDATION_PLAN.md](apps/frontend-figma/DIRECTORY_CONSOLIDATION_PLAN.md) | Directory cleanup and consolidation strategy |
| Chat Sessions Feb 7-8 | [docs/CHAT_SESSIONS_FEB_7_8_2026.md](docs/CHAT_SESSIONS_FEB_7_8_2026.md) | Development session notes and decisions |

### 🔧 Configuration & Workflows
| File/Directory | Location | Purpose |
|----------------|----------|---------|
| Cloudflare Pages Deploy | [.github/workflows/cloudflare-pages-deploy.md](.github/workflows/cloudflare-pages-deploy.md) | CI/CD workflow documentation |
| VSCode Settings | [.vscode/settings.json](.vscode/settings.json) | VSCode workspace settings |
| MCP Configuration | [.vscode/mcp.json](.vscode/mcp.json) | Model Context Protocol server config |
| Claude Settings | [.claude/settings.local.json](.claude/settings.local.json) | Claude Code local settings |
| Workspace Definition | [brainstroming.code-workspace](brainstroming.code-workspace) | Multi-folder workspace configuration |

## 📁 Directory Structure with Key Files

```
integratewise-live/
│
├── CLAUDE.md                      ← Agent navigation guide
├── NAVIGATION.md                  ← This file - complete navigation
├── README.md                      ← Human-readable overview
│
├── apps/
│   └── frontend-figma/
│       ├── package.json
│       ├── vite.config.ts
│       ├── DIRECTORY_CONSOLIDATION_PLAN.md
│       ├── FIGMA_MARKETING_AUDIT.md
│       └── src/
│           ├── App.tsx
│           ├── ARCHITECTURE_DIAGRAM.md           ← System architecture
│           ├── ARCHITECTURE_RESTRUCTURE.md       ← Restructuring plans
│           ├── COMPREHENSIVE_UI_UX_AUDIT_REPORT.md
│           ├── FIGMA_DESIGN_SYSTEM_AUDIT.md
│           ├── INTEGRATION_PLAN.md
│           ├── IMPLEMENTATION_COMPLETE.md
│           ├── PRODUCTION_READY_SIGNOFF.md
│           ├── FINAL_LAUNCH_SIGNOFF.md
│           ├── LANDING_PAGE_AUDIT_REPORT.md
│           │
│           └── components/
│               ├── workspace/
│               │   └── workspace-shell-new.tsx  ← Main workspace shell
│               ├── domains/
│               │   ├── account-success/         ← Account Success domain
│               │   ├── revops/                  ← RevOps domain
│               │   ├── salesops/                ← SalesOps domain
│               │   ├── personal/                ← Personal domain
│               │   └── domain-sidebar.tsx
│               ├── hydration/                   ← Hydration fabric + Spine
│               ├── landing/                     ← Landing pages
│               ├── ui/                          ← Radix UI components
│               ├── admin/                       ← Admin tools
│               ├── auth/                        ← Authentication
│               └── [other domains]/
│
├── docs/
│   ├── CLOUDFLARE_DEPLOYMENT_STATUS.md  ← Deployment config
│   ├── DATABASE_SCHEMA.md               ← Database schema
│   ├── INFRASTRUCTURE_MAPPING.md        ← Infrastructure topology
│   ├── PHASE1_IMPLEMENTATION_GUIDE.md   ← Implementation guide
│   └── CHAT_SESSIONS_FEB_7_8_2026.md    ← Dev session notes
│
├── .github/workflows/
│   └── cloudflare-pages-deploy.md       ← CI/CD documentation
│
├── .vscode/
│   ├── settings.json                    ← VSCode settings
│   └── mcp.json                         ← MCP server config
│
└── .claude/
    └── settings.local.json              ← Claude Code settings
```

## 🎯 Quick Access by Role

### For AI Agents (Claude, Copilot, etc.)
- **Start here:** [CLAUDE.md](CLAUDE.md)
- **Architecture:** [apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md](apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md)
- **Infrastructure:** [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)
- **Complete file list:** This document (NAVIGATION.md)

### For Frontend Developers
- **Architecture:** [apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md](apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md)
- **UI/UX Guidelines:** [apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md)
- **Design System:** [apps/frontend-figma/src/FIGMA_DESIGN_SYSTEM_AUDIT.md](apps/frontend-figma/src/FIGMA_DESIGN_SYSTEM_AUDIT.md)
- **Component Library:** [apps/frontend-figma/src/components/ui/](apps/frontend-figma/src/components/ui/)

### For DevOps/Infrastructure
- **Infrastructure Map:** [docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)
- **Deployment Guide:** [docs/PHASE1_IMPLEMENTATION_GUIDE.md](docs/PHASE1_IMPLEMENTATION_GUIDE.md)
- **Cloudflare Config:** [docs/CLOUDFLARE_DEPLOYMENT_STATUS.md](docs/CLOUDFLARE_DEPLOYMENT_STATUS.md)
- **Database Schema:** [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)

### For Product/Project Managers
- **Project Overview:** [README.md](README.md)
- **Implementation Status:** [apps/frontend-figma/src/IMPLEMENTATION_COMPLETE.md](apps/frontend-figma/src/IMPLEMENTATION_COMPLETE.md)
- **Production Readiness:** [apps/frontend-figma/src/PRODUCTION_READY_SIGNOFF.md](apps/frontend-figma/src/PRODUCTION_READY_SIGNOFF.md)
- **Launch Checklist:** [apps/frontend-figma/src/FINAL_LAUNCH_SIGNOFF.md](apps/frontend-figma/src/FINAL_LAUNCH_SIGNOFF.md)

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
3. **[apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md](apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md)** - System architecture
4. **[docs/INFRASTRUCTURE_MAPPING.md](docs/INFRASTRUCTURE_MAPPING.md)** - Infrastructure topology
5. **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Data model
6. **[apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md](apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md)** - UI/UX guidelines

---

**Last Updated:** February 15, 2026
**Purpose:** Eliminate blind zones and ensure complete agent visibility into the codebase
