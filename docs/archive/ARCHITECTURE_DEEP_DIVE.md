# IntegrateWise OS - Architecture Deep Dive

**File-Level Documentation of All 19 Backend Services**

*Generated: 3 February 2026*

---

## 📊 Service Inventory

| # | Service | Worker Name | Database | Status |
|---|---------|-------------|----------|--------|
| 1 | services/act | `integratewise-act` | D1 | ✅ Deployed |
| 2 | services/admin | `integratewise-admin` | — | ✅ Deployed |
| 3 | services/agents | `integratewise-agents` | D1 + AI | ✅ Deployed |
| 4 | services/billing | `integratewise-billing` | D1 | ✅ Deployed |
| 5 | services/gateway | `integratewise-gateway` | Neon | ✅ Deployed |
| 6 | services/govern | `integratewise-govern` | Neon | ✅ Deployed |
| 7 | services/iq-hub | `integratewise-iq-hub` | D1 | ✅ Deployed |
| 8 | services/knowledge | `integratewise-knowledge` | Neon | ✅ Deployed |
| 9 | services/loader | `integratewise-loader` | D1 + R2 | ✅ Deployed |
| 10 | services/mcp-connector | `integratewise-mcp-tool-server` | D1 | ✅ Deployed |
| 11 | services/normalizer | `integratewise-normalizer` | D1 | ✅ Deployed |
| 12 | services/spine | `integratewise-spine` | D1 | ✅ Deployed |
| 13 | services/store | `integratewise-store` | D1 + R2 | ✅ Deployed |
| 14 | services/tenants | `integratewise-tenants` | D1 | ✅ Deployed |
| 15 | services/think | `integratewise-think` | D1 + Queue | ✅ Deployed |
| 16 | services/workflow | `integratewise-workflow` | D1 + Workflows | ✅ Deployed |
| 17 | packages/webhooks | `integratewise-webhooks` | Neon | ✅ Deployed |
| 18 | packages/api | `hub-controller-api` | D1 + AI | ✅ Deployed |
| 19 | packages/integratewise-mcp-tool-connector | `integratewise-mcp-connector` | D1 | ✅ Deployed |

---

## 🎯 Layer 1: Ingestion Layer

### 1. Gateway Service (`services/gateway`)

**Purpose**: Entry point for all webhooks, normalizes payloads to canonical format.

**URL**: `https://integratewise-gateway.connect-a1b.workers.dev`

```
services/gateway/
├── src/
│   └── index.ts         # 125 lines - Hono API with source mappers
├── wrangler.toml        # Neon database binding
└── package.json
```

**Files Breakdown**:

| File | Lines | Purpose |
|------|-------|---------|
| `src/index.ts` | 125 | Source mappers for Stripe, Salesforce, Zendesk, Calendar |

**Endpoints**:
- `GET /` - Service info
- `GET /health` - Health check
- `POST /webhook/:source` - Normalize incoming webhook

**Source Mappers**:
```typescript
const MAPPERS = {
    stripe: (payload) => {...},    // StripePaymentEventSchema
    salesforce: (payload) => {...}, // SalesforceLeadSchema
    zendesk: (payload) => {...},
    calendar: (payload) => {...}
}
```

---

### 2. Webhooks Service (`packages/webhooks`)

**Purpose**: Multi-provider webhook ingress with signature verification.

**URL**: `https://integratewise-webhooks.connect-a1b.workers.dev`

```
packages/webhooks/
├── src/
│   └── worker.ts        # 439 lines - Raw CF Worker with HMAC verification
├── wrangler.toml        # Neon connection, webhook secrets
└── package.json
```

**Supported Providers (14)**:

