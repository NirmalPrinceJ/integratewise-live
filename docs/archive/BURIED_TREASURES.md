# 🏴‍☠️ IntegrateWise OS — Buried Treasures Inventory

**Comprehensive Audit of Undocumented & Undeployed Features**  
**Date**: 3 February 2026

---

## 📍 Executive Summary

This document catalogs **all implemented but undocumented features** discovered during a deep codebase audit. These are production-ready capabilities that exist in code but are either:
- ❌ **Not Deployed** — Code exists, no Cloudflare Worker deployed
- 📝 **Not Documented** — Deployed but not in SYSTEM_STATUS.md
- 🔒 **Not Exposed** — Backend exists, no UI or API route

---

## 🚨 CRITICAL: NOT DEPLOYED

### 1. Webhooks Worker (`packages/webhooks/`)
**Status**: ❌ NOT DEPLOYED (Error 1042 on ingress subdomain)  
**Size**: 439 lines  
**Location**: `packages/webhooks/src/worker.ts`

**Supported Providers** (with signature verification):
| Provider | Verification Method |
|----------|-------------------|
| Stripe | HMAC-SHA256 with timestamp |
| RazorPay | HMAC-SHA256 |
| GitHub | HMAC-SHA256 |
| Vercel | HMAC-SHA1 |
| HubSpot | SHA256(secret + body) |
| LinkedIn | Client secret |
| Canva | Webhook secret |
| Salesforce | Security token |
| Pipedrive | Webhook token |
| Meta/WhatsApp | Verify tokens |
| Todoist | Header-based |
| Notion | Header-based |
| AI Relay | Custom secret |

**Key Features**:
- Deduplication hashing
- Tenant ID resolution
- Event type extraction
- Raw body preservation

**Deploy Command**:
```bash
cd packages/webhooks && npx wrangler deploy
```

---

### 2. Billing Service (`services/billing/`)
**Status**: ❌ NOT DEPLOYED (No wrangler.toml active)  
**Size**: 475 lines  
**Location**: `services/billing/src/billing-service.ts`

**Features**:
- Plan definitions (Free, Pro, Business, Enterprise)
- Subscription lifecycle management
- Usage metering (API calls, AI queries, storage, users)
- Stripe integration (price IDs, customer creation)
- Invoice management
- Proration calculations

**Plans Defined**:
| Plan | Monthly | Yearly | Users | Integrations | AI Queries |
|------|---------|--------|-------|--------------|------------|
| Free | $0 | $0 | 1 | 2 | 100/mo |
| Pro | $49 | $490 | 5 | 10 | 1,000/mo |
| Business | $199 | $1,990 | 25 | 50 | 10,000/mo |
| Enterprise | Custom | Custom | Unlimited | Unlimited | Unlimited |

---

## 🔐 SECURITY & ACCESS CONTROL

### 3. RBAC Engine (`packages/rbac/`)
**Status**: 📝 NOT DOCUMENTED in main docs  
**Size**: 473 lines (engine.ts)  
**Locations**:
- `packages/rbac/src/engine.ts` — Core permission engine
- `packages/rbac/src/middleware.ts` — Express/Hono middleware
- `packages/rbac/src/worker-middleware.ts` — Cloudflare Worker middleware
- `packages/rbac/src/types.ts` — Type definitions
- `src/services/security/rbac-service.ts` — Application service (314 lines)
- `sql-migrations/031_rbac_system.sql` — Database schema (283 lines)

**Permission Patterns**:
```
*:*           — Super admin (all permissions)
account:*     — All account operations
account:read  — Specific action
*:read        — Read-only across all resources
```

**Core Functions**:
- `matchesPermission()` — Wildcard-aware matching
- `hasPermission()` — Single permission check
- `hasAllPermissions()` — All permissions required
- `hasAnyPermission()` — Any permission sufficient
- `listRoles()` / `getRole()` / `createRole()` / `assignRole()`

**Database Tables**:
- `roles` — System + tenant-specific roles
- `user_roles` — User-to-role assignments
- `permission_audit_log` — Compliance logging

---

