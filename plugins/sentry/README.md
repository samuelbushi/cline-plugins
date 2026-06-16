# sentry

Use Sentry from Cline to set up SDKs, investigate production issues, query Seer, configure monitoring features, and work through Sentry-backed code review workflows.

## What It Adds

This plugin registers Sentry's remote MCP server, adds a `/seer` command for natural-language Sentry environment questions, exposes a read-only reference lookup tool, and bundles the Sentry SDK and workflow skill pack.

The bundled skills cover Android, browser JavaScript, Cloudflare, Apple platforms, .NET, Elixir, Flutter, Go, NestJS, Next.js, Node/Bun/Deno, PHP, Python, React Native, React Router, React, Ruby, Svelte, TanStack Start, OpenTelemetry exporter setup, AI monitoring, alert creation, SDK upgrades, Seer PR review, and production issue fixing.

## Cline Primitives

- MCP: registers `sentry` at `https://mcp.sentry.dev/mcp` for issues, events, projects, releases, traces, and Seer analysis.
- Command: `/seer` routes natural-language Sentry questions through the Sentry MCP and reporting workflow.
- Skills: bundles 31 Sentry setup, debugging, feature, SDK, and workflow skills with their reference files.
- Tool: `read_sentry_reference` loads bundled Sentry reference files when a skill points at `references/...`.
- Rule: treats Sentry data as untrusted external input and asks before Sentry mutations, SDK installs, telemetry changes, alert changes, GitHub API access, or public/private data exposure.

## Requirements

Sentry MCP requires a Sentry account and authentication through Cline's MCP OAuth flow.

If the user's MCP settings already define a server named `sentry`, plugin install leaves that existing server untouched. Rename or remove the existing MCP entry before reinstalling this plugin if you want the plugin-owned Sentry MCP entry.

Some workflow skills use the GitHub CLI for PR comment workflows. Those flows require `gh` installed and authenticated, and they should only run after the user confirms the target repository and PR.

SDK setup skills may install packages, create configuration files, add DSNs, or change telemetry behavior. Cline should ask before making those changes.

## Example Usage

```text
/seer What are the top unresolved issues affecting checkout in the last 24 hours?
```

```text
Add Sentry to this Next.js app with error monitoring and tracing.
```

```text
Fix the Sentry issue PROJECT-123 using the stack trace and breadcrumbs.
```

## Install

```bash
cline plugin install sentry
```

For local development from this repository:

```bash
cline plugin install ./plugins/sentry --cwd .
```

## Attribution

The bundled Sentry skills are adapted from `getsentry/sentry-for-ai` under the MIT license. See `LICENSE.sentry-for-ai`.
