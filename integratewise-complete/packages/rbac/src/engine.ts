import { neon } from '@neondatabase/serverless';
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
  dbUrl: string,
  tenant_id?: string
): Promise<Role[]> {
  const sql = neon(dbUrl);

  const result = tenant_id
    ? await sql`
        SELECT id, tenant_id, name, description, permissions, is_system_role, created_at, updated_at
        FROM roles
        WHERE tenant_id = ${tenant_id} OR is_system_role = true
        ORDER BY is_system_role DESC, name ASC
      `
    : await sql`
        SELECT id, tenant_id, name, description, permissions, is_system_role, created_at, updated_at
        FROM roles
        WHERE is_system_role = true
        ORDER BY name ASC
      `;

  return result as Role[];
}

/**
 * Get a role by ID
 */
export async function getRole(
  dbUrl: string,
  role_id: string
): Promise<Role | null> {
  const sql = neon(dbUrl);

  const result = await sql`
    SELECT id, tenant_id, name, description, permissions, is_system_role, created_at, updated_at
    FROM roles
    WHERE id = ${role_id}
    LIMIT 1
  `;

  return result[0] as Role | null;
}

/**
 * Get a role by name
 */
export async function getRoleByName(
  dbUrl: string,
  name: string,
  tenant_id?: string
): Promise<Role | null> {
  const sql = neon(dbUrl);

  const result = tenant_id
    ? await sql`
        SELECT id, tenant_id, name, description, permissions, is_system_role, created_at, updated_at
        FROM roles
        WHERE name = ${name} AND (tenant_id = ${tenant_id} OR is_system_role = true)
        LIMIT 1
      `
    : await sql`
        SELECT id, tenant_id, name, description, permissions, is_system_role, created_at, updated_at
        FROM roles
        WHERE name = ${name} AND is_system_role = true
        LIMIT 1
      `;

  return result[0] as Role | null;
}

/**
 * Create a new role
 */
export async function createRole(
  dbUrl: string,
  role: CreateRole
): Promise<Role> {
  const sql = neon(dbUrl);

  const result = await sql`
    INSERT INTO roles (
      tenant_id, name, description, permissions, is_system_role
    ) VALUES (
      ${role.tenant_id || null},
      ${role.name},
      ${role.description || null},
      ${JSON.stringify(role.permissions)},
      ${role.is_system_role}
    )
    RETURNING id, tenant_id, name, description, permissions, is_system_role, created_at, updated_at
  `;

  return result[0] as Role;
}

/**
 * Update a role (cannot update system roles)
 */
export async function updateRole(
  dbUrl: string,
  role_id: string,
  updates: UpdateRole
): Promise<Role | null> {
  const sql = neon(dbUrl);

  const result = await sql`
    UPDATE roles
    SET
      name = COALESCE(${updates.name}, name),
      description = COALESCE(${updates.description}, description),
      permissions = COALESCE(${updates.permissions ? JSON.stringify(updates.permissions) : null}, permissions),
      updated_at = NOW()
    WHERE id = ${role_id}
      AND is_system_role = false
    RETURNING id, tenant_id, name, description, permissions, is_system_role, created_at, updated_at
  `;

  return result[0] as Role | null;
}

/**
 * Delete a role (cannot delete system roles or roles assigned to users)
 */
export async function deleteRole(
  dbUrl: string,
  role_id: string
): Promise<boolean> {
  const sql = neon(dbUrl);

  // Check if role is assigned to any users
  const assignmentCheck = await sql`
    SELECT COUNT(*) as count
    FROM user_roles
    WHERE role_id = ${role_id}
  `;

  if (Number(assignmentCheck[0].count) > 0) {
    throw new Error('Cannot delete role that is assigned to users');
  }

  const result = await sql`
    DELETE FROM roles
    WHERE id = ${role_id}
      AND is_system_role = false
    RETURNING id
  `;

  return result.length > 0;
}

// ============================================================================
// User Role Assignments
// ============================================================================

/**
 * Get user with all their roles and computed permissions
 */
