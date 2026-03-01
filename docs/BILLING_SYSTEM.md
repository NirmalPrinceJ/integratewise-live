# IntegrateWise Billing System

> **Version:** 1.0
> **Last Updated:** 2026-03-01
> **Architecture:** v3.6

## Overview

The IntegrateWise Billing System is a dual-gateway payment processor supporting:
- **Stripe** — International payments (USD, EUR, GBP, etc.)
- **Razorpay** — India-specific payments (INR with local payment methods)

The system manages:
- Product SKUs (Stock Keeping Units) with flexible pricing
- Payment transactions and webhook handling
- Tenant subscriptions and usage entitlements

---

## Architecture

### Components

```
Frontend (Marketing)
    ├─ PricingPage (fetches SKUs from /api/v1/billing/plans)
    └─ Checkout flow (posts to /api/v1/billing/checkout)
          ↓
Gateway (integratewise-gateway)
    ├─ Routes: /api/v1/billing/*
    ├─ Proxies to: Billing Worker
    └─ Webhooks: /webhooks/billing/* (no JWT required)
          ↓
Billing Service (integratewise-billing)
    ├─ Manages SKUs, prices, and tiers
    ├─ Creates Stripe/Razorpay sessions
    ├─ Processes webhook events
    └─ Tracks payment transactions in D1
          ↓
Database (D1 SQLite)
    ├─ product_skus
    ├─ payment_transactions
    └─ tenant_subscriptions
```

---

## Database Schema

### product_skus

Stores all product offerings with pricing and feature definitions.

```sql
CREATE TABLE product_skus (
  id TEXT PRIMARY KEY,
  product_code TEXT UNIQUE,
  name TEXT,
  description TEXT,
  tier TEXT,                    -- 'free', 'starter', 'professional', 'enterprise', 'addon'
  billing_type TEXT,            -- 'one_time', 'recurring'
  billing_interval TEXT,        -- 'monthly', 'yearly', NULL
  price_cents INTEGER,          -- Always store in smallest currency unit
  currency TEXT,                -- 'usd', 'inr', 'eur', etc.
  stripe_price_id TEXT,         -- Stripe recurring price ID
  razorpay_plan_id TEXT,        -- Razorpay subscription plan ID
  features TEXT,                -- JSON array: ["feature1", "feature2", ...]
  limits TEXT,                  -- JSON object: {"connectors": 10, "users": 3, ...}
  sort_order INTEGER,           -- Display order on pricing page
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'archived'
  created_at TEXT,
  updated_at TEXT
);
```

### payment_transactions

Tracks every payment attempt (succeeded or failed).

```sql
CREATE TABLE payment_transactions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,
  sku_id TEXT REFERENCES product_skus(id),
  gateway TEXT,                        -- 'stripe', 'razorpay'
  gateway_session_id TEXT,             -- Stripe session ID or Razorpay order ID
  gateway_payment_id TEXT,             -- Payment ID from gateway
  amount_cents INTEGER,
  currency TEXT,
  status TEXT DEFAULT 'pending',       -- 'pending', 'completed', 'failed', 'refunded'
  created_at TEXT,
  updated_at TEXT,

  FOREIGN KEY (sku_id) REFERENCES product_skus(id)
);
```

### tenant_subscriptions

Records active subscriptions for each tenant.

```sql
CREATE TABLE tenant_subscriptions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT,
  sku_id TEXT REFERENCES product_skus(id),
  status TEXT DEFAULT 'active',        -- 'active', 'trial', 'past_due', 'cancelled', 'expired'
  activated_at TEXT,
  expires_at TEXT,
  cancelled_at TEXT,
  gateway TEXT,                        -- Which payment gateway processed this
  gateway_subscription_id TEXT,        -- Stripe subscription ID or Razorpay subscription ID

  FOREIGN KEY (sku_id) REFERENCES product_skus(id)
);
```

---

## API Routes

### Billing Service Routes

All routes are proxied through the Gateway at `/api/v1/billing/*`.

#### Get All Plans/SKUs
```
GET /api/v1/billing/plans
Returns: { plans: SKU[] }
```

#### Create Checkout Session
```
POST /api/v1/billing/checkout
Headers:
  - x-tenant-id: <tenant_id>
  - Content-Type: application/json

Request:
{
  "sku_id": "sku_pro_m",
  "gateway": "stripe",           // or "razorpay"
  "success_url": "...",          // Optional
  "cancel_url": "..."            // Optional
}

Response (Stripe):
{
  "checkout_url": "https://checkout.stripe.com/...",
  "session_id": "cs_live_xxx"
}

Response (Razorpay):
{
  "order_id": "order_xxx",
  "key_id": "rzp_live_xxx",
  "amount": 7900,
  "currency": "INR"
}
```

