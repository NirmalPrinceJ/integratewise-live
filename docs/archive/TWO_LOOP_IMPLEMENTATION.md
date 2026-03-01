# IntegrateWise V11.11 - Two-Loop Architecture Implementation

**Date:** January 21, 2026  
**Version:** V11.11  
**Status:** Implementation Ready

---

## 📊 Architecture Overview

IntegrateWise operates on **two parallel loops** that converge in the IQ Hub:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         INTEGRATEWISE V11.11                             │
│                      TWO-LOOP ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   LOOP A (Human Governed)              LOOP B (System Governed)         │
│   ════════════════════════             ════════════════════════         │
│                                                                          │
│   ┌─────────────┐                      ┌─────────────┐                  │
│   │   INTAKE    │                      │   LOADER    │                  │
│   │ Slack/GPT/  │                      │ API/Webhook │                  │
│   │ WhatsApp    │                      │ Import      │                  │
│   └──────┬──────┘                      └──────┬──────┘                  │
│          │                                    │                          │
│          ▼                                    ▼                          │
│   ┌─────────────┐                      ┌─────────────┐                  │
│   │BRAINSTORMING│                      │ NORMALIZER  │                  │
│   │   LAYER     │                      │   Schema    │                  │
│   │  (Context)  │                      │   Mapping   │                  │
│   └──────┬──────┘                      └──────┬──────┘                  │
│          │                                    │                          │
│          ▼                                    ▼                          │
│   ┌─────────────┐                      ┌─────────────┐                  │
│   │   ACTION    │──────────────────────▶│   SPINE    │                  │
│   │  (Bridge)   │  Tool Update         │  (Truth)   │                  │
│   └─────────────┘                      └──────┬──────┘                  │
│                                               │                          │
│                                               ▼                          │
│                                        ┌─────────────┐                  │
│                                        │   IQ HUB    │◀─ Brainstorming  │
│                                        │   (Views)   │   (Read-Only)    │
│                                        └──────┬──────┘                  │
│                                               │                          │
│                                               ▼                          │
│                                        ┌─────────────┐                  │
│                                        │     ACT     │                  │
│                                        │ (Execution) │                  │
│                                        └──────┬──────┘                  │
│                                               │                          │
│                                               ▼                          │
│                                           REPEAT                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Loop Definitions

### Loop A: Context-to-Truth (Human Governed)

**Flow:** `Intake → Brainstorming → Action → Tool → Loader → Normalizer → Spine`

| Stage | Description | Technology |
|-------|-------------|------------|
| **Intake** | Capture context from messaging platforms | Slack Bot, WhatsApp, Telegram, Custom GPT |
| **Brainstorming** | Store AI conversations, memory, insights | PostgreSQL + Vector DB |
| **Action** | Bridge from Context to Tools | Action Queue |
| **Tool** | External apps where work happens | Salesforce, Asana, Zendesk, etc. |

**Key Rule:** Brainstorming NEVER writes directly to Spine. Context → Action → Tool → Loader → Normalizer → Spine.

### Loop B: Tool-to-Truth (System Governed)

**Flow:** `Loader → Normalizer → Spine → Think → Act → Repeat`

| Stage | Description | Technology |
|-------|-------------|------------|
| **Loader** | Ingest data from connected tools | Webhooks, API Pulls |
| **Normalizer** | Schema mapping, deduplication, identity resolution | DataWeave-style transforms |
| **Spine** | Single source of truth | PostgreSQL (Neon) |
| **Think** | IQ Hub intelligence | Health scores, risk alerts |
| **Act** | Automated workflows | n8n, custom workflows |

**Key Rule:** This loop is for verified, system-of-record data only.

---

## 📁 Implementation Files

### SQL Migrations

| File | Purpose |
|------|---------|
| `apps/integrationwise-os/scripts/035_two_loop_architecture.sql` | Complete schema for Two-Loop Architecture |

**Schemas Created:**
- `spine.*` - Truth Store (organizations, persons, deals, tickets, events, metrics, documents)
- `brainstorm.*` - Context Store (sessions, messages, insights, actions)
- `loader.*` - Ingestion Pipeline (connectors, raw_events, sync_log)
- `iq_hub.*` - Read-only views

### TypeScript Libraries

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `lib/spine/` | Spine entity types and health scoring | `types.ts`, `index.ts` |
| `lib/brainstorm/` | Brainstorming layer types | `types.ts`, `index.ts` |
| `lib/loader/` | Loader and normalizer types | `types.ts`, `index.ts` |
| `lib/iq-hub/` | IQ Hub service and views | `types.ts`, `service.ts`, `index.ts` |

### Documentation

| File | Purpose |
|------|---------|
| `docs/V11.11_ARCHITECTURE_SPEC.md` | Complete architecture specification |
| `docs/STRATEGIC_ALIGNMENT_V11.11_BUSINESS.md` | Business strategy alignment |
| `docs/PRODUCT_ROADMAP.md` | Product roadmap with architecture |
| `docs/TWO_LOOP_IMPLEMENTATION.md` | This implementation guide |

