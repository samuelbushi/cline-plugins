---
name: outputai-debug-workflow
description: Debug failing or incorrect Output SDK workflow runs. Use for errors, hangs, wrong outputs, trace analysis, service connection failures, retry issues, or status/result checks.
---

# Output.ai Workflow Debugging

Use this skill when a workflow fails, hangs, returns unexpected output, or the user asks to investigate a run.

## Safety

Ask before running commands that start services, execute workflows, reset runs, stop runs, or fetch large traces. Traces and outputs can contain private data.

Do not paste full traces into chat. Summarize relevant step names, errors, retry behavior, and redacted input or output shape. Ask before exposing raw input values, output values, or workflow result payloads.

## Triage Flow

1. Identify the workflow name, run ID, input scenario, and failure symptom.
2. Check whether local services are expected to be running.
3. List recent runs when the run ID is unknown.
4. Inspect the trace for the failing step.
5. Map the symptom to the likely implementation issue.
6. Patch the smallest relevant file.
7. Verify with the least expensive check.

## Useful Commands

Use the project script if it wraps the Output CLI. Otherwise these are the common command shapes:

```bash
npx output workflow list
npx output workflow runs list
npx output workflow runs list <workflowName>
npx output workflow status <workflowId>
npx output workflow result <workflowId>
npx output workflow debug <workflowId> --format json
npx output workflow run <workflowName> --input path/to/scenario.json
npx output workflow start <workflowName> --input path/to/scenario.json
npx output workflow stop <workflowId>
npx output workflow reset <workflowId> --after-step <stepName>
```

Run only the commands needed for the current investigation.

## Symptom Map

Common causes:

- "Workflow not found": wrong name or workflow not registered.
- "MissingCredentialError": credential path is absent from encrypted credentials.
- "MissingKeyError": credential key or environment secret for decryption is missing.
- Schema incompatibility: `z` imported from the wrong package or schemas differ across step boundaries.
- Non-determinism or replay failure: I/O, time, randomness, dynamic import, or file access in workflow orchestration.
- HTTP call not traced or not retried: direct fetch or axios usage instead of the project HTTP client pattern.
- Retry does not happen: catch block swallowed the original error or converted it incorrectly.
- Wrong model behavior: prompt lacks task criteria, prompt duplicates structured schema, or model choice does not match reasoning/cost needs.
- Hanging run: service dependency is unavailable, long timeout, step waiting on external API, or background workflow started instead of synchronous run.

## Fix Discipline

- Fix one failure mode at a time.
- Prefer typed schemas and clear step boundaries over defensive parsing everywhere.
- Add or update a scenario that reproduces the issue when practical.
- Add eval coverage when the bug is output quality, not only code failure.

Report the diagnosis, the evidence, the files changed, and the recommended verification command.
