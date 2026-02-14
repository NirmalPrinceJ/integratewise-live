# IntegrateWise Database Schema & Data Flow

**Last Updated:** 2026-02-14
**Status:** Current Schema Documentation

---

## Overview

IntegrateWise uses a **hybrid data architecture** across multiple database systems:

1. **Neon PostgreSQL** (Serverless) - Primary data store for SSOT (Spine)
2. **Cloudflare D1** (SQLite) - Edge databases for specific services
3. **Supabase** - Auth, storage, and real-time subscriptions

---

## 1. Database Systems

### Neon PostgreSQL (Primary - L3 Spine)

**Connection:** `@neondatabase/serverless`
**Used by:** spine, cognitive-brain, think, act, knowledge, gateway, webhooks
**Purpose:** Single Source of Truth (SSOT), Context Store, Hot Memory

**Status:** ⚠️ **Schema not yet documented in codebase**

**Expected Tables (based on proposed architecture):**
- `spine_entities` - Core SSOT entities
- `spine_relationships` - Entity relationships
- `context_store` - Context data for AI reasoning
- `hot_memory` - Recent/active memory cache
- `audit_log` - Audit trail (❌ not yet implemented)

**Action Required:** Document and create migration files for Neon PostgreSQL schema

### Cloudflare D1 (Edge - Service-Specific)

**Type:** SQLite-compatible edge database
**Purpose:** Fast edge queries, fingerprint deduplication, memory consolidation

#### Memory Consolidator D1 Database

**Location:** `services/memory-consolidator/schema.sql`
**Purpose:** Stores consolidated memories from session aggregation

**Tables:**

1. **`consolidated_memories`**
   - Primary Key: `id` (TEXT)
   - Fields:
     - `tenant_id` (TEXT, NOT NULL) - Multi-tenancy isolation
     - `consolidation_type` (TEXT) - `topic`, `user`, `account`, `pattern`
     - `topic`, `user_id`, `account_id` (TEXT) - Optional context
     - `summary` (TEXT, NOT NULL)
     - `key_insights` (JSON array)
     - `recurring_themes` (JSON array)
     - `action_patterns` (JSON array)
     - `session_count` (INTEGER)
     - `time_range_start`, `time_range_end` (TEXT)
     - `risk_level` (TEXT) - `normal`, `elevated`, `high`, `critical`
   - Indexes: tenant, type, topic, user, account, created_at, risk_level, time_range

2. **`consolidation_runs`**
   - Primary Key: `id` (TEXT)
   - Fields:
     - `run_type` (TEXT) - `hourly`, `daily`, `weekly`
     - `tenant_id` (TEXT, nullable)
     - `status` (TEXT) - `running`, `completed`, `failed`
     - `sessions_processed`, `memories_created`, `memories_updated`, `errors_count` (INTEGER)
     - `duration_ms` (INTEGER) - Performance tracking
   - Indexes: type, tenant, status, started_at

3. **`memory_links`**
   - Primary Key: `id` (TEXT)
   - Fields:
     - `source_memory_id`, `target_memory_id` (TEXT, FK)
     - `link_type` (TEXT) - `related`, `supersedes`, `derives_from`, `contradicts`
     - `strength` (REAL, 0.0-1.0)
   - Indexes: source, target, type

**Views:**
- `recent_topic_memories` - Last 7 days of topic memories
- `account_health_snapshot` - Latest account health per account
- `weekly_patterns` - Weekly pattern consolidations
- `consolidation_stats` - Run statistics

#### Loader D1 Database

**Location:** `services/loader/schema.sql`
**Purpose:** Fingerprint deduplication (Stage 3 Filter in 8-stage pipeline)

**Tables:**

1. **`processed_fingerprints`**
   - Primary Key: `fingerprint` (TEXT)
   - Fields:
     - `tenant_id` (TEXT, NOT NULL)
     - `source` (TEXT, NOT NULL)
     - `entity_type` (TEXT)
     - `created_at` (TEXT)
   - Indexes: tenant_id, created_at
   - Purpose: Reject duplicate payloads in normalization pipeline

#### Hub Controller D1 Database

**Location:** `packages/api/migrations/003_webhooks.sql`
**Purpose:** Webhook event tracking and provider configuration

**Tables:**