| Provider | Signature Method | Header |
|----------|-----------------|--------|
| Stripe | HMAC-SHA256 + timestamp | `stripe-signature` |
| RazorPay | HMAC-SHA256 | `x-razorpay-signature` |
| GitHub | HMAC-SHA256 | `x-hub-signature-256` |
| Vercel | HMAC-SHA1 | `x-vercel-signature` |
| HubSpot | SHA256(secret+body) | `x-hubspot-signature` |
| Canva | HMAC-SHA256 | `x-canva-signature` |
| LinkedIn | Custom | `x-linkedin-signature` |
| Salesforce | Token-based | — |
| Pipedrive | Token-based | `x-pipedrive-signature` |
| Todoist | — | — |
| Notion | — | — |
| Meta | Verify token | — |
| WhatsApp | Verify token | — |
| AI Relay | HMAC-SHA256 | `x-ai-relay-signature` |

**Key Functions**:
```typescript
async function verifyStripe(body, sig, secret)   // Timestamp + HMAC
async function verifyGithub(body, sig, secret)   // sha256= prefix
async function verifyHubSpot(body, sig, secret)  // SHA256(secret+body)
async function persistEvent(event, connectionString) // Neon HTTP API
```

---

### 3. Loader Service (`services/loader`)

**Purpose**: ETL pipeline orchestrator, file uploads, telemetry.

**URL**: `https://integratewise-loader.connect-a1b.workers.dev`

```
services/loader/
├── src/
│   ├── index.ts              # 175 lines - Main Hono app
│   ├── pipeline.ts           # Multi-stage processing
│   ├── pipeline-stages.ts    # Stage definitions
│   ├── handlers/
│   │   ├── telemetry.ts      # Metrics & health handlers
│   │   └── nettools.ts       # Network diagnostics
│   ├── jobs/
│   │   └── ai-session-sync.ts # AI session sync job
│   └── lib/
├── wrangler.toml
└── package.json
```

**Endpoints**:
- `POST /jobs/sync-ai-sessions` - Trigger AI session sync
- `POST /v1/pipeline/process` - Process single entity
- `POST /v1/pipeline/batch` - Batch processing
- `GET /telemetry/metrics` - Prometheus-style metrics
- `GET /telemetry/health` - Detailed health
- `GET /nettools/diagnostics` - Network diagnostics

**Bindings**: D1, R2 (FILES), Queue (THINK_QUEUE)

---

### 4. Normalizer Service (`services/normalizer`)

**Purpose**: Schema validation, normalization, idempotency checking.

**URL**: `https://integratewise-normalizer.connect-a1b.workers.dev`

```
services/normalizer/
├── src/
│   ├── index.ts              # 90 lines - Main API
│   ├── normalize.ts          # Normalization logic
│   ├── normalize.test.ts     # Test suite
│   ├── idempotency.ts        # Deduplication
│   ├── identity-mapper.ts    # Entity resolution
│   ├── dlq.ts                # Dead letter queue
│   ├── normalizer-accelerator.ts # Fast-path normalization
│   ├── types.ts              # TypeScript types
│   └── schemas/              # Entity schemas
├── wrangler.toml
└── package.json
```

**Key Concepts**:
- **Idempotency**: Hash-based deduplication
- **Context-aware**: Category, user_id, account_id, team_id
- **DLQ**: Failed normalizations stored for retry

---

### 5. Store Service (`services/store`)

**Purpose**: File storage (R2), version management, knowledge ingestion trigger.

**URL**: `https://integratewise-store.connect-a1b.workers.dev`

```
services/store/
├── src/
│   └── index.ts              # 195 lines - File CRUD + R2
├── wrangler.toml             # D1 + R2_BUCKET bindings
└── package.json
```

**Endpoints**:
- `POST /store/files` - Initiate upload
- `PUT /store/files/:id/upload` - Upload to R2
- `GET /store/files/:id` - Get file details
- `GET /store/files/:id/download` - Download from R2

**Flow**: Upload → R2 Storage → Trigger Knowledge Ingestion

---

## 🧠 Layer 2: Intelligence Layer

### 6. Think Service (`services/think`)

**Purpose**: Signal engine, situation detection, decision recording.

**URL**: `https://integratewise-think.connect-a1b.workers.dev`

