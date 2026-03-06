# IntegrateWise Connectors & Accelerators

This package contains the core integration logic for IntegrateWise OS.

## Connectors

- **Accounting**: Zoho Books, QuickBooks
- **CRM**: Salesforce, HubSpot
- **Support**: Zendesk, Freshworks
- **Ecommerce**: Shopify
- **Compliance**: IndiaFilings, GST Portal
- **Communication**: Slack, Intercom
- **Marketing**: Mailchimp
- **Analytics**: Google Analytics 4

## Accelerators

- **India Accounting**: GST reports, compliance checks
- **Subscription Metrics**: MRR, Churn, LTV
- **Engineering**: Velocity, Quality
- **HR**: Workforce, Engagement
- **Finance**: Health, Burn Rate

## Usage

\`\`\`typescript
import { createZohoBooksConnector } from "@integratewise/connectors";

const connector = createZohoBooksConnector({
  clientId: "...",
  clientSecret: "...",
  organizationId: "...",
  region: "IN"
});

await connector.testConnection();
const invoices = await connector.getInvoices();
\`\`\`
