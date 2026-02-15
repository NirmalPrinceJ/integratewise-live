import { NextRequest, NextResponse } from 'next/server';
import {
    TenantHydrationStatus,
    DataStrength,
    SpineDensity,
    ContextDensity,
    KnowledgeDensity,
    calculateDataStrength
} from '@/types/data-strength';

// ═══════════════════════════════════════════════════════════════
// GET /api/hydration/status - Fetch tenant hydration status
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenant_id');

    if (!tenantId) {
        return NextResponse.json(
            { error: 'tenant_id is required' },
            { status: 400 }
        );
    }

    try {
        // In production, this would call the Gateway API
        // For now, return mock data that demonstrates the hydration system
        const status = await fetchHydrationStatus(tenantId);
        return NextResponse.json(status);
    } catch (error) {
        console.error('Error fetching hydration status:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hydration status' },
            { status: 500 }
        );
    }
}

// ═══════════════════════════════════════════════════════════════
// MOCK DATA - Will be replaced with real API calls
// ═══════════════════════════════════════════════════════════════

async function fetchHydrationStatus(tenantId: string): Promise<TenantHydrationStatus> {
    // This demonstrates the structure - in production would fetch from Gateway

    // Mock: Simulate different hydration states based on tenant ID
    const mockLevels: Record<string, 'new' | 'partial' | 'growing' | 'rich'> = {
        'tenant-new': 'new',
        'tenant-partial': 'partial',
        'tenant-growing': 'growing',
        'tenant-rich': 'rich'
    };

    const level = mockLevels[tenantId] || 'partial';

    // Generate mock data based on level
    const mockData = generateMockData(level);

    return {
        tenant_id: tenantId,
        connected_tools: mockData.tools,
        spine_density: mockData.spine,
        context_density: mockData.context,
        knowledge_density: mockData.knowledge,
        data_strength: mockData.strength,
        created_at: new Date().toISOString(),
        last_sync_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        last_updated: new Date().toISOString()
    };
}

function generateMockData(level: 'new' | 'partial' | 'growing' | 'rich') {
    const configs = {
        new: {
            tools: [],
            spine: { accounts: 0, contacts: 0, deals: 0, meetings: 0, tasks: 0, projects: 0, notes: 0, total: 0 },
            context: { documents: 0, emails: 0, transcripts: 0, extracted_facts: 0, files_in_r2: 0, total_bytes: 0 },
            knowledge: { summaries: 0, topics: 0, chunks: 0, ai_insights: 0, embeddings_count: 0 }
        },
        partial: {
            tools: [
                { tool_id: 'hubspot', tool_name: 'HubSpot', connected_at: new Date().toISOString(), last_sync: new Date().toISOString(), sync_status: 'complete' as const, records_synced: 45 }
            ],
            spine: { accounts: 12, contacts: 45, deals: 8, meetings: 0, tasks: 0, projects: 0, notes: 5, total: 70 },
            context: { documents: 3, emails: 0, transcripts: 0, extracted_facts: 8, files_in_r2: 3, total_bytes: 1024000 },
            knowledge: { summaries: 2, topics: 5, chunks: 15, ai_insights: 3, embeddings_count: 50 }
        },
        growing: {
            tools: [
                { tool_id: 'hubspot', tool_name: 'HubSpot', connected_at: new Date().toISOString(), last_sync: new Date().toISOString(), sync_status: 'complete' as const, records_synced: 250 },
                { tool_id: 'gmail', tool_name: 'Gmail', connected_at: new Date().toISOString(), last_sync: new Date().toISOString(), sync_status: 'complete' as const, records_synced: 180 }
            ],
            spine: { accounts: 85, contacts: 250, deals: 42, meetings: 28, tasks: 15, projects: 3, notes: 22, total: 445 },
            context: { documents: 25, emails: 180, transcripts: 8, extracted_facts: 85, files_in_r2: 30, total_bytes: 25000000 },
            knowledge: { summaries: 42, topics: 18, chunks: 350, ai_insights: 28, embeddings_count: 500 }
        },
        rich: {
            tools: [
                { tool_id: 'hubspot', tool_name: 'HubSpot', connected_at: new Date().toISOString(), last_sync: new Date().toISOString(), sync_status: 'complete' as const, records_synced: 1200 },
                { tool_id: 'gmail', tool_name: 'Gmail', connected_at: new Date().toISOString(), last_sync: new Date().toISOString(), sync_status: 'complete' as const, records_synced: 2500 },
                { tool_id: 'google_calendar', tool_name: 'Google Calendar', connected_at: new Date().toISOString(), last_sync: new Date().toISOString(), sync_status: 'complete' as const, records_synced: 450 },
                { tool_id: 'notion', tool_name: 'Notion', connected_at: new Date().toISOString(), last_sync: new Date().toISOString(), sync_status: 'complete' as const, records_synced: 180 },
                { tool_id: 'slack', tool_name: 'Slack', connected_at: new Date().toISOString(), last_sync: new Date().toISOString(), sync_status: 'complete' as const, records_synced: 850 }
            ],
            spine: { accounts: 320, contacts: 1200, deals: 185, meetings: 450, tasks: 280, projects: 42, notes: 520, total: 2997 },
            context: { documents: 180, emails: 2500, transcripts: 85, extracted_facts: 650, files_in_r2: 200, total_bytes: 500000000 },
            knowledge: { summaries: 320, topics: 85, chunks: 2500, ai_insights: 180, embeddings_count: 5000 }
        }
    };

    const config = configs[level];

    // Calculate strength
    const strength = calculateDataStrength({
        connected_tools: config.tools.length,
        entity_count: config.spine.total,
        document_count: config.context.documents,
        knowledge_count: config.knowledge.summaries
    });

    // Add sources to strength
    strength.sources = config.tools.map(t => t.tool_name);

    return {
        tools: config.tools,
        spine: config.spine,
        context: config.context,
        knowledge: config.knowledge,
        strength
    };
}
