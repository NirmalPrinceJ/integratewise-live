# IntegrateWise Deployment Program

This document outlines the environment strategy and promotion rules for the IntegrateWise Intelligence OS.

## 1. Environment Topology

| Layer | Development (dev) | Staging (staging) | Production (prod) |
|-------|-------------------|-------------------|-------------------|
| **Database (Neon)** | `neondb-dev` | `neondb-staging` | `neondb-prod` |
| **Compute (Workers)**| `*-dev.workers.dev` | `*-staging.workers.dev`| `api.*.co` |
| **Auth (Firebase)** | `iw-os-dev` | `iw-os-staging` | `iw-os-prod` |
| **Storage (Vercel)** | `iw-oss-dev` | `iw-oss-staging` | `integratewise.co` |

## 2. Promotion Workflow

1. **Feature Branch**:
   - Commit triggers `dev` pipeline.
   - Automatic migrations (if non-breaking).
   - Health check smoke tests.
2. **Merge to `main`**:
   - Triggers `staging` pipeline.
   - Manual sign-off required for breaking migrations.
   - UI validation loop.
3. **Internal Release (Internal Tenants)**:
   - Gradual rollout of feature flags to "Internal" segment in Production.
4. **General Availability (GA)**:
   - Change `tenants.enabled_modules` to include the new OS module.

## 3. Migration Safety Rules

- **Zero-Downtime Only**: No `DROP` or `RENAME` without two-cycle release (add nullable -> migrate data -> drop old).
- **Branch Verification**: All migrations MUST be verified against a Neon branch copy of Production before merge.
- **Backpressure**: Deployment pipelines are paused if `connector_failures` or `normalization_errors` alert thresholds are breached.

## 4. SLOs (Service Level Objectives)

- **Near Real-Time**: `stripe.*`, `incident.*`, `lead.upsert` must hit the Spine in < 15 seconds.
- **Batch**: `health_score`, `drift_metrics` recomputed every 6 hours.
- **Availability**: 99.9% for Gateway and Act layers.