#### Get Tenant Subscription
```
GET /api/v1/billing/subscription
Headers:
  - x-tenant-id: <tenant_id>

Returns:
{
  "subscriptions": [
    {
      "id": "sub_xxx",
      "tenant_id": "...",
      "sku_id": "sku_pro_m",
      "status": "active",
      "activated_at": "2026-03-01T...",
      "expires_at": "2026-04-01T...",
      "sku_name": "IntegrateWise Professional (Monthly)",
      "product_code": "IW-PRO-M",
      "tier": "professional"
    }
  ]
}
```

#### Get Usage/Entitlements
```
GET /api/v1/billing/entitlements/:tenantId
Returns:
{
  "entitlements": {
    "plan": "professional",
    "planName": "Professional",
    "limits": { ... },
    "usage": { "api_calls": 45000, ... },
    "remaining": { ... },
    "features": ["full_ai", "brainstorm", ...]
  }
}
```

#### Record Usage
```
POST /api/v1/billing/usage
Request:
{
  "tenantId": "...",
  "metricKey": "api_calls",
  "quantity": 100,
  "metadata": { ... }
}
```

#### Get Invoices
```
GET /api/v1/billing/invoices/:tenantId?limit=10
```

---

## Webhook Handlers

### Stripe Webhooks

Endpoint: `POST /api/v1/billing/webhooks/stripe`

**Events Handled:**

- `checkout.session.completed` — Mark transaction as completed, activate subscription
- `invoice.payment_failed` — Mark subscription as past_due
- `invoice.paid` — Record invoice

**Signature Verification:**
```typescript
// Use Stripe webhook verification (simplified for now)
const signature = c.req.header('stripe-signature');
// Verify against STRIPE_WEBHOOK_SECRET
```

### Razorpay Webhooks

Endpoint: `POST /api/v1/billing/webhooks/razorpay`

**Events Handled:**

- `payment.captured` — Mark transaction as completed, activate subscription
- `subscription.activated` — Record subscription activation
- `subscription.charged` — Handle recurring charge

**Signature Verification:**
```typescript
// Razorpay HMAC-SHA256 signature verification
const signature = c.req.header('x-razorpay-signature');
// Verify against RAZORPAY_WEBHOOK_SECRET
```

---

## Product Catalog

### SKU Naming Convention

```
IW-<TIER>-<VARIANT>
├─ IW-FREE-001         (free tier)
├─ IW-STARTER-M        (starter, monthly)
├─ IW-STARTER-Y        (starter, yearly)
├─ IW-PRO-M            (professional, monthly)
├─ IW-PRO-Y            (professional, yearly)
├─ IW-ENT-001          (enterprise, custom)
├─ IW-STARTER-M-INR    (starter, India, monthly)
├─ IW-PRO-M-INR        (professional, India, monthly)
├─ IW-ACC-CSM          (accelerator: CSM playbook)
├─ IW-ACC-SALES        (accelerator: Sales pipeline)
├─ IW-ACC-REVOPS       (accelerator: RevOps analytics)
└─ IW-ACC-MKTG         (accelerator: Marketing campaigns)
```

### Current Tiers

#### Free
- Price: $0/month
- Connectors: 3
- Users: 1
- Storage: 100 MB
- API Calls: 1,000/month
- Support: Community

#### Starter
- Price: $29/month or $279/year (save 20%)
- Connectors: 10
- Users: 3
- Storage: 1 GB
- API Calls: 10,000/month
- Support: Email
- Features: Basic AI, 5 accelerators

#### Professional
- Price: $79/month or $769/year (save 20%)
- Connectors: 25
- Users: 10
- Storage: 10 GB
- API Calls: 100,000/month
- Support: Priority
- Features: Full AI, brainstorm, entity 360, governance
- **Most Popular Plan**

#### Enterprise
- Price: Custom (contact sales)
- Connectors: Unlimited
- Users: Unlimited
- Storage: Unlimited
- API Calls: Unlimited
- Support: Dedicated account manager
- Features: All premium features + custom integrations

#### Accelerators (One-Time)
- CSM Playbook: $49 (onboarding, QBR, renewal workflows)
- Sales Pipeline: $49 (pipeline templates, forecasting)
- RevOps Analytics: $79 (dashboards, quota tracking)
- Marketing Campaigns: $49 (templates, attribution, lead scoring)

