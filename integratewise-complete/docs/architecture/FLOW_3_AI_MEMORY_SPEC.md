# Flow 3 — AI Memory (Chats via MCP)

> **Document ID**: `IW-FLOW3-001`  
> **Status**: 🔒 **LOCKED** — Canonical Specification  
> **Version**: `1.0 Final`  
> **Effective Date**: 2026-02-12  
> **Classification**: Platform Architecture (Non-Negotiable)  
> **Amendment Authority**: Platform Architecture Board Only  
> **Cross-references**: [Canonical OS Layer Model](../CANONICAL_OS_LAYER_MODEL.md) · [Architecture Overview](../ARCHITECTURE_OVERVIEW.md) · [Canonical Architecture](../spine/CANONICAL_ARCHITECTURE.md)

---

## One-Line Definition

> **Flow 3 is strictly the AI chat capture + memory ingestion plane.  
> It is NOT the decision loop. It is NOT the execution path.**

---

## Naming Convention (Canonical)

| Flow | Name | Domain |
|------|------|--------|
| **Flow 1** | Structured Truth (SSOT / Spine) | Operational entities, relations, timelines |
| **Flow 2** | Unstructured Context (Docs / Slack / Email) | Documents, chunks, embeddings, knowledge |
| **Flow 3** | AI Memory (Chats via MCP) | AI session transcripts, extracted memories, shared context |
| **Loop** | Decision Loop (Think → Act → Approve → Execute → Learn) | Cognitive reasoning + governed execution |

Flow 3 feeds the Decision Loop but does not contain it.  
The Decision Loop consumes from Flow 1 + Flow 2 + Flow 3.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLOW 3: AI MEMORY PLANE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         INPUTS (AI Sources)                          │    │
│  │                                                                      │    │
│  │   ChatGPT    Claude    Cursor    Custom Agents    Any MCP Client     │    │
│  │      │          │         │           │                │             │    │
│  │      └──────────┴─────────┴───────────┴────────────────┘             │    │
│  │                              │                                       │    │
│  │                              ▼                                       │    │
│  │                     ┌──────────────────┐                             │    │
│  │                     │  MCP CONNECTOR   │ ← Canonical ingestion path  │    │
│  │                     │  (L0 → L3)       │                             │    │
│  │                     └────────┬─────────┘                             │    │
│  │                              │                                       │    │
│  │                              ▼                                       │    │
│  │                     ┌──────────────────┐                             │    │
│  │                     │    FIREBASE      │ ← Persistent raw store      │    │
│  │                     │  (Firestore)     │    (immutable sessions)      │    │
│  │                     └────────┬─────────┘                             │    │
│  │                              │                                       │    │
│  │                              ▼                                       │    │
│  │                     ┌──────────────────┐                             │    │
│  │                     │ KNOWLEDGE BANK   │ ← Queryable system store    │    │
│  │                     │ (Vectorize + D1) │    (search + retrieval)      │    │
│  │                     └─────────────────┘                              │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        THREE-TIER STORAGE                            │    │
│  │                                                                      │    │
│  │  ┌──────────────────────────────────────────────────────────────┐    │    │
│  │  │  TIER 1: Private Raw Sessions                                │    │    │
│  │  │  ────────────────────────────                                │    │    │
│  │  │  Store: Firebase (Firestore)                                 │    │    │
│  │  │  Scope: per-AI / per-user / per-tenant                      │    │    │
│  │  │                                                              │    │    │
│  │  │  Contents:                                                   │    │    │
│  │  │   • Full conversation transcripts (messages array)           │    │    │
│  │  │   • Attachments + tool calls + timestamps                   │    │    │
│  │  │   • Model attribution (tool_source, version)                │    │    │
│  │  │   • Entity references (entity_type, entity_id)              │    │    │
│  │  │                                                              │    │    │
│  │  │  Rules:                                                      │    │    │
│  │  │   • Immutable, append-only                                  │    │    │
│  │  │   • Never deleted, only archived via retention policy        │    │    │
│  │  │   • Scoped by tenant_id + user_id + session_id              │    │    │
│  │  └──────────────────────────────────────────────────────────────┘    │    │
│  │                                    │                                │    │
│  │                                    ▼                                │    │
│  │  ┌──────────────────────────────────────────────────────────────┐    │    │
│  │  │  TIER 2: Triage Output                                      │    │    │
│  │  │  ────────────────────                                        │    │    │
│  │  │  Store: D1 (structured) + Memory Consolidator (scheduled)    │    │    │
│  │  │                                                              │    │    │
│  │  │  Processing pipeline:                                        │    │    │
│  │  │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │    │    │
│  │  │   │ EXTRACT  │→ │ VALIDATE │→ │  DEDUP   │→ │  SCORE   │   │    │    │
│  │  │   │ facts,   │  │ vs SSOT  │  │ merge    │  │ conf +   │   │    │    │
│  │  │   │ decisions│  │ entities │  │ similar  │  │ recency  │   │    │    │
│  │  │   └──────────┘  └──────────┘  └──────────┘  └──────────┘   │    │    │
│  │  │         │                                          │         │    │    │
│  │  │         ▼                                          ▼         │    │    │
│  │  │   ┌──────────┐                              ┌──────────┐    │    │    │
│  │  │   │ CLASSIFY │ ──────────────────────────→   │ PREPARE  │    │    │    │
│  │  │   │ topic /  │                               │ for      │    │    │    │
│  │  │   │ domain   │                               │ promote  │    │    │    │
│  │  │   └──────────┘                              └──────────┘    │    │    │
│  │  │                                                              │    │    │
│  │  │  Outputs:                                                    │    │    │
│  │  │   • Extracted facts, decisions, risks, action items          │    │    │
│  │  │   • Confidence scores (0.0–1.0) + recency weighting          │    │    │
│  │  │   • Classification labels (topic, subtopic, domain)          │    │    │
│  │  │   • Deduplication markers (merged_from_session_ids)           │    │    │
│  │  └──────────────────────────────────────────────────────────────┘    │    │
│  │                                    │                                │    │
│  │                                    ▼                                │    │
│  │  ┌──────────────────────────────────────────────────────────────┐    │    │
│  │  │  TIER 3: Shared Memory / Context                             │    │    │
│  │  │  ─────────────────────────────────                           │    │    │
│  │  │  Store: D1 (metadata) + Vectorize (embeddings)               │    │    │
│  │  │                                                              │    │    │
│  │  │  Promotion rules:                                            │    │    │
│  │  │   • Only items with confidence ≥ 0.85 are promoted           │    │    │
│  │  │   • Must link to a valid entity_id in Spine                  │    │    │
│  │  │   • Governed by permissions + retention policies             │    │    │
│  │  │                                                              │    │    │
│  │  │  What lives here:                                            │    │    │
│  │  │   • High-confidence promoted memories                       │    │    │
│  │  │   • Linked to SSOT entities via entity_id (universal key)   │    │    │
│  │  │   • Searchable via Knowledge Bank semantic retrieval         │    │    │
│  │  │   • Evidence-ready for L2 Think consumption                 │    │    │
│  │  │                                                              │    │    │
│  │  │  Lifecycle: active → superseded → archived                   │    │    │
│  │  └──────────────────────────────────────────────────────────────┘    │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Canonical Ingestion Path (Non-Negotiable)

