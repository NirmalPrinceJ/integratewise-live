/**
 * Page Content Definitions — Every page in the sitemap gets rich, multi-section content.
 * Each page defines: hero, features, stats, testimonials, FAQ, timeline, comparison, CTA.
 */
import {
  Network, Database, Brain, ShieldCheck, Zap, Target, Users, BarChart3,
  FileText, BookOpen, Mail, Headphones, Globe, Briefcase, Wrench,
  RefreshCw, Cpu, Bot, Scale, Rocket, GraduationCap, Eye, Layers,
  CheckCircle2, GitBranch, Activity, Shield, Lock, CloudLightning,
  Search, TrendingUp, Clock, ArrowUpDown, Code, Workflow,
  MessageSquare, Calendar, Sparkles, BrainCircuit, Link, Server, Puzzle,
} from "lucide-react";

/* ── Images - Placeholder empty strings (no Unsplash) ── */
const IMG = {
  dashboard: "",
  team: "",
  server: "",
  strategy: "",
  developer: "",
  professional: "",
  security: "",
  founder: "",
  network: "",
  woman: "",
  gradient: "",
  workflow: "",
  aiVision: "",
  dataUnify: "",
  monitoring: "",
  handshake: "",
  revenue: "",
  compliance: "",
  integration: "",
  customerMeeting: "",
  automation: "",
  laptop: "",
  presentation: "",
  office: "",
  learning: "",
};

/* ── Shared data ── */
const LOGOS = ["Salesforce", "HubSpot", "Zendesk", "Stripe", "Slack", "Jira", "Intercom", "Snowflake"];

const SHARED_TESTIMONIALS = [
  { quote: "IntegrateWise eliminated 12 hours of weekly manual data reconciliation. Our team now focuses on strategy instead of spreadsheets.", author: "Sarah Chen", role: "VP Revenue Operations", company: "TechServe", rating: 5 },
  { quote: "The Think Engine caught a churn signal we would have missed entirely. It saved a $420K renewal.", author: "Marcus Rivera", role: "Head of CS", company: "CloudBridge", rating: 5 },
  { quote: "Finally, an integration platform that understands business context, not just data pipes. The dual-lens scoring is a game-changer.", author: "Priya Sharma", role: "COO", company: "DataVault", rating: 5 },
];

const SHARED_FAQ = [
  { question: "How long does implementation take?", answer: "Most teams are fully operational in under 2 weeks. Our guided onboarding configures connectors, maps schemas, and calibrates the intelligence layer to your specific business context. Enterprise deployments with custom integrations typically take 4-6 weeks." },
  { question: "Do I need technical expertise to use IntegrateWise?", answer: "No. IntegrateWise is designed for business operators — CSMs, RevOps, and leadership teams. Connector setup is OAuth-based (one click), and the AI surfaces insights in plain language. Developers can access our API for custom integrations." },
  { question: "How does IntegrateWise handle data security?", answer: "We employ encryption at rest and in transit, role-based access control, audit trails for every action, and governance gates at every layer. We're SOC 2 Type II compliant and GDPR-ready. Data never leaves your region without explicit configuration." },
  { question: "What integrations are supported?", answer: "We support 12+ native connectors including Salesforce, HubSpot, Zendesk, Stripe, Slack, Jira, Intercom, Snowflake, and more. Custom connectors can be built via our API. New integrations are added monthly based on customer demand." },
  { question: "How is this different from Zapier or Workato?", answer: "Traditional iPaaS tools move data. IntegrateWise understands data. We don't just sync — we normalize into a Canonical Spine, reason with AI, detect patterns, and surface actionable intelligence. Think of us as the intelligence layer on top of your integrations." },
  { question: "Is there a free tier?", answer: "Yes. Our Starter plan includes up to 3 connectors, 1,000 events/month, and access to the core intelligence features. It's designed for small teams and students who want to learn integration intelligence." },
];

