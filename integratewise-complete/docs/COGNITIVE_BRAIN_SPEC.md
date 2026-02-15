# IntegrateWise OS — Cognitive Brain Specification

## Ultimate L2: Enterprise Reasoning OS

**Status**: Category-Defining Architecture  
**Version**: 1.0  
**Date**: 2026-02-08

---

## 🏛 The Four Layers of IntegrateWise OS

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  L0 — ONBOARDING + REALITY INTRODUCTION + CAPABILITY INTENT DECLARATION    │
│  ═══════════════════════════════════════════════════════════════════════   │
│  Where reality enters the system. User declares what capabilities they     │
│  want (buckets), connects data sources, uploads files. The system learns   │
│  what it will work with.                                                   │
│                                                                             │
│  Key Artifacts: Connectors, Uploads, Webhooks, Intent Declaration          │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         ↓
┌────────────────────────────────────────┴────────────────────────────────────┐
│  L3 — ADAPTIVE SPINE = TRUTH + LEARNING + READINESS PHYSICS                │
│  ═══════════════════════════════════════════════════════════════════════   │
│  Where raw reality becomes structured truth. Self-discovering schema,      │
│  field observations, completeness scoring, maturity levels. Emits          │
│  readiness signals that unlock L1 work.                                    │
│                                                                             │
│  Key Artifacts: SSOT, Schema Registry, Completeness Scores, Bucket States  │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         ↓
┌────────────────────────────────────────┴────────────────────────────────────┐
│  L2 — COGNITIVE BRAIN = REASON + DECISION + SAFE AUTOMATION                │
│  ═══════════════════════════════════════════════════════════════════════   │
│  Where truth becomes meaning, judgement, and safe action. Evidence         │
│  fusion, signal generation, insight formation, trust scoring, simulation,  │
│  decision memory, reality drift detection, and governed execution.         │
│                                                                             │
│  Key Artifacts: Signals, Insights, Decisions, Trust Scores, Simulations    │
└────────────────────────────────────────┬────────────────────────────────────┘
                                         ↓
┌────────────────────────────────────────┴────────────────────────────────────┐
│  L1 — BUCKET-DRIVEN HUMAN WORK EXECUTION                                   │
│  ═══════════════════════════════════════════════════════════════════════   │
│  Where humans do work. Modules unlock based on bucket readiness. Pure      │
│  work surfaces (accounts, tasks, deals, risks) with L2 intelligence        │
│  available on-demand. Execution creates new L0 events.                     │
│                                                                             │
│  Key Artifacts: Work Surfaces, Module Guards, Approved Actions, Outcomes   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### The Complete Loop

```
L0 (Reality In) → L3 (Truth/Learn) → L2 (Reason/Decide) → L1 (Work/Execute) → L0 (New Reality)
```

---

## 🧠 Executive Summary

This specification defines the **Cognitive Brain (L2)** — the layer that transforms IntegrateWise OS from a Cognitive Workspace into an **Enterprise Reasoning OS**.

Most systems stop at:
```
Evidence → Signals → Insights → Actions → Approval → Execute
```

The Cognitive Brain adds:
```
+ Decision Memory          (org learns HOW leadership thinks)
+ Trust Scoring Engine     (controls autonomy unlock safely)
+ Simulation Engine        (predict outcomes before acting)
+ Reality Drift Detection  (model ≠ reality alerts)
+ Signal Accuracy Loop     (self-improving AI)
```

**Result**: Not an assistant. Not automation. A Brain.

---

## 🏗 Architecture Integration

### Layer Responsibilities (Refined)

| Layer | Name | Core Function | Key Question |
|-------|------|---------------|--------------|
| **L0** | Reality Layer | Onboarding + Reality Introduction + Capability Intent | "What will we work with?" |
| **L3** | Adaptive Spine | Truth + Learning + Readiness Physics | "What do we know for sure?" |
| **L2** | Cognitive Brain | Reason + Decision + Safe Automation | "What should we do and is it safe?" |
| **L1** | Work Layer | Bucket-Driven Human Work Execution | "Execute and create new reality" |

### Where Cognitive Brain Sits

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   L0: ONBOARDING LAYER (Reality Introduction)              │
│            Connectors │ Uploads │ Webhooks │ Capability Intent             │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     ↓
┌────────────────────────────────────┴────────────────────────────────────────┐
│                   L3: ADAPTIVE SPINE (Truth + Learning + Readiness)        │
│  [ spine_schema_registry ] [ spine_entity_completeness ] [ buckets ]        │
│  [ field_observations ] [ maturity_scores ] [ context_timeline ]            │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     ↓
┌────────────────────────────────────┴────────────────────────────────────────┐
│                   L2: COGNITIVE BRAIN (Reason + Decision + Safe Auto)      │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    ULTIMATE L2 EXTENSIONS                            │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────┐  │   │
│  │  │  Decision   │ │   Trust     │ │ Simulation  │ │ Reality Drift  │  │   │
│  │  │   Memory    │ │   Engine    │ │   Engine    │ │   Detector     │  │   │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └───────┬────────┘  │   │
│  └─────────┼───────────────┼───────────────┼────────────────┼───────────┘   │
│            └───────────────┴───────────────┴────────────────┘               │
│                                    │                                        │
│  ┌────────────────────────────────▼─────────────────────────────────────┐   │
│  │                    CORE L2 (Already Built)                           │   │
│  │  Evidence Fabric → Signal Engine → Insight Engine → Policy Brain    │   │
│  │  → Agent Colony → Decision Graph → Proactive Twin → Learning Loop   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     ↓
┌────────────────────────────────────┴────────────────────────────────────────┐
│                   L1: WORK LAYER (Bucket-Driven Execution)                 │
│            Accounts │ Tasks │ Deals │ Risks │ Docs │ Pipeline              │
│                    (Unlocked by L3 Bucket Readiness)                        │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     ↓
                              (Creates new L0 events)
```

> **See [CANONICAL_OS_LAYER_MODEL.md](CANONICAL_OS_LAYER_MODEL.md) for complete layer definitions.**

---

# Part A: Decision Memory System

## A.1 Core Concept

**Problem**: Systems remember data and actions, but not:
- WHY decisions were made
- Under WHAT conditions
- With WHAT confidence
- WHAT happened after

**Solution**: Decision Memory captures the complete decision lifecycle, creating **transferable organizational reasoning DNA**.

---

## A.2 Decision Object Model

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         DECISION OBJECT                                  │
├──────────────────────────────────────────────────────────────────────────┤
│  id: decision_xxxx                                                       │
│  tenant_id: org_xxxx                                                     │
│  decision_type: strategic | operational | tactical | reactive           │
│                                                                          │
│  ┌─────────────────────────────────────────┐                             │
│  │ EVIDENCE SNAPSHOT                       │                             │
│  │ ├─ spine_refs: [{entity, field, value}] │  ← Frozen state at decision │
│  │ ├─ context_refs: [{artifact_id, chunk}] │                             │
│  │ ├─ knowledge_refs: [{session_id}]       │                             │
│  │ └─ snapshot_hash: "abc123"              │  ← Immutable fingerprint    │
│  └─────────────────────────────────────────┘                             │
│                                                                          │
│  ┌─────────────────────────────────────────┐                             │
│  │ SIGNALS PRESENT                         │                             │
│  │ ├─ signals: [{signal_id, type, score}]  │                             │
│  │ ├─ situations: [{situation_id, key}]    │                             │
│  │ └─ total_signal_strength: 0.78          │                             │
│  └─────────────────────────────────────────┘                             │
│                                                                          │
│  ┌─────────────────────────────────────────┐                             │
│  │ INSIGHT REASONING                       │                             │
│  │ ├─ fusion_id: bridge_fusion reference   │                             │
│  │ ├─ reasoning_chain: [step1, step2...]   │  ← How AI/human reasoned    │
│  │ ├─ confidence_at_decision: 0.82         │                             │
│  │ └─ alternatives_considered: [...]       │  ← What else was possible   │
│  └─────────────────────────────────────────┘                             │
│                                                                          │
│  ┌─────────────────────────────────────────┐                             │
│  │ HUMAN OVERRIDE / APPROVAL               │                             │
│  │ ├─ decided_by: user_xxxx                │                             │
│  │ ├─ override_reason: "Market timing..."  │                             │
│  │ ├─ approval_mode: manual | suggested    │                             │
│  │ └─ approval_delay_seconds: 3600         │  ← How long they thought    │
│  └─────────────────────────────────────────┘                             │
│                                                                          │
│  ┌─────────────────────────────────────────┐                             │
│  │ ACTION TAKEN                            │                             │
│  │ ├─ action_id: action_xxxx               │                             │
│  │ ├─ action_type: "send_renewal_email"    │                             │
│  │ ├─ action_params: {...}                 │                             │
│  │ └─ execution_status: success | failed   │                             │
│  └─────────────────────────────────────────┘                             │
│                                                                          │
│  ┌─────────────────────────────────────────┐                             │
│  │ OUTCOME TRACKING                        │                             │
│  │ ├─ expected_outcome: {...}              │                             │
│  │ ├─ actual_outcome: {...}                │  ← Filled later             │
│  │ ├─ outcome_delta: +12%                  │                             │
│  │ ├─ outcome_measured_at: timestamp       │                             │
│  │ └─ time_horizon: 7d | 30d | 90d         │                             │
│  └─────────────────────────────────────────┘                             │
│                                                                          │
│  ┌─────────────────────────────────────────┐                             │
│  │ LEARNING SIGNALS                        │                             │
│  │ ├─ was_correct: true | false | partial  │                             │
│  │ ├─ should_have_done: "wait_7_days"      │  ← Hindsight wisdom         │
│  │ ├─ pattern_tags: ["renewal", "q4"]      │                             │
│  │ └─ reusability_score: 0.9               │                             │
│  └─────────────────────────────────────────┘                             │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## A.3 Decision Memory Schema (PostgreSQL)

```sql
-- Migration: 040_decision_memory.sql
-- Description: Decision Memory Layer for Organizational Learning

