# Developer Getting Started

Welcome to the IntegrateWise OS Monorepo. This guide helps you set up the environment for local development.

## Repo Structure

- `apps/integratewise-os`: The primary Next.js Admin UI.
- `services/`: Specialized Worker logic (Think, Act, Normalizer, Gateway).
- `packages/`: Shared libraries and types.
- `sql-migrations/`: Neon DB schema definitions.

## Prerequisites

- Node.js 20+
- `psql` (for migrations)
- Wrangler CLI (`npm i -g wrangler`)

## Local Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Frontend Development**:

   ```bash
   cd apps/integratewise-os
   npm run dev
   ```

3. **Worker Development**:

   ```bash
   wrangler dev --env dev
   ```

4. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL` (Neon Connection String)

## Key Concepts

- **The 3 Flows**: Data moves from **Signals** (A) to **Knowledge** (B) to **Intelligence** (Think).
- **The Colony**: Autonomous agents managed by the `Orchestra` controller.
- **The Vault**: Unified key management for HubSpot, Stripe, and n8n.
