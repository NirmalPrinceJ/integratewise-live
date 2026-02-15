/**
 * SPINE — Single Source of Truth (SSOT)
 * 
 * "Normalize once. Render anywhere."
 * 
 * This module defines:
 *  1. Canonical entity schemas (tool-agnostic)
 *  2. Provenance tracking (which tool, when, confidence)
 *  3. Department projections (BizOps, Sales, Marketing, Website, CS)
 *  4. Readiness scoring (OFF → ADDING → SEEDED → LIVE)
 *  5. Normalization: tool-specific → canonical entities
 * 
 * Rule: L1 reads only from SSOT projections. Tool schemas never leak to UI.
 */

// ─── Provenance (every field tracks where it came from) ──────────────────────

export interface Provenance {
  sourceToolId: string;   // e.g. "salesforce", "hubspot"
  sourceToolName: string; // e.g. "Salesforce", "HubSpot"
  rawId: string;          // original ID in source system
  syncedAt: string;       // ISO timestamp
  confidence: number;     // 0-1, higher when corroborated by multiple sources
}

// ─── Canonical Entities ──────────────────────────────────────────────────────

export interface CanonicalAccount {
  id: string;
  name: string;
  industry: string;
  region: string;
  tier: "enterprise" | "mid-market" | "smb";
  arr: number;
  arrGrowth: number;
  healthScore: number;
  status: "active" | "churned" | "prospect" | "at-risk";
  owner: { name: string; initials: string };
  renewalDate: string;
  renewalDays: number;
  lastTouchpoint: string;
  integrationCompleteness: number;
  logo: string;
  provenance: Provenance[];
}

export interface CanonicalContact {
  id: string;
  name: string;
  email: string;
  role: string;
  title: string;
  accountId: string;
  accountName: string;
  phone: string;
  lastActivity: string;
  leadScore: number;
  lifecycle: "subscriber" | "lead" | "mql" | "sql" | "opportunity" | "customer";
  provenance: Provenance[];
}

export interface CanonicalDeal {
  id: string;
  name: string;
  accountId: string;
  accountName: string;
  stage: "prospect" | "qualify" | "proposal" | "negotiate" | "closed-won" | "closed-lost";
  amount: number;
  probability: number;
  closeDate: string;
  owner: { name: string; initials: string };
  daysSinceLastActivity: number;
  nextStep: string;
  provenance: Provenance[];
}

export interface CanonicalTicket {
  id: string;
  subject: string;
  accountId: string;
  accountName: string;
  contactId: string;
  contactName: string;
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  slaStatus: "within" | "at-risk" | "breached";
  createdAt: string;
  resolvedAt: string | null;
  assignee: string;
  provenance: Provenance[];
}

export interface CanonicalActivity {
  id: string;
  type: "email" | "call" | "meeting" | "note" | "task" | "event" | "message";
  subject: string;
  accountId: string | null;
  contactId: string | null;
  dealId: string | null;
  date: string;
  duration: number | null; // minutes
  outcome: string | null;
  owner: string;
  provenance: Provenance[];
}

export interface CanonicalInvoice {
  id: string;
  accountId: string;
  accountName: string;
  amount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "void";
  issueDate: string;
  dueDate: string;
  lineItems: { description: string; amount: number }[];
  provenance: Provenance[];
}

export interface CanonicalLead {
  id: string;
  name: string;
  email: string;
  company: string;
  source: string; // canonical source: "organic" | "paid" | "referral" | "event" | "outbound"
  score: number;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  assignedTo: string;
  createdAt: string;
  provenance: Provenance[];
}

export interface CanonicalCampaign {
  id: string;
  name: string;
  type: string;
  status: "draft" | "active" | "paused" | "completed";
  channel: string; // canonical: "email" | "social" | "ads" | "content" | "events"
  sent: number;
  opens: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  startDate: string;
  endDate: string | null;
  provenance: Provenance[];
}

export interface CanonicalPage {
  id: string;
  path: string;
  title: string;
  status: "published" | "draft" | "archived";
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // seconds
  bounceRate: number;
  seoScore: number;
  lastModified: string;
  author: string;
  provenance: Provenance[];
}

// ─── Spine (Full SSOT) ──────────────────────────────────────────────────────

export interface SpineData {
  accounts: CanonicalAccount[];
  contacts: CanonicalContact[];
  deals: CanonicalDeal[];
  tickets: CanonicalTicket[];
  activities: CanonicalActivity[];
  invoices: CanonicalInvoice[];
  leads: CanonicalLead[];
  campaigns: CanonicalCampaign[];
  pages: CanonicalPage[];
  metadata: SpineMetadata;
}

export interface SpineMetadata {
  tenantId: string;
  lastNormalized: string;
  entityCounts: Record<string, number>;
  connectorStatuses: ConnectorStatus[];
  version: number;
}

export interface ConnectorStatus {
  id: string;
  name: string;
  icon: string;
  status: "connected" | "syncing" | "error" | "disconnected";
  lastSync: string;
  recordsIngested: number;
  entitiesNormalized: number;
  confidence: number; // avg confidence of entities from this source
}

// ─── Readiness ───────────────────────────────────────────────────────────────

export type ReadinessState = "off" | "adding" | "seeded" | "live";

export interface ReadinessBucket {
  capability: string;
  state: ReadinessState;
  label: string;
  description: string;
  requiredEntities: string[];
  coverage: number;       // % of required entities present
  completeness: number;   // % of required fields filled
  freshness: number;      // 0-1 based on recency
  confidence: number;     // avg confidence score
  score: number;          // composite readiness score 0-100
}

export interface DepartmentReadiness {
  department: string;
  label: string;
  overallState: ReadinessState;
  overallScore: number;
  buckets: ReadinessBucket[];
}

// ─── Department Projections ──────────────────────────────────────────────────

export interface BizOpsProjection {
  department: "bizops";
  readiness: DepartmentReadiness;
  summary: {
    totalARR: number;
    arrGrowth: number;
    operationalHealth: number;
    activeIntegrations: number;
    totalIntegrations: number;
    teamUtilization: number;
  };
  accounts: CanonicalAccount[];
  revenueTimeline: { month: string; arr: number; mrr: number }[];
  teamCapacity: { name: string; utilization: number }[];
  actionItems: ActionItem[];
  recentActivity: ActivityFeedItem[];
  connectorStatuses: ConnectorStatus[];
}

export interface SalesProjection {
  department: "sales";
  readiness: DepartmentReadiness;
  summary: {
    pipelineValue: number;
    forecastQ1: number;
    quotaQ1: number;
    weeklyActivity: number;
    winRate: number;
    closedWonQ1: number;
  };
  deals: CanonicalDeal[];
  contacts: CanonicalContact[];
  activities: CanonicalActivity[];
  pipelineByStage: { stage: string; value: number; count: number }[];
  activityByDay: { day: string; calls: number; emails: number; meetings: number }[];
  leaderboard: { name: string; initials: string; deals: number; revenue: number }[];
  closingThisWeek: CanonicalDeal[];
  recentWins: CanonicalDeal[];
}

