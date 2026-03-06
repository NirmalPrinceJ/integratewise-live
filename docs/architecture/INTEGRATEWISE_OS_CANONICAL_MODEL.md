# IntegrateWise OS — Canonical L0–L3 Model

## The Four-Layer Architecture

```
┌────────────────────────────────────────────────────────────┐
│  L0 — REALITY LAYER                                        │
│  Where Truth Originates                                    │
├────────────────────────────────────────────────────────────┤
│  • Connected tools, uploads, webhooks, chats, events       │
│  • Rule: Never mutate. Preserve provenance + timestamps   │
│  • Output: Raw events + raw artifacts                      │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│  L3 — TRUTH & LEARNING LAYER (Adaptive Spine)              │
│  Where Raw Reality Becomes SSOT Truth + Learnable          │
├────────────────────────────────────────────────────────────┤
│  • Loader, Normalizer, Spine DB                            │
│  • Adaptive Schema Registry, Completeness Scoring          │
│  • Bucket State Engine, Maturity Signals                   │
│  • Rule: L3 learns and structures — never renders UI       │
│  • Output: Structured truth + schema observations          │
│           + readiness signals                               │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│  L2 — COGNITIVE INTELLIGENCE LAYER                         │
│  Where Truth Becomes Meaning + Decisions + Actions         │
├────────────────────────────────────────────────────────────┤
│  • Evidence Drawer, Think, RBAC, Governance                │
│  • Agent Colony, Proactive Twin                            │
│  • Rule: Always explainable + evidence-linked              │
│         + approval-gated                                   │
│  • Output: Insights, recommendations, queued actions       │
│           audit-ready reasoning                             │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│  L1 — WORKSPACE LAYER                                      │
│  Where Humans Do Work (Pure Work Surfaces)                 │
├────────────────────────────────────────────────────────────┤
│  • Business/CSM/Personal views                             │
│  • Operational pages: Accounts, Tasks, Deals, Risks, Docs  │
│  • Rule: No cognition noise. Only what's earned by         │
│         data readiness                                     │
│  • Output: Execution, collaboration, outcomes              │
└────────────────────────────────────────────────────────────┘
                            ↓
                   Back to L0 (Loop)
```

---

## The IntegrateWise Loop (One Line)

**L0 Reality → L3 Truth/Learning → L2 Intelligence/Approvals → L1 Work/Outcomes → back to L0**

---

## Core Promise (One Line)

**IntegrateWise unlocks work modules only when your truth is ready — and agents act only when humans approve.**

---

## Layer Responsibilities Matrix

| Layer | Role | Never Does | Always Does | Example |
|-------|------|------------|-------------|---------|
| **L0** | Capture reality | Modify inputs | Preserve timestamps | Salesforce webhook → raw JSON stored |
| **L3** | Structure truth | Render UI | Learn schema, compute readiness | CSV → normalized accounts, 85% complete |
| **L2** | Generate insights | Auto-execute | Explain reasoning, await approval | "Risk detected: churn signal from usage drop" |
| **L1** | Enable work | Show AI noise | Display earned modules | Accounts page unlocks when B5 SEEDED |

---

## Flow Examples

### Example 1: Upload CSV → Unlock Department

```
L0: User uploads "accounts.csv" (150 records)
    ↓
L3: Loader extracts → normalizes to SSOT → observes fields
    Adaptive Registry records: 
      - account_id (uuid), account_name (text), industry (text)
      - Completeness: 85% (missing: website, annual_revenue)
    Bucket B5 state: OFF → SEEDED
    Readiness signal emitted: "B5 ready for Sales"
    ↓
L2: (Not invoked yet — awaits ⌘J)
    ↓
L1: ModuleGuard checks B5 state → SEEDED ✅
    Sales department unlocks
    /sales/accounts page now accessible
    ↓
L0: User adds 50 more accounts manually (loop continues)
```

### Example 2: AI Suggests Action → Human Approves

```
L0: Customer sends email: "We're seeing downtime"
    ↓
L3: Email normalized → stored in spine_messages
    Entity link: customer_id → account (linked to renewal)
    Readiness: Account has active renewal (at-risk scoring enabled)
    ↓
L2: User opens ⌘J Evidence Drawer
    Think analyzes: "Downtime mention + renewal in 30 days = churn risk"
    Recommendation: "Create high-priority risk record"
    Governance: Policy check — user has permission ✅
    Agent proposes: "Create Risk-123 (80% churn probability)"
    ↓
L1: User sees recommendation in /csm/risks
    Clicks "Approve" → Risk-123 created
    ↓
L0: Risk-123 created → webhook to Slack (loop continues)
```

### Example 3: Proactive Twin Detects Signal

```
L0: API usage drops 40% (connector syncs data)
    ↓
L3: Normalized to spine_platform_metrics
    Observation: usage_events field shows decline
    Completeness: Account has full context (team, contract, history)
    ↓
L2: Proactive Twin (background agent) analyzes
    Evidence: Usage drop + contract value $500k + renewal in 60 days
    Reasoning: "High-value account showing disengagement"
    Action: Queued notification (approval-gated)
    ↓
L1: CSM sees alert in /csm/accounts/ACC-001
    "⚠️ Usage anomaly detected (AI)"
    Clicks → Evidence Drawer shows full reasoning
    Approves → Creates engagement task
    ↓
L0: Task created → syncs to Google Calendar (loop continues)
```