---

## Pricing Page Integration

### Frontend Implementation

The marketing site's `PricingPage.tsx` fetches SKUs dynamically:

```typescript
const response = await fetch('/api/v1/billing/plans');
const data = await response.json();
const skus = data.plans as SKU[];

// Filter for recurring plans
const recurringSkus = skus.filter(sku => sku.billing_type === 'recurring');

// Map to pricing tiers
const tiers = recurringSkus.map(sku => ({
  name: sku.name,
  price: formatPrice(sku.price_cents, sku.currency),
  features: sku.features,
  popular: sku.tier === 'professional',
  // ...
}));
```

**Features:**
- Dynamic SKU loading from billing API
- Currency support (USD, INR)
- Responsive pricing card layout
- "Most Popular" badge for professional tier
- FAQ section
- Call-to-action buttons linking to app

---

## Environment Variables & Secrets

### Required Secrets (via Doppler)

```
STRIPE_SECRET_KEY              # Stripe API secret key
STRIPE_WEBHOOK_SECRET          # Stripe webhook signing secret

RAZORPAY_KEY_ID                # Razorpay API key ID
RAZORPAY_KEY_SECRET            # Razorpay API key secret
RAZORPAY_WEBHOOK_SECRET        # Razorpay webhook signing secret
```

### Deployment

Secrets are synced to Cloudflare Workers via:
```bash
doppler run --config prd_billing -- wrangler deploy \
  -c services/billing/wrangler.toml
```

---

## Implementation Checklist

### Backend
- [x] Add SKU/payment types to packages/types
- [x] Create product_skus, payment_transactions, tenant_subscriptions tables
- [x] Implement /checkout endpoint (Stripe + Razorpay)
- [x] Implement /subscription endpoint
- [x] Implement Stripe webhook handler
- [x] Implement Razorpay webhook handler
- [x] Add billing routes to gateway
- [ ] Set up Stripe/Razorpay credentials in Doppler
- [ ] Test end-to-end flows

### Frontend
- [x] Update PricingPage to fetch SKUs dynamically
- [x] Add price formatting utilities
- [x] Add tier icon mapping
- [ ] Implement checkout button integration
- [ ] Implement success/cancel pages
- [ ] Add billing dashboard (subscription status, invoices)

### Operations
- [ ] Create Stripe products and price IDs
- [ ] Create Razorpay plans
- [ ] Set up webhook endpoints in Stripe/Razorpay
- [ ] Configure Doppler secrets
- [ ] Test webhook signature verification

---

## Testing

### Local Development

1. **Stub payment gateways** (development.integratewise.ai uses mock responses)
2. **Test with D1 locally:**
   ```bash
   wrangler d1 migrations apply integratewise-spine-local --local
   ```
3. **Manual API testing:**
   ```bash
   curl -X GET http://localhost:8787/api/v1/billing/plans \
     -H "x-tenant-id: test-tenant"
   ```

### Production Validation

1. **Stripe test mode** (use test keys before production)
2. **Razorpay sandbox** (https://sandbox.razorpay.com)
3. **Webhook testing** with stripe/razorpay CLIs

---

## Common Tasks

### Adding a New SKU

```sql
INSERT INTO product_skus
(id, product_code, name, tier, billing_type, billing_interval, price_cents, currency, features, limits, sort_order, status)
VALUES
('sku_new_m', 'IW-NEW-M', 'New Tier (Monthly)', 'new_tier', 'recurring', 'monthly', 9900, 'usd',
 '["feature1","feature2"]', '{"connectors":15,"users":5}', 7, 'active');
```

### Updating Pricing

```sql
UPDATE product_skus
SET price_cents = 6900, updated_at = datetime('now')
WHERE product_code = 'IW-PRO-M';
```

### Migrating Tenant to Enterprise

```sql
INSERT INTO tenant_subscriptions
(id, tenant_id, sku_id, status, activated_at, gateway, gateway_subscription_id)
VALUES
(uuid(), 'tenant-123', 'sku_enterprise', 'active', datetime('now'), 'manual', 'manual_enterprise_x');
```

---

## References

- **Stripe API:** https://stripe.com/docs/api
- **Razorpay API:** https://razorpay.com/docs/
- **Type Definitions:** `packages/types/src/billing.ts`
- **Migrations:** `migrations/20260301_product_skus_and_billing.sql`
- **Billing Service:** `services/billing/src/index.ts`
