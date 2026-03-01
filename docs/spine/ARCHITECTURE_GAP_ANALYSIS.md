# IntegrateWise OS — Memory Update & Gap Analysis

This document tracks the current state of IntegrateWise OS against the **Canonical Architecture (V11+)**.

## 📊 High-Level Status

| Block | Role | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Layer 1** | Workspaces | 🟡 Partial | Business/CS views exist; Personal view needs depth. |
| **Layer 2** | Cognitive Intel | 🔴 Gap | Evidence Drawer and Think Layer need deeper integration. |
| **Layer 3** | Backend Mesh | 🟢 Stable | Services exist; Wiring to D1 is ongoing. |

---

## 🔍 Gap Analysis: Layer 3 (Backend Mesh)

### 1. Ingestion (ING)

- **Status**: 🟢 Robust
- **Components**: `loader-service`, `mcp-connector`.
- **Action**: Verify `delta-sync` and `credential vault bridge` (likely in `mcp-connector`).

### 2. Processing (PROC)

- **Status**: 🟢 Robust
- **Components**: `normalizer-service`.
- **Gap**: `ssot-definition-service` schema rules need to be centralized.

### 3. Memory & Triage (MEM)

- **Status**: 🟡 In Progress
- **Components**: `triage-bot-service` (in `iq-hub`).
- **Gap**: `personal-llm-world-service` needs full D1 migration from Firestore.

### 4. Cognitive & Insights (COG)

- **Status**: 🟡 In Progress
- **Components**: `spine-db-service`, `iq-hub-service`.
- **Gap**: `evidence-binder-service` and `brainstorm-service` need explicit implementations.

### 5. Agent & Workflow (AG)

- **Status**: 🟡 Partial
- **Components**: `agent-runtime` (Act service).
- **Gap**: `agent-registry` and `workflow-config` need D1-backed schemas.

---

## 🚀 Memory Update Roadmap (Phase I: Wiring)

### Step 1: D1 Schema Finalization (The Spine)

- Restore/Update SQL migrations for:
  - `evidence_binder`: Links D1 records to R2/KV artifacts.
  - `agent_registry`: Stores available agents and their permissions.
  - `policy_engine`: RBAC and governance rules.

### Step 2: IQ Hub Decision-Ready Feed

- Implement the "Aggregator" logic in `services/iq-hub`:
  - Fetch normalized data from `spine`.
  - Fetch context from `context-store`.
  - Fetch memory from `personal-llm-world`.
  - Return a unified `DecisionFeed` to the Think service.

### Step 3: Layer 2 UI - The Evidence Drawer

- Create `/apps/integratewise-os/src/components/shared/EvidenceDrawer.tsx`.
- Purpose: Provide the " Explain" button experience for every card.
- Interaction: "Slide-up, collapsible".

### Step 4: Proactive Twin (Shadow Mirror)

- Wire `services/think` to proactively push "Nudges" to the OS UI via a `notifier` service.

---

## 🎯 Verification Criteria

- [ ] Every action in the OS can be found in the `audit-log`.
- [ ] Every insight has an "Evidence" link.
- [ ] Memory syncs hourly from external sources to D1.
