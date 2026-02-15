# Supabase Database Wiring Plan
## Figma Design → Real Database Integration

**Goal**: Wire the Figma Make components to use actual Supabase tables instead of mock data.

**Your Database**: `postgresql://postgres:[PASSWORD]@db.hrrbciljsqxnmuwwnrnt.supabase.co:5432/postgres`

---

## AI Chats via MCP - Detailed Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AI CHATS VIA MCP (FLOW 3)                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  STEP 1: AI Session Capture (Private Memory)                                │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────────────────────┐  │
│  │  Claude  │    │   MCP    │    │  MCP Connector Service               │  │
│  │ ChatGPT  │───►│ Protocol│───►│  • /tools - Discovery                │  │
│  │  Cursor  │    │         │    │  • /invoke - Session capture         │  │
│  └──────────┘    └──────────┘    └──────────────┬───────────────────────┘  │
│                                                  │                          │
│  STEP 2: Session Storage (Raw Private)           │                          │
│                                                  ▼                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  TOOL: kb.write_session_summary                                     │   │
│  │                                                                     │   │
│  │  Input: {                                                           │   │
│  │    tenant_id: "t1",                                                │   │
│  │    user_id: "u123",                                                │   │
│  │    provider: "claude",                                             │   │
│  │    session_id: "sess_abc",                                         │   │
│  │    summary_md: "# Discussion...",                                  │   │
│  │    topics: ["pricing", "renewal"]                                  │   │
│  │  }                                                                  │   │
│  │                                                                     │   │
│  │  Output: { artifact_id, gcs_uri, metadata_ref }                    │   │
│  └────────────────────┬────────────────────────────────────────────────┘   │
│                       │                                                     │
│                       ▼                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  STORES:                                                            │   │
│  │  • GCS - Raw session content (immutable)                           │   │
│  │  • Firestore - Metadata (searchable index)                         │   │
│  │  • ai_sessions table - Reference pointer                           │   │
│  └────────────────────┬────────────────────────────────────────────────┘   │
│                       │                                                     │
│  STEP 3: Triage Engine (Extract & Validate)          │                     │
│                       │                              │                     │
│                       ▼                              ▼                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  TRIAGE ENGINE (IQ Hub / Think Service)                             │   │
│  │                                                                     │   │
│  │  Extracts:                                                          │   │
│  │  • Facts: "Acme prefers annual billing"                            │   │
│  │  • Decisions: "Approved $10K expansion"                            │   │
│  │  • Risks: "Churn risk - pricing concern"                           │   │
│  │  • Action Items: "Send renewal proposal by Friday"                 │   │
│  │                                                                     │   │
│  │  Scoring: Confidence (0-100), Recency, Relevance                   │   │
│  └────────────────────┬────────────────────────────────────────────────┘   │
│                       │                                                     │
│  STEP 4: Validation Queue (Human-in-Loop)            │                     │
│                       │                              │                     │
│                       ▼                              ▼                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ai_memory_queue                                                    │   │
│  │                                                                     │   │
│  │  Pending → Reviewing → Approved/Rejected                           │   │
│  │                                                                     │   │
│  │  Human validates:                                                   │   │
│  │  ✓ "Yes, this is accurate" → PROMOTED to shared pool               │   │
│  │  ✗ "No, this is wrong" → REJECTED, not shared                      │   │
│  └────────────────────┬────────────────────────────────────────────────┘   │
│                       │                                                     │
│  STEP 5: Shared Memory Pool                          │                     │
│                       │                              │                     │
│                       ▼                              ▼                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ai_memory_items (PROMOTED)                                         │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ memory_type: "fact"                                         │   │   │
│  │  │ content: "Acme Corp prefers annual billing"                 │   │   │
│  │  │ confidence: 95                                              │   │   │
│  │  │ category: "billing"                                         │   │   │
│  │  │ linked_entity_id: "acc_123"  ◄── THE LINKAGE KEY           │   │   │
│  │  │ status: "promoted"                                          │   │   │
│  │  │ validated_by: "user_456"                                    │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  Now ALL AI agents can read this:                                  │   │
│  │  • Claude sees it in context                                       │   │
│  │  • ChatGPT sees it in RAG                                          │   │
│  │  • Internal AI uses it for recommendations                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### MCP Tools Available

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `kb.write_session_summary` | Capture AI chat session | session_id, provider, summary_md | artifact_id, gcs_uri |
| `kb.write_article` | Create KB article from session | title, content_md, topics | article_id |
| `kb.get_artifact` | Retrieve session/article | artifact_id | metadata, signed_url |
| `kb.list_recent` | List recent sessions | limit, topic, type | results[] |
| `kb.search` | Semantic search | q, topic, date range | results[] |
| `kb.topic_upsert` | Create topic policy | topic_name, cadence | topic_id |
| `kb.topic_list` | List topics | tenant_id | items[] |

### The MCP Protocol Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MCP PROTOCOL EXCHANGE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. TOOL DISCOVERY                                                          │
│                                                                              │
│  AI Agent ──GET /tools───────────────────────► MCP Connector               │
│     ▼                                          │                             │
│     │◄────JSON Schema (7 tools)───────────────┘                             │
│     │                                                                        │
│     │ {                                                                      │
│     │   "tools": [{                                                          │
│     │     "name": "kb.write_session_summary",                                │
│     │     "description": "Write session summary...",                          │
│     │     "input_schema": { ... },                                           │
│     │     "output_schema": { ... }                                           │
│     │   }]                                                                   │
│     │ }                                                                      │
│                                                                              │
│  2. TOOL INVOCATION                                                         │
│                                                                              │
│  AI Agent ──POST /invoke──────────────────────► MCP Connector               │
│     {                                          │                             │
│       "tool": "kb.write_session_summary",      │                             │
│       "input": {                               │                             │
│         "tenant_id": "t1",                     │                             │
│         "session_id": "sess_123",              │                             │
│         "summary_md": "# Discussion..."        │                             │
│       }                                        │                             │
│     }                                          │                             │
│     ▼                                          │                             │
│     │◄────{ artifact_id, gcs_uri }────────────┘                             │
│     │                                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Complete Schema Overview

