# Normalizer & Loader Engine Analysis

**Date**: 2026-02-10  
**Purpose**: Deep dive into the core data processing engines that power IntegrateWise

---

## Executive Summary

The **Normalizer** and **Loader** services are the **data intelligence backbone** of IntegrateWise. They're not just ETL pipelines — they're **context-aware, AI-integrated data transformation engines** that turn raw chaos into structured truth.

This is a **massive differentiator** that competitors don't have.

---

## The Loader Service: Universal Ingestion Engine

### Location
`services/loader/` — Cloudflare Worker-based ingestion pipeline

### What It Does

```
┌────────────────────────────────────────────────────────────────────┐
│                    LOADER: 8-STAGE PIPELINE                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Raw Webhook/Event                                                  │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────┐    ST1: Analyzer      → Detect entity type & stream   │
│  │ STAGE 1 │         (Source: Stripe webhook → Entity: payment)    │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    ST2: Classifier    → Entity vs Activity detection  │
│  │ STAGE 2 │         (Is this a new customer or just an event?)    │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    ST3: Filter        → PII scrubbing & noise removal │
│  │ STAGE 3 │         (Remove sensitive data, internal fields)      │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    ST4: Refiner       → Deduplication & delta check   │
│  │ STAGE 4 │         (Have we seen this before? What's changed?)   │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    ST5: Extractor     → Schema extraction             │
│  │ STAGE 5 │         (Raw JSON → Structured keys)                  │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    ST6: Validator     → Structural validation         │
│  │ STAGE 6 │         (Does this match expected schema?)            │
│  └────┬────┘                                                        │
│  ┌─────────┐    ST7: Sanity        → Business logic validation     │
│  │ STAGE 7 │         (Amount > 0? Date in past? etc.)              │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    ST8: Sectorizer    → Tenant isolation              │
│  │ STAGE 8 │         (Route to correct tenant's data partition)    │
│  └────┬────┘                                                        │
│       │                                                             │
│       ▼                                                             │
│  Normalized Data → Normalizer Service → Spine Storage              │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Key Capabilities

| Feature | Description | Why It Matters |
|---------|-------------|----------------|
| **Source Mapping** | Auto-detects 8+ sources (Stripe, HubSpot, Slack, Webflow, Notion, Discord, Asana, GitHub) | No manual configuration needed |
| **Entity Resolution** | Maps events to canonical entities (`stripe:invoice.payment_failed` → `invoice`) | Consistent data model |
| **Large Data Offload** | R2 storage for payloads >100KB | Handles massive webhooks |
| **Batch Processing** | Process multiple items in parallel | High throughput |
| **Telemetry** | Built-in metrics and health checks | Production observability |
| **MCP Integration** | SSE-based MCP server for AI tool discovery | **AI-Native** |

### Handlers (15+ Integration Types)

```typescript
// Located in src/handlers/
- ai-relay.ts      // AI completion events from AI-Relay Gateway
- api.ts           // Generic API ingestion
- cron.ts          // Scheduled job triggers
- discord.ts       // Discord webhooks
- enhanced-stripe.ts // Enhanced Stripe processing
- hubspot.ts       // HubSpot CRM webhooks
- integrations.ts  // Generic integration handler
- loaders.ts       // Custom loader endpoints
- mcp.ts           // MCP SSE server for AI tools
- nettools.ts      // Network diagnostics
- notion.ts        // Notion webhooks
- slack.ts         // Slack events
- stripe.ts        // Standard Stripe webhooks
- telemetry.ts     // Metrics and health
- tools.ts         // Tool registry
- webflow.ts       // Webflow form submissions
- webform.ts       // Generic web forms
```

### AI-Specific Features

#### 1. AI-Relay Handler
```typescript
// services/loader/src/handlers/ai-relay.ts

// Receives AI completion events from AI-Relay Gateway
POST /webhooks/ai-relay

// Features:
- HMAC-SHA256 signature verification (timing-safe)
- Replay attack protection (5-min window)
- Normalizes to SPINE event format
- Forwards to core engine for processing
```

#### 2. MCP (Model Context Protocol) Server
```typescript
// services/loader/src/handlers/mcp.ts

// SSE-based MCP server for AI tool discovery
GET /mcp/connect     → SSE stream for MCP
POST /mcp/messages   → MCP message handling

// What it enables:
- Claude/ChatGPT can discover loader capabilities
- AI agents can trigger webhooks via MCP
- Universal AI integration
```

#### 3. AI Session Sync Job
```typescript
// services/loader/src/jobs/ai-session-sync.ts

