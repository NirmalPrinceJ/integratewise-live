import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { ZohoBooksConnector } from "../../accounting/zoho-books";
import { QuickBooksConnector } from "../../accounting/quickbooks";
import { StripeConnector } from "../../accounting/stripe";

/**
 * Finance Domain Master — manages Zoho Books, QuickBooks, Stripe.
 *
 * Covers accounting, invoicing, payments, and billing.
 */
export class FinanceMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "finance";
    readonly domainName = "Finance & Accounting";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "zoho-books",
            name: "Zoho Books",
            category: "accounting",
            connectorClass: ZohoBooksConnector,
            authType: "oauth2",
            requiredFields: ["accessToken", "organizationId"],
            description: "Zoho Books — invoices, expenses, contacts, chart of accounts",
        },
        {
            id: "quickbooks",
            name: "QuickBooks",
            category: "accounting",
            connectorClass: QuickBooksConnector,
            authType: "oauth2",
            requiredFields: ["accessToken", "realmId"],
            description: "QuickBooks Online — invoices, customers, vendors, accounts",
        },
        {
            id: "stripe",
            name: "Stripe",
            category: "payments",
            connectorClass: StripeConnector,
            authType: "api_key",
            requiredFields: ["secretKey"],
            description: "Stripe — customers, payments, invoices, subscriptions",
        },
    ];

    // ----- Unified finance operations -----

    async getInvoices(limit = 100): Promise<any[]> {
        const primary = this.primaryProviderId;
        if (primary === "stripe") {
            const stripe = this.getProvider<StripeConnector>("stripe");
            const result = await stripe.listInvoices({ limit });
            return result.data || [];
        }
        // QuickBooks and Zoho Books both have invoice fetching
        if (primary) {
            const connector = this.getProvider(primary);
            if ("getInvoices" in connector && typeof (connector as any).getInvoices === "function") {
                return (connector as any).getInvoices(limit);
            }
        }
        throw new Error("No finance provider configured");
    }

    async getCustomers(limit = 100): Promise<any[]> {
        const primary = this.primaryProviderId;
        if (primary === "stripe") {
            const stripe = this.getProvider<StripeConnector>("stripe");
            const result = await stripe.listCustomers({ limit });
            return result.data || [];
        }
        if (primary) {
            const connector = this.getProvider(primary);
            if ("getCustomers" in connector && typeof (connector as any).getCustomers === "function") {
                return (connector as any).getCustomers(limit);
            }
        }
        throw new Error("No finance provider configured");
    }
}
