# Restored Engine Runbook (V11 Architecture)

This document summarizes the restoration and rectification of the "buried" IntegrateWise engine components.

## 🏗️ Architecture Overview

The system has been rectified into a **Cloudflare-Native Core** with a **Next.js Shell**.

### 1. Ingestion & Triage (Spine Inbound)

- **Location**: `apps/integratewise-core-engine/`
- **Key Services**:
  - `webhook-ingester.ts`: Specialized handler for Stripe, HubSpot, Slack, and n8n.
  - `triage-service.ts`: Bidirectional routing hub.
- **Contract**: Loader analyzes schema → n8n normalizes → Core Engine stores in D1.

### 2. IQ Hub & Memory (D1 + Vector Store)

- **Location**: `services/iq-hub/`
- **Modernization**:
  - Migrated from Neon to **D1** for all metadata (`ai_sessions`, `memories`).
  - **`embeddings-legacy.ts`**: Rectified to work in Cloudflare Workers.
  - **`triage-legacy.ts`**: Rectified to support AI analysis (Claude/DeepSeek) with a D1 sync layer.
- **Config**: All services now use `lib/config.ts` for dependency injection and `AppEnv` handling.

### 3. AI Loader Phase I

- **Location**: `services/loader/`
- **Job**: `runAiSessionSync` performs hourly syncs from external stores to the **Spine DB (D1)**.
- **Wrangler**: Bindings rectified to include `DB` (D1Database).

### 4. Thinking Surface (UI)

- **Location**: `apps/integratewise-os/src/components/legacy-engine/`
- **Components**:
  - `AILoader.tsx`: Visual ingestion tracker.
  - `AIChatInterface.tsx`: The primary "Think" engine interface.
  - `PersonaAssessment.tsx`: Cognitive Twin onboarding.

---

## 🛠️ Operational Tasks

### Database Migrations

New migrations for Triage and Think engines have been restored to:

- `sql-migrations/flow-a/041_create_think_engine.sql`
- `sql-migrations/restore_usage/051_triage_bot.sql`

### Env Variables Required (Wrangler/Vercel)

- `DB`: D1 Database binding (`integratewise-os`)
- `OPENAI_API_KEY`: For embeddings and chats.
- `CLAUDE_API_KEY`: For triage analysis.
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`: For legacy vector storage.

---
**Status**: Rectified & Aligned with V11 Architecture.