-- =============================================================================
-- DECISION MEMORY: Core decision objects
-- =============================================================================
CREATE TABLE IF NOT EXISTS decision_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    
    -- Decision identity
    decision_type VARCHAR(30) NOT NULL CHECK (decision_type IN (
        'strategic', 'operational', 'tactical', 'reactive', 'preventive'
    )),
    decision_domain VARCHAR(50) NOT NULL, -- 'renewal', 'churn', 'expansion', 'support', etc.
    decision_title VARCHAR(255) NOT NULL,
    decision_summary TEXT,
    
    -- Entity context
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Evidence snapshot (immutable at decision time)
    evidence_snapshot JSONB NOT NULL DEFAULT '{}',
    evidence_hash VARCHAR(64) NOT NULL, -- SHA256 of snapshot for integrity
    
    -- Signals present at decision
    signals_present JSONB NOT NULL DEFAULT '[]',
    situations_active JSONB NOT NULL DEFAULT '[]',
    total_signal_strength DECIMAL(4,3) CHECK (total_signal_strength BETWEEN 0 AND 1),
    
    -- Reasoning chain
    fusion_id UUID REFERENCES bridge_fusions(id),
    reasoning_chain JSONB NOT NULL DEFAULT '[]',
    confidence_at_decision DECIMAL(4,3) CHECK (confidence_at_decision BETWEEN 0 AND 1),
    alternatives_considered JSONB NOT NULL DEFAULT '[]',
    
    -- Human input
    decided_by UUID NOT NULL,
    override_reason TEXT,
    approval_mode VARCHAR(20) NOT NULL CHECK (approval_mode IN (
        'manual', 'ai_suggested', 'auto_approved', 'escalated'
    )),
    approval_delay_ms INTEGER, -- How long human took to decide
    
    -- Action linkage
    action_id UUID,
    action_type VARCHAR(100),
    action_params JSONB,
    execution_status VARCHAR(20),
    
    -- Outcome tracking (filled later)
    expected_outcome JSONB,
    actual_outcome JSONB,
    outcome_delta DECIMAL(10,4),
    outcome_measured_at TIMESTAMPTZ,
    time_horizon_days INTEGER DEFAULT 30,
    
    -- Learning signals (filled after outcome)
    was_correct VARCHAR(20) CHECK (was_correct IN ('correct', 'incorrect', 'partial', 'pending')),
    should_have_done TEXT,
    pattern_tags TEXT[] DEFAULT '{}',
    reusability_score DECIMAL(3,2) CHECK (reusability_score BETWEEN 0 AND 1),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for decision retrieval
CREATE INDEX idx_decision_memory_tenant ON decision_memory(tenant_id);
CREATE INDEX idx_decision_memory_entity ON decision_memory(entity_type, entity_id);
CREATE INDEX idx_decision_memory_domain ON decision_memory(tenant_id, decision_domain);
CREATE INDEX idx_decision_memory_type ON decision_memory(decision_type);
CREATE INDEX idx_decision_memory_correctness ON decision_memory(was_correct) WHERE was_correct IS NOT NULL;
CREATE INDEX idx_decision_memory_patterns ON decision_memory USING GIN(pattern_tags);

-- =============================================================================
-- DECISION PATTERNS: Extracted reusable decision patterns
-- =============================================================================
CREATE TABLE IF NOT EXISTS decision_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    
    -- Pattern identity
    pattern_name VARCHAR(255) NOT NULL,
    pattern_domain VARCHAR(50) NOT NULL,
    pattern_description TEXT NOT NULL,
    
    -- Trigger conditions (when to apply this pattern)
    trigger_signals JSONB NOT NULL DEFAULT '[]', -- Signal types that trigger
    trigger_conditions JSONB NOT NULL DEFAULT '{}', -- Additional context conditions
    confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
    
    -- Recommended action
    recommended_action_type VARCHAR(100) NOT NULL,
    recommended_params_template JSONB NOT NULL DEFAULT '{}',
    
    -- Evidence of pattern validity
    source_decision_ids UUID[] DEFAULT '{}',
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    success_rate DECIMAL(4,3) GENERATED ALWAYS AS (
        CASE WHEN success_count + failure_count > 0 
        THEN success_count::DECIMAL / (success_count + failure_count)
        ELSE 0 END
    ) STORED,
    
    -- Pattern lifecycle
    status VARCHAR(20) DEFAULT 'learning' CHECK (status IN (
        'learning', 'validated', 'promoted', 'deprecated'
    )),
    min_samples_for_validation INTEGER DEFAULT 5,
    last_applied_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_decision_patterns_tenant ON decision_patterns(tenant_id);
CREATE INDEX idx_decision_patterns_domain ON decision_patterns(pattern_domain);
CREATE INDEX idx_decision_patterns_status ON decision_patterns(status);

