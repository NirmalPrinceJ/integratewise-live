/**
 * AI Memory Detail API Routes
 * Proxies to IQ-Hub service for D1 operations
 */
import { NextResponse, NextRequest } from "next/server";
import { iqHub } from "@/lib/db";

// GET /api/ai/memories/[id] - Get memory
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const memory = await iqHub.get(`/memories/${id}`);

    if (!memory) {
      return NextResponse.json({ error: "Memory not found" }, { status: 404 });
    }

    return NextResponse.json({ memory });
  } catch (error) {
    console.error('Get memory error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/ai/memories/[id] - Delete memory
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await iqHub.delete(`/memories/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete memory error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