```
services/think/
├── src/
│   ├── index.ts              # 170 lines - Main API with queue handler
│   ├── engine.ts             # SignalEngine class
│   ├── actions.ts            # Action proposal generation
│   ├── context.ts            # Context enrichment
│   ├── fusion.ts             # Signal fusion
│   ├── fusion.test.ts        # Tests
│   ├── narrative.ts          # Narrative generation
│   ├── semantic-lookup.ts    # Vector search integration
│   └── use-cases/            # Domain-specific analyzers
├── wrangler.toml
└── package.json
```

**Endpoints**:
- `GET /v1/signals` - List signals for tenant
- `GET /v1/situations` - List situations
- `POST /v1/think/analyze` - Trigger analysis for entity
- `POST /v1/decide` - Record decision

**Queue Handler**: Async signal processing via `THINK_QUEUE`

**Security Features**:
- Rate limiting: 100 req/min per tenant
- Correlation ID tracing
- Secure headers

---

### 7. Knowledge Service (`services/knowledge`)

**Purpose**: Semantic search, document chunking, embedding management.

**URL**: `https://integratewise-knowledge.connect-a1b.workers.dev`

```
services/knowledge/
├── src/
│   ├── index.ts              # 601 lines - Main API
│   ├── embeddings.ts         # Embedding utilities
│   ├── chunking/             # Document chunking strategies
│   │   └── index.ts
│   ├── embedding/            # OpenAI/OpenRouter embedders
│   │   └── index.ts
│   ├── search/               # Vector + hybrid search
│   │   └── index.ts
│   ├── schema/               # Zod schemas
│   └── services/             # Business logic
├── wrangler.toml
└── package.json
```

**Features**:
- **Chunking**: Recursive, semantic, fixed-size
- **Embedding**: OpenRouter (preferred) or OpenAI
- **Search**: Vector, keyword, hybrid
- **Session Search**: Search within AI conversation context

**Endpoints**:
- `POST /knowledge/search` - Semantic search
- `POST /knowledge/ingest` - Ingest document
- `POST /knowledge/embed/session` - Embed AI session

---

### 8. IQ Hub Service (`services/iq-hub`)

**Purpose**: Cognitive intelligence, memory retrieval, AI conversations.

**URL**: `https://integratewise-iq-hub.connect-a1b.workers.dev`

```
services/iq-hub/
├── src/
│   ├── index.ts              # 601 lines - Main API
│   └── lib/
│       ├── config.ts         # Environment config
│       ├── firestore.ts      # Firestore integration
│       ├── memory-extraction.ts # Auto memory extraction
│       ├── memory-index.ts   # Memory indexing
│       └── triage-bot.ts     # Message triage
├── wrangler.toml
└── package.json
```

**Endpoints**:
- `POST /iq/sessions/search` - Search AI sessions
- `POST /iq/memories/retrieve` - Get memories
- `POST /iq/conversations` - Create conversation
- `POST /iq/conversations/:id/messages` - Add message
- `POST /iq/memories` - Create memory

**Memory Types**: `insight`, `preference`, `fact`, `decision`, `action_item`, `relationship`

---

### 9. Agents Service (`services/agents`)

**Purpose**: Multi-agent orchestration via Cloudflare Workflows.

**URL**: `https://integratewise-agents.connect-a1b.workers.dev`

```
services/agents/
├── src/
│   └── index.ts              # 529 lines - Agent Colony
├── migrations/               # D1 migrations
├── wrangler.toml             # AGENT_COLONY workflow binding
└── package.json
```

**Agent Types**:

| Agent | Role | Model |
|-------|------|-------|
| Orchestrator | Routes tasks to specialized agents | Llama 3.1 70B |
| Research | Gathers info from KB, CRM, external sources | Llama 3.1 70B |
| Analyst | Analyzes data, calculates metrics | Llama 3.1 70B |
| Writer | Generates emails, reports, docs | Llama 3.1 70B |
| Planner | Creates action plans, playbooks | Llama 3.1 70B |
| Executor | Triggers actions via Act service | Llama 3.1 70B |

**Workflow**: `AgentColonyWorkflow` (Cloudflare Durable Objects)

