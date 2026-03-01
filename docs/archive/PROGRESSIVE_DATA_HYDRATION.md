# IntegrateWise OS — Progressive Data Hydration Architecture

> **Reality**: Day 1 user has 1-2 tools connected + some CSV dumps.
> Views must gracefully handle sparse data and progressively enrich.

---

## 🎯 The Progressive Hydration Journey

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    USER DATA JOURNEY                                         │
│                                                                              │
│  ONBOARDING (Day 0)                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  1. Sign up + Context Questions (role, industry, goals)                 │ │
│  │  2. Connect 1-2 tools (e.g. HubSpot, Gmail)                             │ │
│  │  3. Optional: Upload CSV/spreadsheet (accounts, contacts)               │ │
│  │  4. Initial sync runs (first hydration job)                             │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                               │                                              │
│                               ▼                                              │
│  FIRST HYDRATION (Hours 1-24)                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  • Loader pulls from connected tools                                    │ │
│  │  • Pipeline processes: Analyze → Classify → Filter → Extract            │ │
│  │  • Normalizer maps tool data → domain entities                          │ │
│  │  • Store writes to Spine, Context, Knowledge                            │ │
│  │  • Sparse data in all three stores                                      │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                               │                                              │
│                               ▼                                              │
│  PROGRESSIVE ENRICHMENT (Days 1-30)                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  • User connects more tools (Slack, Jira, Calendar)                     │ │
│  │  • Each connection triggers incremental sync                            │ │
│  │  • Cross-tool entity resolution (same contact in CRM + Email)           │ │
│  │  • AI generates summaries, insights, scores                             │ │
│  │  • Data density increases, confidence scores improve                    │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                               │                                              │
│                               ▼                                              │
│  MATURE STATE (Day 30+)                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  • Rich entity graph in Spine                                           │ │
│  │  • Deep context from multiple sources                                   │ │
│  │  • AI knowledge bank with patterns + predictions                        │ │
│  │  • Full-featured L1 views with high-confidence insights                 │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Density States

| State | Connected Tools | Data in Spine | Data in Context | Data in Knowledge | UI Response |
|-------|-----------------|---------------|-----------------|-------------------|-------------|
| **Empty** | 0 | None | None | None | Show onboarding wizard |
| **Seeding** | 1-2 + CSV | Sparse entities | Few docs | Minimal | Show what exists + prompts to connect more |
| **Growing** | 3-5 | Most entities | Growing docs | AI summaries starting | Full views with "enrich" prompts |
| **Rich** | 5+ | Complete graph | All docs indexed | Full AI insights | Full-featured experience |

---

## 🏗️ Progressive Hydration Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    DATA INGESTION PATHS                                      │
│                                                                              │
│  PATH 1: TOOL CONNECTION                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  User clicks "Connect HubSpot"                                          │ │
│  │       │                                                                  │ │
│  │       ▼                                                                  │ │
│  │  OAuth flow → Store credentials in Secrets                              │ │
│  │       │                                                                  │ │
│  │       ▼                                                                  │ │
│  │  Queue: INITIAL_SYNC job                                                │ │
│  │       │                                                                  │ │
│  │       ├─── Loader fetches all accounts, contacts, deals                 │ │
│  │       │                                                                  │ │
│  │       ├─── Pipeline processes (8 stages)                                │ │
│  │       │                                                                  │ │
│  │       └─── Store distributes to Spine + Context + Knowledge             │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  PATH 2: FILE UPLOAD (CSV, Excel, PDF)                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  User uploads "accounts.csv"                                            │ │
│  │       │                                                                  │ │
│  │       ▼                                                                  │ │
│  │  Upload to R2 (raw storage)                                             │ │
│  │       │                                                                  │ │
│  │       ▼                                                                  │ │
│  │  Queue: FILE_PROCESS job                                                │ │
│  │       │                                                                  │ │
│  │       ├─── Analyzer: Detect file type, structure                        │ │
│  │       │                                                                  │ │
│  │       ├─── Extractor: Parse rows, map columns                           │ │
│  │       │                                                                  │ │
│  │       ├─── Classifier: Determine entity types                           │ │
│  │       │                                                                  │ │
│  │       └─── Store: Write entities to Spine                               │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  PATH 3: INCREMENTAL SYNC (Webhooks/Polling)                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  HubSpot webhook: "deal.updated"                                        │ │
│  │       │                                                                  │ │
│  │       ▼                                                                  │ │
│  │  Queue: INCREMENTAL_SYNC job                                            │ │
│  │       │                                                                  │ │
│  │       ├─── Fetch changed record from source                             │ │
│  │       │                                                                  │ │
│  │       ├─── Pipeline (abbreviated - skip analyze)                        │ │
│  │       │                                                                  │ │
│  │       └─── Upsert to Spine, update Context/Knowledge if needed          │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Hydration State Tracking

