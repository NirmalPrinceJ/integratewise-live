/**
 * Confirm Memory API
 * Proxies to IQ-Hub service for D1 operations
 */
import { NextResponse, NextRequest } from "next/server";
import { iqHub } from "@/lib/db";

// POST /api/ai/memories/[id]/confirm - Confirm memory
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await iqHub.post(`/memories/${id}/confirm`, {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirm memory error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
