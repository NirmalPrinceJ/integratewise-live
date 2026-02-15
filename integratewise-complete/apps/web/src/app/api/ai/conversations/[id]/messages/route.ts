/**
 * AI Conversation Messages API Routes
 * Proxies to IQ-Hub service for D1 operations
 */
import { NextResponse, NextRequest } from "next/server";
import { iqHub } from "@/lib/db";

// GET /api/ai/conversations/[id]/messages - Get messages
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const messages = await iqHub.get(`/conversations/${id}/messages`);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/ai/conversations/[id]/messages - Add message
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { role, content, tool_calls, tool_call_id, tokens, latency_ms, metadata } = body;

    if (!role || !content) {
      return NextResponse.json({ error: "Role and content are required" }, { status: 400 });
    }

    const message = await iqHub.post(`/conversations/${id}/messages`, {
      role,
      content,
      tool_calls,
      tool_call_id,
      tokens,
      latency_ms,
      metadata
    });

    if (!message) {
      return NextResponse.json({ error: "Failed to add message" }, { status: 500 });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Add message error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
