import { DomainMasterConnector } from "../domain-master-connector";
import { DomainId, ProviderDefinition } from "../types";
import { SlackConnector } from "../../communication/slack";
import { IntercomConnector } from "../../communication/intercom";
import { GmailConnector } from "../../communication/gmail";
import { OutlookConnector } from "../../communication/outlook";
import { DiscordConnector } from "../../communication/discord";

/**
 * Communication Domain Master — manages Slack, Intercom, Gmail, Outlook, Discord.
 *
 * All messaging/email/chat providers are unified under one config vault.
 * Change an API key once → all operations reflect it immediately.
 */
export class CommunicationMasterConnector extends DomainMasterConnector {
    readonly domain: DomainId = "communication";
    readonly domainName = "Communication";

    readonly supportedProviders: ProviderDefinition[] = [
        {
            id: "slack",
            name: "Slack",
            category: "messaging",
            connectorClass: SlackConnector,
            authType: "oauth2",
            requiredFields: ["botToken"],
            description: "Slack — channels, messages, users, files",
        },
        {
            id: "intercom",
            name: "Intercom",
            category: "messaging",
            connectorClass: IntercomConnector,
            authType: "token",
            requiredFields: ["accessToken"],
            description: "Intercom — conversations, contacts, companies",
        },
        {
            id: "gmail",
            name: "Gmail",
            category: "email",
            connectorClass: GmailConnector,
            authType: "oauth2",
            requiredFields: ["accessToken"],
            description: "Gmail — messages, threads, labels",
        },
        {
            id: "outlook",
            name: "Microsoft Outlook",
            category: "email",
            connectorClass: OutlookConnector,
            authType: "oauth2",
            requiredFields: ["accessToken"],
            description: "Outlook — mail, calendar, contacts via Microsoft Graph",
        },
        {
            id: "discord",
            name: "Discord",
            category: "messaging",
            connectorClass: DiscordConnector,
            authType: "token",
            requiredFields: ["botToken"],
            description: "Discord — guilds, channels, messages",
        },
    ];

    // ----- Unified communication operations -----

    async getRecentMessages(limit = 50): Promise<any[]> {
        const primary = this.primaryProviderId;
        if (primary === "gmail") {
            const gmail = this.getProvider<GmailConnector>("gmail");
            const result = await gmail.listMessages({ maxResults: limit });
            return result.messages || [];
        }
        if (primary === "outlook") {
            const outlook = this.getProvider<OutlookConnector>("outlook");
            const result = await outlook.listMessages({ $top: limit });
            return result.value || [];
        }
        if (primary === "slack") {
            const slack = this.getProvider<SlackConnector>("slack");
            return (await slack.getChannels()) || [];
        }
        throw new Error("No communication provider configured");
    }
}