-- =============================================================================
-- DECISION SIMILARITY: For pattern matching on new decisions
-- =============================================================================
CREATE TABLE IF NOT EXISTS decision_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    decision_id UUID NOT NULL REFERENCES decision_memory(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    
    -- Embedding vectors (for similarity search)
    evidence_embedding VECTOR(1536), -- OpenAI ada-002 compatible
    reasoning_embedding VECTOR(1536),
    outcome_embedding VECTOR(1536),
    
    -- Composite searchable representation
    searchable_text TEXT NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_decision_embeddings_tenant ON decision_embeddings(tenant_id);
-- Vector index for similarity search (using pgvector)
-- CREATE INDEX idx_decision_evidence_vec ON decision_embeddings 
--     USING ivfflat (evidence_embedding vector_cosine_ops) WITH (lists = 100);

-- =============================================================================
-- DECISION QUERY FUNCTIONS
-- =============================================================================

-- Function: Find similar past decisions for a given context
CREATE OR REPLACE FUNCTION find_similar_decisions(
    p_tenant_id UUID,
    p_entity_type VARCHAR,
    p_decision_domain VARCHAR,
    p_signals JSONB,
    p_limit INTEGER DEFAULT 5
) RETURNS TABLE (
    decision_id UUID,
    decision_title VARCHAR,
    similarity_score DECIMAL,
    was_correct VARCHAR,
    action_taken VARCHAR,
    outcome_delta DECIMAL
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dm.id,
        dm.decision_title,
        -- Simple similarity: count matching signals
        (
            SELECT COUNT(*)::DECIMAL / GREATEST(jsonb_array_length(dm.signals_present), 1)
            FROM jsonb_array_elements(dm.signals_present) sp
            WHERE sp->>'signal_type' IN (
                SELECT jsonb_array_elements_text(p_signals)
            )
        ) AS similarity_score,
        dm.was_correct,
        dm.action_type,
        dm.outcome_delta
    FROM decision_memory dm
    WHERE dm.tenant_id = p_tenant_id
      AND dm.entity_type = p_entity_type
      AND dm.decision_domain = p_decision_domain
      AND dm.was_correct IS NOT NULL  -- Only decisions with known outcomes
    ORDER BY similarity_score DESC, dm.created_at DESC
    LIMIT p_limit;
END;
$$;

-- Function: Get org decision DNA (aggregate patterns)
CREATE OR REPLACE FUNCTION get_org_decision_dna(
    p_tenant_id UUID,
    p_decision_domain VARCHAR DEFAULT NULL
) RETURNS TABLE (
    domain VARCHAR,
    total_decisions BIGINT,
    success_rate DECIMAL,
    avg_confidence DECIMAL,
    avg_decision_time_ms DECIMAL,
    most_common_action VARCHAR,
    top_patterns TEXT[]
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dm.decision_domain,
        COUNT(*),
        AVG(CASE WHEN dm.was_correct = 'correct' THEN 1 
                 WHEN dm.was_correct = 'incorrect' THEN 0 
                 ELSE 0.5 END),
        AVG(dm.confidence_at_decision),
        AVG(dm.approval_delay_ms),
        MODE() WITHIN GROUP (ORDER BY dm.action_type),
        ARRAY_AGG(DISTINCT unnest(dm.pattern_tags))[:5]
    FROM decision_memory dm
    WHERE dm.tenant_id = p_tenant_id
      AND (p_decision_domain IS NULL OR dm.decision_domain = p_decision_domain)
      AND dm.was_correct IS NOT NULL
    GROUP BY dm.decision_domain;
END;
$$;
```

---

## A.4 Decision Memory Query Patterns

### Query 1: "How did we handle similar situations before?"

```sql
-- Find past decisions for renewal risk on enterprise accounts
SELECT * FROM find_similar_decisions(
    p_tenant_id := 'org_xxx',
    p_entity_type := 'account',
    p_decision_domain := 'renewal',
    p_signals := '["risk.churn_indicator", "cs.usage_decline"]'::jsonb,
    p_limit := 5
);
```

### Query 2: "What's our org's decision pattern for churn?"

```sql
SELECT * FROM get_org_decision_dna(
    p_tenant_id := 'org_xxx',
    p_decision_domain := 'churn'
);
-- Returns: success_rate, avg_confidence, common_actions, patterns
```

### Query 3: "Show me decisions that were wrong and why"

```sql
SELECT 
    decision_title,
    action_type,
    confidence_at_decision,
    should_have_done,
    signals_present,
    actual_outcome
FROM decision_memory
WHERE tenant_id = 'org_xxx'
  AND was_correct = 'incorrect'
ORDER BY created_at DESC
LIMIT 10;
```

---

# Part B: Organizational Trust Score Engine

## B.1 Core Concept

**Problem**: "Is this decision safe to automate?" is not about data completeness alone.

**Solution**: Multi-dimensional trust scoring that controls autonomy unlock based on:
- Data completeness
- Field stability
- Signal accuracy history
- Decision outcome history
- Policy sensitivity

---

## B.2 Trust Score Components

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      TRUST SCORE ENGINE                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  TRUST_SCORE = Σ (Component × Weight) → 0.00 to 1.00                    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ COMPONENT 1: DATA COMPLETENESS (Weight: 0.25)                      │  │
│  │ ────────────────────────────────────────────────────────────────── │  │
│  │ Source: spine_entity_completeness                                  │  │
│  │ Formula: fields_present / fields_expected                         │  │
│  │ Range: 0.0 to 1.0                                                 │  │
│  │ Boost: +0.1 if L3 fields present, +0.05 if L2 fields present      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ COMPONENT 2: FIELD STABILITY (Weight: 0.15)                        │  │
│  │ ────────────────────────────────────────────────────────────────── │  │
│  │ Source: spine_schema_registry (occurrence_count, null_count)       │  │
│  │ Formula: 1 - (null_rate + churn_rate) / 2                         │  │
│  │   null_rate = null_count / occurrence_count                       │  │
│  │   churn_rate = fields_deprecated / total_fields                   │  │
│  │ Range: 0.0 to 1.0                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ COMPONENT 3: SIGNAL ACCURACY (Weight: 0.25)                        │  │
│  │ ────────────────────────────────────────────────────────────────── │  │
│  │ Source: signal_accuracy_log (new table)                           │  │
│  │ Formula: correct_signals / total_signals (last 90 days)           │  │
│  │ Range: 0.0 to 1.0                                                 │  │
│  │ Cold start: 0.5 (neutral) until 10+ signals evaluated             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ COMPONENT 4: DECISION OUTCOME HISTORY (Weight: 0.25)               │  │
│  │ ────────────────────────────────────────────────────────────────── │  │
│  │ Source: decision_memory (was_correct)                             │  │
│  │ Formula: correct_decisions / total_decisions (by domain)          │  │
│  │ Range: 0.0 to 1.0                                                 │  │
│  │ Cold start: 0.5 until 5+ decisions in domain                      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ COMPONENT 5: POLICY SENSITIVITY (Weight: 0.10)                     │  │
│  │ ────────────────────────────────────────────────────────────────── │  │
│  │ Source: governance_policies                                       │  │
│  │ Formula: 1 - policy_sensitivity_level                             │  │
│  │   low_sensitivity = 0.1, medium = 0.5, high = 0.8, critical = 1.0 │  │
│  │ Inversion: High sensitivity → Lower trust for automation          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ AUTONOMY UNLOCK THRESHOLDS                                         │  │
│  │ ────────────────────────────────────────────────────────────────── │  │
│  │ TRUST < 0.30  → MANUAL ONLY (no suggestions)                      │  │
│  │ TRUST 0.30-0.50 → SUGGESTIONS (human must approve)                │  │
│  │ TRUST 0.50-0.70 → ASSISTED (defaults to suggested, easy override) │  │
│  │ TRUST 0.70-0.85 → SUPERVISED (auto-execute, human can undo)       │  │
│  │ TRUST > 0.85 → AUTONOMOUS (full automation, audit only)           │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## B.3 Trust Score Schema (PostgreSQL)

```sql
-- Migration: 041_trust_score_engine.sql
-- Description: Organizational Trust Score Engine for Autonomy Control

-- =============================================================================
-- SIGNAL ACCURACY LOG: Track signal correctness over time
-- =============================================================================
CREATE TABLE IF NOT EXISTS signal_accuracy_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    
    -- Signal reference
    signal_id UUID NOT NULL,
    signal_type VARCHAR(100) NOT NULL,
    signal_key VARCHAR(100) NOT NULL,
    signal_strength DECIMAL(4,3),
    
    -- Entity context
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Accuracy evaluation
    was_accurate VARCHAR(20) NOT NULL CHECK (was_accurate IN (
        'accurate', 'inaccurate', 'early', 'late', 'noise', 'pending'
    )),
    accuracy_notes TEXT,
    
    -- Timing
    signal_generated_at TIMESTAMPTZ NOT NULL,
    outcome_observed_at TIMESTAMPTZ,
    evaluation_delay_days INTEGER,
    
    -- Evaluator
    evaluated_by VARCHAR(30), -- 'system', 'human', 'outcome_tracker'
    evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_signal_accuracy_tenant ON signal_accuracy_log(tenant_id);
CREATE INDEX idx_signal_accuracy_type ON signal_accuracy_log(signal_type, signal_key);
CREATE INDEX idx_signal_accuracy_entity ON signal_accuracy_log(entity_type, entity_id);
CREATE INDEX idx_signal_accuracy_result ON signal_accuracy_log(was_accurate);

-- =============================================================================
-- TRUST SCORES: Computed trust scores per entity/domain
-- =============================================================================
CREATE TABLE IF NOT EXISTS trust_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    
    -- Scope (can be entity-level or domain-level)
    scope_type VARCHAR(30) NOT NULL CHECK (scope_type IN (
        'entity', 'domain', 'action_type', 'org_wide'
    )),
    scope_entity_type VARCHAR(50),
    scope_entity_id UUID,
    scope_domain VARCHAR(50),
    
    -- Component scores (0.0 to 1.0)
    data_completeness_score DECIMAL(4,3) DEFAULT 0,
    field_stability_score DECIMAL(4,3) DEFAULT 0,
    signal_accuracy_score DECIMAL(4,3) DEFAULT 0,
    decision_outcome_score DECIMAL(4,3) DEFAULT 0,
    policy_sensitivity_score DECIMAL(4,3) DEFAULT 0,
    
    -- Component weights (customizable per org)
    weight_data_completeness DECIMAL(3,2) DEFAULT 0.25,
    weight_field_stability DECIMAL(3,2) DEFAULT 0.15,
    weight_signal_accuracy DECIMAL(3,2) DEFAULT 0.25,
    weight_decision_outcome DECIMAL(3,2) DEFAULT 0.25,
    weight_policy_sensitivity DECIMAL(3,2) DEFAULT 0.10,
    
    -- Computed trust score
    trust_score DECIMAL(4,3) GENERATED ALWAYS AS (
        (data_completeness_score * weight_data_completeness) +
        (field_stability_score * weight_field_stability) +
        (signal_accuracy_score * weight_signal_accuracy) +
        (decision_outcome_score * weight_decision_outcome) +
        (policy_sensitivity_score * weight_policy_sensitivity)
    ) STORED,
    
    -- Derived autonomy level
    autonomy_level VARCHAR(20) GENERATED ALWAYS AS (
        CASE
            WHEN (
                (data_completeness_score * weight_data_completeness) +
                (field_stability_score * weight_field_stability) +
                (signal_accuracy_score * weight_signal_accuracy) +
                (decision_outcome_score * weight_decision_outcome) +
                (policy_sensitivity_score * weight_policy_sensitivity)
            ) < 0.30 THEN 'manual'
            WHEN (
                (data_completeness_score * weight_data_completeness) +
                (field_stability_score * weight_field_stability) +
                (signal_accuracy_score * weight_signal_accuracy) +
                (decision_outcome_score * weight_decision_outcome) +
                (policy_sensitivity_score * weight_policy_sensitivity)
            ) < 0.50 THEN 'suggestions'
            WHEN (
                (data_completeness_score * weight_data_completeness) +
                (field_stability_score * weight_field_stability) +
                (signal_accuracy_score * weight_signal_accuracy) +
                (decision_outcome_score * weight_decision_outcome) +
                (policy_sensitivity_score * weight_policy_sensitivity)
            ) < 0.70 THEN 'assisted'
            WHEN (
                (data_completeness_score * weight_data_completeness) +
                (field_stability_score * weight_field_stability) +
                (signal_accuracy_score * weight_signal_accuracy) +
                (decision_outcome_score * weight_decision_outcome) +
                (policy_sensitivity_score * weight_policy_sensitivity)
            ) < 0.85 THEN 'supervised'
            ELSE 'autonomous'
        END
    ) STORED,
    
    -- Sample counts (for cold start handling)
    decision_sample_count INTEGER DEFAULT 0,
    signal_sample_count INTEGER DEFAULT 0,
    
    -- Metadata
    last_computed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_trust_scores_scope ON trust_scores(
    tenant_id, scope_type, scope_entity_type, scope_entity_id, scope_domain
);
CREATE INDEX idx_trust_scores_tenant ON trust_scores(tenant_id);
CREATE INDEX idx_trust_scores_autonomy ON trust_scores(autonomy_level);

-- =============================================================================
-- TRUST SCORE COMPUTATION FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION compute_trust_score(
    p_tenant_id UUID,
    p_scope_type VARCHAR,
    p_entity_type VARCHAR DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_domain VARCHAR DEFAULT NULL
) RETURNS TABLE (
    trust_score DECIMAL,
    autonomy_level VARCHAR,
    components JSONB
) LANGUAGE plpgsql AS $$
DECLARE
    v_data_completeness DECIMAL := 0.5;
    v_field_stability DECIMAL := 0.5;
    v_signal_accuracy DECIMAL := 0.5;
    v_decision_outcome DECIMAL := 0.5;
    v_policy_sensitivity DECIMAL := 0.5;
    v_signal_count INTEGER := 0;
    v_decision_count INTEGER := 0;
BEGIN
    -- Component 1: Data Completeness (from spine_entity_completeness)
    IF p_entity_id IS NOT NULL THEN
        SELECT COALESCE(sec.completeness_score::DECIMAL / 100, 0.5)
        INTO v_data_completeness
        FROM spine_entity_completeness sec
        WHERE sec.entity_id = p_entity_id;
    ELSE
        SELECT COALESCE(AVG(sec.completeness_score)::DECIMAL / 100, 0.5)
        INTO v_data_completeness
        FROM spine_entity_completeness sec
        WHERE sec.tenant_id = p_tenant_id
          AND (p_entity_type IS NULL OR sec.entity_type = p_entity_type);
    END IF;
    
    -- Component 2: Field Stability (from spine_schema_registry)
    SELECT 1 - COALESCE(
        AVG(CASE WHEN ssr.occurrence_count > 0 
            THEN ssr.null_count::DECIMAL / ssr.occurrence_count 
            ELSE 0 END
        ), 0.5)
    INTO v_field_stability
    FROM spine_schema_registry ssr
    WHERE ssr.tenant_id = p_tenant_id
      AND (p_entity_type IS NULL OR ssr.entity_type = p_entity_type)
      AND ssr.status != 'deprecated';
    
    -- Component 3: Signal Accuracy (from signal_accuracy_log)
    SELECT 
        COUNT(*),
        COALESCE(
            SUM(CASE WHEN sal.was_accurate = 'accurate' THEN 1 ELSE 0 END)::DECIMAL / 
            NULLIF(COUNT(*), 0),
            0.5
        )
    INTO v_signal_count, v_signal_accuracy
    FROM signal_accuracy_log sal
    WHERE sal.tenant_id = p_tenant_id
      AND (p_entity_type IS NULL OR sal.entity_type = p_entity_type)
      AND sal.evaluated_at > NOW() - INTERVAL '90 days';
    
    -- Cold start: default to 0.5 if < 10 samples
    IF v_signal_count < 10 THEN
        v_signal_accuracy := 0.5;
    END IF;
    
    -- Component 4: Decision Outcome (from decision_memory)
    SELECT 
        COUNT(*),
        COALESCE(
            SUM(CASE WHEN dm.was_correct = 'correct' THEN 1 
                     WHEN dm.was_correct = 'partial' THEN 0.5 
                     ELSE 0 END)::DECIMAL / NULLIF(COUNT(*), 0),
            0.5
        )
    INTO v_decision_count, v_decision_outcome
    FROM decision_memory dm
    WHERE dm.tenant_id = p_tenant_id
      AND (p_domain IS NULL OR dm.decision_domain = p_domain)
      AND dm.was_correct IS NOT NULL;
    
    IF v_decision_count < 5 THEN
        v_decision_outcome := 0.5;
    END IF;
    
    -- Component 5: Policy Sensitivity (inverted - high sensitivity = low trust)
    v_policy_sensitivity := 0.7; -- Default: medium-low sensitivity
    
    -- Return computed scores
    RETURN QUERY
    SELECT 
        (v_data_completeness * 0.25 + 
         v_field_stability * 0.15 +
         v_signal_accuracy * 0.25 +
         v_decision_outcome * 0.25 +
         v_policy_sensitivity * 0.10)::DECIMAL,
        CASE
            WHEN (v_data_completeness * 0.25 + v_field_stability * 0.15 +
                  v_signal_accuracy * 0.25 + v_decision_outcome * 0.25 +
                  v_policy_sensitivity * 0.10) < 0.30 THEN 'manual'
            WHEN (v_data_completeness * 0.25 + v_field_stability * 0.15 +
                  v_signal_accuracy * 0.25 + v_decision_outcome * 0.25 +
                  v_policy_sensitivity * 0.10) < 0.50 THEN 'suggestions'
            WHEN (v_data_completeness * 0.25 + v_field_stability * 0.15 +
                  v_signal_accuracy * 0.25 + v_decision_outcome * 0.25 +
                  v_policy_sensitivity * 0.10) < 0.70 THEN 'assisted'
            WHEN (v_data_completeness * 0.25 + v_field_stability * 0.15 +
                  v_signal_accuracy * 0.25 + v_decision_outcome * 0.25 +
                  v_policy_sensitivity * 0.10) < 0.85 THEN 'supervised'
            ELSE 'autonomous'
        END::VARCHAR,
        jsonb_build_object(
            'data_completeness', v_data_completeness,
            'field_stability', v_field_stability,
            'signal_accuracy', v_signal_accuracy,
            'decision_outcome', v_decision_outcome,
            'policy_sensitivity', v_policy_sensitivity,
            'signal_sample_count', v_signal_count,
            'decision_sample_count', v_decision_count
        );
END;
$$;

-- =============================================================================
-- VIEW: Trust Dashboard
-- =============================================================================
CREATE OR REPLACE VIEW v_trust_dashboard AS
SELECT
    ts.tenant_id,
    ts.scope_type,
    ts.scope_domain,
    ts.trust_score,
    ts.autonomy_level,
    ts.data_completeness_score,
    ts.signal_accuracy_score,
    ts.decision_outcome_score,
    ts.decision_sample_count,
    ts.signal_sample_count,
    ts.last_computed_at
FROM trust_scores ts
ORDER BY ts.trust_score DESC;
```

---

## B.4 Trust Score API

### Autonomy Check Before Action

```typescript
// services/trust-engine.ts
interface TrustCheck {
  canAutomate: boolean;
  autonomyLevel: 'manual' | 'suggestions' | 'assisted' | 'supervised' | 'autonomous';
  trustScore: number;
  blockingReasons: string[];
  components: {
    dataCompleteness: number;
    fieldStability: number;
    signalAccuracy: number;
    decisionOutcome: number;
    policySensitivity: number;
  };
}

async function checkTrustForAction(
  tenantId: string,
  actionType: string,
  entityType: string,
  entityId: string,
  requiredAutonomy: 'suggestions' | 'assisted' | 'supervised' | 'autonomous'
): Promise<TrustCheck> {
  const result = await db.query(
    `SELECT * FROM compute_trust_score($1, 'entity', $2, $3, $4)`,
    [tenantId, entityType, entityId, actionType]
  );
  
  const score = result.rows[0];
  const autonomyLevels = ['manual', 'suggestions', 'assisted', 'supervised', 'autonomous'];
  const currentLevel = autonomyLevels.indexOf(score.autonomy_level);
  const requiredLevel = autonomyLevels.indexOf(requiredAutonomy);
  
  return {
    canAutomate: currentLevel >= requiredLevel,
    autonomyLevel: score.autonomy_level,
    trustScore: score.trust_score,
    blockingReasons: currentLevel < requiredLevel 
      ? [`Trust score ${score.trust_score} below threshold for ${requiredAutonomy}`]
      : [],
    components: score.components
  };
}
```

---

# Part C: Simulation Engine

## C.1 Core Concept

**Problem**: Systems suggest actions without predicting outcomes.

**Solution**: Before acting, run fast scenario simulations to predict:
- Win probability
- Risk envelope
- Confidence spread
- Alternative outcomes

---

## C.2 Simulation Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       SIMULATION ENGINE                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ PHASE 1: SCENARIO DEFINITION                                       │  │
│  │ ─────────────────────────────────────────────────────────────────  │  │
│  │ Input: Current entity state + proposed action + context            │  │
│  │ Output: Scenario bundle with variables and assumptions             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                             ↓                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ PHASE 2: HISTORICAL PATTERN MATCHING                               │  │
│  │ ─────────────────────────────────────────────────────────────────  │  │
│  │ Query: decision_memory for similar past contexts                   │  │
│  │ Query: decision_patterns for validated patterns                    │  │
│  │ Output: Historical outcome distribution                            │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                             ↓                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ PHASE 3: MONTE CARLO SIMULATION (Fast)                             │  │
│  │ ─────────────────────────────────────────────────────────────────  │  │
│  │ Run: 100-1000 simulations with variable perturbation               │  │
│  │ Variables: timing, market conditions, stakeholder response         │  │
│  │ Output: Outcome probability distribution                           │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                             ↓                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ PHASE 4: OUTCOME PREDICTION                                        │  │
│  │ ─────────────────────────────────────────────────────────────────  │  │
│  │ Output:                                                            │  │
│  │   - win_probability: 0.62                                          │  │
│  │   - risk_level: medium                                             │  │
│  │   - confidence_interval: [0.55, 0.69]                              │  │
│  │   - expected_value: +$45,000                                       │  │
│  │   - downside_risk: -$12,000                                        │  │
│  │   - best_case: +$120,000                                           │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                             ↓                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ PHASE 5: ALTERNATIVE SCENARIOS                                     │  │
│  │ ─────────────────────────────────────────────────────────────────  │  │
│  │ Generate:                                                          │  │
│  │   - If action now: { prediction }                                  │  │
│  │   - If wait 7 days: { prediction }                                 │  │
│  │   - If alternative action: { prediction }                          │  │
│  │   - If no action: { prediction }                                   │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## C.3 Simulation Schema (PostgreSQL)

```sql
-- Migration: 042_simulation_engine.sql
-- Description: Simulation Engine for Outcome Prediction

-- =============================================================================
-- SIMULATION REQUESTS: Track simulation runs
-- =============================================================================
CREATE TABLE IF NOT EXISTS simulation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    
    -- What we're simulating
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    action_params JSONB,
    
    -- Context snapshot
    context_snapshot JSONB NOT NULL DEFAULT '{}',
    signals_snapshot JSONB NOT NULL DEFAULT '[]',
    
    -- Simulation config
    simulation_type VARCHAR(30) NOT NULL CHECK (simulation_type IN (
        'quick', 'standard', 'deep'
    )),
    monte_carlo_runs INTEGER DEFAULT 100,
    time_horizon_days INTEGER DEFAULT 30,
    
    -- Results
    primary_prediction JSONB,
    alternative_scenarios JSONB DEFAULT '[]',
    historical_matches JSONB DEFAULT '[]',
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'running', 'completed', 'failed'
    )),
    computation_time_ms INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_simulation_requests_tenant ON simulation_requests(tenant_id);
CREATE INDEX idx_simulation_requests_entity ON simulation_requests(entity_type, entity_id);
CREATE INDEX idx_simulation_requests_status ON simulation_requests(status);

-- =============================================================================
-- OUTCOME PREDICTIONS: Structured prediction results
-- =============================================================================
CREATE TABLE IF NOT EXISTS outcome_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simulation_id UUID NOT NULL REFERENCES simulation_requests(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL,
    
    -- Prediction type
    scenario_name VARCHAR(100) NOT NULL, -- 'primary', 'wait_7d', 'alternative_action', 'no_action'
    scenario_params JSONB,
    
    -- Core predictions
    win_probability DECIMAL(4,3) CHECK (win_probability BETWEEN 0 AND 1),
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    confidence DECIMAL(4,3) CHECK (confidence BETWEEN 0 AND 1),
    
    -- Value predictions
    expected_value DECIMAL(15,2),
    downside_risk DECIMAL(15,2),
    upside_potential DECIMAL(15,2),
    confidence_interval_low DECIMAL(4,3),
    confidence_interval_high DECIMAL(4,3),
    
    -- Distribution data
    outcome_distribution JSONB DEFAULT '[]', -- [{outcome: 'win', probability: 0.62}, ...]
    key_factors JSONB DEFAULT '[]', -- [{factor: 'stakeholder_engaged', impact: 0.3}, ...]
    risk_factors JSONB DEFAULT '[]',
    
    -- Timing recommendations
    optimal_timing VARCHAR(50),
    timing_sensitivity DECIMAL(3,2), -- How much timing matters
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_outcome_predictions_simulation ON outcome_predictions(simulation_id);
CREATE INDEX idx_outcome_predictions_tenant ON outcome_predictions(tenant_id);

-- =============================================================================
-- SIMULATION MODELS: Configurable prediction models per domain
-- =============================================================================
CREATE TABLE IF NOT EXISTS simulation_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID, -- NULL = global default
    
    -- Model identity
    model_name VARCHAR(100) NOT NULL,
    domain VARCHAR(50) NOT NULL, -- 'renewal', 'expansion', 'churn', 'support'
    entity_type VARCHAR(50) NOT NULL,
    
    -- Model configuration
    input_signals JSONB NOT NULL DEFAULT '[]', -- Which signals matter
    signal_weights JSONB NOT NULL DEFAULT '{}', -- How much each signal matters
    baseline_probability DECIMAL(4,3) DEFAULT 0.5,
    
    -- Historical calibration
    historical_accuracy DECIMAL(4,3),
    calibration_sample_size INTEGER DEFAULT 0,
    last_calibrated_at TIMESTAMPTZ,
    
    -- Model lifecycle
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
        'draft', 'active', 'deprecated'
    )),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_simulation_models_domain ON simulation_models(domain, entity_type);

