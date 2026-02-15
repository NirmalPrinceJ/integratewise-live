/**
 * AI Conversations API Routes
 * 
 * Proxies to IQ-Hub service which stores in Cloudflare D1
 * 30-day retention policy
 */
import { NextResponse, NextRequest } from "next/server";
import { iqHub } from "@/lib/db";

// GET /api/ai/conversations - List conversations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });

    const conversations = await iqHub.get('/conversations', { queryParams });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Conversations API error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/ai/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, context_type, context_id, model, metadata } = body;

    const conversation = await iqHub.post('/conversations', {
      title: title || 'New Conversation',
      context_type,
      context_id,
      model,
      metadata
    });

    if (!conversation) {
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error('Create conversation error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
