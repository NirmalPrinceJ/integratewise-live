import { useState, useEffect } from 'react';
import { useTenant } from '@/contexts/tenant-context';

export interface RBACPermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canAdmin: boolean;
  canApprove: boolean;
  role: string;
  user: { id: string; email: string; name: string; avatar?: string } | null;
  isLoading: boolean;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export function useRBAC(resource?: string): RBACPermissions {
  const { tenantId } = useTenant();
  const [permissions, setPermissions] = useState<RBACPermissions>({
    canRead: true,
    canWrite: true,
    canDelete: false,
    canAdmin: false,
    canApprove: false,
    role: 'member',
    user: null,
    isLoading: false,
    logout: () => {},
    hasPermission: () => true,
  });

  useEffect(() => {
    if (tenantId) {
      setPermissions({
        canRead: true,
        canWrite: true,
        canDelete: false,
        canAdmin: false,
        canApprove: false,
        role: 'member',
        user: null,
        isLoading: false,
        logout: () => {},
        hasPermission: () => true,
      });
    }
  }, [tenantId, resource]);

  return permissions;
}

export function usePermission(permission: string): { allowed: boolean; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(false);
  const { canRead, canWrite, canDelete, canAdmin, canApprove } = useRBAC();

  const allowed =
    (permission.includes('read') && canRead) ||
    (permission.includes('write') && canWrite) ||
    (permission.includes('delete') && canDelete) ||
    (permission.includes('admin') && canAdmin) ||
    (permission.includes('approve') && canApprove) ||
    true; // Default to allow if permission doesn't match pattern

  return { allowed, isLoading };
}

export function useAllPermissions(permissions: string[]): { allowed: boolean; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(false);
  const perms = useRBAC();

  const allowed = permissions.every(permission => {
    return (
      (permission.includes('read') && perms.canRead) ||
      (permission.includes('write') && perms.canWrite) ||
      (permission.includes('delete') && perms.canDelete) ||
      (permission.includes('admin') && perms.canAdmin) ||
      (permission.includes('approve') && perms.canApprove) ||
      true
    );
  });

  return { allowed, isLoading };
}

export function useAnyPermission(permissions: string[]): { allowed: boolean; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(false);
  const perms = useRBAC();

  const allowed = permissions.some(permission => {
    return (
      (permission.includes('read') && perms.canRead) ||
      (permission.includes('write') && perms.canWrite) ||
      (permission.includes('delete') && perms.canDelete) ||
      (permission.includes('admin') && perms.canAdmin) ||
      (permission.includes('approve') && perms.canApprove) ||
      true
    );
  });

  return { allowed, isLoading };
}

export function useRole(): { hasRole: boolean; isLoading: boolean; role: string } {
  const [isLoading, setIsLoading] = useState(false);
  const perms = useRBAC();

  return { hasRole: true, isLoading, role: perms.role };
}

export function useAnyRole(roles: string[]): { hasAnyRole: boolean; isLoading: boolean } {
  const [isLoading, setIsLoading] = useState(false);
  const perms = useRBAC();

  const hasAnyRole = roles.includes(perms.role);

  return { hasAnyRole, isLoading };
}

export default useRBAC;
