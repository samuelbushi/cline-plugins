---
name: zapier-status
description: Check, audit, or diagnose a Zapier MCP setup. Use when the user asks whether Zapier is working, wants to audit actions, clean up duplicates, or troubleshoot failed Zapier tools.
---

# Zapier Status

Use this workflow for health checks, audits, and troubleshooting.

## Cline Compatibility

Inventory and configuration diagnostic calls are okay when they directly support the user's request. Do not access app records during a generic status check. Never execute write actions as part of a status check.

## Mode Selection

Choose the mode from the user's request:

- Health check: "is Zapier working", "check my tools", "what actions do I have".
- Audit: "clean up my tools", "find duplicates", "what should I remove".
- Diagnose: "Zapier is broken", "this action failed", "why can't you use Gmail".

## Health Check

1. Identify Agentic or Classic mode from the visible Zapier tools.
2. Inventory enabled actions or configured action tools.
3. Group by app.
4. Infer read versus write from the action name and description.
5. Report a concise dashboard.

Example shape:

```text
Zapier MCP status
Server: connected
Mode: Agentic
Actions: 12 across 4 apps

Slack: 3 actions, 2 read, 1 write
Gmail: 4 actions, 2 read, 2 write
Jira: 3 actions, 2 read, 1 write
Calendar: 2 actions, 1 read, 1 write
```

Flag missing auth, empty action lists, duplicate actions, or app connections that recently failed.

## Audit

Look for practical cleanup opportunities:

- Duplicate Zapier actions for the same app and purpose.
- Zapier actions that overlap with a dedicated native MCP server already available in the session.
- High-risk write actions the user rarely needs by default.
- Actions that are too narrow to be worth keeping always enabled.

For native overlap, prefer the native MCP server for a single-app workflow when it is more specialized. Use Zapier when it covers an app without a native server or when the user's workflow crosses apps.

Do not disable anything without explicit user approval.

## Diagnose

Use this order:

1. Connection: can any Zapier MCP tool respond?
2. Action presence: is the requested app/action enabled or configured?
3. App auth: do inventory, configuration, or action-listing tools report authentication required?
4. Parameters: are required fields missing or in the wrong format?
5. Transient failures: retry once only when the error looks temporary.

If diagnosing a specific app connection requires probing private app data, explain the probe and ask the user first. Prefer existing error context over fresh data access.

Translate failures into plain language:

- "Zapier itself needs to be reauthorized."
- "Your Gmail connection in Zapier needs to be reconnected."
- "That action is not enabled yet."
- "The action needs a recipient and message body before it can run."

Stop after a clear next step. Do not repeatedly call failing tools.
