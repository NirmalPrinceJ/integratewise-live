/**
 * IntegrateWise — Hono Edge Function Server
 * 
 * Routes:
 * - POST /make-server-e3b03387/signup — Create user with admin API
 * - GET  /make-server-e3b03387/health — Health check
 */
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// ── Middleware ─────────────────────────────────────────────────────────────

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.use("*", logger(console.log));

// ── Health Check ──────────────────────────────────────────────────────────

app.get("/make-server-e3b03387/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Sign Up ───────────────────────────────────────────────────────────────

app.post("/make-server-e3b03387/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }
    if (password.length < 8) {
      return c.json({ error: "Password must be at least 8 characters" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || "User" },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log(`[signup] Supabase admin.createUser error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    console.log(`[signup] User created successfully: ${data.user?.id} (${email})`);
    return c.json({
      success: true,
      userId: data.user?.id,
      email: data.user?.email,
    });
  } catch (err: any) {
    console.log(`[signup] Unexpected error: ${err?.message}`);
    return c.json({ error: `Server error during signup: ${err?.message}` }, 500);
  }
});

// ── Start Server ──────────────────────────────────────────────────────────

Deno.serve(app.fetch);
