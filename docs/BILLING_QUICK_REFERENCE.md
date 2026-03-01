# Billing System — Quick Reference

> Fast lookup for developers integrating with the billing system

## Database Tables

### product_skus
```sql
SELECT * FROM product_skus WHERE status = 'active';
SELECT * FROM product_skus WHERE tier = 'professional';
SELECT * FROM product_skus WHERE currency = 'inr';
```

### payment_transactions
```sql
SELECT * FROM payment_transactions WHERE status = 'pending';
SELECT * FROM payment_transactions WHERE gateway = 'stripe';
SELECT * FROM payment_transactions WHERE tenant_id = 'tenant-123';
```

### tenant_subscriptions
```sql
SELECT * FROM tenant_subscriptions WHERE status = 'active' AND tenant_id = 'tenant-123';
SELECT * FROM tenant_subscriptions WHERE expires_at < datetime('now');
```

---

## API Endpoints (Gateway)

### Billing Routes
```
GET    /api/v1/billing/plans                      → List all active SKUs
POST   /api/v1/billing/checkout                   → Create checkout session
GET    /api/v1/billing/subscription               → Get current subscription
POST   /api/v1/billing/subscriptions              → Create subscription
PUT    /api/v1/billing/subscriptions/:tenantId    → Update subscription
POST   /api/v1/billing/usage                      → Record usage metric
GET    /api/v1/billing/usage/:tenantId            → Get usage metrics
GET    /api/v1/billing/invoices/:tenantId         → Get invoices
GET    /api/v1/billing/entitlements/:tenantId     → Get limits & usage
```

### Headers Required
```
Authorization: Bearer <jwt-token>
x-tenant-id: <tenant-id>
Content-Type: application/json
```

---

## Frontend Integration

### Get Plans
```typescript
import { getBillingClient } from '@/lib/billing-client';

const client = getBillingClient();
client.setAuth(token, tenantId);

const plans = await client.getPlans();
// Filter: plans.filter(p => p.currency === 'usd')
// Sort: plans.sort((a, b) => a.sort_order - b.sort_order)
```

### Start Stripe Checkout
```typescript
await client.startStripeCheckout(
  'sku_pro_m',
  'https://app.integratewise.com/success',
  'https://app.integratewise.com/cancel'
);
```

### Start Razorpay Checkout
```typescript
await client.startRazorpayCheckout(
  'sku_pro_m_inr',
  (paymentId) => console.log('Success:', paymentId),
  (error) => console.error('Failed:', error)
);
```

### Get Subscription
```typescript
const { subscriptions } = await client.listSubscriptions();
const sub = subscriptions[0];

console.log(sub.sku_name);      // "IntegrateWise Professional (Monthly)"
console.log(sub.status);         // "active"
console.log(sub.activated_at);   // "2026-03-01T..."
console.log(sub.expires_at);     // "2026-04-01T..."
```

### Check Entitlements
```typescript
const entitlements = await client.getEntitlements();

// Remaining limits
console.log(entitlements.remaining.apiCallsPerMonth);
console.log(entitlements.remaining.connectors);

// Check feature access
if (entitlements.features.includes('full_ai')) {
  // Show AI features
}
```

### Record Usage
```typescript
await client.recordUsage('api_calls', 100, {
  endpoint: '/connector/invoke',
  status: 'success'
});
```

---

## Common SKU IDs

| SKU ID | Product Code | Name | Price |
|--------|-------------|------|-------|
| `sku_free_001` | IW-FREE-001 | Free | Free |
| `sku_starter_m` | IW-STARTER-M | Starter (Monthly) | $29 |
| `sku_starter_y` | IW-STARTER-Y | Starter (Yearly) | $279 |
| `sku_pro_m` | IW-PRO-M | Professional (Monthly) | $79 |
| `sku_pro_y` | IW-PRO-Y | Professional (Yearly) | $769 |
| `sku_enterprise` | IW-ENT-001 | Enterprise | Custom |
| `sku_starter_m_inr` | IW-STARTER-M-INR | Starter (INR) | ₹1,999 |
| `sku_pro_m_inr` | IW-PRO-M-INR | Professional (INR) | ₹5,999 |
| `sku_acc_csm` | IW-ACC-CSM | CSM Playbook | $49 |
| `sku_acc_sales` | IW-ACC-SALES | Sales Pipeline | $49 |
| `sku_acc_revops` | IW-ACC-REVOPS | RevOps Analytics | $79 |
| `sku_acc_marketing` | IW-ACC-MKTG | Marketing Campaigns | $49 |

