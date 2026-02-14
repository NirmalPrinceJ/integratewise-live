# IntegrateWise - Cloudflare Deployment Status & Roadmap

**Last Updated**: 2026-02-14
**Cloudflare Account**: a1bbbb12a32cdbb68dd170b09fe8b5f3
**Documentation**: Technical specification evaluation + codebase analysis

## Executive Summary

IntegrateWise Universal Cognitive Operating System has a **strong foundation** deployed on Cloudflare infrastructure with:
- ✅ All 4 domains active and configured
- ✅ Core L3 services deployed (Gateway, Normalizer, Spine)
- ✅ Data stores operational (D1, R2, KV)
- ⚠️ **Critical Gap**: 8-stage pipeline needs decomposition into discrete queue consumers
- ⚠️ **Missing**: AI Agent system (AGT-001 to AGT-007)
- ⚠️ **Missing**: Vector search layer (pgvector or Vectorize)
- ⚠️ **Missing**: HITL governance hard gate
- ⚠️ **Missing**: Audit Store (immutable event log)

---

## 1. Domain & Network Layer ✅ COMPLETE

### Active Domains
All domains managed under Cloudflare account `a1bbbb12a32cdbb68dd170b09fe8b5f3`:

| Domain | Purpose | Key Services | Status |
|--------|---------|--------------|--------|
| `integratewise.ai` | Primary AI services, API Gateway | `api.integratewise.ai` | ✅ Active |
| `integratewise.online` | Spine, specialized hubs | `spine.integratewise.online`, `n8n.integratewise.online` | ✅ Active |
| `integratewise.co` | Corporate/Marketing site | Marketing landing pages | ✅ Active |
| `nirmalprince.com` | Personal brand/development | Dev environments | ✅ Active |

