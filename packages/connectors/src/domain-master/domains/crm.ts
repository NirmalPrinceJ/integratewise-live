import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { SalesforceConnector } from "../../crm/salesforce";
import { HubSpotConnector } from "../../crm/hubspot";

/**
 * CRM Domain Master — manages Salesforce, HubSpot, and future CRM providers.
 *
 * Usage:
 *   const crm = new CRMMasterConnector();
 *   crm.configureProvider("salesforce", { instanceUrl: "...", accessToken: "..." });
 *   crm.configureProvider("hubspot", { accessToken: "..." });
 *
 *   // Get typed connector:
 *   const sf = crm.getProvider<SalesforceConnector>("salesforce");
 *   const contacts = await sf.query("SELECT Id, Name FROM Contact");
 *
 *   // Rotate API key — all future operations auto-use new token:
 *   crm.updateProviderConfig("salesforce", { accessToken: "new-token" });
 */
export class CRMMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "crm";
    readonly domainName = "CRM";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "salesforce",
            name: "Salesforce",
            category: "crm",
            connectorClass: SalesforceConnector,
            authType: "oauth2",
            requiredFields: ["instanceUrl", "accessToken"],
            description: "Salesforce CRM — contacts, accounts, opportunities, cases",
        },
        {
            id: "hubspot",
            name: "HubSpot",
            category: "crm",
            connectorClass: HubSpotConnector,
            authType: "token",
            requiredFields: ["accessToken"],
            description: "HubSpot CRM — contacts, companies, deals, tickets",
        },
    ];

    // ----- Unified CRM operations (route to primary) -----

    async getContacts(limit = 100): Promise<any[]> {
        const primary = this.primaryProviderId;
        const numLimit = Number(limit);
        const safeLimit = Number.isFinite(numLimit) ? Math.max(1, Math.min(numLimit, 2000)) : 100;
        if (primary === "salesforce") {
            const sf = this.getProvider<SalesforceConnector>("salesforce");
            return sf.query(`SELECT Id, FirstName, LastName, Email FROM Contact LIMIT ${safeLimit}`);
        }
        if (primary === "hubspot") {
            const hs = this.getProvider<HubSpotConnector>("hubspot");
            const result = await hs.getContacts(safeLimit);
            return result.results || [];
        }
        throw new Error(`No CRM provider configured`);
    }

    async getDeals(limit = 100): Promise<any[]> {
        const primary = this.primaryProviderId;
        const numLimit = Number(limit);
        const safeLimit = Number.isFinite(numLimit) ? Math.max(1, Math.min(numLimit, 2000)) : 100;
        if (primary === "salesforce") {
            const sf = this.getProvider<SalesforceConnector>("salesforce");
            return sf.query(`SELECT Id, Name, Amount, StageName FROM Opportunity LIMIT ${safeLimit}`);
        }
        if (primary === "hubspot") {
            const hs = this.getProvider<HubSpotConnector>("hubspot");
            const result = await hs.getDeals(limit);
            return result.results || [];
        }
        throw new Error(`No CRM provider configured`);
    }
}