**Endpoints**:
- `POST /colony/run` - Start agent colony task
- `GET /colony/:instanceId` - Get status
- `POST /agent/:agentType` - Quick single-agent execution

---

## ⚙️ Layer 3: Action Layer

### 10. Act Service (`services/act`)

**Purpose**: Execute action proposals with governance checks.

**URL**: `https://integratewise-act.connect-a1b.workers.dev`

```
services/act/
├── src/
│   ├── index.ts              # 115 lines - Execution engine
│   ├── lib/                  # Utilities
│   └── rbac-example.ts       # RBAC demo
├── wrangler.toml
└── package.json
```

**Flow**:
1. Receive action proposal ID
2. Verify proposal exists in Spine
3. **MANDATORY**: Call Govern service for policy check
4. If allowed, execute action
5. Log to audit_logs

**Bindings**: D1 (DB), Service Binding (GOVERN)

---

### 11. Govern Service (`services/govern`)

**Purpose**: Policy engine, approvals, audit logging.

**URL**: `https://integratewise-govern.connect-a1b.workers.dev`

```
services/govern/
├── src/
│   ├── index.ts              # 546 lines - Policy API
│   ├── policies.ts           # Policy CRUD
│   ├── policies.test.ts      # Tests
│   ├── workflow.ts           # Approval workflow
│   ├── audit.ts              # Audit logging
│   ├── governance-engine.ts  # Rule evaluation
│   └── types.ts              # TypeScript types
├── wrangler.toml
└── package.json
```

**Endpoints**:
- `GET /v1/policies` - List policies
- `POST /v1/policies` - Create policy
- `POST /v1/check` - Check if action is allowed
- `POST /v1/approve` - Approve pending action
- `POST /v1/reject` - Reject pending action
- `GET /v1/audit` - Get audit logs

**Policy Schema**:
```typescript
{
  action_type: "crm_update" | "email_send" | "slack_post" | ...,
  conditions: [...],   // JSONPath expressions
  effect: "allow" | "deny" | "require_approval"
}
```

---

### 12. Workflow Service (`services/workflow`)

**Purpose**: Durable approval workflows with human-in-the-loop.

**URL**: `https://integratewise-workflow.connect-a1b.workers.dev`

```
services/workflow/
├── src/
│   └── index.ts              # 299 lines - Approval workflow
├── wrangler.toml             # APPROVAL_WORKFLOW binding
└── package.json
```

**Workflow Class**: `ApprovalWorkflow extends WorkflowEntrypoint`

**Steps**:
1. Store recommendation in pending state
2. Check governance for auto-approval
3. If not auto-approved, `waitForEvent` (7 day timeout)
4. On approval: Update status, execute via Act
5. On rejection/timeout: Update status

**Endpoints**:
- `POST /workflows/approval` - Create workflow
- `GET /workflows/:instanceId` - Get status
- `POST /workflows/:instanceId/approve` - Send approval event

---

## 🗄️ Layer 4: Data Layer

### 13. Spine Service (`services/spine`)

**Purpose**: System of Record (SSOT), context-aware entity storage.

**URL**: `https://integratewise-spine.connect-a1b.workers.dev`

```
services/spine/
├── src/
│   ├── index.ts              # 223 lines - Entity CRUD
│   └── packs.ts              # Context pack definitions
├── wrangler.toml
└── package.json
```

**Entity Types**:
- `task`, `account`, `meeting`, `project`
- `objective`, `document`, `contact`, `event`

**Context Categories**:
- `personal` - User's own items
- `csm` - Customer Success Manager view
- `tam` - Technical Account Manager view
- `business` - Full business view

**Endpoints**:
- `POST /v1/spine/:entity_type` - Write entity
- `GET /v1/spine/entities` - Context-aware query
- `GET /evidence/:artifact_id` - Get evidence

---

### 14. Tenants Service (`services/tenants`)

**Purpose**: Multi-tenant context resolution.

**URL**: `https://integratewise-tenants.connect-a1b.workers.dev`

