/**
 * Workspace Configuration
 * Defines role-based navigation, permissions, and UI layout for 12 domains
 */

export type Domain = 
  | "CUSTOMER_SUCCESS"
  | "SALES"
  | "REVOPS"
  | "MARKETING"
  | "PRODUCT_ENGINEERING"
  | "FINANCE"
  | "SERVICE"
  | "PROCUREMENT"
  | "IT_ADMIN"
  | "STUDENT_TEACHER"
  | "PERSONAL"
  | "BIZOPS";

export type WorkspaceView = "PERSONAL" | "WORK";

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface DomainConfig {
  domain: Domain;
  label: string;
  icon: string;
  color: string;
  
  // Navigation for Work view
  workNavigation: NavSection[];
  
  // Dashboard metrics (5 max)
  dashboardMetrics: Array<{
    id: string;
    label: string;
    type: "number" | "currency" | "percentage" | "trend";
    priority: number;
  }>;
  
  // Primary entity (most important)
  primaryEntity: {
    type: string;
    label: string;
    icon: string;
  };
  
  // Secondary entities
  secondaryEntities: Array<{
    type: string;
    label: string;
    icon: string;
  }>;
  
  // Connector categories
  connectors: Array<{
    category: "CRM" | "TASK" | "WORKSPACE" | "OTHER";
    options: string[];
  }>;
}

// ─── DOMAIN CONFIGURATIONS ──────────────────────────────────────────────────

