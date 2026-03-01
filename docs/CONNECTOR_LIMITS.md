# Connector Rate Limits Reference

This document tracks official rate limits for integrated systems to ensure IntegrateWise remains within compliant boundaries.

| System | Official Limit | IntegrateWise Safety Target (Per Tenant) |
|--------|----------------|-----------------------------------------|
| Stripe | 100 requests/sec (live) | 10 requests/sec |
| Salesforce | varies by edition | 5 requests/sec |
| OpenAI (GPT-4o) | 500 RPM | 50 RPM |
| Slack | 1 message/sec | 1 message/sec |
| Zendesk | 10 requests/sec | 2 requests/sec |

## Throttling Strategy

1. **Adapter-Level Check**: Before any API call, the adapter checks the local rate-limiter.
2. **Backpressure**: If approaching 90% of limit, non-critical operations (like lead logging) are queued for 1-5 minutes.
3. **Emergency Cutoff**: If 100% is reached, non-critical operations return 429 to the internal service; critical ones (like payments) trigger a HIGH SEVERITY Situation.
