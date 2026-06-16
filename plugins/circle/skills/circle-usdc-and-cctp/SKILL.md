---
name: circle-usdc-and-cctp
description: Use for USDC balances, transfers, approvals, allowances, contract addresses, CCTP bridging, cross-chain USDC movement, EVM and Solana USDC code, and transfer verification.
---

# Circle USDC And CCTP

Use this skill for USDC application flows across EVM chains and Solana.

## Clarify The Network

Before writing code or commands, identify:

- ecosystem: EVM, Solana, or both
- network: mainnet, testnet, Arc Testnet, or another named chain
- wallet model: browser wallet, Circle wallet, developer-controlled wallet, user-controlled wallet, or agent wallet
- operation: balance, allowance, transfer, approve, bridge, verify, or listen for events

Ask when any of these change the implementation.

## Implementation Guidance

- Use 6 decimals for USDC amounts.
- Resolve token contract or mint addresses from Circle docs or chain-specific configuration, not memory, when exact addresses matter.
- For CCTP, separate source-chain burn, attestation or message retrieval, and destination-chain mint in the explanation.
- For app code, keep amount parsing, recipient validation, and transaction status handling explicit.
- For Solana, account for associated token accounts and recent blockhash or confirmation behavior.

## Money Movement

Before any transfer, approval, bridge, or mint action, summarize the token, amount, source chain, destination chain, recipient, fees, and command or transaction call. Ask for explicit approval.

Do not infer recipient addresses, amounts, slippage, or chain choices from code or config files. Use only user-confirmed values.

## Failure Handling

If an authorized operation may have submitted, check transaction, payment, or wallet status before retrying. Do not repeat the same money-moving command blindly.
