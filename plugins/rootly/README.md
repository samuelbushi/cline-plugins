# rootly

Rootly incident-management workflows for Cline.

## What It Adds

This plugin registers the Rootly remote MCP server and bundles Rootly-focused skills for incident response, on-call handoffs, deployment risk checks, retrospectives, reliability trends, alerts, action items, and stakeholder updates.

The MCP server exposes Rootly incident, alert, service, team, on-call, action-item, status-page, and retrospective operations through Cline's MCP integration. The bundled skills give Cline safer workflows around those tools, including bounded incident lookup, explicit confirmation before writes, and stakeholder-ready summaries.

## Install

```bash
cline plugin install rootly
```

For local development from this repository:

```bash
cline plugin install ./plugins/rootly --cwd .
```

## Requirements

- A Rootly account with access to the data you want Cline to inspect or update.
- Network access to `https://mcp.rootly.com/mcp`.
- MCP OAuth support in the Cline host. Connect the Rootly MCP server when Cline prompts for authorization.

## Included Skills

- `rootly-status` for active incident and service-health summaries.
- `rootly-alert` for read-only alert triage.
- `rootly-brief`, `rootly-announce`, and `rootly-handoff` for stakeholder communication and response handoffs.
- `rootly-respond`, `rootly-deploy-check`, `rootly-retro`, and `rootly-trend` for deeper incident, deploy-risk, retrospective, and reliability analysis.
- `rootly-oncall`, `rootly-my`, `rootly-cover`, and `rootly-swap` for on-call dashboards and shift coverage workflows.
- `rootly-action`, `rootly-lookup`, `rootly-ask`, and `rootly-setup` for action items, discovery, natural-language questions, and first-run verification.

## Safety Notes

The plugin does not run shell hooks, validate API tokens, call Rootly REST APIs directly, or register deployments automatically. Rootly access goes through the MCP server so Cline can use its normal MCP OAuth flow.

The safety rule asks for explicit confirmation before Rootly writes, public or internal status updates, shift overrides, deployment records, and stakeholder-facing communication. It also treats incident data, alerts, schedules, retrospectives, and customer-impact details as sensitive operational data.
