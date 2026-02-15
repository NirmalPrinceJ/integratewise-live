'use client';

import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

// ============================================================================
// Types
// ============================================================================

export interface Role {
  id: string;
  tenant_id?: string | null;
  name: string;
  description?: string | null;
  permissions: string[];
  is_system_role: boolean;
}

export interface UserRBAC {
  user_id: string;
  tenant_id: string;
  roles: Role[];
  permissions: string[];
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  matched_role?: string;
}

// ============================================================================
// Permission Matching Logic (Client-side)
// ============================================================================

/**
 * Check if a permission matches a required permission
 * Supports wildcards: '*:*' matches everything, 'account:*' matches all account operations
 */
function matchesPermission(userPermission: string, requiredPermission: string): boolean {
  if (userPermission === requiredPermission) return true;
  if (userPermission === '*:*') return true;

  const [userResource, userOperation] = userPermission.split(':');
  const [reqResource, reqOperation] = requiredPermission.split(':');

  if (userResource === reqResource && userOperation === '*') return true;
  if (userResource === '*' && userOperation === reqOperation) return true;

  return false;
}

/**
 * Check if a user has a specific permission
 */
function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.some(perm => matchesPermission(perm, requiredPermission));
}

/**
 * Check if a user has ALL of the required permissions
 */
function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every(req => hasPermission(userPermissions, req));
}

/**
 * Check if a user has ANY of the required permissions
 */
function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some(req => hasPermission(userPermissions, req));
}

// ============================================================================
// React Hooks
// ============================================================================

/**
 * Fetch user RBAC data from the API
 */
