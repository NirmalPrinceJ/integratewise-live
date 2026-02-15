import { NextResponse, NextRequest } from "next/server";
import { govern } from "@/lib/db";

export async function POST(request: NextRequest) {
    try {
        const { itemId, decision, reason } = await request.json();

        if (!itemId || !decision) {
            return NextResponse.json(
                { error: "Missing required fields: itemId and decision" },
                { status: 400 }
            );
        }

        if (!["approve", "reject"].includes(decision)) {
            return NextResponse.json(
                { error: "Decision must be 'approve' or 'reject'" },
                { status: 400 }
            );
        }

        const result = await govern.post(`/v1/approvals/${itemId}/${decision}`, { reason });
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error processing approval:", error);
        const message = error instanceof Error ? error.message : "Failed to process approval";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
