import { NextRequest, NextResponse } from 'next/server';
import { getUserWithRoles } from '@integratewise/rbac';

/**
 * GET /api/rbac/me
 * Get current user's roles and permissions
 */
export async function GET(request: NextRequest) {
  try {
    // Get user info from session/auth (adjust based on your auth setup)
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

    const userRBAC = await getUserWithRoles(dbUrl, userId, tenantId);

    if (!userRBAC) {
      return NextResponse.json(
        { error: 'Not found', message: 'User not found or not part of tenant' },
        { status: 404 }
      );
    }

    return NextResponse.json(userRBAC);
  } catch (error) {
    console.error('Error fetching user RBAC:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to fetch RBAC data' },
      { status: 500 }
    );
  }
}