export interface MarketingProjection {
  department: "marketing";
  readiness: DepartmentReadiness;
  summary: {
    leadsGenerated: number;
    mqls: number;
    emailOpenRate: number;
    revenueInfluenced: number;
    conversionRate: number;
  };
  leads: CanonicalLead[];
  campaigns: CanonicalCampaign[];
  funnelStages: { stage: string; count: number; pct: number }[];
  leadTrend: { week: string; leads: number; mqls: number }[];
  channelMix: { channel: string; pct: number }[];
  topContent: { title: string; views: number; conversions: number; type: string }[];
}

export interface WebsiteProjection {
  department: "website";
  readiness: DepartmentReadiness;
  summary: {
    totalPages: number;
    monthlyVisitors: number;
    visitorsGrowth: number;
    seoHealth: number;
    uptime: number;
    avgSessionDuration: number;
  };
  pages: CanonicalPage[];
  trafficTimeline: { day: string; visitors: number; unique: number }[];
  coreWebVitals: { metric: string; value: string; status: string; threshold: string }[];
  deviceBreakdown: { device: string; pct: number; visitors: number }[];
  trafficSources: { source: string; pct: number }[];
  seoIssues: { type: string; message: string; severity: string }[];
  recentEdits: { page: string; action: string; author: string; time: string }[];
}

export interface ActionItem {
  id: number;
  title: string;
  priority: "urgent" | "high" | "medium" | "low";
  type: "approval" | "escalation" | "task";
  due: string;
  source?: string; // provenance
}

export interface ActivityFeedItem {
  id: number;
  action: string;
  entity: string;     // canonical entity type
  entityId: string;
  time: string;
  icon: string;
  source: string;     // provenance: which tool originally
}

// ─── Normalization Engine ────────────────────────────────────────────────────
// Simulates L3 normalization: raw tool data → canonical entities

function makeProvenance(toolId: string, toolName: string, rawId: string, confidence: number): Provenance {
  return {
    sourceToolId: toolId,
    sourceToolName: toolName,
    rawId,
    syncedAt: new Date().toISOString(),
    confidence,
  };
}

// Which canonical entities does each connector contribute?
const connectorEntityMap: Record<string, string[]> = {
  salesforce:         ["accounts", "contacts", "deals", "activities"],
  hubspot:            ["contacts", "leads", "campaigns", "deals"],
  slack:              ["activities"],
  jira:               ["tickets", "activities"],
  stripe:             ["invoices", "accounts"],
  "google-analytics": ["pages"],
  mailchimp:          ["leads", "campaigns"],
  github:             ["activities"],
  quickbooks:         ["invoices", "accounts"],
  linkedin:           ["contacts", "leads"],
  calendly:           ["activities"],
  "google-workspace": ["activities"],
  zendesk:            ["tickets"],
  intercom:           ["tickets", "contacts"],
};

// ─── Seed Data Generator (simulates normalized data from connectors) ─────────

function generateAccounts(connectedApps: string[]): CanonicalAccount[] {
  const hasCRM = connectedApps.some(a => ["salesforce", "hubspot"].includes(a));
  const hasFinance = connectedApps.some(a => ["stripe", "quickbooks"].includes(a));
  if (!hasCRM && !hasFinance) return [];

  const sources: Provenance[] = [];
  if (connectedApps.includes("salesforce")) sources.push(makeProvenance("salesforce", "Salesforce", "001", 0.95));
  if (connectedApps.includes("hubspot")) sources.push(makeProvenance("hubspot", "HubSpot", "comp-1", 0.88));
  if (connectedApps.includes("stripe")) sources.push(makeProvenance("stripe", "Stripe", "cus_1", 0.92));
  if (connectedApps.includes("quickbooks")) sources.push(makeProvenance("quickbooks", "QuickBooks", "qb-c1", 0.85));

  const baseConfidence = Math.min(1, 0.5 + sources.length * 0.15);

  return [
    { id: "acc-001", name: "TechServe India Pvt Ltd", industry: "Technology", region: "APAC - India", tier: "enterprise", arr: 420000, arrGrowth: 12.5, healthScore: 92, status: "active", owner: { name: "Priya S.", initials: "PS" }, renewalDate: "2026-06-15", renewalDays: 126, lastTouchpoint: "2h ago", integrationCompleteness: 85, logo: "🏢", provenance: sources.map(s => ({ ...s, confidence: baseConfidence })) },
    { id: "acc-002", name: "CloudBridge APAC", industry: "Cloud Services", region: "APAC - Singapore", tier: "enterprise", arr: 280000, arrGrowth: 8.3, healthScore: 78, status: "active", owner: { name: "Arun K.", initials: "AK" }, renewalDate: "2026-04-22", renewalDays: 72, lastTouchpoint: "1d ago", integrationCompleteness: 92, logo: "☁️", provenance: sources.map(s => ({ ...s, confidence: baseConfidence })) },
    { id: "acc-003", name: "FinanceFlow Solutions", industry: "FinTech", region: "APAC - India", tier: "mid-market", arr: 180000, arrGrowth: -2.1, healthScore: 54, status: "at-risk", owner: { name: "Rajesh M.", initials: "RM" }, renewalDate: "2026-03-10", renewalDays: 29, lastTouchpoint: "5d ago", integrationCompleteness: 67, logo: "💰", provenance: sources.map(s => ({ ...s, confidence: baseConfidence - 0.1 })) },
    { id: "acc-004", name: "DataVault Australia", industry: "Data Security", region: "APAC - Australia", tier: "enterprise", arr: 350000, arrGrowth: 15.2, healthScore: 88, status: "active", owner: { name: "Anjali P.", initials: "AP" }, renewalDate: "2026-09-01", renewalDays: 204, lastTouchpoint: "3h ago", integrationCompleteness: 78, logo: "🔒", provenance: sources.map(s => ({ ...s, confidence: baseConfidence })) },
    { id: "acc-005", name: "RetailNest Pte Ltd", industry: "Retail", region: "APAC - Singapore", tier: "smb", arr: 95000, arrGrowth: 5.7, healthScore: 71, status: "active", owner: { name: "Vikram R.", initials: "VR" }, renewalDate: "2026-05-18", renewalDays: 98, lastTouchpoint: "12h ago", integrationCompleteness: 45, logo: "🛍️", provenance: sources.map(s => ({ ...s, confidence: baseConfidence - 0.15 })) },
    { id: "acc-006", name: "HealthTech Innovations", industry: "Healthcare", region: "APAC - India", tier: "mid-market", arr: 210000, arrGrowth: 22.0, healthScore: 95, status: "active", owner: { name: "Priya S.", initials: "PS" }, renewalDate: "2026-08-30", renewalDays: 202, lastTouchpoint: "6h ago", integrationCompleteness: 90, logo: "🏥", provenance: sources.map(s => ({ ...s, confidence: baseConfidence })) },
    { id: "acc-007", name: "LogiPrime Corp", industry: "Logistics", region: "APAC - India", tier: "mid-market", arr: 145000, arrGrowth: -5.3, healthScore: 42, status: "at-risk", owner: { name: "Rajesh M.", initials: "RM" }, renewalDate: "2026-02-28", renewalDays: 19, lastTouchpoint: "8d ago", integrationCompleteness: 55, logo: "🚚", provenance: sources.map(s => ({ ...s, confidence: baseConfidence - 0.2 })) },
    { id: "acc-008", name: "EduSpark Learning", industry: "EdTech", region: "APAC - India", tier: "smb", arr: 68000, arrGrowth: 18.9, healthScore: 83, status: "active", owner: { name: "Anjali P.", initials: "AP" }, renewalDate: "2026-07-20", renewalDays: 161, lastTouchpoint: "1d ago", integrationCompleteness: 72, logo: "📚", provenance: sources.map(s => ({ ...s, confidence: baseConfidence - 0.05 })) },
  ];
}

