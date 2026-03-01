# Troubleshooting Guide

Solutions to common issues in IntegrateWise OS.

## 📡 No signals appearing in the UI?

1. **Check Neon Connection**: Ensure `DATABASE_URL` is correct and the worker has IP access.
2. **Verify tenant_id**: Ensure the records being ingested have a `tenant_id` that matches the logged-in user.
3. **Log Check**: Look at `ingest-normalize` logs for "mapping_failed" events.

## 🧠 Think page is blank or showing errors?

1. **AI Key missing**: Ensure `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is in the Vault or Worker Secrets.
2. **Session Context**: The Think engine requires recent context from Flow B (Knowledge). If no files are uploaded, it may have nothing to "think" about.
3. **Latency**: If the LLM takes > 60s, Cloudflare may timeout. Check the `Orchestra` monitor for high cognitive load flags.

## 💳 Stripe plan not applying?

1. **Webhook Secret**: Ensure `STRIPE_WEBHOOK_SECRET` matches the one in Stripe Dashboard.
2. **Schema**: Check if the `tenant_subscription` table exists in your Neon branch.
3. **Payload**: Verify Stripe is sending the `client_reference_id` (the `tenant_id`).

## 🛡️ Agent showing "NOT CONFIGURED"?

- This is by design. The OS has identified a task for an agent, but you haven't provided the API keys for the target tool (e.g. HubSpot) yet.
- Fix: Go to Admin > Registry and link the tool.
