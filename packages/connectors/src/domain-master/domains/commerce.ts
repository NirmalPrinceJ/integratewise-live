import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { ShopifyConnector } from "../../ecommerce/shopify";

/**
 * Commerce Domain Master — manages Shopify (and future e-commerce providers).
 */
export class CommerceMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "commerce";
    readonly domainName = "E-Commerce";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "shopify",
            name: "Shopify",
            category: "ecommerce",
            connectorClass: ShopifyConnector,
            authType: "token",
            requiredFields: ["shopName", "accessToken"],
            description: "Shopify — orders, products, customers, inventory",
        },
    ];

    // ----- Unified commerce operations -----

    async getOrders(params?: any): Promise<any[]> {
        if (this.isProviderReady("shopify")) {
            const shopify = this.getProvider<ShopifyConnector>("shopify");
            return shopify.getOrders(params);
        }
        throw new Error("No commerce provider configured");
    }
}
