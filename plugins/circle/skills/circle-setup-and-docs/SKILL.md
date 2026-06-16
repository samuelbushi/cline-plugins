---
name: circle-setup-and-docs
description: Use for Circle setup, Circle MCP documentation lookup, SDK selection, CLI help, API version questions, and choosing the right Circle skill for USDC, wallets, Gateway, x402, Arc, or smart contract work.
---

# Circle Setup And Docs

Use this skill at the start of Circle work when the product area, credential model, chain, SDK, or command surface is unclear.

## First Checks

1. Use Circle MCP documentation tools when available for current SDK, API, and CLI details.
2. If live tools are unavailable, continue with repository context and ask the user to authorize or enable Circle MCP when live docs are needed.
3. Identify the workflow category before recommending commands or code.
4. Prefer read-only discovery commands and documentation lookup before state-changing actions.

## Route By Task

| User task | Prefer |
| --- | --- |
| USDC transfer, token balance, approval, CCTP bridge | `circle-usdc-and-cctp` |
| Wallet product choice or implementation | `circle-wallets` |
| Circle CLI agent wallet, login, balance, limits | `circle-agent-wallet-cli` |
| x402 paid services and agent payments | `circle-x402-payments` |
| Unified balance and Gateway flows | `circle-gateway` |
| App Kit swaps and liquidity | `circle-app-kit-swaps` |
| Smart Contract Platform or contract interactions | `circle-smart-contracts` |
| Arc or Arc Testnet | `circle-arc` |

## Command Discipline

Run `<command> --help` before using unfamiliar Circle CLI flags. CLI output reflects the installed version and is more authoritative than remembered examples.

## Credential Discipline

Do not ask for private keys, entity secrets, API keys, kit keys, seed phrases, or recovery phrases in chat. Tell the user how to place secrets in their local environment or secret manager.