```
AI Chat Client  →  MCP Connector  →  Firebase (Firestore)  →  Sync  →  Knowledge Bank
```

This is the **only** sanctioned path for AI chat memory ingestion into IntegrateWise OS.

### Service Ownership

| Service | Role | Owner |
|---------|------|-------|
| **MCP Connector** (`services/mcp-connector`) | Canonical ingestion endpoint. Validates, authenticates, schema-checks, writes to Firebase. | Platform Team |
| **IQ Hub** (`services/iq-hub`) | Session search, memory retrieval, triage coordination. Reads from Firebase + Knowledge Bank. | Platform Team |
| **Memory Consolidator** (`services/memory-consolidator`) | Scheduled triage: extract → validate → dedup → score → classify → promote. | Platform Team |
| **Knowledge Service** (`services/knowledge`) | Embedding generation, semantic indexing, retrieval. | Platform Team |

No other service or prototype may re-implement chat ingestion.

---

## MCP Connector — Write Bridge Contract

### Allowed Writes

| Endpoint | Purpose | Scope |
|----------|---------|-------|
| `POST /v1/mcp/save_session_memory` | Write session summary + extracted memories | tenant + user |
| `POST /v1/mcp/capture_session` | Enhanced capture with entity linking, tool calls, embeddings | tenant + user |

### Schema Requirements

Every write **must** include:

