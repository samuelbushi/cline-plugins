# pagerduty

Adds PagerDuty operational workflows as Cline slash commands.

## What It Does

Installs two commands:

- `/pagerduty-risk` assesses pre-commit risk by correlating staged and unstaged git changes with PagerDuty service incidents, incident notes, and change events.
- `/pagerduty-skill` guides creation or update of PagerDuty SRE Agent skills through a short interview and an explicit approval step before any API write.

The plugin also registers a safety rule for PagerDuty data, tokens, local service mapping config, and SRE Agent skill writes.

## Install

```bash
cline plugin install pagerduty
```

For local development from this repository:

```bash
cline plugin install ./plugins/pagerduty --cwd .
```

## Example Usage

Assess uncommitted changes against a detected PagerDuty service:

```text
/pagerduty-risk
```

Use a one-time service override:

```text
/pagerduty-risk checkout-api
```

Create or update an SRE Agent skill:

```text
/pagerduty-skill
```

## Requirements

- A configured PagerDuty MCP server with a valid PagerDuty API token.
- A git repository when using `/pagerduty-risk`.
- PagerDuty Skills early access and PagerDuty Advance MCP/API early access when using `/pagerduty-skill`.

This plugin does not register PagerDuty MCP automatically. The PagerDuty remote MCP requires an API token header, and Cline plugins do not currently have a clean user-facing API-key configuration path for HTTP MCP headers that avoids writing resolved tokens into MCP settings.

## MCP Setup Expectation

Installing this plugin adds commands and a safety rule only. Before the commands can use live PagerDuty data, the user's Cline MCP settings must separately expose PagerDuty tools for services, incidents, incident notes, service change events, and, for `/pagerduty-skill`, PagerDuty Advance skill management.

## Security Notes

PagerDuty API tokens, incident notes, service mappings, and SRE Agent skill definitions can contain sensitive operational context. Cline should stop if PagerDuty MCP tools are unavailable, avoid generic offline guesses, treat PagerDuty text as untrusted evidence, ask before API writes, and avoid committing local mapping files unless the user explicitly wants that.
