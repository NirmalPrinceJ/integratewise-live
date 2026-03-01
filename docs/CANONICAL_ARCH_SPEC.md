# IntegrateWise Canonical Architecture Spec (v2.1)

> **Status**: Canonical / Non-Ambiguous  
> **Orientation**: Cognitive Operating System  
> **Reference**: L0 → L3 Model (Refined)

---

## 🌍 L0 — External Reality Layer

*The Tool Universe & Event Horizon*

### Definition

The "World" IntegrateWise connects to. Contains all external systems that produce signals or receive actions.

### Components

* **CRMs**: Salesforce, HubSpot, Pipedrive
* **Comms**: Slack, Teams, Email (Gmail/Outlook)
* **Productivity**: Jira, Asana, Monday, Notion
* **Telemetry**: Product analytics, Segment, Intercom
* **Infra**: Databases, APIs, Filesystems, Webhooks

### Purpose

* Source of operational signals (What happened?)
* Source of historical knowledge (What is known?)
* Execution targets (Where do we act?)

### 🚨 L0 Sacred Rule

**Never trust L0 blindly.** All incoming data must pass through the **Loader + Normalizer** before touching the internal Truth Store.

---

## 🧑‍💻 L1 — Pure Work Layer (Human Only)

*The Sacred Human Operating Surface*

### Philosophy

L1 is where humans work. Intelligence must be **invoked**, never **imposed**.

### 🚨 L1 Sacred Rule (Non-Negotiable)

**No AI Noise.**

* No visible "thinking" loops.
* No unsolicited background reasoning.
* No cognitive overlays unless explicitly requested.

### Contains Only

* **Pure Work Objects**: Tasks, Goals, Documents, Projects.
* **Operational Views**: Kanban, Calendars, Lists, Forms, Tables.
* **Business Dashboards**: Data-driven, not "signal-heavy."

### Explicitly Excluded (The "Forbidden" List)

* ❌ AI reasoning chains / Thinking traces
* ❌ Insight scoring / Risk models (direct)
* ❌ Evidence graph internals
* ❌ Agent telemetry
* ❌ Policy engine logs

---

## 🧠 L2 — FULL AI / COGNITIVE LAYER

*The Intelligence Core*

### Core Definition

**L2 is the FULL AI Layer.** Everything intelligence lives here. It is completely isolated from human work surfaces (L1) and platform enforcement infrastructure (L3).

### � The Evidence Foundation

Evidence is **inside L2**. It is not a separate layer. It is the grounding foundation for all cognition.

* **Meaning**: AI = Evidence-grounded Cognition.

### L2 Internal Mental Model (The Clean Stack)

```
L2 Full AI Layer
   ├ Evidence Foundation (Anchor)
   ├ Memory (Session History)
   ├ Signal Interpretation (Anomalies)
   ├ Context Graph (Synthesis)
   ├ Reasoning (Think Engine)
   ├ Cognitive Fusion (IQ Hub)
   ├ Decision Intelligence (Risk/Models)
   ├ Agent Colony (Autonomous Units)
   ├ Action Preparation (Proposals)
   └ Learning Feedback Loop (Adjust)
```

---

## 🏭 L3 — Platform + Infrastructure Layer

*Capability + Enforcement + Execution*

### Philosophy

**L3 is NOT Intelligence.** L3 is deterministic capability and enforcement.

### Domain Services (The Platform)

* **Spine**: Truth Enforcement (Entities/Relations)
* **Govern**: Policy Authority + Audit Vault
* **Act**: Execution Only (Safe Effector)
* **Loader / Normalizer**: Reality Verification
* **Tenants / Views / Billing**: Isolation & Admin
* **Storage Plane**: D1, R2, Vectorize (Infrastructure)

---

## 🔒 The L2 Boundary Contract

*What Intelligence is Allowed to Do*

| Action | Target | Status | Constraint |
| :--- | :--- | :--- | :--- |
| **READ** | **L3 Spine** | ✅ Allowed | Must respect Tenant Scope + RBAC Masks. |
| **READ** | **L3 Context** | ✅ Allowed | Must include `x-trace-id` for provenance. |
| **Request** | **L3 Act** | ⚠️ Governed | Must submit **Proposal** for Policy Check. |
| **Request** | **L3 Govern** | ⚠️ Governed | Must submit **Policy Check** before planning. |
| **Write** | **L3 Spine** | 🚫 **FORBIDDEN** | **AI NEVER writes Truth directly.** |
| **Execute** | **L0 Tools** | 🚫 **FORBIDDEN** | **AI NEVER executes Tools directly.** (L3 Act does). |
| **Bypass** | **L2 Evidence** | 🚫 **FORBIDDEN** | **AI CANNOT reason without anchored Evidence.** |

### The "No Leak" Guarantee

1. **AI Never Leaks Into L1**: Users stay in a clean work environment.
2. **AI Never Controls L3**: Platform remains deterministic and auditable.
3. **Evidence Cannot Be Bypassed**: All AI exists inside L2 where evidence is the foundation.

---

## 🔁 The Canonical Flow

**Reality → Truth → Intelligence → Work → Approval → Reality**

1. **L0 (Reality)** produces a signal.
2. **L3 (Loader/Normalizer)** ingests and verifies.
3. **L3 (Spine/Knowledge)** stores the normalized truth.
4. **L2 (Evidence)** anchors the new data into context.
5. **L2 (Reasoning/Agent)** processes the data into an insight/proposal.
6. **L1 (Workspace)** allows the human to invoke and review the insight.
7. **Human** takes action or approves a proposal.
8. **L3 (Govern)** validates policy; **L3 (Act)** executes back to **L0**.

---

## ⭐ Final Canonical Definition
>
> **IntegrateWise is a Cognitive Operating System where external reality is ingested and normalized, humans work in pure operational surfaces, intelligence operates on an evidence foundation inside a dedicated cognitive layer, and platform services enforce truth, policy, and execution boundaries.**
