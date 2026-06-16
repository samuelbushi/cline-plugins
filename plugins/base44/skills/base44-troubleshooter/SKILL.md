---
name: base44-troubleshooter
description: Use this skill for troubleshooting Base44 production issues, backend function failures, app errors, and bounded log investigations.
---

# Base44 Troubleshooter

Use this skill when the user asks to diagnose Base44 app errors or backend function failures.

## Workflow

1. Clarify the symptom, affected environment, function name if known, user impact, and approximate time window.
2. Inspect local code, function config, recent changes, and relevant entity schemas before reading production logs.
3. Prefer asking the user for a redacted log excerpt before reading production logs directly.
4. If live logs are needed, explain the exact `npx base44 logs` command and ask for approval.
5. Keep log queries narrow by function, level, time window, and limit.
6. Correlate errors with code paths, deployments, configuration, secrets, connector calls, and data shape assumptions.
7. Provide a fix plan with code/config changes and a validation step.

## Common Commands

- Ask the user for a redacted log excerpt when that is enough to diagnose the issue.
- `npx base44 whoami`: confirm authentication after approval.
- `npx base44 logs --function <name> --level error --since <start> --until <end> --limit <n>`: inspect a bounded time range after approval.

## Guardrails

- Ask before running log commands, reading production diagnostics, increasing limits, or inspecting sensitive payloads.
- Do not print tokens, secrets, connector credentials, full user identifiers, request bodies, or customer data from logs unless the user explicitly asks.
- Prefer local reproduction and code review before broad production log reads.
- If a fix changes deployed functions, resources, secrets, or connector configuration, hand off to `base44-cli` and ask before deployment.
