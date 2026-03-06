# Documentation Consolidation Plan

**Estimated Time**: 2-3 hours  
**Target**: 123 → ~35 markdown files (72% reduction)

---

## Quick Wins (Execute in Order)

### Phase 1: Delete Archive Junk (5 min)
```bash
# Delete 43 of 46 files in docs/archive/
# KEEP: .gitkeep, 2024-12-01_SNAPSHOT.md, MONOREPO_RESTRUCTURE_LOG.md
# DELETE: Everything else (2.3 MB of outdated content)
```

### Phase 2: Merge Deployment Docs (30 min)
| Merge These | Into | Result |
|-------------|------|--------|
| `DEPLOYMENT_COMPLETE.md` + `PRODUCTION_LIVE.md` + `STAGING_DEPLOYMENT_SUMMARY.md` | `DEPLOYMENT_STATUS.md` | Single status doc |
| `DOPPLER_INTEGRATION_COMPLETE.md` + `DOPPLER_WEB_SETUP.md` | `DOPPLER_SETUP.md` | Unified secrets guide |
| `CLOUDFLARE_DEPLOYMENT.md` | Append to `DEPLOYMENT_STATUS.md` | Too small (1KB) to keep separate |

**Keep standalone:** `PRODUCTION_DEPLOYMENT_SPEC.md`, `DEPLOYMENT_CHECKLIST.md`, `ADAPTIVE_SPINE_GUIDE.md`, `BUCKETS_IMPLEMENTATION.md`, `GOOGLE_SHEETS_SETUP.md`

### Phase 3: Merge Architecture Docs (30 min)
| Merge These | Into | Result |
|-------------|------|--------|
| `LAYER_ARCHITECTURE_DEFINED.md` + `ARCHITECTURE_COMPARISON.md` | `SYSTEM_ARCHITECTURE.md` | Unified architecture |
| `docs/spine/*.md` (2 files) | `SPINE_ARCHITECTURE.md` | Merge spine/ into architecture/ |
| `UNIVERSAL_BACKEND_AUDIT.md` | `SYSTEM_REVIEW.md` | Small file, merge in |

**Keep standalone:** `INTEGRATEWISE_OS_CANONICAL_MODEL.md`, `SYSTEM_REVIEW.md`, `L1_WORKSPACE_STANDARD.md`

### Phase 4: Clean Guides (15 min)
| Action | File |
|--------|------|
| Delete | `UI_WIRING_COMPLETE.md` (superseded by v2) |
| Rename | `UI_LAYER_WIRING_COMPLETE_v2.md` → `UI_WIRING_COMPLETE.md` |
| Merge | `MEASUREMENT.md` → `TRACING.md` (613 bytes) |

**Keep:** `QUICK_REFERENCE.md`, `ROUTE_MAP.md`, `PARALLEL_SPINE_SETUP.md`, `TRACING.md`, `LAYOUT_AUDIT_REPORT.md`

### Phase 5: Root Cleanup (45 min)

**Move to `docs/project/`:**
| Current | New Name |
|---------|----------|
| `PENDING_NEXT_STEPS.md` | `ROADMAP.md` |
| `IMPLEMENTATION_STATUS.md` | `STATUS.md` |
| `COMPLETION_SUMMARY.md` | `MILESTONES.md` |
| `VERSION_HISTORY_ANALYSIS.md` | `VERSION_HISTORY.md` |

**Delete (completed work):**
- `STEP_BY_STEP_FIX.md`
- `ROOT_CLEANUP.md` (empty)
- Any duplicate copies already moved to docs/

---

## Final Structure

```
docs/
├── README.md                           # Master index
├── architecture/
│   ├── README.md
│   ├── SYSTEM_ARCHITECTURE.md          # merged
│   ├── SPINE_ARCHITECTURE.md           # merged
│   ├── SYSTEM_CANONICAL_MODEL.md       # was INTEGRATEWISE_OS_...
│   ├── SYSTEM_REVIEW.md                # merged
│   └── L1_WORKSPACE_STANDARD.md
├── deployment/
│   ├── README.md
│   ├── DEPLOYMENT_STATUS.md            # merged
│   ├── PRODUCTION_DEPLOYMENT_SPEC.md
│   ├── DEPLOYMENT_CHECKLIST.md
│   ├── ADAPTIVE_SPINE_GUIDE.md
│   ├── BUCKETS_IMPLEMENTATION.md
│   ├── DOPPLER_SETUP.md                # merged
│   └── GOOGLE_SHEETS_SETUP.md
├── guides/
│   ├── README.md
│   ├── QUICK_REFERENCE.md
│   ├── ROUTE_MAP.md
│   ├── PARALLEL_SPINE_SETUP.md
│   ├── TRACING.md                      # merged
│   ├── LAYOUT_AUDIT_REPORT.md
│   └── UI_WIRING_COMPLETE.md
├── operations/
│   └── (existing files)
├── project/                            # NEW
│   ├── ROADMAP.md
│   ├── STATUS.md
│   ├── MILESTONES.md
│   └── VERSION_HISTORY.md
└── archive/
    ├── .gitkeep
    ├── 2024-12-01_SNAPSHOT.md
    └── MONOREPO_RESTRUCTURE_LOG.md
```

**Total: ~35 files** (was 123)

---

## Execution Checklist

- [ ] Phase 1: Delete archive/ files (keep 3)
- [ ] Phase 2: Merge deployment docs
- [ ] Phase 3: Merge architecture docs, delete spine/ dir
- [ ] Phase 4: Clean guides
- [ ] Phase 5: Move root files, create docs/project/
- [ ] Update docs/README.md with new structure
- [ ] Commit: `docs: consolidate documentation (123→35 files)`

---

## Files Being Deleted

| Count | Location | Bytes Saved |
|-------|----------|-------------|
| 43 | docs/archive/ | ~2.3 MB |
| 5 | docs/deployment/ | ~15 KB |
| 3 | docs/architecture/ | ~20 KB |
| 2 | docs/guides/ | ~5 KB |
| 30+ | Root level | ~200 KB |

**Total: ~2.5 MB removed**
