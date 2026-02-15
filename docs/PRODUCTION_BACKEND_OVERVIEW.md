# Production Backend Overview

**Location**: `integratewise-complete/`  
**Framework**: Next.js + Cloudflare Workers  
**Database**: Neon PostgreSQL + Cloudflare D1  
**Architecture**: Microservices (27 services)

---

## 1. Backend Services (27 Microservices)

### Core Data Pipeline (L3)

| Service | Purpose | Technology |
|---------|---------|------------|
| **loader** | 8-stage data ingestion pipeline | Cloudflare Worker |
| **normalizer** | Schema transformation (NA0-NA5) | Cloudflare Worker |
| **spine** | SSOT (Single Source of Truth) | Cloudflare D1 |
| **spine-v2** | Enhanced spine with D1 | Cloudflare Worker |
| **store** | Data persistence layer | Cloudflare Worker |

### L2 Cognitive Layer

| Service | Purpose | Technology |
|---------|---------|------------|
| **think** | Situation assessment, reasoning | Cloudflare Worker |
| **act** | Action execution, tool write-back | Cloudflare Worker |
| **govern** | Policy enforcement, compliance | Cloudflare Worker |
| **iq-hub** | AI conversation management | Cloudflare Worker |
| **knowledge** | Vector search, embeddings | Cloudflare Worker |
| **cognitive-brain** | Core reasoning engine | Cloudflare Worker |

### Governance & Control

| Service | Purpose | Technology |
|---------|---------|------------|
| **tenants** | Multi-tenant isolation | Cloudflare Worker |
| **admin** | System administration | Cloudflare Worker |
| **billing** | Subscription management | Cloudflare Worker |
| **agents** | AI agent orchestration | Cloudflare Worker |

### Integration Layer

| Service | Purpose | Technology |
|---------|---------|------------|
| **connectors** | Tool integrations (50+ tools) | Package |
| **mcp-connector** | MCP protocol implementation | Cloudflare Worker |
| **gateway** | API gateway, routing | Cloudflare Worker |
| **stream-gateway** | Real-time streaming | Cloudflare Worker |
| **webhooks** | Webhook processing | Package |

### Specialized Services

| Service | Purpose |
|---------|---------|
| **accelerators** | Domain intelligence (health scores, predictions) |
| **memory-consolidator** | Long-term memory management |
| **orchestrator** | Workflow orchestration |
| **workflow** | Workflow engine |
| **views** | View projection service |
| **os-ui** | UI component service |
| **integratewise-knowledge-bank** | Knowledge storage |

---

## 2. API Routes (Next.js)

### Authentication
```
api/auth/
├── login/route.ts          # Supabase Auth login
└── logout/route.ts         # Session logout
```

### Connectors (Tool Integrations)
```
api/connectors/
├── [provider]/
│   ├── callback/route.ts   # OAuth callback
│   ├── connect/route.ts    # Initiate connection
│   └── disconnect/route.ts # Remove connection
├── auth-url/[type]/route.ts# Get auth URL
├── list/route.ts           # List available connectors
├── route.ts                # CRUD operations
└── status/[type]/route.ts  # Connection status
```

### Admin (40+ endpoints)
```
api/admin/
├── actions/route.ts        # Admin actions
├── api-keys/route.ts       # API key management
├── audit/route.ts          # Audit logs
├── billing/route.ts        # Billing management
├── connectors/route.ts     # Connector admin
├── departments/route.ts    # Department management
├── features/route.ts       # Feature flags
├── governance/route.ts     # Governance policies
├── iam/route.ts            # Identity management
├── permissions/route.ts    # Permission matrix
├── roles/route.ts          # Role management
├── schema/route.ts         # Schema registry
├── tenancy/route.ts        # Tenant management
├── users/route.ts          # User management
└── ... (20+ more)
```

