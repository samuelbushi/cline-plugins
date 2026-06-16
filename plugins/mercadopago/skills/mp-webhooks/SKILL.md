---
name: mp-webhooks
description: Add, configure, simulate, and diagnose Mercado Pago webhooks with HMAC signature validation.
---

# Mercado Pago Webhooks

Use this skill when adding, debugging, or hardening Mercado Pago webhook and notification handling.

## Authentication Gate

Verify the `mercadopago` MCP server with `mercadopago__application_list`. If auth is needed, call `mercadopago__authenticate`, show the authorization URL, and never ask for callback URLs or OAuth codes.

## Receiver Requirements

Every webhook receiver must:

- Validate `x-signature` with HMAC-SHA256 before trusting the body.
- Use `x-request-id`, notification `data.id`, and `ts` from the signature header in the canonical string.
- Fetch the payment, order, merchant order, preapproval, or authorized payment server-side after validation.
- Return quickly and move heavy processing to a queue when possible.
- Treat legacy IPN-style `id` and `topic` query notifications as deprecated for new integrations.

## MCP Actions

Use MCP tools only after the user approves:

- Configure or rotate webhook URLs with `mercadopago__save_webhook`.
- Smoke test receiver delivery with `mercadopago__simulate_webhook`.
- Diagnose missed deliveries with `mercadopago__notifications_history_diagnostics`.

Ask before configuring production callback URLs.

## Implementation Pattern

Add the receiver code in the app's existing server framework. Use environment variables for webhook signing secrets, never hardcoded values.

For languages beyond the current project stack, query MCP documentation with `webhook signature validation {language}`.

## Before Finishing

Verify:

- `.env.example` lists `MP_WEBHOOK_SECRET`.
- Receiver rejects missing or invalid signatures.
- Receiver re-fetches resource status server-side.
- Webhook topics match the product and API mode.
- A simulated webhook reaches the endpoint when the user approved simulation.
