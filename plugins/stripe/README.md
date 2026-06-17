# stripe

Stripe development workflows for Cline: integration guidance, API and SDK upgrades, Stripe Directory discovery, Stripe Projects provisioning guidance, error explanations, test-card references, and the remote Stripe MCP server.

## What It Adds

This plugin registers Stripe's remote MCP server and bundles Stripe-focused skills for payments, Billing, Connect, Treasury, Tax, security, API upgrades, Directory, and Projects workflows.

Use `/stripe-explain-error <error>` to diagnose Stripe errors, or `/stripe-test-cards [scenario]` to quickly pull the relevant test card reference. For broader implementation work, ask Cline for the Stripe workflow directly.

## Cline Primitives

- MCP: `stripe` connects to `https://mcp.stripe.com` for Stripe tools and documentation through Cline's MCP flow.
- Commands: `/stripe-explain-error` and `/stripe-test-cards` start focused Stripe workflows.
- Skills: Stripe best practices, Stripe Directory, Stripe Projects, and Stripe API/SDK upgrade guidance.
- Rules: test-mode defaults, credential masking, approval gates for Stripe writes and provisioning, live-mode caution, and private/untrusted Stripe output handling.

## Requirements

The MCP server may require Stripe authorization through Cline's MCP authorization flow. Stripe CLI workflows require a user-installed Stripe CLI and an authenticated Stripe account. Stripe Projects and Directory workflows can provision services or initiate paid Machine Payment Protocol actions, so they require explicit user approval before any install, account link, provisioning, or payment step.

## Trust Boundaries

Stripe workflows can involve payment data, customer data, account configuration, request logs, webhook payloads, API keys, and live financial operations. The plugin defaults to read/plan/test-mode behavior and asks before changing Stripe resources, provisioning third-party services, moving money, or using live mode.