---

## Pricing Tier Comparison

| Feature | Free | Starter | Professional | Enterprise |
|---------|------|---------|--------------|------------|
| **Price** | Free | $29/mo | $79/mo | Custom |
| **Connectors** | 3 | 10 | 25 | ∞ |
| **Users** | 1 | 3 | 10 | ∞ |
| **Storage** | 100 MB | 1 GB | 10 GB | ∞ |
| **API Calls/mo** | 1K | 10K | 100K | ∞ |
| **Support** | Community | Email | Priority | Dedicated |
| **AI Features** | No | Basic | Full | Full |
| **Governance** | No | No | Yes | Yes |
| **Popular** | No | No | **Yes** | No |

---

## Environment Variables

```bash
# Backend (Doppler)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Frontend (.env.local)
VITE_API_BASE_URL=https://api.integratewise.ai
```

---

## Error Handling

### API Error Response
```json
{
  "error": "SKU not found",
  "details": "sku_invalid_id does not exist"
}
```

### Client Error
```typescript
try {
  await client.createCheckout({ sku_id, gateway });
} catch (error) {
  console.error(error.message);
  // "Billing API error: 404 SKU not found"
}
```

---

## Webhook Events

### Stripe
- `checkout.session.completed` → Mark paid, activate subscription
- `invoice.payment_failed` → Mark past_due
- `invoice.paid` → Record payment

### Razorpay
- `payment.captured` → Mark paid, activate subscription
- `subscription.activated` → Record activation
- `subscription.charged` → Handle recurring charge

---

## Testing Scenarios

### Test with Stripe (test mode)
1. SKU: `sku_pro_m`
2. Gateway: `stripe`
3. Card: `4242 4242 4242 4242`
4. Expiry: Any future date
5. CVC: Any 3 digits

### Test with Razorpay (sandbox)
1. SKU: `sku_pro_m_inr`
2. Gateway: `razorpay`
3. Phone: Any 10-digit number
4. OTP: Sandbox generates auto-verification

---

## Debugging

### View pending transactions
```sql
SELECT * FROM payment_transactions
WHERE status = 'pending' AND created_at > datetime('now', '-1 hour');
```

### Find failed payments
```sql
SELECT * FROM payment_transactions
WHERE status = 'failed' ORDER BY created_at DESC LIMIT 10;
```

### Check subscription expiry
```sql
SELECT tenant_id, expires_at FROM tenant_subscriptions
WHERE expires_at < datetime('now', '+7 days') AND status = 'active';
```

### Verify webhook receipt
```sql
SELECT * FROM payment_transactions
WHERE gateway_session_id = 'cs_live_xxx';
```

---

## Feature Flags

### By Tier
```typescript
const features = {
  free: [],
  starter: ['basic_ai', '5_accelerators'],
  professional: [
    'full_ai',
    'brainstorm',
    'entity_360',
    'governance',
    'unlimited_accelerators'
  ],
  enterprise: ['*'], // All features
};
```

### By Subscription Status
- `active` → Full access
- `trial` → Full access
- `past_due` → Limited (notify for payment)
- `expired` → Free tier only
- `cancelled` → Downgrade to free

---

## Performance Tips

1. **Cache plans** — SKUs don't change often
   ```typescript
   const cachedPlans = useMemo(() => plans, [plans]);
   ```

2. **Lazy load billing** — Only fetch on pricing page
   ```typescript
   useEffect(() => {
     if (onPricingPage) {
       fetchPlans();
     }
   }, [onPricingPage]);
   ```

3. **Batch usage recording** — Don't send on every action
   ```typescript
   const recordUsageDebounced = debounce(
     () => client.recordUsage('api_calls', pendingCalls),
     30000  // 30 seconds
   );
   ```

---

## Related Files

- **Full Docs:** `docs/BILLING_SYSTEM.md`
- **Implementation:** `IMPLEMENTATION_SUMMARY.md`
- **Types:** `packages/types/src/billing.ts`
- **Client:** `apps/web/src/lib/billing-client.ts`
- **Service:** `services/billing/src/index.ts`
- **Schema:** `migrations/20260301_product_skus_and_billing.sql`

---

## Support

- **Stripe Support:** https://support.stripe.com
- **Razorpay Support:** https://razorpay.com/support
- **Internal Slack:** #billing-integration
- **Docs:** See BILLING_SYSTEM.md for full details
