# IntegrateWise Live

**IntegrateWise OS** - Complete business operations platform monorepo

---

## 🗺️ Navigation & Documentation

**For AI Agents & Developers:**
- 🤖 **[agents.md](agents.md)** - Primary AI agent navigation guide with architecture, workflows, and search patterns
- 📖 **[NAVIGATION.md](NAVIGATION.md)** - Complete file index with all documentation links (no blind zones)
- 📚 **[README.md](README.md)** - This file (overview and getting started)

**Quick Links:**
- [Architecture Diagram](apps/frontend-figma/src/ARCHITECTURE_DIAGRAM.md)
- [Infrastructure Mapping](docs/INFRASTRUCTURE_MAPPING.md)
- [Implementation Guide](docs/PHASE1_IMPLEMENTATION_GUIDE.md)
- [UI/UX Audit](apps/frontend-figma/src/COMPREHENSIVE_UI_UX_AUDIT_REPORT.md)

---

## Repository Structure

### `/apps/frontend-figma/`
Complete Figma frontend export for IntegrateWise Business Operations Design
- React + Vite + TypeScript
- Radix UI component library
- Domain shells (Account Success, RevOps, SalesOps, Personal, Marketing)
- Hydration fabric and Spine integration
- Landing pages and marketing site
- **219 component files** + comprehensive UI/UX documentation

### `/docs/`
Infrastructure and architecture documentation:
- `CLOUDFLARE_DEPLOYMENT_STATUS.md` - Deployment configuration
- `DATABASE_SCHEMA.md` - Database schema and relationships
- `INFRASTRUCTURE_MAPPING.md` - Complete infrastructure architecture
- `PHASE1_IMPLEMENTATION_GUIDE.md` - Implementation guide
- `CHAT_SESSIONS_FEB_7_8_2026.md` - Development session notes

### `.vscode/`
Workspace configuration:
- MCP (Model Context Protocol) server settings
- VSCode workspace preferences

### Root Configuration
- `brainstroming.code-workspace` - Multi-folder VSCode workspace definition
- `.github/workflows/` - CI/CD workflows

## IntegrateWise OS Architecture

This repository represents the **Live** instance of IntegrateWise OS, consolidating:

1. **Frontend UI** - Complete Figma-exported React application
2. **Infrastructure Documentation** - Deployment guides, schemas, architecture
3. **Brainstorming Materials** - Session notes, consolidation plans, audit reports

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Radix UI
- Tailwind CSS (via component library)

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

## Documentation

All architectural decisions, infrastructure mapping, and deployment guides are in [`/docs`](docs/)

---

**Last Updated:** February 2026
**License:** Proprietary - IntegrateWise