function generateContacts(connectedApps: string[]): CanonicalContact[] {
  const hasSource = connectedApps.some(a => ["salesforce", "hubspot", "linkedin", "intercom"].includes(a));
  if (!hasSource) return [];
  const sources: Provenance[] = [];
  if (connectedApps.includes("salesforce")) sources.push(makeProvenance("salesforce", "Salesforce", "003", 0.95));
  if (connectedApps.includes("hubspot")) sources.push(makeProvenance("hubspot", "HubSpot", "ct-1", 0.88));
  if (connectedApps.includes("linkedin")) sources.push(makeProvenance("linkedin", "LinkedIn", "li-1", 0.75));
  const conf = Math.min(1, 0.5 + sources.length * 0.15);

  return [
    { id: "con-001", name: "Arjun Mehta", email: "arjun@techserve.in", role: "CTO", title: "Chief Technology Officer", accountId: "acc-001", accountName: "TechServe India", phone: "+91-98xxx", lastActivity: "2h ago", leadScore: 85, lifecycle: "customer", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "con-002", name: "Sarah Chen", email: "sarah@cloudbridge.sg", role: "VP Sales", title: "Vice President of Sales", accountId: "acc-002", accountName: "CloudBridge APAC", phone: "+65-xxx", lastActivity: "1d ago", leadScore: 72, lifecycle: "customer", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "con-003", name: "Deepak Sharma", email: "deepak@financeflow.com", role: "CEO", title: "Chief Executive Officer", accountId: "acc-003", accountName: "FinanceFlow Solutions", phone: "+91-97xxx", lastActivity: "5d ago", leadScore: 45, lifecycle: "customer", provenance: sources.map(s => ({ ...s, confidence: conf - 0.1 })) },
    { id: "con-004", name: "Emily Torres", email: "emily@datavault.au", role: "CISO", title: "Chief Information Security Officer", accountId: "acc-004", accountName: "DataVault Australia", phone: "+61-xxx", lastActivity: "3h ago", leadScore: 90, lifecycle: "customer", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "con-005", name: "Ravi Patel", email: "ravi@healthtech.in", role: "Head of Product", title: "Head of Product", accountId: "acc-006", accountName: "HealthTech Innovations", phone: "+91-99xxx", lastActivity: "6h ago", leadScore: 88, lifecycle: "customer", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "con-006", name: "Lisa Wong", email: "lisa@retailnest.sg", role: "COO", title: "Chief Operating Officer", accountId: "acc-005", accountName: "RetailNest Pte Ltd", phone: "+65-xxx", lastActivity: "12h ago", leadScore: 62, lifecycle: "sql", provenance: sources.map(s => ({ ...s, confidence: conf - 0.1 })) },
  ];
}

function generateDeals(connectedApps: string[]): CanonicalDeal[] {
  const hasSource = connectedApps.some(a => ["salesforce", "hubspot"].includes(a));
  if (!hasSource) return [];
  const sources: Provenance[] = [];
  if (connectedApps.includes("salesforce")) sources.push(makeProvenance("salesforce", "Salesforce", "006", 0.95));
  if (connectedApps.includes("hubspot")) sources.push(makeProvenance("hubspot", "HubSpot", "deal-1", 0.88));
  const conf = Math.min(1, 0.5 + sources.length * 0.15);

  return [
    { id: "deal-001", name: "TechServe Enterprise Expansion", accountId: "acc-001", accountName: "TechServe India", stage: "negotiate", amount: 180000, probability: 80, closeDate: "2026-02-20", owner: { name: "Priya S.", initials: "PS" }, daysSinceLastActivity: 1, nextStep: "Final pricing review", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "deal-002", name: "HealthTech Platform Migration", accountId: "acc-006", accountName: "HealthTech Innovations", stage: "proposal", amount: 210000, probability: 75, closeDate: "2026-02-25", owner: { name: "Arun K.", initials: "AK" }, daysSinceLastActivity: 2, nextStep: "Demo scheduled", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "deal-003", name: "CloudBridge APAC Renewal", accountId: "acc-002", accountName: "CloudBridge APAC", stage: "qualify", amount: 280000, probability: 60, closeDate: "2026-02-28", owner: { name: "Vikram R.", initials: "VR" }, daysSinceLastActivity: 3, nextStep: "Stakeholder alignment", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "deal-004", name: "DataVault Security Suite", accountId: "acc-004", accountName: "DataVault Australia", stage: "prospect", amount: 120000, probability: 35, closeDate: "2026-03-15", owner: { name: "Anjali P.", initials: "AP" }, daysSinceLastActivity: 5, nextStep: "Initial discovery call", provenance: sources.map(s => ({ ...s, confidence: conf - 0.1 })) },
    { id: "deal-005", name: "EduSpark Growth Plan", accountId: "acc-008", accountName: "EduSpark Learning", stage: "closed-won", amount: 68000, probability: 100, closeDate: "2026-01-15", owner: { name: "Priya S.", initials: "PS" }, daysSinceLastActivity: 0, nextStep: "Implementation", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "deal-006", name: "RetailNest Onboarding", accountId: "acc-005", accountName: "RetailNest Pte Ltd", stage: "closed-won", amount: 95000, probability: 100, closeDate: "2026-01-28", owner: { name: "Rajesh M.", initials: "RM" }, daysSinceLastActivity: 0, nextStep: "Go-live support", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "deal-007", name: "FinanceFlow Rescue Package", accountId: "acc-003", accountName: "FinanceFlow Solutions", stage: "negotiate", amount: 155000, probability: 50, closeDate: "2026-03-01", owner: { name: "Rajesh M.", initials: "RM" }, daysSinceLastActivity: 4, nextStep: "Executive alignment", provenance: sources.map(s => ({ ...s, confidence: conf - 0.15 })) },
  ];
}

