export const STATUS_METRICS = [
  { label: "Phase", value: "Pre-Launch", sub: "Development Sprint Active", color: "text-iw-amber" },
  { label: "Team Size", value: "1", sub: "Hiring: Operations", color: "text-foreground" },
  { label: "Modules", value: "15", sub: "Context-Aware Workspace", color: "text-iw-cyan" },
  { label: "AI Agents", value: "7", sub: "Approval-Based", color: "text-iw-purple" },
  { label: "Cognitive Components", value: "14", sub: "Universal", color: "text-iw-green" },
  { label: "Revenue Target", value: "$1.2M", sub: "Year 1 via PLG Flywheel", color: "text-iw-green" },
];

export const ARCHITECTURE_LAYERS = [
  {
    id: "l0",
    badge: "L0",
    badgeColor: "bg-iw-blue/15 text-iw-blue",
    title: "Vision — Unified Intelligence Layer",
    content: `The platform creates a unified intelligence layer across all business tools. Two feedback loops converge in a Single Source of Truth (SSOT) called "The Spine" (Atlas Spine).`,
    items: [
      { name: "Loop A — Human Context", desc: "Human-governed: decisions, goals, approvals. The learning loop where humans teach the system." },
      { name: "Loop B — Tool Data", desc: "System-governed: automated ingestion, normalization. Tool data flows into canonical schema." },
      { name: "The Spine (SSOT)", desc: 'Atlas Spine — canonical truth store where both loops converge. "Normalize Once, Render Anywhere."' },
    ],
  },
  {
    id: "l1",
    badge: "L1",
    badgeColor: "bg-iw-cyan/15 text-iw-cyan",
    title: "Platform — Modules & Components",
    content: "15 context-aware workspace modules, 14 universal cognitive components, 8-stage processing pipeline with 4 accelerators. Dual-context design ensures every AI recommendation carries both vendor AND client goal impact.",
    items: [],
  },
  {
    id: "l2",
    badge: "L2",
    badgeColor: "bg-iw-green/15 text-iw-green",
    title: "System — Tech Stack & Services",
    content: "Core infrastructure layer powering the Glowing Pancake platform.",
    items: [
      { name: "Supabase", desc: "Truth Storage — PostgreSQL + Row Level Security + Auth" },
      { name: "Cloudflare", desc: "Compute/Edge/Cache — Workers, Pages, R2, KV" },
      { name: "n8n", desc: "Orchestration (Wedge Product) — Self-hosted MCP Server" },
    ],
  },
  {
    id: "l3",
    badge: "L3",
    badgeColor: "bg-iw-purple/15 text-iw-purple",
    title: "Implementation — AI Agents",
    content: "All agents are approval-based: AI proposes → Human approves → System learns",
    items: [
      { name: "SuccessPilot", desc: "CS playbook execution and health scoring" },
      { name: "ChurnShield", desc: "Churn prediction and intervention" },
      { name: "VaultGuard", desc: "Data governance and compliance" },
      { name: "DataSentinel", desc: "Data quality monitoring" },
      { name: "ArchitectIQ", desc: "Integration architecture recommendations" },
      { name: "TemplateForge", desc: "Template and document generation" },
      { name: "DealDesk", desc: "Deal structuring and pricing optimization" },
    ],
  },
];

export const INFRA_NODES = [
  {
    name: "Cloudflare",
    role: "Edge Compute & Hosting",
    className: "infra-cloudflare",
    tags: ["Workers", "Pages", "R2 Storage", "KV", "DNS", "glowingpancake.ai"],
  },
  {
    name: "Supabase",
    role: "Auth & Truth Storage",
    className: "infra-supabase",
    tags: ["hub-auth", "PostgreSQL", "RLS", "JWT"],
  },
  {
    name: "n8n",
    role: "MCP Orchestration (Wedge Product)",
    className: "infra-n8n",
    tags: ["n8n.glowingpancake.online", "MCP Server", "Workflows"],
  },
  {
    name: "Neon PostgreSQL",
    role: "Event Store",
    className: "infra-neon",
    tags: ["glowingpancake-hub", "Webhooks", "Events"],
  },
  {
    name: "Vercel",
    role: "Frontend Hosting",
    className: "infra-vercel",
    tags: ["hub-frontend-app", "core-engine", "Next.js"],
  },
  {
    name: "Notion",
    role: "Documentation & Workspace",
    className: "infra-notion",
    tags: ["17-21 DBs", "Architecture Docs", "Specs"],
  },
  {
    name: "Box",
    role: "Enterprise File Storage",
    className: "infra-box",
    tags: ["File Organization", "Versioned Docs", "Collaboration"],
  },
];

