# IntegrateWise OS - Deployment & Packaging Guide

> **Complete guide for packaging and deploying IntegrateWise OS as a unified application**

## 🏗️ Architecture Overview

IntegrateWise OS is a **distributed monorepo** with:
- **1 Next.js Frontend** → Vercel OR Cloudflare Pages
- **19 Cloudflare Workers** → Backend microservices
- **2 Database Types** → Cloudflare D1 + Neon PostgreSQL

```
┌─────────────────────────────────────────────────────────────────────┐
│                         IntegrateWise OS                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (Next.js)                         │  │
│  │                 Vercel / Cloudflare Pages                     │  │
│  │              https://integratewise.ai                         │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
│                             │                                       │
│                             ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  API GATEWAY LAYER                            │  │
│  │                                                               │  │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │  │
│  │   │ gateway │  │ admin   │  │ tenants │  │ hub-controller  │ │  │
│  │   └────┬────┘  └────┬────┘  └────┬────┘  └────────┬────────┘ │  │
│  └────────┼────────────┼────────────┼────────────────┼──────────┘  │
│           │            │            │                │              │
│           ▼            ▼            ▼                ▼              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    CORE SERVICES                              │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐  │  │
│  │  │ spine  │ │ think  │ │  act   │ │ govern │ │ knowledge  │  │  │
│  │  │ (SSOT) │ │(Signal)│ │(Action)│ │(Policy)│ │ (Semantic) │  │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   SUPPORT SERVICES                            │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐  │  │
│  │  │ loader │ │ store  │ │ iq-hub │ │workflow│ │normalizer  │  │  │
│  │  │ (ETL)  │ │  (R2)  │ │ (Chat) │ │ (Flow) │ │ (Validate) │  │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                 INTEGRATION SERVICES                          │  │
│  │  ┌─────────┐ ┌─────────┐ ┌────────────────┐ ┌──────────────┐ │  │
│  │  │ agents  │ │webhooks │ │ mcp-connector  │ │ mcp-tool-srv │ │  │
│  │  │  (AI)   │ │(Inbound)│ │ (Claude Tools) │ │ (MCP Server) │ │  │
│  │  └─────────┘ └─────────┘ └────────────────┘ └──────────────┘ │  │
│  │                                                               │  │
│  │  ┌─────────┐                                                  │  │
│  │  │ billing │                                                  │  │
│  │  │(Stripe) │                                                  │  │
│  │  └─────────┘                                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Deployment Strategy

### Option 1: Single Command Deploy (Recommended)

```bash
# From repository root
./scripts/deploy.sh production all
```

This will:
1. Deploy all 19 Cloudflare Workers
2. Build and deploy the Next.js app to Cloudflare Pages

### Option 2: Turborepo Orchestrated Deploy

```bash
# Build all in dependency order
pnpm build

# Deploy all services
pnpm deploy
```

### Option 3: Selective Deployment

```bash
# Deploy only workers (backend)
./scripts/deploy.sh production workers

# Deploy only UI
./scripts/deploy.sh production ui

