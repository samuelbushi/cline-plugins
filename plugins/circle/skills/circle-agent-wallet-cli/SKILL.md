---
name: circle-agent-wallet-cli
description: Use for Circle CLI agent wallet setup, terms review, email OTP login, wallet creation, wallet status, balances, funding orientation, spending limits, and safe CLI command planning.
---

# Circle Agent Wallet CLI

Use this skill for local Circle CLI agent-wallet workflows.

## Safe Defaults

Read-only commands such as status, balance, list, and help are low risk. Still explain what is being checked before running commands that touch a wallet account.

Ask for explicit approval before commands that:

- install or update the Circle CLI
- create wallets
- transfer funds
- fund wallets
- deposit or withdraw Gateway balance
- set or reset spending limits

## Terms And OTP

Do not accept Circle terms or policies for the user. Show or hand off the relevant terms command or Circle UI path, then ask the user to complete acceptance in their own terminal or browser.

OTP codes and one-time challenges are sensitive. Prefer user-run interactive commands so the code never enters chat, tool input, logs, or summaries.

If the user explicitly chooses to paste a one-time code into chat after seeing the privacy tradeoff, use it only for the active approved flow, do not store it, and do not repeat it in summaries.

## Command Pattern

1. Check `circle --version` or `circle wallet status` only when needed.
2. Use `circle <scope> --help` before unfamiliar flags.
3. Prefer `--output json` when Cline needs to parse command output.
4. Confirm chain and wallet address before balance-sensitive or fund-sensitive work.

## Funding Guidance

Explain funding options, but do not start fiat on-ramp, QR funding, transfer, Gateway deposit, or withdrawal commands without user approval and a stated amount, chain, wallet address, and method.