| Phase | Tables | Purpose |
|-------|--------|---------|
| **Phase 1** | `spine_tenants`, `spine_memberships` | Multi-tenancy & auth |
| **Phase 1** | `spine_entities` | **SSOT** - Universal entity store (Truth) |
| **Phase 1** | `spine_readiness` | L2 completeness badges |
| **Phase 1** | `spine_provenance`, `spine_events` | Lineage & audit |
| **Phase 2** | `csm_accounts`, `csm_contacts`, etc. | CSM domain data |
| **Phase 3** | `knowledge_documents`, `knowledge_chunks` | **Context** - Unstructured data |
| **Phase 3** | `context_relations` | Graph edges (linkage) |
| **Phase 4** | `ai_sessions` | **AI Memory** - Raw chat sessions |
| **Phase 4** | `ai_memory_items` | Triaged shared memory |
| **Phase 4** | `ai_memory_queue` | Human validation queue |

### The Three Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DATA FLOWS (L0-L3) - SEPARATE ROUTES                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ROUTE A: TOOL DATA (Truth + Context) - COMBINED PIPELINE           │    │
│  │                                                                     │    │
│  │  Flow 1: STRUCTURED (SSOT)          Flow 2: UNSTRUCTURED (Context) │    │
│  │                                                                     │    │
│  │  HubSpot/Stripe ──┐                 Email/Slack/Notion ──┐         │    │
│  │       │            │                        │             │         │    │
│  │       └────────────┼────────────────────────┘             │         │    │
│  │                    ▼                                      │         │    │
│  │         ┌──────────────────┐                            │         │    │
│  │         │  8-Stage Loader  │                            │         │    │
│  │         │  + Normalizer    │                            │         │    │
│  │         └────────┬─────────┘                            │         │    │
│  │                  │                                      │         │    │
│  │         NA5: DUAL-WRITE (Linkage Handshake)            │         │    │
│  │                  │                                      │         │    │
│  │       ┌──────────┴──────────┐                          │         │    │
│  │       ▼                     ▼                          │         │    │
│  │  ┌─────────────┐    ┌─────────────┐                   │         │    │
│  │  │spine_entities│    │knowledge_   │                   │         │    │
│  │  │  (TRUTH)    │    │  documents  │                   │         │    │
│  │  │             │◄──►│  (CONTEXT)  │                   │         │    │
│  │  └──────┬──────┘    └──────┬──────┘                   │         │    │
│  │         │                  │                          │         │    │
│  │         └────────┬─────────┘                          │         │    │
│  │                  │                                    │         │    │
│  │       linked_entity_id (THE LINKAGE KEY)             │         │    │
│  │                  │                                    │         │    │
│  │                  ▼                                    │         │    │
│  │         ┌─────────────────┐                           │         │    │
│  │         │  entity_360 VIEW│◄── SSOT + Context only   │         │    │
│  │         │                 │    (No AI chats here)    │         │    │
│  │         └─────────────────┘                           │         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  ROUTE B: AI BRAINSTORMING (Ideas) - SEPARATE PIPELINE              │    │
│  │                                                                     │    │
│  │  Flow 3: AI MEMORY (via MCP)                                        │    │
│  │                                                                     │    │
│  │  Claude/ChatGPT ──► MCP Connector ──► ai_sessions                  │    │
│  │                                              │                      │    │
│  │                                              ▼                      │    │
│  │                                    ┌──────────────────┐            │    │
│  │                                    │  Triage Engine   │            │    │
│  │                                    │  (Extract ideas) │            │    │
│  │                                    └────────┬─────────┘            │    │
│  │                                             │                       │    │
│  │                                             ▼                       │    │
│  │                                    ┌──────────────────┐            │    │
│  │                                    │ ai_memory_queue  │            │    │
│  │                                    │ (Human validation)│            │    │
│  │                                    └────────┬─────────┘            │    │
│  │                                             │                       │    │
│  │                                             ▼                       │    │
│  │                                    ┌──────────────────┐            │    │
│  │                                    │ ai_memory_items  │            │    │
│  │                                    │  (IDEAS/INSIGHTS)│            │    │
│  │                                    │  NOT truth/context│            │    │
│  │                                    └────────┬─────────┘            │    │
│  │                                             │                       │    │
│  │                    linked_entity_id (OPTIONAL link)                 │    │
│  │                                             │                       │    │
│  │                                             ▼                       │    │
│  │                              ┌─────────────────────────┐           │    │
│  │                              │  Referenced in L2 when  │           │    │
│  │                              │  viewing entity - NOT   │           │    │
│  │                              │  part of entity_360     │           │    │
│  │                              └─────────────────────────┘           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  KEY DISTINCTION:                                                           │
│  • Route A = FACTS from tools (reliable, source-verified)                   │
│  • Route B = IDEAS from AI (brainstorming, needs validation)                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### How the Routes Converge

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONVERGENCE POINT                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ROUTE A (Facts)              ROUTE B (Ideas)                                │
│       │                            │                                         │
│       │     ┌──────────────────────┘                                         │
│       │     │                                                                │
│       ▼     ▼                                                                │
│  ┌─────────────────┐    ┌─────────────────┐                                  │
│  │  entity_360     │    │  ai_memory      │                                  │
│  │  VIEW           │    │  (separate)     │                                  │
│  │                 │    │                 │                                  │
│  │ • Spine data    │    │ • Brainstorming │                                  │
│  │ • Knowledge     │    │ • AI insights   │                                  │
│  │ • Provenance    │    │ • Ideas         │                                  │
│  └────────┬────────┘    └────────┬────────┘                                  │
│           │                      │                                           │
│           └──────────┬───────────┘                                           │
│                      │                                                       │
│                      ▼                                                       │
│           ┌─────────────────────┐                                            │
│           │   L2 INTELLIGENCE   │                                            │
│           │      DRAWER         │                                            │
│           │                     │                                            │
│           │  ┌───────────────┐  │                                            │
│           │  │ Evidence Tab  │  │◄── Shows entity_360 (facts)               │
│           │  └───────────────┘  │                                            │
│           │  ┌───────────────┐  │                                            │
│           │  │ Context Tab   │  │◄── Shows knowledge (facts)                │
│           │  └───────────────┘  │                                            │
│           │  ┌───────────────┐  │                                            │
│           │  │ AI Memory Tab │  │◄── Shows ai_memory_items (ideas)          │
│           │  │ (separate)    │  │    ONLY when explicitly opened            │
│           │  └───────────────┘  │                                            │
│           └─────────────────────┘                                            │
│                                                                              │
│  KEY: Facts (Route A) are always shown. Ideas (Route B) are opt-in.         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Current State Analysis

### Figma Design Architecture
```
Figma Components
    ↓
spine-client.tsx (SpineProvider)
    ↓
Supabase Edge Functions (make-server-e3b03387)
    ↓
KV Store (currently mock/edge functions)
```

