# Frontend-Backend Wiring Status

**Date**: 2026-02-11  
**Scope**: Wire frontend (app) to backend services

---

## Summary

Marketing site removed from main app structure. Focused on wiring the actual application (`(app)`) to backend services.
**Source**: Frontend components provided via Figma Make export.

---

## Wiring Completed

### 1. L3→L2 Wiring (Cognitive Triggers)

| Component | API | Backend Service |
|-----------|-----|-----------------|
| `CognitiveEventListener` | `/api/events/cognitive` | loader, normalizer |
| `cognitive-triggers.tsx` | SSE events | spine-v2 |

**What it does**: Auto-opens L2 drawer when data ingestion completes, showing completeness scores.

### 2. L2→L1 Wiring (Completeness Badges)

| Component | API | Backend Service |
|-----------|-----|-----------------|
| `EntityCardWithBadges` | `/api/spine/completeness` | spine-v2 |
| `useSpineCompleteness` | `/api/spine/completeness` | spine-v2 |

**What it does**: Shows 🟢🟡🔴 completeness badges on entity cards in L1 workspace.

### 3. Memory Triage Wiring

| Component | API | Backend Service |
|-----------|-----|-----------------|
| `MemoryTriageClient` | `POST /triage` | memory-consolidator |
| `useMemoryTriage` | `POST /triage` | memory-consolidator |

**What it does**: Extracts facts/decisions/patterns from AI sessions → shared memory pool.

---

## Pages Wired

| Page | Hook | API Route | Backend Service | Status |
|------|------|-----------|-----------------|--------|
| `/personal/today` | `useHomeData` | `/api/today/stats` | Multiple | ✅ Wired |
| `/personal/signals` | `useSignals` | `/api/signals` | think, cognitive-brain | ✅ Wired |
| `/personal/spine` | `useSpineCompleteness` | `/api/spine/completeness` | spine-v2 | ✅ Wired |
| `/personal/knowledge` | `useKnowledge` | `/api/knowledge` | knowledge | ✅ Hook created |

---

## API Routes Created

```
apps/web/src/app/api/
├── events/
│   └── cognitive/route.ts          # SSE for real-time cognitive events
├── spine/
│   └── completeness/route.ts       # Entity completeness scores
└── knowledge/                       # (existing)
    └── route.ts
```

---

## Hooks Created

```
apps/web/src/hooks/
├── useSpineCompleteness.ts         # L2→L1 wiring
├── useKnowledge.ts                 # Knowledge service integration
└── useMemoryTriage.ts (in lib)     # Memory triage client
```

---

## Components Created

```
apps/web/src/components/
├── cognitive/
│   └── cognitive-triggers.tsx      # L3→L2 auto-trigger
└── workspace/
    └── entity-card-with-badges.tsx # L2→L1 badges
```

---

## Backend Services Connection Map

| Service | Frontend Hook | API Route | Status |
|---------|---------------|-----------|--------|
| **loader** | `useHomeData` | `/api/today/stats` | ✅ Connected |
| **normalizer** | EventSource | `/api/events/cognitive` | ✅ Connected |
| **spine-v2** | `useSpineCompleteness` | `/api/spine/completeness` | ✅ Connected |
| **knowledge** | `useKnowledge` | `/api/knowledge` | ✅ Hook ready |
| **think** | `useSignals` | `/api/signals` | ✅ Connected |
| **cognitive-brain** | `useSignals` | `/api/signals` | ✅ Connected |
| **memory-consolidator** | `useMemoryTriage` | `POST /triage` | ⚠️ Service skeleton |
| **act** | - | `/api/act/*` | ✅ API exists |
| **govern** | - | `/api/govern/*` | ✅ API exists |
| **iq-hub** | - | `/api/iq-hub/*` | ✅ API exists |

---

## Remaining Wiring Tasks

### High Priority

1. **Wire Tasks Page** (`/personal/tasks`)
   - Hook: Create `useTasks`
   - API: `/api/entities/tasks`
   - Service: spine-v2

2. **Wire Accounts Page** (`/accounts`)
   - Hook: Use `useSpineCompleteness`
   - API: `/api/entities/accounts`
   - Service: spine-v2

3. **Wire Knowledge Page** (`/personal/knowledge`)
   - Hook: `useKnowledge` (created)
   - API: `/api/knowledge`
   - Service: knowledge

4. **Wire Evidence Page** (`/personal/evidence`)
   - Hook: `useEvidence` (exists)
   - API: `/api/evidence/*`
   - Service: think

### Medium Priority

1. **Wire Act/Approvals** (`/personal/approvals`)
   - Hook: `useExecution` (exists)
   - API: `/api/act/*`, `/api/govern/*`
   - Service: act, govern

2. **Wire IQ Hub** (`/iq-hub`)
   - Hook: `useSession`
   - API: `/api/iq-hub/*`
   - Service: iq-hub

3. **Wire Admin Pages**
   - Hook: Create admin hooks
   - API: `/api/admin/*`
   - Service: admin

### Low Priority (Skeleton Services)

1. **Memory Consolidator**
   - Service is skeleton - needs implementation
   - Then wire `useMemoryTriage` hook

2. **Orchestrator**
   - Service is empty - needs implementation

---

## Testing the Wiring

### Test L3→L2 Trigger

```bash
# Trigger an ingestion event
curl -X POST http://localhost:3000/api/events/cognitive \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ingestion_complete",
    "payload": {
      "entityId": "acc_001",
      "completeness": 0.65,
      "missingFields": ["industry"]
    }
  }'
```

### Test L2→L1 Badges

```bash
# Check completeness scores
curl http://localhost:3000/api/spine/completeness?entityIds=acc_001,acc_002
```

### Test Signals

```bash
# Fetch signals
curl http://localhost:3000/api/signals?scope=operations
```

---

## Next Steps

1. Implement remaining high priority page wiring
2. Add error handling and loading states
3. Implement real-time updates via SSE
4. Deploy memory-consolidator service
5. Add integration tests

---

## Files Modified/Created

### Created

- `apps/web/src/components/cognitive/cognitive-triggers.tsx`
- `apps/web/src/components/workspace/entity-card-with-badges.tsx`
- `apps/web/src/hooks/useSpineCompleteness.ts`
- `apps/web/src/hooks/useKnowledge.ts`
- `apps/web/src/lib/memory-triage.ts`
- `apps/web/src/app/api/events/cognitive/route.ts`
- `apps/web/src/app/api/spine/completeness/route.ts`

### Modified

- `apps/web/src/app/(app)/layout.tsx` - Added CognitiveEventListener
- `apps/web/src/app/(app)/personal/signals/page.tsx` - Wired to useSignals
- `apps/web/src/app/(app)/personal/spine/page.tsx` - Wired to useSpineCompleteness

### Removed

- `apps/web/src/app/marketing/*` - Moved to backup

---

**Status**: Core wiring (L3→L2→L1) is complete. Remaining work is page-specific wiring.
