---
name: posthog-mcp
description: This skill should be used when the user asks to connect Cline to PostHog, use PostHog MCP tools, authenticate PostHog MCP, configure a self-hosted PostHog MCP URL, or understand safe read and write behavior for PostHog MCP inside Cline.
---

# PostHog MCP

Use this skill for Cline-specific PostHog MCP setup and safety.

## Setup

The plugin registers the default PostHog Cloud MCP endpoint as `posthog`. For self-hosted PostHog, set `POSTHOG_MCP_URL` before installing the plugin.

Authentication happens through Cline's MCP auth flow. Do not ask the user to paste OAuth tokens or API keys into chat.

## Working Pattern

Start read-only:

- List relevant projects or resources.
- Inspect schemas and available events before writing HogQL.
- Check existing flags, experiments, dashboards, insights, scouts, endpoints, and warehouse sources before creating new ones.
- Use docs/search tools when unsure of current PostHog behavior.

Before write-capable MCP calls, state the exact resource and change, then ask for confirmation.

## Sensitive Data

PostHog may return user identifiers, emails, IP-like properties, recordings, survey answers, logs, traces, and error details. Summarize or redact by default. Only show raw personal data when the user explicitly needs it for a legitimate debugging task.

## Fallback

If MCP is unavailable, continue with repository-local instrumentation guidance and tell the user what live PostHog access would add.