### 4. Field-Level RBAC (`src/services/security/rbac-service.ts`)
**Size**: 314 lines  
**Features**:
- Condition-based access (owner-only, scope-filtered)
- Field-level permissions (e.g., can update `title` but not `status`)
- Field encryption keys management
- Policy priority system

**Pre-configured Policies**:
- `personal-policy` — Personal users: own data only
- `personal-api-policy` — Personal API access
- `csm-policy` — CSM: assigned accounts only

---

## 💰 BILLING & SUBSCRIPTIONS

### 5. Tenancy Billing System (`packages/tenancy/src/billing/`)
**Status**: 📝 NOT DOCUMENTED  
**Components**:
- `manager.ts` — SubscriptionManager class
- `provider.ts` — BillingProvider interface
- `providers/stripe.ts` — Stripe implementation
- `providers/razorpay.ts` — RazorPay implementation

**Provider Interface Methods**:
```typescript
// Customer Management
createCustomer(email, name, metadata)
updateCustomer(customerId, updates)
deleteCustomer(customerId)

// Subscription Management
createSubscription(customerId, priceId, metadata)
updateSubscription(subscriptionId, updates)
cancelSubscription(subscriptionId, immediately?)
getSubscription(subscriptionId)

// Billing Operations
createInvoice(customerId, items)
collectPayment(invoiceId)

// Webhooks
handleWebhook(body, signature)
```

---

### 6. Paywall Components (`src/components/paywall/`)
**Status**: 📝 NOT DOCUMENTED  
**Components**:
- `FeatureGate.tsx` — Conditional feature access
- `UpgradePrompt.tsx` — Upgrade call-to-action
- `UsageMeter.tsx` — Usage visualization
- `PlanBadge.tsx` — Current plan indicator
- `PlanComparisonTable.tsx` — Plan comparison grid

---

### 7. Entitlements System (`src/lib/entitlements.ts`)
**Size**: 98 lines  
**Feature Gates**: 40+

**Sample Gates**:
| Gate | Min Plan | Description |
|------|----------|-------------|
| `worlds` | Free | Basic workspace |
| `surfaces` | Pro | Multiple surfaces |
| `accelerators` | Pro | Domain accelerators |
| `governance` | Business | Approval workflows |
| `agents` | Business | Autonomous agents |
| `admin.billing` | Business | Billing management |
| `admin.audit` | Enterprise | Audit logs |
| `custom_integrations` | Enterprise | Custom connectors |

---

## 🤖 AI & AGENT SYSTEMS

### 8. Advanced Multi-Agent System (`src/services/agents/advanced-agent-system.ts`)
**Size**: 295 lines  
**Pre-configured Agents**:

| Agent ID | Name | Role | Capabilities |
|----------|------|------|--------------|
| `orchestrator-001` | Orchestra | orchestrator | coordinate, delegate, monitor, resolve_conflicts |
| `analyzer-001` | Insight | analyzer | analyze, predict, identify_patterns, generate_reports |
| `executor-001` | Action | executor | execute, integrate, automate, monitor_execution |
| `learner-001` | Sage | learner | learn, adapt, optimize, provide_feedback |

**Personality Traits** (per agent):
- `riskTolerance` (0-1)
- `creativity` (0-1)
- `thoroughness` (0-1)

**Features**:
- Agent memory & learning
- Message queue between agents
- Correlation ID tracking
- Active conversations management

---

### 9. Multi-Agent Orchestrator (`src/services/orchestration/multi-agent-orchestrator.ts`)
**Size**: 582 lines  
**Features**:
- Workflow definition & execution
- Agent registration & management
- Azure/GitHub Models integration
- Workflow conditions (quality, error rate, time limit)
- Execution history tracking
- Human-in-the-loop support
- Reflection mode

**Workflow Execution Options**:
```typescript
executeWorkflow(workflowId, inputs, {
  maxDuration: 300000,      // 5 minute timeout
  enableReflection: true,    // Agent self-reflection
  humanInLoop: true          // Approval gates
})
```

---

### 10. Advanced AI Models Service (`src/services/orchestration/advanced-ai-models.ts`)
**Size**: 654 lines  
**Supported Providers**:
- OpenAI
- Anthropic (Claude)
- DeepSeek
- xAI (Grok)
- Microsoft (Azure OpenAI)