-- =============================================================================
-- FAST SIMULATION FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION run_quick_simulation(
    p_tenant_id UUID,
    p_entity_type VARCHAR,
    p_entity_id UUID,
    p_action_type VARCHAR,
    p_action_params JSONB DEFAULT '{}'
) RETURNS TABLE (
    simulation_id UUID,
    win_probability DECIMAL,
    risk_level VARCHAR,
    confidence DECIMAL,
    expected_value DECIMAL,
    key_factors JSONB,
    recommendation TEXT
) LANGUAGE plpgsql AS $$
DECLARE
    v_simulation_id UUID;
    v_historical_success_rate DECIMAL := 0.5;
    v_signal_boost DECIMAL := 0;
    v_completeness_factor DECIMAL := 0.5;
    v_win_prob DECIMAL;
    v_confidence DECIMAL;
BEGIN
    -- Create simulation record
    INSERT INTO simulation_requests (
        tenant_id, entity_type, entity_id, action_type, action_params,
        simulation_type, monte_carlo_runs, status
    ) VALUES (
        p_tenant_id, p_entity_type, p_entity_id, p_action_type, p_action_params,
        'quick', 100, 'running'
    ) RETURNING id INTO v_simulation_id;
    
    -- Get historical success rate from decision_memory
    SELECT COALESCE(
        AVG(CASE WHEN dm.was_correct = 'correct' THEN 1 
                 WHEN dm.was_correct = 'partial' THEN 0.5 
                 ELSE 0 END),
        0.5
    ) INTO v_historical_success_rate
    FROM decision_memory dm
    WHERE dm.tenant_id = p_tenant_id
      AND dm.entity_type = p_entity_type
      AND dm.action_type = p_action_type
      AND dm.was_correct IS NOT NULL;
    
    -- Get entity completeness
    SELECT COALESCE(sec.completeness_score::DECIMAL / 100, 0.5)
    INTO v_completeness_factor
    FROM spine_entity_completeness sec
    WHERE sec.entity_id = p_entity_id;
    
    -- Calculate win probability (simplified model)
    v_win_prob := (v_historical_success_rate * 0.6) + (v_completeness_factor * 0.3) + 0.1;
    v_win_prob := GREATEST(0.1, LEAST(0.95, v_win_prob)); -- Clamp to reasonable range
    
    -- Calculate confidence based on sample size
    SELECT COALESCE(LEAST(COUNT(*)::DECIMAL / 20, 1.0), 0.5)
    INTO v_confidence
    FROM decision_memory dm
    WHERE dm.tenant_id = p_tenant_id
      AND dm.entity_type = p_entity_type
      AND dm.action_type = p_action_type;
    
    -- Store prediction
    INSERT INTO outcome_predictions (
        simulation_id, tenant_id, scenario_name,
        win_probability, risk_level, confidence,
        key_factors
    ) VALUES (
        v_simulation_id, p_tenant_id, 'primary',
        v_win_prob,
        CASE 
            WHEN v_win_prob > 0.7 THEN 'low'
            WHEN v_win_prob > 0.5 THEN 'medium'
            WHEN v_win_prob > 0.3 THEN 'high'
            ELSE 'critical'
        END,
        v_confidence,
        jsonb_build_array(
            jsonb_build_object('factor', 'historical_success_rate', 'value', v_historical_success_rate),
            jsonb_build_object('factor', 'data_completeness', 'value', v_completeness_factor)
        )
    );
    
    -- Mark simulation complete
    UPDATE simulation_requests 
    SET status = 'completed', completed_at = NOW()
    WHERE id = v_simulation_id;
    
    -- Return results
    RETURN QUERY
    SELECT 
        v_simulation_id,
        v_win_prob,
        CASE 
            WHEN v_win_prob > 0.7 THEN 'low'::VARCHAR
            WHEN v_win_prob > 0.5 THEN 'medium'::VARCHAR
            WHEN v_win_prob > 0.3 THEN 'high'::VARCHAR
            ELSE 'critical'::VARCHAR
        END,
        v_confidence,
        (v_win_prob * 10000)::DECIMAL, -- Placeholder expected value
        jsonb_build_array(
            jsonb_build_object('factor', 'historical_success_rate', 'value', v_historical_success_rate),
            jsonb_build_object('factor', 'data_completeness', 'value', v_completeness_factor)
        ),
        CASE
            WHEN v_win_prob > 0.7 AND v_confidence > 0.7 THEN 'Strong recommendation: proceed'
            WHEN v_win_prob > 0.5 THEN 'Moderate confidence: consider proceeding'
            WHEN v_win_prob > 0.3 THEN 'Caution: gather more context before acting'
            ELSE 'High risk: recommend alternative approach'
        END::TEXT;
