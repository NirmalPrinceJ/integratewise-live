/**
 * RBAC Role Configurations
 * Complete role definitions with permissions and shell assignments
 */

import { RoleConfig, UserRole, Permission } from './types';

// ============================================================================
// CUSTOMER SUCCESS ROLES
// ============================================================================

export const CS_ROLES: Record<string, RoleConfig> = {
  'cs-chief': {
    id: 'cs-chief',
    title: 'Chief Customer Officer',
    level: 'c-suite',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:admin', 'tasks:write', 'calendar:write', 'docs:write',
      'accounts:read', 'accounts:write', 'health:read', 'health:write',
      'risks:read', 'risks:write', 'success-plans:read', 'success-plans:write',
      'analytics:read', 'ai:read', 'signals:read', 'audit:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'health', 'risks', 'analytics', 'ai'],
    deepViews: ['executive-dashboard', 'account-master', 'risk-register', 'success-plans', 'team-performance'],
    description: 'Executive oversight of entire CS organization'
  },
  'cs-vp': {
    id: 'cs-vp',
    title: 'VP Customer Success',
    level: 'vp',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write',
      'accounts:read', 'accounts:write', 'health:read', 'health:write',
      'risks:read', 'risks:write', 'success-plans:read', 'success-plans:write',
      'analytics:read', 'ai:read', 'signals:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'health', 'risks', 'analytics', 'ai'],
    deepViews: ['strategic-dashboard', 'account-master', 'risk-register', 'success-plans', 'team-performance'],
    description: 'Strategic CS direction and multi-team management'
  },
  'cs-director': {
    id: 'cs-director',
    title: 'Director of CS',
    level: 'director',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write',
      'accounts:read', 'accounts:write', 'health:read', 'health:write',
      'risks:read', 'risks:write', 'success-plans:read', 'success-plans:write',
      'analytics:read', 'ai:read', 'signals:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'health', 'risks', 'analytics', 'ai'],
    deepViews: ['account-master', 'risk-register', 'success-plans', 'engagement-log', 'team-performance'],
    description: 'Multi-team CS management'
  },
  'cs-manager': {
    id: 'cs-manager',
    title: 'CS Manager',
    level: 'manager',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write',
      'accounts:read', 'accounts:write', 'health:read', 'health:write',
      'risks:read', 'risks:write', 'success-plans:read', 'success-plans:write',
      'analytics:read', 'ai:read', 'signals:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'health', 'tasks', 'analytics', 'ai'],
    deepViews: ['account-master', 'risk-register', 'success-plans', 'engagement-log'],
    description: 'Team of CSMs management'
  },
  'cs-senior': {
    id: 'cs-senior',
    title: 'Senior CSM',
    level: 'senior',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write',
      'accounts:read', 'accounts:write', 'health:read', 'health:write',
      'risks:read', 'risks:write', 'success-plans:read', 'success-plans:write',
      'analytics:read', 'ai:read', 'signals:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'health', 'tasks', 'ai'],
    deepViews: ['account-master', 'risk-register', 'success-plans', 'engagement-log', 'stakeholder-outcomes'],
    description: 'Enterprise accounts (high-value)'
  },
  'csm': {
    id: 'csm',
    title: 'Customer Success Manager',
    level: 'ic',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write',
      'accounts:read', 'accounts:write', 'health:read', 'health:write',
      'risks:read', 'success-plans:read', 'success-plans:write',
      'analytics:read', 'ai:read', 'signals:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'health', 'tasks', 'ai'],
    deepViews: ['account-master', 'success-plans', 'engagement-log'],
    description: 'Mid-market accounts'
  },
  'cs-associate': {
    id: 'cs-associate',
    title: 'Associate CSM',
    level: 'junior',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write',
      'accounts:read', 'accounts:write', 'health:read', 'success-plans:read',
      'analytics:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'health', 'tasks'],
    deepViews: ['account-master', 'engagement-log'],
    description: 'SMB accounts (entry-level)'
  },
  'cs-technical': {
    id: 'cs-technical',
    title: 'Technical CSM',
    level: 'specialist',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write',
      'accounts:read', 'accounts:write', 'health:read', 'health:write',
      'risks:read', 'risks:write', 'success-plans:read', 'success-plans:write',
      'analytics:read', 'ai:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'health', 'api-portfolio', 'platform-health', 'ai'],
    deepViews: ['account-master', 'api-portfolio', 'platform-health', 'technical-dashboard'],
    description: 'Technical accounts requiring deep product knowledge'
  },
  'cs-onboarding': {
    id: 'cs-onboarding',
    title: 'Onboarding Specialist',
    level: 'specialist',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write',
      'accounts:read', 'accounts:write', 'health:read', 'success-plans:read', 'success-plans:write'
    ],
    defaultModules: ['home', 'today', 'accounts', 'onboarding', 'tasks'],
    deepViews: ['onboarding-tracker', 'implementation-plans', 'training-progress'],
    description: 'New customer onboarding focus'
  },
  'cs-renewals': {
    id: 'cs-renewals',
    title: 'Renewal Manager',
    level: 'specialist',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write',
      'accounts:read', 'accounts:write', 'health:read', 'success-plans:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'renewals', 'forecasts'],
    deepViews: ['renewal-pipeline', 'churn-risk', 'expansion-opps'],
    description: 'Renewal focus'
  },
  'cs-expansion': {
    id: 'cs-expansion',
    title: 'Expansion Manager',
    level: 'specialist',
    department: 'customer-success',
    shell: 'account-success',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write',
      'accounts:read', 'accounts:write', 'health:read', 'analytics:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'expansion', 'analytics'],
    deepViews: ['expansion-pipeline', 'upsell-opps', 'usage-analytics'],
    description: 'Upsell/growth focus'
  },
  'cs-support': {
    id: 'cs-support',
    title: 'Support CSM',
    level: 'specialist',
    department: 'customer-success',
    shell: 'support',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write',
      'accounts:read', 'health:read', 'success-plans:read'
    ],
    defaultModules: ['home', 'today', 'accounts', 'tickets', 'health'],
    deepViews: ['ticket-analysis', 'health-correlation'],
    description: 'Support-CS hybrid role'
  }
};

