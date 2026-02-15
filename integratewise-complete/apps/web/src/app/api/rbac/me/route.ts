/**
 * GET /api/rbac/me
 * Get current user's RBAC context
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRoleConfig } from '@/lib/rbac/roles';

export async function GET(request: NextRequest) {
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
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Get role configuration
    const roleConfig = getRoleConfig(profile.role || 'personal-pro');
    
    // Get tenant info
    const { data: tenant } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', profile.tenant_id)
      .single();
    
    // Get permissions from database or fallback to config
    const { data: roleData } = await supabase
      .from('roles')
      .select('permissions')
      .eq('name', profile.role)
      .single();
    
    const permissions = roleData?.permissions || roleConfig?.permissions || [];
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: profile.full_name || user.email?.split('@')[0],
        avatar: profile.avatar_url,
      },
      role: {
        id: profile.role || 'personal-pro',
        title: roleConfig?.title || 'User',
        level: roleConfig?.level || 'ic',
        department: roleConfig?.department || 'personal',
        shell: roleConfig?.shell || 'personal',
      },
      tenant: {
        id: profile.tenant_id,
        name: tenant?.name || 'Personal',
        industry: tenant?.industry || profile.industry || 'saas',
      },
      permissions,
      modules: roleConfig?.defaultModules || ['home', 'today', 'tasks'],
      deepViews: roleConfig?.deepViews || [],
    });
    
  } catch (error) {
    console.error('Get RBAC context error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
