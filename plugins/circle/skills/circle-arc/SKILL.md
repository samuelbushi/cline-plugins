---
name: circle-arc
description: Use for Arc and Arc Testnet work, USDC-as-gas app design, Arc chain configuration, Arc smart contract deployment, EVM tooling on Arc, and bridging USDC to Arc.
---

# Circle Arc

Use this skill when the user mentions Arc, Arc Testnet, USDC gas, Arc deployment, or USDC-first app design.

## Arc Basics

Arc is EVM-compatible and uses USDC for gas. This changes product and developer assumptions: users may not need a separate native gas token, fee display can be USDC-denominated, and USDC payment apps can simplify onboarding.

## Implementation Flow

1. Confirm Arc mainnet, Arc Testnet, or a local fork.
2. Use current Circle docs for chain ID, RPC URL, explorer, faucets, bridge status, and contract addresses.
3. Reuse standard EVM tooling such as Foundry, Hardhat, viem, wagmi, or ethers when appropriate.
4. For bridging, route to `circle-usdc-and-cctp` or `circle-gateway` depending on the mechanism.
5. For deployments, route to `circle-smart-contracts` for write confirmation and verification.

## Safety

Do not ask for private keys in chat. For examples, use environment variable names and explain local secret storage.

Before any Arc transaction, bridge, or deployment, confirm network, amount, wallet, recipient or contract, and expected fee. Ask for explicit approval.