function generateTickets(connectedApps: string[]): CanonicalTicket[] {
  const hasSource = connectedApps.some(a => ["zendesk", "intercom", "jira"].includes(a));
  if (!hasSource) return [];
  const sources: Provenance[] = [];
  if (connectedApps.includes("zendesk")) sources.push(makeProvenance("zendesk", "Zendesk", "tk-1", 0.92));
  if (connectedApps.includes("intercom")) sources.push(makeProvenance("intercom", "Intercom", "conv-1", 0.85));
  if (connectedApps.includes("jira")) sources.push(makeProvenance("jira", "Jira", "IW-1", 0.90));
  const conf = Math.min(1, 0.5 + sources.length * 0.15);

  return [
    { id: "tkt-001", subject: "Integration sync failing for Salesforce connector", accountId: "acc-001", accountName: "TechServe India", contactId: "con-001", contactName: "Arjun Mehta", status: "open", priority: "high", category: "Integration", slaStatus: "within", createdAt: "2026-02-09T08:00:00Z", resolvedAt: null, assignee: "Arun K.", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "tkt-002", subject: "Dashboard loading slowly for large datasets", accountId: "acc-004", accountName: "DataVault Australia", contactId: "con-004", contactName: "Emily Torres", status: "in-progress", priority: "medium", category: "Performance", slaStatus: "within", createdAt: "2026-02-08T14:00:00Z", resolvedAt: null, assignee: "Vikram R.", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "tkt-003", subject: "Custom field mapping not working", accountId: "acc-003", accountName: "FinanceFlow Solutions", contactId: "con-003", contactName: "Deepak Sharma", status: "waiting", priority: "critical", category: "Bug", slaStatus: "at-risk", createdAt: "2026-02-07T10:00:00Z", resolvedAt: null, assignee: "Rajesh M.", provenance: sources.map(s => ({ ...s, confidence: conf - 0.1 })) },
    { id: "tkt-004", subject: "Request for API rate limit increase", accountId: "acc-002", accountName: "CloudBridge APAC", contactId: "con-002", contactName: "Sarah Chen", status: "resolved", priority: "low", category: "Feature Request", slaStatus: "within", createdAt: "2026-02-05T09:00:00Z", resolvedAt: "2026-02-07T16:00:00Z", assignee: "Anjali P.", provenance: sources.map(s => ({ ...s, confidence: conf })) },
  ];
}

function generateActivities(connectedApps: string[]): CanonicalActivity[] {
  const activities: CanonicalActivity[] = [];
  let id = 1;

  const hasSlack = connectedApps.includes("slack");
  const hasCRM = connectedApps.some(a => ["salesforce", "hubspot"].includes(a));
  const hasCalendly = connectedApps.includes("calendly");
  const hasGithub = connectedApps.includes("github");
  const hasGWS = connectedApps.includes("google-workspace");

  if (hasCRM) {
    const src = connectedApps.includes("salesforce") ? makeProvenance("salesforce", "Salesforce", "evt-1", 0.9) : makeProvenance("hubspot", "HubSpot", "evt-1", 0.85);
    activities.push(
      { id: `act-${id++}`, type: "email", subject: "Follow-up on expansion proposal", accountId: "acc-001", contactId: "con-001", dealId: "deal-001", date: "2026-02-09T10:30:00Z", duration: null, outcome: "Replied", owner: "Priya S.", provenance: [src] },
      { id: `act-${id++}`, type: "call", subject: "Discovery call — security requirements", accountId: "acc-004", contactId: "con-004", dealId: "deal-004", date: "2026-02-09T09:00:00Z", duration: 45, outcome: "Scheduled demo", owner: "Anjali P.", provenance: [src] },
    );
  }
  if (hasCalendly) {
    activities.push(
      { id: `act-${id++}`, type: "meeting", subject: "Quarterly business review", accountId: "acc-002", contactId: "con-002", dealId: null, date: "2026-02-09T14:00:00Z", duration: 60, outcome: null, owner: "Arun K.", provenance: [makeProvenance("calendly", "Calendly", "ev-1", 0.88)] },
      { id: `act-${id++}`, type: "meeting", subject: "Product demo — platform migration", accountId: "acc-006", contactId: "con-005", dealId: "deal-002", date: "2026-02-10T11:00:00Z", duration: 45, outcome: null, owner: "Arun K.", provenance: [makeProvenance("calendly", "Calendly", "ev-2", 0.88)] },
    );
  }
  if (hasSlack) {
    activities.push(
      { id: `act-${id++}`, type: "message", subject: "Alert: SLA breach risk for FinanceFlow", accountId: "acc-003", contactId: null, dealId: null, date: "2026-02-09T08:15:00Z", duration: null, outcome: "Escalated", owner: "System", provenance: [makeProvenance("slack", "Slack", "msg-1", 0.80)] },
    );
  }
  if (hasGithub) {
    activities.push(
      { id: `act-${id++}`, type: "event", subject: "PR merged: Fix connector retry logic (#234)", accountId: null, contactId: null, dealId: null, date: "2026-02-09T07:45:00Z", duration: null, outcome: "Merged", owner: "Dev Team", provenance: [makeProvenance("github", "GitHub", "pr-234", 0.95)] },
    );
  }
  if (hasGWS) {
    activities.push(
      { id: `act-${id++}`, type: "note", subject: "Updated Q1 revenue forecast document", accountId: null, contactId: null, dealId: null, date: "2026-02-09T06:00:00Z", duration: null, outcome: null, owner: "Rajesh M.", provenance: [makeProvenance("google-workspace", "Google Workspace", "doc-1", 0.82)] },
    );
  }

  return activities;
}

function generateLeads(connectedApps: string[]): CanonicalLead[] {
  const hasSource = connectedApps.some(a => ["hubspot", "mailchimp", "linkedin"].includes(a));
  if (!hasSource) return [];
  const sources: Provenance[] = [];
  if (connectedApps.includes("hubspot")) sources.push(makeProvenance("hubspot", "HubSpot", "lead-1", 0.88));
  if (connectedApps.includes("mailchimp")) sources.push(makeProvenance("mailchimp", "Mailchimp", "sub-1", 0.80));
  if (connectedApps.includes("linkedin")) sources.push(makeProvenance("linkedin", "LinkedIn", "li-lead-1", 0.75));
  const conf = Math.min(1, 0.5 + sources.length * 0.15);

  return [
    { id: "lead-001", name: "Vikram Desai", email: "vikram@acmecorp.in", company: "AcmeCorp India", source: "organic", score: 82, status: "qualified", assignedTo: "Priya S.", createdAt: "2026-02-08T10:00:00Z", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "lead-002", name: "Michelle Tan", email: "michelle@nexgen.sg", company: "NexGen Singapore", source: "paid", score: 68, status: "contacted", assignedTo: "Arun K.", createdAt: "2026-02-07T14:00:00Z", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "lead-003", name: "James Wright", email: "james@autech.au", company: "AuTech Australia", source: "referral", score: 91, status: "qualified", assignedTo: "Vikram R.", createdAt: "2026-02-06T09:00:00Z", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "lead-004", name: "Neha Gupta", email: "neha@startupx.in", company: "StartupX", source: "event", score: 55, status: "new", assignedTo: "Anjali P.", createdAt: "2026-02-09T08:00:00Z", provenance: sources.map(s => ({ ...s, confidence: conf - 0.1 })) },
  ];
}