1. **`webhook_events`**
   - Primary Key: `id` (TEXT)
   - Fields:
     - `provider` (TEXT, NOT NULL) - Provider name
     - `event_type` (TEXT, NOT NULL)
     - `payload` (TEXT, NOT NULL) - Full webhook payload
     - `headers` (TEXT) - HTTP headers
     - `signature_valid` (INTEGER) - Signature verification result
     - `processed` (INTEGER) - Processing status (0/1)
     - `error_message` (TEXT)
     - `retry_count` (INTEGER)
     - `created_at`, `processed_at` (TEXT)
   - Indexes: provider, processed, created_at
   - Purpose: Audit log for all incoming webhooks

2. **`webhook_providers`**
   - Primary Key: `id` (TEXT)
   - Fields:
     - `name` (TEXT, UNIQUE) - Provider identifier
     - `enabled` (INTEGER) - Active status (0/1)
     - `endpoint` (TEXT) - Webhook endpoint path
     - `auth_type` (TEXT) - Authentication method
     - `description` (TEXT)
     - `webhook_url` (TEXT)
     - `last_event_at` (TEXT)
     - `event_count`, `error_count` (INTEGER)
   - Providers Configured (18 total):
     - CRM: HubSpot, Salesforce, Pipedrive
     - Marketing: LinkedIn, Canva, Google Ads, Meta
     - Communication: WhatsApp, Slack
     - Payments: Razorpay, Stripe
     - Dev: GitHub, Vercel
     - Productivity: Todoist, Notion, Coda, Linear
     - eCommerce: Shopify

3. **`webhook_subscriptions`**
   - Primary Key: `id` (TEXT)
   - Fields:
     - `url` (TEXT) - Outbound webhook URL
     - `events` (JSON array) - Subscribed event types
     - `secret` (TEXT) - Signing secret
     - `active` (INTEGER)
     - `last_triggered_at` (TEXT)
     - `failure_count` (INTEGER)
   - Purpose: Outbound webhook configurations

### Supabase

**Used by:** apps/web (Frontend auth & storage)
**Purpose:** Authentication, Row-Level Security (RLS), file storage
**Package:** `packages/supabase/`

**Schema:** Managed via Supabase dashboard (not in codebase)

**Expected Tables:**
- `auth.users` - User authentication
- `public.profiles` - User profiles
- `public.tenants` - Tenant configurations (with RLS)

---

## 2. Data Flow Architecture

### Current Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SYSTEMS (15 Providers)                │
│  HubSpot, Salesforce, Pipedrive, LinkedIn, Canva, Google Ads,   │
│  Meta, WhatsApp, Razorpay, Stripe, GitHub, Vercel, Todoist,     │
│  Notion, AI Relay                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓ webhook events
┌─────────────────────────────────────────────────────────────────┐
│            WEBHOOK INGRESS (packages/webhooks)                   │
│            Cloudflare Workers @ webhooks.integratewise.online    │
│                                                                   │
│  1. Receive webhook POST                                         │
│  2. Verify signature (provider-specific)                         │
│  3. Log to webhook_events (D1)                                   │
│  4. Route to Gateway                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              GATEWAY (services/gateway)                          │
│              Cloudflare Workers - API Gateway                    │
│                                                                   │
│  1. Route to appropriate service                                 │
│  2. Tenant resolution                                            │
│  3. Load balancing                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         NORMALIZER (services/normalizer)                         │
│         8-Stage Pipeline (L3 Adaptive Spine)                     │
│                                                                   │
│  Stage 1: Analyzer    - Parse and analyze payload                │
│  Stage 2: Classifier  - Classify entity type                     │
│  Stage 3: Filter      - Check fingerprint (processed_fingerprints)│
│  Stage 4: Refiner     - Clean and enrich data                    │
│  Stage 5: Extractor   - Extract entities and relationships       │
│  Stage 6: Validator   - Validate against rules                   │
│  Stage 7: Sanity Scan - Final integrity check                    │
│  Stage 8: Sectorizer  - Route to target sector (Gateway handles) │
│                                                                   │
│  Output: Normalized payload → Spine                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              SPINE (services/spine)                              │
│              Single Source of Truth (SSOT)                       │
│              Neon PostgreSQL                                     │
│                                                                   │
│  1. Upsert normalized entities                                   │
│  2. Update relationships                                         │
│  3. Trigger downstream updates                                   │
│  4. Maintain audit log (❌ not yet implemented)                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         COGNITIVE BRAIN (services/cognitive-brain)               │
│         L2 Reasoning Engine                                      │
│         Neon PostgreSQL (Context Store)                          │
│                                                                   │
│  1. Read from Spine                                              │
│  2. Build context (Context Store)                                │
│  3. Trigger Think → Act loop                                     │
│  4. Update Hot Memory                                            │
└─────────────────────────────────────────────────────────────────┘
                    ↓                              ↓
       ┌────────────────────────┐    ┌────────────────────────┐
       │  THINK (services/think) │    │  ACT (services/act)     │
       │  Analysis & Decisions   │    │  Action Execution       │
       │  Neon PostgreSQL        │    │  Neon PostgreSQL        │
       └────────────────────────┘    └────────────────────────┘
                    ↓                              ↓
