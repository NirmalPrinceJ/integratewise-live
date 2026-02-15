import { NextResponse } from 'next/server';
import { registry } from '@integratewise/accelerators';

export async function GET() {
    const accelerators = registry.list();
    return NextResponse.json({
        data: accelerators,
        count: accelerators.length
    });
}
