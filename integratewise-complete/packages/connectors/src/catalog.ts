import {
    ZohoBooksConnector,
    QuickBooksConnector,
    SalesforceConnector,
    HubSpotConnector,
    ZendeskConnector,
    FreshworksConnector,
    ShopifyConnector,
    SlackConnector,
    IntercomConnector,
    MailchimpConnector,
    GoogleAnalyticsConnector,
    IndiaFilingsConnector,
    GSTPortalConnector,
    StripeConnector,
    GmailConnector,
    OutlookConnector,
    DiscordConnector,
    SegmentConnector,
    MixpanelConnector,
    NotionConnector,
    GoogleDriveConnector,
    GoogleCalendarConnector,
    CalendlyConnector,
    GitHubConnector,
    AsanaConnector,
    JiraConnector,
    LinearConnector,
    OpenAIConnector,
    AnthropicConnector,
} from "./index";

export const CONNECTOR_CATALOG = [
    // ---- Accounting / Finance ----
    {
        id: "zoho-books",
        name: "Zoho Books",
        category: "accounting",
        domain: "finance",
        class: ZohoBooksConnector
    },
    {
        id: "quickbooks",
        name: "QuickBooks",
        category: "accounting",
        domain: "finance",
        class: QuickBooksConnector
    },
    {
        id: "stripe",
        name: "Stripe",
        category: "payments",
        domain: "finance",
        class: StripeConnector
    },

    // ---- CRM ----
    {
        id: "salesforce",
        name: "Salesforce",
        category: "crm",
        domain: "crm",
        class: SalesforceConnector
    },
    {
        id: "hubspot",
        name: "HubSpot",
        category: "crm",
        domain: "crm",
        class: HubSpotConnector
    },

    // ---- Support ----
    {
        id: "zendesk",
        name: "Zendesk",
        category: "support",
        domain: "support",
        class: ZendeskConnector
    },
    {
        id: "freshworks",
        name: "Freshworks",
        category: "support",
        domain: "support",
        class: FreshworksConnector
    },

    // ---- E-Commerce ----
    {
        id: "shopify",
        name: "Shopify",
        category: "ecommerce",
        domain: "commerce",
        class: ShopifyConnector
    },

    // ---- Communication ----
    {
        id: "slack",
        name: "Slack",
        category: "communication",
        domain: "communication",
        class: SlackConnector
    },
    {
        id: "intercom",
        name: "Intercom",
        category: "communication",
        domain: "communication",
        class: IntercomConnector
    },
    {
        id: "gmail",
        name: "Gmail",
        category: "email",
        domain: "communication",
        class: GmailConnector
    },
    {
        id: "outlook",
        name: "Microsoft Outlook",
        category: "email",
        domain: "communication",
        class: OutlookConnector
    },
    {
        id: "discord",
        name: "Discord",
        category: "messaging",
        domain: "communication",
        class: DiscordConnector
    },

    // ---- Marketing ----
    {
        id: "mailchimp",
        name: "Mailchimp",
        category: "marketing",
        domain: "marketing",
        class: MailchimpConnector
    },
    {
        id: "segment",
        name: "Segment",
        category: "cdp",
        domain: "marketing",
        class: SegmentConnector
    },

    // ---- Analytics ----
    {
        id: "google-analytics",
        name: "Google Analytics 4",
        category: "analytics",
        domain: "analytics",
        class: GoogleAnalyticsConnector
    },
    {
        id: "mixpanel",
        name: "Mixpanel",
        category: "product_analytics",
        domain: "analytics",
        class: MixpanelConnector
    },

    // ---- Compliance ----
    {
        id: "indiafilings",
        name: "IndiaFilings",
        category: "compliance",
        domain: "compliance",
        class: IndiaFilingsConnector
    },
    {
        id: "gst-portal",
        name: "GST Portal",
        category: "compliance",
        domain: "compliance",
        class: GSTPortalConnector
    },

    // ---- Project Management / Engineering ----
    {
        id: "jira",
        name: "Jira",
        category: "project_management",
        domain: "engineering",
        class: JiraConnector
    },
    {
        id: "linear",
        name: "Linear",
        category: "project_management",
        domain: "engineering",
        class: LinearConnector
    },
    {
        id: "github",
        name: "GitHub",
        category: "source_control",
        domain: "engineering",
        class: GitHubConnector
    },
    {
        id: "asana",
        name: "Asana",
        category: "project_management",
        domain: "engineering",
        class: AsanaConnector
    },

    // ---- Productivity ----
    {
        id: "notion",
        name: "Notion",
        category: "docs",
        domain: "productivity",
        class: NotionConnector
    },
    {
        id: "google-drive",
        name: "Google Drive",
        category: "storage",
        domain: "productivity",
        class: GoogleDriveConnector
    },
    {
        id: "google-calendar",
        name: "Google Calendar",
        category: "calendar",
        domain: "productivity",
        class: GoogleCalendarConnector
    },
    {
        id: "calendly",
        name: "Calendly",
        category: "scheduling",
        domain: "productivity",
        class: CalendlyConnector
    },

    // ---- AI ----
    {
        id: "openai",
        name: "OpenAI",
        category: "llm",
        domain: "ai",
        class: OpenAIConnector
    },
    {
        id: "anthropic",
        name: "Anthropic",
        category: "llm",
        domain: "ai",
        class: AnthropicConnector
    },
];