```typescript
{
  tenant_id: string;    // UUID — tenant scope
  session_id: string;   // UUID — unique session identifier
  tool_source: string;  // 'chatgpt' | 'claude' | 'cursor' | 'custom'
  summary: string;      // Human-readable session summary
  memories: Array<{
    memory_type: string;         // 'insight' | 'preference' | 'fact' | 'decision' | 'action_item'
    memory_key: string;          // Canonical key
    memory_value: string;        // Content
    confidence_score?: number;   // 0.0–1.0
    entity_type?: string;        // Spine entity type for linking
    entity_id?: string;          // Spine entity ID for linking
  }>;
}
```

### Identity Binding (Mandatory)

Every write must include:
- `Authorization: Bearer <MCP_CONNECTOR_API_KEY>` or `X-MCP-Key` header
- `tenant_id` in body (UUID, validated)
- `x-correlation-id` header (for tracing)

### Never Allowed via MCP

- Direct Spine mutation (must go through Act + governance)
- Deletes of any kind
- Permission changes
- Financial mutations
- Policy modifications

---

## Storage Architecture

### Firebase (Firestore) — Raw Session Store

| Collection | Document ID Pattern | Purpose |
|------------|-------------------|---------|
| `ai_sessions` | `{tenant_id}::{session_id}` | Session metadata + summary |
| `ai_session_memories` | `{tenant_id}::{session_id}::{index}` | Individual extracted memories |

Fields per session document:
```
tenant_id, session_id, tool_source, user_label, summary,
entity_type, entity_id, related_entities[], tool_names[],
message_count, started_at, ended_at, created_at,
scoring_source_trust_level, version
```

### D1 — Entity Linking + Metadata

| Table | Purpose |
|-------|---------|
| `session_entity_links` | Links sessions to Spine entities (primary + related) |
| `consolidated_memories` | Triage output: scored, classified, deduped items |

### Vectorize — Semantic Retrieval

Embedding generated via Knowledge service for:
- Session summaries
- Individual memory values
- Consolidated memory summaries

Indexed by `tenant_id` + `entity_id` for scoped retrieval.

---

## Triage Pipeline (Memory Consolidator)

The Memory Consolidator runs on three schedules:

| Schedule | Type | Scope |
|----------|------|-------|
| **Hourly** | Short-term consolidation | Recent sessions within tenant |
| **Daily** | Deep consolidation | Cross-session pattern extraction |
| **Weekly** | Long-term patterns | Cross-account + org-level insights |

### Triage Steps

```
1. EXTRACT    — Pull facts, decisions, risks, action items from raw sessions
2. VALIDATE   — Cross-reference against existing Spine entities
3. DEDUPLICATE — Merge semantically similar items, keep highest confidence
4. SCORE      — Assign confidence (model accuracy) + recency (temporal decay)
5. CLASSIFY   — Assign topic / subtopic / domain / user / org labels
6. PROMOTE    — Items with confidence ≥ 0.85 → Shared Memory / Knowledge Bank
```

### Promotion Rules

- **Promoted** (confidence ≥ 0.85): Written to shared pool, linked via `entity_id`, available to all AIs
- **Pending** (confidence 0.5–0.84): Held in triage output, available for manual review
- **Discarded** (confidence < 0.5): Archived, not promoted, retained for audit

---

## What Flow 3 Produces (Usable Outputs)

| Output | Consumer | Purpose |
|--------|----------|---------|
| Cross-AI chat search | L1 Workspace (IQ Hub) | Search across all AI conversations |
| Resurfaced insights | L1 Evidence Drawer | Surface relevant memories by `entity_id` |
| Evidence-ready memory items | L2 Think | Feed decision context with prior reasoning |
| Clean "org brain" | L2 Cognitive Brain | Deduplicated, high-confidence organizational memory |

---

## Relationship to Decision Loop

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DECISION LOOP (L2)                               │
│                                                                      │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐       │
│   │          │   │          │   │          │   │          │       │
│   │  THINK   │──►│   ACT    │──►│ APPROVE  │──►│ EXECUTE  │───┐   │
│   │          │   │          │   │          │   │          │   │   │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘   │   │
│        ▲                                                       │   │
│        │                                            ┌──────────▼┐  │
│        │                                            │           │  │
│        └────────────────────────────────────────────│   LEARN   │  │
│                                                      │           │  │
│                                                      └───────────┘  │
│                                                                      │
│   INPUTS:                                                            │
│    • Flow 1: Structured Truth (Spine entities + relations)           │
│    • Flow 2: Unstructured Context (docs + knowledge chunks)          │
│    • Flow 3: AI Memory (promoted memories + session context)         │
│                                                                      │
│   EVERY ACTION SHOWS:                                                │
│    • evidence refs (origin_context_id)                               │
│    • confidence score                                                │
│    • dual-context goal impact                                        │
│    • approval gating                                                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

