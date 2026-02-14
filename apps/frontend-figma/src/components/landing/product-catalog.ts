/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║  PRODUCT CATALOG — Single Source of Truth for all SKUs & Pricing       ║
 * ║                                                                        ║
 * ║  Structured for:                                                       ║
 * ║  • React rendering in the current app                                  ║
 * ║  • Webflow CMS migration (flat, serializable, no circular refs)        ║
 * ║  • Stripe/payment integration (SKU IDs map to Stripe Price IDs)        ║
 * ║  • Analytics tracking (SKU-based event properties)                     ║
 * ║                                                                        ║
 * ║  Naming: IW-{TIER}-{VARIANT}                                          ║
 * ║  Example: IW-PRO-M149 = Professional, Monthly, $149                   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

export type BillingCycle = "monthly" | "annual" | "custom" | "free";
export type TierSlug = "starter" | "growth" | "professional" | "enterprise";
export type AddOnSlug =
  | "extra-connectors"
  | "extra-events"
  | "extra-users"
  | "api-access"
  | "sso-saml"
  | "premium-sla"
  | "dedicated-support"
  | "custom-integration"
  | "data-residency"
  | "security-review";

export interface PricingTier {
  /** Unique SKU identifier */
  sku: string;
  /** URL-safe slug */
  slug: TierSlug;
  /** Display name */
  name: string;
  /** One-line tagline */
  tagline: string;
  /** Full description (2-3 sentences) */
  description: string;
  /** Monthly price per user in USD (0 = free, -1 = custom/contact) */
  priceMonthly: number;
  /** Annual price per user in USD (billed annually, -1 = custom) */
  priceAnnual: number;
  /** Annual savings as a formatted string */
  annualSavings?: string;
  /** Billing label shown under price */
  billingLabel: string;
  /** Whether this tier is highlighted/recommended */
  highlighted: boolean;
  /** Badge text shown on highlighted tier */
  badge?: string;
  /** CTA button text */
  ctaLabel: string;
  /** CTA destination hash */
  ctaHash: string;
  /** Ordered feature list for the pricing card */
  features: string[];
  /** Usage limits */
  limits: {
    connectors: number | "unlimited";
    eventsPerMonth: number | "unlimited";
    users: number | "unlimited";
    dataRetentionDays: number | "unlimited";
    contextModes: number | "all";
    workspacePlanes: string[];
  };
  /** Feature matrix (for comparison table) */
  featureMatrix: Record<string, boolean | string>;
  /** Stripe Price ID placeholder (to be filled when Stripe is connected) */
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
  /** Sort order */
  sortOrder: number;
  /** Webflow CMS metadata */
  webflow?: {
    collectionId?: string;
    itemId?: string;
    lastPublished?: string;
  };
}

export interface AddOn {
  /** Unique SKU */
  sku: string;
  /** URL-safe slug */
  slug: AddOnSlug;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Price (monthly, one-time, or per-unit) */
  price: number;
  /** Pricing unit */
  unit: string;
  /** Billing cycle */
  billingCycle: BillingCycle;
  /** Which tiers can add this */
  availableFor: TierSlug[];
  /** Whether it's included in a higher tier */
  includedIn?: TierSlug[];
  /** CTA label */
  ctaLabel: string;
  /** Sort order */
  sortOrder: number;
  /** Category for grouping */
  category: "capacity" | "security" | "support" | "integration";
}

