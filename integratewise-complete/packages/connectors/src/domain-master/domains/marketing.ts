import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { MailchimpConnector } from "../../marketing/mailchimp";
import { SegmentConnector } from "../../marketing/segment";

/**
 * Marketing Domain Master — manages Mailchimp, Segment.
 */
export class MarketingMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "marketing";
    readonly domainName = "Marketing";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "mailchimp",
            name: "Mailchimp",
            category: "email_marketing",
            connectorClass: MailchimpConnector,
            authType: "api_key",
            requiredFields: ["apiKey"],
            description: "Mailchimp — campaigns, audiences, automations, reports",
        },
        {
            id: "segment",
            name: "Segment",
            category: "cdp",
            connectorClass: SegmentConnector,
            authType: "api_key",
            requiredFields: ["writeKey"],
            description: "Segment — track events, identify users, manage sources/destinations",
        },
    ];
}
