import { NextResponse } from 'next/server';
import { runAcceleratorSignal } from '@integratewise/accelerators';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { accelerator_id, input_context } = body;

        if (!accelerator_id) {
            return NextResponse.json({ error: 'accelerator_id is required' }, { status: 400 });
        }

        const result = await runAcceleratorSignal(accelerator_id, undefined, input_context);
        return NextResponse.json(result);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
