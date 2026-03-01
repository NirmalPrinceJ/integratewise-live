import { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { TOOL_REGISTRY } from '../lib/tool-registry';
// Integration handlers
import { stripeHandler } from './stripe';
import { hubspotHandler } from './hubspot';
import { slackHandler } from './slack';
import { discordHandler } from './discord';
import { notionHandler } from './notion';
import { aiRelayHandler } from './ai-relay';
import { asanaHandler, githubHandler } from './integrations';
import { webflowHandler } from './webflow';
// Cron handlers
import {
  dailyInsightsHandler,
  hourlyInsightsHandler,
  spendInsightsHandler,
  outboxHandler,
  integrityCheckHandler,
  syncSchedulerHandler,
} from './cron';
// Data loader handlers
import {
  slackLoaderHandler,
  hubspotLoaderHandler,
  notionLoaderHandler,
  gmailLoaderHandler,
  sheetsLoaderHandler,
} from './loaders';
// API handlers
import {
  brainstormHandler,
  neutronIngestHandler,
  dataSyncHandler,
  webhookSchedulerHandler,
} from './api';
// System/Tools handlers
import { webformHandler } from './webform';
import { telemetryMetricsHandler, telemetryHealthHandler } from './telemetry';
import { nettoolsInfoHandler } from './nettools';

/**
 * Store active transports in memory.
 * NOTE: In a production Cloudflare Worker environment with multiple instances,
 * you should use Durable Objects to manage this state to ensure the POST
 * handler can find the correct transport for the SSE connection.
 */
const transportMap = new Map<string, SSEServerTransport>();

/**
 * Handler map that routes tool IDs to their actual handler functions
 */
type HandlerFunction = (c: Context) => Promise<Response>;

const handlerMap: Record<string, HandlerFunction> = {
  // Integration handlers
  stripe: stripeHandler,
  hubspot: hubspotHandler,
  slack: slackHandler,
  discord: discordHandler,
  notion: notionHandler,
  'ai-relay': aiRelayHandler,
  asana: asanaHandler,
  github: githubHandler,
  webflow: webflowHandler,

  // Cron handlers
  'daily-insights': dailyInsightsHandler,
  'hourly-insights': hourlyInsightsHandler,
  'spend-insights': spendInsightsHandler,
  outbox: outboxHandler,
  'integrity-check': integrityCheckHandler,
  'sync-scheduler': syncSchedulerHandler,

  // Data loader handlers
  'loader-slack': slackLoaderHandler,
  'loader-hubspot': hubspotLoaderHandler,
  'loader-notion': notionLoaderHandler,
  'loader-gmail': gmailLoaderHandler,
  'loader-sheets': sheetsLoaderHandler,

  // API handlers
  brainstorm: brainstormHandler,
  'neutron-ingest': neutronIngestHandler,
  'data-sync': dataSyncHandler,
  'webhook-scheduler': webhookSchedulerHandler,
  webform: webformHandler,

  // System handlers
  health: async (c: Context) => {
    return c.json({
      service: 'IntegrateWise Loader',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  },
  telemetry: telemetryMetricsHandler,
  nettools: nettoolsInfoHandler,
};

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
                    try {
                        // Look up the handler by tool ID
                        const handler = handlerMap[tool.id];

                        if (!handler) {
                            return {
                                content: [{
                                    type: "text",
                                    text: `Handler not found for tool '${tool.id}'. Available handlers: ${Object.keys(handlerMap).join(', ')}`
                                }],
                                isError: true,
                            };
                        }

                        // Create a mock Hono Context that wraps the MCP args
                        // This allows handlers to work with MCP invocations
                        const mockContext = createMockContext(tool.id, args);

                        // Execute the handler
                        const response = await handler(mockContext);

                        // Extract the JSON response from the handler
                        let responseData: any;
                        try {
                            responseData = await response.clone().json();
                        } catch {
                            // If not JSON, try text
                            const text = await response.clone().text();
                            responseData = { result: text, status: response.status };
                        }

                        // Return handler response as MCP content
                        return {
                            content: [{
                                type: "text",
                                text: JSON.stringify(responseData, null, 2)
                            }],
                            isError: !response.ok,
                        };
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                        return {
                            content: [{
                                type: "text",
                                text: `Error executing tool '${tool.id}': ${errorMessage}`
                            }],
                            isError: true,
                        };
                    }
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
 * Create a mock Hono Context for MCP tool invocations
 * Allows handlers to work with MCP args as if they came from HTTP requests
 */
function createMockContext(toolId: string, args: Record<string, unknown>): Context {
    // Create a mock request object
    const mockRequest = {
        method: 'POST',
        url: `http://localhost/api/v1/tool/${toolId}`,
        headers: new Map([
            ['content-type', 'application/json'],
            ['x-tool-id', toolId],
        ]),
        text: async () => JSON.stringify(args),
        json: async () => args,
        query: (key?: string) => {
            if (key) {
                return (args as any)[key];
            }
            return args;
        },
        param: (key?: string) => {
            if (key) {
                return (args as any)[key];
            }
            return args;
        },
        header: (key: string) => {
            const headerKey = key.toLowerCase();
            for (const [k, v] of (mockRequest.headers as Map<string, string>).entries()) {
                if (k.toLowerCase() === headerKey) {
                    return v;
                }
            }
            return (args as any)[key]; // Fallback to args
        },
    } as any;

    // Create mock Hono Context
    const mockContext = {
        req: mockRequest,
        env: {
            CORE_ENGINE_URL: process.env.CORE_ENGINE_URL || 'http://localhost:8000',
            ENVIRONMENT: process.env.ENVIRONMENT || 'development',
            // Add other environment variables as needed
        } as any,
        json: (data: any, status?: number) => {
            return new Response(JSON.stringify(data), {
                status: status || 200,
                headers: { 'content-type': 'application/json' },
            });
        },
        text: (data: string, status?: number) => {
            return new Response(data, {
                status: status || 200,
                headers: { 'content-type': 'text/plain' },
            });
        },
        get: (key: string) => {
            if (key === 'log') {
                return {
                    info: (msg: string, data?: any) => console.log(`[${toolId}]`, msg, data),
                    warn: (msg: string, data?: any) => console.warn(`[${toolId}]`, msg, data),
                    error: (msg: string, data?: any) => console.error(`[${toolId}]`, msg, data),
                };
            }
            if (key === 'requestId') {
                return crypto.randomUUID();
            }
            if (key === 'webhookRawBody') {
                return JSON.stringify(args);
            }
            return (args as any)[key];
        },
        set: () => {},
    } as any;

    return mockContext;
}

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