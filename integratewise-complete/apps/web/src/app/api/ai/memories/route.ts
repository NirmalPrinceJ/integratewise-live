/**
 * AI Memories API Routes
 * Proxies to IQ-Hub service for D1 operations
 */
import { NextResponse, NextRequest } from "next/server";
import { iqHub } from "@/lib/db";

// GET /api/ai/memories - List memories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });
    
    const memories = await iqHub.get('/memories', { queryParams });

    return NextResponse.json({ memories });
  } catch (error) {
    console.error('Memories API error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/ai/memories - Create memory
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      conversation_id, 
      memory_type, 
      content, 
      context_type, 
      context_id,
      importance,
      source,
      metadata
    } = body;

    if (!memory_type || !content) {
      return NextResponse.json({ error: "memory_type and content are required" }, { status: 400 });
    }

    const memory = await iqHub.post('/memories', {
      conversation_id,
      memory_type,
      content,
      context_type,
      context_id,
      importance,
      source,
      metadata
    });

    if (!memory) {
      return NextResponse.json({ error: "Failed to create memory" }, { status: 500 });
    }

    return NextResponse.json({ memory }, { status: 201 });
  } catch (error) {
    console.error('Create memory error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
