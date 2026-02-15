import { NextRequest, NextResponse } from 'next/server';
import { checkPermission, checkAllPermissions, checkAnyPermission } from '@integratewise/rbac';

/**
 * POST /api/rbac/check
 * Check if user has specific permission(s)
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const tenantId = request.headers.get('x-tenant-id');

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'User or tenant information missing' },
        { status: 401 }
      );
    }

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'Configuration error', message: 'Database URL not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { permission, permissions, mode = 'single' } = body;

    let result;

    switch (mode) {
      case 'all':
        if (!Array.isArray(permissions)) {
          return NextResponse.json(
            { error: 'Bad request', message: 'permissions must be an array for mode "all"' },
            { status: 400 }
          );
        }
        result = await checkAllPermissions(dbUrl, userId, tenantId, permissions);
        break;

      case 'any':
        if (!Array.isArray(permissions)) {
          return NextResponse.json(
            { error: 'Bad request', message: 'permissions must be an array for mode "any"' },
            { status: 400 }
          );
        }
        result = await checkAnyPermission(dbUrl, userId, tenantId, permissions);
        break;

      case 'single':
      default:
        if (!permission) {
          return NextResponse.json(
            { error: 'Bad request', message: 'permission is required for mode "single"' },
            { status: 400 }
          );
        }
        result = await checkPermission(dbUrl, {
          user_id: userId,
          tenant_id: tenantId,
          permission,
        });
        break;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking permission:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to check permission' },
      { status: 500 }
    );
  }
}