function generateCampaigns(connectedApps: string[]): CanonicalCampaign[] {
  const hasSource = connectedApps.some(a => ["hubspot", "mailchimp"].includes(a));
  if (!hasSource) return [];
  const sources: Provenance[] = [];
  if (connectedApps.includes("hubspot")) sources.push(makeProvenance("hubspot", "HubSpot", "camp-1", 0.88));
  if (connectedApps.includes("mailchimp")) sources.push(makeProvenance("mailchimp", "Mailchimp", "mc-c1", 0.82));
  const conf = Math.min(1, 0.5 + sources.length * 0.15);

  return [
    { id: "camp-001", name: "APAC Growth Webinar Q1", type: "Webinar", status: "active", channel: "email", sent: 5200, opens: 2340, clicks: 890, conversions: 166, conversionRate: 3.2, revenue: 42000, startDate: "2026-01-15", endDate: null, provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "camp-002", name: "Product Launch — Enterprise", type: "Multi-Channel", status: "active", channel: "email", sent: 12000, opens: 4800, clicks: 1920, conversions: 336, conversionRate: 2.8, revenue: 85000, startDate: "2026-01-20", endDate: null, provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "camp-003", name: "Customer Success Stories", type: "Content", status: "completed", channel: "content", sent: 8500, opens: 3400, clicks: 1360, conversions: 349, conversionRate: 4.1, revenue: 38000, startDate: "2025-12-01", endDate: "2026-01-31", provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "camp-004", name: "LinkedIn Lead Gen — India", type: "Ads", status: "active", channel: "ads", sent: 0, opens: 0, clicks: 3200, conversions: 61, conversionRate: 1.9, revenue: 22000, startDate: "2026-01-10", endDate: null, provenance: sources.map(s => ({ ...s, confidence: conf - 0.1 })) },
    { id: "camp-005", name: "Nurture: Trial to Paid", type: "Automation", status: "active", channel: "email", sent: 3400, opens: 1700, clicks: 680, conversions: 190, conversionRate: 5.6, revenue: 56000, startDate: "2025-11-01", endDate: null, provenance: sources.map(s => ({ ...s, confidence: conf })) },
  ];
}

function generatePages(connectedApps: string[]): CanonicalPage[] {
  const hasSource = connectedApps.includes("google-analytics");
  // Pages always exist (it's our own website), but GA enriches them with traffic data
  const sources: Provenance[] = hasSource
    ? [makeProvenance("google-analytics", "Google Analytics", "ga-1", 0.92)]
    : [makeProvenance("internal", "IntegrateWise CMS", "cms-1", 0.70)];
  const trafficMultiplier = hasSource ? 1.0 : 0.4; // less data without GA

  return [
    { id: "page-001", path: "/", title: "Homepage", status: "published", views: Math.round(8420 * trafficMultiplier), uniqueVisitors: Math.round(6100 * trafficMultiplier), avgTimeOnPage: 42, bounceRate: 38, seoScore: 92, lastModified: "2026-02-08", author: "Priya S.", provenance: sources },
    { id: "page-002", path: "/blog/crm-normalization", title: "How CRM Normalization Works", status: "published", views: Math.round(4380 * trafficMultiplier), uniqueVisitors: Math.round(3200 * trafficMultiplier), avgTimeOnPage: 185, bounceRate: 22, seoScore: 88, lastModified: "2026-02-05", author: "Arun K.", provenance: sources },
    { id: "page-003", path: "/pricing", title: "Pricing Plans", status: "published", views: Math.round(3210 * trafficMultiplier), uniqueVisitors: Math.round(2400 * trafficMultiplier), avgTimeOnPage: 95, bounceRate: 45, seoScore: 95, lastModified: "2026-02-07", author: "Rajesh M.", provenance: sources },
    { id: "page-004", path: "/blog/apac-revops", title: "APAC RevOps Playbook", status: "published", views: Math.round(2890 * trafficMultiplier), uniqueVisitors: Math.round(2100 * trafficMultiplier), avgTimeOnPage: 210, bounceRate: 18, seoScore: 78, lastModified: "2026-01-28", author: "Priya S.", provenance: sources },
    { id: "page-005", path: "/features", title: "Features Overview", status: "published", views: Math.round(2450 * trafficMultiplier), uniqueVisitors: Math.round(1800 * trafficMultiplier), avgTimeOnPage: 120, bounceRate: 32, seoScore: 85, lastModified: "2026-02-01", author: "Vikram R.", provenance: sources },
    { id: "page-006", path: "/blog/integration-guide", title: "Integration Setup Guide", status: "draft", views: Math.round(1890 * trafficMultiplier), uniqueVisitors: Math.round(1400 * trafficMultiplier), avgTimeOnPage: 240, bounceRate: 15, seoScore: 72, lastModified: "2026-02-09", author: "Arun K.", provenance: sources },
  ];
}

function generateInvoices(connectedApps: string[]): CanonicalInvoice[] {
  const hasSource = connectedApps.some(a => ["stripe", "quickbooks"].includes(a));
  if (!hasSource) return [];
  const sources: Provenance[] = [];
  if (connectedApps.includes("stripe")) sources.push(makeProvenance("stripe", "Stripe", "inv-1", 0.92));
  if (connectedApps.includes("quickbooks")) sources.push(makeProvenance("quickbooks", "QuickBooks", "qb-inv-1", 0.88));
  const conf = Math.min(1, 0.5 + sources.length * 0.15);

  return [
    { id: "inv-001", accountId: "acc-001", accountName: "TechServe India", amount: 35000, status: "paid", issueDate: "2026-01-01", dueDate: "2026-01-31", lineItems: [{ description: "Enterprise License — Q1", amount: 35000 }], provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "inv-002", accountId: "acc-002", accountName: "CloudBridge APAC", amount: 23333, status: "sent", issueDate: "2026-02-01", dueDate: "2026-02-28", lineItems: [{ description: "Enterprise License — Feb", amount: 23333 }], provenance: sources.map(s => ({ ...s, confidence: conf })) },
    { id: "inv-003", accountId: "acc-003", accountName: "FinanceFlow Solutions", amount: 15000, status: "overdue", issueDate: "2026-01-15", dueDate: "2026-02-05", lineItems: [{ description: "Mid-Market License — Jan", amount: 15000 }], provenance: sources.map(s => ({ ...s, confidence: conf - 0.1 })) },
  ];
}

// ─── Readiness Computation ───────────────────────────────────────────────────