async function fetchUserRBAC(): Promise<UserRBAC | null> {
  try {
    const response = await fetch('/api/rbac/me');
    if (!response.ok) {
      if (response.status === 401) return null;
      throw new Error(`Failed to fetch RBAC data: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user RBAC:', error);
    return null;
  }
}

/**
 * Hook to get current user's roles and permissions
 * 
 * @returns User RBAC data or null if not authenticated
 * 
 * @example
 * ```tsx
 * const { data: rbac, isLoading } = useRBAC();
 * 
 * if (isLoading) return <Spinner />;
 * if (!rbac) return <LoginPrompt />;
 * 
 * return <div>Roles: {rbac.roles.map(r => r.name).join(', ')}</div>;
 * ```
 */
export function useRBAC() {
  return useSWR<UserRBAC | null>('rbac-user', fetchUserRBAC, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // Cache for 1 minute
  });
}

/**
 * Hook to check if the current user has a specific permission
 * 
 * @param permission - Permission to check (e.g., 'account:read')
 * @returns Object with permission check result and loading state
 * 
 * @example
 * ```tsx
 * const { allowed, isLoading } = usePermission('account:delete');
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return (
 *   <button disabled={!allowed}>
 *     Delete Account
 *   </button>
 * );
 * ```
 */
export function usePermission(permission: string) {
  const { data: rbac, isLoading, error } = useRBAC();

  const result = useMemo<PermissionCheckResult>(() => {
    if (!rbac) {
      return {
        allowed: false,
        reason: 'User not authenticated',
      };
    }

    if (rbac.roles.length === 0) {
      return {
        allowed: false,
        reason: 'User has no roles assigned',
      };
    }

    const allowed = hasPermission(rbac.permissions, permission);

    if (allowed) {
      const matchedRole = rbac.roles.find(role =>
        hasPermission(role.permissions, permission)
      );

      return {
        allowed: true,
        matched_role: matchedRole?.name,
      };
    }

    return {
      allowed: false,
      reason: `Missing required permission: ${permission}`,
    };
  }, [rbac, permission]);

  return {
    ...result,
    isLoading,
    error,
  };
}

/**
 * Hook to check if the current user has ALL of the specified permissions
 * 
 * @param permissions - Array of permissions to check
 * @returns Object with permission check result and loading state
 * 
 * @example
 * ```tsx
 * const { allowed } = useAllPermissions(['account:read', 'account:update']);
 * 
 * return (
 *   <button disabled={!allowed}>
 *     Edit Account
 *   </button>
 * );
 * ```
 */
export function useAllPermissions(permissions: string[]) {
  const { data: rbac, isLoading, error } = useRBAC();

  const result = useMemo<PermissionCheckResult>(() => {
    if (!rbac) {
      return { allowed: false, reason: 'User not authenticated' };
    }

    const allowed = hasAllPermissions(rbac.permissions, permissions);

    if (!allowed) {
      const missing = permissions.filter(
        perm => !hasPermission(rbac.permissions, perm)
      );
      return {
        allowed: false,
        reason: `Missing required permissions: ${missing.join(', ')}`,
      };
    }

    return { allowed: true };
  }, [rbac, permissions]);

  return {
    ...result,
    isLoading,
    error,
  };
}

/**
 * Hook to check if the current user has ANY of the specified permissions
 * 
 * @param permissions - Array of permissions to check
 * @returns Object with permission check result and loading state
 * 
 * @example
 * ```tsx
 * const { allowed } = useAnyPermission(['account:admin', 'account:update']);
 * 
 * return allowed ? <EditAccountForm /> : <ReadOnlyView />;
 * ```
 */
export function useAnyPermission(permissions: string[]) {
  const { data: rbac, isLoading, error } = useRBAC();

  const result = useMemo<PermissionCheckResult>(() => {
    if (!rbac) {
      return { allowed: false, reason: 'User not authenticated' };
    }

    const allowed = hasAnyPermission(rbac.permissions, permissions);

    if (!allowed) {
      return {
        allowed: false,
        reason: `Missing any of required permissions: ${permissions.join(', ')}`,
      };
    }

    return { allowed: true };
  }, [rbac, permissions]);

  return {
    ...result,
    isLoading,
    error,
  };
}

/**
 * Hook to check if the current user has a specific role
 * 
 * @param roleName - Name of the role to check
 * @returns Object with role check result and loading state
 * 
 * @example
 * ```tsx
 * const { hasRole, isLoading } = useRole('Admin');
 * 
 * if (isLoading) return <Spinner />;
 * 
 * return hasRole ? <AdminPanel /> : <AccessDenied />;
 * ```
 */
export function useRole(roleName: string) {
  const { data: rbac, isLoading, error } = useRBAC();

  const hasRole = useMemo(() => {
    if (!rbac) return false;
    return rbac.roles.some(role => role.name === roleName);
  }, [rbac, roleName]);

  return {
    hasRole,
    isLoading,
    error,
  };
}

/**
 * Hook to check if the current user has ANY of the specified roles
 * 
 * @param roleNames - Array of role names to check
 * @returns Object with role check result and loading state
 * 
 * @example
 * ```tsx
 * const { hasAnyRole } = useAnyRole(['Admin', 'Manager']);
 * 
 * return hasAnyRole ? <ManagementPanel /> : <MemberView />;
 * ```
 */
export function useAnyRole(roleNames: string[]) {
  const { data: rbac, isLoading, error } = useRBAC();

  const hasAnyRole = useMemo(() => {
    if (!rbac) return false;
    return rbac.roles.some(role => roleNames.includes(role.name));
  }, [rbac, roleNames]);

  return {
    hasAnyRole,
    isLoading,
    error,
  };
}

/**
 * Hook to provide imperative permission checking
 * 
 * @returns Object with permission checking functions
 * 
 * @example
 * ```tsx
 * const { can, canAll, canAny } = useHasAccess();
 * 
 * const handleAction = () => {
 *   if (!can('action:execute')) {
 *     alert('You do not have permission to execute actions');
 *     return;
 *   }
 *   executeAction();
 * };
 * ```
 */
export function useHasAccess() {
  const { data: rbac } = useRBAC();

  const can = useCallback(
    (permission: string): boolean => {
      if (!rbac) return false;
      return hasPermission(rbac.permissions, permission);
    },
    [rbac]
  );

  const canAll = useCallback(
    (permissions: string[]): boolean => {
      if (!rbac) return false;
      return hasAllPermissions(rbac.permissions, permissions);
    },
    [rbac]
  );

  const canAny = useCallback(
    (permissions: string[]): boolean => {
      if (!rbac) return false;
      return hasAnyPermission(rbac.permissions, permissions);
    },
    [rbac]
  );

  const hasRoleNamed = useCallback(
    (roleName: string): boolean => {
      if (!rbac) return false;
      return rbac.roles.some(role => role.name === roleName);
    },
    [rbac]
  );

  const hasAnyRoleNamed = useCallback(
    (roleNames: string[]): boolean => {
      if (!rbac) return false;
      return rbac.roles.some(role => roleNames.includes(role.name));
    },
    [rbac]
  );

  return {
    can,
    canAll,
    canAny,
    hasRole: hasRoleNamed,
    hasAnyRole: hasAnyRoleNamed,
    rbac,
  };
}
