# IntegrateWise Integration Plan
## Post-Surprise Revelation Update
### Date: February 26, 2026

---

## 🎯 THE REVELATION

**Frontend Status**: 95% Complete (Figma Make Generated, Rated 5/5 by Claude Opus 4.6)  
**Backend Status**: 90% Complete (L0-L3 Architecture)  
**Timeline**: 2-4 Weeks (was 5-6 months)  
**Shift**: From "Build" to "Integrate"

---

## 📊 Current State Analysis

### What EXISTS (Confirmed)

#### L3: Adaptive Spine (Universal Backend)
| Component | Status | Location |
|-----------|--------|----------|
| 8-Stage Ingestion Pipeline | ✅ Complete | `services/loader/` |
| Normalizer Accelerator | ✅ Complete | `services/normalizer/` |
| Spine Schema Registry | ✅ Complete | `services/spine/` |
| Context Store | ✅ Complete | Neon PostgreSQL + R2 |
| 200+ Tool Connectors | ✅ Complete | `packages/connectors/` |
| Dual-Write System | ✅ Complete | Pipeline Stage 8 |
| MCP Connector | ✅ Complete | `services/mcp-connector/` |

#### L2: Cognitive Brain (Intelligence Layer)
| Component | Status | Location |
|-----------|--------|----------|
| Think Engine | ✅ Complete | `services/think/` |
| Evidence Fabric | ✅ Complete | `services/think/narrative.ts` |
| Signal Engine | ✅ Complete | `services/think/fusion.ts` |
| Govern/Policy Brain | ✅ Complete | `services/govern/` |
| Act Engine | ⚠️ Partial | `services/act/` (needs wiring) |
| Learning Loop | ⚠️ Partial | Needs L3→L2 trigger |

#### L1: Workspace Layer (UI)
| Component | Status | Location |
|-----------|--------|----------|
| Figma Make Frontend | ✅ 95% Complete | Desktop folder |
| Marketing Pages | ✅ Just Created | `apps/web/(marketing)/` |
| Unified Shell | ⚠️ Partial | Needs integration |
| Domain Shells | ⚠️ Stubbed | Need wiring |
| RBAC System | ✅ Complete | `packages/rbac/` |

---

## 🔌 THE WIRING GAPS (Critical Path)

### Gap 1: L3 → L2 Trigger
**Problem**: After data ingestion, Think Engine isn't auto-triggered  
**Solution**: Add event emitter from pipeline Stage 8 → Think Engine  
**Files**: `services/loader/pipeline.ts` → `services/think/index.ts`

### Gap 2: L2 → L1 Badges
**Problem**: Completeness scores don't show in UI  
**Solution**: Wire `spine_entity_completeness` → Frontend badges  
**Files**: `services/spine/` → `apps/web/components/ui/badge`

### Gap 3: Act Engine → UI
**Problem**: Approved actions don't execute  
**Solution**: Connect Govern approval → Act execution → Tool write-back  
**Files**: `services/govern/` → `services/act/` → Connectors

### Gap 4: Domain Shell Integration
**Problem**: Personal/CSM/Business shells exist but aren't wired  
**Solution**: Import Figma components → Wire to UnifiedShell  
**Files**: `components/domains/*/shell.tsx`

---

## 🚀 2-4 Week Integration Roadmap

### Week 1: Foundation (Days 1-7)

