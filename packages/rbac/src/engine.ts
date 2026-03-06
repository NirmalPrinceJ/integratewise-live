import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  Role,
  CreateRole,
  UpdateRole,
  AssignRole,
  UserWithRoles,
  PermissionCheck,
  PermissionCheckResult,
  Permission,
} from './types';
import { DEFAULT_ROLES, DEFAULT_PERMISSIONS, ROLE_DESCRIPTIONS } from './types';

// ============================================================================
// Supabase Client Helper
// ============================================================================

function createDbClient(dbUrl: string): SupabaseClient {
  // For Supabase, we need the service role key
  // The dbUrl is kept for backward compatibility but we use env vars
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(url, key, {
    db: { schema: 'hub' },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ============================================================================
// Permission Matching Logic
// ============================================================================

/**
 * Check if a permission matches a required permission
 * Supports wildcards: '*:*' matches everything, 'account:*' matches all account operations
 */
export function matchesPermission(userPermission: string, requiredPermission: string): boolean {
  // Exact match
  if (userPermission === requiredPermission) return true;

  // Super admin wildcard
  if (userPermission === '*:*') return true;

  // Parse permissions
  const [userResource, userOperation] = userPermission.split(':');
  const [reqResource, reqOperation] = requiredPermission.split(':');

  // Resource wildcard match (e.g., 'account:*' matches 'account:read')
  if (userResource === reqResource && userOperation === '*') return true;

  // Operation wildcard match (e.g., '*:read' matches 'account:read')
  if (userResource === '*' && userOperation === reqOperation) return true;

  return false;
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.some(perm => matchesPermission(perm, requiredPermission));
}

/**
 * Check if a user has ALL of the required permissions
 */
export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every(req => hasPermission(userPermissions, req));
}

/**
 * Check if a user has ANY of the required permissions
 */
export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some(req => hasPermission(userPermissions, req));
}

// ============================================================================
// Role CRUD Operations
// ============================================================================

/**
 * List all roles for a tenant (or system roles if tenant_id is null)
 */
export async function listRoles(
  _dbUrl: string,
  tenant_id?: string
): Promise<Role[]> {
  const supabase = createDbClient(_dbUrl);

  let query = supabase
    .from('roles')
    .select('*')
    .order('is_system_role', { ascending: false })
    .order('name');

  if (tenant_id) {
    query = query.or(`tenant_id.eq.${tenant_id},is_system_role.eq.true`);
  } else {
    query = query.eq('is_system_role', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Role[];
}

/**
 * Get a role by ID
 */
export async function getRole(
  _dbUrl: string,
  role_id: string
): Promise<Role | null> {
  const supabase = createDbClient(_dbUrl);

  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .eq('id', role_id)
    .single();

  if (error) return null;
  return data as Role;
}

/**
 * Get a role by name
 */
export async function getRoleByName(
  _dbUrl: string,
  name: string,
  tenant_id?: string
): Promise<Role | null> {
  const supabase = createDbClient(_dbUrl);

  let query = supabase
    .from('roles')
    .select('*')
    .eq('name', name);

  if (tenant_id) {
    query = query.or(`tenant_id.eq.${tenant_id},is_system_role.eq.true`);
  } else {
    query = query.eq('is_system_role', true);
  }

  const { data, error } = await query.single();
  if (error) return null;
  return data as Role;
}

/**
 * Create a new role
 */
export async function createRole(
  _dbUrl: string,
  role: CreateRole
): Promise<Role> {
  const supabase = createDbClient(_dbUrl);

  const { data, error } = await supabase
    .from('roles')
    .insert({
      tenant_id: role.tenant_id || null,
      name: role.name,
      description: role.description || null,
      permissions: role.permissions,
      is_system_role: role.is_system_role,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Role;
}

/**
 * Update a role (cannot update system roles)
 */
export async function updateRole(
  _dbUrl: string,
  role_id: string,
  updates: UpdateRole
): Promise<Role | null> {
  const supabase = createDbClient(_dbUrl);

  const updateData: any = {};
  if (updates.name) updateData.name = updates.name;
  if (updates.description) updateData.description = updates.description;
  if (updates.permissions) updateData.permissions = updates.permissions;
  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('roles')
    .update(updateData)
    .eq('id', role_id)
    .eq('is_system_role', false)
    .select()
    .single();

  if (error) return null;
  return data as Role;
}

/**
 * Delete a role (cannot delete system roles or roles assigned to users)
 */
export async function deleteRole(
  _dbUrl: string,
  role_id: string
): Promise<boolean> {
  const supabase = createDbClient(_dbUrl);

  // Check if role is assigned to any users
  const { count, error: countError } = await supabase
    .from('user_roles')
    .select('*', { count: 'exact', head: true })
    .eq('role_id', role_id);

  if (countError) throw countError;
  if (count && count > 0) {
    throw new Error('Cannot delete role that is assigned to users');
  }

  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', role_id)
    .eq('is_system_role', false);

  return !error;
}

// ============================================================================
// User Role Assignments
// ============================================================================

/**
 * Get user with all their roles and computed permissions
 */
export async function getUserWithRoles(
  _dbUrl: string,
  user_id: string,
  tenant_id: string
): Promise<UserWithRoles | null> {
  const supabase = createDbClient(_dbUrl);

  // Get user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, org_id')
    .eq('id', user_id)
    .eq('org_id', tenant_id)
    .single();

  if (userError || !user) return null;

  // Get user's roles with a join
  const { data: roleData, error: rolesError } = await supabase
    .from('user_roles')
    .select(`
      role:roles(*)
    `)
    .eq('user_id', user_id);

  if (rolesError) throw rolesError;

  const roles = (roleData?.map((r: any) => r.role) || []) as Role[];

  // Compute all permissions from all roles
  const permissionSet = new Set<string>();
  for (const role of roles) {
    for (const permission of role.permissions) {
      permissionSet.add(permission);
    }
  }

  return {
    user_id: user.id,
    tenant_id: user.org_id,
    roles,
    permissions: Array.from(permissionSet),
  };
}

/**
 * Assign a role to a user
 */
export async function assignRole(
  _dbUrl: string,
  assignment: AssignRole
): Promise<void> {
  const supabase = createDbClient(_dbUrl);

  const { error } = await supabase
    .from('user_roles')
    .upsert({
      user_id: assignment.user_id,
      role_id: assignment.role_id,
      assigned_by: assignment.assigned_by || null,
      assigned_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,role_id',
      ignoreDuplicates: true,
    });

  if (error) throw error;
}

/**
 * Revoke a role from a user
 */
export async function revokeRole(
  _dbUrl: string,
  user_id: string,
  role_id: string
): Promise<void> {
  const supabase = createDbClient(_dbUrl);

  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', user_id)
    .eq('role_id', role_id);

  if (error) throw error;
}

/**
 * Get all users with a specific role
 */
export async function getUsersByRole(
  _dbUrl: string,
  role_id: string,
  tenant_id: string
): Promise<string[]> {
  const supabase = createDbClient(_dbUrl);

  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      user:users(id)
    `)
    .eq('role_id', role_id)
    .eq('user.org_id', tenant_id);

  if (error) throw error;
  return data?.map((r: any) => r.user?.id).filter(Boolean) || [];
}

// ============================================================================
// Permission Checks
// ============================================================================

/**
 * Check if a user has a specific permission
 */
export async function checkPermission(
  _dbUrl: string,
  check: PermissionCheck
): Promise<PermissionCheckResult> {
  const userWithRoles = await getUserWithRoles(_dbUrl, check.user_id, check.tenant_id);

  if (!userWithRoles) {
    return {
      allowed: false,
      reason: 'User not found or not part of tenant',
    };
  }

  if (userWithRoles.roles.length === 0) {
    return {
      allowed: false,
      reason: 'User has no roles assigned',
    };
  }

  // Check if user has the required permission
  const allowed = hasPermission(userWithRoles.permissions, check.permission);

  if (allowed) {
    // Find which role granted the permission
    const matchedRole = userWithRoles.roles.find(role =>
      hasPermission(role.permissions, check.permission)
    );

    return {
      allowed: true,
      matched_role: matchedRole?.name,
    };
  }

  return {
    allowed: false,
    reason: `Missing required permission: ${check.permission}`,
  };
}

/**
 * Check if a user has multiple permissions (ALL)
 */
export async function checkAllPermissions(
  _dbUrl: string,
  user_id: string,
  tenant_id: string,
  permissions: string[]
): Promise<PermissionCheckResult> {
  const userWithRoles = await getUserWithRoles(_dbUrl, user_id, tenant_id);

  if (!userWithRoles) {
    return { allowed: false, reason: 'User not found' };
  }

  const allowed = hasAllPermissions(userWithRoles.permissions, permissions);

  if (!allowed) {
    const missing = permissions.filter(
      perm => !hasPermission(userWithRoles.permissions, perm)
    );
    return {
      allowed: false,
      reason: `Missing required permissions: ${missing.join(', ')}`,
    };
  }

  return { allowed: true };
}

/**
 * Check if a user has any of the permissions
 */
export async function checkAnyPermission(
  _dbUrl: string,
  user_id: string,
  tenant_id: string,
  permissions: string[]
): Promise<PermissionCheckResult> {
  const userWithRoles = await getUserWithRoles(_dbUrl, user_id, tenant_id);

  if (!userWithRoles) {
    return { allowed: false, reason: 'User not found' };
  }

  const allowed = hasAnyPermission(userWithRoles.permissions, permissions);

  if (!allowed) {
    return {
      allowed: false,
      reason: `Missing any of required permissions: ${permissions.join(', ')}`,
    };
  }

  return { allowed: true };
}

// ============================================================================
// Seeding & Initialization
// ============================================================================

/**
 * Seed default system roles
 */
export async function seedDefaultRoles(_dbUrl: string): Promise<void> {
  const supabase = createDbClient(_dbUrl);

  for (const [roleName, permissions] of Object.entries(DEFAULT_PERMISSIONS)) {
    const description = ROLE_DESCRIPTIONS[roleName as keyof typeof ROLE_DESCRIPTIONS];

    await supabase
      .from('roles')
      .upsert({
        name: roleName,
        description,
        permissions,
        is_system_role: true,
        tenant_id: null,
      }, {
        onConflict: 'name',
      });
  }
}