---

## Design Principles

### L0 Principles
- **Immutability**: Never alter incoming data
- **Provenance**: Always record source + timestamp
- **Completeness**: Capture everything (even if messy)

### L3 Principles
- **SSOT**: One canonical representation per entity
- **Learning**: Schema adapts to reality, not vice versa
- **Readiness**: Signal what's usable, hide what's not ready
- **No UI**: L3 is invisible infrastructure

### L2 Principles
- **Explainability**: Every insight has evidence trail
- **Approval-Gating**: Humans decide, AI recommends
- **Context-Aware**: Use L3 completeness to know what's reliable
- **Audit-Ready**: Log all reasoning + decisions

### L1 Principles
- **Earned Access**: Modules unlock when data ready (no empty states)
- **Focus**: No AI distractions unless user invokes (⌘J)
- **Operational**: Pure work surfaces (CRM, tasks, docs, etc.)
- **Progressive**: Start simple, grow complexity as truth matures

---

## Success Metrics by Layer

| Layer | Metric | Target | Why It Matters |
|-------|--------|--------|----------------|
| **L0** | Data capture rate | >95% of events | Can't build truth without reality |
| **L3** | Schema completeness | >80% avg | Incomplete data = unreliable insights |
| **L3** | Normalization accuracy | >99% | Errors propagate to L2+L1 |
| **L2** | Approval rate | 70-90% | Too high = rubber-stamping, too low = poor recommendations |
| **L2** | Evidence link rate | 100% | Every insight must trace to L0 source |
| **L1** | Module unlock time | <2 days | Users should get value fast |
| **L1** | Feature adoption | >60% | Unlocked modules should be used |

---

## Anti-Patterns (What NOT to Do)

| ❌ Anti-Pattern | ✅ Correct Pattern |
|----------------|-------------------|
| L3 rendering dashboards | L3 emits data, L1 renders views |
| L2 auto-executing actions | L2 queues, L1 approves |
| L1 showing incomplete data | L1 locks until L3 signals readiness |
| L0 cleaning data | L0 preserves raw, L3 normalizes |
| Hardcoded schema in L3 | L3 learns schema from observations |
| L2 insights without evidence | Every L2 output links to L0 source |

---

## Implementation Checklist

### L0 Setup
- [ ] Webhook listeners for all external tools
- [ ] File upload handlers (preserve original)
- [ ] Event timestamping + source tracking
- [ ] Immutable storage (no updates, only appends)

### L3 Setup
- [x] Loader service (file extraction)
- [x] Normalizer (SSOT mapping)
- [x] Adaptive Schema Registry (field observation)
- [x] Completeness scoring functions
- [x] Bucket state machine (OFF → SEEDED → LIVE)
- [ ] Maturity scoring (how "stable" is the schema)

### L2 Setup
- [ ] Evidence Drawer (⌘J invocation)
- [ ] Think service (reasoning engine)
- [ ] Governance layer (policy checks)
- [ ] Approval queue (human-in-loop)
- [ ] Audit logging (decisions + rationale)

### L1 Setup
- [x] ModuleGuard (access control)
- [x] Department unlock rules
- [x] Pure work surfaces (Accounts, Tasks, etc.)
- [ ] ⌘J integration (on-demand L2 insights)
- [ ] Progressive feature reveal

---

## Pitch Deck Version (6 Lines)

```
IntegrateWise OS — Four-Layer Architecture

L0: Reality (raw inputs, never mutated)
L3: Truth & Learning (SSOT + adaptive schema + readiness)
L2: Intelligence (AI insights + approvals + audit)
L1: Work (pure surfaces, unlocked when ready)

Promise: Work unlocks when truth is ready. Agents act when humans approve.
```

---

## Documentation Version (Premium)

**IntegrateWise OS is a four-layer system that transforms raw reality into actionable work while keeping humans in control:**

- **L0 (Reality)** captures truth as it happens — unmodified, timestamped, preserved.
- **L3 (Truth & Learning)** normalizes chaos into SSOT, learns your schema, and signals readiness.
- **L2 (Intelligence)** turns truth into insights — explainable, evidence-linked, approval-gated.
- **L1 (Work)** unlocks modules progressively — no noise, no empty states, just earned surfaces.

**The loop flows continuously**: L0 → L3 → L2 → L1 → back to L0, creating a self-improving system where work quality increases as truth matures.

---

## Tagline Options

1. **"Work unlocks when truth is ready. Agents act when humans approve."**
2. **"From chaos to clarity to action — with you in control."**
3. **"Reality → Truth → Intelligence → Work. The IntegrateWise Loop."**
4. **"Smart systems learn your truth. You decide the action."**
5. **"Progressive work surfaces. Earned by data readiness."**

---

**Status**: Canonical Model (2026-02-08)  
**Next**: Implement L2 Evidence Drawer + Think integration
