# IntegrateWise OS: System Gap Analysis

> Generated: 2026-01-27 | Based on canonical system write-up

This document maps the architectural specification against current implementation and identifies gaps.

---

## Executive Summary

| Component | Spec Status | Implementation Status | Gap Level |
|-----------|------------|----------------------|-----------|
| **Spine DB (SSOT)** | ✅ Defined | ✅ ~57 tables in Postgres | 🟢 Low |
| **Loader** | ✅ Defined | 🟡 Partial (connectors exist) | 🟡 Medium |
| **Normalizer** | ✅ Defined | 🔴 Stub only | 🔴 High |
| **Store** | ✅ Defined | 🟡 Implicit (direct writes) | 🟡 Medium |
| **Think (Signal Engine)** | ✅ Defined | 🟡 Core exists, needs A/B/C fusion | 🟡 Medium |
| **Govern** | ✅ Defined | 🟡 Decision table exists, policies missing | 🟡 Medium |
| **Act** | ✅ Defined | ✅ Robust implementation | 🟢 Low |
| **OS Shell (UI)** | ✅ Defined | 🟡 Surfaces exist, integration partial | 🟡 Medium |
| **Evidence Drawer** | ✅ Defined | ✅ Implemented | 🟢 Low |
| **Knowledge Bank / IQ Hub** | ✅ Defined | 🟡 Sessions work, linking incomplete | 🟡 Medium |
| **Context Store** | ✅ Defined | 🟡 Tables exist, retrieval partial | 🟡 Medium |

---

## Detailed Component Analysis

### 1. Three Input Streams

#### Stream A: Structured Truth ✅ Core Ready

| Requirement | Status | Evidence |
|-------------|--------|----------|
| CRM entities (clients, deals) | ✅ | `clients`, `deals`, `leads` tables |
| Billing/Subscriptions | ✅ | `subscriptions`, `revenue_transactions` tables |
| Support tickets | 🔴 | Not found |
| Product usage | 🔴 | Missing usage counters |
| Path: Sources → Loader → Normalizer → Store | 🟡 | Loader exists, Normalizer is stub |

**Gap**: Normalizer service needs implementation. Support tickets and usage tables needed.

#### Stream B: Unstructured Evidence 🟡 Partial

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Documents/PDFs | ✅ | `documents` table |
| Emails | ✅ | `emails` table |
| Drive files | ✅ | `drive_files` table |
| Call notes/logs | 🔴 | Not found |
| Linking to entities | 🟡 | `artifact_links` exists but underused |
| Chunking for retrieval | 🔴 | pgvector present, chunking not implemented |

**Gap**: Entity linking needs enforcement. Call notes table missing. Chunking pipeline needed for semantic retrieval.

#### Stream C: AI Session Memory 🟡 Partial

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Session capture | ✅ | `brainstorm_sessions` table |
| Session summaries | ✅ | `summary_md` column |
| Decisions/rationale | ✅ | `brainstorm_insights` with `insight_type` |
| Action candidates | 🟡 | Implicit via insights |
| Entity linking | 🟡 | `client_id` exists, broader linking missing |
| MCP Connector ingestion | ✅ | `services/mcp-connector` exists |

**Gap**: Broader entity linking (deals, projects, goals). Explicit "action candidates" extraction.

---

### 2. Engine Services

#### Loader ✅ Exists

```
services/loader/
├── src/handlers/     # Connector handlers
├── src/jobs/         # Sync jobs
└── README.md
```

- Phase 1 (structured): Connectors for CRM/Billing present
- Phase 2 (artifacts): Partial - docs/emails yes, logs no

#### Normalizer 🔴 Stub

```
services/normalizer/
└── (minimal structure)
```

**Critical Gap**: No normalization logic. Events written raw without schema validation.

**Required Implementation**:

