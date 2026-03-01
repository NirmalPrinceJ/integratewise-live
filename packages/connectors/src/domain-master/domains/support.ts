import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { ZendeskConnector } from "../../support/zendesk";
import { FreshworksConnector } from "../../support/freshworks";

/**
 * Support Domain Master — manages Zendesk, Freshworks.
 */
export class SupportMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "support";
    readonly domainName = "Customer Support";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "zendesk",
            name: "Zendesk",
            category: "helpdesk",
            connectorClass: ZendeskConnector,
            authType: "token",
            requiredFields: ["subdomain", "email", "apiToken"],
            description: "Zendesk — tickets, users, organizations, satisfaction ratings",
        },
        {
            id: "freshworks",
            name: "Freshworks",
            category: "helpdesk",
            connectorClass: FreshworksConnector,
            authType: "api_key",
            requiredFields: ["domain", "apiKey"],
            description: "Freshworks — tickets, contacts, agents, groups",
        },
    ];

    // ----- Unified support operations -----

    async getTickets(limit = 100): Promise<any[]> {
        const primary = this.primaryProviderId;
        if (!primary) throw new Error("No support provider configured");
        const connector = this.getProvider(primary);
        // Both Zendesk and Freshworks connectors have getTickets
        if ("getTickets" in connector && typeof (connector as any).getTickets === "function") {
            return (connector as any).getTickets(limit);
        }
        throw new Error(`Provider ${primary} does not support getTickets`);
    }
}
