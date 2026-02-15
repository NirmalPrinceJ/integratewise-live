/**
 * IntegrateWise OS — Universal Domain Entity Registry
 *
 * Maps ALL 7 architectural planes into a unified KV-backed data model.
 * "Normalize once. Render anywhere."
 *
 * Planes:
 *   1. MCP (Moderated Connector Plane)
 *   2. SSOT Data Plane (Spine + Domain SSOT Views)
 *   3. Queryable Context Plane
 *   4. AI Chats Plane (Immutable Ledger)
 *   5. Governed Memory Plane
 *   6. Schema & Provenance
 *   7. Admin & Governance (RBAC, Tenants, Audit)
 *
 * Each domain has a prefix, tables with ID fields, and KV key structure:
 *   `{domain}:{tenantId}:{tableName}` → array of records
 */

// ─── Domain Table Registry ──────────────────────────────────────────────────
// Maps domain → table → idField for generic CRUD

export interface DomainTableDef {
  idField: string;
  label: string;
  description: string;
}

export interface DomainDef {
  prefix: string;
  label: string;
  plane: string;
  tables: Record<string, DomainTableDef>;
}

/**
 * COMPLETE DOMAIN REGISTRY
 * Every entity in the IntegrateWise OS is registered here.
 */
export const DOMAIN_REGISTRY: Record<string, DomainDef> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PLANE 1: Moderated Connector Plane (MCP)
  // ═══════════════════════════════════════════════════════════════════════════
  mcp: {
    prefix: "mcp",
    label: "Moderated Connector Plane",
    plane: "connector",
    tables: {
      connector_registry: {
        idField: "connectorId",
        label: "Connector Registry",
        description: "All external system connectors with auth, schema, and policy config",
      },
      request_log: {
        idField: "requestId",
        label: "Request Log",
        description: "Audit log of every connector operation (read/write/subscribe)",
      },
      connector_policies: {
        idField: "policyId",
        label: "Connector Policies",
        description: "RBAC + policy gating rules for connector access",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PLANE 2: SSOT Data Plane — Domain SSOT Views
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── CSM Domain (Customer Success) — 15 entity tables ───────────────────
  csm: {
    prefix: "csm",
    label: "Customer Success (CSM)",
    plane: "ssot",
    tables: {
      account_master: { idField: "accountId", label: "Account Master", description: "Core account entity with health, ARR, renewal, ownership" },
      people_team: { idField: "personId", label: "People & Team", description: "CSM team members and assignment mapping" },
      business_context: { idField: "contextId", label: "Business Context", description: "Customer business model, maturity, challenges" },
      strategic_objectives: { idField: "objectiveId", label: "Strategic Objectives", description: "Customer strategic goals linked to capabilities" },
      capabilities: { idField: "capabilityId", label: "MuleSoft Capabilities", description: "Platform capability maturity and gaps" },
      value_streams: { idField: "streamId", label: "Value Streams", description: "Business processes and value delivery chains" },
      api_portfolio: { idField: "apiId", label: "API Portfolio", description: "API catalog with health, SLA, transactions" },
      platform_health: { idField: "metricId", label: "Platform Health Metrics", description: "KPIs, SLAs, operational metrics" },
      initiatives: { idField: "initiativeId", label: "Initiatives", description: "Strategic projects with investment and ROI tracking" },
      risk_register: { idField: "riskId", label: "Risk Register", description: "Technical debt and risk items with mitigation" },
      stakeholder_outcomes: { idField: "outcomeId", label: "Stakeholder Outcomes", description: "Stakeholder-specific outcome tracking" },
      engagement_log: { idField: "engagementId", label: "Engagement Log", description: "Meeting and interaction history with sentiment" },
      success_plans: { idField: "successPlanId", label: "Success Plans", description: "Account success plan tracker with QBR dates" },
      task_manager: { idField: "taskId", label: "Task Manager", description: "Cross-linked tasks from multiple sources" },
      generated_insights: { idField: "insightId", label: "Generated Insights", description: "AI-generated insights with recommendations" },
    },
  },

  // ─── BizOps Domain (Business Operations) ────────────────────────────────
  bizops: {
    prefix: "bizops",
    label: "Business Operations",
    plane: "ssot",
    tables: {
      vendors: { idField: "vendorId", label: "Vendors", description: "Vendor master with contract, risk, and category" },
      invoices: { idField: "invoiceId", label: "Invoices", description: "Invoice tracking with approval status and payment" },
      approvals: { idField: "approvalId", label: "Approvals", description: "Business approval requests with policy enforcement" },
      policies: { idField: "policyId", label: "Policies", description: "Business policies and rules (spend, access, compliance)" },
      headcount: { idField: "employeeId", label: "Headcount", description: "Employee headcount by team, role, cost center" },
      workflows: { idField: "workflowId", label: "Workflows", description: "Operational workflows and automation definitions" },
      kpis: { idField: "kpiId", label: "KPIs", description: "Operational KPI definitions and tracking" },
    },
  },

  // ─── Sales Domain (Pipeline + Execution) ────────────────────────────────
  sales: {
    prefix: "sales",
    label: "Sales Operations",
    plane: "ssot",
    tables: {
      deals: { idField: "dealId", label: "Deals", description: "Sales deals/opportunities with stage and probability" },
      contacts: { idField: "contactId", label: "Contacts", description: "Sales contacts with lifecycle and lead scoring" },
      activities: { idField: "activityId", label: "Activities", description: "Sales activities (calls, emails, meetings)" },
      leads: { idField: "leadId", label: "Leads", description: "Marketing-qualified and sales-qualified leads" },
      forecasts: { idField: "forecastId", label: "Forecasts", description: "Revenue forecasts by period and rep" },
      quotas: { idField: "quotaId", label: "Quotas", description: "Sales quotas by rep, team, and period" },
      sequences: { idField: "sequenceId", label: "Sequences", description: "Sales engagement sequences/cadences" },
    },
  },

  // ─── RevOps Domain (Revenue Intelligence) ───────────────────────────────
  revops: {
    prefix: "revops",
    label: "Revenue Operations",
    plane: "ssot",
    tables: {
      revenue_waterfall: { idField: "waterfallId", label: "Revenue Waterfall", description: "ARR waterfall: expansion, contraction, churn" },
      cohort_analysis: { idField: "cohortId", label: "Cohort Analysis", description: "Customer cohort retention and expansion" },
      quota_attainment: { idField: "attainmentId", label: "Quota Attainment", description: "Quota attainment by rep and team" },
      pipeline_health: { idField: "healthId", label: "Pipeline Health", description: "Pipeline velocity, conversion, and coverage" },
    },
  },

  // ─── Marketing Domain ───────────────────────────────────────────────────
  marketing: {
    prefix: "mktg",
    label: "Marketing",
    plane: "ssot",
    tables: {
      campaigns: { idField: "campaignId", label: "Campaigns", description: "Marketing campaigns with performance metrics" },
      email_sends: { idField: "sendId", label: "Email Sends", description: "Email campaign sends with open/click tracking" },
      content_assets: { idField: "assetId", label: "Content Assets", description: "Content library (blogs, whitepapers, videos)" },
      forms: { idField: "formId", label: "Forms", description: "Form definitions with field mapping and submissions" },
      social_posts: { idField: "postId", label: "Social Posts", description: "Social media posts with engagement metrics" },
      attribution: { idField: "attributionId", label: "Attribution", description: "Multi-touch attribution for revenue influence" },
    },
  },

  // ─── Website Domain ─────────────────────────────────────────────────────
  website: {
    prefix: "web",
    label: "Website",
    plane: "ssot",
    tables: {
      pages: { idField: "pageId", label: "Pages", description: "Website pages with SEO and analytics" },
      seo_audit: { idField: "auditId", label: "SEO Audit", description: "SEO issues, recommendations, and scores" },
      web_analytics: { idField: "analyticsId", label: "Web Analytics", description: "Traffic, sessions, conversions, core web vitals" },
      media_library: { idField: "mediaId", label: "Media Library", description: "Images, videos, and files for website" },
    },
  },

  // ─── Personal Domain ────────────────────────────────────────────────────
  personal: {
    prefix: "personal",
    label: "Personal Workspace",
    plane: "ssot",
    tables: {
      tasks: { idField: "taskId", label: "Tasks", description: "Personal task list with priority and status" },
      schedule: { idField: "eventId", label: "Schedule", description: "Calendar events and meetings" },
      goals: { idField: "goalId", label: "Goals", description: "Personal OKRs and goal tracking" },
      bookmarks: { idField: "bookmarkId", label: "Bookmarks", description: "Saved links, resources, and references" },
      notes: { idField: "noteId", label: "Notes", description: "Personal notes and knowledge base entries" },
      focus_sessions: { idField: "sessionId", label: "Focus Sessions", description: "Pomodoro/deep work session log" },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PLANE 3: Queryable Context Plane
  // ═══════════════════════════════════════════════════════════════════════════
  context: {
    prefix: "context",
    label: "Context Plane",
    plane: "context",
    tables: {
      work_sessions: {
        idField: "sessionId",
        label: "Work Sessions",
        description: "Active work sessions with page, task, entity focus",
      },
      context_objects: {
        idField: "contextId",
        label: "Context Objects",
        description: "Entity-linked context: decisions, incidents, workflows, meetings",
      },
      context_index: {
        idField: "indexId",
        label: "Context Index",
        description: "Keyword + semantic + entity graph retrieval index",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PLANE 4: AI Chats Plane (Immutable Ledger)
  // ═══════════════════════════════════════════════════════════════════════════
  chats: {
    prefix: "chats",
    label: "AI Chats Plane",
    plane: "chats",
    tables: {
      chat_ledger: {
        idField: "chatId",
        label: "Chat Ledger",
        description: "Immutable log: prompts, responses, tool calls, approvals, citations",
      },
      chat_sessions: {
        idField: "sessionId",
        label: "Chat Sessions",
        description: "Conversation sessions grouping chat entries",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PLANE 5: Governed Memory Plane
  // ═══════════════════════════════════════════════════════════════════════════
  memory: {
    prefix: "memory",
    label: "Memory Plane",
    plane: "memory",
    tables: {
      memory_store: {
        idField: "memoryId",
        label: "Memory Store",
        description: "Approved, versioned, scoped memory entries (facts, decisions, rules)",
      },
      memory_candidates: {
        idField: "candidateId",
        label: "Memory Candidates",
        description: "Proposed memories from chats awaiting validation/approval",
      },
      memory_versions: {
        idField: "versionId",
        label: "Memory Versions",
        description: "Version history for memory entries (supersedes, rollback)",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PLANE 6: Schema & Provenance
  // ═══════════════════════════════════════════════════════════════════════════
  schema: {
    prefix: "schema",
    label: "Schema & Provenance",
    plane: "governance",
    tables: {
      schema_registry: {
        idField: "fieldId",
        label: "Schema Registry",
        description: "Canonical field definitions per domain, entity, with PII class and write policy",
      },
      ssot_completeness: {
        idField: "completenessId",
        label: "SSOT Completeness",
        description: "Coverage, missing fields, freshness scoring per domain/entity",
      },
      provenance_log: {
        idField: "provenanceId",
        label: "Provenance Log",
        description: "Source system, raw hash, evidence URI for every ingested record",
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PLANE 7: Admin & Governance
  // ═══════════════════════════════════════════════════════════════════════════
  admin: {
    prefix: "admin",
    label: "Admin & Governance",
    plane: "governance",
    tables: {
      tenants: { idField: "id", label: "Tenants", description: "Multi-tenant org definitions with plan and compliance" },
      users: { idField: "id", label: "Users", description: "User accounts with role, status, MFA, tenant membership" },
      roles: { idField: "id", label: "Roles", description: "RBAC role definitions with permission sets" },
      audit_log: { idField: "id", label: "Audit Log", description: "Immutable audit trail of all actions" },
      invites: { idField: "id", label: "Pending Invites", description: "User invitation tracking" },
      approval_workflows: { idField: "id", label: "Approval Workflows", description: "Approval request workflows for role/permission changes" },
      notifications: { idField: "id", label: "Notifications", description: "System notifications and alerts" },
    },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Get the KV key for a domain table.
 */
export function domainKvKey(domain: string, tenantId: string, table: string): string {
  const def = DOMAIN_REGISTRY[domain];
  if (!def) throw new Error(`Unknown domain: ${domain}`);
  return `${def.prefix}:${tenantId}:${table}`;
}

/**
 * Validate that a domain and table exist in the registry.
 */
export function validateDomainTable(domain: string, table: string): { valid: boolean; error?: string; idField?: string } {
  const domainDef = DOMAIN_REGISTRY[domain];
  if (!domainDef) {
    const validDomains = Object.keys(DOMAIN_REGISTRY).join(", ");
    return { valid: false, error: `Unknown domain '${domain}'. Valid domains: ${validDomains}` };
  }
  const tableDef = domainDef.tables[table];
  if (!tableDef) {
    const validTables = Object.keys(domainDef.tables).join(", ");
    return { valid: false, error: `Unknown table '${table}' in domain '${domain}'. Valid tables: ${validTables}` };
  }
  return { valid: true, idField: tableDef.idField };
}

/**
 * Get the full schema for a domain (table names, ID fields, labels).
 */
export function getDomainSchema(domain: string): Record<string, { idField: string; label: string; description: string }> | null {
  const domainDef = DOMAIN_REGISTRY[domain];
  if (!domainDef) return null;
  const result: Record<string, { idField: string; label: string; description: string }> = {};
  for (const [table, def] of Object.entries(domainDef.tables)) {
    result[table] = { idField: def.idField, label: def.label, description: def.description };
  }
  return result;
}

/**
 * Get ALL domains grouped by plane.
 */
export function getDomainsByPlane(): Record<string, { domain: string; label: string; tableCount: number }[]> {
  const result: Record<string, { domain: string; label: string; tableCount: number }[]> = {};
  for (const [domainId, def] of Object.entries(DOMAIN_REGISTRY)) {
    if (!result[def.plane]) result[def.plane] = [];
    result[def.plane].push({
      domain: domainId,
      label: def.label,
      tableCount: Object.keys(def.tables).length,
    });
  }
  return result;
}

/**
 * Get total table count across all domains.
 */
export function getTotalTableCount(): number {
  return Object.values(DOMAIN_REGISTRY).reduce(
    (sum, def) => sum + Object.keys(def.tables).length,
    0
  );
}
