/**
 * useRBAC - Role-Based Access Control Hook
 * 
 * Provides:
 * - Current user role
 * - Permission checking
 * - Role-based navigation
 * - User context
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UserRole, Permission, UserContext } from '@/lib/rbac/types';
import { getRoleConfig, hasPermission as checkPermission, getDefaultModulesForRole } from '@/lib/rbac/roles';

interface RBACState {
  user: any | null;
  role: { id: UserRole; config: any } | null;
  permissions: Permission[];
  isLoading: boolean;
  error: Error | null;
}

export function useRBAC() {
  const router = useRouter();
  const supabase = createClient();
  
  const [state, setState] = useState<RBACState>({
    user: null,
    role: null,
    permissions: [],
    isLoading: true,
    error: null,
  });

  // Load user and role
  useEffect(() => {
    async function loadUser() {
      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          setState({
            user: null,
            role: null,
            permissions: [],
            isLoading: false,
            error: null,
          });
          return;
        }

        // Get user profile with role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) throw profileError;

        // Get tenant info
        const { data: tenant, error: tenantError } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', profile.tenant_id)
          .single();

        if (tenantError && tenantError.code !== 'PGRST116') {
          console.warn('Tenant fetch error:', tenantError);
        }

        // Get role configuration
        const roleId = profile.role || 'personal-pro';
        const roleConfig = getRoleConfig(roleId);

        setState({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: profile.full_name || session.user.email?.split('@')[0],
            avatar: profile.avatar_url,
            tenantId: profile.tenant_id,
            tenantName: tenant?.name,
            industry: tenant?.industry || 'saas',
          },
          role: {
            id: roleId as UserRole,
            config: roleConfig,
          },
          permissions: roleConfig?.permissions || [],
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('RBAC load error:', error);
        setState({
          user: null,
          role: null,
          permissions: [],
          isLoading: false,
          error: error as Error,
        });
      }
    }

    loadUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Check if user has permission
  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!state.role) return false;
    return checkPermission(state.role.id, permission);
  }, [state.role]);

  // Check if user has any of the permissions
  const hasAnyPermission = useCallback((permissions: Permission[]): boolean => {
    return permissions.some(p => hasPermission(p));
  }, [hasPermission]);

  // Check if user has all permissions
  const hasAllPermissions = useCallback((permissions: Permission[]): boolean => {
    return permissions.every(p => hasPermission(p));
  }, [hasPermission]);

  // Get default modules for current role
  const getDefaultModules = useCallback((): string[] => {
    if (!state.role) return ['home', 'today', 'tasks'];
    return getDefaultModulesForRole(state.role.id);
  }, [state.role]);

  // Get shell type for current role
  const getShell = useCallback((): string => {
    if (!state.role) return 'personal';
    return state.role.config?.shell || 'personal';
  }, [state.role]);

  // Logout
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  }, [supabase, router]);

  // Build user context
  const getUserContext = useCallback((): UserContext | null => {
    if (!state.user || !state.role) return null;

    return {
      userId: state.user.id,
      tenantId: state.user.tenantId,
      role: state.role.id,
      department: state.role.config?.department || 'personal',
      industry: state.user.industry,
      permissions: state.permissions,
      assignedShell: getShell(),
      enabledModules: getDefaultModules(),
      accessibleDeepViews: state.role.config?.deepViews || [],
      settings: {
        defaultView: state.role.config?.defaultModules?.[0] || 'home',
        sidebarCollapsed: false,
        theme: 'dark',
      },
    };
  }, [state, getShell, getDefaultModules]);

  return {
    // State
    user: state.user,
    role: state.role,
    permissions: state.permissions,
    isLoading: state.isLoading,
    error: state.error,
    
    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Helpers
    getDefaultModules,
    getShell,
    getUserContext,
    logout,
  };
}

// Hook for checking specific permission
export function usePermission(permission: Permission) {
  const { hasPermission, isLoading } = useRBAC();
  return {
    allowed: hasPermission(permission),
    isLoading,
  };
}

// Hook for role-based navigation
export function useRoleNavigation() {
  const { role, getDefaultModules } = useRBAC();
  
  return {
    modules: getDefaultModules(),
    deepViews: role?.config?.deepViews || [],
    shell: role?.config?.shell || 'personal',
  };
}
