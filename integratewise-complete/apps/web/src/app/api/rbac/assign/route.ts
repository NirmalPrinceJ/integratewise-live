import { NextRequest, NextResponse } from 'next/server';
import { assignRole, revokeRole, checkPermission } from '@integratewise/rbac';

/**
 * POST /api/rbac/assign
 * Assign a role to a user
 */
export async function POST(request: NextRequest) {
  try {
    const adminUserId = request.headers.get('x-user-id');
    const tenantId = request.headers.get('x-tenant-id');

    if (!adminUserId || !tenantId) {
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

    // Check if user has permission to assign roles
    const permCheck = await checkPermission(dbUrl, {
      user_id: adminUserId,
      tenant_id: tenantId,
      permission: 'role:update',
    });

    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: 'Forbidden', message: permCheck.reason },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { user_id, role_id } = body;

    if (!user_id || !role_id) {
      return NextResponse.json(
        { error: 'Bad request', message: 'user_id and role_id are required' },
        { status: 400 }
      );
    }

    await assignRole(dbUrl, {
      user_id,
      role_id,
      assigned_by: adminUserId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error assigning role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/rbac/assign
 * Revoke a role from a user
 */
export async function DELETE(request: NextRequest) {
  try {
    const adminUserId = request.headers.get('x-user-id');
    const tenantId = request.headers.get('x-tenant-id');

    if (!adminUserId || !tenantId) {
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

    // Check if user has permission to revoke roles
    const permCheck = await checkPermission(dbUrl, {
      user_id: adminUserId,
      tenant_id: tenantId,
      permission: 'role:update',
    });

    if (!permCheck.allowed) {
      return NextResponse.json(
        { error: 'Forbidden', message: permCheck.reason },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { user_id, role_id } = body;

    if (!user_id || !role_id) {
      return NextResponse.json(
        { error: 'Bad request', message: 'user_id and role_id are required' },
        { status: 400 }
      );
    }

    await revokeRole(dbUrl, user_id, role_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error revoking role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