# Deploy specific service
./scripts/deploy.sh production spine
```

---

## 🗂️ Service Catalog

### Backend Services (19 Cloudflare Workers)

| Service | URL | Database | Purpose |
|---------|-----|----------|---------|
| act | `integratewise-act.connect-a1b.workers.dev` | D1 | Action execution with governance |
| admin | `integratewise-admin.connect-a1b.workers.dev` | - | Health aggregator |
| agents | `integratewise-agents.connect-a1b.workers.dev` | D1 | AI agent workflows |
| billing | `integratewise-billing.connect-a1b.workers.dev` | D1 | Stripe subscriptions |
| gateway | `integratewise-gateway.connect-a1b.workers.dev` | Neon | Source connectors |
| govern | `integratewise-govern.connect-a1b.workers.dev` | Neon | Policy engine |
| hub-controller-api | `hub-controller-api.connect-a1b.workers.dev` | D1 | Entity CRUD |
| iq-hub | `integratewise-iq-hub.connect-a1b.workers.dev` | D1 | AI conversations |
| knowledge | `integratewise-knowledge.connect-a1b.workers.dev` | Neon | Semantic search |
| loader | `integratewise-loader.connect-a1b.workers.dev` | R2 | ETL pipeline |
| mcp-connector | `integratewise-mcp-connector.connect-a1b.workers.dev` | Neon | MCP gateway |
| mcp-tool-server | `integratewise-mcp-tool-server.connect-a1b.workers.dev` | D1 | MCP server |
| normalizer | `integratewise-normalizer.connect-a1b.workers.dev` | D1 | Schema validation |
| spine | `integratewise-spine.connect-a1b.workers.dev` | D1/Neon | SSOT hub |
| store | `integratewise-store.connect-a1b.workers.dev` | D1+R2 | File storage |
| tenants | `integratewise-tenants.connect-a1b.workers.dev` | D1 | Tenant resolution |
| think | `integratewise-think.connect-a1b.workers.dev` | D1 | Signal engine |
| webhooks | `integratewise-webhooks.connect-a1b.workers.dev` | Neon | Webhook ingestion |
| workflow | `integratewise-workflow.connect-a1b.workers.dev` | D1 | Approval workflows |

### Frontend (Next.js)

| Component | URL | Platform |
|-----------|-----|----------|
| IntegrateWise OS | `integratewise.ai` | Vercel |
| (Alternative) | `integratewise-os.pages.dev` | Cloudflare Pages |

---

## 🔧 CI/CD Pipeline

### Bitbucket Pipelines (bitbucket-pipelines.yml)

```yaml
# Triggers:
# - PR to main → Build + Test
# - Merge to main → Deploy to Production
# - Manual → Deploy to Staging

pipelines:
  branches:
    main:
      - step: Deploy to Production
          script:
            - pnpm build
            - ./scripts/deploy.sh production all
            
  custom:
    deploy-staging:
      - step: Deploy to Staging
          trigger: manual
          script:
            - ./scripts/deploy.sh staging all
```

### Turbo Configuration (turbo.json)

```json
{
  "tasks": {
    "deploy": {
      "dependsOn": ["^build", "build", "test"],
      "outputs": [".wrangler/**"]
    }
  }
}
```

This ensures:
1. All dependencies build first (`^build`)
2. The service itself builds (`build`)
3. Tests pass (`test`)
4. Then deploy

---

## 🔐 Secrets Management

### Per-Service Secrets

```bash
# Set DATABASE_URL for Neon-based services
cd services/govern
npx wrangler secret put DATABASE_URL

# Set STRIPE_SECRET_KEY for billing
cd services/billing
npx wrangler secret put STRIPE_SECRET_KEY
```

### Required Secrets by Service

| Service | Secrets Required |
|---------|------------------|
| billing | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| gateway | `DATABASE_URL` (Neon) |
| govern | `DATABASE_URL` (Neon), `SIGNATURE_KEY` |
| knowledge | `DATABASE_URL` (Neon), `OPENAI_API_KEY` |
| mcp-connector | `DATABASE_URL` (Neon) |
| webhooks | `DATABASE_URL` (Neon) |
| spine | `DATABASE_URL` (Neon) |

### Bulk Secret Setup

```bash
# Use the setup script
./scripts/setup-secrets.sh production
```

---

## 🚀 Deployment Workflow

### 1. Development → dev branch

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, test locally
pnpm dev:all  # Runs Next.js + all services

# Commit and push
git add .
git commit -m "feat: my feature"
git push origin feature/my-feature
```

### 2. Staging Deployment

```bash
# Merge to dev
git checkout dev
git merge feature/my-feature
git push origin dev

# Deploy to staging (manual trigger)
./scripts/deploy.sh staging all
```

