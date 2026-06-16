---
name: airtable-marketing-ops
description: Use this skill when building or operating Airtable marketing workflows such as campaigns, content calendars, creative requests, asset review, launches, events, or partner marketing.
---

# Marketing Ops

Use this skill for Airtable marketing operations workflows.

## Scope First

Ask:

- What workflow is primary: campaign calendar, content pipeline, creative requests, launch plan, events, influencer or partner marketing, asset library, or approvals?
- Who submits work and who approves it?
- Are external collaborators involved?
- Are there existing tools to sync with, such as Google Drive, Slack, Jira, HubSpot, Salesforce, or analytics tools?

## Common Schema

For a marketing ops base, consider:

- `Campaigns`: campaign name, goal, channel, owner, status, dates, budget, linked assets and tasks.
- `Content`: title, type, channel, status, due date, owner, linked campaign.
- `Creative requests`: requester, brief, priority, status, needed-by date, linked assets.
- `Assets`: file, type, usage rights, approval status, linked campaign or content.
- `Approvals`: approver, decision, comments, due date.

Keep the schema matched to the team's actual operating rhythm.

## Workflow

1. Inspect existing bases or ask if this is a new build.
2. Clarify intake, review, approval, and publishing handoffs.
3. Propose the schema and confirm before creating it.
4. Use MCP for supported Airtable schema and record operations.
5. Hand off portals, interfaces, automations, forms, or external branded surfaces when they require Airtable UI configuration.
6. Return a specific Airtable link with `airtable-link`.