Each tenant has a **hydration status** that tracks data completeness:

```typescript
interface TenantHydrationStatus {
  tenant_id: string;
  
  // Connection status
  connected_tools: {
    tool_id: string;
    connected_at: string;
    last_sync: string;
    sync_status: 'pending' | 'syncing' | 'complete' | 'error';
    records_synced: number;
  }[];
  
  // Data density per store
  spine_density: {
    accounts: number;
    contacts: number;
    deals: number;
    meetings: number;
    tasks: number;
    // ... other entities
  };
  
  context_density: {
    documents: number;
    emails: number;
    transcripts: number;
    extracted_facts: number;
  };
  
  knowledge_density: {
    summaries: number;
    topics: number;
    ai_insights: number;
  };
  
  // Overall completeness (0-100)
  hydration_score: number;
  
  // What's missing
  enrichment_suggestions: {
    type: 'connect_tool' | 'upload_data' | 'enable_feature';
    priority: 'high' | 'medium' | 'low';
    message: string;
    action_url: string;
  }[];
}
```

---

## 🖥️ L1 UI Graceful Degradation

Each L1 view must handle all density states:

```typescript
// Example: Accounts View progressive rendering

interface AccountsViewData {
  accounts: Account[];
  total_count: number;
  hydration_state: 'empty' | 'seeding' | 'growing' | 'rich';
  missing_sources: string[];
  enrichment_prompt?: {
    message: string;
    action: string;
  };
}

function AccountsView({ data }: { data: AccountsViewData }) {
  // STATE: EMPTY - No data at all
  if (data.hydration_state === 'empty') {
    return (
      <EmptyState
        icon={<Building2 />}
        title="No accounts yet"
        description="Connect your CRM or upload a spreadsheet to see your accounts"
        actions={[
          { label: "Connect HubSpot", href: "/settings/integrations/hubspot" },
          { label: "Connect Salesforce", href: "/settings/integrations/salesforce" },
          { label: "Upload CSV", href: "/import/accounts" }
        ]}
      />
    );
  }
  
  // STATE: SEEDING - Some data, but sparse
  if (data.hydration_state === 'seeding') {
    return (
      <div>
        <EnrichmentBanner
          message={`${data.total_count} accounts imported. Connect more tools to enrich with contacts and activity.`}
          actions={data.missing_sources.map(s => ({
            label: `Connect ${s}`,
            href: `/settings/integrations/${s.toLowerCase()}`
          }))}
        />
        <AccountsList 
          accounts={data.accounts}
          showPartialBadge={true}
        />
      </div>
    );
  }
  
  // STATE: GROWING - Good data, still enriching
  if (data.hydration_state === 'growing') {
    return (
      <div>
        {data.enrichment_prompt && (
          <SubtlePrompt message={data.enrichment_prompt.message} />
        )}
        <AccountsList 
          accounts={data.accounts}
          showHealthScores={true}  // Now we have enough data
          showAISummary={true}
        />
      </div>
    );
  }
  
  // STATE: RICH - Full data
  return (
    <AccountsList 
      accounts={data.accounts}
      showHealthScores={true}
      showAISummary={true}
      showPredictions={true}
      showSignals={true}
    />
  );
}
```