// ============================================================================
// SALES ROLES
// ============================================================================

export const SALES_ROLES: Record<string, RoleConfig> = {
  'cro': {
    id: 'cro',
    title: 'Chief Revenue Officer',
    level: 'c-suite',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:admin', 'pipeline:read', 'pipeline:write', 'deals:read', 'deals:write',
      'contacts:read', 'contacts:write', 'forecasts:read', 'forecasts:write',
      'analytics:read', 'analytics:write', 'ai:read', 'signals:read'
    ],
    defaultModules: ['home', 'today', 'pipeline', 'forecasts', 'analytics', 'team', 'ai'],
    description: 'Revenue strategy and executive oversight'
  },
  'sales-vp': {
    id: 'sales-vp',
    title: 'VP of Sales',
    level: 'vp',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:write', 'pipeline:read', 'pipeline:write', 'deals:read', 'deals:write',
      'contacts:read', 'contacts:write', 'forecasts:read', 'forecasts:write',
      'analytics:read', 'ai:read'
    ],
    defaultModules: ['home', 'today', 'pipeline', 'deals', 'forecasts', 'analytics', 'team', 'ai'],
    description: 'Sales leadership and strategy'
  },
  'sales-director': {
    id: 'sales-director',
    title: 'Sales Director',
    level: 'director',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:write', 'pipeline:read', 'pipeline:write', 'deals:read', 'deals:write',
      'contacts:read', 'contacts:write', 'forecasts:read', 'analytics:read', 'ai:read'
    ],
    defaultModules: ['home', 'today', 'pipeline', 'deals', 'contacts', 'forecasts', 'ai'],
    description: 'Regional or segment sales management'
  },
  'sales-manager': {
    id: 'sales-manager',
    title: 'Sales Manager',
    level: 'manager',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:write', 'pipeline:read', 'pipeline:write', 'deals:read', 'deals:write',
      'contacts:read', 'contacts:write', 'forecasts:read', 'analytics:read', 'ai:read'
    ],
    defaultModules: ['home', 'today', 'pipeline', 'deals', 'contacts', 'activities', 'ai'],
    description: 'Direct team management'
  },
  'ae-enterprise': {
    id: 'ae-enterprise',
    title: 'Enterprise AE',
    level: 'senior',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:write', 'pipeline:read', 'pipeline:write', 'deals:read', 'deals:write',
      'contacts:read', 'contacts:write', 'forecasts:read', 'analytics:read', 'ai:read'
    ],
    defaultModules: ['home', 'today', 'pipeline', 'deals', 'contacts', 'activities', 'ai'],
    deepViews: ['enterprise-deals', 'account-planning', 'multi-threading'],
    description: '$1M+ deals'
  },
  'ae-midmarket': {
    id: 'ae-midmarket',
    title: 'Mid-Market AE',
    level: 'ic',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:write', 'pipeline:read', 'pipeline:write', 'deals:read', 'deals:write',
      'contacts:read', 'contacts:write', 'forecasts:read', 'ai:read'
    ],
    defaultModules: ['home', 'today', 'pipeline', 'deals', 'contacts', 'activities', 'ai'],
    description: '$100K-$1M deals'
  },
  'ae-smb': {
    id: 'ae-smb',
    title: 'SMB AE',
    level: 'junior',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:write', 'pipeline:read', 'pipeline:write', 'deals:read', 'deals:write',
      'contacts:read', 'contacts:write', 'ai:read'
    ],
    defaultModules: ['home', 'today', 'pipeline', 'deals', 'contacts', 'ai'],
    description: '<$100K deals'
  },
  'sdr-manager': {
    id: 'sdr-manager',
    title: 'SDR Manager',
    level: 'manager',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:write', 'contacts:read', 'contacts:write', 'analytics:read'
    ],
    defaultModules: ['home', 'today', 'leads', 'sequences', 'analytics', 'team'],
    description: 'Lead generation team management'
  },
  'sdr': {
    id: 'sdr',
    title: 'Sales Development Rep',
    level: 'junior',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:write', 'contacts:read', 'contacts:write'
    ],
    defaultModules: ['home', 'today', 'leads', 'sequences', 'tasks'],
    description: 'Prospecting and qualification'
  },
  'sales-engineer': {
    id: 'sales-engineer',
    title: 'Solutions Engineer',
    level: 'specialist',
    department: 'sales',
    shell: 'sales-ops',
    permissions: [
      'core:write', 'pipeline:read', 'deals:read', 'contacts:read',
      'analytics:read', 'ai:read'
    ],
    defaultModules: ['home', 'today', 'deals', 'technical-demos', 'povs', 'ai'],
    description: 'Technical sales support'
  }
};

