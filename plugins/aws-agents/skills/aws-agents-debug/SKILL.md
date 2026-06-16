---
name: aws-agents-debug
description: Diagnose AWS AgentCore CLI, environment, traces, logs, timeout, model access, memory, tool-call, and deployed-agent failures.
---

# AWS Agents Debug

Use this skill when an AgentCore agent or local environment is broken.

## Operating Rules

- Ask before running commands that read AWS account logs, traces, deployed resource state, or other account data.
- Do not print secrets or raw credential values from logs, env vars, stack traces, or config files.
- Prefer the smallest read-only check that can separate local setup, project config, deployed runtime, model access, and tool failures.
- Use `awsknowledge` for current error semantics and service troubleshooting guidance.

## Workflow

1. Classify the failure:
   - CLI missing or too old.
   - AWS credentials, profile, region, or model access failure.
   - Local dev server failure.
   - Deploy-only failure.
   - Runtime timeout or cold start.
   - Tool call failure.
   - Memory or session behavior problem.
   - Wrong or low-quality answer.
2. Inspect local config before live AWS calls:

   ```sh
   find . -maxdepth 4 -path "*/agentcore/agentcore.json" -print
   ```

3. Ask before running account-accessing diagnostics such as logs, traces, status, or invocations.
4. If approved, gather one focused slice of evidence at a time. Redact secrets before summarizing.
5. State the likely root cause, confidence, and next action.

## Common Triage

- `command not found`: confirm install path and shell profile before reinstalling.
- Model access denied: check region and model entitlement before changing code.
- Tool call failures: separate Gateway auth, target schema, tool input, network path, and policy denial.
- Memory failures: verify memory config, tenant or session key, and whether the test spans multiple sessions.
- Timeouts: separate local handler latency, cold start, network dependency, and model latency.