// Syncs AI conversation sessions from Firestore → D1
POST /jobs/sync-ai-sessions

// Syncs:
- AI session summaries
- Memory records
- Confidence scores
- Entity relationships
```

---

## The Normalizer Service: Truth Transformation Engine

### Location
`services/normalizer/` — Cloudflare Worker-based normalization service

### What It Does

```
┌────────────────────────────────────────────────────────────────────┐
│                 NORMALIZER: NA0-NA5 ACCELERATOR                     │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Pre-processed Data from Loader                                     │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────┐    NA0: Schema Detector                               │
│  │ STAGE   │         Map tool schema → SSOT entity type            │
│  │  NA0    │         e.g., hubspot.contact → contact               │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    NA1: Canonical Transformer                         │
│  │ STAGE   │         Field mapping: tool_field → canonical_field   │
│  │  NA1    │         e.g., hs_contact_id → external_id             │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    NA2: SSOT Binder                                   │
│  │ STAGE   │         Generate stable UUID, deduplication key       │
│  │  NA2    │         Ensures idempotent processing                  │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    NA3: Lineage Manager                               │
│  │ STAGE   │         Capture provenance & correlation IDs          │
│  │  NA3    │         _lineage: {source, external_id, sync_at}      │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    NA4: Relation Binder                                │
│  │ STAGE   │         Map tool relationships → canonical edges      │
│  │  NA4    │         e.g., hubspot_company_id → account_id         │
│  └────┬────┘                                                        │
│       ▼                                                             │
│  ┌─────────┐    NA5: Spine Publisher                                │
│  │ STAGE   │         DUAL WRITE:                                   │
│  │  NA5    │         1. Structured → Spine Service (Truth)         │
│  └────┬────┘         2. Unstructured → Knowledge Service (Context)  │
│       │                    ↑                                        │
│       │                    └────── THE LINKAGE HANDSHAKE           │
│       │                                                             │
│       ▼                                                             │
│  Canonical Record with _normalized metadata                         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Key Capabilities

| Feature | Description | Why It Matters |
|---------|-------------|----------------|
| **Schema Validation** | JSON Schema validation for 6+ entity types | Data quality guarantee |
| **Trust Scoring** | Source-based trust metrics (80-100 score) | Data reliability indicator |
| **Idempotency** | Deduplication via D1 + deterministic keys | No duplicate records |
| **Version Management** | Automatic versioning per dedup key | Change tracking |
| **DLQ Handling** | Dead letter queue for failed records | Never lose data |
| **Dual Write** | Truth (Spine) + Context (Knowledge) simultaneously | Complete data picture |

### The Linkage Handshake (NA5)

This is the **crown jewel** of the Normalizer:

```typescript
// NA5: Spine Publisher
async function stageNA5_SpinePublisher(data: any, ctx: NormalizerContext) {
  // PARALLEL WRITE to two systems:
  
  // 1. STRUCTURED DATA (The Truth)
  const spinePromise = fetch(`${spineUrl}/v1/spine/${ctx.entity_type}`, {
    method: 'POST',
    headers: {
      'x-tenant-id': ctx.tenant_id,
      'x-spine-context-category': ctx.category || 'business',
      'x-spine-context-user-id': ctx.user_id || '',
      'x-spine-context-account-id': ctx.account_id || '',
    },
    body: JSON.stringify({
      id: data.id,
      category: data.category || ctx.category || 'business',
      scope: finalScope,  // owner_id, account_id, team_id
      data: data,         // The canonical fields
      relationships: data.relationships || {}
    })
  });

  // 2. UNSTRUCTURED DATA (The Context)
  const contextPromise = fetch(`${knowledgeUrl}/knowledge/ingest`, {
    method: 'POST',
    headers: {
      'x-tenant-id': ctx.tenant_id,
    },
    body: JSON.stringify({
      tenant_id: ctx.tenant_id,
      entity_type: ctx.entity_type,
      entity_id: data.id,  // ← THE LINKAGE KEY
      source_type: 'api',
      source_name: ctx.source,
      content: JSON.stringify({
        original_payload: data._raw || {},
        extracted_graph: data._graph || {},
        lineage: data._lineage
      })
    })
  });

  // Both succeed or both fail (eventual consistency)
  await Promise.all([spinePromise, contextPromise]);
}
```

**The Linkage Key** (`entity_id`) connects:
- **Spine (Truth)**: Structured, queryable, relational data
- **Knowledge (Context)**: Unstructured, semantic, searchable content

This enables queries like: *"Find all customers with churn risk (Spine) who mentioned billing issues in Slack (Knowledge)"*

