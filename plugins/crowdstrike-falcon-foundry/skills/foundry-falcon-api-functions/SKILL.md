---
name: foundry-falcon-api-functions
description: Call CrowdStrike Falcon platform APIs from Foundry functions using FalconPy or Go helpers with correct auth, scopes, pagination, and local testing boundaries.
when_to_use: "Use when the user wants a Foundry function to call Falcon platform APIs such as detections, alerts, hosts, RTR, cases, or IOC APIs. Do not use for third-party APIs; use foundry-api-integrations instead."
---

# Foundry Falcon API Functions

Foundry functions can call Falcon platform APIs. In cloud function handlers, use the platform-provided auth context instead of hardcoded client IDs or secrets.

## Python pattern

- Prefer FalconPy zero-argument service constructors inside Foundry handlers when supported.
- Do not pass `client_id` or `client_secret` from environment variables in cloud handlers.
- For local testing, use documented local env vars only after the user confirms the credentials and scope.
- Handle Falcon API result envelopes and status codes explicitly.

## Go pattern

- Use the Foundry FDK helper auth wiring for Falcon clients.
- Keep region and CID assumptions explicit.
- Return structured errors rather than panicking.

## Scope and manifest guidance

- Declare the narrowest OAuth scopes needed for the API calls.
- If a required scope is uncertain, ask the user or consult official Falcon API docs rather than guessing.
- Keep manifest changes minimal and validate after scope edits.

## Pagination and result handling

- Respect API limits and pagination tokens.
- Do not fetch broad datasets unless the user confirmed the scope.
- For enrichment workflows, process one page or batch at a time and return enough state for the next step.
- Treat 207 multi-status and partial failures as expected result shapes that need explicit handling.

## Trust boundaries

Ask before querying live detections, host data, cases, RTR data, or other sensitive Falcon data. Do not print tokens, secrets, customer identifiers, or large raw API responses in chat unless the user explicitly asks for that exact output.