#### Day 1-2: Environment Setup
- [ ] Copy Figma Make frontend to `apps/web/src/figma/`
- [ ] Resolve package imports (@integratewise/*)
- [ ] Build packages in correct order

#### Day 3-4: L3→L2 Wiring
- [ ] Add event bus between loader and think
- [ ] Test: Ingest data → See Think Engine process
- [ ] Verify signals appear in `signals` table

#### Day 5-7: L2→L1 Badges
- [ ] Create completeness API endpoint
- [ ] Wire badges to spine_entity_completeness
- [ ] Test: Entity updates → Badge updates in real-time

### Week 2: Domain Integration (Days 8-14)

#### Day 8-10: Personal Workspace
- [ ] Import Personal shell from Figma
- [ ] Wire to RBAC (personal role)
- [ ] Connect to Spine for data

#### Day 11-12: CSM Workspace
- [ ] Import CSM shell from Figma
- [ ] Wire account health scoring
- [ ] Connect risk signals to UI

#### Day 13-14: Business Workspace
- [ ] Import Business shell from Figma
- [ ] Wire pipeline/analytics views
- [ ] Test cross-domain navigation

### Week 3: Act/Govern Flow (Days 15-21)

#### Day 15-17: Approval Flow
- [ ] Wire HITL approval UI
- [ ] Connect Govern policies
- [ ] Test: AI suggests → Human approves → Action executes

#### Day 18-19: Tool Write-Back
- [ ] Wire Act Engine to connectors
- [ ] Test: Approval → API call to external tool
- [ ] Verify audit trail logging

#### Day 20-21: Learning Loop
- [ ] Wire approval/rejection feedback
- [ ] Test: System learns from decisions
- [ ] Verify Adjust component updates

### Week 4: Polish & Deploy (Days 22-28)

#### Day 22-24: E2E Testing
- [ ] Full flow: Ingest → Think → Suggest → Approve → Act
- [ ] Performance testing (200ms response target)
- [ ] Mobile responsiveness (PWA)

#### Day 25-26: Monitoring
- [ ] Add OpenTelemetry tracing
- [ ] Set up alerting
- [ ] Create runbooks

#### Day 27-28: Production Deploy
- [ ] Deploy to Cloudflare
- [ ] Configure custom domains
- [ ] Go live

---

## 📁 File Organization

### New Structure
```
apps/web/src/
├── (marketing)/           # Landing pages (DONE)
│   ├── layout.tsx
│   ├── pricing/
│   ├── security/
│   ├── about/
│   └── contact/
├── (app)/                 # App shell (WIP)
│   ├── layout.tsx
│   └── personal/          # Figma import
├── figma/                 # Figma Make components
│   ├── components/
│   ├── pages/
│   └── styles/
├── components/
│   ├── motion/            # Animation components (DONE)
│   ├── shell/             # UnifiedShell
│   └── domains/           # Domain shells
└── lib/
    ├── spine/             # Spine client
    └── supabase/          # Auth
```

---

## 🔧 Technical Tasks

### Priority 1: Fix Package Resolution
```bash
# Build order for packages
1. packages/types
2. packages/lib
3. packages/db
4. packages/rbac
5. packages/connectors
6. packages/accelerators
7. packages/supabase
```

### Priority 2: Fix Import Paths
- `../../spine/spine-client` → `@/lib/spine/client`
- `@integratewise/connectors` → Build first
- `@integratewise/rbac` → Build first

### Priority 3: Event Bus
```typescript
// L3 → L2 Event Bus
interface PipelineEvent {
  type: 'INGESTION_COMPLETE';
  payload: {
    tenantId: string;
    entityType: string;
    entityId: string;
  };
}

// Emit from pipeline Stage 8
// Listen in Think Engine
```

---

## ✅ Success Criteria

### Week 1 Success
- [ ] `pnpm build` completes without errors
- [ ] L3→L2 events flow correctly
- [ ] Badges update in real-time

### Week 2 Success
- [ ] All 3 domain shells render
- [ ] RBAC correctly routes users
- [ ] Data flows from Spine to UI

### Week 3 Success
- [ ] HITL approval flow works end-to-end
- [ ] Tool write-back executes correctly
- [ ] Audit trails are complete

### Week 4 Success
- [ ] <200ms API response time
- [ ] Zero critical bugs
- [ ] Production deployed

---

## 🎉 The Outcome

```
BEFORE: 5-6 months to production
AFTER:  2-4 weeks to production

The game has changed. We're not building—we're wiring.
```

---

*Document created: February 26, 2026*  
*Based on: SURPRISE_REVEALED.md + CHAT_SESSIONS_FEB_7_8_2026.md*