END;
$$;
```

---

## C.4 Simulation API Example

```typescript
// services/simulation-engine.ts
interface SimulationResult {
  simulationId: string;
  primary: {
    winProbability: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    expectedValue: number;
    confidenceInterval: [number, number];
  };
  alternatives: {
    scenarioName: string;
    winProbability: number;
    recommendation: string;
  }[];
  recommendation: string;
  keyFactors: {
    factor: string;
    impact: number;
    description: string;
  }[];
}

async function simulateAction(
  tenantId: string,
  entityType: string,
  entityId: string,
  actionType: string,
  actionParams: Record<string, any>
): Promise<SimulationResult> {
  // Run quick simulation
  const result = await db.query(
    `SELECT * FROM run_quick_simulation($1, $2, $3, $4, $5)`,
    [tenantId, entityType, entityId, actionType, JSON.stringify(actionParams)]
  );
  
  return {
    simulationId: result.rows[0].simulation_id,
    primary: {
      winProbability: result.rows[0].win_probability,
      riskLevel: result.rows[0].risk_level,
      confidence: result.rows[0].confidence,
      expectedValue: result.rows[0].expected_value,
      confidenceInterval: [
        result.rows[0].win_probability - 0.1,
        result.rows[0].win_probability + 0.1
      ]
    },
    alternatives: [],
    recommendation: result.rows[0].recommendation,
    keyFactors: result.rows[0].key_factors
  };
}
```

---

# Part D: Reality Drift Detection

## D.1 Core Concept

**Problem**: Systems believe one thing while reality says another.
- Model thinks: Customer healthy
- Reality: Usage ↓, Tickets ↑, Stakeholder silent

**Solution**: Continuously compare model beliefs against reality signals.

---

## D.2 Drift Detection Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     REALITY DRIFT DETECTOR                               │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ MODEL BELIEFS (What system thinks)                                 │  │
│  │ ─────────────────────────────────────────────────────────────────  │  │
│  │ Source: Last insight, last score, last prediction                  │  │
│  │ Example: account.health_score = 0.82 (healthy)                     │  │
│  │          renewal_probability = 0.75 (likely)                       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                             ↕                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ REALITY SIGNALS (What's actually happening)                        │  │
│  │ ─────────────────────────────────────────────────────────────────  │  │
│  │ Source: Real-time spine data, recent events, external signals      │  │
│  │ Example: usage_trend = -30% (declining)                            │  │
│  │          support_tickets = 5 (up from 1)                           │  │
│  │          stakeholder_last_contact = 45 days ago                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                             ↓                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ DRIFT CALCULATION                                                  │  │
│  │ ─────────────────────────────────────────────────────────────────  │  │
│  │ Formula: drift_score = Σ |belief[i] - reality[i]| × weight[i]      │  │
│  │                                                                    │  │
│  │ Drift Thresholds:                                                  │  │
│  │   drift < 0.15  → ALIGNED (model matches reality)                  │  │
│  │   drift 0.15-0.30 → MINOR_DRIFT (review recommended)               │  │
│  │   drift 0.30-0.50 → SIGNIFICANT_DRIFT (immediate review)           │  │
│  │   drift > 0.50 → CRITICAL_DRIFT (model invalidated)                │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                             ↓                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ DRIFT RESPONSE                                                     │  │
│  │ ─────────────────────────────────────────────────────────────────  │  │
│  │ ALIGNED: Continue normal operations                                │  │
│  │ MINOR_DRIFT: Queue for next review cycle                          │  │
│  │ SIGNIFICANT_DRIFT: Trigger proactive alert + recompute             │  │
│  │ CRITICAL_DRIFT: Halt autonomous actions + human escalation         │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## D.3 Reality Drift Schema (PostgreSQL)

```sql
-- Migration: 043_reality_drift_detection.sql
-- Description: Reality Drift Detection System

