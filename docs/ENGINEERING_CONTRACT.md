# IntegrateWise Engineering Contract (L0-L3)

> **Status**: Enforced  
> **Reference**: `docs/CANONICAL_ARCH_SPEC.md` (v2.1)

This document defines the strict technical boundaries, API contracts, and responsibility assignments for each layer of the IntegrateWise OS. Violating these contracts is a build-breaking offense.

---

## 🚫 Forbidden Patterns (The "Never" List)

1. **L1 (Frontend) → DB Direct**: The frontend MUST NOT import database clients or connect to Spines/Stores directly. All data access is via L3 Service Proxies.
2. **L1 (Frontend) → AI Logic**: The frontend MUST NOT contain business logic for scoring, ranking, or insight generation. It only renders what L2/L3 provides.
3. **L2 (Agents) → Ungoverned Writes**: Agents MUST NOT write to Spines without passing through the `Govern` service.
4. **Implicit Context**: All inter-service requests MUST carry `x-tenant-id`, `x-user-id`, and `x-trace-id`.

---

## 🏗️ Layer Specifications

### L0: External Reality (Ingress)

**Responsibility**: Receive, Normalize, Buffer.

| Component | Contract | Method |
|-----------|----------|--------|
| **Loader Service** | Accepts raw webhooks/events | `POST /v1/ingest/{source}` |
| **Normalizer** | Converts raw -> canonical | `process(Event)` (Internal) |

**Data Guarantee**:

- All L0 ingress events are idempotent.
- Raw payloads are archived in R2 (Evidence) before processing.

---

### L1: Workspace Surface (Frontend)

**Responsibility**: Render, Capture Intent, View State.

| Component | Contract | Method |
|-----------|----------|--------|
| **Service Proxy** | Thin wrapper for L3 API calls | `proxyToService(options)` |
| **View Layer** | Renders standardized view models | `useView(viewId)` |
| **Action Center** | Dispatches intents to Act Layer | `dispatchAction(intent)` |

**State Management**:

- URL is the source of truth for navigation state.
- Server Actions / API Routes are strictly proxies.

---

### L2: Cognitive Layer (Intelligence)

**Responsibility**: Reason, Plan, Monitor.

| Component | Contract | Method |
|-----------|----------|--------|
| **IQ Hub** | Chat / Session Management | `POST /v1/chat/completions` |
| **Think Service** | Insight Generation | `POST /v1/think/analyze` |
| **Agent Colony** | Autonomous task execution | `POST /v1/agent/run` |

**Evidence Constraint**:

- Every L2 output MUST include an `evidence_ref` pointing to source data (Spine Entity, Doc Chunk, or Signal).

---

### L3: Platform Services (The Mesh)

**Responsibility**: Truth, Persistence, Policy.

#### 1. Spine Service (Truth)

- **Role**: Canonical Entity Store (SSOT).
- **Storage**: D1 (Relational).
- **API**:
  - `GET /v1/entities/{type}/{id}`
  - `POST /v1/entities/{type}` (Governed)

#### 2. Store Service (Assets)

- **Role**: Unstructured Data Store.
- **Storage**: R2 (Blob) + D1 (Metadata) + Vectorize (Index).
- **API**:
  - `PUT /v1/docs/{id}`
  - `POST /v1/docs/search`

#### 3. Govern Service (Policy)

- **Role**: Policy Enforcement Point (PEP).
- **API**:
  - `POST /v1/policy/check`
  - `POST /v1/audit/emit`

#### 4. Act Service (Execution)

- **Role**: Safe Effector.
- **API**:
  - `POST /v1/act/execute`

---

## 🔌 Inter-Layer Communication Protocols

All internal communication generally flows **L1 -> L3** or **L2 -> L3**.

### 1. The Proxy Protocol (L1 -> L3)

All frontend API routes follow this exact shape:

```typescript
// src/lib/db.ts
interface ProxyOptions {
  service: ServiceName; // e.g., "spine", "think"
  path: string;
  method: HttpMethod;
  body?: unknown;
}
```

### 2. The Trace Context Header

Every request across the mesh MUST propagate:

```http
x-trace-id: <uuid>       # Distributed Trace ID
x-span-id: <uuid>        # Current Span ID
x-parent-span-id: <uuid> # Parent Span ID
x-request-id: <uuid>     # Original Request ID
x-tenant-id: <string>    # Tenant Context
x-actor-id: <string>     # User or Agent ID
```

### 3. The Signal Protocol (Async)

Events emitted for async processing (e.g., "Entity Updated" -> "Generate Insight"):

```typescript
interface Signal {
  type: string;          // e.g., "ENTITY_UPDATED"
  source: string;        // e.g., "spine-worker"
  payload: Record<string, any>;
  context: TraceContext;
}
```

---

## ✅ Definition of Done (DoD)

A feature is strictly **"Done"** only when:

1. **L1**: Renders the view using data fetched via Service Proxy.
2. **L2**: (Optional) AI logic is encapsulated in Think/IQ Hub, NOT frontend code.
3. **L3**: Data persists in D1/R2 via a typed Service API.
4. **Audit**: The action emits a structured Audit Log event.
5. **Trace**: The full call chain is traceable via headers.
