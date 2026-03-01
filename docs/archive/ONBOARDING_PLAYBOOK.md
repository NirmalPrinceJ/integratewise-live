# IntegrateWise: Pilot Onboarding Playbook (GTM)

## 0. ICP Definition

- **Segment**: B2B SaaS
- **Size**: 10-200 Employees
- **Stack**: Salesforce (CRM) + Stripe (Billing) + ZenDesk (Support)
- **Pain**: Signal loss between growth (Sales) and retention (CS/Finance).

---

## 📅 10-Step Onboarding Checklist

1. **[ ] Intro Call & Value Mapping**: Identify if we are solving for "Lead Velocity" or "Billing Recovery".
2. **[ ] Provision Instance**: Create tenant record with specific `sku_id` and `enabled_modules`.
3. **[ ] Connect Tools**: OAuth setup for CRM/Stripe in the Integrations Hub.
4. **[ ] Signal Calibration**: Review and tune the `signal_rules` thresholds for the tenant's specific data volume.
5. **[ ] Shadow Mode ON**: Run the system for 48 hours without sending notifications to CRM/Slack.
6. **[ ] Shadow Data Review**: Call with the "OS Owner" to review generated Situations. Tune out noise.
7. **[ ] Playbook Customization**: Tailor the outreach templates to the user's voice.
8. **[ ] Approvals Mode ON**: Enable manual approval flow for all Action Proposals.
9. **[ ] Pilot Week 1 Review**: Meeting to analyze "Decision Overrides" and "Drift."
10. **[ ] Success Milestone**: First automated action (e.g., grace period applied) that saves revenue or shortens sales cycle.

---

## 📣 Outreach Message (Lead OS)
>
> "Hi [Name], noticed [Company] is scaling fast. We built IntegrateWise to solve the 'Lead Black Hole'—where high-intent leads from Salesforce hit your SDRs within 60 seconds because our OS detects intent patterns in real-time. Can I show you a 5-min demo of how we catch the leads your current rules miss?"

## 📣 Outreach Message (Revenue OS)
>
> "Hey [Name], quick question: How much NRR are you losing simply because Stripe payment failures trigger immediate (and cold) lockouts? We're helping SaaS teams automate 'Billing Leniency'—keeping the lights on while intelligence-driven playbooks recover the credit cards. Open to a 5-min walkthrough?"