function computeReadiness(connectedApps: string[], spine: SpineData): Record<string, DepartmentReadiness> {
  const deptConfig: Record<string, { label: string; buckets: { capability: string; label: string; description: string; requiredEntities: string[]; requiredConnectors: string[] }[] }> = {
    bizops: {
      label: "Business Operations",
      buckets: [
        { capability: "revenue", label: "Revenue & Accounts", description: "Account data with ARR, health scores, and renewal tracking", requiredEntities: ["accounts", "invoices"], requiredConnectors: ["salesforce", "hubspot", "stripe", "quickbooks"] },
        { capability: "workflows", label: "Operational Workflows", description: "Task and workflow automation data", requiredEntities: ["activities", "tickets"], requiredConnectors: ["jira", "slack", "google-workspace"] },
        { capability: "team", label: "Team & Collaboration", description: "Team communication and activity data", requiredEntities: ["activities"], requiredConnectors: ["slack", "google-workspace", "calendly"] },
      ],
    },
    sales: {
      label: "Sales & RevOps",
      buckets: [
        { capability: "pipeline", label: "Pipeline & Deals", description: "Deal tracking with stages, amounts, and probabilities", requiredEntities: ["deals", "accounts"], requiredConnectors: ["salesforce", "hubspot"] },
        { capability: "contacts", label: "Contacts & Relationships", description: "Contact data with engagement history", requiredEntities: ["contacts", "activities"], requiredConnectors: ["salesforce", "hubspot", "linkedin"] },
        { capability: "activity", label: "Sales Activity", description: "Calls, emails, meetings tracking", requiredEntities: ["activities"], requiredConnectors: ["salesforce", "calendly", "google-workspace"] },
      ],
    },
    marketing: {
      label: "Marketing",
      buckets: [
        { capability: "campaigns", label: "Campaign Performance", description: "Campaign metrics with attribution", requiredEntities: ["campaigns", "leads"], requiredConnectors: ["hubspot", "mailchimp"] },
        { capability: "leadgen", label: "Lead Generation", description: "Lead capture and qualification data", requiredEntities: ["leads", "contacts"], requiredConnectors: ["hubspot", "mailchimp", "linkedin"] },
        { capability: "analytics", label: "Marketing Analytics", description: "Traffic, conversion, and attribution data", requiredEntities: ["pages", "leads"], requiredConnectors: ["google-analytics", "hubspot"] },
      ],
    },
    website: {
      label: "Website & Content",
      buckets: [
        { capability: "traffic", label: "Traffic & Analytics", description: "Visitor data, session metrics, conversion tracking", requiredEntities: ["pages"], requiredConnectors: ["google-analytics"] },
        { capability: "content", label: "Content Management", description: "Page content, SEO scores, and publishing", requiredEntities: ["pages"], requiredConnectors: [] },
        { capability: "seo", label: "SEO & Performance", description: "Search rankings, Core Web Vitals, and site health", requiredEntities: ["pages"], requiredConnectors: ["google-analytics"] },
      ],
    },
  };

  const result: Record<string, DepartmentReadiness> = {};

  for (const [dept, config] of Object.entries(deptConfig)) {
    const buckets: ReadinessBucket[] = config.buckets.map((b) => {
      const hasEntities = b.requiredEntities.every((e) => {
        const key = e as keyof SpineData;
        return Array.isArray(spine[key]) && (spine[key] as any[]).length > 0;
      });
      const hasConnectors = b.requiredConnectors.length === 0 || b.requiredConnectors.some(c => connectedApps.includes(c));
      const entityCoverage = b.requiredEntities.filter(e => {
        const key = e as keyof SpineData;
        return Array.isArray(spine[key]) && (spine[key] as any[]).length > 0;
      }).length / b.requiredEntities.length;

      const completeness = hasEntities ? 0.75 + Math.random() * 0.25 : hasConnectors ? 0.3 + Math.random() * 0.2 : 0;
      const freshness = hasEntities ? 0.8 + Math.random() * 0.2 : 0;
      const confidence = hasEntities ? 0.6 + connectedApps.length * 0.05 : 0;
      const score = Math.round((entityCoverage * 30 + completeness * 30 + freshness * 20 + Math.min(1, confidence) * 20));

      let state: ReadinessState = "off";
      if (score >= 75) state = "live";
      else if (score >= 50) state = "seeded";
      else if (hasConnectors) state = "adding";

      return {
        capability: b.capability,
        state,
        label: b.label,
        description: b.description,
        requiredEntities: b.requiredEntities,
        coverage: entityCoverage,
        completeness,
        freshness,
        confidence: Math.min(1, confidence),
        score,
      };
    });

    const overallScore = Math.round(buckets.reduce((s, b) => s + b.score, 0) / buckets.length);
    let overallState: ReadinessState = "off";
    if (overallScore >= 75) overallState = "live";
    else if (overallScore >= 50) overallState = "seeded";
    else if (buckets.some(b => b.state !== "off")) overallState = "adding";

    result[dept] = { department: dept, label: config.label, overallState, overallScore, buckets };
  }

  return result;
}

// ─── Projection Builders ─────────────────────────────────────────────────────

function buildBizOpsProjection(spine: SpineData, readiness: DepartmentReadiness, connectedApps: string[]): BizOpsProjection {
  const totalARR = spine.accounts.reduce((s, a) => s + a.arr, 0);
  const avgHealth = spine.accounts.length > 0 ? spine.accounts.reduce((s, a) => s + a.healthScore, 0) / spine.accounts.length : 0;
  const arrGrowth = spine.accounts.length > 0 ? spine.accounts.reduce((s, a) => s + a.arrGrowth, 0) / spine.accounts.length : 0;

  const connectorStatuses: ConnectorStatus[] = connectedApps.map((appId) => {
    const entityTypes = connectorEntityMap[appId] || [];
    const entitiesNormalized = entityTypes.reduce((sum, et) => {
      const key = et as keyof SpineData;
      return sum + (Array.isArray(spine[key]) ? (spine[key] as any[]).length : 0);
    }, 0);

    return {
      id: appId,
      name: appId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      icon: connectorIcons[appId] || "🔌",
      status: "connected" as const,
      lastSync: new Date().toISOString(),
      recordsIngested: entitiesNormalized * 12 + Math.floor(Math.random() * 100),
      entitiesNormalized,
      confidence: 0.6 + connectedApps.length * 0.05,
    };
  });

  return {
    department: "bizops",
    readiness,
    summary: {
      totalARR,
      arrGrowth,
      operationalHealth: Math.round(avgHealth * 10) / 10,
      activeIntegrations: connectedApps.length,
      totalIntegrations: connectedApps.length + 6,
      teamUtilization: 78.8,
    },
    accounts: spine.accounts,
    revenueTimeline: [
      { month: "Aug", arr: totalARR * 0.62, mrr: totalARR * 0.62 / 12 },
      { month: "Sep", arr: totalARR * 0.68, mrr: totalARR * 0.68 / 12 },
      { month: "Oct", arr: totalARR * 0.74, mrr: totalARR * 0.74 / 12 },
      { month: "Nov", arr: totalARR * 0.79, mrr: totalARR * 0.79 / 12 },
      { month: "Dec", arr: totalARR * 0.85, mrr: totalARR * 0.85 / 12 },
      { month: "Jan", arr: totalARR * 0.94, mrr: totalARR * 0.94 / 12 },
      { month: "Feb", arr: totalARR, mrr: totalARR / 12 },
    ],
    teamCapacity: [
      { name: "Arun K.", utilization: 85 },
      { name: "Priya S.", utilization: 72 },
      { name: "Rajesh M.", utilization: 91 },
      { name: "Anjali P.", utilization: 68 },
      { name: "Vikram R.", utilization: 78 },
    ],
    actionItems: buildActionItems(spine),
    recentActivity: buildActivityFeed(spine),
    connectorStatuses,
  };
}

