# IntegrateWise OS — Agent Instructions

See `CLAUDE.md` for architecture overview, codebase structure, and quick start commands.

## Cursor Cloud specific instructions

### Monorepo overview

- **pnpm v9.0.0** monorepo with **Turborepo**. All workspace commands run from `/workspace`.
- Primary apps: `apps/web` (main SPA, Vite 6 + React 18), `apps/landing` (marketing page, Vite 7 + React 19 + GSAP).
- Backend services: Cloudflare Workers in `services/` (Hono framework). Require Doppler secrets for production; not needed for frontend-only dev.
- Shared packages: `packages/types`, `packages/config`, `packages/supabase`, `packages/rbac` are required dependencies of `apps/web`.

### esbuild binary workaround

`apps/landing` uses Vite 7 which requires esbuild 0.27.x. Due to pnpm's strict hoisting, esbuild@0.27.2 resolves the wrong platform binary. To run or build `apps/landing`, set:

```bash
export ESBUILD_BINARY_PATH=/workspace/node_modules/.pnpm/@esbuild+linux-x64@0.27.2/node_modules/@esbuild/linux-x64/bin/esbuild
```

Then use `pnpm --filter my-app dev` (port 5173) or `pnpm --filter my-app build`.

This is not needed for `apps/web` (uses esbuild 0.21.x via Vite 6 — works without workaround).

### Running services

| App | Command | Port | Notes |
|-----|---------|------|-------|
| Web SPA | `pnpm --filter @integratewise/web dev` | 3000 | Works without backend (mock mode) |
| Landing page | `ESBUILD_BINARY_PATH=... pnpm --filter my-app dev` | 5173 | See esbuild workaround above |
| Marketing | `pnpm --filter @integratewise/marketing dev` | 3000 | Optional |

### Build

- `pnpm --filter @integratewise/web build` — builds the web SPA to `apps/web/dist/`.
- `ESBUILD_BINARY_PATH=... pnpm --filter my-app build` — builds landing page (runs `tsc -b` then `vite build`).

### Tests

- Tests use **Vitest**. Run `pnpm --filter <package> test`.
- `@integratewise/mcp-connector` has 5 passing unit tests.
- Several service tests (`govern`, `normalizer`, `think`) have pre-existing failures due to missing DB mocks.

### Lint / Typecheck

- `apps/web` has a `typecheck` script (`tsc -b --noEmit`) — has a pre-existing tsconfig error.
- `apps/landing` has ESLint — `pnpm --filter my-app lint` (has pre-existing lint errors: unused vars, impure function call).
- Some packages (`types`, `config`, `lib`) have lint scripts but are missing `eslint-config-prettier` dependency.

### Auth / Secrets

The web app's authenticated routes (`/app`) require `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. Without them, the marketing pages still work but login/signup will error. Secrets are managed via Doppler in production.
