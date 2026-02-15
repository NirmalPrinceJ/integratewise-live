# Operations Runbook

This guide covers common operational tasks for maintainers of IntegrateWise OS.

## 1. Rolling out Database Migrations

Always apply migrations BEFORE code changes.

1. Add `.sql` file to `sql-migrations/`.
2. Push to `feature/integratewise-os-internal`.
3. Verify in Bitbucket Pipelines that the migration step succeeded.

## 2. Rotating Secrets

Most secrets are managed via **Cloudflare Secrets** or **Supabase Vault**.

- To rotate Worker secrets:

  ```bash
  wrangler secret put API_KEY --env prod
  ```

- To rotate OS-wide tool keys, update the `tools_registry` table in Neon.

## 3. Handling a "Think" Failure

If the Brain worker is returning 500s:

1. Check the `Orchestra Monitor` in IQ Hub.
2. Verify API usage limits for Claude/OpenAI in the Cloudflare dash.
3. Ensure the `tenant_id` exists and has an active plan in `tenant_subscription`.

## 4. Forced Cache Clear

The OS uses KV/D1 for caching blueprint states. To force a refresh:

1. Trigger the `/v1/admin/registry/refresh` endpoint (Requires internal auth).
2. Or redeploy the `brain` worker.

## 5. Identifying Gated Agents

If an agent is showing `NOT CONFIGURED`:

1. Go to Admin UI > Registry > Tools.
2. Link the required Tool (e.g., Stripe) by providing the API Key.
3. The Vault will automatically pick up the new key for the next execution.
