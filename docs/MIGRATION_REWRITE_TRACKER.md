# Migration Rewrite Tracker

> **Generated**: 2026-02-07  
> **Architecture**: Cloudflare-Native (D1 + R2 + Vectorize + Workers)  
> **Reference**: `docs/ARCHITECTURE_OVERVIEW.md`

---

## Legend

| Action | Meaning |
|--------|---------|
| **Delete** | Remove file entirely (legacy/unused) |
| **Proxy** | Convert to thin proxy calling L3 Worker |
| **Rewrite** | Rewrite using `service-proxy.ts` helpers |
| **Keep** | No changes needed |

| Status | Meaning |
|--------|---------|
| ✅ Done | Migration complete |
| 🔄 In Progress | Currently being migrated |
| ⏳ Pending | Not started |
| ❌ Blocked | Blocked by dependency |

---

## P0: Build Blockers (Core Libraries)

| File | Old Import | Worker Target | Action | Status |
|------|------------|---------------|--------|--------|
| `src/lib/db.ts` | `@neondatabase/serverless`, `@prisma/*` | All L3 Workers | Rewrite | ✅ Done |
| `src/lib/auth.ts` | `@/lib/supabase/server` | auth | Rewrite | ✅ Done |
| `src/lib/auth-client.ts` | `@/lib/supabase/client` | auth | Rewrite | ✅ Done |
| `src/lib/audit.ts` | `@/lib/supabase/server` | govern | Rewrite | ✅ Done |
| `src/lib/ai-webhook-service.ts` | `@/lib/supabase/server` | loader, iq-hub, think | Rewrite | ✅ Done |
| `src/lib/spine/universal-entity-service.ts` | `@/lib/supabase/server` | spine | Rewrite | ✅ Done |
| `src/lib/spine/universal-think-service.ts` | `@/lib/supabase/server` | think, act | Rewrite | ✅ Done |
| `src/lib/iq-hub-client.ts` | `@/lib/supabase/server` | iq-hub | Rewrite | ✅ Done |
| `src/lib/tenant-context.ts` | `@neondatabase/serverless` | tenants | Rewrite | ✅ Done |

---

## P1: API Routes (Priority Proxies)

| File | Old Import | Worker Target | Action | Status |
|------|------------|---------------|--------|--------|
| `src/app/api/health/route.ts` | `@/lib/supabase/server` | views | Proxy | ✅ Done |
| `src/app/api/today/route.ts` | `@/lib/supabase/server` | views | Proxy | ✅ Done |
| `src/app/api/search/route.ts` | `@/lib/supabase/server` | knowledge | Proxy | ✅ Done |
| `src/app/api/ai/chat/route.ts` | `@/lib/supabase/server` | iq-hub | Proxy | ✅ Done |
| `src/app/api/goals/route.ts` | `@/lib/supabase/server` | spine | Proxy | ✅ Done |
| `src/app/api/insights/route.ts` | `@/lib/supabase/server` | think | Proxy | ✅ Done |
| `src/app/api/spine/health/route.ts` | `@/lib/supabase/server` | spine | Proxy | ✅ Done |
| `src/app/api/onboarding/status/route.ts` | `@/lib/supabase/server` | tenants | Proxy | ✅ Done |
| `src/app/api/integrations/route.ts` | `@/lib/supabase/server` | tenants | Proxy | ✅ Done |

---

## P2: AI Domain Routes

| File | Old Import | Worker Target | Action | Status |
|------|------------|---------------|--------|--------|
| `src/app/api/ai/memories/route.ts` | `@/lib/supabase/server` | iq-hub | Proxy | ✅ Done |
| `src/app/api/ai/memories/[id]/route.ts` | `@/lib/supabase/server` | iq-hub | Proxy | ✅ Done |
| `src/app/api/ai/memories/[id]/confirm/route.ts` | `@/lib/supabase/server` | iq-hub | Proxy | ✅ Done |
| `src/app/api/ai/conversations/route.ts` | `@/lib/supabase/server` | iq-hub | Proxy | ✅ Done |
| `src/app/api/ai/conversations/[id]/route.ts` | `@/lib/supabase/server` | iq-hub | Proxy | ✅ Done |
| `src/app/api/ai/conversations/[id]/messages/route.ts` | `@/lib/supabase/server` | iq-hub | Proxy | ✅ Done |
| `src/app/api/ai/conversations/[id]/archive/route.ts` | `@/lib/supabase/server` | iq-hub | Proxy | ✅ Done |

---

## P3: Governance Domain Routes

