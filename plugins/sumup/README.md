# sumup

SumUp checkout integration guidance for Cline, covering terminal/card-present and online/card-not-present payment flows.

## What It Adds

This plugin bundles a SumUp checkout skill with reference material for choosing and implementing SumUp payment flows: native terminal SDKs, Cloud API reader checkouts, Payment Switch, Card Widget, Checkouts API, 3DS, webhooks, idempotency, and reconciliation.

It does not register an MCP server, install SDKs, contact SumUp during installation, or mutate project configuration.

## Cline Primitives

- Skills: `sumup` guides terminal and online checkout implementation and points into bundled reference material.
- Rules: payment-data safety, sandbox-first behavior, live-payment approval gates, credential masking, PCI-sensitive card-data boundaries, and private/untrusted API output handling.

## Requirements

Users need a SumUp merchant or sandbox account, the right authentication model for their integration, and an Affiliate Key for card-present flows. Native reader integrations may also need platform-specific SDK setup, Bluetooth/location permissions, app identifiers, and reader pairing.

For production work, verify endpoint behavior, SDK versions, country/payment-method availability, restricted scopes, and launch requirements against official SumUp documentation before changing live code.

## Trust Boundaries

SumUp workflows can involve payment details, customer information, merchant codes, reader/device identifiers, API keys, OAuth credentials, webhook payloads, and live transactions. The plugin defaults to planning/test-mode guidance and asks before live payment, reader, merchant, refund, or webhook actions.
