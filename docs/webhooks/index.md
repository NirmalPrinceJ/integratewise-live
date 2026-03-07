# Webhooks & Ingestion

Secure webhook ingestion with HMAC-SHA256 signatures, idempotency, retries, and dead letter queue (DLQ) operations.

## Overview

IntegrateWise OS supports webhook ingestion for real-time event processing from source tools. All webhooks are secured with HMAC-SHA256 signatures, validated for idempotency, and processed with automatic retries and DLQ handling.

## Header Conventions

### Required Headers

All webhook requests must include:

- **X-IW-Signature**: HMAC-SHA256 signature of request body + timestamp
- **X-IW-Timestamp**: Unix timestamp (seconds since epoch)
- **X-IW-Idempotency-Key**: Unique key for idempotency (optional but recommended)

### Optional Headers

- **X-IW-Event-Type**: Event type identifier (e.g., `message.created`, `deal.updated`)
- **X-IW-Source**: Source connector identifier (e.g., `slack`, `hubspot`)
- **Content-Type**: `application/json` (required for JSON payloads)

## Signature Verification

### Algorithm: HMAC-SHA256

**Signature Format:**
```
X-IW-Signature: sha256=<hex-encoded-hmac>
```

**Signature Calculation:**
```javascript
const crypto = require('crypto');

function calculateSignature(secret, timestamp, body) {
  const payload = `${timestamp}.${JSON.stringify(body)}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  return `sha256=${hmac.digest('hex')}`;
}
```

**Verification:**
```javascript
function verifySignature(secret, timestamp, body, signature) {
  const expected = calculateSignature(secret, timestamp, body);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

### Clock Skew Tolerance

- **Default**: 5 minutes (300 seconds)
- **Rejection**: Requests with timestamp outside tolerance window are rejected
- **Replay Protection**: Timestamps are checked against a sliding window

**Verification Logic:**
```javascript
function isTimestampValid(timestamp, toleranceSeconds = 300) {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.abs(now - timestamp);
  return diff <= toleranceSeconds;
}
```

### Replay Window

- **Window**: 5 minutes (300 seconds)
- **Storage**: Processed idempotency keys stored for replay window duration
- **Rejection**: Duplicate requests within replay window are rejected

## Idempotency

### Header: X-IW-Idempotency-Key

**Format:**
- Must be unique per event
- Recommended: `{source-tool}-{external-ref}-{timestamp}`
- Example: `slack-C01234ABCD-1698840000.123456`

### Key Strategy

**Per Connector:**

| Connector | Strategy | Example |
|-----------|----------|---------|
| Slack | `slack-{ts}-{channel}` | `slack-1698840000.123456-C01234ABCD` |
| Gmail | `gmail-{message-id}` | `gmail-msg-1234567890` |
| HubSpot | `hubspot-{object-id}-{timestamp}` | `hubspot-deal-123-1698840000` |
| Stripe | `stripe-{event-id}` | `stripe-evt_1234567890` |
| ChatGPT | `chatgpt-{conversation-id}-{message-id}` | `chatgpt-conv-123-msg-456` |

### Idempotency Guarantees

- **At-least-once**: Requests may be processed multiple times, but effects are idempotent
- **Deduplication**: Duplicate requests within replay window return same response
- **Storage**: Idempotency keys stored for replay window duration (5 minutes)

## Retry Policy

### Exponential Backoff

**Schedule:**
- Attempt 1: Immediate
- Attempt 2: 1 second delay
- Attempt 3: 2 seconds delay
- Attempt 4: 4 seconds delay
- Attempt 5: 8 seconds delay
- Attempt 6: 16 seconds delay

**Max Attempts:** 5 (configurable per connector)

**Retry Conditions:**
- Transient errors (5xx HTTP status)
- Network timeouts
- Rate limit errors (429) with Retry-After header

**No Retry:**
- Client errors (4xx HTTP status, except 429)
- Invalid signatures
- Expired timestamps

### Rate Limit Handling

**429 Too Many Requests:**
- Check `Retry-After` header
- Use exponential backoff with `Retry-After` as base delay
- Max 3 retries for rate limit errors

## Dead Letter Queue (DLQ)

### DLQ Persistence

- **Window**: 7 days (configurable)
- **Storage**: Failed webhook payloads stored in DLQ
- **Monitoring**: Alerts on DLQ size, age, error types

### DLQ Operations

**Reprocess:**
- Manually trigger reprocessing of DLQ items
- Supports filtering by error type, connector, date range
- Reprocessed items follow normal retry policy

**Quarantine:**
- Move items to quarantine for investigation
- Quarantined items excluded from automatic reprocessing
- Requires manual release

**Purge:**
- Delete items older than persistence window
- Supports filtering by criteria
- Audit logged

### DLQ Runbook

**Monitoring:**
1. Check DLQ size daily
2. Review error types and frequencies
3. Identify patterns (connector-specific, time-based)

**Investigation:**
1. Query DLQ by error type
2. Examine payload and headers
3. Check connector status and rate limits
4. Verify signature and timestamp validity

**Remediation:**
1. Fix root cause (connector issue, signature mismatch, etc.)
2. Reprocess affected items
3. Update connector configuration if needed
4. Monitor for recurrence

## Verification Examples

### Node.js

```javascript
const crypto = require('crypto');
const express = require('express');

const app = express();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.post('/webhooks/:connector', async (req, res) => {
  const { connector } = req.params;
  const signature = req.headers['x-iw-signature'];
  const timestamp = req.headers['x-iw-timestamp'];
  const idempotencyKey = req.headers['x-iw-idempotency-key'];

  // Verify timestamp
  const timestampInt = parseInt(timestamp, 10);
  if (!isTimestampValid(timestampInt)) {
    return res.status(400).json({ error: 'Invalid timestamp' });
  }

  // Verify signature
  const expectedSignature = calculateSignature(
    WEBHOOK_SECRET,
    timestamp,
    req.body
  );
  
  if (!verifySignature(WEBHOOK_SECRET, timestamp, req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Check idempotency
  if (idempotencyKey) {
    const processed = await checkIdempotency(idempotencyKey);
    if (processed) {
      return res.status(200).json({ message: 'Already processed' });
    }
  }

  // Process webhook
  try {
    await processWebhook(connector, req.body);
    if (idempotencyKey) {
      await storeIdempotency(idempotencyKey);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    // Send to DLQ
    await sendToDLQ(connector, req.body, error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

function isTimestampValid(timestamp, toleranceSeconds = 300) {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.abs(now - timestamp);
  return diff <= toleranceSeconds;
}

function calculateSignature(secret, timestamp, body) {
  const payload = `${timestamp}.${JSON.stringify(body)}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  return `sha256=${hmac.digest('hex')}`;
}