-- =============================================================================
-- MODEL BELIEFS: Snapshot of what system believes
-- =============================================================================
CREATE TABLE IF NOT EXISTS model_beliefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    
    -- Entity reference
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Belief snapshot
    belief_type VARCHAR(50) NOT NULL, -- 'health_score', 'churn_risk', 'expansion_likelihood'
    belief_value DECIMAL(5,4) NOT NULL,
    belief_confidence DECIMAL(4,3),
    belief_reasoning TEXT,
    
    -- Source of belief
    source_insight_id UUID,
    source_prediction_id UUID,
    
    -- Validity
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    is_current BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_model_beliefs_entity ON model_beliefs(entity_type, entity_id);
CREATE INDEX idx_model_beliefs_current ON model_beliefs(entity_id, is_current) WHERE is_current = true;
CREATE INDEX idx_model_beliefs_tenant ON model_beliefs(tenant_id);

-- =============================================================================
-- REALITY SIGNALS: Current state observations
-- =============================================================================
CREATE TABLE IF NOT EXISTS reality_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    
    -- Entity reference
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Observation
    observation_type VARCHAR(50) NOT NULL, -- 'usage_trend', 'support_volume', 'engagement'
    observation_value DECIMAL(10,4) NOT NULL,
    observation_direction VARCHAR(20), -- 'increasing', 'decreasing', 'stable'
    observation_magnitude DECIMAL(5,4), -- How much change
    
    -- Context
    time_window_days INTEGER DEFAULT 30,
    comparison_baseline VARCHAR(30), -- 'previous_period', 'historical_avg', 'peer_benchmark'
    
    observed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reality_observations_entity ON reality_observations(entity_type, entity_id);
CREATE INDEX idx_reality_observations_tenant ON reality_observations(tenant_id);

-- =============================================================================
-- DRIFT EVENTS: Detected drift instances
-- =============================================================================
CREATE TABLE IF NOT EXISTS drift_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    
    -- Entity reference
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Drift details
    drift_score DECIMAL(4,3) NOT NULL CHECK (drift_score BETWEEN 0 AND 1),
    drift_severity VARCHAR(20) NOT NULL CHECK (drift_severity IN (
        'aligned', 'minor_drift', 'significant_drift', 'critical_drift'
    )),
    
    -- Comparison data
    beliefs_snapshot JSONB NOT NULL DEFAULT '[]',
    reality_snapshot JSONB NOT NULL DEFAULT '[]',
    delta_breakdown JSONB NOT NULL DEFAULT '[]', -- [{belief, reality, delta, weight}]
    
    -- Response tracking
    response_action VARCHAR(50),
    response_status VARCHAR(20) DEFAULT 'pending' CHECK (response_status IN (
        'pending', 'acknowledged', 'resolved', 'dismissed'
    )),
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    -- Impact
    affected_decisions UUID[] DEFAULT '{}',
    affected_predictions UUID[] DEFAULT '{}',
    
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drift_events_entity ON drift_events(entity_type, entity_id);
CREATE INDEX idx_drift_events_severity ON drift_events(drift_severity);
CREATE INDEX idx_drift_events_pending ON drift_events(response_status) WHERE response_status = 'pending';
CREATE INDEX idx_drift_events_tenant ON drift_events(tenant_id);

-- =============================================================================
-- DRIFT DETECTION RULES: Configurable drift detection
-- =============================================================================
CREATE TABLE IF NOT EXISTS drift_detection_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID, -- NULL = global default
    
    -- Rule identity
    rule_name VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    
    -- Belief-Reality mapping
    belief_type VARCHAR(50) NOT NULL,
    reality_observation_type VARCHAR(50) NOT NULL,
    comparison_function VARCHAR(30) NOT NULL, -- 'direct', 'inverse', 'threshold', 'trend'
    
    -- Thresholds
    minor_drift_threshold DECIMAL(4,3) DEFAULT 0.15,
    significant_drift_threshold DECIMAL(4,3) DEFAULT 0.30,
    critical_drift_threshold DECIMAL(4,3) DEFAULT 0.50,
    
    -- Weight in overall drift score
    weight DECIMAL(3,2) DEFAULT 1.0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- DRIFT DETECTION FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION detect_entity_drift(
    p_tenant_id UUID,
    p_entity_type VARCHAR,
    p_entity_id UUID
) RETURNS TABLE (
    drift_event_id UUID,
    drift_score DECIMAL,
    drift_severity VARCHAR,
    delta_breakdown JSONB
) LANGUAGE plpgsql AS $$
DECLARE
    v_drift_event_id UUID;
    v_beliefs JSONB;
    v_reality JSONB;
    v_deltas JSONB := '[]'::JSONB;
    v_total_drift DECIMAL := 0;
    v_total_weight DECIMAL := 0;
    v_drift_score DECIMAL;
    v_severity VARCHAR;
