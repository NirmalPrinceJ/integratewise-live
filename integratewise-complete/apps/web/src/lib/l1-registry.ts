export type L1Page = {
  id: string
  path: string
  title: string
  description: string
  category: "core" | "business" | "intelligence" | "admin" | "cs" | "onboarding"
  view: "executive" | "manager" | "team" | "analyst" | "admin" | "all"
  icon: string
  stageId?: string
}

// Complete L1 Workspace Catalog
export const L1_WORKSPACE: L1Page[] = [
  // Core Work Pages
  {
    id: "today",
    path: "/today",
    title: "Today",
    description: "Daily dashboard with priorities",
    category: "core",
    view: "all",
    icon: "Home",
    stageId: "TODAY-011",
  },
  {
    id: "tasks",
    path: "/tasks",
    title: "Tasks",
    description: "Task management & kanban",
    category: "core",
    view: "all",
    icon: "CheckSquare",
    stageId: "TASKS-012",
  },
  {
    id: "goals",
    path: "/goals",
    title: "Goals",
    description: "OKRs and goal tracking",
    category: "core",
    view: "all",
    icon: "Target",
    stageId: "GOALS-015",
  },
  {
    id: "metrics",
    path: "/metrics",
    title: "Metrics",
    description: "KPI dashboard and analytics",
    category: "core",
    view: "all",
    icon: "BarChart3",
    stageId: "METRICS-016",
  },
  {
    id: "settings",
    path: "/settings",
    title: "Settings",
    description: "App configuration",
    category: "core",
    view: "all",
    icon: "Settings",
    stageId: "SETTINGS-020",
  },

  // Intelligence Pages
  {
    id: "iq-hub",
    path: "/iq-hub",
    title: "IQ Hub",
    description: "AI agent orchestration",
    category: "intelligence",
    view: "all",
    icon: "Lightbulb",
    stageId: "IQHUB-008",
  },
  {
    id: "spine",
    path: "/spine",
    title: "Spine",
    description: "Single source of truth",
    category: "intelligence",
    view: "all",
    icon: "Database",
    stageId: "SPINE-009",
  },
  {
    id: "shadow",
    path: "/shadow",
    title: "Shadow",
    description: "AI clone assistant",
    category: "intelligence",
    view: "all",
    icon: "Sparkles",
    stageId: "IQCLONE-010",
  },
  {
    id: "insights",
    path: "/insights",
    title: "Insights",
    description: "AI analytics and insights",
    category: "intelligence",
    view: "all",
    icon: "Sparkles",
    stageId: "INSIGHTS-013",
  },
  {
    id: "knowledge",
    path: "/knowledge",
    title: "Knowledge",
    description: "Knowledge bank inbox",
    category: "intelligence",
    view: "all",
    icon: "BookOpen",
    stageId: "KNOWLEDGE-014",
  },
  {
    id: "brainstorming",
    path: "/brainstorming",
    title: "Brainstorming",
    description: "AI-powered ideation",
    category: "intelligence",
    view: "all",
    icon: "Lightbulb",
    stageId: "BRAINSTORM",
  },
  {
    id: "loader",
    path: "/loader",
    title: "Loader",
    description: "Data import and loader",
    category: "intelligence",
    view: "all",
    icon: "Database",
    stageId: "LOADER",
  },
  {
    id: "integrations",
    path: "/integrations",
    title: "Integrations",
    description: "Connected services",
    category: "intelligence",
    view: "all",
    icon: "Link2",
    stageId: "INTEGRATIONS-017",
  },

  // Business Pages
  {
    id: "clients",
    path: "/business/clients",
    title: "Clients",
    description: "Client management",
    category: "business",
    view: "all",
    icon: "Building2",
    stageId: "BUSINESS-018",
  },
  {
    id: "products",
    path: "/business/products",
    title: "Products",
    description: "Product catalog",
    category: "business",
    view: "all",
    icon: "Package",
    stageId: "BUSINESS-018",
  },
  {
    id: "services",
    path: "/business/services",
    title: "Services",
    description: "Service offerings",
    category: "business",
    view: "all",
    icon: "Briefcase",
    stageId: "BUSINESS-018",
  },
  {
    id: "website",
    path: "/business/website",
    title: "Website",
    description: "Website manager",
    category: "business",
    view: "all",
    icon: "Globe",
    stageId: "BUSINESS-018",
  },
  {
    id: "leads",
    path: "/business/crm/leads",
    title: "Leads",
    description: "Lead management",
    category: "business",
    view: "all",
    icon: "Users",
    stageId: "BUSINESS-018",
  },
  {
    id: "pipeline",
    path: "/business/crm/pipeline",
    title: "Pipeline",
    description: "Sales pipeline",
    category: "business",
    view: "all",
    icon: "TrendingUp",
    stageId: "BUSINESS-018",
  },
  {
    id: "content",
    path: "/business/marketing/content",
    title: "Content",
    description: "Marketing content library",
    category: "business",
    view: "all",
    icon: "FileText",
    stageId: "BUSINESS-018",
  },

  // Customer Success Pages
  {
    id: "cs-health",
    path: "/cs/health",
    title: "Health Scores",
    description: "Customer health monitoring",
    category: "cs",
    view: "all",
    icon: "Activity",
    stageId: "CS-019",
  },

  // Admin Pages
  {
    id: "admin-users",
    path: "/admin/users",
    title: "Users",
    description: "User management",
    category: "admin",
    view: "admin",
    icon: "UserCog",
    stageId: "USERADMIN-021",
  },
  {
    id: "admin-billing",
    path: "/admin/billing",
    title: "Billing",
    description: "Subscription and billing",
    category: "admin",
    view: "admin",
    icon: "CreditCard",
    stageId: "BILLING-023",
  },
  {
    id: "admin-audit",
    path: "/admin/audit",
    title: "Audit",
    description: "Audit logs and history",
    category: "admin",
    view: "admin",
    icon: "FileText",
    stageId: "AUDIT-029",
  },

  // KB Pages (Special)
  {
    id: "bridge",
    path: "/bridge",
    title: "Bridge",
    description: "5-step workflow wizard",
    category: "intelligence",
    view: "all",
    icon: "Zap",
    stageId: "BRIDGE",
  },
  {
    id: "think",
    path: "/think",
    title: "Think",
    description: "Topic boards kanban",
    category: "intelligence",
    view: "all",
    icon: "Lightbulb",
    stageId: "THINK",
  },
  {
    id: "evidence",
    path: "/evidence",
    title: "Evidence",
    description: "Autonomy evidence timeline",
    category: "intelligence",
    view: "all",
    icon: "Activity",
    stageId: "EVIDENCE",
  },
  {
    id: "search",
    path: "/search",
    title: "Search",
    description: "Discovery search",
    category: "intelligence",
    view: "all",
    icon: "Search",
    stageId: "SEARCH",
  },
  {
    id: "context",
    path: "/context",
    title: "Context",
    description: "Context store browser",
    category: "intelligence",
    view: "all",
    icon: "Database",
    stageId: "CONTEXT",
  },

  // Onboarding
  {
    id: "welcome",
    path: "/welcome",
    title: "Welcome",
    description: "Onboarding wizard",
    category: "onboarding",
    view: "all",
    icon: "Sparkles",
    stageId: "ONBOARDING",
  },
  {
    id: "onboarding",
    path: "/onboarding",
    title: "Setup",
    description: "Capability checklist",
    category: "onboarding",
    view: "all",
    icon: "CheckSquare",
    stageId: "ONBOARDING-L0",
  },

  // System Pages
  {
    id: "system-health",
    path: "/system-health",
    title: "System Health",
    description: "L3 observability dashboard",
    category: "admin",
    view: "admin",
    icon: "Activity",
    stageId: "MONITORING-028",
  },
  {
    id: "governance",
    path: "/governance",
    title: "Governance",
    description: "P0 policy console",
    category: "admin",
    view: "admin",
    icon: "Shield",
    stageId: "GOVERN-P0",
  },
]

// Helper functions
export function getL1Page(id: string): L1Page | undefined {
  return L1_WORKSPACE.find((page) => page.id === id)
}

export function getL1PageByPath(path: string): L1Page | undefined {
  return L1_WORKSPACE.find((page) => page.path === path)
}

export function getL1PagesByCategory(category: L1Page["category"]): L1Page[] {
  return L1_WORKSPACE.filter((page) => page.category === category)
}

export function getL1PagesByView(view: L1Page["view"]): L1Page[] {
  return L1_WORKSPACE.filter((page) => page.view === view || page.view === "all")
}

export function getAllL1Paths(): string[] {
  return L1_WORKSPACE.map((page) => page.path)
}

export const L1_CATEGORIES = {
  core: "Core Work",
  business: "Business",
  intelligence: "Intelligence",
  cs: "Customer Success",
  admin: "Administration",
  onboarding: "Setup",
} as const
