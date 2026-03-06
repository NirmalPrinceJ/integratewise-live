# IntegrateWise OS Documentation

Welcome to the IntegrateWise Operating System documentation. This is your navigation hub for understanding, building, and operating the platform.

---

## 🏛️ Start Here: Constitutional Documents

These documents define the **immutable platform architecture** and brand identity. All implementation must align with these:

### [CANONICAL_OS_LAYER_MODEL.md](./CANONICAL_OS_LAYER_MODEL.md)
**🔒 LOCKED - OS Constitution v1.0**

The definitive source of truth for IntegrateWise OS architecture. Defines the 5-layer model:
- **L-1** (External Reality Universe): The world outside IntegrateWise (Salesforce, Slack, Google, etc.)
- **L0** (Onboarding): How reality enters the system (intent declaration)
- **L3** (Adaptive Spine): Where reality becomes truth (SSOT + learning + readiness)
- **L2** (Cognitive Brain): Where truth becomes judgment (reasoning + decisions + automation)
- **L1** (The Workplace): Where humans execute work (bucket-driven workspaces)

> _"L-1 is the world, L0 introduces reality, L3 understands it, L2 reasons about it, and L1 lets humans act on it."_

### [BRAND_GUIDE.md](./BRAND_GUIDE.md)
**Version 1.0 - Visual Identity System**

Brand assets, logo variants, colors, and messaging guidelines:
- Logo system (horizontal, logomark, dark mode)
- Brand colors: Navy `#2D4A7C`, White `#FFFFFF`, Action Pink `#F54476`
- Typography: Inter Bold + Regular
- Core promise: _"Normalize once. Power every workflow."_

### [COGNITIVE_BRAIN_SPEC.md](./COGNITIVE_BRAIN_SPEC.md)
**Version 1.0 - L2 Reasoning Engine**

Complete specification for the Cognitive Brain (L2):
- Decision Memory - AI governance & repeatability
- Trust Score Engine - Confidence metrics for automation
- Reality Drift Detection - Production vs. expected state monitoring
- Simulation Engine - What-if scenario modeling

---

## 🚀 Getting Started

### [DEVELOPER_GETTING_STARTED.md](./DEVELOPER_GETTING_STARTED.md)
Onboarding guide for new engineers:
- Repository structure
- Local setup instructions
- Development workflow

### [ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md)
High-level system walkthrough for understanding how all pieces fit together.

---

## 🏗️ Architecture & Components

### Connectors & Data Integration
- **[CONNECTORS.md](./CONNECTORS.md)** - Complete connector inventory (CRM, billing, collaboration, etc.)
- **[CONNECTOR_LIMITS.md](./CONNECTOR_LIMITS.md)** - Rate limiting and throttling strategies
- **[SIGNAL_MODEL.md](./SIGNAL_MODEL.md)** - How data becomes actionable signals
- **[ACTIONABLE_SIGNALS.md](./ACTIONABLE_SIGNALS.md)** - Signal definitions and thresholds

### Routing & APIs
- **[CORE_WORKER_ROUTES.md](./CORE_WORKER_ROUTES.md)** - Backend worker route map
- **[KNOWLEDGE_WORKER_ROUTES.md](./KNOWLEDGE_WORKER_ROUTES.md)** - Knowledge worker API routes

### User Experience
- **[OS_SHELL_UX_UI_SPEC.md](./OS_SHELL_UX_UI_SPEC.md)** - Complete L1 workspace UX/UI specification
- **[USER_GUIDE.md](./USER_GUIDE.md)** - End-user documentation

### Data & Schema
- **[ACCOUNTS_INTELLIGENCE_SCHEMA.md](./ACCOUNTS_INTELLIGENCE_SCHEMA.md)** - Accounts intelligence data model

### Product
- **[PRODUCT_SKUS.md](./PRODUCT_SKUS.md)** - Product tiers and packaging

---

## 🚢 Operations & Deployment

### Deployment
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - General deployment guide
- **[DEPLOYMENT_BITBUCKET_PIPELINES.md](./DEPLOYMENT_BITBUCKET_PIPELINES.md)** - CI/CD via Bitbucket Pipelines
- **[DEPLOYMENT_PACKAGING.md](./DEPLOYMENT_PACKAGING.md)** - Detailed packaging and deployment procedures
- **[ENVIRONMENTS.md](./ENVIRONMENTS.md)** - Environment topology and promotion workflow

### Operations
- **[OPERATIONS_RUNBOOK.md](./OPERATIONS_RUNBOOK.md)** - Operational procedures (migrations, secret rotation)
- **[MONITORING_ALERTING.md](./MONITORING_ALERTING.md)** - Observability configuration
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions

