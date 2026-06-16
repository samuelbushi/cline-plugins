# mercadopago

Adds Mercado Pago integration workflows backed by the official Mercado Pago MCP server.

## What It Does

The plugin registers the `mercadopago` remote MCP server at `https://mcp.mercadopago.com/mcp`.

It also bundles four skills:

- `mp-integrate` for building Checkout Pro, Checkout API, Bricks, QR, Point, subscriptions, marketplace, wallet, money-out, and related integration flows from MCP-backed documentation.
- `mp-webhooks` for adding signed webhook receivers, configuring webhook URLs, simulating notifications, and diagnosing missed deliveries.
- `mp-test-setup` for creating Mercado Pago test users, loading test-user funds, and finding current test-card guidance.
- `mp-review` for reviewing an integration against the MCP-backed quality checklist and a fixed security floor.

The plugin registers three slash commands: `/mp-connect`, `/mp-integrate`, and `/mp-review`.

It also adds a payment-safety rule and a lightweight runtime hook that blocks Mercado Pago credential patterns from tool inputs and blocks `.env` reads in Mercado Pago workspaces.

## Install

```bash
cline plugin install mercadopago
```

For local development from this repository:

```bash
cline plugin install ./plugins/mercadopago --cwd .
```

## Requirements

OAuth with a Mercado Pago account is required before MCP data tools can return account-specific results. Run `/mp-connect` or use any workflow that triggers MCP auth, then open the authorization URL in the browser.

The plugin does not require access-token headers or local CLIs at install time. Project work may require installing the relevant Mercado Pago SDK for the app's language or framework.

## Trust Boundary

Payment integrations can create real financial effects. The skills ask before writing files, installing SDKs, creating test users, loading test funds, configuring webhook URLs, or making payment-affecting calls.

Never paste Mercado Pago access tokens, OAuth callback URLs, webhook secrets, client secrets, or `.env` contents into chat. Use `.env.example` for variable names and keep actual values in user-managed environment variables or a secret manager.
