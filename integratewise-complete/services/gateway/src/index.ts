import { Hono } from 'hono';
import { neon } from '@neondatabase/serverless';
import { StripePaymentEventSchema, SalesforceLeadSchema } from '@integratewise/connector-contracts';
import { handleConnectorError } from '@integratewise/connector-utils';

type Bindings = {
    DATABASE_URL: string;
    THINK_URL: string;
}

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', (c) =>
  c.json({ service: 'IntegrateWise Gateway', status: 'operational', version: '1.0.0' })
);

// ✅ Add health check route
app.get('/health', async (c) => {
  return c.json({
    service: 'IntegrateWise Gateway',
    status: 'healthy',
    environment: c.env?.ENVIRONMENT ?? 'unknown',
    ts: new Date().toISOString(),
  });
});

/**
 * SOURCE MAPPERS (Normalizer Logic)
 */
const MAPPERS = {
    stripe: (payload: any) => {
        const event = StripePaymentEventSchema.parse(payload);
        return {
            type: `stripe.${event.type}`,
            idempotency_key: event.id,
            entity_type: 'account',
            entity_id: event.data.object.customer,
            payload: event
        };
    },
    salesforce: (payload: any) => {
        const lead = SalesforceLeadSchema.parse(payload);
        return {
            type: 'salesforce.lead.upsert',
            idempotency_key: `sf_lead_${lead.Id || lead.Email}`,
            entity_type: 'lead',
            entity_id: lead.Id || lead.Email,
            payload: lead
        };
    },
    zendesk: (payload: any) => {
        return {
            type: 'zendesk.ticket.created',
            idempotency_key: `zen_${payload.id}`,
            entity_type: 'account',
            entity_id: payload.external_id || payload.organization_id,
            payload: payload
        };
    },
    calendar: (payload: any) => {
        return {
            type: 'calendar.event.created',
            idempotency_key: `cal_${payload.id}`,
            entity_type: 'person',
            entity_id: payload.organizer.email,
            payload: payload
        };
    }
};

app.get('/health', (c) => c.json({ status: 'ok', service: 'gateway', role: 'normalizer' }));

app.post('/webhook/:source', async (c) => {
    const sql = neon(c.env.DATABASE_URL);
    const source = c.req.param('source') as keyof typeof MAPPERS;
    const tenant_id = c.req.header('x-tenant-id');

    if (!tenant_id) return c.json({ error: 'Missing x-tenant-id' }, 400);
    if (!MAPPERS[source]) return c.json({ error: `Unsupported source: ${source}` }, 400);

    const rawPayload = await c.req.json();

    try {
        const startTime = Date.now();
        const normalized = MAPPERS[source](rawPayload);

        const [insertedEvent] = await sql`
            INSERT INTO events (
                tenant_id, event_type, source_system, payload, 
                idempotency_key, entity_type, entity_id, 
                received_at, normalized_at
            ) VALUES (
                ${tenant_id}::uuid, 
                ${normalized.type}, 
                ${source}, 
                ${JSON.stringify(normalized.payload)},
                ${normalized.idempotency_key},
                ${normalized.entity_type},
                ${normalized.entity_id},
                ${new Date().toISOString()},
                ${new Date().toISOString()}
            )
            ON CONFLICT (tenant_id, source_system, idempotency_key) DO NOTHING
            RETURNING id, event_type, entity_type, entity_id
        `;

        if (insertedEvent && c.env.THINK_URL) {
            // Trigger Think Service to process signals (fire and forget)
            fetch(`${c.env.THINK_URL}/v1/process-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': tenant_id
                },
                body: JSON.stringify(insertedEvent)
            }).catch(e => console.error('Signal Engine Trigger Failed:', e));
        }

        return c.json({
            status: 'success',
            event_id: insertedEvent?.id,
            event_type: normalized.type,
            latency_ms: Date.now() - startTime
        });

    } catch (err: any) {
        // Log to normalization_errors (DLQ)
        await sql`
            INSERT INTO normalization_errors (tenant_id, source_system, raw_payload, error_message)
            VALUES (${tenant_id}::uuid, ${source}, ${JSON.stringify(rawPayload)}, ${err.message})
        `;

        await handleConnectorError(c.env.DATABASE_URL, {
            tool_name: source,
            operation: 'normalization',
            tenant_id,
            error: err,
            payload: rawPayload,
        });

        return c.json({ error: 'Normalization failed', details: err.message }, 400);
    }
});

export default app;
