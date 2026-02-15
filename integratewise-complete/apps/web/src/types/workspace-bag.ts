// src/types/workspace-bag.ts
// Customizable L1 Workspace - Module Registry + Bag System
// 
// Architecture:
// - Module Registry (shipped by us) - defines capabilities
// - User Workspace Layout (controlled by user) - customization within bounds
// - View Registry (controlled by us) - default workspaces per role

import type { DataStrengthLevel } from './data-strength';

// ═══════════════════════════════════════════════════════════════
// MODULE REGISTRY (Shipped by us - defines capabilities)
// ═══════════════════════════════════════════════════════════════

export interface L1Module {
    id: string;
    name: string;
    icon: string;
    route: string;
    category: ViewCategory;
    description: string;

    // ─────────────────────────────────────────────────────────────
    // Data Contracts (what this module needs)
    // ─────────────────────────────────────────────────────────────
    dataContract: ModuleDataContract;

    // ─────────────────────────────────────────────────────────────
    // Widgets this module can expose to Home
    // ─────────────────────────────────────────────────────────────
    widgets: ModuleWidget[];

    // ─────────────────────────────────────────────────────────────
    // Unlock conditions
    // ─────────────────────────────────────────────────────────────
    unlockCondition: ViewUnlockCondition;

    // UI state
    isFixed?: boolean;        // Cannot be removed (only Home)
    defaultInBag?: boolean;   // Added by default for new users
}

// Alias for backwards compatibility
export type L1View = L1Module;

// ═══════════════════════════════════════════════════════════════
// DATA CONTRACTS (per module)
// ═══════════════════════════════════════════════════════════════

export interface ModuleDataContract {
    // Minimum data to show module (even sparse)
    required_data: DataRequirement[];

    // Data that enhances the experience
    optional_data: DataRequirement[];

    // SSOT anchors this module reads from
    anchors: ('spine' | 'context' | 'knowledge')[];
}

export interface DataRequirement {
    type: 'tool' | 'entity' | 'document' | 'manual';
    sources: string[];  // Tool IDs or entity types
    any?: boolean;      // Any one of sources, or all
    description: string;
}

// Coverage state for a module
export type ModuleCoverageState = 'ready' | 'sparse' | 'missing';

// ═══════════════════════════════════════════════════════════════
// WIDGETS (Pinnable to Home from modules)
// ═══════════════════════════════════════════════════════════════

export interface ModuleWidget {
    id: string;
    moduleId: string;
    name: string;
    description: string;
    size: 'small' | 'medium' | 'large';  // Grid size

    // What data this widget needs
    minCoverage: ModuleCoverageState;
}

// ═══════════════════════════════════════════════════════════════
// FIXED HOME SKELETON (Non-negotiable blocks)
// ═══════════════════════════════════════════════════════════════

export interface HomeSkeletonBlock {
    id: string;
    name: string;
    order: number;
    isFixed: true;
    description: string;
    icon: string;
}

export const HOME_SKELETON_BLOCKS: HomeSkeletonBlock[] = [
    {
        id: 'today-strip',
        name: 'Today Strip',
        order: 1,
        isFixed: true,
        icon: 'CalendarDays',
        description: 'Calendar + Tasks + Meetings for today'
    },

    {
        id: 'work-queue',
        name: 'My Work Queue',
        order: 3,
        isFixed: true,
        icon: 'ListTodo',
        description: 'Tasks + Approvals + Drafts awaiting action'
    },
    {
        id: 'recent-knowledge',
        name: 'Recent Knowledge',
        order: 4,
        isFixed: true,
        icon: 'BookOpen',
        description: 'Docs, notes, and chat history'
    },
    {
        id: 'connect-next',
        name: 'Connect Next Tool',
        order: 5,
        isFixed: true,
        icon: 'Plug',
        description: 'Guided CTA based on data gaps'
    }
];

// ═══════════════════════════════════════════════════════════════
// VIEW CATEGORIES
// ═══════════════════════════════════════════════════════════════

