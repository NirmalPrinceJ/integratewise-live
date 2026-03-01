import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { GoogleAnalyticsConnector } from "../../analytics/google-analytics";
import { MixpanelConnector } from "../../analytics/mixpanel";

/**
 * Analytics Domain Master — manages Google Analytics 4, Mixpanel.
 */
export class AnalyticsMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "analytics";
    readonly domainName = "Analytics";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "google-analytics",
            name: "Google Analytics 4",
            category: "web_analytics",
            connectorClass: GoogleAnalyticsConnector,
            authType: "oauth2",
            requiredFields: ["accessToken", "propertyId"],
            description: "Google Analytics 4 — page views, events, conversions, audiences",
        },
        {
            id: "mixpanel",
            name: "Mixpanel",
            category: "product_analytics",
            connectorClass: MixpanelConnector,
            authType: "api_key",
            requiredFields: ["projectToken"],
            description: "Mixpanel — events, funnels, retention, user profiles",
        },
    ];
}