export async function getUserWithRoles(
  dbUrl: string,
  user_id: string,
  tenant_id: string
): Promise<UserWithRoles | null> {
  const sql = neon(dbUrl);

  const result = await sql`
    SELECT 
      u.id as user_id,
      u.org_id as tenant_id,
      COALESCE(
        json_agg(
          json_build_object(
            'id', r.id,
            'tenant_id', r.tenant_id,
            'name', r.name,
            'description', r.description,
            'permissions', r.permissions,
            'is_system_role', r.is_system_role
          )
        ) FILTER (WHERE r.id IS NOT NULL),
        '[]'
      ) as roles
    FROM users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.id
    WHERE u.id = ${user_id}
      AND u.org_id = ${tenant_id}
    GROUP BY u.id, u.org_id
  `;

  if (result.length === 0) return null;

  const row = result[0] as any;
  const roles = row.roles as Role[];
  
  // Compute all permissions from all roles
  const permissionSet = new Set<string>();
  for (const role of roles) {
    for (const permission of role.permissions) {
      permissionSet.add(permission);
    }
  }

  return {
    user_id: row.user_id,
    tenant_id: row.tenant_id,
    roles,
    permissions: Array.from(permissionSet),
  };
}

/**
 * Assign a role to a user
 */
export async function assignRole(
  dbUrl: string,
  assignment: AssignRole
): Promise<void> {
  const sql = neon(dbUrl);

  await sql`
    INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at)
    VALUES (
      ${assignment.user_id},
      ${assignment.role_id},
      ${assignment.assigned_by || null},
      NOW()
    )
    ON CONFLICT (user_id, role_id) DO NOTHING
  `;
}

/**
 * Revoke a role from a user
 */
export async function revokeRole(
  dbUrl: string,
  user_id: string,
  role_id: string
): Promise<void> {
  const sql = neon(dbUrl);

  await sql`
    DELETE FROM user_roles
    WHERE user_id = ${user_id}
      AND role_id = ${role_id}
  `;
}

/**
 * Get all users with a specific role
 */
export async function getUsersByRole(
  dbUrl: string,
  role_id: string,
  tenant_id: string
): Promise<string[]> {
  const sql = neon(dbUrl);

  const result = await sql`
    SELECT DISTINCT u.id
    FROM users u
    INNER JOIN user_roles ur ON u.id = ur.user_id
    WHERE ur.role_id = ${role_id}
      AND u.org_id = ${tenant_id}
  `;

  return result.map((row: any) => row.id);
}

// ============================================================================
// Permission Checks
// ============================================================================

/**
 * Check if a user has a specific permission
 */
export async function checkPermission(
  dbUrl: string,
  check: PermissionCheck
): Promise<PermissionCheckResult> {
  const userWithRoles = await getUserWithRoles(dbUrl, check.user_id, check.tenant_id);

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
  dbUrl: string,
  user_id: string,
  tenant_id: string,
  permissions: string[]
): Promise<PermissionCheckResult> {
  const userWithRoles = await getUserWithRoles(dbUrl, user_id, tenant_id);

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
  dbUrl: string,
  user_id: string,
  tenant_id: string,
  permissions: string[]
): Promise<PermissionCheckResult> {
  const userWithRoles = await getUserWithRoles(dbUrl, user_id, tenant_id);

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
export async function seedDefaultRoles(dbUrl: string): Promise<void> {
  const sql = neon(dbUrl);

  for (const [roleName, permissions] of Object.entries(DEFAULT_PERMISSIONS)) {
    const description = ROLE_DESCRIPTIONS[roleName as keyof typeof ROLE_DESCRIPTIONS];

    await sql`
      INSERT INTO roles (name, description, permissions, is_system_role, tenant_id)
      VALUES (
        ${roleName},
        ${description},
        ${JSON.stringify(permissions)},
        true,
        NULL
      )
      ON CONFLICT (name, COALESCE(tenant_id, '00000000-0000-0000-0000-000000000000'::uuid))
      DO UPDATE SET
        description = EXCLUDED.description,
        permissions = EXCLUDED.permissions,
        updated_at = NOW()
    `;
  }
}