**Capabilities Tracked**:
- Text, Vision, Audio, Code, Reasoning, Tool Use
- Context window size
- Cost per token
- Quality/throughput/latency metrics
- Safety scores
- Multimodal & reasoning flags

---

### 11. MCP Tool Server (`packages/integratewise-mcp-tool-connector/`)
**Size**: 286 lines  
**Deployed**: ✅ integratewise-mcp-tool-server

**Available Tools**:
| Tool | Description |
|------|-------------|
| `get_account_intelligence` | Account health, strategy, products |
| `get_account_strategy` | Strategic objectives by account |
| `list_active_situations` | Current detected situations |
| `end_ai_session` | Save session summary to knowledge |
| `record_knowledge` | Store content to long-term memory |
| `search_knowledge` | Vector similarity search |

---

### 12. Embedding & Vector System (`services/iq-hub/src/lib/memory-index.ts`)
**Size**: 227 lines  
**Providers**:
- OpenAI (`text-embedding-ada-002`)
- DeepSeek embeddings

**Functions**:
- `generateEmbedding()` — Create vector from text
- `storeEmbedding()` — Save to D1 metadata + Supabase vector store
- Vector similarity search

---

## 📊 ANALYTICS & OBSERVABILITY

### 13. Predictive Analytics (`src/services/analytics/predictive-analytics.ts`)
**Size**: 221 lines  
**Features**:
- Model training with historical data
- Trend prediction (increasing/decreasing/stable)
- Confidence scoring
- Factor identification
- Custom dashboard widgets

**Prediction Output**:
```typescript
{
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: Array<{ factor, impact, explanation }>;
  timeHorizon: 7  // days
}
```

---

### 14. Business Intelligence Service (`src/services/business-intelligence/business-intelligence-service.ts`)
**Size**: 851 lines (with tests)  
**Features**:
- Data ingestion with retention policies
- Predictive model management (regression, classification, clustering, time_series)
- Automated insight generation
- Dashboard configuration
- Report scheduling (daily, weekly, monthly)
- Export formats (PDF, HTML, CSV, JSON)

**Insight Types**:
- Trend detection
- Anomaly detection
- Correlation analysis
- Predictions
- Recommendations

---

### 15. Observability Service (`src/services/monitoring/observability-service.ts`)
**Size**: 422 lines  
**Features**:
- Metrics collection (counter, gauge, histogram, summary)
- Health checks (database, cache, external_api, ai_service, workflow_engine)
- Alert rules with cooldowns
- Performance tracing with spans
- Trace logging

**Pre-configured Alerts**:
| Alert | Condition | Severity | Cooldown |
|-------|-----------|----------|----------|
| `high_error_rate` | >10% in 5min | error | 5 min |
| `high_latency` | >5s average | warning | 10 min |
| `service_down` | health = 0 | critical | 1 min |

---

### 16. OpenTelemetry Tracing (`src/lib/tracing.ts`)
**Features**:
- `NodeTracerProvider` setup
- `@traceloop/instrumentation-openai` for AI call tracing
- Span creation and management
- Distributed trace correlation

---

## 🔄 RESILIENCE PATTERNS

### 17. Circuit Breaker (`src/services/resilience/circuit-breaker.ts`)
**Size**: 159 lines  
**States**: CLOSED → OPEN → HALF-OPEN

**Configuration**:
```typescript
{
  failureThreshold: 5,       // Failures to trip
  recoveryTimeout: 60000,    // 60s before half-open
  successThreshold: 3        // Successes to close
}
```

---

### 18. Webhook Processor with Resilience (`packages/lib/src/webhook-processor.ts`)
**Size**: 536 lines  
**Features**:
- Connection retry (up to 10 attempts)
- Rate limit handling (5 retries, 1-hour max delay)
- Governor limit handling (3 retries, 24-hour max delay)
- Circuit breaker integration
- Adaptive rate limiting (token bucket, sliding window)

---

