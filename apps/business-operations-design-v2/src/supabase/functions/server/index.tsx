import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { normalizeAndBuildSpine, buildProjection, getReadiness } from "./spine.tsx";
import { GatewayService, enforceScope } from "./gateway.tsx";
import { IntelligenceEngine } from "./intelligence.tsx";

const app = new Hono();

// Explicit logger
app.use('*', logger(console.log));

// Re-configured CORS for stability and to avoid 403 Forbidden
app.use(
  "/make-server-e3b03387/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Client-Info", "Apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Supabase-Api-Version"],
    maxAge: 86400,
  }),
);

// Prefix all routes
const base = "/make-server-e3b03387";

// ─── ① GATEWAY & HEALTH ──────────────────────────────────────────────────

app.get(`${base}/health`, (c) => c.json({ status: "ok", service: "IntegrateWise-Gateway" }));

// ─── ② CONNECTOR & ③ PIPELINE ──────────────────────────────────────────────

app.post(`${base}/spine/initialize`, async (c) => {
  try {
    const body = await c.req.json();
    const { connectedApps = [], userName = "User", role = "business-ops", tenantId = "t1", orgType = "PRODUCT", activeCtx = "CTX_BIZOPS" } = body;

    console.log(`[L3:Pipeline] Normalizing ${connectedApps.length} tools into Canonical Spine...`);

    // Simulate 8-stage pipeline
    const spine = normalizeAndBuildSpine(connectedApps);
    
    // Inject goal_refs placeholders into canonical entities (Reconciled Requirement)
    const injectGoals = (entities: any[]) => entities.map(e => ({ ...e, goal_refs: ["GOAL_BIZ_001", "GOAL_USER_001"] }));
    spine.accounts = injectGoals(spine.accounts);
    spine.contacts = injectGoals(spine.contacts);
    spine.deals = injectGoals(spine.deals);

    await kv.set(`spine:${tenantId}:data`, spine);
    await kv.set(`spine:${tenantId}:config`, { connectedApps, userName, role, orgType, activeCtx, initializedAt: new Date().toISOString() });
    
    const readiness = getReadiness(connectedApps, spine);
    await kv.set(`spine:${tenantId}:readiness`, readiness);

    return c.json({ success: true, entityCounts: spine.metadata.entityCounts, readiness });
  } catch (err) {
    console.log(`[Error] Initialization failed: ${err}`);
    return c.json({ error: err.message }, 500);
  }
});

// ─── ④ INTELLIGENCE ENGINE (HITL/Govern) ──────────────────────────────────

app.get(`${base}/intelligence/hitl`, async (c) => {
  const tenantId = c.req.query("tenantId") || "t1";
  const queue = (await kv.get(`hitl:${tenantId}:queue`)) || [];
  return c.json(queue);
});

app.post(`${base}/intelligence/approve`, enforceScope("governance.approve"), async (c) => {
  const { proposalId, tenantId = "t1" } = await c.req.json();
  const result = await IntelligenceEngine.approveAction(tenantId, proposalId);
  return c.json(result);
});

// ─── ⑤ DOMAIN API (Unified Projection) ──────────────────────────────────────

app.get(`${base}/domain/:domain/:table`, async (c) => {
  const { domain, table } = c.req.param();
  const tenantId = c.req.query("tenantId") || "t1";
  
  const spine = await kv.get(`spine:${tenantId}:data`);
  if (!spine) return c.json({ error: "Spine not initialized" }, 404);
  
  // Map domain/table to spine entities
  let data: any[] = [];
  
  if (table === "accounts") data = spine.accounts || [];
  else if (table === "contacts") data = spine.contacts || [];
  else if (table === "deals") data = spine.deals || [];
  else if (table === "tickets") data = spine.tickets || [];
  else if (table === "activities") data = spine.activities || [];
  else if (table === "leads") data = spine.leads || [];
  else if (table === "campaigns") data = spine.campaigns || [];
  else if (table === "pages") data = spine.pages || [];
  else if (table === "projects") {
    data = [
      { id: "p1", name: "Spine Reconciliation", status: "in-progress", progress: 65, owner: { name: "Priya S.", initials: "PS" } },
      { id: "p2", name: "Intelligence Platform Build", status: "blocked", progress: 40, owner: { name: "Arun K.", initials: "AK" } },
      { id: "p3", name: "8-Stage Pipeline", status: "completed", progress: 100, owner: { name: "Rajesh M.", initials: "RM" } },
    ];
  } else if (table === "risks") {
    data = (spine.accounts || []).filter((a: any) => a.status === "at-risk");
  } else if (table === "expansion") {
    data = (spine.deals || []).filter((d: any) => d.stage === "negotiate");
  } else if (table === "tasks") {
    data = (spine.activities || []).filter((a: any) => a.type === "task");
  } else if (table === "meetings") {
    data = (spine.activities || []).filter((a: any) => a.type === "meeting");
  } else if (table === "documents") {
    data = spine.pages || [];
  } else if (table === "people") {
    data = [
      { id: "u1", name: "Arun Kumar", role: "Super Admin", dept: "Engineering" },
      { id: "u2", name: "Priya Sharma", role: "Ops Manager", dept: "RevOps" },
    ];
  }

  return c.json({ domain, table, count: data.length, data });
});