### 3. Production Deployment

```bash
# Create PR from dev → main
# After review, merge

# Production deploy happens automatically via CI
# OR manual:
./scripts/deploy.sh production all
```

---

## 📊 Deployment Verification

### Health Checks

```bash
# Check all services
for s in act admin agents billing gateway govern iq-hub knowledge loader mcp-tool-server normalizer store tenants think webhooks workflow hub-controller-api mcp-connector; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "https://integratewise-$s.connect-a1b.workers.dev/health")
  echo "$s: $status"
done
```

### Service Matrix

```bash
# Get service status matrix
curl https://integratewise-admin.connect-a1b.workers.dev/services
```

---

## 🔄 Rollback Procedure

### Cloudflare Workers

```bash
# List deployments
npx wrangler deployments list --name integratewise-spine

# Rollback to previous version
npx wrangler rollback --name integratewise-spine
```

### Next.js (Vercel)

```bash
# Via Vercel CLI
vercel rollback

# Or via Dashboard
# https://vercel.com/integratewise/deployments
```

---

## 🌐 Environment Configuration

### Production URLs

```
Frontend:        https://integratewise.ai
API Gateway:     https://integratewise-gateway.connect-a1b.workers.dev
Admin:           https://integratewise-admin.connect-a1b.workers.dev
```

### Staging URLs

```
Frontend:        https://staging.integratewise.ai
API Gateway:     https://integratewise-gateway-staging.connect-a1b.workers.dev
```

### Environment Variables (Next.js)

```env
# .env.production
NEXT_PUBLIC_API_GATEWAY=https://integratewise-gateway.connect-a1b.workers.dev
NEXT_PUBLIC_SPINE_URL=https://integratewise-spine.connect-a1b.workers.dev
NEXT_PUBLIC_IQ_HUB_URL=https://integratewise-iq-hub.connect-a1b.workers.dev
NEXT_PUBLIC_KNOWLEDGE_URL=https://integratewise-knowledge.connect-a1b.workers.dev
```

---

## 🛠️ Local Development

### Run Everything Locally

```bash
# Install dependencies
pnpm install

# Start all services (using wrangler dev)
pnpm dev:all

# This runs:
# - Next.js on http://localhost:3000
# - All workers on ports 8001-8019
```

### Service Ports (Local)

| Service | Port |
|---------|------|
| loader | 8001 |
| normalizer | 8002 |
| store | 8003 |
| spine | 8004 |
| think | 8005 |
| act | 8006 |
| govern | 8007 |
| gateway | 8008 |
| knowledge | 8009 |
| iq-hub | 8010 |

---

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] All tests pass (`pnpm test`)
- [ ] No TypeScript errors (`pnpm typecheck`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Environment variables set
- [ ] Secrets configured in Cloudflare

### Post-Deployment

- [ ] All services return 200 on `/health`
- [ ] Admin dashboard shows all services green
- [ ] Smoke test core flows
- [ ] Check error tracking (if configured)

---

## 📄 Quick Reference

### Deploy Commands

```bash
# Full production deploy
./scripts/deploy.sh production all

# Deploy single service
cd services/spine && npx wrangler deploy

# Deploy UI only
cd . && pnpm cf:deploy
```

### Debug Commands

```bash
# View logs
npx wrangler tail integratewise-spine

# Check secret status
npx wrangler secret list --name integratewise-spine

# View deployment history
npx wrangler deployments list --name integratewise-spine
```

---

## 🎯 Summary

IntegrateWise OS uses a **distributed microservices architecture**:

1. **Package**: Turborepo monorepo with pnpm workspaces
2. **Build**: `pnpm build` builds everything in dependency order
3. **Deploy**: `./scripts/deploy.sh production all` deploys everything
4. **Verify**: Health checks on all 19 services + frontend

The system is designed for **independent service deployment** while maintaining **coordinated releases** when needed.