export interface FeatureComparisonRow {
  /** Feature name */
  feature: string;
  /** Category for grouping */
  category: string;
  /** Value per tier */
  starter: boolean | string;
  growth: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
  /** Tooltip text */
  tooltip?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRICING TIERS
   ═══════════════════════════════════════════════════════════════════════════ */

export const PRICING_TIERS: PricingTier[] = [
  {
    sku: "IW-STR-FREE",
    slug: "starter",
    name: "Starter",
    tagline: "Get started for free",
    description: "Perfect for small teams exploring integration intelligence. Connect up to 3 tools and experience intelligent insights with no commitment.",
    priceMonthly: 0,
    priceAnnual: 0,
    billingLabel: "Free forever",
    highlighted: false,
    ctaLabel: "Start Free",
    ctaHash: "app",
    features: [
      "3 connectors",
      "1,000 events/month",
      "2 team members",
      "Basic AI insights",
      "Community support",
      "7-day data retention",
    ],
    limits: {
      connectors: 3,
      eventsPerMonth: 1000,
      users: 2,
      dataRetentionDays: 7,
      contextModes: 2,
      workspacePlanes: ["Workspace"],
    },
    featureMatrix: {
      "Connectors": "3",
      "Events/month": "1,000",
      "Team members": "2",
      "Canonical Spine": true,
      "Entity resolution": "Basic",
      "Think Engine": "Basic",
      "Dual-context scoring": false,
      "Session memory": false,
      "Governance gates": false,
      "RBAC": false,
      "Audit trail": false,
      "Schema health monitoring": false,
      "Self-healing pipelines": false,
      "Custom context modes": false,
      "API access": false,
      "SSO/SAML": false,
      "Data residency": false,
      "Compliance reports": false,
      "Dedicated CSM": false,
      "SLA": "Community",
      "Support": "Community",
      "Data retention": "7 days",
    },
    sortOrder: 1,
  },
  {
    sku: "IW-GRO-M049",
    slug: "growth",
    name: "Growth",
    tagline: "Scale your intelligence",
    description: "For growing teams that need deeper AI insights, more connectors, and schema monitoring. Includes dual-context scoring and basic governance.",
    priceMonthly: 49,
    priceAnnual: 39,
    annualSavings: "Save $120/yr per user",
    billingLabel: "per user / month",
    highlighted: false,
    ctaLabel: "Start 14-Day Trial",
    ctaHash: "app",
    features: [
      "10 connectors",
      "25,000 events/month",
      "Up to 15 team members",
      "Full Think Engine",
      "Dual-context scoring",
      "Schema health monitoring",
      "Basic RBAC",
      "Email + chat support",
      "90-day data retention",
    ],
    limits: {
      connectors: 10,
      eventsPerMonth: 25000,
      users: 15,
      dataRetentionDays: 90,
      contextModes: 5,
      workspacePlanes: ["Workspace", "Connect"],
    },
    featureMatrix: {
      "Connectors": "10",
      "Events/month": "25,000",
      "Team members": "Up to 15",
      "Canonical Spine": true,
      "Entity resolution": "99.4%",
      "Think Engine": "Full",
      "Dual-context scoring": true,
      "Session memory": true,
      "Governance gates": "Basic",
      "RBAC": "Basic",
      "Audit trail": "30 days",
      "Schema health monitoring": true,
      "Self-healing pipelines": false,
      "Custom context modes": false,
      "API access": false,
      "SSO/SAML": false,
      "Data residency": false,
      "Compliance reports": false,
      "Dedicated CSM": false,
      "SLA": "99.5%",
      "Support": "Email + Chat",
      "Data retention": "90 days",
    },
    stripePriceIdMonthly: "price_growth_monthly_placeholder",
    stripePriceIdAnnual: "price_growth_annual_placeholder",
    sortOrder: 2,
  },
  {
    sku: "IW-PRO-M149",
    slug: "professional",
    name: "Professional",
    tagline: "Full intelligence, full control",
    description: "Unlimited connectors, the complete 7-pillar intelligence loop, advanced governance gates, API access, and compliance-ready audit trails. Built for serious teams.",
    priceMonthly: 149,
    priceAnnual: 119,
    annualSavings: "Save $360/yr per user",
    billingLabel: "per user / month",
    highlighted: true,
    badge: "Most Popular",
    ctaLabel: "Start 14-Day Trial",
    ctaHash: "app",
    features: [
      "Unlimited connectors",
      "200,000 events/month",
      "Unlimited team members",
      "Complete 7-pillar intelligence loop",
      "Advanced governance gates",
      "Full RBAC + approval workflows",
      "Compliance reports (SOC 2, GDPR)",
      "API access",
      "Priority support (4hr response)",
      "Custom context modes",
      "Self-healing pipelines",
      "1-year data retention",
    ],
    limits: {
      connectors: "unlimited",
      eventsPerMonth: 200000,
      users: "unlimited",
      dataRetentionDays: 365,
      contextModes: "all",
      workspacePlanes: ["Workspace", "Connect", "System"],
    },
    featureMatrix: {
      "Connectors": "Unlimited",
      "Events/month": "200,000",
      "Team members": "Unlimited",
      "Canonical Spine": true,
      "Entity resolution": "99.4%",
      "Think Engine": "Full + Memory",
      "Dual-context scoring": true,
      "Session memory": true,
      "Governance gates": "Advanced",
      "RBAC": "Advanced + Policies",
      "Audit trail": "1 year",
      "Schema health monitoring": true,
      "Self-healing pipelines": true,
      "Custom context modes": true,
      "API access": true,
      "SSO/SAML": false,
      "Data residency": false,
      "Compliance reports": true,
      "Dedicated CSM": false,
      "SLA": "99.9%",
      "Support": "Priority (4hr)",
      "Data retention": "1 year",
    },
    stripePriceIdMonthly: "price_pro_monthly_placeholder",
    stripePriceIdAnnual: "price_pro_annual_placeholder",
    sortOrder: 3,
  },
  {
    sku: "IW-ENT-CUST",
    slug: "enterprise",
    name: "Enterprise",
    tagline: "Custom-built for your org",
    description: "Everything in Professional, plus private cloud deployment, custom ML models, SAML/SSO, dedicated CSM, white-glove onboarding, and custom SLAs. For organizations that need maximum control.",
    priceMonthly: -1,
    priceAnnual: -1,
    billingLabel: "Custom pricing",
    highlighted: false,
    ctaLabel: "Contact Sales",
    ctaHash: "contact",
    features: [
      "Everything in Professional",
      "Private cloud deployment",
      "Custom ML model training",
      "SAML / SSO / SCIM",
      "Dedicated Customer Success Manager",
      "White-glove onboarding (< 2 weeks)",
      "Custom SLA (up to 99.99%)",
      "Data residency controls",
      "Custom connector development",
      "Unlimited data retention",
      "Security review + DPA",
      "Quarterly business reviews",
    ],
    limits: {
      connectors: "unlimited",
      eventsPerMonth: "unlimited",
      users: "unlimited",
      dataRetentionDays: "unlimited",
      contextModes: "all",
      workspacePlanes: ["Workspace", "Connect", "System"],
    },
    featureMatrix: {
      "Connectors": "Unlimited",
      "Events/month": "Unlimited",
      "Team members": "Unlimited",
      "Canonical Spine": true,
      "Entity resolution": "99.4% + Custom",
      "Think Engine": "Full + Custom Models",
      "Dual-context scoring": true,
      "Session memory": true,
      "Governance gates": "Advanced + Custom",
      "RBAC": "Enterprise + SCIM",
      "Audit trail": "Unlimited",
      "Schema health monitoring": true,
      "Self-healing pipelines": true,
      "Custom context modes": true,
      "API access": true,
      "SSO/SAML": true,
      "Data residency": true,
      "Compliance reports": true,
      "Dedicated CSM": true,
      "SLA": "Up to 99.99%",
      "Support": "Dedicated (1hr)",
      "Data retention": "Unlimited",
    },
    sortOrder: 4,
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   ADD-ONS
   ═══════════════════════════════════════════════════════════════════════════ */

export const ADD_ONS: AddOn[] = [
  {
    sku: "IW-ADD-CONN5",
    slug: "extra-connectors",
    name: "Additional Connectors",
    description: "Add 5 more native connectors to your plan. Includes auto-schema discovery and health monitoring.",
    price: 29,
    unit: "per 5 connectors / month",
    billingCycle: "monthly",
    availableFor: ["growth"],
    includedIn: ["professional", "enterprise"],
    ctaLabel: "Add Connectors",
    sortOrder: 1,
    category: "capacity",
  },
  {
    sku: "IW-ADD-EVT50K",
    slug: "extra-events",
    name: "Additional Events",
    description: "Add 50,000 extra events per month. Events include any data change, sync, or API call across connected tools.",
    price: 39,
    unit: "per 50K events / month",
    billingCycle: "monthly",
    availableFor: ["growth", "professional"],
    includedIn: ["enterprise"],
    ctaLabel: "Add Events",
    sortOrder: 2,
    category: "capacity",
  },
  {
    sku: "IW-ADD-USR10",
    slug: "extra-users",
    name: "Additional Users",
    description: "Add 10 more team members to your Growth plan. Each user gets full access to their configured context modes.",
    price: 19,
    unit: "per 10 users / month",
    billingCycle: "monthly",
    availableFor: ["growth"],
    includedIn: ["professional", "enterprise"],
    ctaLabel: "Add Users",
    sortOrder: 3,
    category: "capacity",
  },
  {
    sku: "IW-ADD-API",
    slug: "api-access",
    name: "API Access",
    description: "Full REST and GraphQL API access for custom integrations, data export, and webhook configuration.",
    price: 49,
    unit: "per month",
    billingCycle: "monthly",
    availableFor: ["growth"],
    includedIn: ["professional", "enterprise"],
    ctaLabel: "Enable API",
    sortOrder: 4,
    category: "integration",
  },
  {
    sku: "IW-ADD-SSO",
    slug: "sso-saml",
    name: "SSO / SAML",
    description: "Enterprise single sign-on with SAML 2.0, SCIM provisioning, and directory sync (Okta, Azure AD, Google Workspace).",
    price: 99,
    unit: "per month (flat)",
    billingCycle: "monthly",
    availableFor: ["professional"],
    includedIn: ["enterprise"],
    ctaLabel: "Enable SSO",
    sortOrder: 5,
    category: "security",
  },
  {
    sku: "IW-ADD-SLA99",
    slug: "premium-sla",
    name: "Premium SLA",
    description: "Upgrade to 99.99% uptime SLA with guaranteed 1-hour response time and dedicated incident channel.",
    price: 199,
    unit: "per month (flat)",
    billingCycle: "monthly",
    availableFor: ["professional"],
    includedIn: ["enterprise"],
    ctaLabel: "Upgrade SLA",
    sortOrder: 6,
    category: "support",
  },
  {
    sku: "IW-ADD-DEDSUP",
    slug: "dedicated-support",
    name: "Dedicated Support",
    description: "Named support engineer with Slack channel access, weekly syncs, and proactive monitoring of your instance.",
    price: 299,
    unit: "per month (flat)",
    billingCycle: "monthly",
    availableFor: ["professional"],
    includedIn: ["enterprise"],
    ctaLabel: "Add Support",
    sortOrder: 7,
    category: "support",
  },
  {
    sku: "IW-ADD-CUSTINT",
    slug: "custom-integration",
    name: "Custom Connector Build",
    description: "We'll build a custom connector for any tool not in our native catalog. Includes schema mapping, testing, and documentation.",
    price: 2500,
    unit: "one-time per connector",
    billingCycle: "custom",
    availableFor: ["professional", "enterprise"],
    ctaLabel: "Request Build",
    sortOrder: 8,
    category: "integration",
  },
  {
    sku: "IW-ADD-DATARES",
    slug: "data-residency",
    name: "Data Residency",
    description: "Choose where your data is processed and stored. Currently available in US, EU, and APAC regions.",
    price: 149,
    unit: "per month (flat)",
    billingCycle: "monthly",
    availableFor: ["professional"],
    includedIn: ["enterprise"],
    ctaLabel: "Configure Region",
    sortOrder: 9,
    category: "security",
  },
  {
    sku: "IW-ADD-SECREV",
    slug: "security-review",
    name: "Security Review & DPA",
    description: "Comprehensive security architecture review, custom DPA, and vendor risk assessment documentation for your compliance team.",
    price: 500,
    unit: "one-time",
    billingCycle: "custom",
    availableFor: ["professional", "enterprise"],
    ctaLabel: "Request Review",
    sortOrder: 10,
    category: "security",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   FEATURE COMPARISON MATRIX
   ═══════════════════════════════════════════════════════════════════════════ */

export const FEATURE_COMPARISON: FeatureComparisonRow[] = [
  // ── Capacity ──
  { feature: "Native Connectors", category: "Capacity", starter: "3", growth: "10", professional: "Unlimited", enterprise: "Unlimited", tooltip: "Number of third-party tools you can connect" },
  { feature: "Events / Month", category: "Capacity", starter: "1,000", growth: "25,000", professional: "200,000", enterprise: "Unlimited", tooltip: "Data changes, syncs, and API calls processed" },
  { feature: "Team Members", category: "Capacity", starter: "2", growth: "Up to 15", professional: "Unlimited", enterprise: "Unlimited" },
  { feature: "Data Retention", category: "Capacity", starter: "7 days", growth: "90 days", professional: "1 year", enterprise: "Unlimited" },
  { feature: "Context Modes", category: "Capacity", starter: "2", growth: "5", professional: "All 10", enterprise: "All 10 + Custom" },
  { feature: "Workspace Planes", category: "Capacity", starter: "Workspace", growth: "Workspace + Connect", professional: "All 3", enterprise: "All 3" },

  // ── Intelligence ──
  { feature: "Canonical Spine", category: "Intelligence", starter: true, growth: true, professional: true, enterprise: true, tooltip: "Unified entity model across all connected tools" },
  { feature: "Entity Resolution", category: "Intelligence", starter: "Basic", growth: "99.4%", professional: "99.4%", enterprise: "99.4% + Custom", tooltip: "Cross-tool identity matching accuracy" },
  { feature: "Think Engine", category: "Intelligence", starter: "Basic", growth: "Full", professional: "Full + Memory", enterprise: "Full + Custom Models" },
  { feature: "Dual-Context Scoring", category: "Intelligence", starter: false, growth: true, professional: true, enterprise: true, tooltip: "Provider Growth + Client Value scoring" },
  { feature: "Session Memory", category: "Intelligence", starter: false, growth: true, professional: true, enterprise: true, tooltip: "AI retains context across conversations" },
  { feature: "Self-Healing Pipelines", category: "Intelligence", starter: false, growth: false, professional: true, enterprise: true, tooltip: "Automatic error recovery and schema drift correction" },
  { feature: "Custom ML Models", category: "Intelligence", starter: false, growth: false, professional: false, enterprise: true },

  // ── Governance ──
  { feature: "Governance Gates", category: "Governance", starter: false, growth: "Basic", professional: "Advanced", enterprise: "Advanced + Custom", tooltip: "Human approval for AI-suggested actions" },
  { feature: "RBAC", category: "Governance", starter: false, growth: "Basic", professional: "Advanced + Policies", enterprise: "Enterprise + SCIM" },
  { feature: "Audit Trail", category: "Governance", starter: false, growth: "30 days", professional: "1 year", enterprise: "Unlimited" },
  { feature: "Compliance Reports", category: "Governance", starter: false, growth: false, professional: true, enterprise: true, tooltip: "SOC 2, GDPR, and custom compliance reports" },
  { feature: "Schema Health Monitoring", category: "Governance", starter: false, growth: true, professional: true, enterprise: true },

  // ── Integration ──
  { feature: "API Access", category: "Integration", starter: false, growth: false, professional: true, enterprise: true, tooltip: "REST + GraphQL API for custom integrations" },
  { feature: "SSO / SAML", category: "Integration", starter: false, growth: false, professional: "Add-on", enterprise: true },
  { feature: "Data Residency", category: "Integration", starter: false, growth: false, professional: "Add-on", enterprise: true, tooltip: "Choose US, EU, or APAC data regions" },
  { feature: "Custom Connectors", category: "Integration", starter: false, growth: false, professional: "Add-on", enterprise: true },

  // ── Support ──
  { feature: "Support Channel", category: "Support", starter: "Community", growth: "Email + Chat", professional: "Priority (4hr)", enterprise: "Dedicated (1hr)" },
  { feature: "Uptime SLA", category: "Support", starter: false, growth: "99.5%", professional: "99.9%", enterprise: "Up to 99.99%" },
  { feature: "Dedicated CSM", category: "Support", starter: false, growth: false, professional: false, enterprise: true },
  { feature: "Quarterly Business Reviews", category: "Support", starter: false, growth: false, professional: false, enterprise: true },
  { feature: "White-Glove Onboarding", category: "Support", starter: false, growth: false, professional: false, enterprise: true },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PRICING FAQ
   ═══════════════════════════════════════════════════════════════════════════ */

export const PRICING_FAQ = [
  {
    question: "Can I switch plans at any time?",
    answer: "Yes. You can upgrade, downgrade, or cancel at any time. When upgrading, you'll be prorated for the remainder of your billing cycle. When downgrading, the change takes effect at the start of your next billing period.",
  },
  {
    question: "What counts as an 'event'?",
    answer: "An event is any data change, sync operation, or API call processed through IntegrateWise. This includes: new records created in connected tools, field updates, deletions, webhook triggers, and Spine recalculations. Schema health checks and internal AI processing do not count toward your event limit.",
  },
  {
    question: "Is there a free trial of paid plans?",
    answer: "Yes. Growth and Professional plans include a 14-day free trial with full feature access. No credit card required to start. At the end of the trial, you can choose to subscribe or your account reverts to the Starter plan.",
  },
  {
    question: "Do you offer annual billing discounts?",
    answer: "Yes. Annual billing saves approximately 20% compared to monthly billing. Growth: $39/user/month (vs. $49). Professional: $119/user/month (vs. $149). Annual plans are billed as a single payment for the year.",
  },
  {
    question: "What happens when I exceed my event limit?",
    answer: "We don't cut off your integrations mid-month. If you approach 90% of your event limit, we'll notify you via email and in-app alert. If you exceed the limit, events continue processing for 48 hours while you upgrade or purchase an events add-on. After 48 hours, new events are queued (not lost) until the next billing cycle.",
  },
  {
    question: "Can I add connectors without upgrading?",
    answer: "Growth plan users can purchase additional connector packs (5 connectors for $29/month). Professional and Enterprise plans include unlimited connectors — no add-on needed.",
  },
  {
    question: "Is there a discount for nonprofits or education?",
    answer: "Yes. We offer 50% off Growth and Professional plans for verified nonprofits, educational institutions, and open-source projects. Students get free Starter access with extended limits. Contact us to apply.",
  },
  {
    question: "How does per-user pricing work?",
    answer: "You're billed for each team member who has an active account. Team members can be added or removed at any time. Inactive accounts (no login for 60+ days) can be suspended without charge. The Starter plan includes 2 users; Growth includes up to 15; Professional and Enterprise are unlimited.",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/** Get a tier by slug */
export function getTier(slug: TierSlug): PricingTier | undefined {
  return PRICING_TIERS.find(t => t.slug === slug);
}

/** Get a tier by SKU */
export function getTierBySku(sku: string): PricingTier | undefined {
  return PRICING_TIERS.find(t => t.sku === sku);
}

/** Get add-ons available for a specific tier */
export function getAddOnsForTier(tierSlug: TierSlug): AddOn[] {
  return ADD_ONS.filter(a => a.availableFor.includes(tierSlug));
}

/** Get add-ons by category */
export function getAddOnsByCategory(category: AddOn["category"]): AddOn[] {
  return ADD_ONS.filter(a => a.category === category);
}

/** Get feature comparison rows by category */
export function getComparisonByCategory(category: string): FeatureComparisonRow[] {
  return FEATURE_COMPARISON.filter(r => r.category === category);
}

/** Get all unique categories from the comparison matrix */
export function getComparisonCategories(): string[] {
  return [...new Set(FEATURE_COMPARISON.map(r => r.category))];
}

/** Format price for display */
export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  if (price < 0) return "Custom";
  return `$${price}`;
}

/** Calculate annual total for a given monthly price and user count */
export function calculateAnnualTotal(priceAnnual: number, users: number): number {
  return priceAnnual * users * 12;
}