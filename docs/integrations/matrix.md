# Integrations Capability Matrix

This catalog details the capabilities, constraints, and operational parameters for each supported connector in the IntegrateWise OS.

## Summary Matrix

| Source | Mode | Auth | Entities | Sync Strategy | Rate Limits | PII-Safe |
|---|---|---|---|---|---|---|
| **Slack** | Full / Webhook | OAuth2 (User/Bot) | Messages, Channels, Users | Event-driven (Webhooks) | Tier 2 (20 req/m) | ✅ Yes |
| **Gmail** | Full / Render Only | OAuth2 | Messages, Threads, Labels | Polling + History API | 1,000,000 qu/day | ⚠️ Body Encrypted |
| **HubSpot** | Full | OAuth2 / Private App | Deals, Contacts, Companies | Batch Sync (15m) | 100 req/10s | ✅ Yes |
| **Stripe** | Render Only | API Key | Charges, Customers, Subs | Webhook (Events) | 100 req/s | ❌ Redacted |
| **Notion** | Full | OAuth2 | Pages, Databases, Blocks | Polling (5m) | 3 req/s | ✅ Yes |
| **Google Calendar** | Full | OAuth2 | Events, Calendars | Polling + Watch | 500 req/day | ✅ Yes |
| **Salesforce** | Full | OAuth2 | Opportunities, Accounts | Batch (Bulk API) | 15,000 req/day | ✅ Yes |
| **Jira** | Full | OAuth2 | Issues, Projects, Sprints | Webhook + Polling | 100 req/s | ✅ Yes |
| **Asana** | Full | OAuth2 | Tasks, Projects | Webhook (Events) | 150 req/m | ✅ Yes |
| **GitHub** | Full | OAuth2 App | Issues, PRs, Repos | Webhook | 5000 req/hr | ✅ Yes |

## Detailed Connector Specs

### Slack
- **Auth**: OAuth2 (Scopes: `channels:history`, `chat:write`, `users:read`).
- **Mode**: Full (Read/Write) or Webhook (Ingest Only).
- **Entities**: 
  - `Message` → `Conversation` / `Task`
  - `User` → `Participant`
- **Sync**: Real-time via Events API.
- **Webhooks**: 
  - Signature: `X-Slack-Signature` (HMAC-SHA256).
  - Tolerance: 5m.
  - Events: `message`, `reaction_added`.
- **Idempotency**: `X-Slack-Retry-Num` handling.
- **DLQ**: Max 3 retries, then quarantine.

### Gmail
- **Auth**: OAuth2 (Scopes: `gmail.readonly` or `gmail.modify`).
- **Mode**: Full or Render Only.
- **Entities**:
  - `Message` → `Conversation`
- **Sync**: History API polling every 5m.
- **Rate Limits**: 1B quota units/day. Backoff: Exponential.
- **Idempotency**: Message ID based dedup.

### HubSpot
- **Auth**: OAuth2.
- **Mode**: Full.
- **Entities**:
  - `Deal` → `Task` / `Plan`
  - `Contact` → `Participant`
- **Sync**: Batch sync every 15m.
- **Webhooks**: Supported for property changes.
  - Signature: `X-HubSpot-Signature` (SHA-256).
- **Backoff**: Retry-After header respected.

### Stripe
- **Auth**: Restricted API Keys.
- **Mode**: Render Only (Reporting).
- **Entities**:
  - `Subscription` → `HealthMetric`
- **Sync**: Webhook driven (`invoice.paid`, `customer.subscription.updated`).
- **Webhooks**:
  - Signature: `Stripe-Signature` (HMAC-SHA256, t=timestamp).
  - Tolerance: 5m.
- **Idempotency**: `Idempotency-Key` header sent on writes (if active).

### Salesforce
- **Auth**: OAuth2 (Connected App).
- **Mode**: Full.
- **Entities**: `Opportunity` → `Task`, `Account` → `HealthMetric`.
- **Sync**: Bulk API for initial load, then Streaming API.

### Jira
- **Auth**: OAuth2 (3LO).
- **Mode**: Full.
- **Entities**: `Issue` → `Task`.
- **Sync**: Webhooks for real-time updates.

### Asana
- **Auth**: OAuth2.
- **Mode**: Full.
- **Entities**: `Task` → `Task`.
- **Sync**: Events API.

### GitHub
- **Auth**: GitHub App.
- **Mode**: Full.
- **Entities**: `Issue` → `Task`, `PR` → `Task` (Review).
- **Sync**: Webhooks.

## Event Payload Examples

### Slack Message
```json
{
  "type": "event_callback",
  "event_id": "Ev012345",
  "event_time": 1612345678,
  "event": {
    "type": "message",
    "channel": "C12345",
    "user": "U12345",
    "text": "Please review the Q4 plan.",
    "ts": "1612345678.0001"
  }
}
```

### Stripe Invoice Paid
```json
{
  "id": "evt_123456789",
  "object": "event",
  "type": "invoice.paid",
  "created": 1612345678,
  "data": {
    "object": {
      "id": "in_123456789",
      "amount_paid": 2900,
      "currency": "usd",
      "customer": "cus_12345",
      "status": "paid"
    }
  }
}
```
