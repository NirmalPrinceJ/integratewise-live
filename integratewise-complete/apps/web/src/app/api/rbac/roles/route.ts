import { NextRequest, NextResponse } from 'next/server';
import { listRoles, createRole, checkPermission } from '@integratewise/rbac';

/**
 * GET /api/rbac/roles
 * List all roles for the tenant
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const tenantId = request.headers.get('x-tenant-id');

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    // Check if user has permission to read roles
    const permCheck = await checkPermission(dbUrl, {
      user_id: userId,
      tenant_id: tenantId,
      permission: 'role:read',
    });

    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: 'Forbidden', message: permCheck.reason },
        { status: 403 }
      );
    }

    const roles = await listRoles(dbUrl, tenantId);

    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Error listing roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/rbac/roles
 * Create a new custom role
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const tenantId = request.headers.get('x-tenant-id');

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    // Check if user has permission to create roles
    const permCheck = await checkPermission(dbUrl, {
      user_id: userId,
      tenant_id: tenantId,
      permission: 'role:create',
    });

    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: 'Forbidden', message: permCheck.reason },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, permissions } = body;

    if (!name || !permissions) {
      return NextResponse.json(
        { error: 'Bad request', message: 'name and permissions are required' },
        { status: 400 }
      );
    }

    const role = await createRole(dbUrl, {
      tenant_id: tenantId,
      name,
      description,
      permissions,
      is_system_role: false,
    });

    return NextResponse.json({ role }, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