---

## 🗄️ Database Schema Summary

### Spine Schema (Truth Store)

```sql
-- Core entities
spine.organization     -- Master account records
spine.person           -- Contacts and internal users
spine.account_team     -- Cross-team assignments
spine.deal             -- Opportunities and renewals
spine.ticket           -- Support cases
spine.event            -- Activities and interactions
spine.metric           -- Usage and health metrics
spine.document         -- Files and artifacts
```

### Brainstorming Schema (Context Store)

```sql
-- AI context and actions
brainstorm.session     -- AI conversation sessions
brainstorm.message     -- Individual messages with embeddings
brainstorm.insight     -- Extracted learnings and patterns
brainstorm.action      -- Bridge to external tools (CRITICAL)
```

### Loader Schema (Ingestion Pipeline)

```sql
-- Data ingestion
loader.connector       -- Connected tool configurations
loader.raw_event       -- Pre-normalization events
loader.sync_log        -- Sync history and stats
```

### IQ Hub Views (Read-Only)

```sql
-- Unified views
iq_hub.account_360     -- Account view with context
iq_hub.team_dashboard  -- Team performance view
iq_hub.pending_actions -- Action queue view
```

---

## ⚠️ Critical Architecture Rules

| Rule | Description | Enforcement |
|------|-------------|-------------|
| **No Direct Context→Truth** | Brainstorming never writes to Spine | Schema separation |
| **Action-Driven Bridge** | Only Actions connect Context to Tools | Workflow engine |
| **Tool-Verified Truth** | Truth only comes through Loader→Normalizer | Ingestion pipeline |
| **IQ Hub Read-Only** | Views don't auto-merge Context into Truth | Permission model |
| **Human-in-the-Loop** | Humans decide what Context becomes Action | Approval workflows |

---

## 🚀 Usage Examples

### Getting Account 360 View (IQ Hub)

```typescript
import { getIQHubService } from '@/lib/iq-hub';

const iqHub = getIQHubService();

// Get unified view (reads from both Truth + Context)
const account = await iqHub.getAccount360(organizationId);

// Access Truth data
console.log(account.organization.health_score);
console.log(account.open_tickets);

// Access Context data (read-only)
console.log(account.recent_ai_sessions);
console.log(account.pending_actions);
```

### Creating an Action (Context → Tool Bridge)

```typescript
import type { BrainstormAction, CreateTaskPayload } from '@/lib/brainstorm';

// Create action to bridge Context → Tool
const action: Partial<BrainstormAction> = {
  workspace_id: workspaceId,
  session_id: sessionId,
  action_type: 'create_task',
  target_tool: 'asana',
  payload: {
    type: 'create_task',
    title: 'Follow up with customer',
    description: 'Based on AI session insights',
    priority: 'high',
  } as CreateTaskPayload,
  requires_approval: true, // Human-in-the-loop
  created_by: userId,
};

// Action is queued, NOT executed
// Human approval required before execution
// When executed: Tool update → Loader → Normalizer → Spine
```

### Calculating Health Score (Spine)

```typescript
import { calculateHealthScore, getHealthStatus } from '@/lib/spine';

const score = calculateHealthScore({
  organization_id: orgId,
  platform_adoption: 75,
  api_success_rate: 99.5,
  login_frequency: 8,
  payment_status: 'current',
});

const status = getHealthStatus(score); // 'champion' | 'healthy' | 'at_risk' | 'critical'
```

---

## 📋 Migration Steps

1. **Run SQL Migration:**
   ```bash
   psql $DATABASE_URL -f apps/integrationwise-os/scripts/035_two_loop_architecture.sql
   ```

2. **Import TypeScript Types:**
   ```typescript
   import { SpineOrganization, SpinePerson } from '@/lib/spine';
   import { BrainstormSession, BrainstormAction } from '@/lib/brainstorm';
   import { Connector, RawEvent } from '@/lib/loader';
   import { Account360, IQHubService } from '@/lib/iq-hub';
   ```

3. **Configure IQ Hub Service:**
   ```typescript
   // Environment variables required:
   // NEXT_PUBLIC_SUPABASE_URL
   // SUPABASE_SERVICE_ROLE_KEY
   
   const iqHub = getIQHubService();
   ```

---

## 🔗 Related Documentation

- [V11.11 Architecture Spec](./V11.11_ARCHITECTURE_SPEC.md)
- [Strategic Alignment](./STRATEGIC_ALIGNMENT_V11.11_BUSINESS.md)
- [Product Roadmap](./PRODUCT_ROADMAP.md)

---

**Version:** V11.11  
**Last Updated:** January 21, 2026  
**Status:** Ready for Implementation
