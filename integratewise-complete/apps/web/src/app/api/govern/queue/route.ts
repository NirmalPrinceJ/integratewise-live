import { NextRequest, NextResponse } from "next/server";
import { govern } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });

        const queue = await govern.get('/v1/approvals/queue', { queryParams });

        return NextResponse.json({ data: queue });
    } catch (error) {
        console.error("Error fetching approval queue:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch approval queue";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