**Dashboard**: [Cloudflare Domains](https://dash.cloudflare.com/a1bbbb12a32cdbb68dd170b09fe8b5f3/home/domains)

### Network Architecture
```
External Requests
    ↓
[Cloudflare CDN/WAF]
    ↓
┌─────────────────────────────────────────┐
│ api.integratewise.ai (Gateway)          │ ← Plane 1 (Webhooks)
├─────────────────────────────────────────┤
│ spine.integratewise.online (SSOT)       │ ← L3 Truth Service
├─────────────────────────────────────────┤
│ n8n.integratewise.online (Orchestration)│ ← Workflow Engine
└─────────────────────────────────────────┘
```

---

## 2. Compute Layer (Cloudflare Workers)

### Currently Deployed Workers
**Dashboard**: [Workers & Pages](https://dash.cloudflare.com/a1bbbb12a32cdbb68dd170b09fe8b5f3/workers-and-pages)

#### L3 Backend Services (Core Infrastructure)

| Worker Name | Purpose | Status | Proposed Architecture Mapping |
|-------------|---------|--------|-------------------------------|
| `integratewise-gateway` | Entry point for Plane 1 (Webhooks) | ✅ Deployed | **Stage 1: Analyzer** (partial) |
| `integratewise-normalizer` | Field-level transformations | ✅ Deployed | **Stages 2-5** (combined - needs decomposition) |
| `integratewise-spine` | Core Truth service (legacy) | ✅ Deployed | L3 Spine SSOT |
| `integratewise-spine-v2` | Enhanced Spine service | ✅ Deployed | L3 Spine SSOT (current) |
| `integratewise-mcp-tool-server` | Plane 3 (AI Chats) ingestion | ✅ Deployed | MCP Protocol Handler |
| `integratewise-iq-hub` | Think Engine precursor | ✅ Deployed | L2 **Think** component (partial) |

#### Missing L3 Pipeline Stages ⚠️

The **8-Stage Mandatory Pipeline** requires individual queue consumers:

| Stage | Worker Name (Proposed) | Function | Status | Priority |
|-------|------------------------|----------|--------|----------|
| 1. Analyzer | `integratewise-stage-analyzer` | Entity detection, field identification | ⚠️ **Embedded in gateway** | P0 |
| 2. Classifier | `integratewise-stage-classifier` | Route to Spine sector | ❌ Missing | P0 |
| 3. Filter | `integratewise-stage-filter` | Deduplication (fingerprinting) | ⚠️ **Partial - loader service exists** | P0 |
| 4. Refiner | `integratewise-stage-refiner` | Data quality enhancement | ❌ Missing | P1 |
| 5. Extractor | `integratewise-stage-extractor` | Business logic transformation | ⚠️ **Embedded in normalizer** | P0 |
| 6. Validator | `integratewise-stage-validator` | Schema validation, constraints | ❌ Missing | P0 |
| 7. Sanity Scan | `integratewise-stage-sanity-scan` | Anomaly detection, risk scoring | ❌ Missing | P1 |
| 8. Sectorizer | `integratewise-stage-sectorizer` | Write to Spine sectors | ⚠️ **Embedded in spine-v2** | P0 |

**Critical Architectural Issue**:
Current workers (`gateway`, `normalizer`, `spine-v2`) **combine multiple stages**, preventing:
- Granular failure isolation
- Individual stage DLQ routing
- Stage-specific observability
- Independent scaling per stage

#### Missing AI Agent System ❌

Proposed **7 AI Agents** (AGT-001 to AGT-007) not yet deployed:

| Agent ID | Name | Function | Proposed Worker Name | Status |
|----------|------|----------|----------------------|--------|
| AGT-001 | SuccessPilot | Customer success analysis | `integratewise-agent-successpilot` | ❌ Missing |
| AGT-002 | ChurnShield | Churn prediction & prevention | `integratewise-agent-churnshield` | ❌ Missing |
| AGT-003 | PipelineIQ | Sales pipeline intelligence | `integratewise-agent-pipelineiq` | ❌ Missing |
| AGT-004 | ContentGen | Marketing content generation | `integratewise-agent-contentgen` | ❌ Missing |
| AGT-005 | DataEnrich | Data enrichment & validation | `integratewise-agent-dataenrich` | ❌ Missing |
| AGT-006 | RiskRadar | Risk assessment & mitigation | `integratewise-agent-riskradar` | ❌ Missing |
| AGT-007 | InsightBot | Cross-domain insights | `integratewise-agent-insightbot` | ❌ Missing |

---

## 3. Storage & Database Layer

### Current Data Stores
**Dashboard Links**:
- [D1 Databases](https://dash.cloudflare.com/a1bbbb12a32cdbb68dd170b09fe8b5f3/workers/d1)
- [R2 Buckets](https://dash.cloudflare.com/a1bbbb12a32cdbb68dd170b09fe8b5f3/r2/overview)
- [Workers KV](https://dash.cloudflare.com/a1bbbb12a32cdbb68dd170b09fe8b5f3/workers/kv/namespaces)

### Six-Store Architecture Status

| Store | Proposed Technology | Current Implementation | Status |
|-------|---------------------|------------------------|--------|
| **1. Spine (SSOT)** | Neon PostgreSQL with pgvector | **Cloudflare D1** (`integratewise-spine-prod`, `integratewise-spine-staging`) | ⚠️ **Tech mismatch** |
| **2. Context Store** | Neon PostgreSQL with pgvector | **R2** (`integratewise-files-prod`) + undefined semantic search | ⚠️ **Partial** |
| **3. AI Chats Store** | Neon PostgreSQL | **Not visible** | ❌ Missing |
| **4. Audit Store** | Append-only PostgreSQL | **Not visible** | ❌ Missing |
| **5. Hot Memory** | Durable Objects + Redis | **Durable Objects** (architecturally defined, minimal state) | ⚠️ **Defined but underutilized** |
| **6. DLQ** | Cloudflare Queues + D1 | **Not visible** | ❌ Missing |

### D1 Databases (Current State)

| Database Name | Environment | Purpose | Tables | Status |
|---------------|-------------|---------|--------|--------|
| `integratewise-spine-prod` | Production | SSOT for normalized entities | Unknown schema | ✅ Active |
| `integratewise-spine-staging` | Staging | SSOT testing | Unknown schema | ✅ Active |
| `hub-controller-db` | Production | Webhook tracking | `webhook_events`, `webhook_providers`, `webhook_subscriptions` | ✅ Active |
| `memory-consolidator-db` | Production | Hot memory consolidation | `consolidated_memories`, `consolidation_runs`, `memory_links` | ✅ Active |
| `loader-db` | Production | Fingerprint deduplication | `processed_fingerprints` | ✅ Active |

**Critical Decision Point**:
- **Option A**: Migrate Spine SSOT to **Neon PostgreSQL** (as per spec) for:
  - Better JSONB performance
  - Native pgvector support
  - Larger database limits
  - Better analytics capabilities
- **Option B**: Enhance D1 schema to support "Growth-Aligned Schema" (goal-linked metrics)
  - Keep edge-first architecture
  - Use Cloudflare Vectorize for semantic search
  - Accept D1 limitations (500MB per DB, eventual consistency)

### R2 Buckets

| Bucket Name | Purpose | Status |
|-------------|---------|--------|
| `integratewise-files-prod` | Unstructured document storage (Plane 2) | ✅ Active |

**Missing**: Vector index for semantic search over R2 documents (requires Vectorize or external pgvector).

### Workers KV Namespaces

| Namespace | Purpose | Status |
|-----------|---------|--------|
| `SECRETS_PROD` | Environment secrets, API keys | ✅ Active |
| `RATE_LIMITS_SPINE` | Rate limiting state | ✅ Active |
| `SESSIONS_PROD` | User session data | ✅ Active |

---

## 4. L2 Cognitive Layer (Think → Act → Knowledge)

### Current State

| Component | Proposed Name | Current Implementation | Status |
|-----------|---------------|------------------------|--------|
| **Think** | Think Engine (HITL Decision) | `integratewise-iq-hub` (precursor) | ⚠️ **Partial** |
| **Act** | Act Engine (Execution) | **Not visible as distinct service** | ❌ Missing |
| **Knowledge** | Knowledge Engine (Context) | `memory-consolidator` (partial) | ⚠️ **Partial** |
| **Govern** | Policy enforcement, approval gates | **Not visible** | ❌ Missing |
| **Adjust** | Feedback loop, model tuning | **Not visible** | ❌ Missing |
| **Repeat** | Pattern recognition, automation | **Not visible** | ❌ Missing |

### HITL (Human-in-the-Loop) Governance ❌

**Critical Missing Component**:
The proposed "Approval-Only Execution" model requires a **Hard Gate** before any action execution:

```
Think Engine Decision
    ↓
[HITL Hard Gate] ← NOT YET IMPLEMENTED
    ↓ (approval)
Act Engine Execution
```

**Required Implementation**:
1. **Worker**: `integratewise-hitl-gate`
2. **KV Store**: `PENDING_APPROVALS`
3. **UI Component**: Approval dashboard in hub
4. **Policy Engine**: Rule-based auto-approval for low-risk actions

---

## 5. Data Ingestion Planes

### Plane 1: Structured Data (Webhooks) ✅

**Entry Point**: `integratewise-gateway` worker

**Active Webhook Providers** (from `hub-controller-db.webhook_providers`):

| Category | Providers | Endpoint Pattern | Status |
|----------|-----------|------------------|--------|
| **CRM** | HubSpot, Salesforce | `/webhooks/hubspot`, `/webhooks/salesforce` | ✅ Active |
| **Sales** | Pipedrive | `/webhooks/pipedrive` | ✅ Active |
| **Marketing** | LinkedIn, Canva, Google Ads, Meta | `/webhooks/linkedin`, `/webhooks/canva`, etc. | ✅ Active |
| **Communication** | WhatsApp | `/webhooks/whatsapp` | ✅ Active |
| **Payments** | Razorpay, Stripe | `/webhooks/razorpay`, `/webhooks/stripe` | ✅ Active |
| **Dev** | GitHub, Vercel | `/webhooks/github`, `/webhooks/vercel` | ✅ Active |
| **Productivity** | Todoist, Notion, Coda, Slack, Linear | Various endpoints | ✅ Active |
| **E-commerce** | Shopify | `/webhooks/shopify` | ✅ Active |
| **Internal** | AI Relay | `/webhooks/ai-relay` | ✅ Active |

**Total**: 18 providers configured (spec mentions 15, additional 3 found: Coda, Slack, Linear, Shopify)

### Plane 2: Unstructured Data (Documents) ⚠️

**Storage**: R2 bucket `integratewise-files-prod`
**Processing**: Unknown (likely embedded in normalizer)
**Missing**:
- Document parser workers
- Vector embedding generation
- Semantic search index (Vectorize or pgvector)

### Plane 3: AI Chats (MCP Protocol) ⚠️

**Entry Point**: `integratewise-mcp-tool-server` worker
**Storage**: Not visible (should be in AI Chats Store)
**Missing**:
- MCP session management
- Conversation context store
- Tool execution history

---

## 6. Durable Objects (Real-Time State) ⚠️

**Status**: Architecturally defined but minimal active state

**Proposed Use Cases** (from spec):
1. **Collaborative Editing**: Multi-user real-time document collaboration
2. **Live Dashboards**: Real-time metric updates
3. **Session State**: User interaction state across requests

**Current State**:
- Durable Objects enabled in account
- Minimal active objects visible
- `SESSIONS_PROD` KV used instead for session state

**Recommendation**: Deploy DO-based services for:
- `integratewise-collab-session` (DO class for collaborative editing)
- `integratewise-live-metrics` (DO class for dashboard real-time updates)

---

## 7. Security & Observability

### Secrets Management ✅
- **Workers KV**: `SECRETS_PROD` namespace active
- **Wrangler Secrets**: Per-worker secret bindings configured

### Rate Limiting ✅
- **Workers KV**: `RATE_LIMITS_SPINE` namespace active
- Location: Edge-level rate limiting

### Observability Gaps ❌

**Missing**:
1. **Audit Store**: Immutable append-only log for all state changes
2. **Observability Stack**: Logs, metrics, traces aggregation
3. **DLQ Monitoring**: Dead-letter queue visibility
4. **Cost Tracking**: Per-tenant usage attribution

---

## 8. Infrastructure Gaps Summary

### Priority 0 (Critical - Blocks Production)

| Gap | Impact | Required Action |
|-----|--------|-----------------|
| **8-Stage Pipeline Decomposition** | No granular failure isolation, debugging nightmare | Break down `gateway`, `normalizer`, `spine-v2` into 8 discrete queue consumers |
| **DLQ System** | Failed messages lost, no retry mechanism | Implement Cloudflare Queue + D1 for poison messages |
| **Audit Store** | No compliance trail, debugging impossible | Create append-only D1/Neon table for all state changes |
| **Vector Search** | No semantic search over documents/context | Enable Cloudflare Vectorize or deploy pgvector on Neon |

### Priority 1 (High - Limits Functionality)

| Gap | Impact | Required Action |
|-----|--------|-----------------|
| **HITL Hard Gate** | Auto-execution risk, no approval workflow | Deploy `integratewise-hitl-gate` worker + approval UI |
| **AI Chats Store** | MCP conversations not persisted | Create dedicated D1/Neon database for chat sessions |
| **Act Engine** | No distinct execution layer | Deploy `integratewise-act-engine` worker |
| **Knowledge Engine** | Context retrieval inefficient | Enhance `memory-consolidator` with pgvector |

### Priority 2 (Medium - Enhances Operations)

| Gap | Impact | Required Action |
|-----|--------|-----------------|
| **AI Agent System** | No specialized agents (AGT-001 to 007) | Deploy 7 agent workers with Claude integration |
| **Govern/Adjust/Repeat** | No adaptive learning loop | Implement L2 feedback components |
| **Durable Objects Utilization** | No real-time collaboration | Deploy DO-based collaborative editing |
| **Observability Stack** | Limited debugging, no cost tracking | Integrate logs/metrics/traces aggregation |

---

## 9. Database Migration Decision

### Option A: Migrate to Neon PostgreSQL (Recommended for Production)

**Pros**:
- ✅ Matches technical specification
- ✅ Better JSONB performance (complex queries, aggregations)
- ✅ Native pgvector support (semantic search)
- ✅ Larger database limits (hundreds of GB vs 500MB D1)
- ✅ Better analytics capabilities (pg_stat_statements, EXPLAIN ANALYZE)
- ✅ PostgreSQL ecosystem (extensions, tools, ORMs)

**Cons**:
- ❌ Additional infrastructure dependency (not pure Cloudflare)
- ❌ Network latency (Workers → Neon vs Workers → D1 edge)
- ❌ Cost (Neon paid plans vs free D1)

**Migration Path**:
1. Create Neon project: `integratewise-prod`
2. Deploy schema from `docs/DATABASE_SCHEMA.md` Priority 1 section
3. Enable pgvector extension
4. Dual-write period (D1 + Neon) for 30 days
5. Switch read traffic to Neon
6. Deprecate D1 Spine databases

### Option B: Enhance D1 (Edge-First Approach)

**Pros**:
- ✅ Pure Cloudflare stack (simpler operations)
- ✅ Edge-native (lower latency from Workers)
- ✅ Cost-effective (free tier generous)

**Cons**:
- ❌ 500MB per database limit (requires sharding)
- ❌ SQLite limitations (no stored procedures, limited window functions)
- ❌ Eventual consistency (multi-region deployments)
- ❌ No native vector search (requires Vectorize integration)

**Enhancement Path**:
1. Document current D1 spine schema (currently unknown)
2. Add "Growth-Aligned Schema" tables (goal_metrics, pipeline_stages, etc.)
3. Integrate Cloudflare Vectorize for semantic search
4. Implement sharding strategy for scale

**Recommendation**: **Option A (Neon PostgreSQL)** for production SSOT, retain D1 for:
- Edge caching (read replicas)
- Webhook event tracking (high-write, low-retention)
- Session state (ephemeral data)

---

## 10. Next Steps (Prioritized Roadmap)

### Phase 1: Critical Infrastructure (Weeks 1-4)

**Week 1-2: Pipeline Decomposition**
1. ✅ Review current `gateway`, `normalizer`, `spine-v2` code
2. Create 8 Cloudflare Queues:
   ```
   analyzer-queue, classifier-queue, filter-queue, refiner-queue,
   extractor-queue, validator-queue, sanity-queue, sectorizer-queue
   ```
3. Deploy 8 discrete Worker consumers (one per stage)
4. Implement DLQ routing (poison messages → `dlq-queue`)
5. Deploy DLQ monitoring worker + D1 storage

**Week 3: Audit Store**
1. Create D1 database: `audit-store-prod`
2. Schema:
   ```sql
   CREATE TABLE audit_events (
     id TEXT PRIMARY KEY,
     tenant_id TEXT NOT NULL,
     event_type TEXT NOT NULL,
     actor_id TEXT,
     entity_type TEXT,
     entity_id TEXT,
     before_state TEXT,
     after_state TEXT,
     metadata TEXT,
     created_at TEXT NOT NULL
   );
   ```
3. Deploy `integratewise-audit-logger` worker (queue consumer)
4. Integrate into all Workers (middleware: log all writes)

**Week 4: Vector Search**
1. **Option A**: Enable Cloudflare Vectorize (beta)
   - Create index: `context-embeddings`
   - Integrate with `memory-consolidator`
2. **Option B**: Deploy Neon PostgreSQL
   - Create project: `integratewise-prod`
   - Enable pgvector extension
   - Deploy schema from `DATABASE_SCHEMA.md`
   - Deploy embedding generation worker

### Phase 2: Cognitive Layer (Weeks 5-8)

**Week 5-6: HITL Hard Gate**
1. Deploy `integratewise-hitl-gate` worker
2. Create KV namespace: `PENDING_APPROVALS`
3. Implement policy engine (auto-approve rules)
4. Build approval dashboard UI (Next.js in hub)
5. Integrate with `integratewise-iq-hub` (Think Engine)

**Week 7: Act Engine**
1. Deploy `integratewise-act-engine` worker
2. Implement execution safety (rollback, confirmation)
3. Integrate with external APIs (HubSpot, Salesforce, etc.)
4. Add execution audit logging

**Week 8: AI Chats Store**
1. Create D1/Neon database: `ai-chats-store`
2. Schema:
   ```sql
   CREATE TABLE chat_sessions (
     id TEXT PRIMARY KEY,
     tenant_id TEXT NOT NULL,
     user_id TEXT,
     conversation JSONB NOT NULL,
     tool_calls JSONB,
     started_at TIMESTAMPTZ,
     ended_at TIMESTAMPTZ
   );
   ```
3. Integrate with `integratewise-mcp-tool-server`

### Phase 3: AI Agent System (Weeks 9-12)

Deploy 7 specialized AI agents (2 agents per week):

**Week 9-10**:
- `integratewise-agent-successpilot` (AGT-001)
- `integratewise-agent-churnshield` (AGT-002)
- `integratewise-agent-pipelineiq` (AGT-003)

**Week 11-12**:
- `integratewise-agent-contentgen` (AGT-004)
- `integratewise-agent-dataenrich` (AGT-005)
- `integratewise-agent-riskradar` (AGT-006)
- `integratewise-agent-insightbot` (AGT-007)

**Agent Template**:
```typescript
// integratewise-agent-{name}/src/index.ts
import { Hono } from 'hono';
import Anthropic from '@anthropic-ai/sdk';

const app = new Hono();

app.post('/analyze', async (c) => {
  const { context, goal } = await c.req.json();

  const anthropic = new Anthropic({ apiKey: c.env.ANTHROPIC_API_KEY });
  const result = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: `You are ${AGENT_NAME} specialized in ${AGENT_PURPOSE}...`,
    messages: [{ role: 'user', content: context }]
  });

  return c.json({ analysis: result.content });
});

export default app;
```

### Phase 4: Adaptive Learning (Weeks 13-16)

**Week 13-14: Govern Component**
1. Deploy `integratewise-govern-engine` worker
2. Implement policy DSL (rules engine)
3. Integrate with HITL gate for automated approvals
4. Build policy management UI

**Week 15: Adjust Component**
1. Deploy `integratewise-adjust-engine` worker
2. Implement feedback loop (user corrections → model tuning)
3. Store feedback in `context-store`

**Week 16: Repeat Component**
1. Deploy `integratewise-repeat-engine` worker
2. Implement pattern recognition (recurring workflows)
3. Auto-suggest automations based on patterns

---

## 11. Cost Estimation (Cloudflare)

### Current Estimated Monthly Cost

| Service | Usage | Cost |
|---------|-------|------|
| **Workers** (10 deployed) | ~10M requests/mo | $5/mo (paid plan + overage) |
| **D1** (5 databases) | ~5GB storage, 50M reads/writes | Free tier |
| **R2** (1 bucket) | ~100GB storage, 10M operations | ~$1.50/mo |
| **KV** (3 namespaces) | ~10M reads/writes | Free tier |
| **Queues** (0 currently) | - | $0 |
| **Durable Objects** | Minimal state | Free tier |
| **Domain Registration** (4 domains) | Annual renewal | ~$40/year |
| **Total** | | **~$6.50/mo + $40/year** |

### Projected Cost After Full Implementation

| Service | Projected Usage | Cost |
|---------|-----------------|------|
| **Workers** (25+ deployed) | ~100M requests/mo | $25/mo |
| **D1** (10 databases) | ~20GB storage, 500M reads/writes | $10/mo |
| **R2** (2 buckets) | ~500GB storage, 50M operations | ~$7.50/mo |
| **KV** (5 namespaces) | ~50M reads/writes | $5/mo |
| **Queues** (10 queues) | ~50M messages/mo | $2.50/mo |
| **Durable Objects** (active state) | ~1M requests/mo | $5/mo |
| **Vectorize** (if used) | ~1M queries/mo | $5/mo |
| **Total** | | **~$60/mo + $40/year** |

**External Dependencies** (if Neon PostgreSQL chosen):
- Neon Pro Plan: ~$20/mo (100GB storage, high availability)
- **Grand Total**: ~$80/mo

---

## 12. Deployment Commands

### Current Deployment (Per-Service)

Each service has `wrangler.toml` configuration:

```bash
# Gateway
cd services/gateway
wrangler deploy

# Normalizer
cd services/normalizer
wrangler deploy

# Spine v2
cd services/spine-v2
wrangler deploy

# MCP Tool Server
cd services/mcp-tool-server
wrangler deploy
```

### Proposed Monorepo Deployment

Create root-level deployment script:

```bash
#!/bin/bash
# deploy-all.sh

echo "Deploying IntegrateWise Infrastructure..."

# L3 Pipeline Stages (new)
wrangler deploy --config services/stage-analyzer/wrangler.toml
wrangler deploy --config services/stage-classifier/wrangler.toml
wrangler deploy --config services/stage-filter/wrangler.toml
wrangler deploy --config services/stage-refiner/wrangler.toml
wrangler deploy --config services/stage-extractor/wrangler.toml
wrangler deploy --config services/stage-validator/wrangler.toml
wrangler deploy --config services/stage-sanity-scan/wrangler.toml
wrangler deploy --config services/stage-sectorizer/wrangler.toml

# L2 Cognitive Layer
wrangler deploy --config services/think/wrangler.toml
wrangler deploy --config services/act/wrangler.toml
wrangler deploy --config services/knowledge/wrangler.toml
wrangler deploy --config services/govern/wrangler.toml
wrangler deploy --config services/adjust/wrangler.toml
wrangler deploy --config services/repeat/wrangler.toml

# AI Agents (AGT-001 to 007)
wrangler deploy --config services/agents/successpilot/wrangler.toml
wrangler deploy --config services/agents/churnshield/wrangler.toml
wrangler deploy --config services/agents/pipelineiq/wrangler.toml
wrangler deploy --config services/agents/contentgen/wrangler.toml
wrangler deploy --config services/agents/dataenrich/wrangler.toml
wrangler deploy --config services/agents/riskradar/wrangler.toml
wrangler deploy --config services/agents/insightbot/wrangler.toml

# Support Services
wrangler deploy --config services/hitl-gate/wrangler.toml
wrangler deploy --config services/audit-logger/wrangler.toml
wrangler deploy --config services/dlq-monitor/wrangler.toml

echo "✅ All services deployed"
```

---

## 13. Monitoring & Alerts

### Required Dashboards

1. **Pipeline Health Dashboard**
   - Queues: Message count, processing time, DLQ rate per stage
   - Workers: Request count, error rate, CPU time per stage
   - D1: Read/write operations, storage utilization

2. **Cognitive Layer Dashboard**
   - Think Engine: Decision count, HITL approval rate
   - Act Engine: Execution count, success rate, rollback count
   - AI Agents: Token usage, API cost, response quality

3. **Data Flow Dashboard**
   - Plane 1 (Webhooks): Events/hour per provider
   - Plane 2 (Documents): Upload count, processing time
   - Plane 3 (AI Chats): Sessions/hour, token usage

### Alert Rules

```yaml
alerts:
  - name: "DLQ Threshold Exceeded"
    condition: "dlq_message_count > 100"
    action: "Notify #engineering-alerts"

  - name: "Pipeline Stage Blocked"
    condition: "queue_age_seconds > 300"
    action: "Page on-call"

  - name: "HITL Approval Backlog"
    condition: "pending_approvals > 50"
    action: "Notify #product-team"

  - name: "Spine Write Failure"
    condition: "spine_write_error_rate > 1%"
    action: "Page on-call"
```

---

## 14. Success Metrics

### Infrastructure KPIs

| Metric | Current | Target (6 months) |
|--------|---------|-------------------|
| **Pipeline End-to-End Latency** | Unknown (combined stages) | <5s (p95) |
| **DLQ Rate** | 0% (no DLQ) | <0.1% |
| **Audit Coverage** | 0% (no audit store) | 100% (all writes logged) |
| **HITL Approval Time** | N/A (no HITL) | <2 hours (p50) |
| **Vector Search Recall** | N/A (no vector search) | >90% @k=10 |
| **AI Agent Accuracy** | N/A (no agents) | >85% user satisfaction |

### Business KPIs (Enabled by Infrastructure)

| Metric | Description | Target |
|--------|-------------|--------|
| **Customer Churn Prediction** | AGT-002 (ChurnShield) accuracy | >80% precision @30 days |
| **Sales Pipeline Velocity** | AGT-003 (PipelineIQ) optimization | +20% deal velocity |
| **Content Automation** | AGT-004 (ContentGen) adoption | 50% of marketing content |
| **Data Quality Score** | AGT-005 (DataEnrich) impact | >95% clean data |

---

## Appendix A: Cloudflare Account Structure

```
Cloudflare Account: a1bbbb12a32cdbb68dd170b09fe8b5f3
│
├── Domains (4)
│   ├── integratewise.ai
│   ├── integratewise.online
│   ├── integratewise.co
│   └── nirmalprince.com
│
├── Workers & Pages (10+ deployed)
│   ├── integratewise-gateway
│   ├── integratewise-normalizer
│   ├── integratewise-spine
│   ├── integratewise-spine-v2
│   ├── integratewise-mcp-tool-server
│   ├── integratewise-iq-hub
│   └── [... others]
│
├── D1 Databases (5)
│   ├── integratewise-spine-prod
│   ├── integratewise-spine-staging
│   ├── hub-controller-db
│   ├── memory-consolidator-db
│   └── loader-db
│
├── R2 Buckets (1)
│   └── integratewise-files-prod
│
├── Workers KV (3 namespaces)
│   ├── SECRETS_PROD
│   ├── RATE_LIMITS_SPINE
│   └── SESSIONS_PROD
│
├── Queues (0 - needs creation)
│   └── [8 queues to be created for pipeline]
│
└── Durable Objects (enabled, minimal state)
    └── [Classes to be deployed for collaboration]
```

---

## Appendix B: Worker Template (8-Stage Pipeline)

```typescript
// services/stage-{name}/src/index.ts
import { Queue } from '@cloudflare/workers-types';

interface Env {
  NEXT_QUEUE: Queue;
  DLQ_QUEUE: Queue;
  SPINE_DB: D1Database;
  AUDIT_QUEUE: Queue;
}

export default {
  async queue(batch: MessageBatch, env: Env): Promise<void> {
    for (const message of batch.messages) {
      try {
        // Stage-specific processing
        const result = await processMessage(message.body);

        // Audit logging
        await env.AUDIT_QUEUE.send({
          stage: 'STAGE_NAME',
          input: message.body,
          output: result,
          timestamp: Date.now()
        });

        // Forward to next stage
        await env.NEXT_QUEUE.send(result);

        // Acknowledge message
        message.ack();
      } catch (error) {
        // Send to DLQ
        await env.DLQ_QUEUE.send({
          originalMessage: message.body,
          stage: 'STAGE_NAME',
          error: error.message,
          timestamp: Date.now()
        });

        // Retry message (up to 3 times)
        if (message.attempts < 3) {
          message.retry();
        } else {
          message.ack(); // Give up after 3 attempts
        }
      }
    }
  }
};

async function processMessage(body: any): Promise<any> {
  // Stage-specific logic here
  // Example for Analyzer stage:
  const entities = detectEntities(body);
  const fields = identifyFields(body);
  return { ...body, entities, fields };
}
```

---

## Appendix C: Database Schema Comparison

### Current D1 Schema (Unknown for spine-prod)

```sql
-- Unknown schema for integratewise-spine-prod
-- Needs documentation via: wrangler d1 execute integratewise-spine-prod --command="SELECT sql FROM sqlite_master WHERE type='table'"
```

### Proposed Neon PostgreSQL Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Priority 1 section for full schema.

**Key Tables**:
1. `spine_entities` - Core SSOT with pgvector embeddings
2. `spine_relationships` - Entity graph
3. `context_store` - Semantic context with pgvector
4. `audit_log` - Immutable event log
5. `ai_chat_sessions` - MCP conversation history

---

## Document Change Log

| Date | Author | Changes |
|------|--------|---------|
| 2026-02-14 | Claude | Initial document creation from Cloudflare account evaluation + codebase analysis |

---

**Next Document to Create**: `IMPLEMENTATION_GUIDE.md` (step-by-step tutorial for Phase 1 Week 1-2 pipeline decomposition)
