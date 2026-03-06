# IntegrateWise Service Mesh Architecture

> **Status**: Production-Ready Foundation  
> **Version**: 2.0  
> **Last Updated**: 2026-02-07

---

## Overview

IntegrateWise uses a **Service Mesh Lite** architecture where the Next.js frontend acts as a thin control plane, proxying all data operations through L3 Cloudflare Workers.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  NEXT.JS (Thin Control Plane)                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Session Edge │ Tenant Scope │ Request Shaping │ Observability     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SERVICE PROXY (src/lib/db.ts)                                      │   │
│  │  ─────────────────────────────────────────────────────────────────  │   │
│  │  • Extract Scope Context (tenant, workspace, user)                  │   │
│  │  • Generate/Propagate Trace Context (request-id, trace-id, span)    │   │
│  │  • Build Forward Headers (auth + scope + trace)                     │   │
│  │  • fetch() with timeout/abort                                        │   │
│  │  • Passthrough response                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  [FUTURE] POLICY PRECHECK LAYER                                            │
│  Fast deny path • Lower worker cost • Prevent noisy agent loops            │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  L3 CLOUDFLARE WORKERS (Domain Services)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  SPINE   │  │  STORE   │  │  VIEWS   │  │ IQ-HUB   │  │  GOVERN  │      │
│  │ Entities │  │ Documents│  │ Summaries│  │ AI/Chat  │  │ Policies │      │
│  │ Goals    │  │ Files    │  │ Today    │  │ Memories │  │ Approvals│      │
│  │ Tasks    │  │ Assets   │  │ Metrics  │  │ Convos   │  │ Audit    │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │             │             │             │             │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐      │
│  │  LOADER  │  │  THINK   │  │   ACT    │  │ TENANTS  │  │   AUTH   │      │
│  │ Ingest   │  │ Insights │  │ Execute  │  │ Multi-T  │  │ Identity │      │
│  │ Normalize│  │ Signals  │  │ Propose  │  │ Billing  │  │ Sessions │      │
│  │ Schedule │  │ Analyze  │  │ Approve  │  │ Config   │  │ OAuth    │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │             │             │             │             │             │
│       └─────────────┴─────────────┴─────────────┴─────────────┘             │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  EVENT / SIGNAL STREAM (Durable Objects / Queues)                   │   │
│  │  Write → Event → Signal → Insight → Action Candidate                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   Cloudflare D1  │  │   Cloudflare R2  │  │ Cloudflare       │          │
│  │   (SQLite)       │  │   (Object Store) │  │ Vectorize        │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  SIDE LAYER: OBSERVABILITY + AUDIT + TRACE                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Every request carries:                                                     │
│  • x-request-id (unique per request)                                       │
│  • x-trace-id (distributed trace, spans multiple services)                 │
│  • x-span-id (this specific span)                                          │
│  • x-parent-span-id (parent in call chain)                                 │
│  • x-agent-id (if AI agent initiated)                                      │
│  • x-session-id (user session)                                             │
│  • x-tenant-id, x-workspace-id, x-user-id (scope context)                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core Principles

### 1. Frontend = Thin Control Plane (Not Data Plane)

```
Next.js =
✔ Session edge
✔ Tenant scope extraction
✔ Request shaping
✔ Observability edge
✔ NOT business logic
```

This prevents:

- Client-driven data mutation
- Schema drift
- Policy bypass

### 2. Zero-Trust Internal

> **🔐 "No Worker May Trust Headers Alone"**

Workers **MUST**:

1. Verify JWT
2. Resolve Tenant via Tenants Service
3. Validate Scope
4. Then Execute

**Never trust these headers directly:**

- `x-tenant-id`
- `x-workspace-id`
- `x-user-id`

Even if the proxy sets them correctly, Workers must validate independently.

### 3. AI is Policy-Bound (Not a Sidecar)

AI in IntegrateWise is:

- **Policy bound** - Actions require approval
- **Tenant bound** - Isolated per tenant
- **Evidence bound** - Every insight has lineage
- **Audit bound** - All AI actions logged

---

## Service Registry

| Service | Responsibility | D1 Tables |
|---------|---------------|-----------|
| **Spine** | Truth / Entities | `spine_entities`, `goals`, `tasks` |
| **Store** | Binary / Docs / Assets | `documents`, R2 bindings |
| **Views** | Aggregated read models | Derived views |
| **IQ-Hub** | AI + Memory + Signals | `conversations`, `memories` |
| **Govern** | Policy + Approvals + Audit | `policies`, `approvals`, `audit_logs` |
| **Think** | Insights + Analysis | `insights`, `signals` |
| **Act** | Execution + Proposals | `action_proposals` |
| **Loader** | Ingest + Normalize | `loader_runs`, `webhook_events` |
| **Tenants** | Multi-tenancy + Config | `tenants`, `workspaces` |
| **Auth** | Identity + Sessions | `sessions`, OAuth |
| **Billing** | Subscriptions + Usage | `subscriptions`, `usage` |

---

## Trace Context

Every request generates a trace context:

```typescript
interface TraceContext {
  request_id: string;    // Unique per request
  trace_id: string;      // Spans multiple services
  span_id: string;       // This specific span
  parent_span_id?: string;
  agent_id?: string;     // If AI-initiated
  session_id?: string;
  start_time: number;
}
```

This enables:

- End-to-end distributed tracing
- AI agent action tracking
- Enterprise security audits
- Performance debugging

---

## Evolution Roadmap

### Current (v2.0)

- ✅ Service Proxy Pattern
- ✅ Scope Context Extraction
- ✅ Trace Context Propagation
- ✅ Zero-Trust Documentation

### Next (v2.1)

- ⏳ Event / Signal Backbone (DO + Queues)
- ⏳ Policy Precheck Layer
- ⏳ Worker-side Scope Validation

### Future (v3.0)

- 🔮 Full Event Sourcing
- 🔮 AI Agent Identity Management
- 🔮 Cross-Tenant Observability

---

## Files

| File | Purpose |
|------|---------|
| `src/lib/db.ts` | Service proxy, scope extraction, trace context |
| `src/lib/supabase/server.ts` | Compatibility shim (routes to Workers) |
| `src/lib/supabase/queries.ts` | Query shim (routes to Workers) |
| `src/lib/audit.ts` | Audit logging via Govern Worker |
| `src/lib/tenant-context.ts` | Tenant resolution via Tenants Worker |
