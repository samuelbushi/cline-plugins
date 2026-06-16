---
name: mp-review
description: Review Mercado Pago integrations against MCP-backed quality criteria and a fixed payment-security checklist.
---

# Mercado Pago Review

Use this skill after a Mercado Pago integration exists, or when `/mp-review` is invoked.

## Authentication Gate

The official checklist must come from the Mercado Pago MCP server. Verify `mercadopago__quality_checklist` before reviewing. If auth is needed, call `mercadopago__authenticate` and never ask for callback URLs.

## Discover The Integration

Inspect:

- SDK imports and package manifests.
- Payment, order, preference, preapproval, QR, Point, and disbursement endpoints.
- Webhook handlers and notification routes.
- Credential loading and environment-variable usage.
- Idempotency handling on create calls.
- Server-side status verification after redirects or notifications.

## Review Sources

Call `mercadopago__quality_checklist` for the official current criteria. Suggest `mercadopago__quality_evaluation` only when the project has a compatible recent test payment or order ID and the user approves.

Do not mutate Mercado Pago state during review.

## Security Floor

Always evaluate:

- Access tokens, public keys, client secrets, and webhook secrets are not hardcoded.
- `.env` is not read or committed; `.env.example` documents variables.
- HTTPS is used for production redirects and webhook URLs.
- Webhook `x-signature` is validated.
- Payment/order status is re-fetched server-side.
- Idempotency keys are sent on create calls.
- Test-user credentials are not mixed into production deployment.

## Final Report

Return a structured report with:

- Scope.
- Critical blockers.
- Warnings and forward-looking migration notes.
- Passes.
- Quality checklist items from MCP.
- Security checklist.
- Recommendations and next steps.