### Runbooks
See the **[runbooks/](./runbooks/)** folder for detailed operational guides:
- [auth.md](./runbooks/auth.md) - Authentication troubleshooting
- [database.md](./runbooks/database.md) - Database operations
- [incidents.md](./runbooks/incidents.md) - Incident response procedures
- [secret-rotation.md](./runbooks/secret-rotation.md) - Secret rotation procedures
- [webhooks.md](./runbooks/webhooks.md) - Webhook debugging and resilience

---

## 🧬 Spine (L3) Architecture

The Adaptive Spine is the truth layer. See the **[spine/](./spine/)** folder for detailed documentation:

- **[spine/CANONICAL_ARCHITECTURE.md](./spine/CANONICAL_ARCHITECTURE.md)** - Spine canonical design
- **[spine/SPINE_UNDERSTANDING.md](./spine/SPINE_UNDERSTANDING.md)** - Conceptual overview
- **[spine/SPINE_DATA_FLOW_ARCHITECTURE.md](./spine/SPINE_DATA_FLOW_ARCHITECTURE.md)** - Data flow patterns
- **[spine/SPINE_SCHEMA_ANALYSIS.md](./spine/SPINE_SCHEMA_ANALYSIS.md)** - Schema deep dive
- **[spine/SPINE_WORKFLOW_PLAN.md](./spine/SPINE_WORKFLOW_PLAN.md)** - Workflow implementation
- **[spine/ARCHITECTURE_GAP_ANALYSIS.md](./spine/ARCHITECTURE_GAP_ANALYSIS.md)** - Gap analysis
- **[spine/ATLAS_SPINE_EXTENDED_INTEGRATIONS.md](./spine/ATLAS_SPINE_EXTENDED_INTEGRATIONS.md)** - Extended integrations

---

## 💎 Best Practices & Standards

- **[BEST_PRACTICES_IMPLEMENTATION.md](./BEST_PRACTICES_IMPLEMENTATION.md)** - Coding standards, security guardrails, and development best practices

---

## 🗄️ Archive

Historical and superseded documentation has been moved to **[archive/](./archive/)**.

Archive contains:
- Old architecture explorations (superseded by CANONICAL_OS_LAYER_MODEL.md)
- Historical implementation plans and trackers
- Point-in-time audits and gap analyses
- Exploratory vendor integration docs

See [archive/README.md](./archive/README.md) for details.

**Note**: Do not link to archive docs from active documentation. Archive is for historical reference only.

---

## 📦 Document Lifecycle

| Status | Meaning | Example |
|--------|---------|---------|
| 🔒 **LOCKED** | Constitutional - requires formal amendment | CANONICAL_OS_LAYER_MODEL.md |
| ✅ **ACTIVE** | Current, authoritative guidance | Most docs in main folder |
| 📋 **REFERENCE** | Supporting detail, not primary source | CONNECTOR_LIMITS.md |
| 🗄️ **ARCHIVE** | Historical context only | See archive/ folder |

---

## 🤝 Contributing to Documentation

When adding or updating documentation:

1. **Check constitutional alignment** - Does it fit within L0-L3 boundaries?
2. **Avoid duplication** - Update existing docs rather than creating new ones
3. **Link from this README** - Add your doc to the appropriate section above
4. **Use clear status markers** - Indicate if draft, active, or deprecated
5. **Follow the brand** - Use the brand colors and voice from BRAND_GUIDE.md

### Creating New Documentation

Ask yourself:
- Does this belong in an existing doc?
- Is it architectural (→ reference CANONICAL_OS_LAYER_MODEL.md)?
- Is it operational (→ runbooks/ or OPERATIONS_RUNBOOK.md)?
- Is it implementation-specific (→ might belong in code comments or README)?

---

## 🔗 Quick Links

| I want to... | Go to... |
|--------------|----------|
| Understand the OS architecture | [CANONICAL_OS_LAYER_MODEL.md](./CANONICAL_OS_LAYER_MODEL.md) |
| Set up my dev environment | [DEVELOPER_GETTING_STARTED.md](./DEVELOPER_GETTING_STARTED.md) |
| Deploy to production | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| Troubleshoot an issue | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or [runbooks/](./runbooks/) |
| Understand the Cognitive Brain | [COGNITIVE_BRAIN_SPEC.md](./COGNITIVE_BRAIN_SPEC.md) |
| Add a new connector | [CONNECTORS.md](./CONNECTORS.md) |
| See brand assets | [BRAND_GUIDE.md](./BRAND_GUIDE.md) |
| Find historical context | [archive/](./archive/) |

---

**IntegrateWise OS** — _The Workplace. Powered by Adaptive Spine._

Brand Colors: Navy `#2D4A7C` · White `#FFFFFF`