```
services/tenants/
├── src/
│   ├── index.ts              # 55 lines - Context API
│   └── context.ts            # Tenant resolution logic
├── wrangler.toml
└── package.json
```

**Headers Set**:
- `x-tenant-id`
- `x-workspace-id`
- `x-tenant-plan`

---

### 15. Billing Service (`services/billing`)

**Purpose**: Subscription management, usage tracking, payment webhooks.

**URL**: `https://integratewise-billing.connect-a1b.workers.dev`

```
services/billing/
├── src/
│   └── index.ts              # 320 lines - Billing API
├── wrangler.toml             # D1 + Stripe/RazorPay secrets
└── package.json
```

**Plans**:
| Plan | Price | Limits |
|------|-------|--------|
| Free | $0 | 100 signals, 2 users |
| Pro | $49/mo | 10K signals, 10 users |
| Business | $199/mo | 100K signals, 50 users |
| Enterprise | Custom | Unlimited |

**Endpoints**:
- `GET /v1/plans` - List plans
- `GET /v1/subscriptions/:tenantId` - Get subscription
- `POST /v1/usage` - Track usage
- `GET /v1/invoices/:tenantId` - List invoices
- `POST /webhooks/stripe` - Stripe webhook
- `POST /webhooks/razorpay` - RazorPay webhook

---

## 🔧 Layer 5: Admin & Tooling

### 16. Admin Service (`services/admin`)

**Purpose**: Health aggregation, internal dashboard API.

**URL**: `https://integratewise-admin.connect-a1b.workers.dev`

```
services/admin/
├── src/
│   └── index.ts              # 20 lines - Health check
├── dashboard/                # UI components
├── wrangler.toml
└── package.json
```

**Health Response**:
```json
{
  "services": {
    "spine": "healthy",
    "think": "healthy",
    "act": "healthy",
    "knowledge": "healthy",
    "loader": "healthy",
    "normalizer": "healthy"
  }
}
```

---

### 17. MCP Tool Server (`services/mcp-connector`)

**Purpose**: MCP-style tool discovery and invocation.

**URL**: `https://integratewise-mcp-tool-server.connect-a1b.workers.dev`

```
services/mcp-connector/
├── src/
│   ├── index.ts              # 508 lines - Main API
│   ├── handlers/
│   │   └── tools.ts          # Tool handlers
│   └── lib/
│       ├── logging.ts        # Structured logging
│       ├── schema.ts         # Zod schemas
│       └── firestore.ts      # GCP integration
├── wrangler.toml
└── package.json
```

**Tools (7)**:
1. `kb.write_session_summary` - Save AI session
2. `kb.write_article` - Create KB article
3. `kb.get_artifact` - Retrieve artifact
4. `kb.list_recent` - List recent items
5. `kb.search` - Search KB
6. `kb.topic_upsert` - Create/update topic
7. `kb.topic_list` - List topics

---

### 18. Hub Controller API (`packages/api`)

**Purpose**: Entity CRUD, AI commands, metrics tracking.

**URL**: `https://hub-controller-api.connect-a1b.workers.dev`

```
packages/api/
├── src/
│   ├── index.ts              # 590 lines - Main API
│   ├── db.ts                 # Database utilities
│   ├── ai.ts                 # AI command processing
│   └── types.ts              # TypeScript types
├── wrangler.toml             # D1 + AI binding
└── package.json
```

**Endpoints**:
- `POST /api/command` - AI command processing
- `GET /api/entities` - List entities
- `POST /api/entities` - Create entity
- `GET /api/metrics` - Get metrics
- `POST /api/metrics` - Track metrics

---

### 19. MCP Tool Connector (`packages/integratewise-mcp-tool-connector`)

**Purpose**: Stdio-based MCP server for Claude Desktop.

```
packages/integratewise-mcp-tool-connector/
├── src/
│   └── index.ts              # 286 lines - MCP Server
├── wrangler.toml
└── package.json
```

**Tools**:
1. `get_account_intelligence`
2. `get_account_strategy`
3. `list_active_situations`
4. `end_ai_session`
5. `record_knowledge`
6. `search_knowledge`
7. `get_session_context`

