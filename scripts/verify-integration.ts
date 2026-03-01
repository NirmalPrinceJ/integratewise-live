import axios from 'axios';

const MCP_URL = process.env.MCP_URL || 'http://localhost:8787';
const IQ_HUB_URL = process.env.IQ_HUB_URL || 'http://localhost:8788';
const LOADER_URL = process.env.LOADER_URL || 'http://localhost:8789';
const THINK_URL = process.env.THINK_URL || 'http://localhost:8790';

const MCP_KEY = process.env.MCP_CONNECTOR_API_KEY || 'test-key';
const TENANT_ID = 'tenant-test-123';
const SESSION_ID = `session-${Date.now()}`;

async function runVerification() {
    console.log('🚀 Starting Knowledge-Worker Verification...');

    try {
        // 1. Capture Memory via MCP
        console.log('\n1. Capturing memory via MCP...');
        const mcpResponse = await axios.post(`${MCP_URL}/v1/mcp/save_session_memory`, {
            tenant_id: TENANT_ID,
            session_id: SESSION_ID,
            tool_source: 'claude',
            summary: 'Test session for integration verification.',
            memories: [
                {
                    memory_type: 'decision',
                    text: 'Verified integration works with end-to-end flow.',
                    confidence_score: 0.99
                }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${MCP_KEY}` }
        });
        console.log('✅ MCP Capture Success:', mcpResponse.data.status);

        // 2. Mock Promotion in IQ Hub
        console.log('\n2. Promoting memory in IQ Hub...');
        const memoryId = `${TENANT_ID}::${SESSION_ID}::0`;
        const iqResponse = await axios.patch(`${IQ_HUB_URL}/v1/iq/memories/${memoryId}`, {
            trust_level: 'high',
            confirmed_by: 'system_verify'
        }, {
            headers: { 'x-tenant-id': TENANT_ID }
        });
        console.log('✅ IQ Hub Promotion Success:', iqResponse.data.new_trust_level);

        // 3. Trigger Sync
        console.log('\n3. Triggering Loader Sync...');
        const syncResponse = await axios.post(`${LOADER_URL}/jobs/sync-ai-sessions`, {}, {
            headers: { 'Authorization': 'Bearer dev-secret' }
        });
        console.log('✅ Sync Job Triggered:', syncResponse.data.status);

        // 4. Verify in Think
        console.log('\n4. Verifying Evidence in Think...');
        const thinkResponse = await axios.post(`${THINK_URL}/analyze`, {
            tenant_id: TENANT_ID,
            trigger_event: 'system_verification'
        });
        console.log('✅ Think Analysis Synthesis:', thinkResponse.data.synthesis);
        console.log('✅ Evidence Count:', thinkResponse.data.evidence_refs?.length || 0);

        console.log('\n🎉 Verification Complete!');
    } catch (err: any) {
        console.error('\n❌ Verification Failed:', err.response?.data || err.message);
        process.exit(1);
    }
}

runVerification();
