import { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { TOOL_REGISTRY } from '../lib/tool-registry';

/**
 * Store active transports in memory.
 * NOTE: In a production Cloudflare Worker environment with multiple instances,
 * you should use Durable Objects to manage this state to ensure the POST
 * handler can find the correct transport for the SSE connection.
 */
const transportMap = new Map<string, SSEServerTransport>();

/**
 * Handles the initial SSE connection for MCP.
 * This sets up the server, registers tools from the registry, and streams events.
 */
export const mcpConnectHandler = async (c: Context) => {
    return streamSSE(c, async (stream) => {
        const server = new McpServer({
            name: "IntegrateWise Webhooks",
            version: "1.0.0",
        });

        // Extract tools from the registry and register them with MCP
        for (const tool of TOOL_REGISTRY) {
            // Skip disabled tools
            if (tool.enabled === false) continue;

            server.tool(
                tool.id,
                tool.description || `Execute ${tool.id} webhook`,
                // Ensure schema is provided, defaulting to empty object if missing
                tool.schema || { type: "object", properties: {} },
                async (args) => {
                    // In the future, this is where we map the MCP call to the actual handler.
                    // For now, we return a confirmation that the tool was called.
                    return {
                        content: [{
                            type: "text",
                            text: `Tool '${tool.id}' executed successfully with args: ${JSON.stringify(args)}`
                        }]
                    };
                }
            );
        }

        // Create a transport that bridges MCP to Hono's SSE stream
        // We mock the Node.js 'res' object that the SDK expects
        const mockRes = {
            write: (data: string) => stream.write(data),
            end: () => stream.close(),
            writeHead: (status: number, headers: any) => { /* handled by Hono */ },
        } as any;

        const transport = new SSEServerTransport("/mcp/messages", mockRes);

        // Store transport for the message handler to find (using a default session ID for now)
        transportMap.set("default", transport);

        await server.connect(transport);

        // Keep the stream open
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    });
};

/**
 * Handles incoming messages (POST) from the MCP client.
 */
export const mcpMessageHandler = async (c: Context) => {
    const transport = transportMap.get("default");

    if (!transport) {
        return c.json({ error: "No active MCP session found" }, 404);
    }

    const body = await c.req.json();

    // Pass the message to the transport
    await transport.handlePostMessage({ headers: c.req.header(), body } as any, {} as any);

    return c.json({ status: "ok" });
};