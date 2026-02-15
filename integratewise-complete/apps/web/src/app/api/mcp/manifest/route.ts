import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        name: "IntegrateWise MCP Connector",
        description: "Connect your AI Agents to IntegrateWise OS Connectors and Accelerators.",
        version: "1.0.0",
        connectivity: {
            protocol: "sse",
            url: "https://integratewise.ai/api/mcp/connect"
        },
        capabilities: {
            resources: true,
            prompts: true,
            tools: true
        },
        tools_available: [
            "get_accelerator_registry",
            "run_accelerator_signal",
            "list_active_connectors",
            "query_knowledge_graph"
        ]
    });
}
