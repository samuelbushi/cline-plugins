---
name: brightdata-setup
description: Use when the user wants to set up Bright Data for Cline, install or authenticate the Bright Data CLI, choose between CLI/API/MCP/proxy/browser workflows, or debug missing Bright Data credentials before live web data work.
---

# Bright Data Setup

Use this skill before live Bright Data work when the workspace does not already have a clear setup.

## Choose the Surface

Pick the simplest surface that fits the task:

| User Need | Prefer |
| --- | --- |
| One-off search, page extraction, or dataset pull during a Cline session | `bdata` CLI |
| Product code that must call Bright Data from an app | REST API or official SDK |
| A reusable tool layer exposed through Cline MCP | Bright Data MCP configured by the user |
| Browser automation, screenshots, or interaction-heavy pages | Browser API |
| Raw proxy integration in existing HTTP/browser code | Proxy network |

Do not install tools just to prove they exist. First explain the requirement and ask before running install commands or starting networked collection.

## CLI Setup

The CLI requires Node.js 20 or newer.

```bash
npm install -g @brightdata/cli
bdata login
```

For headless machines:

```bash
bdata login --device
```

For non-interactive environments, prefer environment variables over pasting tokens into chat:

```bash
export BRIGHTDATA_API_KEY="..."
```

Never echo the key back to the user or write it into tracked files.

## MCP Setup

If the user asks for MCP, have them configure Bright Data MCP explicitly with their own token and desired tool groups. Do not fabricate a tokenized URL, and do not register a credential-bearing MCP endpoint from this plugin.

Before relying on MCP tools, check whether Bright Data tools are actually available in the current session. If not, explain that the MCP server still needs user setup.

## Readiness Check

Use the least invasive checks:

```bash
command -v bdata
bdata version
```

Only run account, budget, zone, scraper, proxy, browser, or search commands when the user has asked for live Bright Data work and understands the operation may use account quota.
