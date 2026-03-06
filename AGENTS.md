# IntegrateWise OS — Agent Guide

See `CLAUDE.md` for architecture overview, codebase structure, and API route map.

## Cursor Cloud specific instructions

### Services overview

| Service | Path | Dev command | Notes |
|---------|------|-------------|-------|
| **Web app (main frontend)** | `apps/web` | `pnpm --filter @integratewise/web dev` | Vite + React 18 SPA on port 3000. Runs without backend (landing page works fully; `/app` routes require Supabase credentials). |
| Backend Workers | `services/*` | `pnpm --filter <name> dev` | Cloudflare Workers (Hono). All optional for frontend dev. Require `wrangler` + Doppler secrets. |
| Marketing site | `apps/marketing` | `pnpm --filter @integratewise/marketing dev` | Separate marketing page. Optional. |

### Gotchas

- **`pnpm install --ignore-scripts`** is required instead of plain `pnpm install` because `esbuild@0.27.2` postinstall fails with a version validation error. All esbuild versions still load correctly at runtime despite this.
- The web app **has no `lint` or `test` scripts**. Lint exists only in `packages/types` and `packages/config` (but those fail due to missing `eslint-config-prettier` — pre-existing issue). Test scripts exist in `packages/rbac`, `services/billing`, `services/normalizer` but have no test files.
- **Typecheck** (`tsc -b --noEmit`) fails on a tsconfig reference issue and many pre-existing type errors. The Vite build succeeds regardless because it uses SWC.
- The `/app` route requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. Without them, navigating to `/app` throws a Supabase client error. The marketing/landing pages at `/` work without any env vars.
- **Supabase credential format**: `VITE_SUPABASE_URL` must be a full URL (e.g. `https://abcdefgh.supabase.co`), not just the project ref. `VITE_SUPABASE_ANON_KEY` must be a JWT (starts with `eyJ...`). Place them in `apps/web/.env` or pass via env vars when starting the dev server.
- The monorepo uses **pnpm workspaces + Turborepo**. Root scripts: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm test`, `pnpm typecheck`.