function verifySignature(secret, timestamp, body, signature) {
  const expected = calculateSignature(secret, timestamp, body);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

### Python

```python
import hmac
import hashlib
import time
import json
from flask import Flask, request, jsonify

app = Flask(__name__)
WEBHOOK_SECRET = os.environ.get('WEBHOOK_SECRET')

def is_timestamp_valid(timestamp, tolerance_seconds=300):
    now = int(time.time())
    diff = abs(now - timestamp)
    return diff <= tolerance_seconds

def calculate_signature(secret, timestamp, body):
    payload = f"{timestamp}.{json.dumps(body, sort_keys=True)}"
    hmac_obj = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    )
    return f"sha256={hmac_obj.hexdigest()}"

def verify_signature(secret, timestamp, body, signature):
    expected = calculate_signature(secret, timestamp, body)
    return hmac.compare_digest(signature, expected)

@app.route('/webhooks/<connector>', methods=['POST'])
async def webhook_handler(connector):
    signature = request.headers.get('X-IW-Signature')
    timestamp = request.headers.get('X-IW-Timestamp')
    idempotency_key = request.headers.get('X-IW-Idempotency-Key')

    # Verify timestamp
    timestamp_int = int(timestamp)
    if not is_timestamp_valid(timestamp_int):
        return jsonify({'error': 'Invalid timestamp'}), 400

    # Verify signature
    if not verify_signature(WEBHOOK_SECRET, timestamp, request.json, signature):
        return jsonify({'error': 'Invalid signature'}), 401

    # Check idempotency
    if idempotency_key:
        processed = await check_idempotency(idempotency_key)
        if processed:
            return jsonify({'message': 'Already processed'}), 200

    # Process webhook
    try:
        await process_webhook(connector, request.json)
        if idempotency_key:
            await store_idempotency(idempotency_key)
        return jsonify({'success': True}), 200
    except Exception as error:
        # Send to DLQ
        await send_to_dlq(connector, request.json, error)
        return jsonify({'error': 'Processing failed'}), 500
```

## Failure Modes

### Invalid Signature

**Cause:** Signature mismatch, wrong secret, tampered payload

**Response:** `401 Unauthorized`

**Action:** Log security event, do not retry

### Expired Timestamp

**Cause:** Clock skew exceeds tolerance, replay attack

**Response:** `400 Bad Request`

**Action:** Log security event, do not retry

### Duplicate Request

**Cause:** Idempotency key already processed

**Response:** `200 OK` (with cached response)

**Action:** Return cached response, do not reprocess

### Processing Failure

**Cause:** Transient error (5xx), network timeout, rate limit

**Response:** `500 Internal Server Error` (after retries exhausted)

**Action:** Send to DLQ, alert operators

## Ordering Guarantees

### Per Connector

- **Slack**: Ordered by `ts` (timestamp) within channel
- **Gmail**: Ordered by `Date` header within thread
- **HubSpot**: Ordered by `occurredAt` within object
- **Stripe**: Ordered by `created` timestamp

### Cross-Connector

- No ordering guarantees across connectors
- Use `created_at` timestamps for cross-connector ordering
- Idempotency ensures no duplicate processing

## See Also

- [Integrations Matrix](../integrations/matrix.md) - Connector webhook capabilities
- [Security Documentation](../security/index.md) - Security controls
- [API Reference](../api/index.md) - Webhook API endpoints