app.get(`${base}/spine/readiness`, async (c) => {
  const tenantId = c.req.query("tenantId") || "t1";
  const readiness = await kv.get(`spine:${tenantId}:readiness`);
  return c.json(readiness || {});
});

// ─── GET SPINE CONFIG (Restore session state) ───────────────────────────────

app.get(`${base}/spine/config`, async (c) => {
  try {
    const tenantId = c.req.query("tenantId") || "t1";
    const config = await kv.get(`spine:${tenantId}:config`);
    if (!config) return c.json({ error: "No config found — spine not initialized" }, 404);
    return c.json(config);
  } catch (err) {
    console.log(`[Error] Config fetch failed: ${err}`);
    return c.json({ error: err.message }, 500);
  }
});

app.get(`${base}/spine/projection/:department`, async (c) => {
  const department = c.req.param("department");
  const tenantId = c.req.query("tenantId") || "t1";
  
  const spine = await kv.get(`spine:${tenantId}:data`);
  if (!spine) return c.json({ error: "Spine not initialized" }, 404);
  
  const config = await kv.get(`spine:${tenantId}:config`);
  const projection = buildProjection(spine, department, config?.connectedApps || []);
  
  return c.json(projection);
});

app.get(`${base}/spine/metadata`, async (c) => {
  const tenantId = c.req.query("tenantId") || "t1";
  const spine = await kv.get(`spine:${tenantId}:data`);
  return c.json(spine?.metadata || {});
});

// ─── ⑥ AI INTELLIGENCE CHAT ──────────────────────────────────────────────

app.post(`${base}/ai/chat`, async (c) => {
  try {
    const { message, tenantId = "t1", context = "CTX_BIZOPS" } = await c.req.json();
    const apiKey = Deno.env.get("OPENROUTER_API_KEY");

    if (!apiKey) {
      console.log("[AI Chat] OPENROUTER_API_KEY not found, using demo mode.");
      return c.json({
        id: `a${Date.now()}`,
        role: "assistant",
        content: `I'm currently in 'Demo Intelligence' mode. To enable real AI insights, please configure the OPENROUTER_API_KEY. Based on your context (${context}), I can see that you're asking: "${message}". In a real deployment, I would query your Spine data (normalized from your connected tools) to give you a precise answer.`,
        timestamp: new Date().toISOString(),
        suggestions: ["How do I connect my data?", "Show me account risks", "What's our goal progress?"]
      });
    }

    // Fetch spine data to provide context to the LLM
    const spine = await kv.get(`spine:${tenantId}:data`);
    const metadata = spine?.metadata || {};
    
    // Construct a condensed context for the LLM
    const systemPrompt = `
      You are IntegrateWise AI, an intelligence layer for B2B SaaS CSM and Revenue teams.
      Current Context: ${context}
      Platform Principle: "Normalize Once. Render Anywhere."
      Data Summary: ${JSON.stringify(metadata)}
      
      Guidelines:
      1. Be concise, professional, and data-driven.
      2. Use the provided data summary to answer questions about accounts, contacts, and deals.
      3. If asked about risk, suggest looking at accounts with 'at-risk' status.
      4. Provide 2-3 actionable suggestions at the end of your response.
      5. Do not make up data that isn't in the summary.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // Use a fast model for chat
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I'm sorry, I encountered an error processing your request.";

    return c.json({
      id: `a${Date.now()}`,
      role: "assistant",
      content: content,
      timestamp: new Date().toISOString(),
      suggestions: ["Analyze more tools", "Show me the pipeline", "Risk report"]
    });

  } catch (err) {
    console.log(`[Error] AI Chat failed: ${err}`);
    return c.json({ error: err.message }, 500);
  }
});

Deno.serve(app.fetch);