---

## 🔗 Service Communication

### Internal Service Bindings

```
Act → Govern (GOVERN fetcher binding)
Loader → Normalizer → Store
Think → Queue → Think (async processing)
Agents → AGENT_COLONY workflow
Workflow → APPROVAL_WORKFLOW workflow
```

### Database Bindings

| Service | D1 Database | Neon |
|---------|-------------|------|
| act | `integratewise-spine-prod` | — |
| agents | `integratewise-spine-prod` | — |
| spine | `integratewise-spine-prod` | — |
| think | `integratewise-spine-prod` | — |
| billing | `integratewise-spine-prod` | — |
| gateway | — | ✅ |
| govern | — | ✅ |
| knowledge | — | ✅ |
| webhooks | — | ✅ |

---

## 🚀 Deployment Commands

```bash
# Deploy all services
cd services/act && npx wrangler deploy
cd services/agents && npx wrangler deploy
cd services/admin && npx wrangler deploy
cd services/billing && npx wrangler deploy
cd services/gateway && npx wrangler deploy
cd services/govern && npx wrangler deploy
cd services/iq-hub && npx wrangler deploy
cd services/knowledge && npx wrangler deploy
cd services/loader && npx wrangler deploy
cd services/mcp-connector && npx wrangler deploy
cd services/normalizer && npx wrangler deploy
cd services/spine && npx wrangler deploy
cd services/store && npx wrangler deploy
cd services/tenants && npx wrangler deploy
cd services/think && npx wrangler deploy
cd services/workflow && npx wrangler deploy
cd packages/webhooks && npx wrangler deploy
cd packages/api && npx wrangler deploy
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INGESTION LAYER                                  │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌────────────┐  ┌───────────┐  │
│  │ Gateway │  │ Webhooks │  │ Loader │  │ Normalizer │  │   Store   │  │
│  │ (Neon)  │  │ (14 prov)│  │(D1+R2) │  │   (D1)     │  │  (D1+R2)  │  │
│  └────┬────┘  └────┬─────┘  └───┬────┘  └─────┬──────┘  └─────┬─────┘  │
└───────│───────────│─────────────│─────────────│───────────────│────────┘
        │           │             │             │               │
        ▼           ▼             ▼             ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       INTELLIGENCE LAYER                                 │
│  ┌─────────┐  ┌───────────┐  ┌────────┐  ┌────────┐  ┌────────────────┐│
│  │  Think  │  │ Knowledge │  │ IQ Hub │  │ Agents │  │ MCP Tool Server││
│  │(Signals)│  │ (Vectors) │  │(Memory)│  │(Colony)│  │    (7 tools)   ││
│  └────┬────┘  └─────┬─────┘  └───┬────┘  └───┬────┘  └───────┬────────┘│
└───────│─────────────│────────────│───────────│───────────────│─────────┘
        │             │            │           │               │
        ▼             ▼            ▼           ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          ACTION LAYER                                    │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐                               │
│  │   Act   │──│  Govern  │  │ Workflow │                               │
│  │(Execute)│  │ (Policy) │  │(Approval)│                               │
│  └─────────┘  └──────────┘  └──────────┘                               │
└─────────────────────────────────────────────────────────────────────────┘
        │             │            │
        ▼             ▼            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────────────┐  │
│  │  Spine  │  │ Tenants  │  │ Billing  │  │     Hub Controller API  │  │
│  │ (SSOT)  │  │(Context) │  │(Payments)│  │       (Entities)        │  │
│  └─────────┘  └──────────┘  └──────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Model

### Authentication Layers

1. **Webhook Signature Verification** (Webhooks service)
2. **Service-to-Service Auth** (`x-service-auth` header)
3. **Tenant Context** (`x-tenant-id` header)
4. **Correlation Tracing** (`x-correlation-id` header)

### Rate Limiting

- Think Service: 100 req/min per tenant
- Knowledge Service: Tenant limits via `enforceTenantLimits`

---

*Total Lines of TypeScript: ~6,500+ across 19 services*
