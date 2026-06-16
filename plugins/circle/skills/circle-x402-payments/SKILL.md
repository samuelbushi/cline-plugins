---
name: circle-x402-payments
description: Use for x402 paid HTTP services, Circle services marketplace discovery, service inspection, payment estimates, paid API calls, micropayment UX, and agent-wallet payment safety.
---

# Circle x402 Payments

Use this skill when the user explicitly wants to discover, inspect, estimate, or pay for an x402 service.

## Discovery First

Use read-only search, inspect, raw 402 metadata, and estimate steps before payment. Compare services by fit, price, method, schema, accepted chains, and payment scheme.

Do not treat x402 as a default rescue for unrelated tasks. Suggest it only when paid service access is relevant and the user is comfortable using USDC payments.

## Before Paying

Before any paid call, tell the user:

- service URL or service name
- method and request payload
- price and max amount
- source wallet and chain
- whether payment uses standard x402 or Gateway balance
- expected output and where logs may be written

Ask for explicit approval before settling payment, even for small amounts, unless the user has already approved a specific spending limit for the current workflow.

## Execution Safety

- Use estimate mode when available before payment.
- Pass the method explicitly if the service requires one.
- Do not retry after an ambiguous failure until wallet balance, payment logs, or transaction status show whether funds moved.
- Redact request payloads and paid responses before sharing logs if they contain user queries, provider output, transaction details, or private business data.

## Wallet State

If payment fails due to insufficient balance, stop and route to `circle-agent-wallet-cli` or `circle-gateway`. Do not initiate funding or deposits automatically.