// ============================================================================
// PERSONAL ROLES
// ============================================================================

export const PERSONAL_ROLES: Record<string, RoleConfig> = {
  'personal-pro': {
    id: 'personal-pro',
    title: 'Professional',
    level: 'ic',
    department: 'personal',
    shell: 'personal',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write', 'notes:read', 'notes:write'
    ],
    defaultModules: ['home', 'today', 'tasks', 'calendar', 'notes', 'docs', 'goals'],
    description: 'Self-employed professional'
  },
  'personal-student': {
    id: 'personal-student',
    title: 'Student',
    level: 'junior',
    department: 'personal',
    shell: 'personal',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'notes:read', 'notes:write'
    ],
    defaultModules: ['home', 'today', 'tasks', 'calendar', 'notes', 'study-plans'],
    description: 'Student account with educational focus'
  },
  'personal-freelancer': {
    id: 'personal-freelancer',
    title: 'Freelancer',
    level: 'ic',
    department: 'personal',
    shell: 'personal',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write'
    ],
    defaultModules: ['home', 'today', 'tasks', 'calendar', 'projects', 'invoicing', 'clients'],
    description: 'Freelance worker'
  },
  'personal-consultant': {
    id: 'personal-consultant',
    title: 'Consultant',
    level: 'ic',
    department: 'personal',
    shell: 'personal',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write', 'notes:write'
    ],
    defaultModules: ['home', 'today', 'tasks', 'calendar', 'clients', 'projects', 'deliverables'],
    description: 'Independent consultant'
  },
  'personal-entrepreneur': {
    id: 'personal-entrepreneur',
    title: 'Entrepreneur',
    level: 'ic',
    department: 'personal',
    shell: 'personal',
    permissions: [
      'core:write', 'tasks:write', 'calendar:write', 'docs:write', 'notes:write'
    ],
    defaultModules: ['home', 'today', 'tasks', 'calendar', 'business-plan', 'milestones', 'metrics'],
    description: 'Startup founder'
  }
};

