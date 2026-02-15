/**
 * RBAC Types - Comprehensive Role-Based Access Control
 * 150+ roles, 50+ industries, 12 departments
 */

// ============================================================================
// ROLE HIERARCHY
// ============================================================================

export type RoleLevel = 'c-suite' | 'vp' | 'director' | 'manager' | 'senior' | 'ic' | 'junior' | 'specialist';

export type Department = 
  | 'customer-success'
  | 'sales'
  | 'revenue-operations'
  | 'marketing'
  | 'product-engineering'
  | 'finance'
  | 'people-hr'
  | 'operations'
  | 'legal-compliance'
  | 'support-services'
  | 'personal'
  | 'admin-platform';

// ============================================================================
// COMPREHENSIVE ROLE DEFINITIONS (150+)
// ============================================================================

export type UserRole =
  // Customer Success (12 roles)
  | 'cs-chief' | 'cs-vp' | 'cs-director' | 'cs-manager' | 'cs-senior' | 'csm'
  | 'cs-associate' | 'cs-technical' | 'cs-onboarding' | 'cs-renewals' | 'cs-expansion' | 'cs-support'
  // Sales (14 roles)
  | 'cro' | 'sales-vp' | 'sales-director' | 'sales-manager' | 'ae-enterprise' | 'ae-midmarket'
  | 'ae-smb' | 'sdr-manager' | 'sdr' | 'bdr' | 'sales-engineer' | 'sales-ops'
  | 'account-manager' | 'channel-partner'
  // Revenue Operations (10 roles)
  | 'revops-chief' | 'revops-vp' | 'revops-director' | 'revops-manager' | 'revops-analyst'
  | 'revops-forecast' | 'revops-data' | 'revops-systems' | 'revops-enablement' | 'revops-comp'
  // Marketing (16 roles)
  | 'cmo' | 'marketing-vp' | 'marketing-director' | 'marketing-manager' | 'demand-gen'
  | 'growth-marketer' | 'content-marketer' | 'product-marketer' | 'marketing-ops'
  | 'marketing-analyst' | 'email-marketer' | 'social-manager' | 'seo-specialist'
  | 'paid-media' | 'event-manager' | 'brand-manager'
  // Product & Engineering (23 roles)
  | 'cto' | 'cpo' | 'eng-vp' | 'product-vp' | 'eng-director' | 'product-director'
  | 'eng-manager' | 'pm-manager' | 'staff-engineer' | 'senior-engineer' | 'engineer'
  | 'junior-engineer' | 'product-manager' | 'associate-pm' | 'ux-researcher' | 'ux-designer'
  | 'qa-engineer' | 'devops-engineer' | 'data-engineer' | 'security-engineer' | 'sre'
  | 'tech-lead' | 'scrum-master'
  // Finance (17 roles)
  | 'cfo' | 'finance-vp' | 'finance-director' | 'controller' | 'finance-manager'
  | 'fpna-manager' | 'accountant' | 'senior-accountant' | 'financial-analyst' | 'fpna-analyst'
  | 'tax-specialist' | 'audit-specialist' | 'treasury-analyst' | 'payroll-specialist'
  | 'ar-specialist' | 'ap-specialist' | 'bookkeeper'
  // People & HR (17 roles)
  | 'chro' | 'people-vp' | 'people-director' | 'hr-manager' | 'hr-bp' | 'recruiter'
  | 'senior-recruiter' | 'talent-acquisition' | 'hr-generalist' | 'hr-coordinator'
  | 'compensation-analyst' | 'benefits-specialist' | 'hris-analyst' | 'learning-specialist'
  | 'employee-relations' | 'diversity-specialist' | 'people-analyst'
  // Operations (14 roles)
  | 'coo' | 'ops-vp' | 'ops-director' | 'ops-manager' | 'ops-analyst' | 'process-engineer'
  | 'program-manager' | 'project-manager' | 'scrum-master-ops' | 'business-analyst'
  | 'quality-manager' | 'supply-chain' | 'procurement' | 'vendor-manager'
  // Legal & Compliance (10 roles)
  | 'clo' | 'general-counsel' | 'legal-director' | 'legal-counsel' | 'paralegal'
  | 'compliance-officer' | 'privacy-officer' | 'contract-manager' | 'risk-manager'
  | 'ethics-officer'
  // Support & Services (10 roles)
  | 'support-director' | 'support-manager' | 'support-team-lead' | 'support-agent'
  | 'support-tier2' | 'support-tier3' | 'technical-writer' | 'knowledge-manager'
  | 'customer-education' | 'community-manager' | 'success-ops'
  // Personal (8 roles)
  | 'personal-pro' | 'personal-student' | 'personal-freelancer' | 'personal-consultant'
  | 'personal-creator' | 'personal-entrepreneur' | 'personal-investor' | 'personal-researcher'
  // Admin & Platform (9 roles)
  | 'super-admin' | 'admin' | 'tenant-admin' | 'billing-admin' | 'user-admin'
  | 'readonly-admin' | 'integrator' | 'partner-manager' | 'api-user';

