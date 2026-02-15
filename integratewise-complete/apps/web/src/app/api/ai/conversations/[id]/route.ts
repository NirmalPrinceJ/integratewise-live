/**
 * AI Conversation Detail API Routes
 * 
 * Proxies to IQ-Hub service for D1 operations
 */
import { NextResponse, NextRequest } from "next/server";
import { iqHub } from "@/lib/db";

// GET /api/ai/conversations/[id] - Get conversation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const conversation = await iqHub.get(`/conversations/${id}`);

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH /api/ai/conversations/[id] - Update conversation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    await iqHub.patch(`/conversations/${id}`, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update conversation error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/ai/conversations/[id] - Delete conversation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await iqHub.delete(`/conversations/${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete conversation error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