---

## The Differentiator: Why This Matters

### Competitor Comparison

| Feature | Zapier | Make | n8n | **IntegrateWise** |
|---------|--------|------|-----|-------------------|
| Webhook ingestion | ✅ Basic | ✅ Basic | ✅ Basic | **✅ 8-stage pipeline** |
| Schema validation | ❌ No | ❌ No | ❌ No | **✅ Built-in** |
| Trust scoring | ❌ No | ❌ No | ❌ No | **✅ Source-based** |
| Idempotency | ❌ No | ❌ No | ❌ No | **✅ D1-based dedup** |
| Dual write (structured + unstructured) | ❌ No | ❌ No | ❌ No | **✅ Truth + Context** |
| AI session capture | ❌ No | ❌ No | ❌ No | **✅ AI-Relay handler** |
| MCP server integration | ❌ No | ❌ No | ❌ No | **✅ SSE-based** |
| Context preservation | ❌ No | ❌ No | ❌ No | **✅ Lineage tracking** |

### The "IntegrateWise" Advantage

```
Traditional Integration:
Stripe ──► Zapier ──► HubSpot
  "Move data from A to B"

IntegrateWise Integration:
Stripe ──► Loader (8 stages) ──► Normalizer (NA0-NA5) ──► Spine + Knowledge
  "Understand, validate, link, and preserve context"
```

### Real-World Impact

**Scenario: Customer Churn Prediction**

| Without IntegrateWise | With IntegrateWise |
|-----------------------|-------------------|
| Payment failed in Stripe | Payment failed → **Trust score drops** |
| (Manual check needed) | Auto-links to HubSpot record via **SSOT Binder** |
| Check HubSpot separately | Discovers **relationship pattern**: Payment fail + No login + Support ticket |
| Check Slack separately | **Knowledge search**: Finds Slack thread about billing confusion |
| Check support tickets | **Composite churn score**: 87% risk |
| Guess at risk level | **Suggested action**: Personal outreach from CSM |

---

## Architecture Integration

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DATA FLOW ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  EXTERNAL SOURCES                                                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │ Stripe  │ │ HubSpot │ │  Slack  │ │ Notion  │ │  AI     │        │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘        │
│       │           │           │           │           │             │
│       └───────────┴───────────┴───────────┴───────────┘             │
│                       │                                              │
│                       ▼                                              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    LOADER SERVICE                            │    │
│  │  • 8-Stage Pipeline (ST1-ST8)                               │    │
│  │  • Source Detection & Entity Mapping                        │    │
│  │  • AI-Relay & MCP Handlers                                  │    │
│  │  • Batch & Real-time Processing                             │    │
│  └────────────────────────┬────────────────────────────────────┘    │
│                           │                                          │
│                           ▼                                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                  NORMALIZER SERVICE                          │    │
│  │  • NA0-NA5 Accelerator (Schema → Truth)                     │    │
│  │  • Trust Scoring & Idempotency                              │    │
│  │  • The Linkage Handshake (Dual Write)                       │    │
│  └────────────────────┬────────────────────────────────────────┘    │
│                       │                                              │
│           ┌───────────┴───────────┐                                 │
│           ▼                       ▼                                 │
│  ┌─────────────┐          ┌─────────────┐                          │
│  │    SPINE    │◄────────►│  KNOWLEDGE  │                          │
│  │  (Truth)    │  LINKAGE │  (Context)  │                          │
│  │             │   KEY    │             │                          │
│  │ • Accounts  │◄────────►│ • Sessions  │                          │
│  │ • Contacts  │          │ • Memories  │                          │
│  │ • Deals     │          │ • Graph     │                          │
│  └─────────────┘          └─────────────┘                          │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    MCP SERVERS                               │    │
│  │  services/mcp-connector (7 tools)                           │    │
│  │  packages/integratewise-mcp-tool-connector (7 tools)        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Conclusion

The **Normalizer** and **Loader** services are not just data pipelines — they're **intelligence engines**:

1. **Loader**: Context-aware ingestion with 8-stage refinement
2. **Normalizer**: Truth transformation with the Linkage Handshake
3. **Together**: The foundation for Integration Intelligence

**This is why IntegrateWise is different**:
- Others move data
- We **understand** data
- We **preserve context**
- We **enable AI**

The architecture is production-ready and actively processing webhooks. The next step is expanding the MCP tool catalog and leveraging this foundation for the Workflow Oracle and Intelligence Graph.

---

**Status**: ✅ Production Ready  
**Next**: Expand MCP tools, implement Workflow Oracle pattern detection
