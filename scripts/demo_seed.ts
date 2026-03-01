import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgres://neondb_owner:npg_R2Hst7ZqUIGn@ep-fancy-pond-a5h9e1sq-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require';
const sql = neon(DATABASE_URL);

const TENANT_ID = '11111111-1111-1111-1111-111111111111';

async function seed() {
    console.log('--- IntegrateWise v11: Full Scenario Seeding ---');

    // 1. Clear Situations
    await sql`DELETE FROM proposals WHERE tenant_id = ${TENANT_ID}::uuid`;
    await sql`DELETE FROM situations WHERE tenant_id = ${TENANT_ID}::uuid`;

    // 2. Sales / Pricing Friction (Truth + Memory + Task)
    await sql`DELETE FROM deals WHERE tenant_id = ${TENANT_ID}::uuid`;
    await sql`INSERT INTO deals (tenant_id, name, amount, stage) VALUES (${TENANT_ID}, 'Acme Corp Expansion', 75000, 'proposal')`;

    await sql`DELETE FROM tasks WHERE tenant_id = ${TENANT_ID}::uuid`;
    await sql`INSERT INTO tasks (tenant_id, title, status, due_date) VALUES (${TENANT_ID}, 'Review CompetitorX pricing match for Acme', 'pending', NOW() - INTERVAL '2 days')`;

    await sql`DELETE FROM knowledge_documents WHERE tenant_id = ${TENANT_ID}::uuid`;
    await sql`INSERT INTO knowledge_documents (tenant_id, source_type, content) VALUES (${TENANT_ID}, 'meeting_notes', 'CFO mentioned CompetitorX offered them a 25% discount if they switch. We need to counter with at least 15% buffer.')`;

    // 3. Marketing ROI Anomaly (Truth + Memory)
    await sql`DELETE FROM campaigns WHERE tenant_id = ${TENANT_ID}::uuid`;
    await sql`INSERT INTO campaigns (tenant_id, name, status, spend, budget) VALUES (${TENANT_ID}, 'High-Growth Retargeting', 'active', 28000, 30000)`;
    await sql`INSERT INTO knowledge_documents (tenant_id, source_type, content) VALUES (${TENANT_ID}, 'audit', 'Marketing ROI is dropping. Audience mismatch detected in Retargeting campaign. High bounce rate on mobile.')`;

    // 4. Product Usage Confusion (Event + Ticket)
    await sql`DELETE FROM normalized_events WHERE tenant_id = ${TENANT_ID}::uuid`;
    await sql`INSERT INTO normalized_events (tenant_id, resource_type, source_system, canonical_event_type, severity, occurred_at) VALUES (${TENANT_ID}, 'feature', 'amplitude', 'click_error_retry', 'warning', NOW())`;
    await sql`INSERT INTO knowledge_documents (tenant_id, source_type, content) VALUES (${TENANT_ID}, 'support', 'User confusion spike regarding Sidebar navigation changes. Tickets #991, #992 mention layout is non-intuitive.')`;

    console.log('--- Seeding Complete. System ready for Analysis. ---');
}

seed().catch(console.error);
