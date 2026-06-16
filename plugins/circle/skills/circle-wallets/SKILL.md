---
name: circle-wallets
description: Use to choose and implement Circle wallet models including developer-controlled wallets, user-controlled wallets, modular wallets, account abstraction, passkeys, custody decisions, Gas Station, and wallet SDK architecture.
---

# Circle Wallets

Use this skill when the user is choosing or building a wallet integration with Circle.

## Decision Guide

| Requirement | Likely wallet model |
| --- | --- |
| Application controls wallets for treasury, payouts, automation, or backend custody | developer-controlled wallets |
| End users own and approve actions through embedded auth flows | user-controlled wallets |
| Passkeys, account abstraction, gasless UX, modules, multisig, or custom account logic | modular wallets |
| Agent pays x402 services from a local CLI-managed wallet | agent wallet |

Confirm custody, end-user consent, target chains, account type, and gas sponsorship needs before recommending a model.

## Implementation Notes

- Keep wallet creation, signing, and transaction submission behind explicit user or end-user consent.
- Separate backend-only secrets from browser-safe configuration.
- Use current Circle docs for SDK package names, supported chains, account types, and auth flows.
- For developer-controlled wallets, entity secrets and API keys belong in server-side secret storage only.
- For user-controlled wallets, explain the challenge flow and where the user authorizes sensitive operations.
- For modular wallets, clarify passkey registration, recovery, bundler or paymaster setup, and module limitations.

## Security Boundaries

Never request private keys, entity secrets, recovery phrases, or API keys in chat. If sample code needs environment variables, use placeholder names only and tell the user to supply values locally.