### L2 Cognitive APIs
```
api/
├── act/
│   ├── execute/route.ts    # Execute approved actions
│   └── runs/route.ts       # Action run history
├── adjust/
│   ├── feedback/route.ts   # Feedback collection
│   └── insights/route.ts   # Learning insights
├── evidence/
│   └── resolve/route.ts    # Evidence compilation
├── govern/
│   ├── approve/route.ts    # Approval workflow
│   ├── decide/route.ts     # Decision engine
│   ├── policies/route.ts   # Policy management
│   └── queue/route.ts      # Approval queue
├── signals/route.ts        # Signal detection
├── situations/route.ts     # Situation assessment
└── think/route.ts          # Think engine
```

### AI/LLM APIs
```
api/ai/
├── chat/route.ts           # AI chat completion
├── conversations/          # Conversation management
│   ├── [id]/route.ts
│   └── [id]/messages/route.ts
└── memories/               # Memory management
    ├── route.ts
    └── [id]/confirm/route.ts
```

### Webhooks
```
api/webhooks/
├── [provider]/route.ts     # Generic provider webhook
├── asana/route.ts          # Asana webhooks
├── brainstorm/route.ts     # Brainstorm webhooks
├── discord/route.ts        # Discord webhooks
├── health/route.ts         # Health checks
├── hubspot/route.ts        # HubSpot webhooks
├── slack/route.ts          # Slack webhooks
└── stripe/route.ts         # Stripe webhooks
```

### Data Management
```
api/
├── entities/
│   └── [entityType]/
│       ├── route.ts        # List entities
│       └── [id]/route.ts   # Entity CRUD
├── data-sources/
│   └── sync/route.ts       # Sync data sources
├── data-sync/route.ts      # Data synchronization
├── documents/route.ts      # Document management
└── docs/recent/route.ts    # Recent documents
```

### Workspace APIs
```
api/
├── today/route.ts          # Today's priorities
├── today/stats/route.ts    # Today statistics
├── calendar/today/route.ts # Calendar for today
├── tasks/my/route.ts       # My tasks
├── projects/recent/route.ts# Recent projects
└── search/route.ts         # Global search
```

### System APIs
```
api/
├── health/route.ts         # Health check
├── usage/route.ts          # Usage metrics
├── session/route.ts        # Session management
├── cron/
│   ├── daily-insights/route.ts
│   ├── hourly-insights/route.ts
│   └── spend-insights/route.ts
└── system/
    ├── migrations/route.ts
    └── releases/route.ts
```

---

## 3. Shared Packages

### Core Packages

| Package | Purpose |
|---------|---------|
| **types** | Shared TypeScript definitions |
| **db** | Database client, schema |
| **lib** | Shared utilities |
| **config** | Shared configuration |
| **supabase** | Supabase client setup |
| **api** | API client utilities |

### Domain Packages

| Package | Purpose |
|---------|---------|
| **connectors** | 50+ tool integrations |
| **connector-contracts** | Connector interfaces |
| **connector-utils** | Connector utilities |
| **accelerators** | Domain intelligence |
| **analytics** | Analytics utilities |
| **webhooks** | Webhook handling |

### Security & Multi-tenancy

| Package | Purpose |
|---------|---------|
| **rbac** | Role-based access control |
| **tenancy** | Multi-tenant utilities |
| **hub** | Service hub/registry |

### Integration

| Package | Purpose |
|---------|---------|
| **integratewise-mcp-tool-connector** | MCP protocol |
| **website** | Website utilities |
| **integration-tests** | E2E tests |

---

## 4. 8-Stage Pipeline (Loader Service)

```
Inbound Data → Stage 1: Analyzer → Stage 2: Classifier → 
Stage 3: Filter → Stage 4: Refiner → Stage 5: Extractor → 
Stage 6: Validator → Stage 7: Sanity Scan → Stage 8: Sectorizer → 
→ Spine (SSOT) + Context Store
```

Each stage is a Cloudflare Queue with retry logic.

---

## 5. Database Schema (Neon PostgreSQL)

### Core Tables