---

## 🔄 Aggregator with Hydration Awareness

```typescript
// domain-accounts aggregator with progressive hydration

app.get('/accounts', async (c) => {
  const tenantId = c.req.header('X-Tenant-ID')!;
  const ctx = c.req.header('X-Context')!;
  
  // First: Check hydration status
  const hydrationStatus = await getHydrationStatus(c.env, tenantId);
  
  // Determine what we can fetch based on what exists
  const fetchPromises: Promise<any>[] = [];
  const sources: string[] = [];
  
  // SPINE: Always try (may be empty)
  fetchPromises.push(
    c.env.SPINE.fetch(
      new Request('http://internal/entities/account', {
        headers: { 'X-Tenant-ID': tenantId, 'X-Context': ctx }
      })
    ).then(r => r.json()).catch(() => ({ entities: [] }))
  );
  sources.push('spine');
  
  // CONTEXT: Only if we have documents
  if (hydrationStatus.context_density.documents > 0) {
    fetchPromises.push(
      c.env.CONTEXT.fetch(
        new Request('http://internal/documents?type=account', {
          headers: { 'X-Tenant-ID': tenantId, 'X-Context': ctx }
        })
      ).then(r => r.json()).catch(() => ({ documents: [] }))
    );
    sources.push('context');
  } else {
    fetchPromises.push(Promise.resolve({ documents: [] }));
  }
  
  // KNOWLEDGE: Only if we have AI summaries
  if (hydrationStatus.knowledge_density.summaries > 0) {
    fetchPromises.push(
      c.env.KNOWLEDGE.fetch(
        new Request('http://internal/summaries?type=account', {
          headers: { 'X-Tenant-ID': tenantId, 'X-Context': ctx }
        })
      ).then(r => r.json()).catch(() => ({ summaries: [] }))
    );
    sources.push('knowledge');
  } else {
    fetchPromises.push(Promise.resolve({ summaries: [] }));
  }
  
  const [spineData, contextData, knowledgeData] = await Promise.all(fetchPromises);
  
  // Determine hydration state
  const accountCount = spineData.entities?.length || 0;
  const hydrationState = 
    accountCount === 0 ? 'empty' :
    accountCount < 10 && sources.length < 3 ? 'seeding' :
    sources.length < 3 ? 'growing' : 'rich';
  
  // Build enrichment suggestions
  const missingSources: string[] = [];
  if (hydrationStatus.spine_density.contacts === 0) missingSources.push('contacts');
  if (hydrationStatus.context_density.emails === 0) missingSources.push('email');
  if (hydrationStatus.context_density.transcripts === 0) missingSources.push('meetings');
  
  // Merge data
  const accounts = (spineData.entities || []).map((account: any) => {
    const docs = (contextData.documents || []).filter(
      (d: any) => d.entity_id === account.id
    );
    const summary = (knowledgeData.summaries || []).find(
      (s: any) => s.entity_id === account.id
    );
    
    return {
      ...account,
      recent_documents: docs.slice(0, 3),
      ai_summary: summary?.content || null,
      _data_completeness: calculateCompleteness(account, docs, summary)
    };
  });
  
  return c.json({
    accounts,
    total_count: accountCount,
    hydration_state: hydrationState,
    missing_sources: missingSources,
    enrichment_prompt: missingSources.length > 0 ? {
      message: `Connect ${missingSources[0]} to see more insights`,
      action: `/settings/integrations`
    } : null,
    _sources: sources
  });
});

function calculateCompleteness(account: any, docs: any[], summary: any): number {
  let score = 0;
  if (account.name) score += 20;
  if (account.industry) score += 10;
  if (account.arr) score += 15;
  if (account.health_score) score += 15;
  if (docs.length > 0) score += 20;
  if (summary) score += 20;
  return score;
}
```

