---
name: circle-gateway
description: Use for Circle Gateway, unified USDC balance, Gateway deposits, burns, mints, balance queries, delegates, Gateway Wallet, Gateway Minter, cross-chain liquidity, and chain-abstracted payment routing.
---

# Circle Gateway

Use this skill for unified USDC balance and Gateway-based cross-chain payment flows.

## Clarify The Goal

Identify whether the user is:

- checking Gateway balances
- depositing USDC into Gateway
- spending from Gateway
- withdrawing Gateway balance
- building a Gateway integration
- adding a delegate or account separation model
- comparing Gateway with CCTP or direct transfers

## Implementation Guidance

- Use Circle MCP or current docs for supported chains, REST endpoints, contract addresses, domains, and SDK abstractions.
- Prefer SDK abstractions when the user is building an app and they fit the workflow.
- Keep source chain, destination chain, wallet model, and balance location visible in explanations.
- For contract-level flows, separate approval, deposit, burn intent, attestation, mint, and status checks where those steps apply.

## Money Movement

Gateway deposit, spend, and withdrawal operations move funds or alter spendable balances. Before running them, confirm amount, token, source chain, destination chain, wallet address, recipient, fees, and expected settlement behavior.

If a Gateway operation might already have submitted, check status before retrying.