export const DOMAIN_MAP = [
  { domain: "glowingpancake.ai", desc: "Internal Dev Portal (Cloudflare Pages) — You are here", status: "active" },
  { domain: "glowingpancake.co", desc: "Public Website (Webflow) — Paused/Deprioritized", status: "paused" },
  { domain: "glowingpancake.online", desc: "Infrastructure: n8n, webhooks, APIs (Cloudflare)", status: "active" },
];

export const GAPS = [
  { system: "Flow B — Tool-to-Truth Loop", issue: "Re-ingestion mechanism missing", severity: "critical" as const, status: "Not Started" },
  { system: "Flow C — Context-to-Truth Loop", issue: "Entirely absent", severity: "critical" as const, status: "Not Started" },
  { system: "Webflow Site", issue: "Zero SEO indexing across 47 pages", severity: "medium" as const, status: "Deprioritized" },
  { system: "Email Agents", issue: "Not implemented", severity: "medium" as const, status: "Queued" },
  { system: "LinkedIn / WhatsApp Business", issue: "Setup incomplete", severity: "low" as const, status: "Deprioritized" },
];

export const TIMELINE = [
  {
    date: "NOV 2025",
    title: "Infrastructure Foundation",
    desc: "Cloudflare, Vercel, and Neon PostgreSQL provisioned. Domain routing established. Initial architecture decisions locked.",
  },
  {
    date: "DEC 01, 2025",
    title: "n8n Deployment",
    desc: "Self-hosted n8n at n8n.glowingpancake.online becomes operational. MCP server endpoint configured. Automation orchestration layer online.",
  },
  {
    date: "DEC 12, 2025",
    title: "Website Deployment",
    desc: "Hub-controller deployed via GitHub Actions + Vercel CI/CD pipeline. Production URL live. Deployment failures resolved.",
  },
  {
    date: "DEC 20, 2025",
    title: "Webhook Infrastructure",
    desc: "Cloudflare Workers + Neon event store architecture designed. Multi-provider webhook configuration for HubSpot, GitHub, Vercel.",
  },
  {
    date: "DEC 26, 2025",
    title: "Database + Auth Sprint",
    desc: "7-day sprint initiated. Neon PostgreSQL schema deployment, Supabase hub-auth project, HUB_DATABASE_SCHEMA.sql, auth flow wiring.",
  },
  {
    date: "JAN 09, 2026",
    title: "OS Architecture Redesign",
    desc: "Streamlined user flow: Login → AI Insights (Name & Numerology) → Tool Connect → OS with role-based views (Sales, Ops, Marketing, Leader, CS).",
  },
  {
    date: "FEB 14, 2026",
    title: "Dev Portal Launch",
    desc: "glowingpancake.ai goes live as the internal Dev Command Center. AI Context Layer deployed (llm.txt, context.json, .well-known/ai-context.json) for MCP-connected AI grounding.",
    isLatest: true,
  },
];

export const AI_CONTEXT_FILES = [
  {
    icon: "📄",
    title: "/llm.txt — Primary Context Document",
    desc: "Human and AI readable. Contains identity, architecture overview, current state, gaps, domains, and explicit instructions for AI assistants.",
    endpoint: "https://glowingpancake.ai/llm.txt",
    method: "GET",
  },
  {
    icon: "📊",
    title: "/context.json — Structured Data",
    desc: "Machine-readable JSON with full architecture tree, agent definitions, evolution log, business model, known gaps with severity, and infrastructure map.",
    endpoint: "https://glowingpancake.ai/context.json",
    method: "GET",
  },
  {
    icon: "🔍",
    title: "/.well-known/ai-context.json — Discovery",
    desc: "Standard discovery endpoint. AI agents check this first to find context files, MCP endpoints, and grounding instructions.",
    endpoint: "https://glowingpancake.ai/.well-known/ai-context.json",
    method: "GET",
  },
  {
    icon: "🔌",
    title: "MCP Endpoint — n8n Orchestration",
    desc: "The wedge product MCP server. AI agents connect here to orchestrate across multiple business tools through Glowing Pancake.",
    endpoint: "https://n8n.glowingpancake.online/mcp-server/http",
    method: "MCP",
  },
];
