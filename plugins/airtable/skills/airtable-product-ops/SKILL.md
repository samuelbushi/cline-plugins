---
name: airtable-product-ops
description: Use this skill when building or operating Airtable product workflows such as roadmaps, feedback intake, releases, launch planning, prioritization, or product dashboards.
---

# Product Ops

Use this skill for Airtable product operations workflows.

## Scope First

Ask enough to avoid building the wrong base:

- Is this a new base or an existing base?
- What is the main workflow: roadmap, feedback, releases, prioritization, launch planning, research, or executive reporting?
- Who uses it: product team, engineering, leadership, customers, sales, support, or external partners?
- Does it need Jira, Linear, GitHub, Salesforce, Zendesk, Slack, or forms integration?

## Common Schema

For a product roadmap base, start with:

- `Roadmap items`: title, status, priority, product area, owner, target date, confidence, effort, impact, links to feedback and releases.
- `Customer feedback`: source, customer, segment, request, sentiment, impact, linked roadmap items.
- `Releases`: version, date, status, included roadmap items, launch notes.
- `OKRs` or `Goals`: objective, key results, owner, period, linked roadmap items.

Add only what the workflow needs. A small team may need fewer tables.

## Workflow

1. Inspect existing schema before changing anything.
2. Propose a schema or update plan.
3. Confirm before creating tables, fields, or bulk updates.
4. Use Airtable MCP for supported schema and record work.
5. Hand off views, interfaces, automations, and forms as UI steps when MCP cannot create them.
6. Return a specific Airtable link with `airtable-link`.