// ============================================================================
// INDUSTRY DEFINITIONS (50+)
// ============================================================================

export type Industry =
  | 'saas' | 'fintech' | 'healthtech' | 'edtech' | 'ecommerce' | 'marketplace'
  | 'b2b' | 'b2c' | 'enterprise-software' | 'infrastructure' | 'cybersecurity'
  | 'ai-ml' | 'data-analytics' | 'dev-tools' | 'hr-tech' | 'real-estate'
  | 'legal-tech' | 'manufacturing' | 'logistics' | 'retail' | 'hospitality'
  | 'restaurant' | 'fitness' | 'media' | 'gaming' | 'nonprofit' | 'government'
  | 'education' | 'healthcare' | 'insurance' | 'banking' | 'investment'
  | 'consulting' | 'agency' | 'construction' | 'energy' | 'agriculture'
  | 'automotive' | 'telecom' | 'pharma' | 'biotech' | 'cleantech'
  | 'prop-tech' | 'insurtech' | 'regtech' | 'legal' | 'accounting'
  | 'recruiting' | 'events' | 'transportation' | 'warehouse' | 'construction-tech';

// ============================================================================
// SHELL TYPES (15 shells)
// ============================================================================

export type ShellType =
  | 'personal'
  | 'account-success'
  | 'sales-ops'
  | 'rev-ops'
  | 'marketing'
  | 'product'
  | 'engineering'
  | 'finance'
  | 'people'
  | 'operations'
  | 'legal'
  | 'support'
  | 'admin'
  | 'partner'
  | 'api';

// ============================================================================
// PERMISSIONS
// ============================================================================

export type Permission =
  // Core
  | 'core:read' | 'core:write' | 'core:delete' | 'core:admin'
  // Modules
  | 'tasks:read' | 'tasks:write' | 'tasks:delete'
  | 'calendar:read' | 'calendar:write'
  | 'docs:read' | 'docs:write' | 'docs:share'
  | 'notes:read' | 'notes:write'
  // CS
  | 'accounts:read' | 'accounts:write' | 'accounts:delete'
  | 'health:read' | 'health:write'
  | 'risks:read' | 'risks:write'
  | 'success-plans:read' | 'success-plans:write'
  // Sales
  | 'pipeline:read' | 'pipeline:write'
  | 'deals:read' | 'deals:write' | 'deals:delete'
  | 'contacts:read' | 'contacts:write'
  | 'forecasts:read' | 'forecasts:write'
  // RevOps
  | 'analytics:read' | 'analytics:write'
  | 'cohorts:read' | 'cohorts:write'
  | 'quotas:read' | 'quotas:write'
  // Marketing
  | 'campaigns:read' | 'campaigns:write' | 'campaigns:delete'
  | 'attribution:read' | 'attribution:write'
  | 'content:read' | 'content:write'
  // Product
  | 'roadmap:read' | 'roadmap:write'
  | 'feedback:read' | 'feedback:write'
  // Finance
  | 'budgets:read' | 'budgets:write'
  | 'expenses:read' | 'expenses:write' | 'expenses:approve'
  // Admin
  | 'users:read' | 'users:write' | 'users:delete'
  | 'rbac:read' | 'rbac:write'
  | 'tenants:read' | 'tenants:write'
  | 'billing:read' | 'billing:write'
  // L2 Cognitive
  | 'ai:read' | 'ai:write'
  | 'signals:read' | 'signals:write'
  | 'act:execute'
  | 'govern:approve' | 'govern:reject'
  | 'audit:read';

// ============================================================================
// ROLE CONFIGURATION
// ============================================================================

export interface RoleConfig {
  id: UserRole;
  title: string;
  level: RoleLevel;
  department: Department;
  shell: ShellType;
  permissions: Permission[];
  defaultModules: string[];
  deepViews?: string[];
  description: string;
}

export interface IndustryConfig {
  id: Industry;
  name: string;
  primaryDepartments: Department[];
  complianceRequirements?: string[];
  customViews?: string[];
}

// ============================================================================
// USER CONTEXT
// ============================================================================

export interface UserContext {
  userId: string;
  tenantId: string;
  role: UserRole;
  department: Department;
  industry: Industry;
  permissions: Permission[];
  assignedShell: ShellType;
  enabledModules: string[];
  accessibleDeepViews: string[];
  settings: {
    defaultView: string;
    sidebarCollapsed: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

// ============================================================================
// NAVIGATION
// ============================================================================

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  permissions?: Permission[];
  badge?: string | number;
  children?: NavItem[];
  section?: string;
  featureFlag?: string;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  permissions?: Permission[];
}