function buildSalesProjection(spine: SpineData, readiness: DepartmentReadiness): SalesProjection {
  const openDeals = spine.deals.filter(d => !["closed-won", "closed-lost"].includes(d.stage));
  const closedWon = spine.deals.filter(d => d.stage === "closed-won");
  const pipelineValue = openDeals.reduce((s, d) => s + d.amount, 0);
  const weightedForecast = openDeals.reduce((s, d) => s + d.amount * d.probability / 100, 0);

  return {
    department: "sales",
    readiness,
    summary: {
      pipelineValue,
      forecastQ1: weightedForecast,
      quotaQ1: 1200000,
      weeklyActivity: spine.activities.filter(a => ["call", "email", "meeting"].includes(a.type)).length * 18,
      winRate: 67,
      closedWonQ1: closedWon.reduce((s, d) => s + d.amount, 0),
    },
    deals: spine.deals,
    contacts: spine.contacts,
    activities: spine.activities.filter(a => a.dealId || a.contactId),
    pipelineByStage: [
      { stage: "Prospect", value: openDeals.filter(d => d.stage === "prospect").reduce((s, d) => s + d.amount, 0), count: openDeals.filter(d => d.stage === "prospect").length },
      { stage: "Qualify", value: openDeals.filter(d => d.stage === "qualify").reduce((s, d) => s + d.amount, 0), count: openDeals.filter(d => d.stage === "qualify").length },
      { stage: "Proposal", value: openDeals.filter(d => d.stage === "proposal").reduce((s, d) => s + d.amount, 0), count: openDeals.filter(d => d.stage === "proposal").length },
      { stage: "Negotiate", value: openDeals.filter(d => d.stage === "negotiate").reduce((s, d) => s + d.amount, 0), count: openDeals.filter(d => d.stage === "negotiate").length },
    ],
    activityByDay: [
      { day: "Mon", calls: 12, emails: 24, meetings: 3 },
      { day: "Tue", calls: 15, emails: 18, meetings: 5 },
      { day: "Wed", calls: 8, emails: 22, meetings: 4 },
      { day: "Thu", calls: 18, emails: 30, meetings: 2 },
      { day: "Fri", calls: 10, emails: 16, meetings: 6 },
    ],
    leaderboard: [
      { name: "Priya S.", initials: "PS", deals: closedWon.filter(d => d.owner.name === "Priya S.").length + 6, revenue: 710000 },
      { name: "Arun K.", initials: "AK", deals: 6, revenue: 525000 },
      { name: "Rajesh M.", initials: "RM", deals: 5, revenue: 385000 },
      { name: "Vikram R.", initials: "VR", deals: 4, revenue: 187000 },
      { name: "Anjali P.", initials: "AP", deals: 3, revenue: 278000 },
    ],
    closingThisWeek: openDeals.filter(d => d.probability >= 60).slice(0, 3),
    recentWins: closedWon.slice(0, 2),
  };
}

function buildMarketingProjection(spine: SpineData, readiness: DepartmentReadiness): MarketingProjection {
  const totalLeads = spine.leads.length > 0 ? spine.leads.length * 1130 : 0;
  const mqls = Math.round(totalLeads * 0.4);
  const totalRevenue = spine.campaigns.reduce((s, c) => s + c.revenue, 0);
  const avgOpenRate = 45;
  const avgConvRate = spine.campaigns.length > 0 ? spine.campaigns.reduce((s, c) => s + c.conversionRate, 0) / spine.campaigns.length : 0;

  return {
    department: "marketing",
    readiness,
    summary: {
      leadsGenerated: totalLeads,
      mqls,
      emailOpenRate: avgOpenRate,
      revenueInfluenced: totalRevenue,
      conversionRate: Math.round(avgConvRate * 10) / 10,
    },
    leads: spine.leads,
    campaigns: spine.campaigns,
    funnelStages: [
      { stage: "Leads", count: totalLeads, pct: 100 },
      { stage: "MQLs", count: mqls, pct: 40 },
      { stage: "SQLs", count: Math.round(mqls * 0.4), pct: 16 },
      { stage: "Opps", count: Math.round(mqls * 0.16), pct: 6.4 },
      { stage: "Customers", count: Math.round(mqls * 0.08), pct: 3.2 },
    ],
    leadTrend: [
      { week: "W1", leads: 280, mqls: 112 },
      { week: "W2", leads: 320, mqls: 128 },
      { week: "W3", leads: 410, mqls: 164 },
      { week: "W4", leads: 380, mqls: 152 },
      { week: "W5", leads: 450, mqls: 180 },
      { week: "W6", leads: 520, mqls: 208 },
      { week: "W7", leads: 480, mqls: 192 },
      { week: "W8", leads: 560, mqls: 224 },
    ],
    channelMix: [
      { channel: "Email", pct: 35 },
      { channel: "Organic", pct: 28 },
      { channel: "Social", pct: 18 },
      { channel: "Ads", pct: 12 },
      { channel: "Events", pct: 7 },
    ],
    topContent: [
      { title: "How IntegrateWise Normalizes CRM Data", views: 12400, conversions: 89, type: "Blog" },
      { title: "APAC RevOps Playbook 2026", views: 8900, conversions: 156, type: "Guide" },
      { title: "Spine Architecture Deep Dive", views: 6700, conversions: 45, type: "Blog" },
      { title: "Integration Maturity Assessment", views: 5200, conversions: 210, type: "Tool" },
    ],
  };
}