BEGIN
    -- Gather current beliefs
    SELECT jsonb_agg(jsonb_build_object(
        'type', mb.belief_type,
        'value', mb.belief_value,
        'confidence', mb.belief_confidence
    ))
    INTO v_beliefs
    FROM model_beliefs mb
    WHERE mb.entity_id = p_entity_id
      AND mb.is_current = true;
    
    -- Gather recent reality observations
    SELECT jsonb_agg(jsonb_build_object(
        'type', ro.observation_type,
        'value', ro.observation_value,
        'direction', ro.observation_direction
    ))
    INTO v_reality
    FROM reality_observations ro
    WHERE ro.entity_id = p_entity_id
      AND ro.observed_at > NOW() - INTERVAL '7 days';
    
    -- Calculate drift (simplified - production would use drift_detection_rules)
    -- For now, compare health_score belief against usage_trend reality
    SELECT 
        COALESCE(ABS(
            (SELECT (mb.belief_value) FROM model_beliefs mb 
             WHERE mb.entity_id = p_entity_id AND mb.belief_type = 'health_score' AND mb.is_current = true)
            -
            (SELECT COALESCE((ro.observation_value + 1) / 2, 0.5) FROM reality_observations ro 
             WHERE ro.entity_id = p_entity_id AND ro.observation_type = 'usage_trend'
             ORDER BY ro.observed_at DESC LIMIT 1)
        ), 0)
    INTO v_drift_score;
    
    -- Determine severity
    v_severity := CASE
        WHEN v_drift_score < 0.15 THEN 'aligned'
        WHEN v_drift_score < 0.30 THEN 'minor_drift'
        WHEN v_drift_score < 0.50 THEN 'significant_drift'
        ELSE 'critical_drift'
    END;
    
    -- Only create drift event if drift exists
    IF v_drift_score >= 0.15 THEN
        INSERT INTO drift_events (
            tenant_id, entity_type, entity_id,
            drift_score, drift_severity,
            beliefs_snapshot, reality_snapshot, delta_breakdown
        ) VALUES (
            p_tenant_id, p_entity_type, p_entity_id,
            v_drift_score, v_severity,
            COALESCE(v_beliefs, '[]'::JSONB),
            COALESCE(v_reality, '[]'::JSONB),
            v_deltas
        ) RETURNING id INTO v_drift_event_id;
    END IF;
    
    RETURN QUERY
    SELECT 
        v_drift_event_id,
        v_drift_score,
        v_severity,
        v_deltas;
END;
$$;

-- =============================================================================
-- VIEW: Drift Dashboard
-- =============================================================================
CREATE OR REPLACE VIEW v_drift_dashboard AS
SELECT
    de.tenant_id,
    de.entity_type,
    de.entity_id,
    de.drift_severity,
    de.drift_score,
    de.detected_at,
    de.response_status,
    CASE 
        WHEN de.drift_severity = 'critical_drift' THEN 1
        WHEN de.drift_severity = 'significant_drift' THEN 2
        WHEN de.drift_severity = 'minor_drift' THEN 3
        ELSE 4
    END AS priority_order
FROM drift_events de
WHERE de.response_status = 'pending'
ORDER BY priority_order, de.detected_at DESC;
```

---

# Part E: Adaptive Spine → Cognitive Brain Integration

## E.1 How Spine Feeds the Brain

```
┌──────────────────────────────────────────────────────────────────────────┐
│                 ADAPTIVE SPINE → COGNITIVE BRAIN FLOW                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ADAPTIVE SPINE (L3)                         COGNITIVE BRAIN (L2)        │
│                                                                          │
│  ┌──────────────────────┐                    ┌──────────────────────┐    │
│  │ spine_schema_registry│───────────────────→│ Trust Score Engine   │    │
│  │ (field observations) │  field_stability   │ (field_stability_    │    │
│  │                      │  + data_types      │  score component)    │    │
│  └──────────────────────┘                    └──────────────────────┘    │
│                                                                          │
│  ┌──────────────────────┐                    ┌──────────────────────┐    │
│  │ spine_entity_        │───────────────────→│ Trust Score Engine   │    │
│  │ completeness         │  completeness_     │ (data_completeness_  │    │
│  │                      │  score             │  score component)    │    │
│  └──────────────────────┘                    └──────────────────────┘    │
│                                                                          │
│  ┌──────────────────────┐                    ┌──────────────────────┐    │
│  │ spine_entity_        │───────────────────→│ Simulation Engine    │    │
│  │ completeness         │  maturity_level    │ (confidence          │    │
│  │ (layer_level)        │  (L1/L2/L3)        │  adjustment)         │    │
│  └──────────────────────┘                    └──────────────────────┘    │
│                                                                          │
│  ┌──────────────────────┐                    ┌──────────────────────┐    │
│  │ spine_expected_      │───────────────────→│ Reality Drift        │    │
│  │ fields               │  baseline          │ (belief vs reality   │    │
│  │                      │  expectations      │  calibration)        │    │
│  └──────────────────────┘                    └──────────────────────┘    │
│                                                                          │
│  ┌──────────────────────┐                    ┌──────────────────────┐    │
│  │ bucket_state         │───────────────────→│ Decision Memory      │    │
│  │ (SEEDED → LIVE)      │  data_readiness    │ (evidence_snapshot   │    │
│  │                      │  signals           │  completeness)       │    │
│  └──────────────────────┘                    └──────────────────────┘    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## E.2 Integration Functions

```sql
-- =============================================================================
-- SPINE → BRAIN INTEGRATION FUNCTIONS
-- =============================================================================

-- Function: Get entity readiness for Cognitive Brain
CREATE OR REPLACE FUNCTION get_entity_brain_readiness(
    p_tenant_id UUID,
    p_entity_type VARCHAR,
    p_entity_id UUID
) RETURNS TABLE (
    completeness_score INTEGER,
    layer_level INTEGER,
    field_stability DECIMAL,
    bucket_state VARCHAR,
    is_brain_ready BOOLEAN,
    missing_for_brain TEXT[]
) LANGUAGE plpgsql AS $$
DECLARE
    v_completeness INTEGER;
    v_layer INTEGER;
    v_stability DECIMAL;
    v_bucket_state VARCHAR;
    v_missing TEXT[] := '{}';
BEGIN
    -- Get completeness
    SELECT sec.completeness_score, sec.layer_level
    INTO v_completeness, v_layer
    FROM spine_entity_completeness sec
    WHERE sec.entity_id = p_entity_id;
    
    -- Get field stability
    SELECT 1 - COALESCE(
        AVG(CASE WHEN ssr.occurrence_count > 0 
            THEN ssr.null_count::DECIMAL / ssr.occurrence_count 
            ELSE 0 END
        ), 0)
    INTO v_stability
    FROM spine_schema_registry ssr
    WHERE ssr.tenant_id = p_tenant_id
      AND ssr.entity_type = p_entity_type;
    
    -- Determine what's missing for brain readiness
    IF COALESCE(v_completeness, 0) < 60 THEN
        v_missing := array_append(v_missing, 'completeness_below_60');
    END IF;
    IF COALESCE(v_layer, 1) < 2 THEN
        v_missing := array_append(v_missing, 'layer_below_L2');
    END IF;
    IF COALESCE(v_stability, 0) < 0.7 THEN
        v_missing := array_append(v_missing, 'field_stability_below_70');
    END IF;
    
    RETURN QUERY
    SELECT 
        COALESCE(v_completeness, 0),
        COALESCE(v_layer, 1),
        COALESCE(v_stability, 0.5),
        COALESCE(v_bucket_state, 'OFF'),
        (COALESCE(v_completeness, 0) >= 60 AND 
         COALESCE(v_layer, 1) >= 2 AND 
         COALESCE(v_stability, 0) >= 0.7),
        v_missing;
END;
$$;

-- Function: Record decision with spine context
CREATE OR REPLACE FUNCTION record_decision_with_spine(
    p_tenant_id UUID,
    p_entity_type VARCHAR,
    p_entity_id UUID,
    p_decision_type VARCHAR,
    p_decision_domain VARCHAR,
    p_decision_title VARCHAR,
    p_decided_by UUID,
    p_action_type VARCHAR,
    p_action_params JSONB
) RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
    v_decision_id UUID;
    v_evidence_snapshot JSONB;
    v_evidence_hash VARCHAR(64);
    v_completeness INTEGER;
    v_layer INTEGER;
BEGIN
    -- Build evidence snapshot from spine
    SELECT jsonb_build_object(
        'completeness', sec.completeness_score,
        'layer_level', sec.layer_level,
        'fields_present', sec.fields_present,
        'snapshot_time', NOW()
    ), sec.completeness_score, sec.layer_level
    INTO v_evidence_snapshot, v_completeness, v_layer
    FROM spine_entity_completeness sec
    WHERE sec.entity_id = p_entity_id;
    
    -- Generate hash
    v_evidence_hash := encode(sha256(v_evidence_snapshot::TEXT::BYTEA), 'hex');
    
    -- Create decision record
    INSERT INTO decision_memory (
        tenant_id, entity_type, entity_id,
        decision_type, decision_domain, decision_title,
        evidence_snapshot, evidence_hash,
        decided_by, approval_mode,
        action_type, action_params
    ) VALUES (
        p_tenant_id, p_entity_type, p_entity_id,
        p_decision_type, p_decision_domain, p_decision_title,
        COALESCE(v_evidence_snapshot, '{}'::JSONB), COALESCE(v_evidence_hash, 'no_spine_data'),
        p_decided_by, 'manual',
        p_action_type, p_action_params
    ) RETURNING id INTO v_decision_id;
    
    RETURN v_decision_id;
END;
$$;
```

