/**
 * SSE Endpoint for Cognitive Events
 * 
 * Streams real-time events from backend services to frontend:
 * - ingestion_complete
 * - schema_discovered
 * - health_alert
 */

import { NextRequest } from "next/server";

export const runtime = "edge";

// In-memory event queue (replace with Redis/Queue in production)
const eventQueues = new Map<string, any[]>();

/**
 * GET /api/events/cognitive
 * SSE endpoint for cognitive events
 */
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const clientId = crypto.randomUUID();

  // Create event queue for this client
  eventQueues.set(clientId, []);

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const initEvent = {
        type: "connected",
        clientId,
        timestamp: new Date().toISOString(),
      };
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initEvent)}\n\n`)
      );

      // Keep-alive interval
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(keepAlive);
        }
      }, 30000);

      // Event polling interval
      const pollInterval = setInterval(() => {
        const queue = eventQueues.get(clientId);
        if (queue && queue.length > 0) {
          const event = queue.shift();
          if (event) {
            try {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
              );
            } catch {
              clearInterval(pollInterval);
              clearInterval(keepAlive);
            }
          }
        }
      }, 100);

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        clearInterval(pollInterval);
        eventQueues.delete(clientId);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * POST /api/events/cognitive
 * Publish a cognitive event (called by backend services)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, payload } = body;

    // Broadcast to all clients
    for (const [, queue] of eventQueues) {
      queue.push({
        type,
        payload,
        timestamp: new Date().toISOString(),
      });
    }

    return Response.json({ success: true, clientsNotified: eventQueues.size });
  } catch (err) {
    console.error("[CognitiveEvents] Failed to publish:", err);
    return Response.json(
      { error: "Failed to publish event" },
      { status: 500 }
    );
  }
}
