export type WorldScope = 'personal' | 'work' | 'accounts' | 'admin'
export type OsViewId = 'personal' | 'ops' | 'sales' | 'marketing' | 'cs' | 'projects' | 'accounts' | 'admin'
export type Role = 'owner' | 'admin' | 'manager' | 'practitioner' | 'readonly'
export type EntitlementTier = 'personal' | 'team' | 'org' | 'enterprise'

export interface NavItemConfig {
  id: string
  label: string
  route: string
  view: OsViewId
  worldScope?: WorldScope
  department?: string | null
  accountRole?: string | null
  accountId?: string | null
  modules?: string[]
  kpiCards?: string[]
  situationTemplates?: string[]
  actionLibrary?: string[]
  governanceRules?: Record<string, unknown>
  rbacRules?: Record<string, unknown>
  planGates?: Record<string, unknown>
  requiredRoles: Role[]
  requiredPlan: EntitlementTier
  featureFlag: string
}

export interface NavSectionConfig {
  id: string
  label: string
  items: NavItemConfig[]
}

export interface ViewConfig {
  id: OsViewId
  label: string
  defaultItemId: string
  navSections: NavSectionConfig[]
  worldScope?: WorldScope
}

const coreItems = (view: OsViewId, base: string): NavItemConfig[] => [
  {
    id: `${view.toUpperCase()}-HOME`,
    label: 'Home',
    route: `${base}/home`,
    view,
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner', 'readonly'],
    requiredPlan: 'personal',
    featureFlag: 'core-shell',
  },
  {
    id: `${view.toUpperCase()}-TODAY`,
    label: 'Today',
    route: `${base}/today`,
    view,
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner', 'readonly'],
    requiredPlan: 'personal',
    featureFlag: 'core-shell',
  },
  {
    id: `${view.toUpperCase()}-TASKS`,
    label: 'Tasks',
    route: `${base}/tasks`,
    view,
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner', 'readonly'],
    requiredPlan: 'personal',
    featureFlag: 'tasks',
  },
  {
    id: `${view.toUpperCase()}-GOALS`,
    label: 'Goals & Milestones',
    route: `${base}/goals`,
    view,
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner', 'readonly'],
    requiredPlan: 'team',
    featureFlag: 'goals',
  },
]

const opsObjectItems = (): NavItemConfig[] => [
  {
    id: 'OPS-PROJECTS',
    label: 'Projects',
    route: '/projects',
    view: 'ops',
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner', 'readonly'],
    requiredPlan: 'personal',
    featureFlag: 'projects',
  },
  {
    id: 'OPS-SESSIONS',
    label: 'Sessions',
    route: '/sessions',
    view: 'ops',
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner', 'readonly'],
    requiredPlan: 'personal',
    featureFlag: 'sessions',
  },
]

/** L1 Surfaces - Pure data views, no AI */
const l1SurfaceItems = (view: OsViewId, base: string): NavItemConfig[] => [
  {
    id: `${view.toUpperCase()}-SPINE`,
    label: 'Spine',
    route: `${base}/spine`,
    view,
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner', 'readonly'],
    requiredPlan: 'team',
    featureFlag: 'spine',
  },
  {
    id: `${view.toUpperCase()}-CONTEXT`,
    label: 'Context',
    route: `${base}/context`,
    view,
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner', 'readonly'],
    requiredPlan: 'team',
    featureFlag: 'context',
  },
]

/** L2 Intelligence - AI/Cognitive features, opened via Cognitive Layer overlay */
const l2IntelligenceItems = (view: OsViewId, base: string): NavItemConfig[] => [
  {
    id: `${view.toUpperCase()}-IQ-HUB`,
    label: 'IQ Hub',
    route: `${base}/iq-hub`,
    view,
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner'],
    requiredPlan: 'org',
    featureFlag: 'iq-hub',
  },
  {
    id: `${view.toUpperCase()}-AGENT`,
    label: 'Agent',
    route: `${base}/agent`,
    view,
    requiredRoles: ['owner', 'admin', 'manager'],
    requiredPlan: 'org',
    featureFlag: 'agent',
  },
  {
    id: `${view.toUpperCase()}-BRAINSTORMING`,
    label: 'Brainstorming',
    route: `${base}/brainstorming`,
    view,
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner'],
    requiredPlan: 'team',
    featureFlag: 'brainstorming',
  },
]