---

# Part F: Complete Cognitive Brain Runtime

## F.1 The Cognitive Loop (Enhanced)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    COGNITIVE BRAIN RUNTIME LOOP                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   1. EVIDENCE PULL (from Adaptive Spine)                                 │
│      └─ spine_entity_completeness, field observations                    │
│                             ↓                                            │
│   2. REALITY OBSERVATION                                                 │
│      └─ Capture current reality_observations                             │
│                             ↓                                            │
│   3. DRIFT CHECK                                                         │
│      └─ detect_entity_drift() → Compare beliefs vs reality               │
│      └─ If CRITICAL_DRIFT → Halt + Escalate                              │
│                             ↓                                            │
│   4. SIGNAL GENERATION                                                   │
│      └─ Existing signal engine produces signals                          │
│                             ↓                                            │
│   5. INSIGHT FORMATION                                                   │
│      └─ Bridge fusion from spine + context + knowledge                   │
│                             ↓                                            │
│   6. DECISION CONTEXT BUILD                                              │
│      └─ find_similar_decisions() → Historical pattern matching           │
│      └─ get_org_decision_dna() → Org reasoning patterns                  │
│                             ↓                                            │
│   7. SIMULATION                                                          │
│      └─ run_quick_simulation() → Predict outcomes                        │
│                             ↓                                            │
│   8. TRUST CHECK                                                         │
│      └─ compute_trust_score() → Determine autonomy level                 │
│                             ↓                                            │
│   9. POLICY EVALUATION                                                   │
│      └─ RBAC + governance checks                                         │
│                             ↓                                            │
│   10. ACTION PROPOSAL                                                    │
│       └─ Generate action with simulation predictions                     │
│                             ↓                                            │
│   11. HUMAN APPROVAL GATE                                                │
│       └─ Based on trust_score autonomy_level                             │
│       └─ If 'autonomous' → Auto-execute                                  │
│       └─ If 'suggestions' → Wait for human                               │
│                             ↓                                            │
│   12. EXECUTION                                                          │
│       └─ Action runs via MCP/Tools                                       │
│                             ↓                                            │
│   13. DECISION RECORDING                                                 │
│       └─ record_decision_with_spine() → Full decision memory             │
│                             ↓                                            │
│   14. OUTCOME TRACKING (Async)                                           │
│       └─ After time_horizon: measure actual_outcome                      │
│       └─ Update decision_memory.was_correct                              │
│                             ↓                                            │
│   15. SIGNAL ACCURACY FEEDBACK                                           │
│       └─ Evaluate signal accuracy → signal_accuracy_log                  │
│                             ↓                                            │
│   16. PATTERN EXTRACTION                                                 │
│       └─ Extract successful patterns → decision_patterns                 │
│                             ↓                                            │
│   17. TRUST RECALIBRATION                                                │
│       └─ Update trust_scores with new data                               │
│                             ↓                                            │
│   18. MODEL UPDATE                                                       │
│       └─ Update model_beliefs based on outcomes                          │
│       └─ → LOOP RETURNS TO STEP 1                                        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## F.2 TypeScript Service Interface

```typescript
// services/cognitive-brain.ts

interface CognitiveBrainService {
  // Decision Memory
  findSimilarDecisions(context: DecisionContext): Promise<PastDecision[]>;
  getOrgDecisionDNA(domain?: string): Promise<OrgDNA>;
  recordDecision(decision: DecisionRecord): Promise<string>;
  updateDecisionOutcome(decisionId: string, outcome: Outcome): Promise<void>;
  
  // Trust Scoring
  computeTrustScore(scope: TrustScope): Promise<TrustScore>;
  checkAutonomyLevel(action: ProposedAction): Promise<AutonomyCheck>;
  
  // Simulation
  simulateAction(proposal: ActionProposal): Promise<SimulationResult>;
  compareScenarios(scenarios: Scenario[]): Promise<ScenarioComparison>;
  
  // Drift Detection
  detectDrift(entityId: string): Promise<DriftEvent | null>;
  acknowledgeeDrift(driftId: string, notes: string): Promise<void>;
  
  // Signal Accuracy
  evaluateSignalAccuracy(signalId: string, wasAccurate: SignalAccuracy): Promise<void>;
  getSignalAccuracyTrend(signalType: string): Promise<AccuracyTrend>;
  
  // Pattern Learning
  extractPatterns(decisions: Decision[]): Promise<Pattern[]>;
  matchPattern(context: DecisionContext): Promise<PatternMatch | null>;
}

// Example usage in action proposal flow
async function proposeAction(
  entityId: string,
  actionType: string,
  actionParams: Record<string, any>
): Promise<ActionProposal> {
  const brain = getCognitiveBrainService();
  
  // 1. Check for drift
  const drift = await brain.detectDrift(entityId);
  if (drift?.drift_severity === 'critical_drift') {
    throw new DriftBlockError('Critical drift detected - manual review required');
  }
  
  // 2. Find similar past decisions
  const pastDecisions = await brain.findSimilarDecisions({
    entityId,
    actionType,
    signals: currentSignals
  });
  
  // 3. Run simulation
  const simulation = await brain.simulateAction({
    entityId,
    actionType,
    actionParams,
    historicalContext: pastDecisions
  });
  
  // 4. Check trust
  const trust = await brain.checkAutonomyLevel({
    entityId,
    actionType,
    simulatedRisk: simulation.primary.riskLevel
  });
  
  // 5. Build proposal
  return {
    actionType,
    actionParams,
    simulation,
    trustCheck: trust,
    pastDecisions,
    recommendedApprovalMode: trust.autonomyLevel,
    driftWarning: drift?.drift_severity === 'significant_drift' ? drift : null
  };
}
```

---

# Part G: Migration Plan

## G.1 Phase 1: Foundation (Week 1-2)

1. Deploy `040_decision_memory.sql`
2. Deploy `041_trust_score_engine.sql`
3. Update `approval_queue` to include trust scores
4. Wire Decision Memory to existing action execution

## G.2 Phase 2: Simulation (Week 3-4)

1. Deploy `042_simulation_engine.sql`
2. Create simulation models for key domains (renewal, churn, expansion)
3. Integrate simulation into action proposal flow
4. Add simulation results to Evidence Drawer UI

## G.3 Phase 3: Drift Detection (Week 5-6)

1. Deploy `043_reality_drift_detection.sql`
2. Set up drift detection rules for key entity types
3. Create Proactive Twin drift monitoring job
4. Add drift alerts to L1 signal feed

## G.4 Phase 4: Learning Loop (Week 7-8)

1. Implement outcome tracking async jobs
2. Build pattern extraction from successful decisions
3. Create trust score recalibration pipeline
4. Add org DNA dashboard to Business View

---

# Summary

## What You Now Have

| Component | Purpose | Key Tables |
|-----------|---------|------------|
| **Decision Memory** | Org learns HOW leadership thinks | `decision_memory`, `decision_patterns`, `decision_embeddings` |
| **Trust Engine** | Controls autonomy unlock safely | `trust_scores`, `signal_accuracy_log` |
| **Simulation Engine** | Predict before acting | `simulation_requests`, `outcome_predictions`, `simulation_models` |
| **Drift Detection** | Model ≠ reality alerts | `model_beliefs`, `reality_observations`, `drift_events` |

## The Result

You are no longer building:
- ❌ AI Workspace
- ❌ Cognitive Workspace
- ❌ Knowledge OS

You are building:
- ✅ **Enterprise Reasoning OS**
- ✅ **Organizational Brain**
- ✅ **Self-Improving Decision Engine**

## Why You Win

None of the major players model organizational cognition:
- Salesforce AI → Pattern matching on CRM data
- Snowflake AI → Analytics aggregation
- Notion AI → Document assistance
- Copilot → Task automation

IntegrateWise with Cognitive Brain:
→ Learns how YOUR org makes decisions
→ Predicts outcomes before acting
→ Self-improves with every decision
→ Safely unlocks autonomy based on trust

**That is category-defining.**