```sql
-- Spine (SSOT)
spine_accounts
spine_contacts
spine_tasks
spine_meetings
spine_projects
spine_documents
spine_events
spine_objectives

-- Context Store (pgvector)
context_documents
context_embeddings
context_chunks

-- AI Chats
ai_conversations
ai_messages
ai_memories

-- Governance
governance_policies
governance_approvals
governance_audit_log

-- Multi-tenant
tenants
tenant_settings
tenant_users

-- RBAC
roles
permissions
user_roles
role_permissions

-- Connectors
connector_configs
connector_syncs
webhook_events

-- Accelerators
accelerator_predictions
accelerator_health_scores
accelerator_forecasts
```

---

## 6. Authentication & Security

### Auth Flow
1. Supabase Auth (JWT)
2. Middleware validation
3. Tenant context injection
4. RBAC permission check
5. Audit logging

### Security Layers
- **Network**: Cloudflare WAF, DDoS protection
- **Transport**: TLS 1.3
- **Auth**: JWT + HMAC + OAuth
- **Authorization**: RBAC + RLS (Row-Level Security)
- **Data**: AES-256 encryption at rest
- **Audit**: Immutable audit log

---

## 7. Deployment Architecture

```
┌─────────────────────────────────────────┐
│           Cloudflare Edge               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Workers │ │ Workers │ │ Workers │  │
│  │ (API)   │ │ (L3)    │ │ (L2)    │  │
│  └────┬────┘ └────┬────┘ └────┬────┘  │
│       └───────────┴───────────┘       │
│                   │                     │
│              Queues (Kafka-like)       │
└───────────────────┬─────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
   ┌────┴────┐ ┌────┴────┐ ┌────┴────┐
   │  Neon   │ │  D1     │ │   R2    │
   │ Postgres│ │ (Edge)  │ │ (Files) │
   └─────────┘ └─────────┘ └─────────┘
```

---

## 8. Key Features Implemented

### L0: Onboarding
- Supabase Auth integration
- Multi-step onboarding wizard
- Tool connection (OAuth)
- Domain selection

### L1: Workspace (15 Modules)
- Personal, CS, Sales, Marketing, Ops, etc.
- Domain-specific views
- Cross-module navigation
- Real-time updates

### L2: Cognitive (14 Components)
- SpineUI: Canonical data browser
- ContextUI: Unstructured content
- KnowledgeUI: Knowledge graph
- Evidence: Evidence compiler
- Signals: Pattern detection
- Think: Situation assessment
- Act: Action execution
- HITL: Approval workflows
- Govern: Policy enforcement
- Adjust: Feedback learning
- Repeat: Continuous cycle
- AuditUI: Audit trails
- AgentConfig: AI configuration
- DigitalTwin: Simulation

### Admin (40+ Pages)
- User management
- Role/permission management
- Tenant management
- Connector management
- Audit logs
- System observability
- Release management

---

## 9. External Integrations

### Auth Providers
- Google OAuth
- Microsoft OAuth
- Email/Password (Supabase)

### Tool Connectors (50+)
**CRM**: Salesforce, HubSpot, Pipedrive, Zoho
**Support**: Zendesk, Intercom, Freshdesk
**Communication**: Slack, Teams, Discord
**Project**: Jira, Asana, Monday, ClickUp
**Finance**: Stripe, QuickBooks, Xero
**Storage**: Google Drive, Dropbox, Box
**AI**: OpenRouter, Anthropic, OpenAI
**Other**: Notion, GitHub, Figma, Miro

---

## 10. Monitoring & Observability

- **Health Checks**: `/api/health`
- **Metrics**: Cloudflare Analytics
- **Logging**: Structured JSON logs
- **Error Tracking**: Sentry integration
- **Performance**: Web Vitals tracking

---

## Summary

| Aspect | Implementation |
|--------|----------------|
| **Services** | 27 microservices |
| **API Routes** | 80+ endpoints |
| **Packages** | 19 shared packages |
| **Database** | Neon PostgreSQL + D1 |
| **Auth** | Supabase + OAuth |
| **Connectors** | 50+ tools |
| **L1 Modules** | 15 complete |
| **L2 Components** | 14 complete |
| **Admin Pages** | 40+ |

**Status**: Production-ready backend with full L0-L3 implementation.
