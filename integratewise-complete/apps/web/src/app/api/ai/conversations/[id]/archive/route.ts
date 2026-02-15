/**
 * Archive Conversation API
 * Proxies to IQ-Hub service - triggers memory extraction
 */
import { NextResponse, NextRequest } from "next/server";
import { iqHub } from "@/lib/db";

// POST /api/ai/conversations/[id]/archive - Archive conversation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const queryParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });

    const result = await iqHub.post<{ memories_extracted: number; memory_ids: string[] }>(`/conversations/${id}/archive`, null, { queryParams });

    return NextResponse.json({
      success: true,
      memories_extracted: result.memories_extracted,
      memory_ids: result.memory_ids
    });
  } catch (error) {
    console.error('Archive conversation error:', error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
