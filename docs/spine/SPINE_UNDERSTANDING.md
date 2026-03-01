# Understanding Spine Architecture

**Date:** 2026-01-18  
**Clarification:** Spine = n8n workflows, not a separate TypeScript package

---

## What is Spine?

Based on the clarification: **Spine is n8n workflows that normalize data.**

### Key Understanding:

1. **Spine = n8n Workflows**
   - The normalization happens in n8n workflows
   - n8n workflows transform raw events → Spine events
   - n8n workflows create Spine entities (Task, Note, Conversation, Plan)

2. **Spine Events = Normalized Events**
   - Raw webhook events from Stripe, Slack, HubSpot, etc.
   - Normalized into standard Spine event format
   - Stored in `spine_events` table

3. **Spine Entities = Normalized Entities**
   - Tasks, Notes, Conversations, Plans
   - Created from normalized Spine events
   - Stored in respective tables

4. **Normalize Stage = n8n Workflow Management**
   - UI to manage n8n workflows
   - Visualize normalization process
   - Configure field mappings
   - Monitor Spine event processing

---

## Current State (Revised Understanding)

### What EXISTS:

1. **Spine Type Definitions:**
   - ✅ `lib/types/spine-types.ts` - Type definitions for Spine entities
   - ✅ `packages/types/src/spine.ts` - Spine event schemas
   - ✅ `packages/types/src/spine_contracts.ts` - Spine contracts

2. **Spine Database Schema:**
   - ✅ `spine_events` table - Stores normalized events
   - ✅ Entity tables (tasks, notes, conversations, plans)

3. **n8n Workflows (External):**
   - ✅ `/Account Success/csm-n8n-setup/workflows/` - CSM workflows
   - ⚠️ **Need to check if there are Spine normalization workflows**

4. **Core Engine:**
   - ✅ Can receive Spine events via API
   - ✅ Can store Spine events in database

### What's MISSING:

1. **Spine Normalization Workflows:**
   - ❌ n8n workflows that normalize webhook events → Spine events
   - ❌ n8n workflows that create Spine entities
   - ❌ Field mapping workflows

2. **n8n Integration:**
   - ❌ Connection between monorepo and n8n instance
   - ❌ API to trigger/manage n8n workflows
   - ❌ Webhook endpoints for n8n to call

3. **Normalization UI:**
   - ❌ UI to manage n8n workflows
   - ❌ Visualize normalization process
   - ❌ Configure field mappings
   - ❌ Monitor Spine event processing

4. **Normalize Route:**
   - ⚠️ `/app/normalize/page.tsx` - Only redirects
   - ❌ Should show n8n workflow management UI

---

## Revised Normalize Stage Assessment

### Normalize Stage = 20% Complete

**Why:**
- ✅ Spine types and schema exist
- ✅ Core engine can receive/store Spine events
- ⚠️ n8n workflows for normalization may exist but not integrated
- ❌ No UI to manage n8n workflows
- ❌ No integration between monorepo and n8n
- ❌ Normalize route doesn't show workflow management

**What's Needed:**
1. **n8n Workflow Integration:**
   - Connect monorepo to n8n instance
   - API to trigger/manage workflows
   - Webhook endpoints for n8n

2. **Normalization UI:**
   - Workflow management interface
   - Field mapping configuration
   - Spine event visualization
   - Normalization progress monitoring

3. **Workflow Templates:**
   - Standard normalization workflows
   - Field mapping workflows
   - Entity creation workflows

---

## Questions to Clarify

1. **Where are the Spine normalization n8n workflows?**
   - Are they in the csm-n8n-setup directory?
   - Are they in a different location?
   - Do they need to be created?

2. **How does n8n connect to the monorepo?**
   - Does n8n call the Core Engine API?
   - Does n8n write directly to the database?
   - Is there a webhook endpoint for n8n?

3. **What should the Normalize UI show?**
   - n8n workflow management?
   - Spine event stream?
   - Field mapping configuration?
   - Normalization progress?

4. **What is the data flow?**
   ```
   Webhook → n8n Workflow → Normalize → Spine Event → Core Engine → Database
   ```
   Or:
   ```
   Webhook → Core Engine → n8n Workflow → Normalize → Spine Event → Database
   ```

---

## Next Steps

1. **Find Spine Normalization Workflows:**
   - Check if they exist in n8n directories
   - Check if they're documented
   - Check if they need to be created

2. **Understand Integration:**
   - How n8n connects to monorepo
   - What APIs/webhooks are needed
   - How workflows are triggered

3. **Build Normalization UI:**
   - Workflow management interface
   - Spine event visualization
   - Field mapping configuration

4. **Update Normalize Route:**
   - Replace redirect with workflow management UI
   - Connect to n8n instance
   - Show normalization process

---

**Status:** Understanding clarified - Spine = n8n workflows. Need to find/verify normalization workflows and build integration.
