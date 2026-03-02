/**
 * MCP Session Durable Object
 * Manages MCP server lifecycle and SSE transport for a session
 * Persists across Worker restarts and works across multiple instances
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { TOOL_REGISTRY } from '../lib/tool-registry';

interface SessionState {
  sessionId: string;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
}

export class McpSessionDO implements DurableObject {
  private state: DurableObjectState;
  private env: Record<string, any>;
  private server: McpServer | null = null;
  private transport: SSEServerTransport | null = null;
  private sessionId: string;

  constructor(state: DurableObjectState, env: Record<string, any>) {
    this.state = state;
    this.env = env;
    this.sessionId = crypto.randomUUID();
  }

  /**
   * Handle HTTP requests (GET for SSE, POST for messages)
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/mcp/connect' && request.method === 'GET') {
      return this.handleConnect();
    }

    if (path === '/mcp/messages' && request.method === 'POST') {
      return this.handleMessage(request);
    }

    return new Response('Not Found', { status: 404 });
  }

  /**
   * Handle SSE connect (GET /mcp/connect)
   * Streams events back to client via Server-Sent Events
   */
  private async handleConnect(): Promise<Response> {
    // Update session metadata
    await this.state.storage.put<SessionState>('session_state', {
      sessionId: this.sessionId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true,
    });

    // Create MCP server
    this.server = new McpServer({
      name: 'IntegrateWise Webhooks (Durable Object)',
      version: '1.0.0',
    });

    // Register all enabled tools from TOOL_REGISTRY
    for (const tool of TOOL_REGISTRY) {
      if (tool.enabled === false) continue;

      this.server.tool(
        tool.id,
        tool.description || `Execute ${tool.id} webhook`,
        tool.schema || { type: 'object', properties: {} },
        async (args: Record<string, unknown>) => {
          // Update last activity timestamp
          const state = await this.state.storage.get<SessionState>('session_state');
          if (state) {
            state.lastActivity = new Date().toISOString();
            await this.state.storage.put('session_state', state);
          }

          // TODO: Implement actual tool handler invocation here
          // For now, return a placeholder response
          return {
            content: [
              {
                type: 'text',
                text: `Tool '${tool.id}' executed with args: ${JSON.stringify(args)}`,
              },
            ],
          };
        },
      );
    }

    // Capture `this` for use inside ReadableStream callback
    const self = this;

    // Return SSE stream response
    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            // Create transport with custom response mock
            const mockRes = {
              write: (data: string) => {
                controller.enqueue(new TextEncoder().encode(data));
              },
              end: () => {
                controller.close();
              },
              writeHead: (status: number, headers: any) => {
                // Headers are handled by Response setup
              },
            } as any;

            self.transport = new SSEServerTransport('/mcp/messages', mockRes);

            // Connect server to transport
            if (self.server) {
              await self.server.connect(self.transport);
            }

            // Keep the stream alive by periodically checking if still active
            const keepAliveInterval = setInterval(async () => {
              const state = await self.state.storage.get<SessionState>('session_state');
              if (!state?.isActive) {
                clearInterval(keepAliveInterval);
                controller.close();
              }
            }, 30000); // Check every 30 seconds
          } catch (error) {
            console.error('Error in MCP SSE stream:', error);
            controller.close();
          }
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        },
      },
    );
  }

  /**
   * Handle incoming messages (POST /mcp/messages)
   * Forwards messages to the transport
   */
  private async handleMessage(request: Request): Promise<Response> {
    try {
      // Update last activity
      const state = await this.state.storage.get<SessionState>('session_state');
      if (state) {
        state.lastActivity = new Date().toISOString();
        await this.state.storage.put('session_state', state);
      }

      // Get request body
      const body = await request.json();

      // Forward to transport if it exists
      if (this.transport) {
        // Extract headers from request
        const headers: Record<string, string> = {};
        request.headers.forEach((value, key) => {
          headers[key] = value;
        });

        // Handle the message through the transport
        await this.transport.handlePostMessage({ headers, body } as any, {} as any);

        return new Response(JSON.stringify({ status: 'ok', sessionId: this.sessionId }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'No active transport' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error handling MCP message:', error);
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }

  /**
   * Alarm handler for periodic cleanup/maintenance
   */
  async alarm(): Promise<void> {
    const state = await this.state.storage.get<SessionState>('session_state');

    if (state) {
      const lastActivityTime = new Date(state.lastActivity).getTime();
      const currentTime = new Date().getTime();
      const inactivityThreshold = 30 * 60 * 1000; // 30 minutes

      // Mark session as inactive if no activity
      if (currentTime - lastActivityTime > inactivityThreshold) {
        state.isActive = false;
        await this.state.storage.put('session_state', state);
      }
    }

    // Set next alarm for 1 hour from now
    this.state.blockConcurrencyWhile(async () => {
      await this.state.storage.setAlarm(Date.now() + 60 * 60 * 1000);
    });
  }
}