| File | Old Import | Worker Target | Action | Status |
|------|------------|---------------|--------|--------|
| `src/app/api/govern/policies/route.ts` | `@/lib/supabase/queries` | govern | Proxy | ✅ Done |
| `src/app/api/govern/approve/route.ts` | `@/lib/supabase/queries` | govern | Proxy | ✅ Done |
| `src/app/api/govern/queue/route.ts` | `@/lib/supabase/queries` | govern | Proxy | ✅ Done |
| `src/app/api/audit/route.ts` | `@/lib/supabase/server` | govern | Proxy | ✅ Done |
| `src/app/api/adjust/feedback/route.ts` | `@/lib/supabase/queries` | govern | Proxy | ✅ Done |

---

## P4: Billing Domain Routes

| File | Old Import | Worker Target | Action | Status |
|------|------------|---------------|--------|--------|
| `src/app/api/billing/checkout/route.ts` | `@/lib/supabase/server` | billing | Proxy | ✅ Done |
| `src/app/api/billing/portal/route.ts` | `@/lib/supabase/server` | billing | Proxy | ✅ Done |
| `src/app/api/billing/usage/route.ts` | `@/lib/supabase/server` | billing | Proxy | ✅ Done |

---

## P5: Brainstorm Domain Routes

| File | Old Import | Worker Target | Action | Status |
|------|------------|---------------|--------|--------|
| `src/app/api/brainstorm/analyze/route.ts` | `@/lib/supabase/server` | think | Proxy | ✅ Done |
| `src/app/api/brainstorm/daily-insights/route.ts` | `@/lib/supabase/server` | think | Proxy | ✅ Done |
| `src/app/api/brainstorm/execute/route.ts` | `@/lib/supabase/server` | act | Proxy | ✅ Done |

---

## WEBHOOKS: Mark as Delete (Do Not Migrate)

| File | Old Import | Worker Target | Action | Status |
|------|------------|---------------|--------|--------|
| `src/app/api/webhooks/stripe/route.ts` | `@/lib/supabase/server` | billing | Delete | ✅ Done |
| `src/app/api/webhooks/asana/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/webhooks/hubspot/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/webhooks/slack/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/webhooks/discord/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/webhooks/brainstorm/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/webhooks/[provider]/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/webhooks/health/route.ts` | `@/lib/supabase/server` | views | Delete | ✅ Done |
| `src/app/api/webhook-events/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/webhook-scheduler/trigger/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/data-sync/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/hubspot/sync/route.ts` | `@/lib/supabase/server` | loader | Delete | ✅ Done |
| `src/app/api/website/track/route.ts` | `@/lib/supabase/server` | store | Delete | ✅ Done |
| `src/app/api/capture/route.ts` | `@/lib/supabase/server` | store | Delete | ✅ Done |

---

## Deleted Files (Legacy)

| Path | Type | Reason |
|------|------|--------|
| `vercel.json` | Config | Vercel crons → Cloudflare Crons |
| `firebase.json` | Config | Firebase Data Connect → D1 |
| `.firebaserc` | Config | Firebase project config |
| `dataconnect/` | Directory | Firebase Data Connect |
| `check-neon-tables.js` | Script | Neon migration util |
| `scripts/check-neon-tables.js` | Script | Neon migration util |
| `verify-migration.ts` | Script | Neon migration util |
| `packages/lib/src/neon.ts` | Module | Neon client |
| `packages/db/` | Package | Neon/Prisma DB package |
| `src/lib/supabase/` | Directory | Now contains shims routing to L3 Workers |

---

## Service URLs (Environment Config)

```bash
# L3 Service URLs (Cloudflare Workers)
AUTH_SERVICE_URL=https://auth.integratewise.ai
SPINE_SERVICE_URL=https://spine.integratewise.ai
STORE_SERVICE_URL=https://store.integratewise.ai
VIEWS_SERVICE_URL=https://views.integratewise.ai
KNOWLEDGE_SERVICE_URL=https://knowledge.integratewise.ai
IQ_HUB_SERVICE_URL=https://iq-hub.integratewise.ai
GOVERN_SERVICE_URL=https://govern.integratewise.ai
BILLING_SERVICE_URL=https://billing.integratewise.ai
LOADER_SERVICE_URL=https://loader.integratewise.ai
THINK_SERVICE_URL=https://think.integratewise.ai
ACT_SERVICE_URL=https://act.integratewise.ai
TENANTS_SERVICE_URL=https://tenants.integratewise.ai
```

---

## Progress Summary

| Category | Total | Done | Pending |
|----------|-------|------|---------|
| P0 Core Libraries | 9 | 9 | 0 |
| P1 Priority Routes | 9 | 9 | 0 |
| P2 AI Routes | 7 | 7 | 0 |
| P3 Governance Routes | 5 | 5 | 0 |
| P4 Billing Routes | 3 | 3 | 0 |
| P5 Brainstorm Routes | 3 | 3 | 0 |
| Webhooks (Delete) | 14 | 14 | 0 |
| **Total** | **50** | **50** | **0** |