// ============================================================================
// ADMIN ROLES
// ============================================================================

export const ADMIN_ROLES: Record<string, RoleConfig> = {
  'super-admin': {
    id: 'super-admin',
    title: 'Super Admin',
    level: 'c-suite',
    department: 'admin-platform',
    shell: 'admin',
    permissions: ['core:admin', 'users:read', 'users:write', 'users:delete', 'rbac:read', 'rbac:write', 'tenants:read', 'tenants:write', 'billing:read', 'billing:write', 'audit:read'],
    defaultModules: ['dashboard', 'users', 'roles', 'permissions', 'tenants', 'billing', 'audit', 'system', 'integrations'],
    description: 'Full platform access'
  },
  'admin': {
    id: 'admin',
    title: 'Platform Admin',
    level: 'director',
    department: 'admin-platform',
    shell: 'admin',
    permissions: ['core:admin', 'users:read', 'users:write', 'rbac:read', 'rbac:write', 'tenants:read', 'billing:read', 'audit:read'],
    defaultModules: ['dashboard', 'users', 'roles', 'permissions', 'billing', 'audit', 'integrations'],
    description: 'Admin functions without super-admin powers'
  },
  'tenant-admin': {
    id: 'tenant-admin',
    title: 'Tenant Admin',
    level: 'manager',
    department: 'admin-platform',
    shell: 'admin',
    permissions: ['core:write', 'users:read', 'users:write', 'billing:read', 'audit:read'],
    defaultModules: ['dashboard', 'users', 'billing', 'settings'],
    description: 'Tenant-scoped admin'
  }
};

// ============================================================================
// ALL ROLES COMBINED
// ============================================================================

export const ALL_ROLES: Record<string, RoleConfig> = {
  ...CS_ROLES,
  ...SALES_ROLES,
  ...PERSONAL_ROLES,
  ...ADMIN_ROLES
  // Add more as needed...
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getRoleConfig(roleId: string): RoleConfig | undefined {
  return ALL_ROLES[roleId];
}

export function getShellForRole(roleId: string): string {
  const role = getRoleConfig(roleId);
  return role?.shell || 'personal';
}

export function getPermissionsForRole(roleId: string): Permission[] {
  const role = getRoleConfig(roleId);
  return role?.permissions || [];
}

export function hasPermission(roleId: string, permission: Permission): boolean {
  const permissions = getPermissionsForRole(roleId);
  return permissions.includes(permission) || permissions.includes('core:admin');
}

export function getDefaultModulesForRole(roleId: string): string[] {
  const role = getRoleConfig(roleId);
  return role?.defaultModules || ['home', 'today', 'tasks'];
}