Flow 3 is an **input** to the Decision Loop. It does not participate in execution.

---

## Enforcement Rules

### Rule 1: No Alternate Ingestion Paths

All AI chat memory ingestion **must** go through:

```
MCP Connector → Firebase → Knowledge Bank
```

- No "quick insert" routes in UI apps
- No direct Firebase writes from frontend
- No API shortcuts that bypass MCP Connector validation

### Rule 2: Freeze Duplicate Implementations

Any existing "AI chat ingestion" logic outside the canonical path must be:
1. Identified and flagged
2. Deprecated with `@deprecated` annotation
3. Routed through the MCP ingestion path
4. Removed in the next major version

Known canonical services (no duplicates allowed):
- `services/mcp-connector` — write path
- `services/iq-hub` — read path + triage coordination
- `services/memory-consolidator` — scheduled triage + promotion

### Rule 3: Search + Retrieval from Knowledge Bank Only

UIs can render conversations and memories, but the **source of truth** remains:

| Store | Purpose | Access Pattern |
|-------|---------|---------------|
| **Firebase** | Raw sessions (immutable) | Via MCP Connector / IQ Hub service only |
| **Knowledge Bank** | Triaged + promoted memory | Via Knowledge service semantic search |

The UI **must** consume via Core Worker APIs only (authoritative surfaces), never invent new DB/API shapes.

### Rule 4: Entity Linking is Required for Promotion

A memory item cannot be promoted to Shared Memory unless:
- It has a valid `entity_id` that maps to a Spine entity
- The entity exists in the canonical truth store
- The link type is explicitly declared (`primary`, `related`, `mentioned`)

### Rule 5: Audit Trail is Mandatory

Every memory write, promotion, and consolidation must produce an audit event with:
- `actor_id` + `actor_type` (human / agent / system)
- `origin_context_id` (the session that produced it)
- `action` (created / promoted / archived / superseded)
- `timestamp`

---

## Service Endpoint Reference

### MCP Connector (`services/mcp-connector`)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/` | Service info |
| `GET` | `/health` | Health check |
| `GET` | `/tools` | MCP tool discovery (7 tools) |
| `POST` | `/invoke` | MCP tool invocation |
| `POST` | `/v1/mcp/save_session_memory` | Write session + memories to Firebase |
| `POST` | `/v1/mcp/capture_session` | Enhanced capture with entity linking |

### IQ Hub (`services/iq-hub`)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/` | Service info |
| `POST` | `/iq/sessions/search` | Semantic session search |
| `POST` | `/iq/memories/retrieve` | Memory retrieval by entity/session |
| `POST` | `/iq/conversations` | Create AI conversation |
| `POST` | `/iq/conversations/:id/messages` | Add message to conversation |
| `POST` | `/iq/memories` | Create memory (via triage path) |

### Memory Consolidator (`services/memory-consolidator`)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/` | Service info |
| `GET` | `/health` | Health check |
| `POST` | `/trigger/:type` | Manual trigger (hourly/daily/weekly) |
| `GET` | `/status` | Consolidation status + last runs |

---

## Acceptance Criteria

A release is "real" for Flow 3 only if:

- [ ] AI session arrives via MCP Connector with valid `tenant_id` + `session_id`
- [ ] Raw session written to Firebase (Firestore) — immutable, append-only
- [ ] Memories extracted and stored in `ai_session_memories` collection
- [ ] Entity links written to D1 `session_entity_links` table (when entity_id provided)
- [ ] Auto-embedding triggered via Knowledge service (when available)
- [ ] Memory Consolidator runs triage pipeline on schedule
- [ ] High-confidence items (≥ 0.85) promoted to Shared Memory
- [ ] Promoted items linked to Spine entities via `entity_id`
- [ ] IQ Hub can search sessions and retrieve memories by entity
- [ ] Knowledge Bank returns promoted memories via semantic search
- [ ] L2 Think can include Flow 3 memories in Decision Context
- [ ] UI consumes via IQ Hub / Knowledge Bank APIs only (no direct DB access)
- [ ] No alternate ingestion paths exist in the codebase

---

## Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-02-12 | Architecture Board | Initial canonical specification |
