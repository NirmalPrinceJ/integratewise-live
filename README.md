# IntegrateWise Live

**IntegrateWise OS** - Complete business operations platform monorepo

---

## 🗺️ Navigation & Documentation

**For AI Agents & Developers:**
- 📖 **[NAVIGATION.md](NAVIGATION.md)** - Complete file index with all documentation links (no blind zones)
- 🤖 **[CLAUDE.md](CLAUDE.md)** - AI agent navigation guide with architecture, workflows, and search patterns
- 📚 **[README.md](README.md)** - This file (overview and getting started)

**Quick Links:**
- [Architecture Diagram](docs/ARCHITECTURE_DIAGRAM.md)
- [Infrastructure Mapping](docs/INFRASTRUCTURE_MAPPING.md)
- [Implementation Guide](docs/PHASE1_IMPLEMENTATION_GUIDE.md)
- [UI/UX Audit](docs/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md)
- [API Reference](docs/api/index.md)
- [Spine Schemas](docs/spine/schemas.md)
- [Security](docs/security/index.md)

---

## Repository Structure

### `/apps/frontend-figma/`
IntegrateWise OS — Business Operations Platform
- React + Vite + TypeScript
- Radix UI component library
- Domain shells (Account Success, RevOps, SalesOps, Personal, Marketing)
- Hydration fabric and Spine integration

> **Note:** The marketing website is hosted on Webflow separately.

### `/docs/`
All project documentation:
- Architecture diagrams and restructuring plans
- Infrastructure mapping and database schema
- UI/UX audit reports and design system documentation
- Implementation guides and deployment configuration
- Launch signoffs and production readiness checklists
- **Backend architecture**: API reference, Spine schemas, services packaging
- **Security**: Security model, RBAC/ABAC documentation
- **Integrations**: Connector matrix, webhook providers, integration modes
- **Intelligence**: CS lenses, evidence framework, templates

### `/packages/types/`
Shared TypeScript type definitions:
- Spine entity types (task, note, conversation, plan, health-metric)
- Shared across frontend and backend services

### `/diagrams/`
Architecture diagrams:
- `how-it-works.puml` - System architecture (PlantUML)

### `.github/workflows/`
CI/CD pipelines:
- `ci.yml` - Build workflow

### Root Configuration
- `package.json` - Monorepo root with npm workspaces
- `brainstorming.code-workspace` - Multi-folder VSCode workspace definition

## IntegrateWise OS Architecture

This repository represents the **Live** instance of IntegrateWise OS, consolidating:

1. **Frontend UI** - Complete Figma-exported React application
2. **Backend Architecture** - Spine schemas, API reference, services documentation
3. **Shared Types** - TypeScript type definitions (`packages/types/`)
4. **Infrastructure Documentation** - Deployment guides, schemas, architecture

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Radix UI
- Tailwind CSS (via component library)

**Backend:**
- Cloudflare Workers (edge compute)
- Hono framework (HTTP router)
- Neon PostgreSQL (serverless database + pgvector)
- Cloudflare D1 (edge databases)

**Infrastructure:**
- Cloudflare Pages (hosting)
- Supabase (backend services)
- Doppler (secrets management)

## Getting Started

Navigate to the frontend:
```bash
cd apps/frontend-figma
npm install
npm run dev
```

Or from root (using npm workspaces):
```bash
npm install
npm run dev
```

## Documentation

All architectural decisions, infrastructure mapping, and deployment guides are in [`/docs`](docs/)

---

**Last Updated:** February 2026
**License:** Proprietary - IntegrateWise
