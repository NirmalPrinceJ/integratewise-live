# Copilot & AI Agent Instructions for IntegrateWise OS

## Architecture & Data Flow
- The core of the system is a universal 8-stage ingestion pipeline (see `src/services/ingestion/README.md`). All connector data (Salesforce, Slack, etc.) flows through this deterministic pipeline:
  1. **Analyzer**: Fingerprint, envelope
  2. **Classifier**: data_kind, domain, sensitivity (uses `tool-mappings.ts`)
  3. **Filter**: RBAC, deduplication, quotas
  4. **Refiner**: Split units, extract IDs
  5. **Extractor**: Structured/unstructured/files/AI sessions
  6. **Validator**: Schema, cross-ref, evidence
  7. **Split Router**: Write plan
  8. **Writers**: Persist to stores, publish events
- Data stores: Spine DB (entities), Context Store (text), Vector Index (embeddings), Memory DB (AI chat), Object Store (files), Audit Store (logs), Event Bus (events).
- All data is routed by category (csm, team, personal, etc.) and scope (tenant_id, user_id, workspace_id) for context-aware access. No per-tenant silos.

## Key Files & Patterns
- **Pipeline logic**: `src/services/ingestion/pipeline-stages.ts`, `tool-mappings.ts`
- **Connector configs**: Add new connectors in `tool-mappings.ts` (see README for example)
- **Observability**: Metrics/traces via `ObservabilityService` at each stage
- **Error handling**: Circuit Breaker pattern (`resilience/circuit-breaker`)
- **Legacy**: `ingestToSpine()` is deprecated; use the pipeline

## Developer Workflows
- **Build**: `pnpm build` (Next.js)
- **Dev**: `pnpm dev` (app), `pnpm dev:services` (backend), or `pnpm dev:all` (both)
- **Test**: `pnpm test` (unit/integration via Vitest), `pnpm test:e2e` (Playwright)
- **Lint**: `pnpm lint` (ESLint, Next.js config)
- **Deploy**: `pnpm deploy` (Turbo), `pnpm cf:deploy` (Cloudflare)
- **Cloud**: Vercel and Cloudflare supported (see `vercel.json`, `wrangler.toml`)

## Project Conventions
- **TypeScript**: Strict mode, path aliases via `@/`
- **Monorepo**: Managed by `pnpm` and `turbo.json`
- **Tailwind**: Custom theme in `tailwind.config.ts`
- **ESLint**: Uses Next.js web-vitals and typescript configs
- **Testing**: Vitest for unit/integration, Playwright for e2e
- **Docs**: See `src/services/ingestion/README.md` for pipeline, `docs/` for architecture

## Integration & Extensibility
- Add new connectors by updating `tool-mappings.ts` and providing extraction/classification rules
- All pipeline stages are observable and testable in isolation
- Use provided types/interfaces for all pipeline data

## Examples
- See `src/services/ingestion/README.md` for full pipeline usage and connector mapping examples
- Example test: `pnpm test` runs Vitest, `pnpm test:e2e` runs Playwright

---
For more, see `src/services/ingestion/README.md`, `docs/`, and `package.json` scripts.
