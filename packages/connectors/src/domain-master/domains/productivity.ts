import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { NotionConnector } from "../../productivity/notion";
import { GoogleDriveConnector } from "../../productivity/google-drive";
import { GoogleCalendarConnector } from "../../productivity/google-calendar";
import { CalendlyConnector } from "../../productivity/calendly";

/**
 * Productivity Domain Master — manages Notion, Google Drive, Google Calendar, Calendly.
 *
 * All workspace/docs/calendar tools live under one config vault.
 */
export class ProductivityMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "productivity";
    readonly domainName = "Productivity & Workspace";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "notion",
            name: "Notion",
            category: "docs",
            connectorClass: NotionConnector,
            authType: "token",
            requiredFields: ["apiKey"],
            description: "Notion — pages, databases, blocks, search",
        },
        {
            id: "google-drive",
            name: "Google Drive",
            category: "storage",
            connectorClass: GoogleDriveConnector,
            authType: "oauth2",
            requiredFields: ["accessToken"],
            description: "Google Drive — files, folders, shared drives",
        },
        {
            id: "google-calendar",
            name: "Google Calendar",
            category: "calendar",
            connectorClass: GoogleCalendarConnector,
            authType: "oauth2",
            requiredFields: ["accessToken"],
            description: "Google Calendar — events, calendars, free/busy",
        },
        {
            id: "calendly",
            name: "Calendly",
            category: "scheduling",
            connectorClass: CalendlyConnector,
            authType: "token",
            requiredFields: ["accessToken"],
            description: "Calendly — event types, scheduled events, invitees",
        },
    ];

    // ----- Unified productivity operations -----

    async getUpcomingEvents(maxResults = 20): Promise<any[]> {
        const results: any[] = [];

        // Aggregate from all configured calendar providers
        if (this.isProviderReady("google-calendar")) {
            try {
                const gc = this.getProvider<GoogleCalendarConnector>("google-calendar");
                const result = await gc.listEvents({ timeMin: new Date().toISOString(), maxResults });
                results.push(...(result.items || []).map((e: any) => ({ ...e, source: "google-calendar" })));
            } catch { /* skip if not reachable */ }
        }

        if (this.isProviderReady("calendly")) {
            try {
                const cal = this.getProvider<CalendlyConnector>("calendly");
                const result = await cal.listScheduledEvents({ min_start_time: new Date().toISOString(), count: maxResults });
                results.push(...(result.collection || []).map((e: any) => ({ ...e, source: "calendly" })));
            } catch { /* skip if not reachable */ }
        }

        return results;
    }

    async searchDocuments(query: string): Promise<any[]> {
        const results: any[] = [];

        if (this.isProviderReady("notion")) {
            try {
                const notion = this.getProvider<NotionConnector>("notion");
                const pages = await notion.search({ query });
                results.push(...(pages.results || []).map((p: any) => ({ ...p, source: "notion" })));
            } catch { /* skip */ }
        }

        if (this.isProviderReady("google-drive")) {
            try {
                const drive = this.getProvider<GoogleDriveConnector>("google-drive");
                const files = await drive.searchFiles(query);
                results.push(...(files || []).map((f: any) => ({ ...f, source: "google-drive" })));
            } catch { /* skip */ }
        }

        return results;
    }
}
