# IntegrateWise Product SKUs & Offers

## 1. SKU: Lead OS Starter

**Target**: Marketing & Sales Teams  
**Value Prop**: Never let a high-intent lead grow cold. Transform raw CRM data into immediate outreach actions.

| Feature | Specification |
|---------|---------------|
| **Modules Enabled** | Lead Velocity, Demo Occupancy, Intent Signal Tracking |
| **In-Scope Signals** | `sales.lead_velocity`, `sales.demo_booked`, `sales.high_intent_page_view` |
| **In-Scope Situations**| `sales.hot_lead`, `sales.demo_no_show`, `sales.intent_spike` |
| **Required Tools** | Salesforce (CRM), HubSpot (Marketing), Calendar (GCal/Outlook) |
| **Hard Limits** | 100 Leads/mo, 20 Situations/mo, 50 AI Reasoning Sessions |
| **Autonomy Level** | Manual (Review & Approve) |
| **Pilot Price** | $499 - $799 / month |

---

## 2. SKU: Revenue OS Starter

**Target**: Finance & Customer Success Teams  
**Value Prop**: Protect every dollar of Net Revenue Retention (NRR). Automated billing recovery that feels human.

| Feature | Specification |
|---------|---------------|
| **Modules Enabled** | Billing Leniency, Churn Health, Expansion Detection |
| **In-Scope Signals** | `revenue.payment_fail`, `cs.usage_drop`, `billing.subscription_cancelled` |
| **In-Scope Situations**| `at_risk.billing_failure`, `at_risk.silent_churn`, `opp.expansion_potential` |
| **Required Tools** | Stripe (Billing), ZenDesk (Support), App Database (Usage metrics) |
| **Hard Limits** | 500 Managed Accounts, 5 Active Recovery Flows, 100 AI Reasoning Sessions |
| **Autonomy Level** | Semi-Auto (Grace periods auto-applied, outreach manual) |
| **Pilot Price** | $999 - $1,499 / month |

---

## 🔗 Stripe & System Mapping

* **Lead OS Starter** → `tenants.enabled_modules = ['lead-velocity', 'intent-engine']`
* **Revenue OS Starter** → `tenants.enabled_modules = ['billing-recovery', 'cs-health']`
