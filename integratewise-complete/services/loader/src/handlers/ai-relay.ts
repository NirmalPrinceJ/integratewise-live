import type { Context } from 'hono';
import { AIRelayWebhookSchema } from '@integratewise/types/webhooks';
import { normalizeAIRelayEvent } from '@integratewise/lib/normalizers';

type Log = {
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
};

/**
 * Constant-time string comparison for Cloudflare Workers
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Verify AI-Relay webhook signature using HMAC-SHA256 (Web Crypto API)
 */
async function verifyAIRelaySignature(
  rawBody: string,
  signature: string | null,
  timestamp: string | null,
  secret: string,
): Promise<boolean> {
  if (!signature || !timestamp) {
    return false;
  }

  // Check timestamp to prevent replay attacks (5 minute window)
  const requestTimestamp = parseInt(timestamp, 10);
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const timeDiff = Math.abs(currentTimestamp - requestTimestamp);

  if (timeDiff > 300) {
    // 5 minutes
    return false;
  }

  // Create signature basestring: timestamp:body
  const basestring = `${timestamp}:${rawBody}`;

  // Compute expected signature using Web Crypto API
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(basestring));
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Extract signature from header (format: "v1=<signature>")
  const actualSignature = signature.startsWith('v1=') ? signature.slice(3) : signature;

  // Constant-time comparison
  return timingSafeEqual(actualSignature, expectedSignature);
}

/**
 * AI-Relay Gateway webhook handler
 * Receives AI completion events from AI-Relay Gateway service
 */
export async function aiRelayHandler(c: Context) {
  const log = c.get('log') as Log;

  // Get raw body for signature verification (use stored body if available from idempotency middleware)
  const rawBody = (c.get('webhookRawBody') as string | undefined) || await c.req.text();
  const signature = c.req.header('x-ai-relay-signature');
  const timestamp = c.req.header('x-ai-relay-timestamp');

  // Parse body
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    log.warn('Invalid JSON payload');
    return c.json({ error: 'Invalid payload' }, 400);
  }

  const parsed = AIRelayWebhookSchema.safeParse(body);

  if (!parsed.success) {
    log.warn('Invalid AI-Relay payload schema', { errors: parsed.error.flatten() });
    return c.json({ error: 'Invalid payload', details: parsed.error.flatten() }, 400);
  }

  // Verify signature
  const secret = c.env.AI_RELAY_WEBHOOK_SECRET ?? '';
  if (secret) {
    const isValid = await verifyAIRelaySignature(rawBody, signature ?? null, timestamp ?? null, secret);

    if (!isValid) {
      log.warn('Invalid AI-Relay signature', {
        hasSignature: !!signature,
        hasTimestamp: !!timestamp,
      });
      return c.json({ error: 'Invalid signature' }, 401);
    }
  } else {
    log.warn('AI_RELAY_WEBHOOK_SECRET not configured, skipping signature verification');
  }

  log.info('AI-Relay webhook received', {
    eventType: parsed.data.type,
    eventId: parsed.data.id,
    workspaceId: parsed.data.workspace_id,
    model: parsed.data.model,
  });

  // Normalize to SPINE event format
  const spineEvent = normalizeAIRelayEvent(parsed.data);

  // Forward to core engine
  const response = await fetch(`${c.env.CORE_ENGINE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-request-id': c.get('requestId'),
    },
    body: JSON.stringify(spineEvent),
  });

  if (!response.ok) {
    log.error('Failed to forward AI-Relay event', { status: response.status });
    return c.json({ error: 'Failed to forward event' }, 500);
  }

  return c.json({ ok: true, event_id: parsed.data.id });
}
