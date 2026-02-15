"use client";

/**
 * Cognitive Triggers - L3→L2 Wiring
 * 
 *     Auto-triggers L2 drawer when:
 * 1. Data ingestion completes (shows completeness scores)
 * 2. Schema is discovered (shows discovered fields)
 * 3. Entity health changes (shows alerts)
 */

import { useEffect, useCallback } from "react";
import { useL2Drawer } from "./l2-drawer";
import { useToast } from "@/hooks/use-toast";
import { mutate } from "swr";

interface IngestionCompleteEvent {
  entityId: string;
  entityType: string;
  completeness: number;
  missingFields: string[];
  discoveredSchema: string[];
  source: string;
}

interface SchemaDiscoveredEvent {
  entityId: string;
  entityType: string;
  fields: Array<{
    name: string;
    type: string;
    confidence: number;
  }>;
}

export function useCognitiveTriggers() {
  const { openDrawer, isOpen } = useL2Drawer();
  const { toast } = useToast();

  const triggerOnIngestion = useCallback(
    (event: IngestionCompleteEvent) => {
      // Refresh any entity-related data
      mutate((key: any) => typeof key === 'string' && key.startsWith('/api/entities'));

      if (isOpen) return;

      const completenessPercent = Math.round(event.completeness * 100);
      const isLowCompleteness = completenessPercent < 80;

      // Show toast notification using local ToastOptions
      toast({
        title: `Data Ingested: ${completenessPercent}% Complete`,
        description: event.missingFields.length > 0
          ? `${event.missingFields.length} fields need attention`
          : "All fields mapped successfully",
        type: isLowCompleteness ? "warning" : "success",
      });

      // Auto-open drawer for incomplete data (>20% missing)
      if (isLowCompleteness) {
        setTimeout(() => {
          openDrawer({
            trigger: "system",
            contextType: "entity",
            contextId: event.entityId,
            requestedSurface: "spine",
          });
        }, 500);
      }
    },
    [isOpen, openDrawer, toast]
  );

  const triggerOnSchemaDiscovery = useCallback(
    (event: SchemaDiscoveredEvent) => {
      if (isOpen) return;

      toast({
        title: "Schema Discovered",
        description: `${event.fields.length} fields found in ${event.entityType}`,
        type: "success",
      });
    },
    [isOpen, toast] // Added isOpen to deps
  );

  const triggerOnGeneralEvent = useCallback(
    (event: any) => {
      toast({
        title: event.title || "System Update",
        description: event.message,
        type: event.severity === "critical" ? "error" : "info",
      });

      // Refresh specific sub-systems based on event type
      if (event.type === 'user_invited') {
        mutate("/api/admin/users");
      }
      if (event.type === 'billing_alert') {
        mutate("/api/admin/billing");
      }
    },
    [toast]
  );

  return {
    triggerOnIngestion,
    triggerOnSchemaDiscovery,
    triggerOnGeneralEvent,
  };
}

/**
 * Component that listens to SSE events from backend
 * and triggers cognitive surfaces automatically
 */
export function CognitiveEventListener() {
  const { triggerOnIngestion, triggerOnSchemaDiscovery, triggerOnGeneralEvent } = useCognitiveTriggers();

  useEffect(() => {
    // Connect to SSE endpoint for real-time cognitive events
    const eventSource = new EventSource("/api/events/cognitive");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "ingestion_complete":
            triggerOnIngestion(data.payload);
            break;
          case "schema_discovered":
            triggerOnSchemaDiscovery(data.payload);
            break;
          case "billing_alert":
          case "user_invited":
          case "system_update":
            triggerOnGeneralEvent({ ...data.payload, type: data.type });
            break;
          case "health_alert":
            mutate((key: any) => typeof key === 'string' && key.includes('/api/entities/account'));
            break;
          default:
            console.log("[Cognitive] Unknown event type:", data.type);
        }
      } catch (err) {
        console.error("[Cognitive] Failed to parse event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("[Cognitive] SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [triggerOnIngestion, triggerOnSchemaDiscovery, triggerOnGeneralEvent]);

  return null; // This is a logic-only component
}
