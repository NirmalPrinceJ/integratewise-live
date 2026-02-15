import { NextRequest, NextResponse } from "next/server";
import { govern } from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryParams: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            queryParams[key] = value;
        });

        const policies = await govern.get('/v1/policies', { queryParams });

        return NextResponse.json({ data: policies });
    } catch (error) {
        console.error("Error fetching policies:", error);
        const message = error instanceof Error ? error.message : "Failed to fetch policies";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