---

## 📋 Onboarding → First Hydration Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    ONBOARDING TO FIRST HYDRATION                             │
│                                                                              │
│  STEP 1: Context Questions                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  "What's your role?" → CSM / Sales / Founder / Operations               │ │
│  │  "What's your industry?" → SaaS / Consulting / Agency / Other           │ │
│  │  "What's your primary goal?" → Retention / Growth / Efficiency          │ │
│  │                                                                          │ │
│  │  → Creates tenant context profile                                       │ │
│  │  → Determines which L1 views to prioritize                              │ │
│  │  → Sets default context (personal/business/csm)                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                               │                                              │
│                               ▼                                              │
│  STEP 2: Tool Connection                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  "Connect your tools"                                                   │ │
│  │                                                                          │ │
│  │  Recommended (based on role):                                           │ │
│  │  ├── CSM: HubSpot/Salesforce + Slack + Email                            │ │
│  │  ├── Sales: CRM + Calendar + Email                                      │ │
│  │  └── Founder: All of the above + Accounting                             │ │
│  │                                                                          │ │
│  │  → Minimum 1 tool to proceed                                            │ │
│  │  → Optional CSV upload                                                  │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                               │                                              │
│                               ▼                                              │
│  STEP 3: Initial Sync (Processing View)                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  "Pulling your data..."                                                 │ │
│  │                                                                          │ │
│  │  [=========>                    ] 35%                                   │ │
│  │                                                                          │ │
│  │  ✓ Connected to HubSpot                                                 │ │
│  │  ✓ Found 156 accounts                                                   │ │
│  │  → Processing contacts... (234/500)                                     │ │
│  │  ○ Generating insights                                                  │ │
│  │                                                                          │ │
│  │  → This runs async; user can skip to dashboard                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                               │                                              │
│                               ▼                                              │
│  STEP 4: First Dashboard (Sparse Data)                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Home view shows:                                                       │ │
│  │                                                                          │ │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │ │
│  │  │  🎉 Welcome! We're still processing your data.                   │   │ │
│  │  │                                                                  │   │ │
│  │  │  So far we've found:                                             │   │ │
│  │  │  • 156 accounts                                                  │   │ │
│  │  │  • 234 contacts (still syncing...)                               │   │ │
│  │  │                                                                  │   │ │
│  │  │  [View Accounts] [Connect more tools]                            │   │ │
│  │  └──────────────────────────────────────────────────────────────────┘   │ │
│  │                                                                          │ │
│  │  Enrichment prompts throughout:                                         │ │
│  │  "Connect Slack to see team activity"                                   │ │
│  │  "Connect Calendar to see meetings"                                     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Queue Jobs for Hydration