/* ── Page Content Type ── */
export interface PageContent {
  hero: {
    badge?: string;
    title: string;
    highlight?: string;
    description: string;
    primaryCta?: { label: string; hash: string };
    secondaryCta?: { label: string; hash: string };
    image?: string;
    layout?: "center" | "split";
    dark?: boolean;
  };
  features?: {
    badge?: string;
    title: string;
    subtitle?: string;
    items: { icon: any; title: string; description: string }[];
    columns?: 2 | 3 | 4;
    accentColor?: string;
  };
  featureWithImage?: {
    badge?: string;
    title: string;
    description: string;
    bulletPoints?: string[];
    image: string;
    imageRight?: boolean;
    cta?: { label: string; hash: string };
    accentColor?: string;
  };
  featureWithImage2?: {
    badge?: string;
    title: string;
    description: string;
    bulletPoints?: string[];
    image: string;
    imageRight?: boolean;
    cta?: { label: string; hash: string };
    accentColor?: string;
  };
  stats?: { value: string; label: string; suffix?: string }[];
  statsMeta?: { title?: string; subtitle?: string; dark?: boolean };
  testimonials?: { quote: string; author: string; role: string; company: string; rating?: number }[];
  testimonialTitle?: string;
  timeline?: { title?: string; subtitle?: string; steps: { title: string; description: string }[]; accentColor?: string };
  comparison?: { title?: string; subtitle?: string; rows: { feature: string; us: boolean | string; them: boolean | string }[] };
  faq?: { question: string; answer: string }[];
  faqTitle?: string;
  cta?: { title: string; description: string; primaryCta: { label: string; hash: string }; secondaryCta?: { label: string; hash: string }; dark?: boolean };
  logos?: string[];
  newsletter?: boolean;
  contact?: boolean;
  blog?: { title: string; excerpt: string; category: string; date: string; readTime: string; image: string }[];
  pricing?: { name: string; price: string; period?: string; description: string; features: string[]; cta: string; highlighted?: boolean }[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE DEFINITIONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const PAGE_CONTENT: Record<string, PageContent> = {

  /* ─── PLATFORM ────────────────────────────────────────────────��── */
  "platform-overview": {
    hero: {
      badge: "Platform",
      title: "The Complete Integration",
      highlight: "Intelligence OS",
      description: "IntegrateWise transforms how B2B SaaS teams connect, understand, and act on cross-tool data. Five architectural layers. One unified intelligence. Humans always in control.",
      primaryCta: { label: "Start Free", hash: "app" },
      secondaryCta: { label: "See Architecture", hash: "technical" },
      image: IMG.dashboard,
      layout: "split",
    },
    features: {
      badge: "Core Capabilities",
      title: "Everything You Need to End Fragmented Work",
      subtitle: "From connector setup to intelligent insights — every layer is designed for trust, transparency, and human control.",
      items: [
        { icon: Network, title: "Universal Connectors", description: "One-click OAuth setup for Salesforce, HubSpot, Zendesk, Stripe, Slack, Jira, and 6 more. New connectors added monthly." },
        { icon: Database, title: "Canonical Spine", description: "Single source of truth. Every entity normalized, deduplicated, and resolved across all connected tools. 99.4% match rate." },
        { icon: BrainCircuit, title: "Think Engine", description: "AI reasoning with session memory, edge correction, and dual-context scoring. Surfaces what matters, not just what changed." },
        { icon: ShieldCheck, title: "Governance Gates", description: "Every AI-suggested action requires human approval. Full audit trail, RBAC, and provenance tracking at every layer." },
        { icon: Activity, title: "Real-Time Intelligence", description: "1,247+ events processed per minute. Schema drift auto-detected and corrected. Data freshness under 2 minutes." },
        { icon: Layers, title: "Three-Plane Architecture", description: "Workspace, Connect, and System planes — each with strict boundaries but seamless context sharing." },
      ],
      columns: 3,
      accentColor: "#3F5185",
    },
    featureWithImage: {
      badge: "Normalize Once",
      title: "Normalize Once. Render Anywhere.",
      description: "Data enters the Spine once — from any connector, in any format — and is immediately available across every context mode, module, and intelligence layer.",
      bulletPoints: [
        "Cross-tool entity resolution with 99.4% accuracy",
        "Automatic schema inference and type mapping",
        "Real-time propagation to all downstream consumers",
        "Full provenance tracking from source to insight",
      ],
      image: IMG.dataUnify,
      imageRight: true,
      cta: { label: "Explore Architecture", hash: "technical" },
      accentColor: "#3F5185",
    },
    featureWithImage2: {
      badge: "Intelligence Loop",
      title: "Intelligence Is Not a Dashboard. It's a Loop.",
      description: "Traditional tools show you data. IntegrateWise reasons over it. Every cycle through Connect → Context → Cognition → Action → Memory → Correct → Repeat makes the system smarter.",
      bulletPoints: [
        "AI learns from every human approval and correction",
        "Pattern library grows with each interaction",
        "Goal alignment recalibrates based on outcomes",
        "Compound intelligence — value grows exponentially",
      ],
      image: IMG.aiVision,
      imageRight: false,
      cta: { label: "Learn About AI Pillars", hash: "connect" },
      accentColor: "#3F5185",
    },
    stats: [
      { value: "99.4", suffix: "%", label: "Entity Match Rate" },
      { value: "1,247", suffix: "+", label: "Events / Minute" },
      { value: "<2", suffix: "min", label: "Data Freshness" },
      { value: "12", suffix: "+", label: "Native Connectors" },
    ],
    statsMeta: { title: "Built for Enterprise Scale", dark: true },
    testimonials: SHARED_TESTIMONIALS,
    testimonialTitle: "What Teams Are Saying",
    faq: SHARED_FAQ,
    cta: {
      title: "Ready to Transform Your Integration Stack?",
      description: "Join hundreds of teams using IntegrateWise to unify data, surface intelligence, and drive outcomes.",
      primaryCta: { label: "Start Free Trial", hash: "app" },
      secondaryCta: { label: "Talk to Sales", hash: "contact" },
      dark: true,
    },
    logos: LOGOS,
  },

  features: {
    hero: {
      badge: "Features",
      title: "Every Feature Built for",
      highlight: "Trust & Transparency",
      description: "From intelligent insights to evidence-backed execution — every capability is designed with governance, human control, and full provenance at its core.",
      primaryCta: { label: "Try It Free", hash: "app" },
      secondaryCta: { label: "See Pricing", hash: "pricing" },
      image: IMG.workflow,
      layout: "center",
    },
    features: {
      badge: "Capabilities",
      title: "The Full IntegrateWise Feature Set",
      items: [
        { icon: BrainCircuit, title: "Contextual AI Chat", description: "Session-aware intelligence overlay with Think Engine integration. Ask questions in natural language, get evidence-backed answers." },
        { icon: FileText, title: "Evidence Drawer", description: "Every insight links back to source data with full provenance tracking. No black boxes. No hallucinations without citation." },
        { icon: Target, title: "Goal Alignment Engine", description: "Dual-context scoring measures both provider growth and client value. Every metric anchored to strategic objectives." },
        { icon: Activity, title: "Schema Health Monitor", description: "Real-time drift detection and auto-correction across all connected tools. 99.4% resolution accuracy." },
        { icon: Users, title: "10 Context Modes", description: "Switch between CS, Sales, Finance, Product, Engineering, Marketing, Exec, HR, Legal, and Ops — each with tailored views." },
        { icon: Layers, title: "Three-Plane Workspace", description: "Workspace for daily work, Connect for integration management, System for infrastructure — seamless context sharing." },
        { icon: RefreshCw, title: "Self-Healing Pipelines", description: "Automatic error recovery, retry logic, and drift correction. Integrations that fix themselves." },
        { icon: Lock, title: "Governance Gates", description: "Human-in-the-loop approval for every AI action. Nothing executes without sign-off." },
        { icon: Clock, title: "Real-Time Processing", description: "Sub-2-minute data freshness. 1,247+ events per minute throughput." },
      ],
      columns: 3,
      accentColor: "#3F5185",
    },
    featureWithImage: {
      badge: "Think Engine",
      title: "AI That Reasons, Not Just Reports",
      description: "The Think Engine combines session memory, edge correction, and organizational context to surface insights that matter — not just data that changed.",
      bulletPoints: [
        "Natural language queries with evidence-backed responses",
        "Dual-context scoring (Provider Growth + Client Value)",
        "Session memory that builds on prior conversations",
        "Confidence scoring for every AI output",
      ],
      image: IMG.aiVision,
      cta: { label: "See Cognition Pillar", hash: "cognition" },
      accentColor: "#3F5185",
    },
    featureWithImage2: {
      badge: "Evidence-Backed",
      title: "Every Insight Comes With Proof",
      description: "The Evidence Drawer provides one-click access to all supporting data, reasoning traces, and source citations for any AI-generated insight or recommendation.",
      bulletPoints: [
        "Full reasoning trace for every AI conclusion",
        "Source data links with timestamp and provenance",
        "Approval chain history for executed actions",
        "Outcome tracking to measure impact",
      ],
      image: IMG.compliance,
      imageRight: false,
      cta: { label: "Learn More", hash: "evidence-backed-executions" },
      accentColor: "#1E2A4A",
    },
    stats: [
      { value: "10", label: "Context Modes" },
      { value: "3", label: "Workspace Planes" },
      { value: "7", label: "AI Pillars" },
      { value: "98.2", suffix: "%", label: "AI Confidence" },
    ],
    comparison: {
      title: "IntegrateWise vs. Traditional iPaaS",
      subtitle: "More than data movement. Intelligence.",
      rows: [
        { feature: "Intelligent Workspace", us: true, them: false },
        { feature: "Living Truth Layer", us: true, them: false },
        { feature: "Human-in-the-Loop Governance", us: true, them: false },
        { feature: "Evidence-Backed Actions", us: true, them: false },
        { feature: "Goal Alignment Scoring", us: true, them: false },
        { feature: "Schema Drift Detection", us: "Auto-correct", them: "Manual" },
        { feature: "Entity Resolution", us: "99.4%", them: "~70%" },
        { feature: "Setup Time", us: "<15 min", them: "Days-Weeks" },
      ],
    },
    testimonials: SHARED_TESTIMONIALS.slice(0, 2),
    faq: SHARED_FAQ.slice(0, 4),
    cta: {
      title: "See Every Feature in Action",
      description: "Start with 3 free connectors. No credit card required.",
      primaryCta: { label: "Start Free", hash: "app" },
      secondaryCta: { label: "Request Demo", hash: "contact" },
      dark: true,
    },
  },

  security: {
    hero: {
      badge: "Security",
      title: "Enterprise-Grade Security,",
      highlight: "Built Into Every Layer",
      description: "RBAC, audit trails, encryption, governance gates, and compliance frameworks — security isn't an add-on, it's foundational.",
      primaryCta: { label: "View Documentation", hash: "documentation" },
      secondaryCta: { label: "Contact Security Team", hash: "contact" },
      image: IMG.security,
      layout: "split",
    },
    features: {
      badge: "Security Architecture",
      title: "Defense in Depth",
      items: [
        { icon: Lock, title: "Encryption Everywhere", description: "AES-256 at rest, TLS 1.3 in transit. Zero-trust architecture with certificate pinning." },
        { icon: Shield, title: "Role-Based Access Control", description: "Granular permissions across every plane and context mode. Attribute-based policies." },
        { icon: FileText, title: "Complete Audit Trail", description: "Every action, approval, data change, and AI suggestion logged with timestamp and actor." },
        { icon: ShieldCheck, title: "Governance Gates", description: "Human approval required for every AI-initiated action. No autonomous execution." },
        { icon: Eye, title: "Data Provenance", description: "Full lineage tracking from source connector to rendered insight. Know where every byte came from." },
        { icon: Scale, title: "Compliance Frameworks", description: "SOC 2 Type II ready. GDPR compliant. HIPAA-eligible architecture. Custom policy enforcement." },
      ],
      columns: 3,
      accentColor: "#1E2A4A",
    },
    stats: [
      { value: "SOC 2", label: "Type II Compliant" },
      { value: "GDPR", label: "Fully Compliant" },
      { value: "AES-256", label: "Encryption" },
      { value: "100", suffix: "%", label: "Audit Coverage" },
    ],
    statsMeta: { dark: true },
    faq: [
      { question: "Is IntegrateWise SOC 2 compliant?", answer: "Yes. IntegrateWise maintains SOC 2 Type II compliance with annual audits. Our security program covers all five trust service criteria: security, availability, processing integrity, confidentiality, and privacy." },
      { question: "How is data encrypted?", answer: "All data is encrypted at rest using AES-256 and in transit using TLS 1.3. We implement certificate pinning for all API communications and use hardware security modules (HSMs) for key management." },
      { question: "Can I control data residency?", answer: "Yes. IntegrateWise supports regional data residency configuration. You can specify where your data is processed and stored. We currently support US, EU, and APAC regions." },
      { question: "How does RBAC work?", answer: "Our RBAC system provides granular permissions at the plane level (Workspace/Connect/System), module level, and action level. You can define custom roles with attribute-based policies that control access to specific data, features, and AI capabilities." },
    ],
    cta: {
      title: "Security Questions? Let's Talk.",
      description: "Our security team is available for architecture reviews, compliance assessments, and custom security configurations.",
      primaryCta: { label: "Contact Security", hash: "contact" },
      dark: true,
    },
  },

  "enterprise-integration": {
    hero: {
      badge: "Enterprise",
      title: "At-Scale Integration for",
      highlight: "Enterprise Teams",
      description: "Connect your entire stack through a unified ingestion pipeline. CRM, support, billing, project management, and communication — all normalized, all intelligent.",
      primaryCta: { label: "Request Enterprise Demo", hash: "contact" },
      secondaryCta: { label: "See Connectors", hash: "platform-overview" },
      image: IMG.server,
      layout: "split",
    },
    features: {
      badge: "Connectors",
      title: "Native Integrations",
      subtitle: "One-click setup. Automatic schema mapping. Real-time sync.",
      items: [
        { icon: CloudLightning, title: "Salesforce", description: "Full CRM sync — accounts, contacts, opportunities, activities, and custom objects." },
        { icon: TrendingUp, title: "HubSpot", description: "Marketing, sales, and service hub data — contacts, deals, tickets, and workflows." },
        { icon: Headphones, title: "Zendesk", description: "Support tickets, customer satisfaction, agent performance, and SLA tracking." },
        { icon: BarChart3, title: "Stripe", description: "Billing, subscriptions, invoices, payments, and revenue analytics." },
        { icon: MessageSquare, title: "Slack", description: "Team communication, channel activity, and collaboration signals." },
        { icon: Code, title: "Jira", description: "Engineering workflow — issues, sprints, deployments, and velocity tracking." },
      ],
      columns: 3,
      accentColor: "#F54476",
    },
    stats: [
      { value: "12", suffix: "+", label: "Native Connectors" },
      { value: "99.4", suffix: "%", label: "Entity Match Rate" },
      { value: "<60", suffix: "s", label: "Setup Time" },
      { value: "1,247", suffix: "+", label: "Events/Minute" },
    ],
    statsMeta: { title: "Enterprise Scale, Consumer Simplicity", dark: true },
    timeline: {
      title: "Implementation in 4 Steps",
      subtitle: "From zero to intelligence in under two weeks.",
      steps: [
        { title: "Connect Your Tools", description: "OAuth-based one-click setup for each connector. Automatic schema discovery and field mapping." },
        { title: "Spine Calibration", description: "The Canonical Spine resolves entities across tools — matching accounts, contacts, and interactions with 99.4% accuracy." },
        { title: "Intelligence Training", description: "The Think Engine learns your business context — goals, metrics, team structure, and historical patterns." },
        { title: "Go Live", description: "Your team gets real-time intelligence, AI insights, and governance-gated actions from day one." },
      ],
    },
    logos: LOGOS,
    cta: {
      title: "Ready for Enterprise Integration?",
      description: "Talk to our enterprise team about custom connectors, SLAs, and dedicated support.",
      primaryCta: { label: "Contact Enterprise Sales", hash: "contact" },
      dark: true,
    },
  },

  /* ─── AI PILLARS ─────────────────────────────────────────────── */
  connect: {
    hero: {
      badge: "AI Pillar 1 of 7",
      title: "Connect — The Foundation of",
      highlight: "Integration Intelligence",
      description: "Connect your tools, ingest events, and establish the data pipeline that feeds everything above. One-click OAuth setup. Automatic schema discovery.",
      primaryCta: { label: "Start Connecting", hash: "app" },
      image: IMG.integration,
      layout: "split",
    },
    features: {
      badge: "Connect",
      title: "From Silos to Signal",
      items: [
        { icon: Link, title: "One-Click Connectors", description: "OAuth-based setup for major platforms in under 60 seconds. No code required." },
        { icon: Activity, title: "Event Stream", description: "Real-time event ingestion at 1,247+ events per minute with automatic deduplication." },
        { icon: Search, title: "Schema Discovery", description: "Automatic field mapping, type inference, and relationship detection." },
        { icon: Eye, title: "Health Monitoring", description: "Live sync status, error rates, and automatic recovery for every connector." },
      ],
      columns: 2,
      accentColor: "#F54476",
    },
    stats: [
      { value: "<60", suffix: "s", label: "Setup Time" },
      { value: "1,247", suffix: "+", label: "Events/Min" },
      { value: "99.9", suffix: "%", label: "Uptime SLA" },
      { value: "0", label: "Code Required" },
    ],
    cta: {
      title: "Next: Context",
      description: "Once connected, data flows into the Context layer where it's normalized into the Canonical Spine.",
      primaryCta: { label: "Explore Context", hash: "context" },
      secondaryCta: { label: "Back to All Pillars", hash: "platform-overview" },
      dark: true,
    },
  },

  context: {
    hero: {
      badge: "AI Pillar 2 of 7",
      title: "Context — The Single",
      highlight: "Source of Truth",
      description: "Transform raw data into structured truth. The Canonical Spine normalizes, deduplicates, and creates a unified entity model across all connected tools.",
      primaryCta: { label: "See the Spine", hash: "app" },
      image: IMG.dataUnify,
      layout: "split",
    },
    features: {
      badge: "Context",
      title: "From Chaos to Clarity",
      items: [
        { icon: Database, title: "Canonical Spine", description: "Single source of truth for every entity — accounts, contacts, interactions, and metrics." },
        { icon: Users, title: "Digital Twin", description: "Multi-source composite view of each customer, combining data from every connected tool." },
        { icon: GitBranch, title: "Entity Resolution", description: "Cross-tool matching with 99.4% accuracy using fuzzy matching, ML scoring, and human validation." },
        { icon: FileText, title: "Provenance Tracking", description: "Know exactly where every data point came from, when it arrived, and how it was transformed." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    stats: [
      { value: "99.4", suffix: "%", label: "Match Rate" },
      { value: "<2", suffix: "min", label: "Freshness" },
      { value: "100", suffix: "%", label: "Provenance" },
      { value: "1", label: "Source of Truth" },
    ],
    cta: {
      title: "Next: Cognition",
      description: "With structured truth in place, the Cognition layer reasons over it to surface intelligence.",
      primaryCta: { label: "Explore Cognition", hash: "cognition" },
      dark: true,
    },
  },

  cognition: {
    hero: {
      badge: "AI Pillar 3 of 7",
      title: "Cognition — AI That",
      highlight: "Reasons, Not Reports",
      description: "The Think Engine reasons over Spine data — detecting patterns, converging situations, and generating dual-context insights anchored to your strategic goals.",
      primaryCta: { label: "Try Think Engine", hash: "app" },
      image: IMG.aiVision,
      layout: "split",
    },
    features: {
      badge: "Cognition",
      title: "Intelligence, Not Just Information",
      items: [
        { icon: BrainCircuit, title: "Think Engine", description: "AI reasoning with session memory, edge correction, and organizational context." },
        { icon: Sparkles, title: "Situation Convergence", description: "Multi-signal analysis that surfaces what matters most — not just what changed." },
        { icon: Target, title: "Goal Alignment", description: "Every insight scored against strategic objectives with dual-context (Provider + Client) scoring." },
        { icon: BarChart3, title: "Confidence Scoring", description: "Transparent confidence levels for every AI output. Know exactly how certain the system is." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    cta: {
      title: "Next: Action",
      description: "Insights become actionable recommendations — but only through governed, human-approved execution.",
      primaryCta: { label: "Explore Action", hash: "action" },
      dark: true,
    },
  },

  action: {
    hero: {
      badge: "AI Pillar 4 of 7",
      title: "Action — Intelligence Becomes",
      highlight: "Governed Work",
      description: "AI suggests. Humans decide. Every recommended action passes through governance gates where team members review, modify, and approve before execution.",
      primaryCta: { label: "See It Work", hash: "app" },
      image: IMG.team,
      layout: "split",
    },
    features: {
      badge: "Action",
      title: "Human-Governed Execution",
      items: [
        { icon: CheckCircle2, title: "Approval Gates", description: "Every AI-suggested action requires human sign-off. No autonomous execution." },
        { icon: Workflow, title: "Task Queue", description: "Prioritized work items with full context, evidence, and reasoning attached." },
        { icon: FileText, title: "Execution Logging", description: "Complete audit trail for every action taken — who, what, when, and why." },
        { icon: Users, title: "Team Routing", description: "Actions automatically route to the right team member based on role and expertise." },
      ],
      columns: 2,
      accentColor: "#F54476",
    },
    cta: {
      title: "Next: Memory",
      description: "Executed actions feed into the Memory layer, teaching the system from every human decision.",
      primaryCta: { label: "Explore Memory", hash: "memory" },
      dark: true,
    },
  },

  memory: {
    hero: {
      badge: "AI Pillar 5 of 7",
      title: "Memory — The System",
      highlight: "Learns From You",
      description: "Every correction, preference, pattern, and outcome is encoded into organizational memory. The system gets smarter with every interaction.",
      primaryCta: { label: "Start Teaching", hash: "app" },
      image: IMG.strategy,
      layout: "split",
    },
    features: {
      badge: "Memory",
      title: "Compound Intelligence",
      items: [
        { icon: Brain, title: "Session Memory", description: "AI retains context within and across conversations, building on prior interactions." },
        { icon: BookOpen, title: "Pattern Library", description: "Learned patterns from approved actions, corrections, and outcomes." },
        { icon: RefreshCw, title: "Feedback Loop", description: "Every human decision — approve, reject, modify — teaches the system." },
        { icon: Globe, title: "Org Knowledge", description: "Accumulated team knowledge encoded into the intelligence layer." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    cta: {
      title: "Next: Correct",
      description: "Memory feeds the Correct layer — enabling self-healing data quality and edge case resolution.",
      primaryCta: { label: "Explore Correct", hash: "correct" },
      dark: true,
    },
  },

  correct: {
    hero: {
      badge: "AI Pillar 6 of 7",
      title: "Correct — Self-Healing",
      highlight: "Data Quality",
      description: "Automatic drift detection, schema correction, and edge case resolution. The system identifies issues and fixes them — or asks you to confirm when uncertain.",
      primaryCta: { label: "See Auto-Correction", hash: "app" },
      image: IMG.monitoring,
      layout: "split",
    },
    features: {
      badge: "Correct",
      title: "Data Quality, Automated",
      items: [
        { icon: Eye, title: "Schema Drift Detection", description: "Real-time monitoring for field changes, type mismatches, and structural shifts across all tools." },
        { icon: Wrench, title: "Auto-Correction", description: "Known drift patterns are automatically corrected with full audit logging." },
        { icon: BookOpen, title: "Edge Case Library", description: "Growing catalog of corrections and their contexts, improving accuracy over time." },
        { icon: Activity, title: "Health Scoring", description: "Continuous data quality assessment with per-connector and per-entity scoring." },
      ],
      columns: 2,
      accentColor: "#1E2A4A",
    },
    cta: {
      title: "Next: Repeat",
      description: "The intelligence loop closes — every cycle makes the system smarter.",
      primaryCta: { label: "Explore Repeat", hash: "repeat" },
      dark: true,
    },
  },

  repeat: {
    hero: {
      badge: "AI Pillar 7 of 7",
      title: "Repeat — The Loop",
      highlight: "Closes & Compounds",
      description: "Every cycle through the seven pillars makes the system smarter, faster, and more aligned with your goals. Intelligence is not a dashboard — it's a loop.",
      primaryCta: { label: "Start the Loop", hash: "app" },
      image: IMG.workflow,
      layout: "split",
    },
    features: {
      badge: "Repeat",
      title: "Exponential Value",
      items: [
        { icon: TrendingUp, title: "Continuous Learning", description: "Every interaction — approval, correction, query — improves future intelligence." },
        { icon: Target, title: "Goal Recalibration", description: "Strategic objectives automatically adjust based on measured outcomes." },
        { icon: BarChart3, title: "Performance Tracking", description: "Measure how intelligence quality, accuracy, and relevance improve over time." },
        { icon: Sparkles, title: "Compound Intelligence", description: "Value grows exponentially with each loop iteration. Month 6 is 10x month 1." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    stats: [
      { value: "10", suffix: "x", label: "Intelligence Growth (6mo)" },
      { value: "87", suffix: "%", label: "Accuracy Improvement" },
      { value: "34", suffix: "%", label: "Fewer Manual Tasks" },
      { value: "∞", label: "Compounding Value" },
    ],
    statsMeta: { dark: true },
    cta: {
      title: "Start Your Intelligence Loop Today",
      description: "The sooner you start, the smarter it gets. Begin with 3 free connectors.",
      primaryCta: { label: "Start Free", hash: "app" },
      secondaryCta: { label: "See All Pillars", hash: "platform-overview" },
      dark: true,
    },
  },

  /* ─── SOLUTIONS ────────────────────────────────────────────────── */
  solutions: {
    hero: {
      badge: "Solutions",
      title: "Integration Intelligence for",
      highlight: "Every Team",
      description: "Whether you're managing customer success, revenue operations, or compliance — IntegrateWise adapts to your workflow and delivers insights that matter.",
      primaryCta: { label: "Explore Use Cases", hash: "use-cases" },
      secondaryCta: { label: "See By Role", hash: "by-role" },
      image: IMG.customerMeeting,
      layout: "center",
    },
    features: {
      badge: "Use Cases",
      title: "Built for Real-World Challenges",
      items: [
        { icon: Users, title: "Customer Data Unification", description: "Single view of every customer across CRM, support, billing, and product usage." },
        { icon: BarChart3, title: "Automated RevOps & Billing", description: "Unified billing, usage, and pipeline insights with automatic reconciliation." },
        { icon: Eye, title: "Proactive Monitoring", description: "Catch integration failures before they impact customers with real-time alerts." },
        { icon: Rocket, title: "Zero-Disruption Upgrades", description: "Roll out connector updates and schema changes without downtime." },
        { icon: Scale, title: "AI Compliance Audit", description: "Evidence-backed compliance preparation with full data lineage." },
        { icon: BrainCircuit, title: "Contextual AI", description: "AI that understands your business context, not just your data." },
      ],
      columns: 3,
    },
    testimonials: SHARED_TESTIMONIALS,
    cta: {
      title: "See How Your Team Can Benefit",
      description: "Browse solutions by use case or by role to find the perfect fit.",
      primaryCta: { label: "Start Free", hash: "app" },
      secondaryCta: { label: "By Role", hash: "by-role" },
      dark: true,
    },
  },

  "use-cases": {
    hero: {
      badge: "Use Cases",
      title: "Real-World Applications of",
      highlight: "Integration Intelligence",
      description: "See how IntegrateWise solves the most common integration challenges facing modern B2B SaaS teams.",
      primaryCta: { label: "Start Free", hash: "app" },
    },
    features: {
      title: "Five Core Use Cases",
      items: [
        { icon: Users, title: "Customer Data Unification", description: "Merge customer data across Salesforce, HubSpot, Zendesk, and Stripe into one canonical view." },
        { icon: BarChart3, title: "Automated RevOps & Billing Sync", description: "Eliminate manual reconciliation between billing systems, CRM, and data warehouses." },
        { icon: Eye, title: "Proactive Integration Monitoring", description: "Real-time health monitoring with automatic drift detection and error recovery." },
        { icon: Rocket, title: "Zero-Disruption Upgrades", description: "Update connectors and schemas without downtime or data loss." },
        { icon: Scale, title: "AI-Assisted Compliance Audit", description: "Prepare for audits with AI-generated evidence trails and automated compliance checks." },
      ],
      columns: 3,
    },
    cta: {
      title: "Which Use Case Fits Your Team?",
      description: "Start with the use case that matters most. Add more as your intelligence loop matures.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "customer-data-unification": {
    hero: {
      badge: "Use Case",
      title: "Customer Data",
      highlight: "Unification",
      description: "Unify customer data across CRM, support, billing, and product usage into a single canonical entity. Automatically. In real time.",
      primaryCta: { label: "Start Unifying", hash: "app" },
      image: IMG.dataUnify,
      layout: "split",
    },
    featureWithImage: {
      badge: "The Problem",
      title: "Your Customer Data Lives in 6+ Tools",
      description: "The average B2B SaaS team uses 6-12 tools that each hold a different slice of the customer story. Without unification, you're flying blind.",
      bulletPoints: [
        "Salesforce has the deal data, but not the support tickets",
        "Zendesk has the complaints, but not the billing status",
        "Stripe has the revenue, but not the health score",
        "Your team wastes 12+ hours/week manually reconciling",
      ],
      image: IMG.strategy,
      accentColor: "#F54476",
    },
    featureWithImage2: {
      badge: "The Solution",
      title: "One Canonical Customer Entity",
      description: "IntegrateWise resolves every customer identity across all tools into a single Spine entity — with 99.4% match accuracy and full provenance tracking.",
      bulletPoints: [
        "Cross-tool entity resolution in real time",
        "Automatic conflict resolution for competing data",
        "Full history of every data change with source attribution",
        "Sub-2-minute data freshness across all tools",
      ],
      image: IMG.integration,
      imageRight: false,
      accentColor: "#3F5185",
    },
    stats: [
      { value: "99.4", suffix: "%", label: "Match Accuracy" },
      { value: "12", suffix: "hrs", label: "Weekly Time Saved" },
      { value: "6", suffix: "+", label: "Tools Unified" },
      { value: "<2", suffix: "min", label: "Data Freshness" },
    ],
    statsMeta: { dark: true },
    testimonials: [SHARED_TESTIMONIALS[0]],
    cta: {
      title: "Stop Reconciling. Start Understanding.",
      description: "Unify your customer data in under 15 minutes. No code required.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "automated-revops-billing-sync": {
    hero: {
      badge: "Use Case",
      title: "Automated RevOps &",
      highlight: "Billing Sync",
      description: "Connect Stripe, Salesforce, and your data warehouse to eliminate manual reconciliation and surface revenue insights in real time.",
      primaryCta: { label: "Automate RevOps", hash: "app" },
      image: IMG.revenue,
      layout: "split",
    },
    features: {
      title: "Revenue Intelligence, Automated",
      items: [
        { icon: BarChart3, title: "Billing Reconciliation", description: "Automatic matching of invoices, payments, and subscriptions across Stripe and your CRM." },
        { icon: TrendingUp, title: "Revenue Waterfall", description: "Real-time ARR, MRR, expansion, contraction, and churn tracking." },
        { icon: Eye, title: "Anomaly Detection", description: "AI-flagged discrepancies between billing systems, CRM, and actual usage." },
        { icon: Target, title: "Forecast Accuracy", description: "Intelligence-enhanced revenue forecasting with confidence intervals." },
      ],
      columns: 2,
      accentColor: "#1E2A4A",
    },
    stats: [
      { value: "94", suffix: "%", label: "Auto-Reconciliation" },
      { value: "8", suffix: "hrs", label: "Weekly Time Saved" },
      { value: "3.2", suffix: "%", label: "Forecast Improvement" },
      { value: "$0", label: "Revenue Leakage" },
    ],
    statsMeta: { dark: true },
    cta: {
      title: "Revenue Clarity, Automatically",
      description: "Never manually reconcile billing data again.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "proactive-integration-monitoring": {
    hero: {
      badge: "Use Case",
      title: "Proactive Integration",
      highlight: "Monitoring",
      description: "Real-time monitoring of every integration with automatic drift detection, error recovery, and health scoring. Catch issues before customers do.",
      primaryCta: { label: "Start Monitoring", hash: "app" },
      image: IMG.monitoring,
      layout: "split",
    },
    features: {
      title: "Self-Healing Integrations",
      items: [
        { icon: Activity, title: "Real-Time Health", description: "Live status dashboard for every connector and data flow." },
        { icon: Eye, title: "Drift Detection", description: "Automatic schema change detection with correction suggestions." },
        { icon: RefreshCw, title: "Error Recovery", description: "Self-healing pipelines that auto-retry, auto-correct, and self-report." },
        { icon: Mail, title: "Smart Alerts", description: "Notifications to the right team member at the right time." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    cta: {
      title: "Integrations That Monitor Themselves",
      description: "Stop checking dashboards. Let the system tell you when something needs attention.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "zero-disruption-integration-upgrades": {
    hero: {
      badge: "Use Case",
      title: "Zero-Disruption",
      highlight: "Integration Upgrades",
      description: "Roll out connector updates, schema changes, and new integrations without downtime, data loss, or broken workflows.",
      primaryCta: { label: "Upgrade Safely", hash: "app" },
      image: IMG.developer,
      layout: "split",
    },
    timeline: {
      title: "How It Works",
      steps: [
        { title: "Impact Analysis", description: "Preview downstream effects before any change goes live." },
        { title: "Blue-Green Deployment", description: "New connector version runs alongside the old one." },
        { title: "Schema Migration", description: "Automatic field mapping handles structural changes." },
        { title: "Validation & Cutover", description: "Data integrity verified before switching traffic." },
        { title: "Instant Rollback", description: "One-click rollback if any issue is detected." },
      ],
    },
    cta: {
      title: "Upgrade Without Fear",
      description: "Never break a working integration again.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "ai-assisted-compliance-audit": {
    hero: {
      badge: "Use Case",
      title: "AI-Assisted",
      highlight: "Compliance Audit",
      description: "Prepare for audits with AI-generated evidence trails, automated compliance checks, and full data provenance. SOC 2, GDPR, and custom frameworks.",
      primaryCta: { label: "Start Audit Prep", hash: "app" },
      image: IMG.compliance,
      layout: "split",
    },
    features: {
      title: "Compliance, Automated",
      items: [
        { icon: FileText, title: "Audit Trail Generator", description: "Automatic evidence collection for compliance frameworks." },
        { icon: Shield, title: "Policy Enforcement", description: "Real-time checking against your compliance policies." },
        { icon: Search, title: "Data Lineage", description: "Full provenance tracking from source to action." },
        { icon: BookOpen, title: "Report Builder", description: "One-click compliance reports for SOC 2, GDPR, and more." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    cta: {
      title: "Audit-Ready in Days, Not Months",
      description: "Let AI prepare your compliance evidence while you focus on your business.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  /* ─── FEATURES (detailed) ─────────────────────────────────────── */
  "contextual-ai": {
    hero: {
      badge: "Feature",
      title: "Contextual AI That",
      highlight: "Understands Your Business",
      description: "Not generic AI. Intelligence that reasons with full organizational context — goals, relationships, historical patterns, and team dynamics.",
      primaryCta: { label: "Try It Free", hash: "app" },
      image: IMG.aiVision,
      layout: "split",
    },
    features: {
      title: "How Contextual AI Works",
      items: [
        { icon: BrainCircuit, title: "Org-Aware Reasoning", description: "AI understands your team structure, goals, and priorities before generating insights." },
        { icon: Target, title: "Dual-Context Scoring", description: "Every insight scored from both provider growth and client value perspectives." },
        { icon: Brain, title: "Session Memory", description: "Conversations build on prior context. Ask follow-ups that reference earlier insights." },
        { icon: FileText, title: "Evidence Citations", description: "Every claim links back to source data. No hallucinations without attribution." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    cta: {
      title: "AI That Gets Smarter With Every Conversation",
      description: "Start a conversation with your data today.",
      primaryCta: { label: "Launch Think Engine", hash: "app" },
      dark: true,
    },
  },

  "human-approved-actions": {
    hero: {
      badge: "Feature",
      title: "AI Suggests.",
      highlight: "Humans Decide.",
      description: "Every AI-generated action goes through a governance gate. Team members review context, modify parameters, and approve before execution. Full control. Full transparency.",
      primaryCta: { label: "See Governance", hash: "app" },
      image: IMG.team,
      layout: "split",
    },
    features: {
      title: "Governance-First AI",
      items: [
        { icon: CheckCircle2, title: "Approval Queue", description: "Prioritized list of AI suggestions with full context cards." },
        { icon: FileText, title: "Evidence Attached", description: "Every suggestion includes reasoning, data sources, and confidence level." },
        { icon: Wrench, title: "Modify Before Approve", description: "Adjust parameters, add notes, or redirect to a different team member." },
        { icon: Users, title: "Delegation Rules", description: "Configure who approves what — by type, severity, or department." },
      ],
      columns: 2,
      accentColor: "#1E2A4A",
    },
    cta: {
      title: "Control Without Complexity",
      description: "Governance that empowers teams, not slows them down.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "evidence-backed-executions": {
    hero: {
      badge: "Feature",
      title: "Every Action Has a",
      highlight: "Paper Trail",
      description: "Nothing happens without evidence. Every execution links back to the data, reasoning, and approval that triggered it. Full provenance. Full accountability.",
      primaryCta: { label: "See Evidence Drawer", hash: "app" },
      image: IMG.compliance,
      layout: "split",
    },
    features: {
      title: "Transparency at Every Step",
      items: [
        { icon: FileText, title: "Evidence Drawer", description: "One-click access to all supporting data for any action or insight." },
        { icon: Search, title: "Reasoning Trace", description: "See exactly how the AI reached its conclusion — step by step." },
        { icon: Users, title: "Approval Chain", description: "Full history of who approved what, when, and with what modifications." },
        { icon: TrendingUp, title: "Outcome Tracking", description: "Measure the actual impact of every executed action over time." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    cta: {
      title: "Trust Through Transparency",
      description: "AI you can verify. Actions you can audit. Results you can measure.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "three-worlds-in-one-sync": {
    hero: {
      badge: "Feature",
      title: "Three Worlds,",
      highlight: "One Sync",
      description: "A three-plane architecture that separates where you work (Workspace), how you connect (Connect), and what runs underneath (System) — all in perfect sync.",
      primaryCta: { label: "Explore Architecture", hash: "technical" },
      image: IMG.server,
      layout: "split",
    },
    features: {
      title: "Three Planes, Zero Friction",
      items: [
        { icon: Briefcase, title: "Workspace Plane", description: "Where teams do daily work — dashboards, tasks, intelligence feed, and AI chat." },
        { icon: Network, title: "Connect Plane", description: "Where integrations are managed, monitored, configured, and health-checked." },
        { icon: Server, title: "System Plane", description: "Where the Canonical Spine, Think Engine, and infrastructure operate." },
        { icon: Layers, title: "Unified Context", description: "Switch between planes without losing context. Data flows seamlessly across boundaries." },
      ],
      columns: 2,
      accentColor: "#F54476",
    },
    cta: {
      title: "One Platform. Three Perspectives. Perfect Sync.",
      description: "See how the three-plane architecture transforms team collaboration.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  /* ─── BY ROLE ──────────────────────────────────────────────────── */
  "by-role": {
    hero: {
      badge: "By Role",
      title: "Built for",
      highlight: "Every Team",
      description: "IntegrateWise adapts to the unique needs of each role — from customer success managers to developers to executives. Same platform, different superpowers.",
      primaryCta: { label: "Find Your Role", hash: "csm" },
    },
    features: {
      title: "Choose Your Perspective",
      items: [
        { icon: Users, title: "Customer Success", description: "Proactive health monitoring, renewal intelligence, and expansion signal detection." },
        { icon: BarChart3, title: "Revenue Operations", description: "Unified pipeline, billing sync, forecasting, and revenue intelligence." },
        { icon: Briefcase, title: "Founders & Executives", description: "Strategic goal alignment, board metrics, and cross-functional visibility." },
        { icon: Wrench, title: "Operations", description: "Workflow automation, data quality, and capacity planning." },
        { icon: ShieldCheck, title: "IT Admin & Security", description: "RBAC, audit dashboards, schema governance, and compliance reporting." },
        { icon: Rocket, title: "Freelancers", description: "Client management, time intelligence, and invoice integration." },
        { icon: GraduationCap, title: "Students", description: "Free tier access, learning paths, and sandbox environment." },
      ],
      columns: 3,
    },
    cta: {
      title: "Your Role, Your Intelligence",
      description: "Every team member sees the insights most relevant to their work.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  csm: {
    hero: {
      badge: "Customer Success",
      title: "Proactive, Data-Driven",
      highlight: "Customer Success",
      description: "Monitor health scores, detect churn risk, and surface expansion signals — all from a unified view of every customer across all connected tools.",
      primaryCta: { label: "Start Free", hash: "app" },
      image: IMG.professional,
      layout: "split",
    },
    features: {
      title: "CS Intelligence Suite",
      items: [
        { icon: Activity, title: "Health Score Dashboard", description: "Real-time composite health combining usage, sentiment, support, and engagement signals." },
        { icon: Eye, title: "Churn Prediction", description: "AI-flagged accounts at risk with actionable recommendations and evidence." },
        { icon: TrendingUp, title: "Expansion Signals", description: "Detect upsell opportunities from product usage patterns and engagement trends." },
        { icon: Calendar, title: "Renewal Intelligence", description: "Automated renewal preparation with full account context and risk assessment." },
      ],
      columns: 2,
      accentColor: "#1E2A4A",
    },
    featureWithImage: {
      badge: "CS Workflows",
      title: "Your Day, Supercharged",
      description: "IntegrateWise transforms the CSM workflow from reactive firefighting to proactive intelligence. Know what's happening before your customers tell you.",
      bulletPoints: [
        "Daily intelligence briefing with prioritized accounts",
        "Champion monitoring across email, product, and support",
        "Automated health trend analysis with alert triggers",
        "One-click account summary for any meeting",
      ],
      image: IMG.customerMeeting,
      accentColor: "#1E2A4A",
    },
    testimonials: [SHARED_TESTIMONIALS[1]],
    cta: {
      title: "CSMs Love IntegrateWise",
      description: "Spend less time in spreadsheets. More time with customers.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "revops-role": {
    hero: {
      badge: "Revenue Operations",
      title: "Revenue Intelligence",
      highlight: "at Your Fingertips",
      description: "Unify your revenue stack — CRM, billing, usage, and pipeline — into a single intelligent operating system. No more manual reconciliation.",
      primaryCta: { label: "Automate RevOps", hash: "app" },
      image: IMG.revenue,
      layout: "split",
    },
    features: {
      title: "RevOps Intelligence Suite",
      items: [
        { icon: TrendingUp, title: "Pipeline Intelligence", description: "AI-enhanced forecasting with cross-source validation and confidence scoring." },
        { icon: BarChart3, title: "Billing Reconciliation", description: "Automated matching across Stripe, Salesforce, and your data warehouse." },
        { icon: Activity, title: "Revenue Waterfall", description: "Real-time ARR tracking with expansion, contraction, and churn visibility." },
        { icon: Workflow, title: "Quote-to-Cash", description: "End-to-end visibility from opportunity creation to invoice collection." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    testimonials: [SHARED_TESTIMONIALS[0]],
    cta: {
      title: "Revenue Clarity, Automatically",
      description: "12 hours of weekly reconciliation → 0. Start today.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "founders-executives": {
    hero: {
      badge: "Leadership",
      title: "Strategic Visibility,",
      highlight: "Zero Noise",
      description: "Board-ready metrics, goal alignment tracking, and cross-functional intelligence — without the manual data wrangling. See what matters in seconds.",
      primaryCta: { label: "See Executive View", hash: "app" },
      image: IMG.presentation,
      layout: "split",
    },
    features: {
      title: "Executive Intelligence",
      items: [
        { icon: Target, title: "Goal Alignment", description: "Real-time tracking of strategic objectives across all teams and departments." },
        { icon: BarChart3, title: "Board Metrics", description: "ARR, NRR, health scores, pipeline coverage — always current, never stale." },
        { icon: Users, title: "Cross-Functional View", description: "See how CS, Sales, Engineering, and Marketing metrics interconnect." },
        { icon: Sparkles, title: "Intelligence Briefing", description: "AI-curated daily summary of what matters most — alerts, opportunities, risks." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    testimonials: [SHARED_TESTIMONIALS[2]],
    cta: {
      title: "Lead with Intelligence, Not Spreadsheets",
      description: "The executive view your board will love.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  operations: {
    hero: {
      badge: "Operations",
      title: "Operational Excellence,",
      highlight: "Automated",
      description: "Streamline workflows, monitor integration health, ensure data quality, and surface process improvements — all powered by contextual AI.",
      primaryCta: { label: "Optimize Operations", hash: "app" },
      image: IMG.automation,
      layout: "split",
    },
    features: {
      title: "Operations Intelligence",
      items: [
        { icon: Workflow, title: "Workflow Automation", description: "AI-suggested workflows with human approval gates. Automate the repetitive." },
        { icon: Activity, title: "Data Quality", description: "Continuous monitoring and correction of data integrity across all systems." },
        { icon: Search, title: "Process Mining", description: "Discover bottlenecks and optimization opportunities from operational data." },
        { icon: BarChart3, title: "Capacity Planning", description: "Forecast operational load based on growth trends and seasonal patterns." },
      ],
      columns: 2,
      accentColor: "#F54476",
    },
    cta: {
      title: "Operations That Run Themselves",
      description: "Focus on strategy. Let IntegrateWise handle the plumbing.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  "it-admin-security": {
    hero: {
      badge: "IT & Security",
      title: "Governance Without",
      highlight: "the Overhead",
      description: "RBAC, audit trails, schema enforcement, compliance reporting — built into every layer. Control everything without slowing anyone down.",
      primaryCta: { label: "See Security Features", hash: "security" },
      image: IMG.security,
      layout: "split",
    },
    features: {
      title: "Admin & Security Suite",
      items: [
        { icon: Shield, title: "RBAC Management", description: "Granular permissions across every plane, module, and action. Custom role definitions." },
        { icon: FileText, title: "Audit Dashboard", description: "Complete log of every action, approval, and data change. Searchable and exportable." },
        { icon: Database, title: "Schema Governance", description: "Enforce field standards and naming conventions across all connected tools." },
        { icon: Scale, title: "Compliance Reports", description: "One-click SOC 2, GDPR, and custom compliance reports with evidence attachment." },
      ],
      columns: 2,
      accentColor: "#1E2A4A",
    },
    cta: {
      title: "Security That Enables, Not Blocks",
      description: "Give your team powerful tools with the guardrails to use them safely.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  freelancers: {
    hero: {
      badge: "Freelancers",
      title: "Enterprise Intelligence,",
      highlight: "Solo Scale",
      description: "Connect your client tools, track project health, and surface insights — without the enterprise price tag. Get running in 5 minutes.",
      primaryCta: { label: "Start Free", hash: "app" },
      image: IMG.laptop,
      layout: "split",
    },
    features: {
      title: "Freelancer Toolkit",
      items: [
        { icon: Users, title: "Client Dashboard", description: "Unified view of every client's data, project status, and health signals." },
        { icon: Clock, title: "Time Intelligence", description: "AI-suggested time allocation based on project health and deadlines." },
        { icon: BarChart3, title: "Invoice Integration", description: "Connect Stripe and invoicing tools for automatic revenue tracking." },
        { icon: Rocket, title: "Quick Setup", description: "Full onboarding in under 5 minutes with guided connector setup." },
      ],
      columns: 2,
      accentColor: "#F54476",
    },
    pricing: [
      { name: "Solo", price: "Free", description: "Perfect for getting started", features: ["3 connectors", "1,000 events/month", "Basic AI insights", "Email support"], cta: "Start Free" },
      { name: "Pro", price: "$29", period: "month", description: "For serious freelancers", features: ["6 connectors", "10,000 events/month", "Full Think Engine", "Priority support", "Client reporting"], cta: "Start Pro", highlighted: true },
    ],
    cta: {
      title: "Professional Intelligence, Freelancer Price",
      description: "Start free. Upgrade when you're ready.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  students: {
    hero: {
      badge: "Students",
      title: "Learn Integration",
      highlight: "Intelligence",
      description: "Free tier access to learn how modern B2B SaaS teams manage data, integrations, and AI-driven operations. Build real skills for real careers.",
      primaryCta: { label: "Start Learning", hash: "app" },
      image: IMG.learning,
      layout: "split",
    },
    features: {
      title: "Student Resources",
      items: [
        { icon: Rocket, title: "Free Tier", description: "Full platform access with 3 connectors and 1,000 events/month. No credit card." },
        { icon: BookOpen, title: "Learning Paths", description: "Guided tutorials on integration architecture, data management, and AI reasoning." },
        { icon: Code, title: "Sandbox Environment", description: "Safe space to experiment with connectors, data flows, and AI intelligence." },
        { icon: GraduationCap, title: "Certification", description: "Earn IntegrateWise certification for your portfolio and resume." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    timeline: {
      title: "Your Learning Path",
      steps: [
        { title: "Sign Up Free", description: "Create your account and access the student sandbox." },
        { title: "Connect Sample Tools", description: "Use our demo connectors to simulate real integrations." },
        { title: "Explore the Spine", description: "See how data normalizes into a canonical entity model." },
        { title: "Ask the Think Engine", description: "Try natural language queries and see AI reasoning in action." },
        { title: "Get Certified", description: "Complete the learning path and earn your certification." },
      ],
    },
    cta: {
      title: "Your Integration Career Starts Here",
      description: "Free forever for students. No credit card required.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  /* ─── RESOURCES ────────────────────────────────────────────────── */
  blog: {
    hero: {
      badge: "Blog",
      title: "Insights on",
      highlight: "Integration Intelligence",
      description: "Articles, case studies, and thought leadership on integration intelligence, data architecture, and B2B SaaS operations.",
    },
    blog: [
      { title: "Why Integration Intelligence Will Replace iPaaS", excerpt: "The evolution from data pipes to intelligent operating systems — and what it means for B2B SaaS teams.", category: "Thought Leadership", date: "Feb 8, 2026", readTime: "8 min", image: IMG.gradient },
      { title: "Building a Canonical Data Spine: Architecture Deep Dive", excerpt: "How we designed a single source of truth that resolves entities across 12+ tools with 99.4% accuracy.", category: "Technical", date: "Feb 5, 2026", readTime: "12 min", image: IMG.dataUnify },
      { title: "How TechServe Saved 12 Hours/Week with Data Unification", excerpt: "A customer story about eliminating manual reconciliation and discovering hidden revenue opportunities.", category: "Case Study", date: "Feb 1, 2026", readTime: "6 min", image: IMG.customerMeeting },
      { title: "From Fragments to Flow: How IntegrateWise Works", excerpt: "Truth, Context, Intelligence, Control — the four layers that turn scattered tools into a living workspace.", category: "Product", date: "Jan 28, 2026", readTime: "10 min", image: IMG.integration },
      { title: "Human-in-the-Loop: Why AI Governance Matters", excerpt: "Why every AI action should require human approval — and how IntegrateWise makes governance seamless.", category: "Governance", date: "Jan 24, 2026", readTime: "7 min", image: IMG.team },
      { title: "Schema Drift: The Silent Killer of Integrations", excerpt: "How automatic schema change detection prevents data quality degradation across your tool stack.", category: "Technical", date: "Jan 20, 2026", readTime: "9 min", image: IMG.monitoring },
    ],
    newsletter: true,
  },

  newsletter: {
    hero: {
      badge: "Newsletter",
      title: "Stay in the",
      highlight: "Intelligence Loop",
      description: "Weekly insights on integration intelligence, product updates, and best practices delivered to your inbox. Join 2,400+ subscribers.",
    },
    newsletter: true,
    testimonials: [
      { quote: "The IntegrateWise newsletter is the most concise, actionable integration content I read each week. No fluff.", author: "David Kim", role: "VP Engineering", company: "SeriesTech", rating: 5 },
    ],
  },

  resources: {
    hero: {
      badge: "Resources",
      title: "Everything You Need to",
      highlight: "Master IntegrateWise",
      description: "Guides, documentation, webinars, and case studies to help you get the most out of integration intelligence.",
    },
    features: {
      title: "Resource Categories",
      items: [
        { icon: BookOpen, title: "Guides", description: "Step-by-step walkthroughs for setup, configuration, and best practices." },
        { icon: FileText, title: "Documentation", description: "Complete technical reference, API guides, and SDK documentation." },
        { icon: Globe, title: "Webinars", description: "Live and recorded sessions on architecture, AI, and operations." },
        { icon: BarChart3, title: "Case Studies", description: "Real results from real teams using IntegrateWise." },
        { icon: Mail, title: "Newsletter", description: "Weekly digest of insights, updates, and community picks." },
        { icon: Headphones, title: "Support", description: "Knowledge base, community forums, and direct support channels." },
      ],
      columns: 3,
    },
  },

  guides: {
    hero: {
      badge: "Guides",
      title: "Step-by-Step",
      highlight: "Walkthroughs",
      description: "Comprehensive guides for setting up, configuring, and extracting maximum value from IntegrateWise. From getting started to advanced automation.",
      primaryCta: { label: "Start with Setup Guide", hash: "documentation" },
    },
    timeline: {
      title: "Recommended Reading Order",
      steps: [
        { title: "Getting Started (15 min)", description: "Account setup, first connector, and your initial Spine calibration." },
        { title: "Connector Deep Dives (30 min each)", description: "Detailed guides for Salesforce, HubSpot, Zendesk, Stripe, and more." },
        { title: "Intelligence Configuration (20 min)", description: "Set up goals, configure context modes, and calibrate the Think Engine." },
        { title: "Team Onboarding (15 min)", description: "Invite team members, set up RBAC, and configure approval workflows." },
        { title: "Advanced Automation (30 min)", description: "Custom rules, workflow triggers, and API integrations." },
      ],
    },
  },

  webinars: {
    hero: {
      badge: "Webinars",
      title: "Learn From the",
      highlight: "Integration Experts",
      description: "Live and recorded sessions covering integration architecture, AI reasoning, governance best practices, and operational strategies.",
    },
    blog: [
      { title: "Live Demo: The Five-Layer Architecture", excerpt: "Walk through every layer of IntegrateWise with our CTO. Live Q&A included.", category: "Live Demo", date: "Feb 15, 2026", readTime: "45 min", image: IMG.server },
      { title: "Workshop: Building Your First Intelligence Loop", excerpt: "Hands-on session where you'll connect 3 tools and get your first AI insight.", category: "Workshop", date: "Feb 12, 2026", readTime: "60 min", image: IMG.integration },
      { title: "Panel: The Future of B2B Integration", excerpt: "Industry leaders discuss where integration intelligence is headed.", category: "Panel", date: "Feb 8, 2026", readTime: "50 min", image: IMG.presentation },
    ],
  },

  documentation: {
    hero: {
      badge: "Documentation",
      title: "Technical",
      highlight: "Reference",
      description: "Complete API reference, SDK guides, architectural documentation, and integration specifications for developers and technical teams.",
      primaryCta: { label: "API Reference", hash: "documentation" },
      secondaryCta: { label: "Architecture Docs", hash: "technical" },
    },
    features: {
      title: "Documentation Sections",
      items: [
        { icon: Code, title: "API Reference", description: "REST and GraphQL endpoints with request/response examples and authentication guides." },
        { icon: Puzzle, title: "SDK Guides", description: "Client libraries for JavaScript, Python, Go, and Ruby with quickstart examples." },
        { icon: Layers, title: "Architecture Docs", description: "Deep dive into the five-layer system design, data flow, and intelligence pipeline." },
        { icon: RefreshCw, title: "Changelog", description: "Complete version history, breaking changes, and migration guides." },
        { icon: Network, title: "Connector Specs", description: "Detailed specs for each native connector — fields, events, and configuration." },
        { icon: ShieldCheck, title: "Security Docs", description: "Authentication, authorization, encryption, and compliance documentation." },
      ],
      columns: 3,
      accentColor: "#3F5185",
    },
  },

  "case-studies": {
    hero: {
      badge: "Case Studies",
      title: "Real Results from",
      highlight: "Real Teams",
      description: "See how companies across industries use IntegrateWise to unify their data, reduce churn, grow revenue, and scale integration intelligence.",
    },
    blog: [
      { title: "TechServe: 12 Hours/Week Saved with Data Unification", excerpt: "How a growing SaaS company eliminated manual reconciliation and discovered $280K in expansion opportunities.", category: "Enterprise", date: "Jan 2026", readTime: "8 min", image: IMG.dataUnify },
      { title: "CloudBridge: $420K Renewal Saved by AI Churn Detection", excerpt: "The Think Engine detected a champion going silent — 12 days before the team noticed.", category: "Customer Success", date: "Dec 2025", readTime: "6 min", image: IMG.customerMeeting },
      { title: "DataVault: Dual-Lens Scoring Transforms Revenue Ops", excerpt: "How dual-context goal alignment changed the way this enterprise manages growth and client value simultaneously.", category: "RevOps", date: "Nov 2025", readTime: "10 min", image: IMG.revenue },
    ],
    testimonials: SHARED_TESTIMONIALS,
    cta: {
      title: "Your Success Story Starts Here",
      description: "Join hundreds of teams already using IntegrateWise.",
      primaryCta: { label: "Start Free", hash: "app" },
      dark: true,
    },
  },

  contact: {
    hero: {
      badge: "Contact",
      title: "Let's Build Something",
      highlight: "Intelligent Together",
      description: "Questions about IntegrateWise? Our team is here — whether you're exploring, implementing, or scaling. We respond within 24 hours.",
    },
    contact: true,
    faq: SHARED_FAQ.slice(0, 3),
  },

  legal: {
    hero: {
      badge: "Legal",
      title: "Terms, Privacy &",
      highlight: "Compliance",
      description: "Our commitment to transparency, data protection, and regulatory compliance. Your trust is the foundation of everything we build.",
    },
    features: {
      title: "Legal Documents",
      items: [
        { icon: FileText, title: "Privacy Policy", description: "How we collect, use, store, and protect your personal and business data." },
        { icon: Scale, title: "Terms of Service", description: "The agreement governing your use of the IntegrateWise platform and services." },
        { icon: Shield, title: "Cookie Policy", description: "How we use cookies, analytics, and similar technologies on our website." },
        { icon: Lock, title: "Data Processing Agreement", description: "GDPR-compliant DPA for enterprise customers processing EU personal data." },
        { icon: ShieldCheck, title: "Security Whitepaper", description: "Technical overview of our security architecture, certifications, and practices." },
        { icon: Globe, title: "Acceptable Use Policy", description: "Guidelines for responsible use of IntegrateWise services and API." },
      ],
      columns: 3,
      accentColor: "#3F5185",
    },
  },

  support: {
    hero: {
      badge: "Support",
      title: "We're Here to",
      highlight: "Help",
      description: "Documentation, community forums, and direct support — get answers fast. Enterprise customers get priority access to our engineering team.",
      primaryCta: { label: "Search Knowledge Base", hash: "documentation" },
      secondaryCta: { label: "Contact Support", hash: "contact" },
    },
    features: {
      title: "Support Channels",
      items: [
        { icon: BookOpen, title: "Knowledge Base", description: "Searchable library of how-tos, troubleshooting guides, and best practices." },
        { icon: MessageSquare, title: "Community Forum", description: "Ask questions, share solutions, and connect with other IntegrateWise users." },
        { icon: Headphones, title: "Priority Support", description: "Direct access to our engineering team for enterprise customers. <4 hour response." },
        { icon: Activity, title: "Status Page", description: "Real-time system status, uptime monitoring, and incident history." },
      ],
      columns: 2,
      accentColor: "#1E2A4A",
    },
    faq: SHARED_FAQ,
    contact: true,
  },

  /* ─── CAREERS ──────────────────────────────────────────────────── */
  careers: {
    hero: {
      badge: "Careers",
      title: "Build the Future of",
      highlight: "Integration Intelligence",
      description: "We're a small, intense team of engineers, designers, and domain experts building a new category of software. If you believe integrations deserve intelligence — not just plumbing — we want to talk.",
      primaryCta: { label: "See Open Roles", hash: "contact" },
      image: IMG.office,
      layout: "split",
    },
    features: {
      badge: "Why IntegrateWise",
      title: "What Makes Us Different",
      items: [
        { icon: Rocket, title: "Category Creation", description: "We're not building another iPaaS. We're defining Integration Intelligence as a new software category." },
        { icon: Brain, title: "Hard Problems", description: "Entity resolution, AI reasoning, schema drift, governance — intellectually stimulating engineering." },
        { icon: Users, title: "Small Team, Big Impact", description: "Every team member has outsized impact. No layers of management between you and the product." },
        { icon: Globe, title: "Remote-First", description: "San Francisco + Bangalore with full flexibility. We care about output, not office hours." },
      ],
      columns: 2,
      accentColor: "#3F5185",
    },
    stats: [
      { value: "2", label: "Offices (SF + BLR)" },
      { value: "100", suffix: "%", label: "Remote Flexible" },
      { value: "0", label: "Bureaucracy Layers" },
      { value: "∞", label: "Growth Potential" },
    ],
    statsMeta: { title: "The Team in Numbers", dark: true },
    timeline: {
      title: "Our Hiring Process",
      subtitle: "Transparent, respectful, and fast. We respect your time.",
      steps: [
        { title: "Application Review (2 days)", description: "We read every application. No resume screening bots. A human reviews your work." },
        { title: "Intro Call (30 min)", description: "Casual conversation about your experience, interests, and what you're looking for." },
        { title: "Technical Deep Dive (60 min)", description: "Real-world problem relevant to our domain. No whiteboard tricks or gotcha questions." },
        { title: "Team Meet (45 min)", description: "Meet 2-3 team members you'd work with. Ask anything. Culture fit goes both ways." },
        { title: "Offer (1-2 days)", description: "Fast decisions. Competitive comp. We don't play games with offers." },
      ],
    },
    contact: true,
    cta: {
      title: "Don't See Your Role Listed?",
      description: "We're always looking for exceptional people. Send us a note and tell us what you'd build.",
      primaryCta: { label: "Reach Out", hash: "contact" },
      dark: true,
    },
  },

  /* ─── BLOG POST (individual article page) ─────────────────────── */
  "blog-post": {
    hero: {
      badge: "Blog · Thought Leadership",
      title: "Why Integration Intelligence Will",
      highlight: "Replace iPaaS",
      description: "The evolution from simple data pipes to intelligent operating systems — and what it means for the future of B2B SaaS teams. Traditional iPaaS tools move data. Integration intelligence understands it.",
      image: IMG.gradient,
      layout: "split",
    },
    featureWithImage: {
      badge: "The Problem",
      title: "Data Pipes Are Not Enough",
      description: "For a decade, integration meant moving data from point A to point B. Zapier, Workato, MuleSoft — they're plumbing tools. They connect endpoints but create no intelligence. Your CRM syncs with your support tool, but neither system gets smarter from the connection.",
      bulletPoints: [
        "Traditional iPaaS has zero contextual understanding of business meaning",
        "Data moves but is never normalized, reasoned over, or learned from",
        "Teams still manually reconcile and interpret cross-tool signals",
        "Schema changes in one tool silently break downstream workflows",
      ],
      image: IMG.server,
      accentColor: "#F54476",
    },
    featureWithImage2: {
      badge: "The Solution",
      title: "Integration Intelligence: A New Category",
      description: "Integration Intelligence doesn't just sync — it normalizes data into a canonical truth layer (the Spine), reasons over it with AI (the Think Engine), and surfaces actionable insights through governed, human-approved execution. Every cycle makes the system smarter.",
      bulletPoints: [
        "Canonical Spine creates a single source of truth across all tools",
        "Think Engine reasons with organizational context, not just data",
        "Every AI suggestion requires human approval before execution",
        "Self-healing pipelines detect and correct drift automatically",
      ],
      image: IMG.aiVision,
      imageRight: false,
      accentColor: "#3F5185",
    },
    stats: [
      { value: "12", suffix: "hrs", label: "Weekly Time Saved" },
      { value: "99.4", suffix: "%", label: "Entity Match Rate" },
      { value: "87", suffix: "%", label: "Accuracy Improvement" },
      { value: "10", suffix: "x", label: "Intelligence Growth" },
    ],
    statsMeta: { title: "The Numbers Tell the Story", dark: true },
    testimonials: SHARED_TESTIMONIALS,
    testimonialTitle: "Teams Already Making the Switch",
    cta: {
      title: "Ready to Move Beyond iPaaS?",
      description: "Start with 3 free connectors. Experience integration intelligence in under 15 minutes.",
      primaryCta: { label: "Start Free", hash: "app" },
      secondaryCta: { label: "Read More Articles", hash: "blog" },
      dark: true,
    },
  },
};
