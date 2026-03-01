# Core-Worker Route Map (v1)

This document defines the API surface for the `core-worker`, which handles the Structured Plane (Spine/Think) logic including Signals, Situations, and Action Proposals.

---

## 2. Route Map

| Category | Method | Path | Purpose | Auth |
| :--- | :--- | :--- | :--- | :--- |
| **Signals** | `GET` | `/v1/signals` | List computed signals for a tenant | `tenant` |
| **Signals** | `GET` | `/v1/signals/:id` | Get detail for a specific signal | `tenant` |
| **Situations** | `GET` | `/v1/situations` | List open/resolved situations | `tenant` |
| **Situations** | `GET` | `/v1/situations/:id` | Get situation + evidence + proposals | `tenant` |
| **Actions** | `GET` | `/v1/action-proposals` | List proposals for a situation | `tenant` |
| **Decisions** | `GET` | `/v1/agent-decisions` | List decision history | `tenant` |
| **Decisions** | `POST` | `/v1/agent-decisions` | Submit a human or agent decision | `tenant` |

---

## 3. Request & Response Shapes

### A. GET /v1/signals

**Query Params**:

- `signal_key`: filter by key
- `entity_type`: account, person, etc.
- `entity_id`: filter by entity
- `band`: good, warning, critical
- `limit`: default 20
- `cursor`: base64 encoded next page token

### B. GET /v1/situations/:id

**Query Params**:

- `include_signals`: boolean
- `include_action_proposals`: boolean
- `include_agent_decisions`: boolean
- `include_evidence`: boolean

### C. POST /v1/agent-decisions

**Request Body**:

```json
{
  "situation_id": "uuid",
  "action_proposal_id": "uuid",
  "decision_status": "approved | rejected | modified",
  "decision_source": "human | agent",
  "decided_by": "person_id",
  "reason": "optional reason",
  "evidence_ref_ids": ["uuid"]
}
```
