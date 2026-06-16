---
name: circle-smart-contracts
description: Use for Circle Smart Contract Platform, contract deployment, importing contracts, ABI reads and writes, template contracts, event monitoring, webhook setup, and wallet-backed contract execution.
---

# Circle Smart Contracts

Use this skill for Circle Smart Contract Platform and wallet-backed contract interactions.

## Task Types

| Task | Guidance |
| --- | --- |
| read contract state | prefer read-only ABI calls and current chain config |
| deploy contract | confirm network, bytecode or template, constructor args, wallet, and fees |
| import contract | confirm address, ABI source, network, and ownership expectation |
| write contract | confirm function, args, wallet, value, gas, and risk |
| monitor events | confirm event ABI, chain, contract address, webhook destination, and retention |

## Credential Boundary

API keys, entity secrets, webhook secrets, and wallet credentials must stay server-side. Use environment variable names in examples and tell the user to supply values locally.

## Before Writes

Ask for explicit approval before deployments, imports that mutate Circle state, contract writes, wallet execution, or webhook creation. Show exact network, contract, method, arguments, and expected cost.

## Verification

After a submitted transaction or deployment, verify by transaction hash, Circle operation status, contract address, or event output. Do not retry a write operation until status is known.