export const DOMAIN_CONFIGS: Record<Domain, DomainConfig> = {
  CUSTOMER_SUCCESS: {
    domain: "CUSTOMER_SUCCESS",
    label: "Customer Success",
    icon: "💚",
    color: "#10B981",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "accounts", label: "Accounts", icon: "Building2", path: "/work/accounts" },
          { id: "contacts", label: "Contacts", icon: "Users", path: "/work/contacts" },
          { id: "health-scores", label: "Health Scores", icon: "Activity", path: "/work/health" },
        ]
      },
      {
        label: "Engagement",
        items: [
          { id: "meetings", label: "Meetings", icon: "Calendar", path: "/work/meetings" },
          { id: "tasks", label: "Tasks", icon: "CheckSquare", path: "/work/tasks" },
          { id: "touchpoints", label: "Touchpoints", icon: "MessageSquare", path: "/work/touchpoints" },
        ]
      },
      {
        label: "Growth",
        items: [
          { id: "expansion", label: "Expansion", icon: "TrendingUp", path: "/work/expansion" },
          { id: "renewals", label: "Renewals", icon: "RefreshCw", path: "/work/renewals" },
          { id: "risks", label: "Risks", icon: "AlertTriangle", path: "/work/risks" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "arr", label: "Total ARR", type: "currency", priority: 1 },
      { id: "health_avg", label: "Avg Health Score", type: "number", priority: 2 },
      { id: "at_risk", label: "At-Risk Accounts", type: "number", priority: 3 },
      { id: "expansion_pipeline", label: "Expansion Pipeline", type: "currency", priority: 4 },
      { id: "nps", label: "NPS Score", type: "number", priority: 5 },
    ],
    
    primaryEntity: {
      type: "account",
      label: "Accounts",
      icon: "Building2"
    },
    
    secondaryEntities: [
      { type: "contact", label: "Contacts", icon: "Users" },
      { type: "meeting", label: "Meetings", icon: "Calendar" },
      { type: "task", label: "Tasks", icon: "CheckSquare" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["Gainsight", "ChurnZero", "Zendesk"] },
    ]
  },

  SALES: {
    domain: "SALES",
    label: "Sales",
    icon: "🎯",
    color: "#0EA5E9",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "pipeline", label: "Pipeline", icon: "DollarSign", path: "/work/pipeline" },
          { id: "deals", label: "Deals", icon: "Briefcase", path: "/work/deals" },
          { id: "accounts", label: "Accounts", icon: "Building2", path: "/work/accounts" },
        ]
      },
      {
        label: "Engagement",
        items: [
          { id: "contacts", label: "Contacts", icon: "Users", path: "/work/contacts" },
          { id: "activities", label: "Activities", icon: "Phone", path: "/work/activities" },
          { id: "meetings", label: "Meetings", icon: "Calendar", path: "/work/meetings" },
        ]
      },
      {
        label: "Planning",
        items: [
          { id: "forecasting", label: "Forecasting", icon: "TrendingUp", path: "/work/forecasting" },
          { id: "quotes", label: "Quotes", icon: "FileText", path: "/work/quotes" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "pipeline_value", label: "Pipeline Value", type: "currency", priority: 1 },
      { id: "deals_closed", label: "Deals Closed (Month)", type: "number", priority: 2 },
      { id: "win_rate", label: "Win Rate", type: "percentage", priority: 3 },
      { id: "avg_deal_size", label: "Avg Deal Size", type: "currency", priority: 4 },
      { id: "forecast_attainment", label: "Forecast Attainment", type: "percentage", priority: 5 },
    ],
    
    primaryEntity: {
      type: "deal",
      label: "Deals",
      icon: "Briefcase"
    },
    
    secondaryEntities: [
      { type: "account", label: "Accounts", icon: "Building2" },
      { type: "contact", label: "Contacts", icon: "Users" },
      { type: "activity", label: "Activities", icon: "Phone" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["Outreach", "SalesLoft", "ZoomInfo"] },
    ]
  },

  REVOPS: {
    domain: "REVOPS",
    label: "Revenue Operations",
    icon: "📊",
    color: "#8B5CF6",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "revenue", label: "Revenue", icon: "DollarSign", path: "/work/revenue" },
          { id: "pipeline", label: "Pipeline Health", icon: "Activity", path: "/work/pipeline" },
          { id: "forecasting", label: "Forecasting", icon: "TrendingUp", path: "/work/forecasting" },
        ]
      },
      {
        label: "Operations",
        items: [
          { id: "territories", label: "Territories", icon: "Map", path: "/work/territories" },
          { id: "quotas", label: "Quotas", icon: "Target", path: "/work/quotas" },
          { id: "comp-plans", label: "Comp Plans", icon: "DollarSign", path: "/work/comp-plans" },
        ]
      },
      {
        label: "Insights",
        items: [
          { id: "analytics", label: "Analytics", icon: "BarChart3", path: "/work/analytics" },
          { id: "reports", label: "Reports", icon: "FileText", path: "/work/reports" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "total_revenue", label: "Total Revenue", type: "currency", priority: 1 },
      { id: "arr_growth", label: "ARR Growth", type: "percentage", priority: 2 },
      { id: "pipeline_coverage", label: "Pipeline Coverage", type: "number", priority: 3 },
      { id: "quota_attainment", label: "Quota Attainment", type: "percentage", priority: 4 },
      { id: "forecast_accuracy", label: "Forecast Accuracy", type: "percentage", priority: 5 },
    ],
    
    primaryEntity: {
      type: "revenue",
      label: "Revenue",
      icon: "DollarSign"
    },
    
    secondaryEntities: [
      { type: "pipeline", label: "Pipeline", icon: "Activity" },
      { type: "territory", label: "Territories", icon: "Map" },
      { type: "report", label: "Reports", icon: "FileText" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["Clari", "Gong", "Stripe"] },
    ]
  },

  MARKETING: {
    domain: "MARKETING",
    label: "Marketing",
    icon: "📣",
    color: "#EC4899",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "campaigns", label: "Campaigns", icon: "Target", path: "/work/campaigns" },
          { id: "leads", label: "Leads", icon: "Users", path: "/work/leads" },
          { id: "analytics", label: "Analytics", icon: "BarChart3", path: "/work/analytics" },
        ]
      },
      {
        label: "Content",
        items: [
          { id: "email", label: "Email Studio", icon: "Mail", path: "/work/email" },
          { id: "social", label: "Social", icon: "Share2", path: "/work/social" },
          { id: "blog", label: "Blog", icon: "FileEdit", path: "/work/blog" },
          { id: "website", label: "Website", icon: "Globe", path: "/work/website" },
        ]
      },
      {
        label: "Insights",
        items: [
          { id: "attribution", label: "Attribution", icon: "PieChart", path: "/work/attribution" },
          { id: "forms", label: "Forms", icon: "FormInput", path: "/work/forms" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "mqls", label: "MQLs (Month)", type: "number", priority: 1 },
      { id: "sql_conversion", label: "MQL → SQL Rate", type: "percentage", priority: 2 },
      { id: "campaign_roi", label: "Campaign ROI", type: "percentage", priority: 3 },
      { id: "pipeline_generated", label: "Pipeline Generated", type: "currency", priority: 4 },
      { id: "website_traffic", label: "Website Traffic", type: "number", priority: 5 },
    ],
    
    primaryEntity: {
      type: "campaign",
      label: "Campaigns",
      icon: "Target"
    },
    
    secondaryEntities: [
      { type: "lead", label: "Leads", icon: "Users" },
      { type: "email", label: "Emails", icon: "Mail" },
      { type: "content", label: "Content", icon: "FileEdit" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["Mailchimp", "Marketo", "Pardot"] },
    ]
  },

  PRODUCT_ENGINEERING: {
    domain: "PRODUCT_ENGINEERING",
    label: "Product & Engineering",
    icon: "💻",
    color: "#6366F1",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "roadmap", label: "Roadmap", icon: "Map", path: "/work/roadmap" },
          { id: "features", label: "Features", icon: "Zap", path: "/work/features" },
          { id: "bugs", label: "Bugs", icon: "AlertTriangle", path: "/work/bugs" },
        ]
      },
      {
        label: "Development",
        items: [
          { id: "sprints", label: "Sprints", icon: "Repeat", path: "/work/sprints" },
          { id: "tasks", label: "Tasks", icon: "CheckSquare", path: "/work/tasks" },
          { id: "releases", label: "Releases", icon: "Package", path: "/work/releases" },
        ]
      },
      {
        label: "Insights",
        items: [
          { id: "analytics", label: "Analytics", icon: "BarChart3", path: "/work/analytics" },
          { id: "feedback", label: "Feedback", icon: "MessageSquare", path: "/work/feedback" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "velocity", label: "Sprint Velocity", type: "number", priority: 1 },
      { id: "bugs_open", label: "Open Bugs", type: "number", priority: 2 },
      { id: "cycle_time", label: "Cycle Time", type: "number", priority: 3 },
      { id: "deployment_freq", label: "Deployment Frequency", type: "number", priority: 4 },
      { id: "feature_adoption", label: "Feature Adoption", type: "percentage", priority: 5 },
    ],
    
    primaryEntity: {
      type: "feature",
      label: "Features",
      icon: "Zap"
    },
    
    secondaryEntities: [
      { type: "sprint", label: "Sprints", icon: "Repeat" },
      { type: "bug", label: "Bugs", icon: "AlertTriangle" },
      { type: "task", label: "Tasks", icon: "CheckSquare" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["Jira", "Linear", "GitHub"] },
    ]
  },

  FINANCE: {
    domain: "FINANCE",
    label: "Finance",
    icon: "💰",
    color: "#14B8A6",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "revenue", label: "Revenue", icon: "DollarSign", path: "/work/revenue" },
          { id: "expenses", label: "Expenses", icon: "CreditCard", path: "/work/expenses" },
          { id: "invoices", label: "Invoices", icon: "FileText", path: "/work/invoices" },
        ]
      },
      {
        label: "Analysis",
        items: [
          { id: "reports", label: "Reports", icon: "FileText", path: "/work/reports" },
          { id: "forecasting", label: "Forecasting", icon: "TrendingUp", path: "/work/forecasting" },
          { id: "budget", label: "Budget", icon: "PieChart", path: "/work/budget" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "total_revenue", label: "Total Revenue", type: "currency", priority: 1 },
      { id: "expenses", label: "Total Expenses", type: "currency", priority: 2 },
      { id: "profit_margin", label: "Profit Margin", type: "percentage", priority: 3 },
      { id: "cash_flow", label: "Cash Flow", type: "currency", priority: 4 },
      { id: "burn_rate", label: "Burn Rate", type: "currency", priority: 5 },
    ],
    
    primaryEntity: {
      type: "invoice",
      label: "Invoices",
      icon: "FileText"
    },
    
    secondaryEntities: [
      { type: "expense", label: "Expenses", icon: "CreditCard" },
      { type: "report", label: "Reports", icon: "FileText" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["QuickBooks", "Xero", "Stripe"] },
    ]
  },

  SERVICE: {
    domain: "SERVICE",
    label: "Customer Service",
    icon: "🎧",
    color: "#F59E0B",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "tickets", label: "Tickets", icon: "Ticket", path: "/work/tickets" },
          { id: "customers", label: "Customers", icon: "Users", path: "/work/customers" },
          { id: "knowledge", label: "Knowledge Base", icon: "BookOpen", path: "/work/knowledge" },
        ]
      },
      {
        label: "Insights",
        items: [
          { id: "analytics", label: "Analytics", icon: "BarChart3", path: "/work/analytics" },
          { id: "satisfaction", label: "CSAT", icon: "Heart", path: "/work/satisfaction" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "open_tickets", label: "Open Tickets", type: "number", priority: 1 },
      { id: "avg_response_time", label: "Avg Response Time", type: "number", priority: 2 },
      { id: "csat_score", label: "CSAT Score", type: "percentage", priority: 3 },
      { id: "first_contact_resolution", label: "First Contact Resolution", type: "percentage", priority: 4 },
      { id: "sla_compliance", label: "SLA Compliance", type: "percentage", priority: 5 },
    ],
    
    primaryEntity: {
      type: "ticket",
      label: "Tickets",
      icon: "Ticket"
    },
    
    secondaryEntities: [
      { type: "customer", label: "Customers", icon: "Users" },
      { type: "article", label: "Knowledge Base", icon: "BookOpen" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["Zendesk", "Intercom", "Freshdesk"] },
    ]
  },

  PROCUREMENT: {
    domain: "PROCUREMENT",
    label: "Procurement",
    icon: "🛒",
    color: "#84CC16",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "vendors", label: "Vendors", icon: "Building2", path: "/work/vendors" },
          { id: "orders", label: "Orders", icon: "ShoppingCart", path: "/work/orders" },
          { id: "contracts", label: "Contracts", icon: "FileText", path: "/work/contracts" },
        ]
      },
      {
        label: "Analysis",
        items: [
          { id: "spend", label: "Spend Analysis", icon: "PieChart", path: "/work/spend" },
          { id: "savings", label: "Savings", icon: "TrendingDown", path: "/work/savings" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "total_spend", label: "Total Spend", type: "currency", priority: 1 },
      { id: "pending_orders", label: "Pending Orders", type: "number", priority: 2 },
      { id: "savings", label: "Cost Savings", type: "currency", priority: 3 },
      { id: "vendor_count", label: "Active Vendors", type: "number", priority: 4 },
      { id: "contract_renewals", label: "Contracts Expiring", type: "number", priority: 5 },
    ],
    
    primaryEntity: {
      type: "order",
      label: "Orders",
      icon: "ShoppingCart"
    },
    
    secondaryEntities: [
      { type: "vendor", label: "Vendors", icon: "Building2" },
      { type: "contract", label: "Contracts", icon: "FileText" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["SAP", "Coupa", "Ariba"] },
    ]
  },

  IT_ADMIN: {
    domain: "IT_ADMIN",
    label: "IT & Admin",
    icon: "🔧",
    color: "#64748B",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "users", label: "Users", icon: "Users", path: "/work/users" },
          { id: "permissions", label: "Permissions", icon: "Shield", path: "/work/permissions" },
          { id: "integrations", label: "Integrations", icon: "Plug", path: "/work/integrations" },
        ]
      },
      {
        label: "Security",
        items: [
          { id: "audit-logs", label: "Audit Logs", icon: "FileText", path: "/work/audit-logs" },
          { id: "compliance", label: "Compliance", icon: "ShieldCheck", path: "/work/compliance" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "active_users", label: "Active Users", type: "number", priority: 1 },
      { id: "integrations", label: "Connected Apps", type: "number", priority: 2 },
      { id: "api_health", label: "API Health", type: "percentage", priority: 3 },
      { id: "security_incidents", label: "Security Incidents", type: "number", priority: 4 },
      { id: "uptime", label: "System Uptime", type: "percentage", priority: 5 },
    ],
    
    primaryEntity: {
      type: "user",
      label: "Users",
      icon: "Users"
    },
    
    secondaryEntities: [
      { type: "integration", label: "Integrations", icon: "Plug" },
      { type: "permission", label: "Permissions", icon: "Shield" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["Okta", "Auth0", "Azure AD"] },
    ]
  },

  STUDENT_TEACHER: {
    domain: "STUDENT_TEACHER",
    label: "Student / Teacher",
    icon: "📚",
    color: "#F97316",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "courses", label: "Courses", icon: "BookOpen", path: "/work/courses" },
          { id: "assignments", label: "Assignments", icon: "FileText", path: "/work/assignments" },
          { id: "grades", label: "Grades", icon: "Award", path: "/work/grades" },
        ]
      },
      {
        label: "Collaboration",
        items: [
          { id: "discussions", label: "Discussions", icon: "MessageSquare", path: "/work/discussions" },
          { id: "projects", label: "Projects", icon: "Briefcase", path: "/work/projects" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "enrolled_courses", label: "Enrolled Courses", type: "number", priority: 1 },
      { id: "avg_grade", label: "Avg Grade", type: "percentage", priority: 2 },
      { id: "assignments_due", label: "Assignments Due", type: "number", priority: 3 },
      { id: "completed", label: "Completed", type: "percentage", priority: 4 },
      { id: "study_hours", label: "Study Hours", type: "number", priority: 5 },
    ],
    
    primaryEntity: {
      type: "course",
      label: "Courses",
      icon: "BookOpen"
    },
    
    secondaryEntities: [
      { type: "assignment", label: "Assignments", icon: "FileText" },
      { type: "project", label: "Projects", icon: "Briefcase" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
      { category: "OTHER", options: ["Canvas", "Blackboard", "Google Classroom"] },
    ]
  },

  PERSONAL: {
    domain: "PERSONAL",
    label: "Personal",
    icon: "👤",
    color: "#A855F7",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/personal/dashboard" },
          { id: "tasks", label: "My Tasks", icon: "CheckSquare", path: "/personal/tasks" },
          { id: "calendar", label: "Calendar", icon: "Calendar", path: "/personal/calendar" },
          { id: "notes", label: "Notes", icon: "StickyNote", path: "/personal/notes" },
        ]
      },
      {
        label: "Organization",
        items: [
          { id: "projects", label: "Projects", icon: "Briefcase", path: "/personal/projects" },
          { id: "docs", label: "Documents", icon: "FileText", path: "/personal/docs" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "tasks_today", label: "Tasks Today", type: "number", priority: 1 },
      { id: "meetings_today", label: "Meetings Today", type: "number", priority: 2 },
      { id: "overdue", label: "Overdue", type: "number", priority: 3 },
      { id: "completed_week", label: "Completed (Week)", type: "number", priority: 4 },
      { id: "productivity", label: "Productivity Score", type: "percentage", priority: 5 },
    ],
    
    primaryEntity: {
      type: "task",
      label: "Tasks",
      icon: "CheckSquare"
    },
    
    secondaryEntities: [
      { type: "calendar", label: "Calendar", icon: "Calendar" },
      { type: "note", label: "Notes", icon: "StickyNote" },
    ],
    
    connectors: [
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
    ]
  },

  BIZOPS: {
    domain: "BIZOPS",
    label: "Business Operations",
    icon: "🌏",
    color: "#0C1222",
    
    workNavigation: [
      {
        label: "Core",
        items: [
          { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/work/dashboard" },
          { id: "projects", label: "Projects", icon: "Briefcase", path: "/work/projects" },
          { id: "workflows", label: "Workflows", icon: "GitBranch", path: "/work/workflows" },
          { id: "analytics", label: "Analytics", icon: "BarChart3", path: "/work/analytics" },
        ]
      },
      {
        label: "Management",
        items: [
          { id: "accounts", label: "Accounts", icon: "Building2", path: "/work/accounts" },
          { id: "tasks", label: "Tasks", icon: "CheckSquare", path: "/work/tasks" },
          { id: "docs", label: "Documents", icon: "FileText", path: "/work/docs" },
        ]
      }
    ],
    
    dashboardMetrics: [
      { id: "active_projects", label: "Active Projects", type: "number", priority: 1 },
      { id: "tasks_completion", label: "Task Completion", type: "percentage", priority: 2 },
      { id: "workflows_automated", label: "Workflows Automated", type: "number", priority: 3 },
      { id: "efficiency_score", label: "Efficiency Score", type: "percentage", priority: 4 },
      { id: "cost_savings", label: "Cost Savings", type: "currency", priority: 5 },
    ],
    
    primaryEntity: {
      type: "project",
      label: "Projects",
      icon: "Briefcase"
    },
    
    secondaryEntities: [
      { type: "workflow", label: "Workflows", icon: "GitBranch" },
      { type: "account", label: "Accounts", icon: "Building2" },
    ],
    
    connectors: [
      { category: "CRM", options: ["Salesforce", "HubSpot", "Zoho"] },
      { category: "TASK", options: ["Anydo", "Todoist"] },
      { category: "WORKSPACE", options: ["Coda", "Notion", "Airtable", "Asana"] },
    ]
  },
};

