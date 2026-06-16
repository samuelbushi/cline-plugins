---
name: mp-integrate
description: Build Mercado Pago payment integrations using the official MCP server for current docs, product constraints, and code patterns.
---

# Mercado Pago Integrate

Use this skill when the user wants to add, migrate, or scaffold a Mercado Pago payment flow.

The `mercadopago` MCP server is the source of truth. Do not invent payloads, endpoints, country availability, or SDK snippets from memory.

## Authentication Gate

Before product work, verify that a real data tool such as `mercadopago__application_list` is callable and returns an application payload. If only auth tools are available, call `mercadopago__authenticate`, show the returned URL, and wait for the user to return after browser success. Never ask for the callback URL.

## Discovery

Resolve:

- Country: ask when it cannot be resolved from explicit user input.
- Product: checkout-pro, checkout-api, bricks, qr, point, subscriptions, marketplace, wallet-connect, money-out, smartapps.
- Server SDK: infer from manifests when possible; otherwise default to Node and say so.
- Client framework, mode, 3DS, recurrence, marketplace split, or brick variant only when relevant.

Hard rules:

- Do not ask for an environment. Mercado Pago test users use production API URLs with test-user credentials.
- Checkout Pro uses preferences, not Orders API.
- Never create or overwrite `.env`; write `.env.example` only.
- Ask before installing SDKs or writing files.

## MCP Queries

Use targeted `mercadopago__search_documentation` queries for the selected product, country, SDK, and client framework.

Use one fallback web fetch only if the MCP has no useful result for the exact combination. Do not fan out across languages or multiple docs pages.

## Output Bundle

Return:

- Install command for the detected SDK.
- Credential variable names only: `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`, `MP_WEBHOOK_SECRET`, and app URL variables.
- Server code pattern from MCP results.
- Client code pattern when applicable.
- Webhook next step that points to `mp-webhooks`.
- Test next step that points to `mp-test-setup`.
- Gotchas relevant to the selected product.

## File Writes

If the user asks to write files:

- Install the SDK in the correct package directory.
- Inject code into existing files rather than overwriting.
- Create `.env.example` with placeholders.
- Do not write outside the workspace.
- Stop on the first failed write or install command.

## Safety

Use idempotency keys on payment/order creation. Never trust redirect query parameters alone; verify status server-side. Never hardcode preference IDs, payment IDs, access tokens, public keys, webhook secrets, or client secrets.
