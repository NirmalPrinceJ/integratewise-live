/**
 * GET /api/spine/completeness
 * 
 * Returns completeness scores for entities from Spine (L3).
 * Used by L2→L1 wiring to show badges on entity cards.
 */

import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityIds = searchParams.get("entityIds")?.split(",") || [];
    const entityType = searchParams.get("entityType") || "account";

    if (entityIds.length === 0) {
      return Response.json(
        { error: "entityIds parameter required" },
        { status: 400 }
      );
    }

    // Get completeness data from Spine service
    const spineUrl =
      process.env.SPINE_SERVICE_URL || "http://localhost:8787";

    const response = await fetch(
      `${spineUrl}/completeness?entityIds=${entityIds.join(",")}&entityType=${entityType}`,
      {
        headers: {
          Authorization: request.headers.get("authorization") || "",
        },
      }
    );

    if (!response.ok) {
      // Fallback: return mock data for development
      const mockData = entityIds.map((id) => ({
        entityId: id,
        entityType,
        completeness: Math.random() * 0.4 + 0.6, // 60-100%
        missingFields: ["industry", "employee_count"].slice(
          0,
          Math.floor(Math.random() * 3)
        ),
        discoveredSchema: [
          "id",
          "name",
          "domain",
          "created_at",
          "updated_at",
        ],
        lastSynced: new Date().toISOString(),
      }));

      return Response.json({ data: mockData });
    }

    const data = await response.json();
    return Response.json({ data });
  } catch (err) {
    console.error("[SpineAPI] Completeness fetch failed:", err);
    return Response.json(
      { error: "Failed to fetch completeness" },
      { status: 500 }
    );
  }
}