### 19. Scalability Service (`src/services/scalability/scalability-service.ts`)
**Size**: 719 lines  
**Features**:
- Worker pools with FIFO/priority/weighted strategies
- Load balancing (round robin, least connections, weighted, IP hash)
- Auto-scaling based on CPU, memory, requests, latency
- Multi-layer caching (memory, Redis, CDN)
- Backend health monitoring

---

### 20. Error Handling System (`packages/lib/src/error-handling.ts`)
**Size**: 819 lines  
**Standard Error Codes**: 22+

**Categories**:
- Authentication (UNAUTHORIZED, FORBIDDEN, TOKEN_EXPIRED)
- Validation (VALIDATION_ERROR, MISSING_REQUIRED_FIELD)
- Database (CONNECTION_ERROR, DUPLICATE_ENTRY)
- External Services (EXTERNAL_SERVICE_ERROR, WEBHOOK_DELIVERY_FAILED)
- Rate Limiting (RATE_LIMIT_EXCEEDED, GOVERNOR_LIMIT_EXCEEDED)
- Business Logic (BUSINESS_RULE_VIOLATION, RESOURCE_NOT_FOUND)

---

## 📥 DATA INGESTION PIPELINE

### 21. 8-Stage Universal Pipeline (`src/services/ingestion/pipeline-stages.ts`)
**Size**: 1,090 lines

**Stages**:
1. **Analyzer** — Fingerprint hash, MIME type detection
2. **Classifier** — Data kind, domain, sensitivity
3. **Filter** — Access control, dedup, quota check
4. **Refiner** — Split into processing units
5. **Extractor** — Triple stream (structured/unstructured/files)
6. **Validator** — Confidence & trust scoring
7. **Split Router** — Route to Spine/Context/Knowledge/Memory
8. **Writers** — Persist with audit logging

---

### 22. Tool Mappings (`src/services/ingestion/tool-mappings.ts`)
**Size**: 992 lines  
**Connectors Mapped**:

| Category | Tools |
|----------|-------|
| CRM | Salesforce, HubSpot, Pipedrive, Zoho |
| Communication | Slack, Discord, Teams, Email |
| Productivity | Notion, Airtable, Google Sheets |
| Finance | Stripe, QuickBooks, Xero |
| Support | Zendesk, Intercom, Freshdesk |
| Dev Tools | GitHub, Jira, Linear |
| Analytics | GA4, Mixpanel, Amplitude |
| AI | ChatGPT, Claude, Custom |

**Per-Tool Configuration**:
- Default data kind (record, message, document, telemetry, chat)
- Domain assignment (sales, cs, support, product, finance, ops)
- Sensitivity level (pii, contract, financial, security, none)
- Entity hints with confidence scores
- Extraction paths (structured, unstructured, relationships)
- Filter rules (scopes, rate limits, dedup patterns)

---

## 🖥️ UI COMPONENTS

### 23. Admin Pages (`src/components/admin/pages/`)
**17 Pages**:
| Page | Purpose |
|------|---------|
| `observability-page.tsx` | Service health monitoring |
| `governance-page.tsx` | Approval/rejection workflows |
| `billing-page.tsx` | Subscription management |
| `audit-page.tsx` | Compliance audit logs |
| `connectors-page.tsx` | Integration management |
| `roles-page.tsx` | Role definitions |
| `users-page.tsx` | User management |
| `tenancy-page.tsx` | Tenant settings |
| `usage-page.tsx` | Usage analytics |
| `tools-page.tsx` | Available tools |
| `agents-page.tsx` | Agent configuration |
| `workflows-page.tsx` | Workflow builder |
| `data-page.tsx` | Data management |
| `signals-page.tsx` | Signal configuration |
| `knowledge-page.tsx` | Knowledge base |
| `settings-page.tsx` | System settings |
| `dashboard-page.tsx` | Admin dashboard |

---

### 24. Premium Onboarding (`src/components/onboarding/`)
**7 Components**:
- Guided setup wizards
- Progressive disclosure
- Plan-appropriate features
- Connector quickstart

---

### 25. Real-time WebSocket Service (`src/services/realtime/websocket-service.ts`)
**Size**: 211 lines  
**Features**:
- Client connection management
- Channel subscriptions
- Real-time message broadcasting
- Collaboration events
- Agent action notifications

