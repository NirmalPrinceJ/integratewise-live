import type { Context } from 'hono';
import { DiscordInteractionSchema } from '@integratewise/types/webhooks';
import { normalizeDiscordEvent } from '@integratewise/lib/normalizers';

type Log = {
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
};

export async function discordHandler(c: Context) {
  const log = c.get('log') as Log;

  const body = await c.req.json();
  const parsed = DiscordInteractionSchema.safeParse(body);

  if (!parsed.success) {
    log.warn('Invalid Discord payload schema', { errors: parsed.error.flatten() });
    return c.json({ error: 'Invalid payload' }, 400);
  }

  // Handle PING (type 1)
  if (parsed.data.type === 1) {
    log.info('Discord PING received');
    return c.json({ type: 1 });
  }

  // TODO: Verify Discord signature
  // const signature = c.req.header('x-signature-ed25519');
  // const timestamp = c.req.header('x-signature-timestamp');

  log.info('Discord webhook received', {
    type: parsed.data.type,
    interactionId: parsed.data.id,
  });

  const spineEvent = normalizeDiscordEvent(parsed.data);

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
    // Discord requires quick response, handle async
    log.error('Failed to forward Discord event', { status: response.status });
  }

  // Acknowledge interaction
  return c.json({ type: 5 }); // DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
}