┌─────────────────────────────────────────────────────────────────┐
│         KNOWLEDGE (services/knowledge)                           │
│         Knowledge Management                                     │
│         Neon PostgreSQL (+ future pgvector)                      │
│                                                                   │
│  1. Store insights, patterns, learnings                          │
│  2. Semantic search (❌ pgvector not yet implemented)            │
│  3. Feed into future reasoning                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│    MEMORY CONSOLIDATOR (services/memory-consolidator)           │
│    D1 Database (consolidated_memories)                          │
│                                                                   │
│  Periodic Jobs:                                                  │
│  - Hourly: Consolidate recent sessions                          │
│  - Daily: Topic and user consolidation                          │
│  - Weekly: Pattern analysis                                     │
│                                                                   │
│  Output: Consolidated memories → Knowledge Store                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND (apps/web)                                 │
│              Next.js on Vercel                                   │
│              Supabase (Auth, RLS)                                │
│                                                                   │
│  1. User authentication (Supabase Auth)                          │
│  2. Query Spine via Hub API                                      │
│  3. Display L1 Workspace modules                                 │
│  4. Render L2 Cognitive UI                                       │
│  5. Real-time updates (future: Supabase realtime)                │
└─────────────────────────────────────────────────────────────────┘
```

### Missing Data Flows (Proposed Architecture)

**❌ Not Yet Implemented:**

1. **DLQ (Dead Letter Queue)**
   - Purpose: Handle failed events from pipeline
   - Technology: Cloudflare Queues
   - Missing: No DLQ table or queue configured

2. **Audit Store**
   - Purpose: Compliance tracking for all data transformations
   - Technology: Neon PostgreSQL
   - Missing: No audit_log table or service

3. **AI Chats Store**
   - Purpose: Capture all AI sessions via MCP protocol
   - Technology: Neon PostgreSQL
   - Status: `mcp-connector` service exists but schema not defined

4. **Dual-Loop Architecture**
   - Context-to-Truth Loop: Data ingestion → Spine → Context → Reasoning
   - Tool-to-Truth Loop: Actions → Validation → Spine update → Feedback
   - Status: ⚠️ Partially implemented, lacks explicit feedback loops

5. **pgvector Integration**
   - Purpose: Semantic search and embedding storage
   - Technology: Neon PostgreSQL with pgvector extension
   - Status: ❌ Not yet enabled

---

## 3. Multi-Tenancy Model

### Tenant Isolation

**Package:** `packages/tenancy/`

**Approach:** Row-Level Security (RLS) + tenant_id column

**Implementation:**
- All tables include `tenant_id` (TEXT, NOT NULL)
- Index on `tenant_id` for query performance
- Gateway resolves tenant from request context
- Services filter all queries by tenant_id

**Example:**
```sql
-- Every table follows this pattern
CREATE TABLE example_table (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  -- other fields...
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_example_tenant ON example_table(tenant_id);
```

**Tenant Resolution Flow:**
1. Request → Gateway
2. Gateway extracts tenant from auth token or subdomain
3. Gateway adds tenant_id to request context
4. Service receives tenant_id, filters all DB queries
5. Response returned with tenant isolation enforced

---

## 4. Schema Migration Strategy

### Current State

**Problem:** No centralized migration system

**Current Approach:**
- D1 migrations: Manual schema.sql files in service directories
- Neon migrations: Not yet formalized
- Version control: ❌ Missing

**Scattered Migrations:**
- `services/memory-consolidator/schema.sql` (D1)
- `services/loader/schema.sql` (D1)
- `packages/api/migrations/003_webhooks.sql` (D1)
- Neon schema: ❌ Not documented

### Recommended Migration Strategy

**Phase 1: Document Current Schema**
1. ✅ Document D1 schemas (this file)
2. ❌ Document Neon PostgreSQL schema (next priority)
3. ❌ Document Supabase schema
4. ❌ Create schema diagrams (ERD)

**Phase 2: Implement Migration System**
1. Add migration tool (e.g., `node-pg-migrate`, `knex`, or custom)
2. Create migration files for Neon PostgreSQL
3. Version all D1 schemas with migration numbers
4. Add CI/CD migration runner

**Phase 3: Establish Governance**
1. Migration naming convention: `{timestamp}_{description}.sql`
2. Require peer review for schema changes
3. Test migrations on staging before production
4. Document rollback procedures

---

## 5. Performance Considerations

### Current Optimizations

**Indexes:**
- ✅ All D1 tables have appropriate indexes
- ✅ Composite indexes on common query patterns (tenant + type + time)
- ⚠️ Neon indexes not yet documented

**Caching:**
- ⚠️ Hot Memory service exists but caching strategy not documented
- ❌ Edge caching not yet implemented (Cloudflare KV/R2)

**Query Patterns:**
- ✅ D1 views for common aggregations (`recent_topic_memories`, `account_health_snapshot`)
- ⚠️ Neon query patterns not documented

### Recommended Optimizations

1. **Add pgvector to Neon**
   - Enable pgvector extension: `CREATE EXTENSION vector;`
   - Add embedding columns to knowledge tables
   - Create HNSW indexes for fast similarity search

2. **Implement Edge Caching**
   - Use Cloudflare KV for hot data (recent entities, frequent queries)
   - Cache tenant configurations
   - Cache-aside pattern with TTL

3. **Database Connection Pooling**
   - Current: `@neondatabase/serverless` (built-in pooling)
   - Monitor connection counts
   - Tune pool size per service

4. **Partitioning Strategy (Future)**
   - Time-based partitioning for audit logs
   - Tenant-based sharding for large tenants

---

## 6. Data Retention & Archival

### Current State

**Retention Policies:** ❌ Not yet defined

**Proposed Retention:**

| Data Type | Retention | Archival Strategy |
|-----------|-----------|-------------------|
| **Spine Entities** | Indefinite | Soft delete + archive table |
| **Webhook Events** | 90 days | Move to Cloudflare R2 |
| **Consolidated Memories** | 2 years | Compress + R2 |
| **Audit Logs** | 7 years | Compressed R2 buckets |
| **Context Store** | 30 days | LRU eviction + archive |
| **Hot Memory** | 24 hours | TTL-based eviction |
| **DLQ Events** | 30 days | Manual review + delete |

**Implementation:**
- Cloudflare Workers Cron for periodic archival
- Cloudflare R2 for long-term storage
- Compression before archival (gzip)

---

## 7. Security & Compliance

### Current Security

**Authentication:**
- ✅ Supabase Auth for user authentication
- ✅ Row-Level Security (RLS) in Supabase
- ⚠️ Service-to-service auth not documented

**Webhook Security:**
- ✅ Signature verification per provider (HMAC-SHA256, OAuth2, verify-token)
- ✅ `webhook_events.signature_valid` tracking
- ✅ Rate limiting (Cloudflare Workers built-in)

**Data Encryption:**
- ✅ In-transit: TLS 1.3 (Cloudflare + Neon)
- ✅ At-rest: Neon PostgreSQL encryption
- ⚠️ Secret management: Wrangler secrets (rotate manually)

**Missing:**
- ❌ Audit logs for data access (who accessed what when)
- ❌ Field-level encryption for sensitive data
- ❌ Data masking for PII

### Compliance Gaps

**GDPR/CCPA Requirements:**
- ❌ Right to be forgotten (delete all tenant data)
- ❌ Data export (download all tenant data)
- ❌ Consent tracking
- ❌ Data processing records

**Recommendation:**
1. Implement `tenant_deletions` workflow
2. Add `data_export` API endpoint
3. Create compliance dashboard in L2 AuditUI
4. Document data processing activities (DPA)

---

## 8. Next Steps: Schema Definition

### Priority 1: Neon PostgreSQL Schema (Critical)

**Create Migration:** `migrations/001_spine_core.sql`

**Proposed Tables:**

```sql
-- Spine: Core SSOT entities
CREATE TABLE spine_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'contact', 'account', 'deal', 'task', etc.
  source_system TEXT NOT NULL, -- 'hubspot', 'salesforce', etc.
  source_id TEXT NOT NULL, -- Original ID from source system

  -- Core data (JSONB for flexibility)
  data JSONB NOT NULL,
  metadata JSONB, -- Tags, custom fields, etc.

  -- Vector embedding for semantic search (pgvector)
  embedding vector(1536), -- OpenAI ada-002 dimension

  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_updated_at TIMESTAMPTZ, -- Last updated in source system

  -- Soft delete
  deleted_at TIMESTAMPTZ,

  UNIQUE(tenant_id, source_system, source_id)
);

