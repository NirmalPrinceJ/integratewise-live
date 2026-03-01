import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Cloudflare D1 database interface
interface D1Database {
    prepare(query: string): D1PreparedStatement;
}

interface D1PreparedStatement {
    bind(...values: any[]): D1PreparedStatement;
    all(): Promise<D1Result>;
    run(): Promise<D1Result>;
}

interface D1Result {
    results?: any[];
    success: boolean;
    error?: string;
}

declare global {
    const DB: D1Database;
}

const server = new Server(
    {
        name: "integratewise-mcp-connector",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

/**
 * TOOL DEFINITIONS - Adapted for D1 schema
 */
const TOOLS: Tool[] = [
    {
        name: "get_account_intelligence",
        description: "Retrieve comprehensive intelligence for a specific account from the D1 database.",
        inputSchema: {
            type: "object",
            properties: {
                account_name: { type: "string", description: "Name of the account to search for" },
            },
            required: ["account_name"],
        },
    },
    {
        name: "list_accounts",
        description: "List all accounts in the system with optional filtering.",
        inputSchema: {
            type: "object",
            properties: {
                type: { type: "string", enum: ["customer", "prospect", "partner", "vendor"] },
                status: { type: "string", default: "active" },
                limit: { type: "number", default: 10, maximum: 100 },
            },
        },
    },
    {
        name: "search_conversations",
        description: "Search conversations using text matching.",
        inputSchema: {
            type: "object",
            properties: {
                query: { type: "string", description: "Search query for conversation content" },
                source: { type: "string", enum: ["email", "slack", "discord", "ticket", "call", "meeting", "chat"] },
                limit: { type: "number", default: 5, maximum: 20 },
            },
            required: ["query"],
        },
    },
    {
        name: "get_brainstorm_session",
        description: "Retrieve details of a brainstorming session.",
        inputSchema: {
            type: "object",
            properties: {
                session_id: { type: "string", description: "UUID of the brainstorm session" },
            },
            required: ["session_id"],
        },
    },
    {
        name: "create_brainstorm_session",
        description: "Create a new brainstorming session.",
        inputSchema: {
            type: "object",
            properties: {
                title: { type: "string", description: "Title of the brainstorming session" },
                description: { type: "string" },
                session_type: { type: "string", enum: ["general", "product", "marketing", "sales", "strategy"], default: "general" },
                participants: { type: "array", items: { type: "string" } },
            },
            required: ["title"],
        },
    },
];

/**
 * HANDLERS
 */

server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        if (name === "get_account_intelligence") {
            const { account_name } = z.object({ account_name: z.string() }).parse(args);
            
            const stmt = DB.prepare("SELECT * FROM accounts WHERE name LIKE ? LIMIT 1");
            const result = await stmt.bind(`%${account_name}%`).all();
            
            if (!result.results || result.results.length === 0) {
                return { 
                    content: [{ type: "text", text: `Account '${account_name}' not found.` }], 
                    isError: true 
                };
            }
            
            return {
                content: [{ type: "text", text: JSON.stringify(result.results[0], null, 2) }],
            };
        }

        if (name === "list_accounts") {
            const { type, status = "active", limit = 10 } = z.object({ 
                type: z.string().optional(),
                status: z.string().optional(),
                limit: z.number().max(100).optional()
            }).parse(args);
            
            let query = "SELECT * FROM accounts WHERE 1=1";
            const params: any[] = [];
            
            if (type) {
                query += " AND type = ?";
                params.push(type);
            }
            
            if (status) {
                query += " AND status = ?";
                params.push(status);
            }
            
            query += " ORDER BY created_at DESC LIMIT ?";
            params.push(limit);
            
            const stmt = DB.prepare(query);
            const result = await stmt.bind(...params).all();
            
            return {
                content: [{ type: "text", text: JSON.stringify(result.results || [], null, 2) }],
            };
        }

        if (name === "search_conversations") {
            const { query, source, limit = 5 } = z.object({ 
                query: z.string(),
                source: z.string().optional(),
                limit: z.number().max(20).optional()
            }).parse(args);
            
            let sql = "SELECT * FROM conversations WHERE content LIKE ?";
            const params: any[] = [`%${query}%`];
            
            if (source) {
                sql += " AND source = ?";
                params.push(source);
            }
            
            sql += " ORDER BY created_at DESC LIMIT ?";
            params.push(limit);
            
            const stmt = DB.prepare(sql);
            const result = await stmt.bind(...params).all();
            
            return {
                content: [{ type: "text", text: JSON.stringify(result.results || [], null, 2) }],
            };
        }

        if (name === "get_brainstorm_session") {
            const { session_id } = z.object({ session_id: z.string() }).parse(args);
            
            const stmt = DB.prepare("SELECT * FROM brainstorm_sessions WHERE id = ?");
            const result = await stmt.bind(session_id).all();
            
            if (!result.results || result.results.length === 0) {
                return { 
                    content: [{ type: "text", text: `Session '${session_id}' not found.` }], 
                    isError: true 
                };
            }
            
            return {
                content: [{ type: "text", text: JSON.stringify(result.results[0], null, 2) }],
            };
        }

        if (name === "create_brainstorm_session") {
            const { title, description, session_type = "general", participants = [] } = z.object({
                title: z.string(),
                description: z.string().optional(),
                session_type: z.string().optional(),
                participants: z.array(z.string()).optional()
            }).parse(args);
            
            const stmt = DB.prepare("INSERT INTO brainstorm_sessions (title, description, session_type, participants) VALUES (?, ?, ?, ?) RETURNING *");
            const result = await stmt.bind(title, description || "", session_type, JSON.stringify(participants)).run();
            
            return {
                content: [{ type: "text", text: `Brainstorm session created successfully with ID: ${(result as any).meta?.last_row_id || 'unknown'}` }],
            };
        }

        throw new Error(`Tool ${name} not found.`);
    } catch (error: any) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

/**
 * RUN
 */

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("IntegrateWise MCP Connector running on stdio with D1 database");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});