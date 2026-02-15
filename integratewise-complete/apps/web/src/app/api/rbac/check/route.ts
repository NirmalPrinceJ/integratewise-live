/**
 * POST /api/rbac/check
 * Check if current user has a specific permission
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get permission to check
    const { permission, resource_type, resource_id } = await request.json();
    
    if (!permission) {
      return NextResponse.json(
        { error: 'Permission required' },
        { status: 400 }
      );
    }
    
    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, tenant_id')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Get role permissions from database
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('permissions, is_system_role')
      .eq('name', profile.role)
      .single();
    
    if (roleError) {
      // Fall back to frontend role config
      const { getRoleConfig } = await import('@/lib/rbac/roles');
      const roleConfig = getRoleConfig(profile.role);
      
      const hasPermission = roleConfig?.permissions.includes(permission) || 
                           roleConfig?.permissions.includes('core:admin');
      
      return NextResponse.json({
        allowed: hasPermission,
        permission,
        role: profile.role,
        source: 'frontend-config'
      });
    }
    
    // Check permission
    const permissions = roleData?.permissions || [];
    const hasPermission = permissions.includes(permission) || 
                         permissions.includes('*:*') ||
                         permissions.includes('core:admin');
    
    // Log permission check
    await supabase.from('permission_audit_log').insert({
      tenant_id: profile.tenant_id,
      user_id: user.id,
      permission,
      resource_type,
      resource_id,
      allowed: hasPermission,
      matched_role: profile.role,
    });
    
    return NextResponse.json({
      allowed: hasPermission,
      permission,
      role: profile.role,
      source: 'database'
    });
    
  } catch (error) {
    console.error('Permission check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