function buildWebsiteProjection(spine: SpineData, readiness: DepartmentReadiness): WebsiteProjection {
  const totalViews = spine.pages.reduce((s, p) => s + p.views, 0);
  const totalUnique = spine.pages.reduce((s, p) => s + p.uniqueVisitors, 0);
  const avgSeo = spine.pages.length > 0 ? Math.round(spine.pages.reduce((s, p) => s + p.seoScore, 0) / spine.pages.length) : 0;
  const hasGA = spine.pages.some(p => p.provenance.some(pr => pr.sourceToolId === "google-analytics"));

  return {
    department: "website",
    readiness,
    summary: {
      totalPages: spine.pages.length,
      monthlyVisitors: totalUnique,
      visitorsGrowth: hasGA ? 22 : 8,
      seoHealth: avgSeo,
      uptime: 99.97,
      avgSessionDuration: hasGA ? 222 : 120,
    },
    pages: spine.pages,
    trafficTimeline: [
      { day: "Feb 2", visitors: 1240, unique: 890 },
      { day: "Feb 3", visitors: 1380, unique: 960 },
      { day: "Feb 4", visitors: 1520, unique: 1100 },
      { day: "Feb 5", visitors: 1290, unique: 940 },
      { day: "Feb 6", visitors: 1680, unique: 1220 },
      { day: "Feb 7", visitors: 1890, unique: 1340 },
      { day: "Feb 8", visitors: 1760, unique: 1280 },
      { day: "Feb 9", visitors: 2100, unique: 1520 },
    ],
    coreWebVitals: [
      { metric: "LCP", value: "1.8s", status: "good", threshold: "< 2.5s" },
      { metric: "FID", value: "45ms", status: "good", threshold: "< 100ms" },
      { metric: "CLS", value: "0.05", status: "good", threshold: "< 0.1" },
      { metric: "TTFB", value: "320ms", status: "good", threshold: "< 800ms" },
    ],
    deviceBreakdown: [
      { device: "Desktop", pct: 52, visitors: Math.round(totalUnique * 0.52) },
      { device: "Mobile", pct: 38, visitors: Math.round(totalUnique * 0.38) },
      { device: "Tablet", pct: 10, visitors: Math.round(totalUnique * 0.10) },
    ],
    trafficSources: [
      { source: "Organic Search", pct: 42 },
      { source: "Direct", pct: 28 },
      { source: "Social Media", pct: 15 },
      { source: "Referral", pct: 10 },
      { source: "Email", pct: 5 },
    ],
    seoIssues: [
      { type: "warning", message: "3 pages missing meta descriptions", severity: "medium" },
      { type: "error", message: "1 broken internal link detected", severity: "high" },
      { type: "success", message: "Core Web Vitals all passing", severity: "low" },
      { type: "warning", message: "2 images missing alt text", severity: "medium" },
    ],
    recentEdits: [
      { page: "Blog: Integration Guide", action: "Content updated", author: "Arun K.", time: "30 min ago" },
      { page: "Homepage", action: "Hero banner changed", author: "Priya S.", time: "2h ago" },
      { page: "Pricing", action: "New plan added", author: "Rajesh M.", time: "5h ago" },
    ],
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const connectorIcons: Record<string, string> = {
  salesforce: "☁️", hubspot: "🟠", slack: "💬", jira: "🔵", stripe: "💳",
  "google-analytics": "📊", mailchimp: "🐵", github: "🐙", quickbooks: "📗",
  linkedin: "💼", calendly: "📅", "google-workspace": "🔷", zendesk: "🎧", intercom: "💎",
};

function buildActionItems(spine: SpineData): ActionItem[] {
  const items: ActionItem[] = [];
  let id = 1;
  // Derive from actual SSOT data
  const atRisk = spine.accounts.filter(a => a.healthScore < 60);
  for (const a of atRisk.slice(0, 2)) {
    items.push({ id: id++, title: `Review at-risk account: ${a.name} (health: ${a.healthScore})`, priority: a.healthScore < 45 ? "urgent" : "high", type: "escalation", due: "Today", source: a.provenance[0]?.sourceToolName });
  }
  const renewingSoon = spine.accounts.filter(a => a.renewalDays < 30);
  for (const a of renewingSoon.slice(0, 2)) {
    items.push({ id: id++, title: `Upcoming renewal: ${a.name} in ${a.renewalDays}d`, priority: "high", type: "approval", due: "This week", source: a.provenance[0]?.sourceToolName });
  }
  const openTickets = spine.tickets.filter(t => t.slaStatus === "at-risk");
  for (const t of openTickets.slice(0, 1)) {
    items.push({ id: id++, title: `SLA at-risk: ${t.subject}`, priority: "urgent", type: "escalation", due: "Today", source: t.provenance[0]?.sourceToolName });
  }
  // Always add a generic one
  items.push({ id: id++, title: "Review Q4 revenue reconciliation", priority: "medium", type: "task", due: "Tomorrow" });
  return items.slice(0, 5);
}

function buildActivityFeed(spine: SpineData): ActivityFeedItem[] {
  return spine.activities.slice(0, 5).map((act, i) => ({
    id: i + 1,
    action: act.subject,
    entity: act.type,
    entityId: act.id,
    time: formatRelativeTime(act.date),
    icon: activityIcons[act.type] || "📋",
    source: act.provenance[0]?.sourceToolName || "System",
  }));
}

const activityIcons: Record<string, string> = {
  email: "📧", call: "📞", meeting: "📅", note: "📝", task: "✅", event: "🔔", message: "💬",
};

function formatRelativeTime(isoDate: string): string {
  const now = new Date("2026-02-09T12:00:00Z");
  const then = new Date(isoDate);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

// ─── Public API: Initialize + Query ──────────────────────────────────────────

export function normalizeAndBuildSpine(connectedApps: string[]): SpineData {
  const accounts = generateAccounts(connectedApps);
  const contacts = generateContacts(connectedApps);
  const deals = generateDeals(connectedApps);
  const tickets = generateTickets(connectedApps);
  const activities = generateActivities(connectedApps);
  const invoices = generateInvoices(connectedApps);
  const leads = generateLeads(connectedApps);
  const campaigns = generateCampaigns(connectedApps);
  const pages = generatePages(connectedApps);

  return {
    accounts,
    contacts,
    deals,
    tickets,
    activities,
    invoices,
    leads,
    campaigns,
    pages,
    metadata: {
      tenantId: "t1",
      lastNormalized: new Date().toISOString(),
      entityCounts: {
        accounts: accounts.length,
        contacts: contacts.length,
        deals: deals.length,
        tickets: tickets.length,
        activities: activities.length,
        invoices: invoices.length,
        leads: leads.length,
        campaigns: campaigns.length,
        pages: pages.length,
      },
      connectorStatuses: connectedApps.map((appId) => ({
        id: appId,
        name: appId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        icon: connectorIcons[appId] || "🔌",
        status: "connected" as const,
        lastSync: new Date().toISOString(),
        recordsIngested: Math.floor(100 + Math.random() * 5000),
        entitiesNormalized: Math.floor(10 + Math.random() * 200),
        confidence: Math.min(1, 0.6 + connectedApps.length * 0.05),
      })),
      version: 1,
    },
  };
}

export function buildProjection(spine: SpineData, department: string, connectedApps: string[]) {
  const readinessMap = computeReadiness(connectedApps, spine);

  switch (department) {
    case "bizops":
    case "ops":
      return buildBizOpsProjection(spine, readinessMap["bizops"], connectedApps);
    case "sales":
      return buildSalesProjection(spine, readinessMap["sales"]);
    case "marketing":
      return buildMarketingProjection(spine, readinessMap["marketing"]);
    case "website":
      return buildWebsiteProjection(spine, readinessMap["website"]);
    default:
      return { error: `Unknown department: ${department}` };
  }
}

export function getReadiness(connectedApps: string[], spine: SpineData) {
  return computeReadiness(connectedApps, spine);
}