```typescript
// Hydration job types

type HydrationJob = 
  | { type: 'INITIAL_SYNC'; tool_id: string; tenant_id: string; }
  | { type: 'FILE_PROCESS'; file_id: string; tenant_id: string; file_type: string; }
  | { type: 'INCREMENTAL_SYNC'; tool_id: string; tenant_id: string; webhook_payload: any; }
  | { type: 'AI_ENRICH'; entity_type: string; entity_id: string; tenant_id: string; }
  | { type: 'BULK_IMPORT'; import_id: string; tenant_id: string; };

// Queue consumer
export async function handleHydrationJob(job: HydrationJob, env: Env) {
  switch (job.type) {
    case 'INITIAL_SYNC':
      return await handleInitialSync(job, env);
    case 'FILE_PROCESS':
      return await handleFileProcess(job, env);
    case 'INCREMENTAL_SYNC':
      return await handleIncrementalSync(job, env);
    case 'AI_ENRICH':
      return await handleAIEnrich(job, env);
    case 'BULK_IMPORT':
      return await handleBulkImport(job, env);
  }
}

async function handleInitialSync(job: { type: 'INITIAL_SYNC'; tool_id: string; tenant_id: string }, env: Env) {
  // 1. Get connector for this tool
  const connector = getConnector(job.tool_id);
  
  // 2. Fetch all data from source
  const rawData = await connector.fetchAll(job.tenant_id);
  
  // 3. Process through pipeline
  for (const record of rawData) {
    const processed = await runPipeline(record, env);
    
    // 4. Distribute to appropriate stores
    await distributeToStores(processed, env);
  }
  
  // 5. Update hydration status
  await updateHydrationStatus(job.tenant_id, job.tool_id, 'complete', env);
  
  // 6. Queue AI enrichment jobs for new entities
  await queueAIEnrichment(job.tenant_id, env);
}

async function distributeToStores(processed: ProcessedRecord, env: Env) {
  // Structured data → Spine
  if (processed.entity) {
    await env.SPINE.fetch(new Request('http://internal/entities', {
      method: 'POST',
      body: JSON.stringify(processed.entity)
    }));
  }
  
  // Documents/content → Context
  if (processed.documents?.length > 0) {
    for (const doc of processed.documents) {
      await env.CONTEXT.fetch(new Request('http://internal/documents', {
        method: 'POST',
        body: JSON.stringify(doc)
      }));
    }
  }
  
  // Extracted facts → Context
  if (processed.facts?.length > 0) {
    await env.CONTEXT.fetch(new Request('http://internal/facts', {
      method: 'POST',
      body: JSON.stringify({ facts: processed.facts })
    }));
  }
}
```

---

## 🔄 Sync Completion Handler

After each tool sync completes, we update the tenant's data strength:

```typescript
// ═══════════════════════════════════════════════════════════════
// SYNC COMPLETION HANDLER - Updates data strength after each sync
// ═══════════════════════════════════════════════════════════════

app.post('/sync-complete', async (c) => {
  const { tenant_id, tool, entities_synced, documents_synced } = await c.req.json();
  
  // Update tenant's overall data strength
  const currentStrength = await c.env.DB.prepare(`
    SELECT data_strength_score, connected_tools FROM tenants WHERE id = ?
  `).bind(tenant_id).first();
  
  const connectedTools = JSON.parse(currentStrength?.connected_tools as string || '[]');
  if (!connectedTools.includes(tool)) {
    connectedTools.push(tool);
  }
  
  // Recalculate strength based on new data
  const entityCount = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM entities WHERE tenant_id = ?
  `).bind(tenant_id).first();
  
  const documentCount = await c.env.DB.prepare(`
    SELECT COUNT(*) as count FROM documents WHERE tenant_id = ?
  `).bind(tenant_id).first();
  
  const newStrength = calculateTenantStrength({
    connected_tools: connectedTools.length,
    entity_count: entityCount?.count as number || 0,
    document_count: documentCount?.count as number || 0
  });
  
  await c.env.DB.prepare(`
    UPDATE tenants 
    SET data_strength_score = ?, 
        data_strength_level = ?,
        connected_tools = ?,
        last_sync_at = ?
    WHERE id = ?
  `).bind(
    newStrength.score,
    newStrength.level,
    JSON.stringify(connectedTools),
    Date.now(),
    tenant_id
  ).run();
  
  // ═══════════════════════════════════════════════════════════
  // NOTIFY UI OF STRENGTH CHANGE (via WebSocket)
  // ═══════════════════════════════════════════════════════════
  const sessionDO = c.env.SESSION_DO.get(
    c.env.SESSION_DO.idFromName(`tenant:${tenant_id}`)
  );
  
  await sessionDO.fetch('/push', {
    method: 'POST',
    body: JSON.stringify({
      type: 'data_strength_updated',
      old_score: currentStrength?.data_strength_score,
      new_score: newStrength.score,
      new_level: newStrength.level,
      trigger: `${tool} sync completed`,
      entities_added: entities_synced,
      documents_added: documents_synced
    })
  });
  
  // ═══════════════════════════════════════════════════════════
  // TRIGGER AI ANALYSIS IF STRENGTH CROSSED THRESHOLD
  // ═══════════════════════════════════════════════════════════
  const oldLevel = strengthScoreToLevel(currentStrength?.data_strength_score as number || 0);
  
  if (newStrength.level !== oldLevel && ['healthy', 'rich'].includes(newStrength.level)) {
    // Enough data to generate meaningful insights now
    await c.env.THINK_QUEUE.send({
      type: 'strength_threshold_crossed',
      tenant_id,
      new_level: newStrength.level,
      trigger: 'Generate comprehensive intelligence now that data is sufficient'
    });
  }
  
  return c.json({
    status: 'updated',
    previous_strength: currentStrength?.data_strength_score,
    new_strength: newStrength.score,
    level_changed: newStrength.level !== oldLevel
  });
});