```typescript
// services/normalizer/src/index.ts
interface NormalizeResult {
  canonical_record: any;
  validation_errors: string[];
  dedup_key: string;
}

async function normalize(raw_event: RawEvent): Promise<NormalizeResult> {
  // 1. Schema contract validation
  // 2. Deduplication check
  // 3. Version stamp
  // 4. Return canonical record
}
```

#### Store 🟡 Implicit

Store is currently implicit - services write directly to Postgres via `neon()`. No centralized store service.

**Recommendation**: Formalize as explicit service or accept direct writes with standardized interfaces.

#### Think 🟡 Core Engine Exists

```
services/think/src/engine.ts  ← SignalEngine class
```

**Current Capabilities**:

- ✅ Event → Signal transformation
- ✅ Signal → Situation escalation
- ✅ Multi-signal pattern matching
- ✅ Writes to `signals`, `situations` tables

**Missing per Spec**:

| Requirement | Status |
|-------------|--------|
| Reads from Spine (signals/state) | ✅ |
| Pulls from Context (evidence) | 🔴 |
| Pulls from Knowledge Bank (AI memory) | 🔴 |
| Produces Signals | ✅ |
| Produces Situations | ✅ |
| Produces Proposed Actions | 🔴 |
| A/B/C Evidence References | 🔴 |

**Required Enhancement**:

```typescript
// services/think/src/engine.ts - Add these methods
async fuseSources(entity_type: string, entity_id: string) {
  // A: Spine signals
  const spineSignals = await this.getSpineSignals(entity_id);
  
  // B: Context artifacts
  const contextArtifacts = await this.getLinkedArtifacts(entity_type, entity_id);
  
  // C: AI session memory
  const aiSessions = await this.getRelatedSessions(entity_type, entity_id);
  
  return { spine: spineSignals, context: contextArtifacts, ai: aiSessions };
}

async createProposedAction(situation_id: string, sources: FusedSources) {
  // Generate action with evidence_refs
  await sql`
    INSERT INTO actions (situation_id, title, evidence_refs, status)
    VALUES (${situation_id}, ${title}, ${JSON.stringify([
      { type: 'spine', ref_id: sources.spine[0].id },
      { type: 'context', ref_id: sources.context[0].id },
      { type: 'ai_session', ref_id: sources.ai[0].id }
    ])}, 'proposed')
  `;
}
```

#### Govern 🟡 Partial

- `agent_decisions` table exists with `decision_status`
- Act service checks approval before execution

**Missing**:

| Requirement | Status |
|-------------|--------|
| Approval routing | 🔴 |
| Policy engine (who can run what) | 🔴 |
| Audit trail with evidence snapshot | 🟡 |

#### Act ✅ Robust

```
services/act/src/index.ts
```

- ✅ Decision verification before execution
- ✅ Rate limiting
- ✅ Retry policies
- ✅ Idempotency
- ✅ Event writeback to SSOT
- ✅ Error classification

---

### 3. OS Shell (Views)

#### Current Implementation (`apps/integratewise-os/`)

| Surface | Route | Status | Notes |
|---------|-------|--------|-------|
| **Spine UI** | `/spine` | ✅ Created | KPIs + events |
| **Context UI** | `/context` | ✅ Created | Artifact search |
| **Knowledge Bank (IQ Hub)** | `/iq-hub` | ✅ Created | Session list |
| **Think UI** | `/think` | ✅ Created | Situations view |
| **Act UI** | `/act` | ✅ Created | Actions view |
| **Today View** | `/today` | ✅ Created | Daily overview |
| **Evidence Drawer** | Component | ✅ Created | A/B/C display |
| **Entity 360** | `/business/clients/[id]` | ✅ Created | Spine + Context sections |

#### Missing UI Elements

| Requirement | Status |
|-------------|--------|
| Today shows pending approvals | 🔴 |
| Today shows recent context changes | 🔴 |
| Think narrative ("why it matters") | 🔴 |
| Govern approval workflow UI | 🔴 |
| Act execution logs view | 🔴 |
| Entity 360 timeline (Context chronological) | 🟡 |