const profileItems = (view: OsViewId, base: string): NavItemConfig[] => [
  {
    id: `${view.toUpperCase()}-PROFILE`,
    label: 'Profile',
    route: `${base}/profile`,
    view,
    requiredRoles: ['owner', 'admin', 'manager', 'practitioner', 'readonly'],
    requiredPlan: 'personal',
    featureFlag: 'profile',
  },
]

const adminItems: NavSectionConfig[] = [
  {
    id: 'control-plane',
    label: 'Control Plane',
    items: [
      {
        id: 'ADMIN-IQ-HUB',
        label: 'IQ Hub',
        route: '/admin/iq-hub',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'org',
        featureFlag: 'admin-iq-hub',
      },
      {
        id: 'ADMIN-POLICIES',
        label: 'Policies',
        route: '/admin/policies',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'org',
        featureFlag: 'admin-policies',
      },
      {
        id: 'ADMIN-FEATURES',
        label: 'Features',
        route: '/admin/features',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'org',
        featureFlag: 'admin-features',
      },
      {
        id: 'ADMIN-RELEASES',
        label: 'Releases',
        route: '/admin/releases',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'org',
        featureFlag: 'admin-releases',
      },
    ],
  },
  {
    id: 'identity-access',
    label: 'Identity & Access',
    items: [
      {
        id: 'ADMIN-USERS',
        label: 'Users',
        route: '/admin/users',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'team',
        featureFlag: 'admin-users',
      },
      {
        id: 'ADMIN-ROLES',
        label: 'Roles',
        route: '/admin/roles',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'team',
        featureFlag: 'admin-roles',
      },
      {
        id: 'ADMIN-PERMISSIONS',
        label: 'Permissions',
        route: '/admin/permissions',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'team',
        featureFlag: 'admin-permissions',
      },
    ],
  },
  {
    id: 'tenant-billing',
    label: 'Tenant & Billing',
    items: [
      {
        id: 'ADMIN-BILLING',
        label: 'Billing',
        route: '/admin/billing',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'team',
        featureFlag: 'admin-billing',
      },
      {
        id: 'ADMIN-USAGE',
        label: 'Usage',
        route: '/admin/usage',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'team',
        featureFlag: 'admin-usage',
      },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    items: [
      {
        id: 'ADMIN-DATA-SOURCES',
        label: 'Data Sources',
        route: '/admin/data-sources',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'org',
        featureFlag: 'admin-data-sources',
      },
      {
        id: 'ADMIN-WEBHOOKS',
        label: 'Webhooks',
        route: '/admin/webhooks',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'org',
        featureFlag: 'admin-webhooks',
      },
    ],
  },
  {
    id: 'audit',
    label: 'Audit',
    items: [
      {
        id: 'ADMIN-AUDIT',
        label: 'Audit Log',
        route: '/admin/audit',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'enterprise',
        featureFlag: 'admin-audit',
      },
      {
        id: 'ADMIN-EXECUTIONS',
        label: 'Executions',
        route: '/admin/executions',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'enterprise',
        featureFlag: 'admin-executions',
      },
      {
        id: 'ADMIN-MIGRATIONS',
        label: 'Migrations',
        route: '/admin/migrations',
        view: 'admin',
        requiredRoles: ['owner', 'admin'],
        requiredPlan: 'enterprise',
        featureFlag: 'admin-migrations',
      },
    ],
  },
]

export const OS_VIEW_CONFIGS: Record<OsViewId, ViewConfig> = {
  personal: {
    id: 'personal',
    label: 'Personal',
    defaultItemId: 'PERSONAL-HOME',
    worldScope: 'personal',
    navSections: [
      { id: 'core', label: 'Core', items: coreItems('personal', '/personal') },
      { id: 'surfaces', label: 'Surfaces', items: l1SurfaceItems('personal', '/personal') },
      { id: 'intelligence', label: 'Intelligence', items: l2IntelligenceItems('personal', '/personal') },
      { id: 'profile', label: 'Profile', items: profileItems('personal', '/personal') },
    ],
  },
  ops: {
    id: 'ops',
    label: 'Operations',
    defaultItemId: 'OPS-HOME',
    worldScope: 'work',
    navSections: [
      { id: 'core', label: 'Work', items: coreItems('ops', '/ops') },
      { id: 'ops-objects', label: 'Ops Objects', items: opsObjectItems() },
      { id: 'surfaces', label: 'Surfaces', items: l1SurfaceItems('ops', '/ops') },
      { id: 'intelligence', label: 'Intelligence', items: l2IntelligenceItems('ops', '/ops') },
      { id: 'profile', label: 'Profile', items: profileItems('ops', '/ops') },
    ],
  },
  sales: {
    id: 'sales',
    label: 'Sales',
    defaultItemId: 'SALES-HOME',
    worldScope: 'work',
    navSections: [
      { id: 'core', label: 'Core', items: coreItems('sales', '/sales') },
      { id: 'surfaces', label: 'Surfaces', items: l1SurfaceItems('sales', '/sales') },
      { id: 'intelligence', label: 'Intelligence', items: l2IntelligenceItems('sales', '/sales') },
      { id: 'profile', label: 'Profile', items: profileItems('sales', '/sales') },
    ],
  },
  marketing: {
    id: 'marketing',
    label: 'Marketing',
    defaultItemId: 'MARKETING-HOME',
    worldScope: 'work',
    navSections: [
      { id: 'core', label: 'Core', items: coreItems('marketing', '/marketing') },
      { id: 'surfaces', label: 'Surfaces', items: l1SurfaceItems('marketing', '/marketing') },
      { id: 'intelligence', label: 'Intelligence', items: l2IntelligenceItems('marketing', '/marketing') },
      { id: 'profile', label: 'Profile', items: profileItems('marketing', '/marketing') },
    ],
  },
  cs: {
    id: 'cs',
    label: 'Customer Success',
    defaultItemId: 'CS-HOME',
    worldScope: 'work',
    navSections: [
      { id: 'core', label: 'Core', items: coreItems('cs', '/cs') },
      { id: 'surfaces', label: 'Surfaces', items: l1SurfaceItems('cs', '/cs') },
      { id: 'intelligence', label: 'Intelligence', items: l2IntelligenceItems('cs', '/cs') },
      { id: 'profile', label: 'Profile', items: profileItems('cs', '/cs') },
    ],
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    defaultItemId: 'PROJECTS-HOME',
    worldScope: 'work',
    navSections: [
      { id: 'core', label: 'Core', items: coreItems('projects', '/projects') },
      { id: 'surfaces', label: 'Surfaces', items: l1SurfaceItems('projects', '/projects') },
      { id: 'intelligence', label: 'Intelligence', items: l2IntelligenceItems('projects', '/projects') },
      { id: 'profile', label: 'Profile', items: profileItems('projects', '/projects') },
    ],
  },
  accounts: {
    id: 'accounts',
    label: 'Accounts',
    defaultItemId: 'ACCOUNTS-HOME',
    worldScope: 'accounts',
    navSections: [
      { id: 'core', label: 'Core', items: coreItems('accounts', '/accounts') },
      { id: 'surfaces', label: 'Surfaces', items: l1SurfaceItems('accounts', '/accounts') },
      { id: 'intelligence', label: 'Intelligence', items: l2IntelligenceItems('accounts', '/accounts') },
      { id: 'profile', label: 'Profile', items: profileItems('accounts', '/accounts') },
    ],
  },
  admin: {
    id: 'admin',
    label: 'Admin',
    defaultItemId: 'ADMIN-IQ-HUB',
    worldScope: 'admin',
    navSections: adminItems,
  },
}

export const OS_VIEW_ORDER: OsViewId[] = ['ops', 'sales', 'marketing', 'cs', 'projects', 'admin']

export const OS_NAV_ITEM_REGISTRY: Record<string, NavItemConfig> = Object.values(OS_VIEW_CONFIGS)
  .flatMap((view) => view.navSections.flatMap((section) => section.items))
  .reduce<Record<string, NavItemConfig>>((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})

export const getViewByPath = (pathname: string): OsViewId | null => {
  if (pathname.startsWith('/personal/')) return 'personal'
  if (pathname.startsWith('/ops/')) return 'ops'
  if (pathname.startsWith('/sales/')) return 'sales'
  if (pathname.startsWith('/marketing/')) return 'marketing'
  if (pathname.startsWith('/cs/')) return 'cs'
  if (pathname.startsWith('/projects/')) return 'projects'
  if (pathname.startsWith('/accounts/')) return 'accounts'
  if (pathname.startsWith('/admin/')) return 'admin'
  return null
}

export const getNavItemByRoute = (route: string): NavItemConfig | undefined =>
  Object.values(OS_NAV_ITEM_REGISTRY).find((item) => item.route === route)