export type ViewCategory =
    | 'core'         // Home - always fixed
    | 'work'         // Projects, Docs, Tasks, Calendar, Notes, Meetings
    | 'customers'    // Accounts, Contacts, Pipeline
    | 'intelligence' // Knowledge, Risks, Expansion, Analytics
    | 'personal'     // Notes
    | 'team';        // Team

// ═══════════════════════════════════════════════════════════════
// VIEW UNLOCK CONDITIONS
// ═══════════════════════════════════════════════════════════════

export type ViewUnlockCondition =
    | { type: 'always' }
    | { type: 'tool_connected'; tools: string[]; any?: boolean }
    | { type: 'data_strength'; minLevel: DataStrengthLevel }
    | { type: 'entity_count'; entity: string; minCount: number }
    | { type: 'plan'; minPlan: PlanTier }
    | { type: 'team_size'; minSize: number }
    | { type: 'composite'; conditions: ViewUnlockCondition[]; operator: 'AND' | 'OR' };

export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise';

// ═══════════════════════════════════════════════════════════════
// USER WORKSPACE BAG (Controlled by user - within bounds)
// ═══════════════════════════════════════════════════════════════

export interface UserWorkspaceBag {
    user_id: string;

    // Modules in current bag (ordered) - module IDs
    active_modules: string[];

    // Widgets pinned to Home (from approved widget set)
    pinned_widgets: PinnedWidget[];

    // Module-specific settings
    module_settings: Record<string, ModuleSettings>;

    // Layout preferences
    sidebar_collapsed: boolean;
    sidebar_position: 'left' | 'right';

    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface PinnedWidget {
    widget_id: string;
    module_id: string;
    order: number;
    // Position in home grid (optional)
    grid_position?: { row: number; col: number };
}

export interface ModuleSettings {
    // Per-module customization
    default_filters?: Record<string, unknown>;
    columns_visible?: string[];
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    layout?: 'grid' | 'list' | 'kanban' | 'table';

