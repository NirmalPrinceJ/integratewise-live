/**
 * Example of integrating RBAC into the Act Worker
 * This file demonstrates how to use RBAC middleware in Cloudflare Workers
 */

import { withPermission, requirePermission } from '@integratewise/rbac/worker-middleware';

interface Env {
  DATABASE_URL: string;
}

/**
 * Example 1: Using withPermission wrapper
 */
const executeActionHandler = withPermission<Env>(
  'action:execute',
  async (request, env, user) => {
    // User is guaranteed to have 'action:execute' permission here
    console.log(`User ${user.user_id} executing action`);

    // Your action execution logic here
    return new Response(
      JSON.stringify({ success: true, message: 'Action executed' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
);

/**
 * Example 2: Manual permission check
 */
async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  // Route: POST /execute
  if (url.pathname === '/execute' && request.method === 'POST') {
    const authResult = await requirePermission(
      request,
      env.DATABASE_URL,
      'action:execute'
    );

    if (!authResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Forbidden',
          message: authResult.reason,
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // User has permission, proceed with action execution
    // ... your logic here

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Not found', { status: 404 });
}

/**
 * Worker export
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Use wrapped handler for /execute endpoint
    if (url.pathname === '/execute') {
      return executeActionHandler(request, env);
    }

    // Use manual check for other endpoints
    return handleRequest(request, env);
  },
};
