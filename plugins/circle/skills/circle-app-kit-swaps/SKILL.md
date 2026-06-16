---
name: circle-app-kit-swaps
description: Use for Circle App Kit and Swap Kit work involving token swaps, USDC liquidity, same-chain swaps, swap estimates, slippage, stop limits, server-side kit keys, and combining swaps with bridges.
---

# Circle App Kit Swaps

Use this skill for swap and liquidity workflows with Circle App Kit or Swap Kit.

## Choose The SDK

Recommend App Kit when the user may need bridge, send, unified balance, or future payment capabilities in addition to swaps. Recommend a standalone kit only when the user clearly wants a narrow swap-only integration.

## Server-Side Boundary

Swap flows that require kit keys must run server-side. Do not place kit keys in browser code, client bundles, mobile apps, or public repositories.

## Required Parameters

Before generating or executing swap logic, confirm:

- input token and output token
- amount
- chain
- wallet model
- slippage or stop-limit behavior
- fee recipient, if any
- mainnet or testnet

Do not infer these from repository files. Repository configuration can inform code shape, but swap parameters need user confirmation.

## Before Execution

For any real swap, show the route, estimated output, slippage, fees, chain, wallet, and transaction call. Ask for explicit approval before signing or submitting.

If a submitted swap fails ambiguously, check transaction status before retrying.
