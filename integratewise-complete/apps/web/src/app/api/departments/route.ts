import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { randomUUID } from 'crypto';

/**
 * GET /api/departments
 * List department buckets for tenant
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tenantId = session.user?.tenant_id;

    const result = await db.query(
      `
      SELECT 
        db.department_bucket_id,
        db.department_key,
        db.state,
        db.required_base_buckets,
        db.optional_base_buckets,
        db.unlocked_modules,
        db.unlocked_routes,
        db.recommended_connectors,
        dc.display_name,
        dc.icon,
        dc.description,
        -- Count met requirements
        (SELECT COUNT(*) FROM base_buckets bb 
         WHERE bb.tenant_id = db.tenant_id 
         AND bb.bucket_type = ANY(db.required_base_buckets)
         AND bb.state IN ('SEEDED', 'LIVE')
        ) as met_requirements_count,
        array_length(db.required_base_buckets, 1) as total_requirements
      FROM department_buckets db
      LEFT JOIN department_config dc ON db.department_key = dc.department_key
      WHERE db.tenant_id = $1
      ORDER BY dc.order_index ASC
      `,
      [tenantId]
    );

    return NextResponse.json({
      departments: result.rows || [],
    });
  } catch (error) {
    console.error('GET /api/departments error:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

/**
 * POST /api/departments
 * Add a department bucket to tenant
 * body: { departmentKey: 'sales' | 'csm' | 'marketing' | ... }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tenantId = session.user?.tenant_id;
    const { departmentKey } = await req.json();

    if (!departmentKey) {
      return NextResponse.json({ error: 'departmentKey required' }, { status: 400 });
    }

    // Get department config
    const configResult = await db.query(
      `
      SELECT required_base_buckets, optional_base_buckets, unlocked_modules, unlocked_routes, recommended_connectors
      FROM department_config
      WHERE department_key = $1
      `,
      [departmentKey]
    );

    if (!configResult.rows || configResult.rows.length === 0) {
      return NextResponse.json({ error: 'Unknown department' }, { status: 400 });
    }

    const config = configResult.rows[0];

    // Create department bucket
    const departmentBucketId = randomUUID();
    await db.query(
      `
      INSERT INTO department_buckets
        (department_bucket_id, tenant_id, department_key, state, required_base_buckets, optional_base_buckets, unlocked_modules, unlocked_routes, recommended_connectors)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (tenant_id, department_key)
      DO UPDATE SET state = 'ADDING', updated_at = CURRENT_TIMESTAMP
      `,
      [
        departmentBucketId,
        tenantId,
        departmentKey,
        'ADDING',
        config.required_base_buckets,
        config.optional_base_buckets,
        config.unlocked_modules,
        config.unlocked_routes,
        config.recommended_connectors,
      ]
    );

    return NextResponse.json(
      {
        department: {
          departmentBucketId,
          departmentKey,
          state: 'ADDING',
          requiredBaseBuckets: config.required_base_buckets,
          requiredOptionalBuckets: config.optional_base_buckets,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/departments error:', error);
    return NextResponse.json({ error: 'Failed to add department' }, { status: 500 });
  }
}

/**
 * PATCH /api/departments/:departmentKey
 * Update department state
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { departmentKey: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tenantId = session.user?.tenant_id;
    const { departmentKey } = params;
    const { state } = await req.json();

    if (!state || !['SEEDED', 'LIVE', 'PAUSED', 'OFF'].includes(state)) {
      return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
    }

    const result = await db.query(
      `
      UPDATE department_buckets
      SET state = $1, updated_at = CURRENT_TIMESTAMP
      WHERE tenant_id = $2 AND department_key = $3
      RETURNING department_bucket_id, department_key, state
      `,
      [state, tenantId, departmentKey]
    );

    if (!result.rows || result.rows.length === 0) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json({ department: result.rows[0] });
  } catch (error) {
    console.error('PATCH /api/departments/:departmentKey error:', error);
    return NextResponse.json({ error: 'Failed to update department' }, { status: 500 });
  }
}

/**
 * DELETE /api/departments/:departmentKey
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { departmentKey: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tenantId = session.user?.tenant_id;
    const { departmentKey } = params;

    await db.query(
      `
      DELETE FROM department_buckets
      WHERE tenant_id = $1 AND department_key = $2
      `,
      [tenantId, departmentKey]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/departments/:departmentKey error:', error);
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 });
  }
}