CREATE INDEX idx_spine_entities_tenant ON spine_entities(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_spine_entities_type ON spine_entities(entity_type);
CREATE INDEX idx_spine_entities_source ON spine_entities(source_system, source_id);
CREATE INDEX idx_spine_entities_embedding ON spine_entities USING hnsw (embedding vector_cosine_ops);

-- Spine: Relationships between entities
CREATE TABLE spine_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,

  source_entity_id UUID NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,
  target_entity_id UUID NOT NULL REFERENCES spine_entities(id) ON DELETE CASCADE,

  relationship_type TEXT NOT NULL, -- 'owns', 'works_for', 'related_to', etc.
  strength REAL DEFAULT 1.0 CHECK (strength >= 0 AND strength <= 1),

  metadata JSONB, -- Additional relationship data

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(tenant_id, source_entity_id, target_entity_id, relationship_type)
);

CREATE INDEX idx_spine_relationships_tenant ON spine_relationships(tenant_id);
CREATE INDEX idx_spine_relationships_source ON spine_relationships(source_entity_id);
CREATE INDEX idx_spine_relationships_target ON spine_relationships(target_entity_id);
CREATE INDEX idx_spine_relationships_type ON spine_relationships(relationship_type);

-- Context Store: AI reasoning context
CREATE TABLE context_store (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,

  context_type TEXT NOT NULL, -- 'session', 'task', 'goal', 'insight'
  parent_context_id UUID REFERENCES context_store(id),

  title TEXT,
  content JSONB NOT NULL,

  -- Vector embedding
  embedding vector(1536),

  -- Metadata
  relevance_score REAL,
  expires_at TIMESTAMPTZ, -- TTL for ephemeral contexts

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_context_store_tenant ON context_store(tenant_id);
CREATE INDEX idx_context_store_type ON context_store(context_type);
CREATE INDEX idx_context_store_parent ON context_store(parent_context_id);
CREATE INDEX idx_context_store_expires ON context_store(expires_at) WHERE expires_at IS NOT NULL;

-- Audit Log: Compliance tracking
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,

  actor_id TEXT NOT NULL, -- User or service that made the change
  actor_type TEXT NOT NULL, -- 'user', 'service', 'agent'

  action TEXT NOT NULL, -- 'create', 'read', 'update', 'delete'
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,

  before_state JSONB, -- State before change
  after_state JSONB, -- State after change

  metadata JSONB, -- Request context, IP, user agent, etc.

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id, created_at);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id, actor_type);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- AI Chats Store: MCP protocol session capture
CREATE TABLE ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,

  session_id TEXT NOT NULL,
  session_type TEXT NOT NULL, -- 'workspace', 'cognitive', 'agent'

  user_id TEXT,
  agent_id TEXT, -- If session is with an AI agent

  conversation JSONB NOT NULL, -- Full conversation history (MCP format)

  -- Session metadata
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  token_count INTEGER,

  -- Session outcome
  outcome TEXT, -- 'completed', 'abandoned', 'error'
  result JSONB, -- Final action/decision

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_sessions_tenant ON ai_chat_sessions(tenant_id, started_at);
CREATE INDEX idx_ai_chat_sessions_user ON ai_chat_sessions(user_id);
CREATE INDEX idx_ai_chat_sessions_agent ON ai_chat_sessions(agent_id) WHERE agent_id IS NOT NULL;
```

### Priority 2: Enable pgvector

**Steps:**
1. Connect to Neon PostgreSQL
2. Run: `CREATE EXTENSION IF NOT EXISTS vector;`
3. Add embedding columns to tables (see above)
4. Create HNSW indexes for fast similarity search
5. Update services to generate and query embeddings

### Priority 3: Document Current Schema

**Create ERD (Entity Relationship Diagram):**
- Use dbdiagram.io or similar tool
- Document all tables, relationships, indexes
- Include in this document

---

## Appendix: Schema Files Location

| Database | Schema File | Service |
|----------|-------------|---------|
| **D1 (Memory Consolidator)** | `services/memory-consolidator/schema.sql` | memory-consolidator |
| **D1 (Loader)** | `services/loader/schema.sql` | loader |
| **D1 (Hub Controller)** | `packages/api/migrations/003_webhooks.sql` | api |
| **Neon PostgreSQL** | ❌ Not yet documented | spine, cognitive-brain, think, act, knowledge, gateway |
| **Supabase** | Managed via Supabase dashboard | apps/web (auth) |

---

**Document Version:** 1.0
**Author:** IntegrateWise Engineering Team
**Next Review:** After Neon schema definition
