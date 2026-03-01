import { SignalEngine } from '../services/think/src/engine';
import { neon } from '@neondatabase/serverless';

/**
 * Lead OS Hero Flow Simulation
 * 1. Inflow: Mock Lead Created Event
 * 2. Aliment: Normalize & Trigger Signal Engine
 * 3. Signal: Recognize "sales.lead_velocity"
 * 4. Situation: Escalate to "sales.hot_lead"
 * 5. Evolution: Verify Playbook Linkage
 */

async function runHeroFlowSimulation(dbUrl: string, tenantId: string) {
    const sql = neon(dbUrl);
    const engine = new SignalEngine(dbUrl);

    console.log('🎬 Starting Lead OS Hero Flow Simulation...');

    // 1. MOCK INBOUND EVENT (Normalized as if coming from Gateway)
    const mockEventId = crypto.randomUUID();
    const mockEvent = {
        id: mockEventId,
        tenant_id: tenantId,
        event_type: 'salesforce.lead.upsert',
        entity_type: 'lead',
        entity_id: 'lead_simulation_001',
    };

    console.log(`📡 [Step 1] Lead Event Generated: ${mockEventId}`);

    // Persist event to Spine
    await sql`
        INSERT INTO events (id, tenant_id, event_type, source_system, entity_type, entity_id, payload)
        VALUES (
            ${mockEvent.id}::uuid, 
            ${mockEvent.tenant_id}::uuid, 
            ${mockEvent.event_type}, 
            'simulation-salesforce', 
            ${mockEvent.entity_type}, 
            ${mockEvent.entity_id},
            ${JSON.stringify({ Email: 'nirmal@simulation.com', Company: 'SimCorp' })}
        )
    `;

    // 2. TRIGGER SIGNAL ENGINE
    console.log('🧠 [Step 2] Triggering Signal Engine...');
    const result = await engine.processEvent(mockEvent);
    console.log('✅ Signal Engine Response:', JSON.stringify(result, null, 2));

    // 3. VERIFY OUTPUTS
    const signals = await sql`
        SELECT * FROM signals WHERE tenant_id = ${tenantId}::uuid AND entity_id = 'lead_simulation_001'
    `;
    console.log(`📊 Signals Detected: ${signals.length}`);

    const situations = await sql`
        SELECT * FROM situations WHERE tenant_id = ${tenantId}::uuid AND signal_ids @> ARRAY[${signals[0]?.id}]::uuid[]
    `;

    if (situations.length > 0) {
        const situation = situations[0];
        console.log(`🔥 [Step 3] Situation Escalated: ${situation.situation_key}`);

        // 4. CHECK PLAYBOOK
        const [playbook] = await sql`
            SELECT * FROM playbooks WHERE situation_key = ${situation.situation_key}
        `;
        if (playbook) {
            console.log(`📚 [Step 4] Playbook Linked: ${playbook.title}`);

            // 5. APPROVE DECISION (Simulating human approval via API)
            console.log('✍️ [Step 5] Approving Proposed Action...');
            const [decision] = await sql`
                INSERT INTO agent_decisions (
                    tenant_id, situation_id, action_proposal_id, decision_status, decision_source
                ) VALUES (
                    ${tenantId}::uuid, 
                    ${situation.id}, 
                    gen_random_uuid(), -- Mock proposal ID
                    'approved',
                    'simulation'
                )
                RETURNING id
            `;

            // 6. TRIGGER ACT ENGINE (CRM Update)
            console.log('🚀 [Step 6] Triggering Act Engine (CRM Task)...');
            // Normally this would be a fetch to /execute
            // We'll simulate the successful execution result
            const mockResult = { task_id: 'task_sim_999', status: 'created' };

            await sql`
                UPDATE agent_decisions 
                SET act_execution_status = 'success', 
                    act_execution_details = ${JSON.stringify(mockResult)},
                    decided_at = NOW()
                WHERE id = ${decision.id}
            `;

            // 7. FINAL VERIFICATION
            const [finalDecision] = await sql`SELECT * FROM agent_decisions WHERE id = ${decision.id}`;
            console.log('🏁 [Step 7] Final Verification: Action Executed Successfully!');
            console.log('   Action Result:', JSON.stringify(finalDecision.act_execution_details, null, 2));
        }
    } else {
        console.log('⚠️ No situation escalated. Re-check rule thresholds.');
    }

    console.log('🏁 Simulation Complete.');
}

// Usage: Run via ts-node or similar.
// runHeroFlowSimulation(process.env.DATABASE_URL!, 'your-tenant-id');
