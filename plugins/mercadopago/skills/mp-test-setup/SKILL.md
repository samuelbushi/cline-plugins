---
name: mp-test-setup
description: Create Mercado Pago test users, load test funds, and retrieve current testing guidance through the Mercado Pago MCP server.
---

# Mercado Pago Test Setup

Use this skill when the user needs test users, test-user funds, test cards, or a clear explanation of the current Mercado Pago testing model.

## Current Model

- There is no separate sandbox URL.
- Test users use production API URLs with test-user credentials.
- Modern credentials use the `APP_USR-` prefix. Do not suggest a `TEST-` prefix for new work.
- Test credentials must still be treated as secrets.

## Authentication Gate

Verify `mercadopago__application_list` before creating users or funds. If auth is needed, call `mercadopago__authenticate` and never ask for OAuth callback URLs.

## Create Test Users

Ask for country/site, role, and description. For marketplace, subscription, or buyer/seller flows, suggest creating separate buyer and seller users.

Call `mercadopago__create_test_user` only after the user confirms.

## Load Funds

Call `mercadopago__add_money_test_user` only after the user confirms the test user and amount. Explain that per-country limits can apply.

## Test Cards

Do not invent card numbers. Query `mercadopago__search_documentation` with the current country and product.

## Output

Return the test user's IDs, credential variable names, and next steps. Do not print secrets unless the MCP explicitly returns non-secret setup fields and the user needs to copy them.