// ─── PERSONAL VIEW NAVIGATION (Same for all domains) ────────────────────────

export const PERSONAL_NAV: NavSection[] = [
  {
    label: "Core",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", path: "/personal/dashboard" },
      { id: "tasks", label: "My Tasks", icon: "CheckSquare", path: "/personal/tasks" },
      { id: "calendar", label: "Calendar", icon: "Calendar", path: "/personal/calendar" },
      { id: "notes", label: "Notes", icon: "StickyNote", path: "/personal/notes" },
    ]
  },
  {
    label: "Organization",
    items: [
      { id: "projects", label: "Projects", icon: "Briefcase", path: "/personal/projects" },
      { id: "docs", label: "Documents", icon: "FileText", path: "/personal/docs" },
      { id: "bookmarks", label: "Bookmarks", icon: "Bookmark", path: "/personal/bookmarks" },
    ]
  }
];

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

export function getDomainConfig(domain: Domain): DomainConfig {
  return DOMAIN_CONFIGS[domain];
}

export function getWorkNavigation(domain: Domain): NavSection[] {
  return DOMAIN_CONFIGS[domain].workNavigation;
}

export function getPersonalNavigation(): NavSection[] {
  return PERSONAL_NAV;
}

export function getDashboardMetrics(domain: Domain) {
  return DOMAIN_CONFIGS[domain].dashboardMetrics;
}

export function getPrimaryEntity(domain: Domain) {
  return DOMAIN_CONFIGS[domain].primaryEntity;
}

export function getConnectors(domain: Domain) {
  return DOMAIN_CONFIGS[domain].connectors;
}