---

### 4. Database Schema Gaps

#### Required Tables (per spec)

| Table | Exists | Used By |
|-------|--------|---------|
| `signals` | ✅ | Think |
| `situations` | ✅ | Think |
| `actions` | ✅ | Think → Govern → Act |
| `evidence_refs` | ✅ | Think (A/B/C grounding) |
| `artifact_links` | ✅ | Context → Entity linking |
| `session_links` | ✅ | AI Memory → Entity linking |
| `agent_decisions` | ✅ | Govern |
| `action_runs` | 🔴 | Act (execution history) |
| `governance_policies` | 🔴 | Govern |
| `support_tickets` | 🔴 | Stream A |
| `usage_metrics` | 🔴 | Stream A |
| `call_notes` | 🔴 | Stream B |

---

### 5. The Core Loop Status

```
Load → Normalize → Store → Think → Govern → Act → Repeat
  ✅       🔴        🟡       🟡       🟡      ✅      🟡
```

| Step | Implementation | Issue |
|------|---------------|-------|
| **Load** | `services/loader` | Works, needs more connectors |
| **Normalize** | `services/normalizer` | Empty stub |
| **Store** | Direct writes | No centralized interface |
| **Think** | `services/think` | Missing A/B/C fusion |
| **Govern** | `agent_decisions` table | No policy engine |
| **Act** | `services/act` | Complete |
| **Repeat** | Event writeback | Works but no full loop test |

---

## Priority Roadmap

### Phase 1: Complete the Core Loop (Critical)

1. **Implement Normalizer** - Schema contracts, dedup, validation
2. **Enhance Think** - Add Context/AI Memory fusion, produce `actions`
3. **Add Govern Policies** - `governance_policies` table + enforcement

### Phase 2: Complete Input Streams

4. **Entity Linking** - Enforce `artifact_links`, `session_links` on all writes
2. **Support Tickets** - Add table + HubSpot/Zendesk connector
3. **Usage Metrics** - Add table + product usage ingestion

### Phase 3: UI Integration

7. **Today Approvals** - Show pending `actions` with status='proposed'
2. **Act Execution Logs** - New `/act/history` route
3. **Govern Approval UI** - Workflow for approve/reject/delegate

### Phase 4: Semantic Retrieval

10. **Chunking Pipeline** - Process artifacts into pgvector
2. **Session Embeddings** - Embed summaries for semantic search
3. **Evidence Search** - Allow Think to semantically find relevant A/B/C

---

## Files to Create/Update

### Immediate (Core Loop)

```
services/normalizer/src/index.ts       # Full normalize logic
services/normalizer/src/schemas/       # JSON schemas per entity type
services/think/src/fusion.ts           # A/B/C source fusion
services/think/src/actions.ts          # Proposed action generation
sql-migrations/042_add_action_runs.sql # Execution history
sql-migrations/043_gov_policies.sql    # Governance policies
```

### UI (Shell Integration)

```
apps/integratewise-os/src/app/(app)/govern/         # Approval queue
apps/integratewise-os/src/app/(app)/act/history/    # Execution logs
apps/integratewise-os/src/components/views/today-approvals.tsx
```

---

## Verification Checklist

When the system is complete, these end-to-end tests should pass:

- [ ] **Payment Failure Loop**: Stripe event → Signal → Situation → Action → Approve → Execute → Event writeback
- [ ] **Evidence Trace**: Any situation opens drawer showing A (metrics), B (docs/emails), C (AI sessions)
- [ ] **Entity 360**: Client page shows Spine KPIs + Context timeline + linked AI sessions
- [ ] **IQ Hub Search**: Search for "churn" returns relevant sessions with entity links
- [ ] **Governance**: Proposed action cannot execute without explicit approval

---

*This report should be updated as gaps are closed.*
