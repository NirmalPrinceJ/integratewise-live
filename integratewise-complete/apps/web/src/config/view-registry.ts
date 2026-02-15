import { ShieldCheck, Users, Zap, BookOpen, Database, BarChart3, Briefcase, Settings, Layers, Activity, Target, CreditCard, Flag, FileText, Bell, Home, CheckSquare, Lightbulb, Globe, Megaphone, Package, Building2, Search, UserCog, Link2, AlertCircle, Play, Calendar, TrendingUp, DollarSign, FolderOpen, Gavel, Eye, Clock, Archive } from 'lucide-react';

export type ViewConfig = {
  id: string;
  label: string;
  route: string;
  icon: any;
  domain: string;
  requiredRoles: string[];
  requiredPlan: string;
  featureFlag: string;
  component: string;
  apiEndpoints: string[];
};

export const VIEW_REGISTRY: Record<string, ViewConfig> = {
  // Platform Admin (19 views)
  'ADMIN-001': {
    id: 'ADMIN-001',
    label: 'Admin Dashboard',
    route: '/admin',
    icon: ShieldCheck,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'admin-dashboard',
    component: 'AdminDashboardView',
    apiEndpoints: ['/api/admin/stats', '/api/admin/health']
  },
  'ADMIN-002': {
    id: 'ADMIN-002',
    label: 'Tenant Management',
    route: '/admin/tenants',
    icon: Building2,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'tenant-management',
    component: 'TenantListView',
    apiEndpoints: ['/api/admin/tenants']
  },
  'ADMIN-003': {
    id: 'ADMIN-003',
    label: 'Tenant Detail',
    route: '/admin/tenants/[id]',
    icon: Building2,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'tenant-management',
    component: 'TenantDetailView',
    apiEndpoints: ['/api/admin/tenants/[id]']
  },
  'ADMIN-004': {
    id: 'ADMIN-004',
    label: 'User Management',
    route: '/admin/users',
    icon: UserCog,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'user-management',
    component: 'UserManagementView',
    apiEndpoints: ['/api/admin/users']
  },
  'ADMIN-005': {
    id: 'ADMIN-005',
    label: 'Billing Admin',
    route: '/admin/billing',
    icon: CreditCard,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'billing-admin',
    component: 'BillingAdminView',
    apiEndpoints: ['/api/admin/billing']
  },
  'ADMIN-006': {
    id: 'ADMIN-006',
    label: 'Feature Flags',
    route: '/admin/features',
    icon: Flag,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'feature-flags',
    component: 'FeatureFlagsView',
    apiEndpoints: ['/api/admin/features']
  },
  'ADMIN-007': {
    id: 'ADMIN-007',
    label: 'Release Control',
    route: '/admin/releases',
    icon: Activity,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'release-control',
    component: 'ReleaseControlView',
    apiEndpoints: ['/api/admin/releases']
  },
  'ADMIN-008': {
    id: 'ADMIN-008',
    label: 'Governance Policies',
    route: '/admin/policies',
    icon: ShieldCheck,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'governance',
    component: 'GovernancePoliciesView',
    apiEndpoints: ['/api/admin/policies']
  },
  'ADMIN-009': {
    id: 'ADMIN-009',
    label: 'Audit Log',
    route: '/admin/audit',
    icon: FileText,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'audit-log',
    component: 'AuditLogView',
    apiEndpoints: ['/api/admin/audit']
  },
  'ADMIN-010': {
    id: 'ADMIN-010',
    label: 'System Settings',
    route: '/admin/system',
    icon: Settings,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'system-settings',
    component: 'SystemSettingsView',
    apiEndpoints: ['/api/admin/system']
  },
  'ADMIN-011': {
    id: 'ADMIN-011',
    label: 'Impersonation',
    route: '/admin/impersonation',
    icon: UserCog,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'impersonation',
    component: 'ImpersonationView',
    apiEndpoints: ['/api/admin/impersonation']
  },
  'ADMIN-012': {
    id: 'ADMIN-012',
    label: 'Support Tickets',
    route: '/admin/support',
    icon: Bell,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'support-tickets',
    component: 'SupportTicketsView',
    apiEndpoints: ['/api/admin/support']
  },
  'ADMIN-013': {
    id: 'ADMIN-013',
    label: 'Roles',
    route: '/admin/roles',
    icon: UserCog,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'role-management',
    component: 'RolesView',
    apiEndpoints: ['/api/admin/roles']
  },
  'ADMIN-014': {
    id: 'ADMIN-014',
    label: 'Permissions',
    route: '/admin/permissions',
    icon: ShieldCheck,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'permission-matrix',
    component: 'PermissionsView',
    apiEndpoints: ['/api/admin/permissions']
  },
  'ADMIN-015': {
    id: 'ADMIN-015',
    label: 'Teams',
    route: '/admin/teams',
    icon: Users,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'team-configuration',
    component: 'TeamsView',
    apiEndpoints: ['/api/admin/teams']
  },
  'ADMIN-016': {
    id: 'ADMIN-016',
    label: 'Execution Policies',
    route: '/admin/execution-policies',
    icon: Gavel,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'execution-policies',
    component: 'ExecutionPoliciesView',
    apiEndpoints: ['/api/admin/execution-policies']
  },
  'ADMIN-017': {
    id: 'ADMIN-017',
    label: 'View Configuration',
    route: '/admin/views',
    icon: Eye,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'view-configuration',
    component: 'ViewConfigurationView',
    apiEndpoints: ['/api/admin/views']
  },
  'ADMIN-018': {
    id: 'ADMIN-018',
    label: 'Connector Management',
    route: '/admin/connectors',
    icon: Link2,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'connector-management',
    component: 'ConnectorManagementView',
    apiEndpoints: ['/api/admin/connectors']
  },
  'ADMIN-019': {
    id: 'ADMIN-019',
    label: 'Act History',
    route: '/admin/act-history',
    icon: Archive,
    domain: 'Platform Admin',
    requiredRoles: ['super_admin', 'org_admin'],
    requiredPlan: 'enterprise',
    featureFlag: 'act-history',
    component: 'ActHistoryView',
    apiEndpoints: ['/api/admin/act-history']
  },

  // CRM (10 views)
  'CRM-001': {
    id: 'CRM-001',
    label: 'Clients',
    route: '/clients',
    icon: Users,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'crm-clients',
    component: 'ClientsView',
    apiEndpoints: ['/api/crm/clients']
  },
  'CRM-002': {
    id: 'CRM-002',
    label: 'Client Detail',
    route: '/clients/[id]',
    icon: Users,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'crm-clients',
    component: 'ClientDetailView',
    apiEndpoints: ['/api/crm/clients/[id]']
  },
  'CRM-003': {
    id: 'CRM-003',
    label: 'Leads',
    route: '/leads',
    icon: Target,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'crm-leads',
    component: 'LeadsView',
    apiEndpoints: ['/api/crm/leads']
  },
  'CRM-004': {
    id: 'CRM-004',
    label: 'Deals',
    route: '/deals',
    icon: Briefcase,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'crm-deals',
    component: 'DealsView',
    apiEndpoints: ['/api/crm/deals']
  },
  'CRM-005': {
    id: 'CRM-005',
    label: 'Pipeline',
    route: '/pipeline',
    icon: BarChart3,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'crm-pipeline',
    component: 'PipelineView',
    apiEndpoints: ['/api/crm/pipeline']
  },
  'CRM-006': {
    id: 'CRM-006',
    label: 'Contacts',
    route: '/contacts',
    icon: Users,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'crm-contacts',
    component: 'ContactsView',
    apiEndpoints: ['/api/crm/contacts']
  },
  'CRM-007': {
    id: 'CRM-007',
    label: 'Companies',
    route: '/companies',
    icon: Building2,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'crm-companies',
    component: 'CompaniesView',
    apiEndpoints: ['/api/crm/companies']
  },
  'CRM-008': {
    id: 'CRM-008',
    label: 'Activities',
    route: '/activities',
    icon: Activity,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'crm-activities',
    component: 'ActivitiesView',
    apiEndpoints: ['/api/crm/activities']
  },
  'CRM-009': {
    id: 'CRM-009',
    label: 'Products',
    route: '/products',
    icon: Package,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'crm-products',
    component: 'ProductsView',
    apiEndpoints: ['/api/crm/products']
  },
  'CRM-010': {
    id: 'CRM-010',
    label: 'Services',
    route: '/services',
    icon: Briefcase,
    domain: 'CRM',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'crm-services',
    component: 'ServicesView',
    apiEndpoints: ['/api/crm/services']
  },

  // Operations (10 views)
  'OPS-001': {
    id: 'OPS-001',
    label: 'Today',
    route: '/today',
    icon: Home,
    domain: 'Operations',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'ops-today',
    component: 'TodayView',
    apiEndpoints: ['/api/ops/today']
  },
  'OPS-002': {
    id: 'OPS-002',
    label: 'Tasks',
    route: '/tasks',
    icon: CheckSquare,
    domain: 'Operations',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'ops-tasks',
    component: 'TasksView',
    apiEndpoints: ['/api/ops/tasks']
  },
  'OPS-003': {
    id: 'OPS-003',
    label: 'Projects',
    route: '/projects',
    icon: Briefcase,
    domain: 'Operations',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'ops-projects',
    component: 'ProjectsView',
    apiEndpoints: ['/api/ops/projects']
  },
  'OPS-004': {
    id: 'OPS-004',
    label: 'Sessions',
    route: '/sessions',
    icon: Activity,
    domain: 'Operations',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'ops-sessions',
    component: 'SessionsView',
    apiEndpoints: ['/api/ops/sessions']
  },
  'OPS-005': {
    id: 'OPS-005',
    label: 'Goals',
    route: '/goals',
    icon: Target,
    domain: 'Operations',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'ops-goals',
    component: 'GoalsView',
    apiEndpoints: ['/api/ops/goals']
  },
  'OPS-006': {
    id: 'OPS-006',
    label: 'Calendar',
    route: '/calendar',
    icon: Calendar,
    domain: 'Operations',
    requiredRoles: ['member'],
    requiredPlan: 'professional',
    featureFlag: 'ops-calendar',
    component: 'CalendarView',
    apiEndpoints: ['/api/ops/calendar']
  },
  'OPS-007': {
    id: 'OPS-007',
    label: 'Inbox',
    route: '/inbox',
    icon: Bell,
    domain: 'Operations',
    requiredRoles: ['member'],
    requiredPlan: 'professional',
    featureFlag: 'ops-inbox',
    component: 'InboxView',
    apiEndpoints: ['/api/ops/inbox']
  },
  'OPS-008': {
    id: 'OPS-008',
    label: 'Notifications',
    route: '/notifications',
    icon: Bell,
    domain: 'Operations',
    requiredRoles: ['member'],
    requiredPlan: 'professional',
    featureFlag: 'ops-notifications',
    component: 'NotificationsView',
    apiEndpoints: ['/api/ops/notifications']
  },
  'OPS-009': {
    id: 'OPS-009',
    label: 'Context',
    route: '/context',
    icon: Database,
    domain: 'Operations',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'ops-context',
    component: 'ContextView',
    apiEndpoints: ['/api/ops/context']
  },
  'OPS-010': {
    id: 'OPS-010',
    label: 'Integrations',
    route: '/integrations',
    icon: Link2,
    domain: 'Operations',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'ops-integrations',
    component: 'IntegrationsView',
    apiEndpoints: ['/api/ops/integrations']
  },

  // Knowledge (7 views)
  'KB-001': {
    id: 'KB-001',
    label: 'Knowledge',
    route: '/knowledge',
    icon: BookOpen,
    domain: 'Knowledge',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'kb-knowledge',
    component: 'KnowledgeView',
    apiEndpoints: ['/api/kb/knowledge']
  },
  'KB-002': {
    id: 'KB-002',
    label: 'Knowledge Category',
    route: '/knowledge/[category]',
    icon: BookOpen,
    domain: 'Knowledge',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'kb-knowledge',
    component: 'KnowledgeCategoryView',
    apiEndpoints: ['/api/kb/knowledge/[category]']
  },
  'KB-003': {
    id: 'KB-003',
    label: 'Brainstorming',
    route: '/brainstorming',
    icon: Lightbulb,
    domain: 'Knowledge',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'kb-brainstorming',
    component: 'BrainstormingView',
    apiEndpoints: ['/api/kb/brainstorming']
  },
  'KB-004': {
    id: 'KB-004',
    label: 'Search Center',
    route: '/search',
    icon: Search,
    domain: 'Knowledge',
    requiredRoles: ['member'],
    requiredPlan: 'professional',
    featureFlag: 'kb-search',
    component: 'SearchCenterView',
    apiEndpoints: ['/api/kb/search']
  },
  'KB-005': {
    id: 'KB-005',
    label: 'Memory Browser',
    route: '/memory',
    icon: Database,
    domain: 'Knowledge',
    requiredRoles: ['member'],
    requiredPlan: 'professional',
    featureFlag: 'kb-memory',
    component: 'MemoryBrowserView',
    apiEndpoints: ['/api/kb/memory']
  },
  'KB-006': {
    id: 'KB-006',
    label: 'Documents',
    route: '/documents',
    icon: FileText,
    domain: 'Knowledge',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'kb-documents',
    component: 'DocumentsView',
    apiEndpoints: ['/api/kb/documents']
  },
  'KB-007': {
    id: 'KB-007',
    label: 'Content Library',
    route: '/content',
    icon: BookOpen,
    domain: 'Knowledge',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'kb-content',
    component: 'ContentLibraryView',
    apiEndpoints: ['/api/kb/content']
  },

  // Spine/SSOT (6 views)
  'SPINE-001': {
    id: 'SPINE-001',
    label: 'Spine Dashboard',
    route: '/spine',
    icon: Database,
    domain: 'Spine/SSOT',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'spine-dashboard',
    component: 'SpineDashboardView',
    apiEndpoints: ['/api/spine/dashboard']
  },
  'SPINE-002': {
    id: 'SPINE-002',
    label: 'Spine Events',
    route: '/spine/events',
    icon: Activity,
    domain: 'Spine/SSOT',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'spine-events',
    component: 'SpineEventsView',
    apiEndpoints: ['/api/spine/events']
  },
  'SPINE-003': {
    id: 'SPINE-003',
    label: 'Signal Feed',
    route: '/spine/signals',
    icon: Zap,
    domain: 'Spine/SSOT',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'spine-signals',
    component: 'SignalFeedView',
    apiEndpoints: ['/api/spine/signals']
  },
  'SPINE-004': {
    id: 'SPINE-004',
    label: 'Data Flow',
    route: '/data-flow',
    icon: Database,
    domain: 'Spine/SSOT',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'data-flow',
    component: 'DataFlowView',
    apiEndpoints: ['/api/spine/data-flow']
  },
  'SPINE-005': {
    id: 'SPINE-005',
    label: 'Data Sources',
    route: '/data-sources',
    icon: Database,
    domain: 'Spine/SSOT',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'data-sources',
    component: 'DataSourcesView',
    apiEndpoints: ['/api/spine/data-sources']
  },
  'SPINE-006': {
    id: 'SPINE-006',
    label: 'Architecture',
    route: '/architecture',
    icon: Globe,
    domain: 'Spine/SSOT',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'architecture',
    component: 'ArchitectureView',
    apiEndpoints: ['/api/spine/architecture']
  },

  // Intelligence (6 views)
  'IQ-001': {
    id: 'IQ-001',
    label: 'IQ Hub',
    route: '/iq-hub',
    icon: Lightbulb,
    domain: 'Intelligence',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'enterprise',
    featureFlag: 'iq-hub',
    component: 'IQHubView',
    apiEndpoints: ['/api/iq/hub']
  },
  'IQ-002': {
    id: 'IQ-002',
    label: 'Situations',
    route: '/situations',
    icon: AlertCircle,
    domain: 'Intelligence',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'enterprise',
    featureFlag: 'situations',
    component: 'SituationQueueView',
    apiEndpoints: ['/api/iq/situations']
  },
  'IQ-003': {
    id: 'IQ-003',
    label: 'Actions',
    route: '/actions',
    icon: Zap,
    domain: 'Intelligence',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'enterprise',
    featureFlag: 'actions',
    component: 'ActionLogView',
    apiEndpoints: ['/api/iq/actions']
  },
  'IQ-004': {
    id: 'IQ-004',
    label: 'Insights',
    route: '/insights',
    icon: BarChart3,
    domain: 'Intelligence',
    requiredRoles: ['member'],
    requiredPlan: 'enterprise',
    featureFlag: 'insights',
    component: 'InsightsView',
    apiEndpoints: ['/api/iq/insights']
  },
  'IQ-005': {
    id: 'IQ-005',
    label: 'Shadow Mode',
    route: '/shadow',
    icon: UserCog,
    domain: 'Intelligence',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'enterprise',
    featureFlag: 'shadow-mode',
    component: 'ShadowModeView',
    apiEndpoints: ['/api/iq/shadow']
  },
  'IQ-006': {
    id: 'IQ-006',
    label: 'Metrics',
    route: '/metrics',
    icon: BarChart3,
    domain: 'Intelligence',
    requiredRoles: ['viewer'],
    requiredPlan: 'starter',
    featureFlag: 'metrics',
    component: 'MetricsView',
    apiEndpoints: ['/api/iq/metrics']
  },

  // Sales (10 views)
  'SALES-001': {
    id: 'SALES-001',
    label: 'Deals',
    route: '/sales/deals',
    icon: Briefcase,
    domain: 'Sales',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'sales-deals',
    component: 'SalesDealsView',
    apiEndpoints: ['/api/sales/deals']
  },
  'SALES-002': {
    id: 'SALES-002',
    label: 'Pipeline',
    route: '/sales/pipeline',
    icon: BarChart3,
    domain: 'Sales',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'sales-pipeline',
    component: 'SalesPipelineView',
    apiEndpoints: ['/api/sales/pipeline']
  },
  'SALES-003': {
    id: 'SALES-003',
    label: 'Leads',
    route: '/sales/leads',
    icon: Target,
    domain: 'Sales',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'sales-leads',
    component: 'SalesLeadsView',
    apiEndpoints: ['/api/sales/leads']
  },
  'SALES-004': {
    id: 'SALES-004',
    label: 'Accounts',
    route: '/sales/accounts',
    icon: Building2,
    domain: 'Sales',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'sales-accounts',
    component: 'SalesAccountsView',
    apiEndpoints: ['/api/sales/accounts']
  },
  'SALES-005': {
    id: 'SALES-005',
    label: 'Contacts',
    route: '/sales/contacts',
    icon: Users,
    domain: 'Sales',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'sales-contacts',
    component: 'SalesContactsView',
    apiEndpoints: ['/api/sales/contacts']
  },
  'SALES-006': {
    id: 'SALES-006',
    label: 'Today',
    route: '/sales/today',
    icon: Home,
    domain: 'Sales',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'sales-today',
    component: 'SalesTodayView',
    apiEndpoints: ['/api/sales/today']
  },
  'SALES-007': {
    id: 'SALES-007',
    label: 'Tasks',
    route: '/sales/tasks',
    icon: CheckSquare,
    domain: 'Sales',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'sales-tasks',
    component: 'SalesTasksView',
    apiEndpoints: ['/api/sales/tasks']
  },
  'SALES-008': {
    id: 'SALES-008',
    label: 'Insights',
    route: '/sales/insights',
    icon: TrendingUp,
    domain: 'Sales',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'sales-insights',
    component: 'SalesInsightsView',
    apiEndpoints: ['/api/sales/insights']
  },
  'SALES-009': {
    id: 'SALES-009',
    label: 'Situations',
    route: '/sales/situations',
    icon: AlertCircle,
    domain: 'Sales',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'enterprise',
    featureFlag: 'sales-situations',
    component: 'SalesSituationsView',
    apiEndpoints: ['/api/sales/situations']
  },
  'SALES-010': {
    id: 'SALES-010',
    label: 'Analytics',
    route: '/sales/analytics',
    icon: BarChart3,
    domain: 'Sales',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'sales-analytics',
    component: 'SalesAnalyticsView',
    apiEndpoints: ['/api/sales/analytics']
  },

  // Customer Success (9 views)
  'CS-001': {
    id: 'CS-001',
    label: 'Customers',
    route: '/cs/customers',
    icon: Users,
    domain: 'Customer Success',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'cs-customers',
    component: 'CSCustomersView',
    apiEndpoints: ['/api/cs/customers']
  },
  'CS-002': {
    id: 'CS-002',
    label: 'Health',
    route: '/cs/health',
    icon: Activity,
    domain: 'Customer Success',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'cs-health',
    component: 'CSHealthView',
    apiEndpoints: ['/api/cs/health']
  },
  'CS-003': {
    id: 'CS-003',
    label: 'Engagements',
    route: '/cs/engagements',
    icon: Activity,
    domain: 'Customer Success',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'cs-engagements',
    component: 'CSEngagementsView',
    apiEndpoints: ['/api/cs/engagements']
  },
  'CS-004': {
    id: 'CS-004',
    label: 'Renewals',
    route: '/cs/renewals',
    icon: Clock,
    domain: 'Customer Success',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'cs-renewals',
    component: 'CSRenewalsView',
    apiEndpoints: ['/api/cs/renewals']
  },
  'CS-005': {
    id: 'CS-005',
    label: 'Today',
    route: '/cs/today',
    icon: Home,
    domain: 'Customer Success',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'cs-today',
    component: 'CSTodayView',
    apiEndpoints: ['/api/cs/today']
  },
  'CS-006': {
    id: 'CS-006',
    label: 'Tasks',
    route: '/cs/tasks',
    icon: CheckSquare,
    domain: 'Customer Success',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'cs-tasks',
    component: 'CSTasksView',
    apiEndpoints: ['/api/cs/tasks']
  },
  'CS-007': {
    id: 'CS-007',
    label: 'Insights',
    route: '/cs/insights',
    icon: TrendingUp,
    domain: 'Customer Success',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'cs-insights',
    component: 'CSInsightsView',
    apiEndpoints: ['/api/cs/insights']
  },
  'CS-008': {
    id: 'CS-008',
    label: 'Situations',
    route: '/cs/situations',
    icon: AlertCircle,
    domain: 'Customer Success',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'enterprise',
    featureFlag: 'cs-situations',
    component: 'CSSituationsView',
    apiEndpoints: ['/api/cs/situations']
  },
  'CS-009': {
    id: 'CS-009',
    label: 'Analytics',
    route: '/cs/analytics',
    icon: BarChart3,
    domain: 'Customer Success',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'cs-analytics',
    component: 'CSAnalyticsView',
    apiEndpoints: ['/api/cs/analytics']
  },

  // Marketing (7 views)
  'MKT-001': {
    id: 'MKT-001',
    label: 'Campaigns',
    route: '/marketing/campaigns',
    icon: Megaphone,
    domain: 'Marketing',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'mkt-campaigns',
    component: 'MarketingCampaignsView',
    apiEndpoints: ['/api/mkt/campaigns']
  },
  'MKT-002': {
    id: 'MKT-002',
    label: 'Content',
    route: '/marketing/content',
    icon: FileText,
    domain: 'Marketing',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'mkt-content',
    component: 'MarketingContentView',
    apiEndpoints: ['/api/mkt/content']
  },
  'MKT-003': {
    id: 'MKT-003',
    label: 'Website',
    route: '/marketing/website',
    icon: Globe,
    domain: 'Marketing',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'mkt-website',
    component: 'MarketingWebsiteView',
    apiEndpoints: ['/api/mkt/website']
  },
  'MKT-004': {
    id: 'MKT-004',
    label: 'Analytics',
    route: '/marketing/analytics',
    icon: BarChart3,
    domain: 'Marketing',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'mkt-analytics',
    component: 'MarketingAnalyticsView',
    apiEndpoints: ['/api/mkt/analytics']
  },
  'MKT-005': {
    id: 'MKT-005',
    label: 'Today',
    route: '/marketing/today',
    icon: Home,
    domain: 'Marketing',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'mkt-today',
    component: 'MarketingTodayView',
    apiEndpoints: ['/api/mkt/today']
  },
  'MKT-006': {
    id: 'MKT-006',
    label: 'Tasks',
    route: '/marketing/tasks',
    icon: CheckSquare,
    domain: 'Marketing',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'mkt-tasks',
    component: 'MarketingTasksView',
    apiEndpoints: ['/api/mkt/tasks']
  },
  'MKT-007': {
    id: 'MKT-007',
    label: 'Insights',
    route: '/marketing/insights',
    icon: TrendingUp,
    domain: 'Marketing',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'mkt-insights',
    component: 'MarketingInsightsView',
    apiEndpoints: ['/api/mkt/insights']
  },

  // Finance (6 views)
  'FIN-001': {
    id: 'FIN-001',
    label: 'Subscriptions',
    route: '/finance/subscriptions',
    icon: CreditCard,
    domain: 'Finance',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'fin-subscriptions',
    component: 'FinanceSubscriptionsView',
    apiEndpoints: ['/api/fin/subscriptions']
  },
  'FIN-002': {
    id: 'FIN-002',
    label: 'Transactions',
    route: '/finance/transactions',
    icon: DollarSign,
    domain: 'Finance',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'fin-transactions',
    component: 'FinanceTransactionsView',
    apiEndpoints: ['/api/fin/transactions']
  },
  'FIN-003': {
    id: 'FIN-003',
    label: 'Revenue',
    route: '/finance/revenue',
    icon: TrendingUp,
    domain: 'Finance',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'fin-revenue',
    component: 'FinanceRevenueView',
    apiEndpoints: ['/api/fin/revenue']
  },
  'FIN-004': {
    id: 'FIN-004',
    label: 'Today',
    route: '/finance/today',
    icon: Home,
    domain: 'Finance',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'fin-today',
    component: 'FinanceTodayView',
    apiEndpoints: ['/api/fin/today']
  },
  'FIN-005': {
    id: 'FIN-005',
    label: 'Tasks',
    route: '/finance/tasks',
    icon: CheckSquare,
    domain: 'Finance',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'fin-tasks',
    component: 'FinanceTasksView',
    apiEndpoints: ['/api/fin/tasks']
  },
  'FIN-006': {
    id: 'FIN-006',
    label: 'Billing',
    route: '/finance/billing',
    icon: CreditCard,
    domain: 'Finance',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'fin-billing',
    component: 'FinanceBillingView',
    apiEndpoints: ['/api/fin/billing']
  },

  // Projects (4 views)
  'PROJ-001': {
    id: 'PROJ-001',
    label: 'List',
    route: '/projects/list',
    icon: FolderOpen,
    domain: 'Projects',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'proj-list',
    component: 'ProjectsListView',
    apiEndpoints: ['/api/proj/list']
  },
  'PROJ-002': {
    id: 'PROJ-002',
    label: 'Milestones',
    route: '/projects/milestones',
    icon: Target,
    domain: 'Projects',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'proj-milestones',
    component: 'ProjectsMilestonesView',
    apiEndpoints: ['/api/proj/milestones']
  },
  'PROJ-003': {
    id: 'PROJ-003',
    label: 'Tasks',
    route: '/projects/tasks',
    icon: CheckSquare,
    domain: 'Projects',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'proj-tasks',
    component: 'ProjectsTasksView',
    apiEndpoints: ['/api/proj/tasks']
  },
  'PROJ-004': {
    id: 'PROJ-004',
    label: 'Today',
    route: '/projects/today',
    icon: Home,
    domain: 'Projects',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'proj-today',
    component: 'ProjectsTodayView',
    apiEndpoints: ['/api/proj/today']
  },

  // System (15 views)
  'SYS-001': {
    id: 'SYS-001',
    label: 'Integrations',
    route: '/integrations',
    icon: Link2,
    domain: 'System',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'sys-integrations',
    component: 'IntegrationsView',
    apiEndpoints: ['/api/sys/integrations']
  },
  'SYS-002': {
    id: 'SYS-002',
    label: 'Connectors',
    route: '/connectors',
    icon: Database,
    domain: 'System',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'sys-connectors',
    component: 'ConnectorAdminView',
    apiEndpoints: ['/api/sys/connectors']
  },
  'SYS-003': {
    id: 'SYS-003',
    label: 'Webhooks',
    route: '/webhooks',
    icon: Bell,
    domain: 'System',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'sys-webhooks',
    component: 'WebhookMonitorView',
    apiEndpoints: ['/api/sys/webhooks']
  },
  'SYS-004': {
    id: 'SYS-004',
    label: 'Jobs',
    route: '/jobs',
    icon: Activity,
    domain: 'System',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'sys-jobs',
    component: 'JobQueueView',
    apiEndpoints: ['/api/sys/jobs']
  },
  'SYS-005': {
    id: 'SYS-005',
    label: 'Health',
    route: '/health',
    icon: Activity,
    domain: 'System',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'sys-health',
    component: 'SystemHealthView',
    apiEndpoints: ['/api/sys/health']
  },
  'SYS-006': {
    id: 'SYS-006',
    label: 'Errors',
    route: '/errors',
    icon: AlertCircle,
    domain: 'System',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'sys-errors',
    component: 'ErrorDashboardView',
    apiEndpoints: ['/api/sys/errors']
  },
  'SYS-007': {
    id: 'SYS-007',
    label: 'Settings',
    route: '/settings',
    icon: Settings,
    domain: 'System',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'sys-settings',
    component: 'SettingsView',
    apiEndpoints: ['/api/sys/settings']
  },
  'SYS-008': {
    id: 'SYS-008',
    label: 'Profile',
    route: '/profile',
    icon: UserCog,
    domain: 'System',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'sys-profile',
    component: 'ProfileView',
    apiEndpoints: ['/api/sys/profile']
  },
  'SYS-009': {
    id: 'SYS-009',
    label: 'Loader',
    route: '/loader',
    icon: Database,
    domain: 'System',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'starter',
    featureFlag: 'sys-loader',
    component: 'LoaderView',
    apiEndpoints: ['/api/sys/loader']
  },
  'SYS-010': {
    id: 'SYS-010',
    label: 'Login',
    route: '/login',
    icon: UserCog,
    domain: 'System',
    requiredRoles: [],
    requiredPlan: 'starter',
    featureFlag: 'auth',
    component: 'LoginView',
    apiEndpoints: ['/api/auth/login']
  },
  'SYS-011': {
    id: 'SYS-011',
    label: 'Signup',
    route: '/signup',
    icon: UserCog,
    domain: 'System',
    requiredRoles: [],
    requiredPlan: 'starter',
    featureFlag: 'auth',
    component: 'SignupView',
    apiEndpoints: ['/api/auth/signup']
  },
  'SYS-012': {
    id: 'SYS-012',
    label: 'Bridge',
    route: '/bridge',
    icon: Link2,
    domain: 'System',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'professional',
    featureFlag: 'sys-bridge',
    component: 'BridgeControlView',
    apiEndpoints: ['/api/sys/bridge']
  },
  'SYS-013': {
    id: 'SYS-013',
    label: 'Autonomy',
    route: '/autonomy',
    icon: Zap,
    domain: 'System',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'enterprise',
    featureFlag: 'sys-autonomy',
    component: 'AutonomyEvidenceView',
    apiEndpoints: ['/api/sys/autonomy']
  },
  'SYS-014': {
    id: 'SYS-014',
    label: 'Topics',
    route: '/topics',
    icon: BookOpen,
    domain: 'System',
    requiredRoles: ['member'],
    requiredPlan: 'starter',
    featureFlag: 'sys-topics',
    component: 'TopicsView',
    apiEndpoints: ['/api/sys/topics']
  },
  'SYS-015': {
    id: 'SYS-015',
    label: 'Demo',
    route: '/demo',
    icon: Play,
    domain: 'System',
    requiredRoles: [],
    requiredPlan: 'starter',
    featureFlag: 'demo',
    component: 'DemoView',
    apiEndpoints: ['/api/demo']
  },

  // Act (2 views)
  'ACT-001': {
    id: 'ACT-001',
    label: 'History',
    route: '/act/history',
    icon: Archive,
    domain: 'Act',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'enterprise',
    featureFlag: 'act-history',
    component: 'ActHistoryView',
    apiEndpoints: ['/api/act/history']
  },
  'ACT-002': {
    id: 'ACT-002',
    label: 'Run Details',
    route: '/act/run/[id]',
    icon: Activity,
    domain: 'Act',
    requiredRoles: ['manager', 'member'],
    requiredPlan: 'enterprise',
    featureFlag: 'act-run-details',
    component: 'ActRunDetailsView',
    apiEndpoints: ['/api/act/run/[id]']
  },

  // Entity 360 (1 view)
  'ENTITY-001': {
    id: 'ENTITY-001',
    label: 'Entity 360',
    route: '/entity/[id]',
    icon: Eye,
    domain: 'Entity',
    requiredRoles: ['member'],
    requiredPlan: 'professional',
    featureFlag: 'entity-360',
    component: 'Entity360View',
    apiEndpoints: ['/api/entity/[id]']
  }
};

// Helper functions
export const getViewsByDomain = (domain: string): ViewConfig[] => {
  return Object.values(VIEW_REGISTRY).filter(view => view.domain === domain);
};

export const getViewById = (id: string): ViewConfig | undefined => {
  return VIEW_REGISTRY[id];
};

export const getViewByRoute = (route: string): ViewConfig | undefined => {
  return Object.values(VIEW_REGISTRY).find(view => view.route === route);
};