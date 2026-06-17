---
name: zapier-setup
description: Set up, reconnect, or expand Zapier MCP actions in Cline. Use when the user asks to set up Zapier, connect Zapier, add app actions, fix Zapier auth, or learn what Zapier can do.
---

# Zapier Setup

Use this workflow to get Zapier MCP connected and useful in the current Cline session.

## Cline Compatibility

Use Cline MCP authorization for the `zapier` server. Do not edit the user's MCP settings by hand unless they explicitly ask. Do not run Zapier actions during setup except connection, inventory, or configuration-link checks that do not access app records.

## What Zapier Adds

Zapier MCP lets Cline work with app actions the user chooses in Zapier. Common examples include searching Slack or Gmail, creating issues, drafting emails, adding spreadsheet rows, and updating CRM records.

Keep the pitch short:

"Zapier MCP connects Cline to the apps you choose in Zapier. Once connected, Cline can search or update those apps through approved Zapier actions."

## Step 1: Check Connection

Determine whether Zapier MCP tools are visible.

- If no Zapier tools are available, tell the user to authorize the `zapier` MCP server from Cline's MCP flow. In the CLI this is usually `cline mcp` and then OAuth authorization for Zapier. In UI clients, use the MCP settings panel.
- If authorization has just completed, ask the user to retry or restart the current session if tools are still missing.
- If tools are available, continue to mode detection.

## Step 2: Detect Mode

Zapier MCP can expose tools in two broad shapes:

- Agentic mode: static Zapier meta-tools such as `list_enabled_zapier_actions`, `discover_zapier_actions`, and action execution tools are present.
- Classic mode: configured app actions appear as individual tools, often named like `slack_send_channel_message` or `gmail_find_email`, plus a configuration URL tool.

Identify the mode once before giving guidance.

## Step 3: Fresh Setup

If the server is connected but has no useful actions yet:

1. Explain that the user needs to choose which app actions Zapier should expose.
2. Use the available Zapier configuration or discovery tool when present.
3. Suggest a small starter set based on the user's workflow.

Useful starter sets:

- Developer: Jira or Linear search/create, Slack search/send, GitHub or GitLab issue lookup.
- Product manager: Jira search/create, Slack send, Google Docs lookup/create, Calendar lookup/create.
- Sales: CRM contact/company lookup, Gmail draft/send, Calendar lookup/create, Slack send.
- General productivity: Gmail lookup/draft, Calendar lookup/create, Slack search/send, Sheets lookup/add row.

Recommend two to four actions per app. Prefer at least one read action and only the write actions the user actually wants.

Before enabling or disabling Zapier actions, auto-provisioning actions, or creating, updating, or deleting Zapier-hosted skills, show the proposed configuration change and wait for explicit user approval.

## Step 4: Reconnect Or Repair

If tools fail with auth errors:

- If every Zapier tool fails, ask the user to reauthorize the Zapier MCP server.
- If one app fails, tell the user that app's Zapier connection likely needs reauthentication.
- If an action is missing, help the user add or enable it through Zapier.
- If a request has invalid parameters, inspect the tool schema and ask for the missing business fields.

Do not dump raw tool errors unless the user asks for debugging details.

## Step 5: Confirm Next Steps

Once actions are visible, summarize:

- Connected mode.
- Apps and action count.
- Any writes that are available and require confirmation.
- Suggested next action.

Offer to run `zapier-status` or create a `zapier-tool-profile` only after useful actions exist.