### Main Repo Architecture
```
Frontend (Next.js)
    ↓
API Routes (/api/*)
    ↓
Services (Loader, Normalizer, Spine-v2)
    ↓
D1 (Spine) + Neon (Analytics) + Knowledge
```

### The Gap
**Figma expects**: Supabase Edge Functions + KV Store
**Main repo has**: Custom services + D1/Neon databases

---

## The Unified Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (L1)                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Figma Pages    │  │  Figma CSM      │  │  Figma Sales    │             │
│  │  (Personal)     │  │  (Account       │  │  (Pipeline)     │             │
│  │                 │  │   Success)      │  │                 │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                ▼                                            │
│                    ┌─────────────────────┐                                  │
│                    │  SpineProvider      │◄── React Context                 │
│                    │  (spine-client.tsx) │    (from Figma)                  │
│                    └────────┬────────────┘                                  │
└─────────────────────────────┼───────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API LAYER (Next.js Routes)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Route Proxy Layer                                                  │   │
│  │  /api/spine/* → Unified handler                                     │   │
│  │                                                                     │   │
│  │  /api/spine/initialize     → POST   Initialize tenant               │   │
│  │  /api/spine/projection/:dept → GET  Get department projection       │   │
│  │  /api/spine/readiness      → GET    Get readiness scores            │   │
│  │  /api/spine/entities/:type → GET    List entities                   │   │
│  │  /api/spine/entities/:type → POST   Create entity                   │   │
│  │  /api/spine/entities/:type → PUT    Update entity                   │   │
│  │                                                                     │   │
│  │  /api/csm/* → CSM Intelligence routes                               │   │
│  │  /api/domain/* → Universal domain routes                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SUPABASE (SSOT Database)                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SPINE (Truth) - Structured Data                                    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │spine_tenants│ │spine_entities│ │spine_readiness│ │spine_provenance│ │   │
│  │  │(multi-tenant)│ │(SSOT universal)│ │(completeness) │ │(source)      │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  CSM DOMAIN - Customer Success Data                                 │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │csm_accounts │ │csm_contacts │ │csm_success_ │ │csm_risks    │   │   │
│  │  │             │ │             │ │    plans    │ │             │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  KNOWLEDGE (Context) - Unstructured Data                            │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │   │
│  │  │knowledge_       │ │knowledge_chunks │ │context_relations│       │   │
│  │  │  documents      │ │ (for RAG)       │ │ (graph edges)   │       │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  AI MEMORY (Flow 3) - AI Chat Intelligence                          │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │   │
│  │  │   ai_sessions   │ │ ai_memory_items │ │ ai_memory_queue │       │   │
│  │  │  (raw chats)    │ │ (triaged pool)  │ │ (validation)    │       │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LINKAGE: All tables connect via entity_id → 360° Entity View       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Core SSOT Schema (Supabase)

### 1.1 Tenants & Organizations

```sql
-- Core tenant table
create table spine_tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  settings jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User memberships
CREATE TABLE spine_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES spine_tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member', -- admin, member, viewer
  department text, -- sales, cs, marketing, etc.
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);
```

### 1.2 Universal Entity Store (The Spine)

```sql
-- Universal entity table (SSOT for all objects)
create table spine_entities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  
  -- Entity classification
  entity_type text not null, -- contact, account, deal, ticket, etc.
  entity_subtype text, -- customer, prospect, partner, etc.
  
  -- Canonical fields (common across all entities)
  name text not null,
  description text,
  status text default 'active', -- active, inactive, archived
  
  -- Data payload (normalized)
  data jsonb not null default '{}',
  
  -- Metadata
  source_tool text, -- hubspot, stripe, slack, etc.
  source_id text, -- ID in source system
  
  -- Completeness scoring
  completeness_score integer default 0, -- 0-100
  completeness_fields jsonb default '{}', -- {field: score}
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  synced_at timestamptz, -- last sync from source
  
  -- Constraints
  constraint valid_completeness check (completeness_score between 0 and 100)
);

-- Indexes for performance
create index idx_entities_tenant on spine_entities(tenant_id);
create index idx_entities_type on spine_entities(entity_type);
create index idx_entities_tenant_type on spine_entities(tenant_id, entity_type);
create index idx_entities_source on spine_entities(source_tool, source_id);
create index idx_entities_status on spine_entities(tenant_id, status);
```

### 1.3 Readiness Scoring (for L2 badges)

```sql
-- Department/capability readiness scores
create table spine_readiness (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  
  -- Department classification
  department text not null, -- sales, cs, marketing, etc.
  capability text not null, -- pipeline, forecasting, health, etc.
  
  -- Readiness metrics (0-100)
  coverage integer default 0, -- % of expected data present
  completeness integer default 0, -- % of fields filled
  freshness integer default 0, -- recency of data
  confidence integer default 0, -- trust score
  score integer default 0, -- overall weighted score
  
  -- State machine
  state text default 'off', -- off, adding, seeded, live
  
  -- Metadata
  metadata jsonb default '{}',
  
  updated_at timestamptz default now(),
  
  unique(tenant_id, department, capability)
);

-- Index for fast lookups
create index idx_readiness_tenant on spine_readiness(tenant_id);
create index idx_readiness_dept on spine_readiness(tenant_id, department);
```

### 1.4 Provenance & Lineage

```sql
-- Data provenance (where did this come from?)
create table spine_provenance (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references spine_entities(id) on delete cascade,
  
  -- Source information
  source_tool text not null, -- hubspot, stripe, etc.
  source_tool_name text,
  source_record_id text not null,
  
  -- Sync metadata
  synced_at timestamptz default now(),
  confidence integer default 100, -- 0-100 match confidence
  
  -- Raw data reference
  raw_data_ref text, -- R2/blob storage reference
  
  created_at timestamptz default now()
);

create index idx_provenance_entity on spine_provenance(entity_id);
create index idx_provenance_source on spine_provenance(source_tool, source_record_id);
```

### 1.5 Events & Audit

```sql
-- Event log for real-time updates
create table spine_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  
  -- Event classification
  event_type text not null, -- ingestion_complete, entity_updated, etc.
  entity_type text,
  entity_id uuid references spine_entities(id),
  
  -- Payload
  payload jsonb not null default '{}',
  
  -- Processing state
  processed boolean default false,
  processed_at timestamptz,
  
  created_at timestamptz default now()
);

create index idx_events_tenant on spine_events(tenant_id, created_at desc);
create index idx_events_type on spine_events(tenant_id, event_type);
create index idx_events_unprocessed on spine_events(tenant_id, processed) where not processed;
```

---

## Phase 2: CSM Intelligence Schema

### 2.1 CSM Core Tables

```sql
-- Accounts (for CSM view)
create table csm_accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  spine_entity_id uuid references spine_entities(id),
  
  -- Account info
  name text not null,
  domain text,
  tier text, -- enterprise, mid-market, smb
  stage text, -- onboarding, adoption, renewal, expansion
  
  -- Health scoring
  health_score integer default 0, -- 0-100
  health_trend text, -- improving, stable, declining
  
  -- Financials
  arr numeric,
  mrr numeric,
  contract_end_date date,
  
  -- CSM assignment
  csm_id uuid references spine_entities(id), -- linked to contact
  
  -- Metadata
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contacts (for CSM view)
create table csm_contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  spine_entity_id uuid references spine_entities(id),
  account_id uuid references csm_accounts(id),
  
  -- Contact info
  name text not null,
  email text,
  phone text,
  title text,
  role text, -- champion, economic_buyer, user, etc.
  
  -- Engagement
  last_contact_date date,
  engagement_score integer default 0,
  
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Success Plans
create table csm_success_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  account_id uuid references csm_accounts(id),
  
  name text not null,
  status text default 'active', -- active, completed, at_risk
  objectives jsonb default '[]', -- array of objectives
  milestones jsonb default '[]', -- array of milestones
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Risks & Issues
create table csm_risks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  account_id uuid references csm_accounts(id),
  
  title text not null,
  description text,
  severity text, -- critical, high, medium, low
  status text default 'open', -- open, mitigated, closed
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tasks (CSM-specific)
create table csm_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  account_id uuid references csm_accounts(id),
  assigned_to uuid references spine_entities(id),
  
  title text not null,
  description text,
  status text default 'todo', -- todo, in_progress, done
  priority text default 'medium', -- low, medium, high, urgent
  due_date date,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## Phase 3: Knowledge & Context Schema (The Linkage Handshake)

### 3.1 Core Knowledge Store

```sql
-- Knowledge documents (unstructured context)
create table knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  
  -- Document classification
  doc_type text not null, -- email, slack, note, transcript, etc.
  source text, -- gmail, slack, notion, etc.
  
  -- Content
  title text,
  content text not null,
  content_vector vector(1536), -- For semantic search (pgvector)
  
  -- Metadata
  metadata jsonb default '{}', -- {channel, thread_ts, author, etc.}
  
  -- THE LINKAGE KEY - connects to Spine (Truth)
  linked_entity_id uuid references spine_entities(id),
  linked_entity_type text,
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  doc_date timestamptz -- When the document was originally created
);

-- Enable pgvector extension for embeddings
-- Run this in Supabase SQL Editor:
-- create extension if not exists vector;

-- Note: pgvector is pre-installed on Supabase. If not available:
-- 1. Go to Database → Extensions in Supabase Dashboard
-- 2. Search for "vector" and enable it
-- 3. Or use: ALTER SYSTEM SET shared_preload_libraries = 'vector';

create index idx_knowledge_tenant on knowledge_documents(tenant_id);
create index idx_knowledge_entity on knowledge_documents(linked_entity_id);
create index idx_knowledge_type on knowledge_documents(tenant_id, doc_type);

-- Knowledge chunks (for RAG/semantic search)
create table knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  document_id uuid references knowledge_documents(id) on delete cascade,
  
  -- Chunk content
  content text not null,
  content_vector vector(1536),
  
  -- Position in document
  chunk_index integer,
  
  -- Linkage
  linked_entity_id uuid references spine_entities(id),
  
  created_at timestamptz default now()
);

create index idx_chunks_document on knowledge_chunks(document_id);
create index idx_chunks_entity on knowledge_chunks(linked_entity_id);
```

### 3.2 Context Graph (Relations)

```sql
-- Context relations (graph edges between entities and knowledge)
create table context_relations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  
  -- Relation endpoints
  source_id uuid not null, -- Can be entity or knowledge doc
  source_type text not null, -- 'entity' | 'knowledge'
  
  target_id uuid not null,
  target_type text not null,
  
  -- Relation type
  relation_type text not null, -- mentioned_in, related_to, created_by, etc.
  confidence integer default 100, -- 0-100
  
  -- Evidence
  evidence text, -- Why this relation exists
  
  created_at timestamptz default now()
);

create index idx_relations_source on context_relations(source_id, source_type);
create index idx_relations_target on context_relations(target_id, target_type);
```

---

## Phase 4: AI Memory Schema (Flow 3 - AI Chats)

### 4.1 AI Session Storage (Private Raw)

```sql
-- AI chat sessions (raw private memory per AI)
create table ai_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  
  -- Session metadata
  session_id text not null unique, -- External session ID from AI tool
  ai_provider text not null, -- claude, chatgpt, cursor, etc.
  title text,
  
  -- Full conversation (immutable)
  messages jsonb not null default '[]', -- [{role, content, timestamp}]
  
  -- Statistics
  message_count integer default 0,
  token_count integer,
  
  -- State
  status text default 'active', -- active, archived, triaged
  
  -- Timestamps
  started_at timestamptz default now(),
  ended_at timestamptz,
  created_at timestamptz default now(),
  
  unique(tenant_id, user_id, session_id)
);

create index idx_ai_sessions_user on ai_sessions(tenant_id, user_id);
create index idx_ai_sessions_provider on ai_sessions(tenant_id, ai_provider);
create index idx_ai_sessions_status on ai_sessions(tenant_id, status) where status = 'active';
```

### 4.2 AI Memory Triage (Shared Pool)

```sql
-- Triaged memory items (extracted from AI sessions)
create table ai_memory_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  
  -- Source reference
  session_id uuid references ai_sessions(id),
  
  -- Memory classification
  memory_type text not null, -- fact, decision, risk, action_item, pattern
  category text, -- customer_comm, renewals, pricing, etc.
  
  -- Content
  content text not null, -- The extracted insight
  content_vector vector(1536),
  
  -- Confidence scoring
  confidence integer default 0, -- 0-100 extraction confidence
  validated boolean default false, -- Has this been human-validated?
  
  -- THE LINKAGE KEY
  linked_entity_id uuid references spine_entities(id),
  linked_entity_type text,
  
  -- Attribution
  extracted_by text, -- AI model that extracted this
  extracted_at timestamptz default now(),
  validated_by uuid references auth.users(id),
  validated_at timestamptz,
  
  -- State
  status text default 'pending', -- pending, promoted, rejected
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_memory_tenant on ai_memory_items(tenant_id);
create index idx_memory_session on ai_memory_items(session_id);
create index idx_memory_entity on ai_memory_items(linked_entity_id);
create index idx_memory_type on ai_memory_items(tenant_id, memory_type);
create index idx_memory_status on ai_memory_items(tenant_id, status);
create index idx_memory_category on ai_memory_items(tenant_id, category);
```

### 4.3 Memory Validation Queue

```sql
-- Triage queue for human validation
create table ai_memory_queue (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references spine_tenants(id) on delete cascade,
  memory_item_id uuid references ai_memory_items(id) on delete cascade,
  
  -- Queue metadata
  priority integer default 0, -- Higher = more urgent
  assigned_to uuid references auth.users(id),
  
  -- State
  status text default 'pending', -- pending, reviewing, approved, rejected
  reviewer_notes text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_queue_status on ai_memory_queue(tenant_id, status);
create index idx_queue_assigned on ai_memory_queue(assigned_to, status);
```

### 4.4 The Complete Linkage (360° Entity View)

```sql
-- Entity 360° view (TRUTH + CONTEXT only - NO AI memories)
-- AI memories are accessed separately via /api/ai/memory?entity_id=xxx
create or replace view entity_360 as
select 
  e.id as entity_id,
  e.tenant_id,
  e.entity_type,
  e.name,
  e.data as spine_data,
  e.completeness_score,
  
  -- Related knowledge (context from tools)
  (
    select json_agg(json_build_object(
      'id', k.id,
      'type', k.doc_type,
      'title', k.title,
      'excerpt', left(k.content, 200)
    ))
    from knowledge_documents k
    where k.linked_entity_id = e.id
  ) as related_knowledge,
  
  -- Provenance (source from tools)
  (
    select json_agg(json_build_object(
      'tool', p.source_tool,
      'external_id', p.source_record_id,
      'synced_at', p.synced_at
    ))
    from spine_provenance p
    where p.entity_id = e.id
  ) as sources

from spine_entities e
where e.status = 'active';

-- NOTE: AI memories (brainstorming/ideas) are NOT included in entity_360.
-- They are accessed separately via:
--   SELECT * FROM ai_memory_items 
--   WHERE linked_entity_id = ? AND status = 'promoted'
-- 
-- This keeps the core entity view focused on FACTS from tools (Truth + Context)
-- while AI ideas remain in a separate "brainstorming" space.
```

---

## Phase 5: API Routes (Next.js)

### 3.1 Create `/app/api/spine/route.ts`

```typescript
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/spine/projection/:department
export async function GET(
  request: NextRequest,
  { params }: { params: { department: string } }
) {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get tenant from user context
  const { data: membership } = await supabase
    .from('spine_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  const tenantId = membership?.tenant_id;
  const department = params.department;
  
  // Fetch projection based on department
  const { data: entities, error } = await supabase
    .from('spine_entities')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('entity_type', department)
    .order('updated_at', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Fetch readiness scores
  const { data: readiness } = await supabase
    .from('spine_readiness')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('department', department);
  
  return NextResponse.json({
    department,
    entities: entities || [],
    readiness: readiness || [],
    generated_at: new Date().toISOString()
  });
}
```

### 3.2 Create `/app/api/spine/initialize/route.ts`

```typescript
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/spine/initialize
export async function POST(request: NextRequest) {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const { connectedApps, userName, role } = body;
  
  // Create or get tenant
  // (In real app, you'd have tenant creation logic)
  const tenantId = 'default-tenant'; // Placeholder
  
  // Initialize readiness for all departments
  const departments = ['sales', 'cs', 'marketing', 'product', 'engineering'];
  const capabilities = ['pipeline', 'forecasting', 'health', 'tickets', 'tasks'];
  
  const readinessInserts = departments.flatMap(dept => 
    capabilities.map(cap => ({
      tenant_id: tenantId,
      department: dept,
      capability: cap,
      state: connectedApps.length > 0 ? 'adding' : 'off',
      score: 0
    }))
  );
  
  const { error } = await supabase
    .from('spine_readiness')
    .upsert(readinessInserts, {
      onConflict: 'tenant_id,department,capability'
    });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    success: true,
    tenantId,
    connectedApps,
    readiness: readinessInserts
  });
}
```

### 3.3 Create `/app/api/spine/readiness/route.ts`

```typescript
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/spine/readiness
export async function GET() {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data: membership } = await supabase
    .from('spine_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  const { data: readiness } = await supabase
    .from('spine_readiness')
    .select('*')
    .eq('tenant_id', membership?.tenant_id);
  
  // Group by department
  const grouped = (readiness || []).reduce((acc, r) => {
    if (!acc[r.department]) {
      acc[r.department] = {
        department: r.department,
        overallState: 'off',
        overallScore: 0,
        buckets: []
      };
    }
    acc[r.department].buckets.push(r);
    return acc;
  }, {});
  
  return NextResponse.json(grouped);
}
```

### 3.4 CSM Routes

```typescript
// /app/api/csm/accounts/route.ts
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data: membership } = await supabase
    .from('spine_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  const { data: accounts, error } = await supabase
    .from('csm_accounts')
    .select(`
      *,
      csm:csm_id(name, email),
      contacts:csm_contacts(id, name, email, role)
    `)
    .eq('tenant_id', membership?.tenant_id)
    .order('health_score', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    table: 'accounts',
    count: accounts?.length || 0,
    data: accounts || []
  });
}
```

### 3.5 Knowledge Routes

```typescript
// /app/api/knowledge/search/route.ts
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/knowledge/search
export async function POST(request: NextRequest) {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { query, entity_id, doc_type } = await request.json();
  
  const { data: membership } = await supabase
    .from('spine_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  // Full-text search on knowledge documents
  let dbQuery = supabase
    .from('knowledge_documents')
    .select('*')
    .eq('tenant_id', membership?.tenant_id)
    .textSearch('content', query);
  
  if (entity_id) {
    dbQuery = dbQuery.eq('linked_entity_id', entity_id);
  }
  
  if (doc_type) {
    dbQuery = dbQuery.eq('doc_type', doc_type);
  }
  
  const { data, error } = await dbQuery.limit(20);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({
    query,
    results: data || [],
    count: data?.length || 0
  });
}

// /app/api/knowledge/documents/route.ts
export async function GET() {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data: membership } = await supabase
    .from('spine_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  const { data, error } = await supabase
    .from('knowledge_documents')
    .select('*, linked_entity:linked_entity_id(name, entity_type)')
    .eq('tenant_id', membership?.tenant_id)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ documents: data || [] });
}
```

### 3.6 AI Memory Routes

```typescript
// /app/api/ai/sessions/route.ts
import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/ai/sessions
export async function GET() {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data: membership } = await supabase
    .from('spine_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  const { data, error } = await supabase
    .from('ai_sessions')
    .select('*')
    .eq('tenant_id', membership?.tenant_id)
    .eq('user_id', user.id)
    .order('started_at', { ascending: false });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ sessions: data || [] });
}

// POST /api/ai/sessions
export async function POST(request: NextRequest) {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { data: membership } = await supabase
    .from('spine_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  const body = await request.json();
  const { session_id, ai_provider, title, messages } = body;
  
  const { data, error } = await supabase
    .from('ai_sessions')
    .insert({
      tenant_id: membership?.tenant_id,
      user_id: user.id,
      session_id,
      ai_provider,
      title,
      messages,
      message_count: messages?.length || 0
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ session: data });
}

// /app/api/ai/memory/route.ts
// GET /api/ai/memory - Get triaged memory items
export async function GET(request: NextRequest) {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const entity_id = searchParams.get('entity_id');
  const status = searchParams.get('status') || 'promoted';
  
  const { data: membership } = await supabase
    .from('spine_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  let query = supabase
    .from('ai_memory_items')
    .select('*, session:session_id(ai_provider)')
    .eq('tenant_id', membership?.tenant_id)
    .eq('status', status);
  
  if (entity_id) {
    query = query.eq('linked_entity_id', entity_id);
  }
  
  const { data, error } = await query
    .order('confidence', { ascending: false })
    .limit(50);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ memories: data || [] });
}

// /app/api/ai/triage/route.ts
// POST /api/ai/triage - Submit memory for validation
export async function POST(request: NextRequest) {
  const supabase = await createRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const body = await request.json();
  const { session_id, items } = body;
  
  const { data: membership } = await supabase
    .from('spine_memberships')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
  
  // Insert memory items
  const memoryInserts = items.map((item: any) => ({
    tenant_id: membership?.tenant_id,
    session_id,
    memory_type: item.type,
    category: item.category,
    content: item.content,
    confidence: item.confidence,
    linked_entity_id: item.entity_id,
    linked_entity_type: item.entity_type,
    extracted_by: item.ai_provider,
    status: 'pending'
  }));
  
  const { data, error } = await supabase
    .from('ai_memory_items')
    .insert(memoryInserts)
    .select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Add to validation queue
  const queueInserts = data?.map((item: any) => ({
    tenant_id: membership?.tenant_id,
    memory_item_id: item.id,
    priority: item.confidence > 80 ? 1 : 0
  }));
  
  await supabase.from('ai_memory_queue').insert(queueInserts);
  
  return NextResponse.json({ 
    submitted: data?.length || 0,
    items: data 
  });
}
```

---

## Phase 6: Adapter Layer (Figma → Real API)

### 6.1 Create `/lib/spine/adapter.ts`

This adapter bridges the Figma spine-client to the real API:

```typescript
"""
Spine Adapter

Bridges Figma spine-client.tsx to real Supabase backend.
Replaces the edge function calls with Next.js API routes.
"""

const API_BASE = '/api'; // Local Next.js API

// Override the fetch calls in spine-client.tsx
export const adapter = {
  // Replace: fetch(`${API_BASE}/spine/initialize`)
  async initialize(params: { connectedApps: string[]; userName: string; role: string }) {
    const res = await fetch(`${API_BASE}/spine/initialize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Failed to initialize');
    return res.json();
  },

  // Replace: fetch(`${API_BASE}/spine/projection/${department}`)
  async fetchProjection(department: string) {
    const res = await fetch(`${API_BASE}/spine/projection/${department}`);
    if (!res.ok) throw new Error('Failed to fetch projection');
    return res.json();
  },

  // Replace: fetch(`${API_BASE}/spine/readiness`)
  async fetchReadiness() {
    const res = await fetch(`${API_BASE}/spine/readiness`);
    if (!res.ok) throw new Error('Failed to fetch readiness');
    return res.json();
  },

  // Replace: fetch(`${API_BASE}/spine/entities/${type}`)
  async fetchEntities(type: string) {
    const res = await fetch(`${API_BASE}/spine/entities/${type}`);
    if (!res.ok) throw new Error('Failed to fetch entities');
    return res.json();
  },

  // CSM APIs
  async fetchCSMTable(table: string) {
    const res = await fetch(`${API_BASE}/csm/${table}`);
    if (!res.ok) throw new Error(`Failed to fetch ${table}`);
    return res.json();
  },

  // Knowledge APIs
  async searchKnowledge(query: string, entityId?: string) {
    const res = await fetch(`${API_BASE}/knowledge/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, entity_id: entityId })
    });
    if (!res.ok) throw new Error('Failed to search knowledge');
    return res.json();
  },

  async fetchKnowledgeDocuments() {
    const res = await fetch(`${API_BASE}/knowledge/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  // AI Memory APIs
  async fetchAISessions() {
    const res = await fetch(`${API_BASE}/ai/sessions`);
    if (!res.ok) throw new Error('Failed to fetch AI sessions');
    return res.json();
  },

  async createAISession(session: any) {
    const res = await fetch(`${API_BASE}/ai/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  },

  async fetchAIMemory(entityId?: string) {
    const url = entityId 
      ? `${API_BASE}/ai/memory?entity_id=${entityId}`
      : `${API_BASE}/ai/memory`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch AI memory');
    return res.json();
  },

  async triageMemory(sessionId: string, items: any[]) {
    const res = await fetch(`${API_BASE}/ai/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, items })
    });
    if (!res.ok) throw new Error('Failed to triage memory');
    return res.json();
  }
};
```

### 6.2 Modified spine-client.tsx (for real API)

```typescript
// Replace the API_BASE and headers with adapter calls

// BEFORE (Figma):
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-e3b03387`;
const headers = { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` };

// AFTER (Real API):
import { adapter } from './adapter';

// In initializeSpine:
// BEFORE:
// const res = await fetch(`${API_BASE}/spine/initialize`, { method: "POST", headers, body: JSON.stringify(params) });
// AFTER:
// const result = await adapter.initialize(params);
```

---

## Phase 7: Wiring Checklist

### Week 1: Database Schema
- [ ] Run SQL migrations in Supabase
- [ ] Set up RLS policies for multi-tenancy
- [ ] Create seed data for testing
- [ ] Verify indexes are working

### Week 2: API Routes
- [ ] Create `/api/spine/*` routes
- [ ] Create `/api/csm/*` routes
- [ ] Create `/api/knowledge/*` routes (search, documents)
- [ ] Create `/api/ai/*` routes (sessions, memory, triage)
- [ ] Add authentication middleware
- [ ] Test with real Supabase client

### Week 3: Adapter Layer
- [ ] Create adapter.ts
- [ ] Modify spine-client.tsx to use adapter
- [ ] Test Figma components with real data
- [ ] Fix any data format mismatches

### Week 4: Integration
- [ ] Wire Figma CSM views to real API
- [ ] Wire Figma Sales views to real API
- [ ] Wire Figma Personal views to real API
- [ ] End-to-end testing

---

## Key Decisions

### 1. Use Supabase as SSOT (not KV store)
- **Why**: Real-time subscriptions, RLS, relational queries
- **Trade-off**: More complex than KV, but more powerful

### 2. Keep spine_entities as universal table
- **Why**: Single query pattern for all entity types
- **Trade-off**: Less type-safe, more flexible

### 3. Separate domain tables (csm_accounts, etc.)
- **Why**: Type-safe, domain-specific queries
- **Trade-off**: Need to sync with spine_entities

### 4. Use Next.js API routes (not Edge Functions)
- **Why**: Simpler deployment, same codebase
- **Trade-off**: Slightly higher latency than Edge Functions

---

## The Complete Linkage Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE DUAL-WRITE LINKAGE HANDSHAKE (NA5)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  When data enters via Loader/Normalizer:                                     │
│                                                                              │
│  ┌─────────────────┐                                                         │
│  │  Raw Webhook    │                                                         │
│  │  (Stripe/HubSpot│                                                         │
│  │   /Slack)       │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                         │
│  │  8-Stage Loader │                                                         │
│  │  (Fingerprint,  │                                                         │
│  │   Classify,     │                                                         │
│  │   Normalize)    │                                                         │
│  └────────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐    ┌──────────────────────────────────────────┐       │
│  │  NA5: DUAL WRITE│───►│  1. SPINE (Truth)                        │       │
│  │  Linkage        │    │     spine_entities                       │       │
│  │  Handshake      │    │     Structured, canonical                │       │
│  │                 │    │     Completeness scored                  │       │
│  │  entity_id =    │    └──────────────────────────────────────────┘       │
│  │  THE LINK       │                          │                             │
│  │                 │    ┌─────────────────────┴─────────────────────┐       │
│  │  Same ID used   │    ▼                                           ▼       │
│  │  in both writes │  ┌──────────────────┐    ┌──────────────────┐         │
│  └─────────────────┘  │ 2. KNOWLEDGE     │    │ 3. AI MEMORY     │         │
│                       │    (Context)     │    │   (Intelligence) │         │
│                       │                  │    │                  │         │
│                       │ knowledge_docs   │    │ ai_memory_items  │         │
│                       │ (emails, docs)   │    │ (extracted facts)│         │
│                       │                  │    │                  │         │
│                       │ linked_entity_id │    │ linked_entity_id │         │
│                       │ ────────────────►│    │ ────────────────►│         │
│                       │    entity_id     │    │    entity_id     │         │
│                       └──────────────────┘    └──────────────────┘         │
│                                                                              │
│  Result: Query any entity → Get:                                           │
│    ✓ Structured data (Spine)                                               │
│    ✓ Unstructured context (Knowledge)                                      │
│    ✓ AI-extracted insights (Memory)                                        │
│    ✓ Source provenance                                                     │
│                                                                              │
│  "Customer ABC has:                                                        │
│    - $50K ARR (Spine)                                                      │
│    - 3 open support tickets (Spine)                                        │
│    - Mentioned pricing concerns in Slack (Knowledge)                       │
│    - AI flagged as churn risk from chat (Memory)"                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 6: Execution & Learning Loop (L2 Cognitive Layer)

Beyond data storage, we have the **action layer**: Bridge → Act → Adjust → Govern → Repeat

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COGNITIVE LOOP: THINK → ACT → ADJUST                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  L2 INTELLIGENCE SURFACES (The 14 Panels)                                   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  DATA LAYER (Input)                                                  │   │
│  │  • spine_entities (Truth)           • knowledge_documents (Context) │   │
│  │  • ai_memory_items (Ideas)          • signals (Real-time alerts)    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  THINK LAYER (Analysis)                                              │   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │   │
│  │  │ Evidence    │  │ Context     │  │ Think       │  │ Knowledge  │ │   │
│  │  │ Panel       │  │ Panel       │  │ Panel       │  │ Panel      │ │   │
│  │  │             │  │             │  │             │  │            │ │   │
│  │  │ "What do    │  │ "What is    │  │ "What       │  │ "What does │ │   │
│  │  │ we know?"   │  │ related?"   │  │ should we   │  │ history    │ │   │
│  │  │             │  │             │  │ do?"        │  │ tell us?"  │ │   │
│  │  └─────────────┘  └─────────────┘  └──────┬──────┘  └────────────┘ │   │
│  │                                           │                        │   │
│  │                                           ▼                        │   │
│  │  ┌─────────────────────────────────────────────────────────────┐  │   │
│  │  │  DECISION ENGINE                                            │  │   │
│  │  │  • Pattern detection (anomalies, trends)                   │  │   │
│  │  │  • Risk scoring (health, churn, opportunity)               │  │   │
│  │  │  • Recommendation generation (next best action)            │  │   │
│  │  └──────────────────────────────┬──────────────────────────────┘  │   │
│  └─────────────────────────────────┼───────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  BRIDGE LAYER (Human Review)                                         │   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │ Bridge      │  │ Situations  │  │ Predictions │                  │   │
│  │  │ Panel       │  │ Panel       │  │ Panel       │                  │   │
│  │  │             │  │             │  │             │                  │   │
│  │  │ "Review     │  │ "Active     │  │ "What will  │                  │   │
│  │  │ proposals"  │  │ situations" │  │ happen?"    │                  │   │
│  │  │             │  │             │  │             │                  │   │
│  │  │ Human-in-   │  │ Track       │  │ Forecast    │                  │   │
│  │  │ loop gate   │  │ progress    │  │ models      │                  │   │
│  │  └──────┬──────┘  └─────────────┘  └─────────────┘                  │   │
│  │         │                                                           │   │
│  │         ▼                                                           │   │
│  │  APPROVAL REQUIRED ──► Yes ──► Proceed to ACT                       │   │
│  │         │                                                           │   │
│  │         └───────────► No ───► Discard / Revise                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ACT LAYER (Execution)                                               │   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │ Act Panel   │  │ Agent       │  │ Workflows   │                  │   │
│  │  │             │  │ Panel       │  │ Panel       │                  │   │
│  │  │ "Execute    │  │ "Agent      │  │ "Run        │                  │   │
│  │  │ actions"    │  │ colony"     │  │ playbooks"  │                  │   │
│  │  │             │  │             │  │             │                  │   │
│  │  │ • Send email│  │ • Auto-reply│  │ • Onboard   │                  │   │
│  │  │ • Update CRM│  │ • Data sync │  │ • Escalate  │                  │   │
│  │  │ • Create    │  │ • Research  │  │ • Notify    │                  │   │
│  │  │   task      │  │ • Enrich    │  │ • Report    │                  │   │
│  │  └──────┬──────┘  └─────────────┘  └─────────────┘                  │   │
│  │         │                                                           │   │
│  │         ▼                                                           │   │
│  │  EXECUTE via Connectors (HubSpot, Stripe, Slack, etc.)              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ADJUST LAYER (Learning)                                             │   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │   │
│  │  │ Adjust      │  │ Drift       │  │ Correct/    │                  │   │
│  │  │ Panel       │  │ Panel       │  │ Redo Panel  │                  │   │
│  │  │             │  │             │  │             │                  │   │
│  │  │ "Did it     │  │ "Is reality │  │ "Fix        │                  │   │
│  │  │ work?"      │  │  changing?" │  │  mistakes"  │                  │   │
│  │  │             │  │             │  │             │                  │   │
│  │  │ Measure     │  │ Detect      │  │ Manual      │                  │   │
│  │  │ Outcomes    │  │ Deviation   │  │ Override    │                  │   │
│  │  └──────┬──────┘  └─────────────┘  └─────────────┘                  │   │
│  │         │                                                           │   │
│  │         └──────────────────┬────────────────────────────────────────┘   │
│  │                            │                                             │
│  │                            ▼                                             │
│  │              FEEDBACK LOOP ──► Update models, rules, weights             │
│  │                            │                                             │
│  └────────────────────────────┼────────────────────────────────────────────┘
│                               │                                              │
│                               ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  GOVERN LAYER (Control)                                              │    │
│  │                                                                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │    │
│  │  │ Govern      │  │ Audit       │  │ Policy      │                  │    │
│  │  │ Panel       │  │ Panel       │  │ Panel       │                  │    │
│  │  │             │  │             │  │             │                  │    │
│  │  │ "Who can    │  │ "What       │  │ "What are   │                  │    │
│  │  │  do what?"  │  │  happened?" │  │  the rules?"│                  │    │
│  │  │             │  │             │  │             │                  │    │
│  │  │ RBAC        │  │ Audit logs  │  │ Constraints │                  │    │
│  │  │ Compliance  │  │ Traceability│  │ Guardrails  │                  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  THE LOOP: THINK → BRIDGE (approve) → ACT → ADJUST → GOVERN → REPEAT       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 7: Agent Colony (Specialized AI Workers)

The Agent Panel in L2 contains multiple specialized agents:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENT COLONY ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  AGENT TYPES                                                                 │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ REACTIVE AGENTS │  │ PROACTIVE AGENTS│  │ SPECIALIST      │              │
│  │ (Event-driven)  │  │ (Always-on)     │  │ AGENTS          │              │
│  │                 │  │                 │  │                 │              │
│  │ • Auto-Reply    │  │ • Drift Monitor │  │ • Researcher    │              │
│  │   Agent         │  │   Agent         │  │ • Data Enricher │              │
│  │                 │  │                 │  │ • Content Gen   │              │
│  │ • Data Sync     │  │ • Health Score  │  │ • Anomaly Det.  │              │
│  │   Agent         │  │   Agent         │  │ • Forecaster    │              │
│  │                 │  │                 │  │                 │              │
│  │ • Alert Router  │  │ • Opportunity   │  │ • Compliance    │              │
│  │                 │  │   Scout         │  │   Checker       │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                              │
│  AGENT LIFECYCLE                                                             │
│                                                                              │
│  Trigger ──► Analyze ──► Decide ──► Act ──► Report ──► Learn                │
│     │           │          │        │        │         │                     │
│     │           │          │        │        │         └─► Update weights    │
│     │           │          │        │        └────► Log to audit             │
│     │           │          │        └─────────────► Execute via MCP          │
│     │           │          └───────────────────────► Get approval (if needed)│
│     │           └──────────────────────────────────► Query entity_360         │
│     └──────────────────────────────────────────────► Webhook / Signal / Cron  │
│                                                                              │
│  EXAMPLE: Auto-Reply Agent                                                   │
│                                                                              │
│  1. TRIGGER: New Slack mention about "billing issue"                         │
│  2. ANALYZE: Query entity_360 → Find account "Acme Corp"                     │
│              Query ai_memory → Find "prefers email"                         │
│  3. DECIDE: Route to CSM, draft response, flag as urgent                     │
│  4. ACT: Post in CSM channel, create ticket, notify CSM                      │
│  5. REPORT: Log action, confidence, outcome                                  │
│  6. LEARN: If CSM says "wrong priority", adjust urgency scoring              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Complete Data Flow Summary

```
INGESTION                    STORAGE                    COGNITION                 EXECUTION
────────────────────────────────────────────────────────────────────────────────────────────────

Route A (Facts)                                                                      
HubSpot/Stripe  ──►  spine_entities ────────┐                                       
Slack/Email     ──►  knowledge_docs ────────┼──► entity_360 ──► THINK ──► BRIDGE   
                                            │        │                (Approve)     
Route B (Ideas)                             │        │                      │        
Claude/ChatGPT  ──►  ai_memory_items ───────┘        │                      ▼        
                                                     │                   ┌──────┐    
                                                     │              Yes ─► ACT  │────► HubSpot
                                                     │                   │      │    
                                                     └───────────────────┤Adjust│◄───┘
                                                                        └──────┘
                                                                             │
                                                                             ▼
                                                                        GOVERN
                                                                        (Audit)
```

---

## Next Steps

1. **Run the SQL migrations** in your Supabase project
2. **Create the API routes** in the Next.js app
3. **Create the adapter layer** to bridge Figma components
4. **Test end-to-end** with a single domain (e.g., CSM)

**Ready to start with Phase 1 (SQL schema)?**
