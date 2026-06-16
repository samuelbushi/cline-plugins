---
name: airtable-sales-ops
description: Use this skill when building or operating Airtable sales workflows such as CRM, pipeline, accounts, opportunities, renewals, deal desk, partner CRM, RFP tracking, or forecasting.
---

# Sales Ops

Use this skill for Airtable sales operations and CRM workflows.

## Scope First

Ask:

- Team size and sales motion.
- Existing CRM or source of truth, such as Salesforce, HubSpot, Pipedrive, or none.
- Primary workflow: pipeline, account management, renewals, deal desk, RFPs, partner/channel, forecasting, or vertical CRM.
- Whether Airtable should replace, augment, or sit beside the existing CRM.
- Whether external partners, portals, or custom apps are needed.

## Common Schema

For a lightweight CRM, start with:

- `Accounts`: company, segment, owner, status, health, linked contacts and opportunities.
- `Contacts`: name, role, email, account, relationship strength.
- `Opportunities`: deal name, account, stage, amount, probability, close date, next action, owner.
- `Activities`: date, type, notes, account, contact, opportunity, follow-up.

For larger teams, add leads, territories, products, deal desk requests, renewals, partner registrations, forecasts, or approval tables only when the scope calls for them.

## Workflow

1. Inspect existing schema or CRM context first.
2. Propose whether Airtable is a primary CRM, an operating layer, or a focused workflow hub.
3. Confirm before creating schema or bulk-updating records.
4. Use MCP for supported Airtable schema and record operations.
5. Hand off sync setup, interfaces, automations, forms, portals, or custom apps when they require UI or external auth.
6. Return a specific Airtable link with `airtable-link`.