    // Custom label (user can rename modules)
    custom_label?: string;
}

// Backwards compat alias
export type ViewSettings = ModuleSettings;

// ═══════════════════════════════════════════════════════════════
// MODULE REGISTRY (All available modules)
// ═══════════════════════════════════════════════════════════════

export const L1_MODULES: L1Module[] = [
    // ─────────────────────────────────────────────────────────────
    // CORE (Fixed)
    // ─────────────────────────────────────────────────────────────
    {
        id: 'home',
        name: 'Home',
        icon: 'Home',
        route: '/personal',
        category: 'core',
        isFixed: true,
        defaultInBag: true,
        unlockCondition: { type: 'always' },
        description: 'Your personalized dashboard with fixed skeleton',
        dataContract: {
            required_data: [],
            optional_data: [
                { type: 'tool', sources: ['*'], any: true, description: 'Any connected tool enriches Home' }
            ],
            anchors: ['spine', 'context', 'knowledge']
        },
        widgets: [] // Home doesn't have pinnable widgets (it IS the home)
    },

    // ─────────────────────────────────────────────────────────────
    // WORK
    // ─────────────────────────────────────────────────────────────
    {
        id: 'projects',
        name: 'Projects',
        icon: 'FolderKanban',
        route: '/projects',
        category: 'work',
        defaultInBag: true,
        unlockCondition: { type: 'always' },
        description: 'Manage your projects and initiatives',
        dataContract: {
            required_data: [],
            optional_data: [
                { type: 'tool', sources: ['jira', 'asana', 'linear'], any: true, description: 'Project management tool' }
            ],
            anchors: ['spine']
        },
        widgets: [
            { id: 'projects-active', moduleId: 'projects', name: 'Active Projects', description: 'Your active projects', size: 'medium', minCoverage: 'sparse' },
            { id: 'projects-recent', moduleId: 'projects', name: 'Recent Activity', description: 'Recent project updates', size: 'small', minCoverage: 'ready' }
        ]
    },
    {
        id: 'meetings',
        name: 'Meetings',
        icon: 'CalendarClock',
        route: '/personal/meetings',
        category: 'work',
        defaultInBag: true,
        unlockCondition: {
            type: 'tool_connected',
            tools: ['google_calendar', 'outlook_calendar', 'zoom', 'teams'],
            any: true
        },
        description: 'View and prepare for upcoming meetings',
        dataContract: {
            required_data: [
                { type: 'tool', sources: ['google_calendar', 'outlook_calendar', 'zoom', 'teams'], any: true, description: 'Calendar or meeting tool' }
            ],
            optional_data: [
                { type: 'entity', sources: ['contact', 'account'], any: true, description: 'CRM data enriches attendee info' }
            ],
            anchors: ['spine', 'context']
        },
        widgets: [
            { id: 'meetings-today', moduleId: 'meetings', name: 'Today\'s Meetings', description: 'Meetings for today', size: 'medium', minCoverage: 'sparse' },
            { id: 'meetings-upcoming', moduleId: 'meetings', name: 'Upcoming', description: 'Next 5 meetings', size: 'small', minCoverage: 'sparse' }
        ]
    },
    {
        id: 'docs',
        name: 'Docs',
        icon: 'FileText',
        route: '/personal/docs',
        category: 'work',
        unlockCondition: { type: 'always' },
        description: 'Documents from all your tools',
        dataContract: {
            required_data: [],
            optional_data: [
                { type: 'tool', sources: ['google_drive', 'notion', 'confluence'], any: true, description: 'Document source' }
            ],
            anchors: ['context', 'knowledge']
        },
        widgets: [
            { id: 'docs-recent', moduleId: 'docs', name: 'Recent Docs', description: 'Recently accessed documents', size: 'medium', minCoverage: 'sparse' }
        ]
    },
    {
        id: 'tasks',
        name: 'Tasks',
        icon: 'CheckSquare',
        route: '/tasks',
        category: 'work',
        unlockCondition: { type: 'always' },
        description: 'Track your to-dos and action items',
        dataContract: {
            required_data: [],
            optional_data: [
                { type: 'tool', sources: ['jira', 'asana', 'linear', 'todoist'], any: true, description: 'Task source' }
            ],
            anchors: ['spine']
        },
        widgets: [
            { id: 'tasks-my', moduleId: 'tasks', name: 'My Tasks', description: 'Your assigned tasks', size: 'medium', minCoverage: 'sparse' },
            { id: 'tasks-due', moduleId: 'tasks', name: 'Due Soon', description: 'Tasks due this week', size: 'small', minCoverage: 'sparse' }
        ]
    },
    {
        id: 'calendar',
        name: 'Calendar',
        icon: 'Calendar',
        route: '/personal/calendar',
        category: 'work',
        unlockCondition: {
            type: 'tool_connected',
            tools: ['google_calendar', 'outlook_calendar'],
            any: true
        },
        description: 'Unified calendar view',
        dataContract: {
            required_data: [
                { type: 'tool', sources: ['google_calendar', 'outlook_calendar'], any: true, description: 'Calendar' }
            ],
            optional_data: [],
            anchors: ['spine']
        },
        widgets: [
            { id: 'calendar-week', moduleId: 'calendar', name: 'This Week', description: 'Week view', size: 'large', minCoverage: 'ready' }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    // PERSONAL
    // ─────────────────────────────────────────────────────────────
    {
        id: 'notes',
        name: 'Notes',
        icon: 'StickyNote',
        route: '/personal/notes',
        category: 'personal',
        unlockCondition: { type: 'always' },
        description: 'Your personal notes and scratchpad',
        dataContract: {
            required_data: [],
            optional_data: [
                { type: 'manual', sources: ['notes'], description: 'User-created notes' }
            ],
            anchors: ['context']
        },
        widgets: [
            { id: 'notes-pinned', moduleId: 'notes', name: 'Pinned Notes', description: 'Your pinned notes', size: 'small', minCoverage: 'sparse' }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    // CUSTOMERS
    // ─────────────────────────────────────────────────────────────
    {
        id: 'accounts',
        name: 'Accounts',
        icon: 'Building2',
        route: '/personal/accounts',
        category: 'customers',
        defaultInBag: true,
        unlockCondition: {
            type: 'tool_connected',
            tools: ['hubspot', 'salesforce', 'pipedrive', 'zoho_crm'],
            any: true
        },
        description: 'Company accounts and health scores',
        dataContract: {
            required_data: [
                { type: 'tool', sources: ['hubspot', 'salesforce', 'pipedrive'], any: true, description: 'CRM' },
            ],
            optional_data: [
                { type: 'entity', sources: ['contact', 'deal', 'ticket'], any: true, description: 'Related entities' },
                { type: 'document', sources: ['email', 'meeting_notes'], any: true, description: 'Communications' }
            ],
            anchors: ['spine', 'context', 'knowledge']
        },
        widgets: [
            { id: 'accounts-health', moduleId: 'accounts', name: 'Account Health', description: 'Health score distribution', size: 'medium', minCoverage: 'ready' },
            { id: 'accounts-atrisk', moduleId: 'accounts', name: 'At Risk', description: 'Accounts needing attention', size: 'small', minCoverage: 'ready' }
        ]
    },
    {
        id: 'contacts',
        name: 'Contacts',
        icon: 'Users',
        route: '/personal/contacts',
        category: 'customers',
        defaultInBag: true,
        unlockCondition: {
            type: 'tool_connected',
            tools: ['hubspot', 'salesforce', 'gmail', 'outlook'],
            any: true
        },
        description: 'People you work with',
        dataContract: {
            required_data: [
                { type: 'tool', sources: ['hubspot', 'salesforce', 'gmail', 'outlook'], any: true, description: 'CRM or email' }
            ],
            optional_data: [
                { type: 'entity', sources: ['account'], description: 'Company context' }
            ],
            anchors: ['spine', 'context']
        },
        widgets: [
            { id: 'contacts-recent', moduleId: 'contacts', name: 'Recent Contacts', description: 'Recently interacted', size: 'small', minCoverage: 'sparse' }
        ]
    },
    {
        id: 'pipeline',
        name: 'Pipeline',
        icon: 'TrendingUp',
        route: '/pipeline',
        category: 'customers',
        unlockCondition: {
            type: 'composite',
            operator: 'OR',
            conditions: [
                { type: 'entity_count', entity: 'deal', minCount: 1 },
                { type: 'tool_connected', tools: ['hubspot', 'salesforce', 'pipedrive'], any: true }
            ]
        },
        description: 'Sales and renewal pipeline',
        dataContract: {
            required_data: [
                { type: 'entity', sources: ['deal'], description: 'Deals/opportunities' }
            ],
            optional_data: [
                { type: 'entity', sources: ['account', 'contact'], any: true, description: 'Related entities' }
            ],
            anchors: ['spine']
        },
        widgets: [
            { id: 'pipeline-overview', moduleId: 'pipeline', name: 'Pipeline Overview', description: 'Deal stages', size: 'large', minCoverage: 'ready' },
            { id: 'pipeline-closing', moduleId: 'pipeline', name: 'Closing Soon', description: 'Deals closing this month', size: 'small', minCoverage: 'ready' }
        ]
    },

    // ─────────────────────────────────────────────────────────────
    // TEAM
    // ─────────────────────────────────────────────────────────────
    {
        id: 'team',
        name: 'Team',
        icon: 'Users2',
        route: '/personal/team',
        category: 'team',
        unlockCondition: {
            type: 'team_size',
            minSize: 2
        },
        description: 'Team activity and collaboration',
        dataContract: {
            required_data: [
                { type: 'entity', sources: ['user'], description: 'Team members' }
            ],
            optional_data: [],
            anchors: ['spine']
        },
        widgets: [
            { id: 'team-activity', moduleId: 'team', name: 'Team Activity', description: 'Recent team actions', size: 'medium', minCoverage: 'ready' }
        ]
    },


    {
        id: 'analytics',
        name: 'Analytics',
        icon: 'BarChart3',
        route: '/analytics',
        category: 'intelligence',
        unlockCondition: {
            type: 'composite',
            operator: 'AND',
            conditions: [
                { type: 'plan', minPlan: 'pro' },
                { type: 'data_strength', minLevel: 'growing' }
            ]
        },
        description: 'Advanced metrics and reports',
        dataContract: {
            required_data: [
                { type: 'entity', sources: ['account', 'deal', 'contact'], any: true, description: 'Data to analyze' }
            ],
            optional_data: [],
            anchors: ['spine', 'knowledge']
        },
        widgets: [
            { id: 'analytics-summary', moduleId: 'analytics', name: 'Key Metrics', description: 'Summary metrics', size: 'large', minCoverage: 'ready' }
        ]
    }
];

// Alias for backwards compatibility
export const L1_VIEWS = L1_MODULES;

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getModuleById(id: string): L1Module | undefined {
    return L1_MODULES.find(m => m.id === id);
}

// Alias
export function getViewById(id: string): L1View | undefined {
    return getModuleById(id);
}

export function getModulesByCategory(category: ViewCategory): L1Module[] {
    return L1_MODULES.filter(m => m.category === category);
}

export function getViewsByCategory(category: ViewCategory): L1View[] {
    return getModulesByCategory(category);
}

export function getDefaultModules(): L1Module[] {
    return L1_MODULES.filter(m => m.defaultInBag);
}

export function getDefaultViews(): L1View[] {
    return getDefaultModules();
}

export function getAllWidgets(): ModuleWidget[] {
    return L1_MODULES.flatMap(m => m.widgets);
}

export function getWidgetById(widgetId: string): ModuleWidget | undefined {
    return getAllWidgets().find(w => w.id === widgetId);
}

export function getDefaultBagForRole(role: string): string[] {
    const baseBag = ['home', 'projects'];

    switch (role) {
        case 'csm':
        case 'customer_success':
            return [...baseBag, 'accounts', 'contacts', 'meetings', 'pipeline'];

        case 'sales':
        case 'ae':
        case 'sdr':
            return [...baseBag, 'accounts', 'contacts', 'pipeline', 'calendar', 'meetings'];

        case 'founder':
        case 'executive':
        case 'ceo':
            return [...baseBag, 'accounts', 'analytics', 'team', 'pipeline'];

        case 'ops':
        case 'operations':
        case 'revops':
            return [...baseBag, 'tasks', 'docs', 'calendar', 'analytics'];

        default:
            return [...baseBag, 'tasks', 'notes', 'calendar'];
    }
}

// ═══════════════════════════════════════════════════════════════
// UNLOCK CONDITION CHECKER
// ═══════════════════════════════════════════════════════════════

export interface UnlockContext {
    connectedTools: string[];
    dataStrengthLevel: DataStrengthLevel;
    entityCounts: Record<string, number>;
    currentPlan: PlanTier;
    teamSize: number;
}

export function isModuleUnlocked(module: L1Module, context: UnlockContext): boolean {
    return checkCondition(module.unlockCondition, context);
}

// Alias
export function isViewUnlocked(view: L1View, context: UnlockContext): boolean {
    return isModuleUnlocked(view, context);
}

function checkCondition(condition: ViewUnlockCondition, context: UnlockContext): boolean {
    switch (condition.type) {
        case 'always':
            return true;

        case 'tool_connected':
            if (condition.any) {
                return condition.tools.some(tool => context.connectedTools.includes(tool));
            }
            return condition.tools.every(tool => context.connectedTools.includes(tool));

        case 'data_strength':
            return isLevelAtLeast(context.dataStrengthLevel, condition.minLevel);

        case 'entity_count':
            return (context.entityCounts[condition.entity] || 0) >= condition.minCount;

        case 'plan':
            return isPlanAtLeast(context.currentPlan, condition.minPlan);

        case 'team_size':
            return context.teamSize >= condition.minSize;

        case 'composite':
            if (condition.operator === 'AND') {
                return condition.conditions.every(c => checkCondition(c, context));
            }
            return condition.conditions.some(c => checkCondition(c, context));
    }
}

const LEVEL_ORDER: DataStrengthLevel[] = ['seed', 'growing', 'healthy', 'rich'];
const PLAN_ORDER: PlanTier[] = ['free', 'starter', 'pro', 'enterprise'];

function isLevelAtLeast(current: DataStrengthLevel, required: DataStrengthLevel): boolean {
    return LEVEL_ORDER.indexOf(current) >= LEVEL_ORDER.indexOf(required);
}

function isPlanAtLeast(current: PlanTier, required: PlanTier): boolean {
    return PLAN_ORDER.indexOf(current) >= PLAN_ORDER.indexOf(required);
}

// ═══════════════════════════════════════════════════════════════
// MODULE COVERAGE CALCULATOR
// ═══════════════════════════════════════════════════════════════

export function getModuleCoverage(
    module: L1Module,
    context: UnlockContext
): ModuleCoverageState {
    const { required_data, optional_data } = module.dataContract;

    // Check required data
    const hasRequired = required_data.length === 0 ||
        required_data.every(req => checkDataRequirement(req, context));

    if (!hasRequired) return 'missing';

    // Check optional data for "ready" vs "sparse"
    const optionalMet = optional_data.filter(opt => checkDataRequirement(opt, context));

    if (optional_data.length === 0 || optionalMet.length === optional_data.length) {
        return 'ready';
    }

    return 'sparse';
}

function checkDataRequirement(req: DataRequirement, context: UnlockContext): boolean {
    switch (req.type) {
        case 'tool':
            if (req.any) {
                return req.sources.includes('*')
                    ? context.connectedTools.length > 0
                    : req.sources.some(s => context.connectedTools.includes(s));
            }
            return req.sources.every(s => context.connectedTools.includes(s));

        case 'entity':
            if (req.any) {
                return req.sources.some(s => (context.entityCounts[s] || 0) > 0);
            }
            return req.sources.every(s => (context.entityCounts[s] || 0) > 0);

        case 'document':
        case 'manual':
            // For now, assume these are met if any tools connected
            return context.connectedTools.length > 0;
    }
}

// ═══════════════════════════════════════════════════════════════
// UNLOCK MESSAGE GENERATOR
// ═══════════════════════════════════════════════════════════════

export function getUnlockMessage(condition: ViewUnlockCondition): string {
    switch (condition.type) {
        case 'always':
            return 'Available';

        case 'tool_connected':
            const toolName = condition.tools[0]
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());
            return `Connect ${toolName}`;

        case 'data_strength':
            return `Need ${condition.minLevel} data`;

        case 'plan':
            return `${condition.minPlan.charAt(0).toUpperCase() + condition.minPlan.slice(1)} plan`;

        case 'team_size':
            return `Need ${condition.minSize}+ team members`;

        case 'entity_count':
            return `Need ${condition.entity}s`;

        case 'composite':
            return getUnlockMessage(condition.conditions[0]);
    }
}

// ═══════════════════════════════════════════════════════════════
// CATEGORY METADATA
// ═══════════════════════════════════════════════════════════════

export const VIEW_CATEGORIES: Record<ViewCategory, { label: string; icon: string; order: number }> = {
    core: { label: 'Core', icon: 'Home', order: 0 },
    work: { label: 'Work', icon: 'Briefcase', order: 1 },
    customers: { label: 'Customers', icon: 'Building2', order: 2 },
    intelligence: { label: 'Intelligence', icon: 'Brain', order: 3 },
    personal: { label: 'Personal', icon: 'User', order: 4 },
    team: { label: 'Team', icon: 'Users', order: 5 },
};