function calculateTenantStrength(input: {
  connected_tools: number;
  entity_count: number;
  document_count: number;
}): DataStrength {
  let score = 0;
  
  // Tools contribute significantly
  score += input.connected_tools * 15;  // Max ~75 for 5 tools
  
  // Entities
  if (input.entity_count > 0) score += 10;
  if (input.entity_count > 50) score += 10;
  if (input.entity_count > 200) score += 5;
  
  // Documents
  if (input.document_count > 0) score += 5;
  if (input.document_count > 20) score += 5;
  
  let level: DataStrength['level'];
  if (score < 25) level = 'seed';
  else if (score < 50) level = 'growing';
  else if (score < 75) level = 'healthy';
  else level = 'rich';
  
  return { score: Math.min(score, 100), level, sources: [], gaps: [], suggestions: [] };
}

function strengthScoreToLevel(score: number): DataStrength['level'] {
  if (score < 25) return 'seed';
  if (score < 50) return 'growing';
  if (score < 75) return 'healthy';
  return 'rich';
}
```

---

## 🔓 Intelligence Unlocks by Data Strength Level

```
╔════════════════════════════════════════════════════════════════════════╗
║  INTELLIGENCE UNLOCKS (based on data strength)                          ║
║  ─────────────────────────────────────────────────────────────────────  ║
║                                                                         ║
║  🌱 SEED (0-25%):                                                       ║
║     • Basic workspace structure                                         ║
║     • Manual data entry                                                 ║
║     • Sample data for guidance                                          ║
║                                                                         ║
║  🌿 GROWING (25-50%):                                                   ║
║     • Entity views populated                                            ║
║     • Basic relationships visible                                       ║
║     • Search functional                                                 ║
║                                                                         ║
║  🌳 HEALTHY (50-75%):                                                   ║
║     • AI summaries active                                               ║
║     • Cross-tool insights                                               ║
║     • Health scores calculated                                          ║
║     • Risk signals enabled                                              ║
║                                                                         ║
║  🌲 RICH (75-100%):                                                     ║
║     • Full predictive intelligence                                      ║
║     • Proactive recommendations                                         ║
║     • Automated workflows                                               ║
║     • Digital Twin active                                               ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## ✅ Summary: Progressive Hydration Principles

| Principle | Implementation |
|-----------|----------------|
| **Start sparse** | L1 views handle empty/partial data gracefully |
| **Never block** | Initial sync runs async; user sees dashboard immediately |
| **Show progress** | Real-time updates as data arrives |
| **Prompt enrichment** | Smart suggestions to connect more tools |
| **Calculate completeness** | Per-entity data quality score |
| **Graceful degradation** | Features appear only when data supports them |
| **Celebrate milestones** | "You now have health scores!" |

This is how we solve the **Day 1 empty dashboard problem** — we don't! We show what we have and guide the user to enrich. 🎯