**Message Types**:
- `update` — Data changes
- `notification` — System alerts
- `collaboration` — Multi-user edits
- `agent_action` — Autonomous agent events

---

## 🗄️ DATABASE SYSTEMS

### 26. Enterprise Resilience Schema (`sql-migrations/024_enterprise_resilience.sql`)
**Size**: 259 lines  
**Tables**:
- `outbox_events` — Reliable event delivery (outbox pattern)
- `canonical_entities` — Entity deduplication
- `entity_merges` — Entity merge tracking
- `governance_rules` — Data quality rules
- `governance_audit_log` — Governance compliance

---

### 27. Action Runs Tracking (`sql-migrations/017_action_runs.sql`)
**Features**:
- Execution history
- Status tracking (pending, running, success, failed, cancelled)
- Idempotency keys
- Retry counts
- Result storage

---

### 28. RBAC Schema (`sql-migrations/031_rbac_system.sql`)
**Size**: 283 lines  
**Tables**:
- `roles` — System + tenant roles
- `user_roles` — Assignments with audit
- `permission_audit_log` — Compliance tracking

**SQL Functions**:
- `user_has_permission(user_id, tenant_id, permission)` — Permission check with wildcard support

---

### 29. Message Persistence (`sql-migrations/027_message_persistence_enhancements.sql`)
**Features**:
- Retry tracking on events_log
- Dead letter queue
- Retry scheduling with backoff

---

## 🌍 CONTEXT SYSTEMS

### 30. Tenant Context (`src/contexts/tenant-context.tsx`)
**Size**: 131 lines  
**Provides**:
- `tenantId`, `planId`, `role`
- `featureFlags` object
- `isLoading` state
- `refetch()` function

---

### 31. World Scope Context (`src/contexts/world-scope.tsx`)
**Size**: 131 lines  
**Scopes**:
- `personal` — Individual user
- `work` — Team/company
- `accounts` — Customer accounts
- `admin` — System administration

**Features**:
- Scope switching
- Department filtering
- Account selection

---

### 32. Hydration Context (`src/contexts/hydration-context.tsx`)
**Features**:
- Progressive data loading
- Strength levels (seed → growing → healthy → rich)
- Background refresh
- Priority-based hydration

**Data Strength Types** (`src/types/data-strength.ts`, 271 lines):
```typescript
DataStrengthLevel = 'seed' | 'growing' | 'healthy' | 'rich'
HydrationJob = { type: 'sync' | 'file' | 'ai'; priority; entity }
```

---

## 📦 ADDITIONAL PACKAGES

### 33. Accelerators (`packages/accelerators/`)
Domain-specific intelligence packs for different industries/functions.

### 34. Connector Contracts (`packages/connector-contracts/`)
Type-safe interfaces for building connectors.

### 35. Integration Tests (`packages/integration-tests/`)
End-to-end test suite.

### 36. API Package (`packages/api/`)
Shared API utilities and types.

### 37. Config Package (`packages/config/`)
Centralized configuration management.

---

## 🎯 DEPLOYMENT PRIORITY

### Immediate (Revenue Impact)
1. **Webhooks Worker** — Required for external integrations
2. **Billing Service** — Required for paid plans

### High Priority
3. RBAC documentation & UI
4. Observability dashboard activation
5. Feature flags admin UI

### Medium Priority
6. Multi-agent orchestrator UI
7. Predictive analytics dashboard
8. Business intelligence reports

### Low Priority
9. Advanced AI models routing
10. Custom dashboard builder

---

## 📋 Action Items

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Deploy webhooks worker | 1h | 🔴 Critical |
| 2 | Deploy billing service | 2h | 🔴 Critical |
| 3 | Document RBAC in SYSTEM_STATUS.md | 1h | 🟡 High |
| 4 | Expose observability metrics | 2h | 🟡 High |
| 5 | Connect entitlements to tenant context | 2h | 🟡 High |
| 6 | Wire paywall components | 4h | 🟡 High |
| 7 | Enable BI service | 4h | 🟢 Medium |
| 8 | Document all 40+ feature gates | 2h | 🟢 Medium |

---

*This inventory contains ~15,000+ lines of undocumented code across 37 major systems.*
