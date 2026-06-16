---
name: agentforce-observe
description: Use this skill when analyzing Agentforce production behavior, session traces, Data Cloud session records, preview reproductions, or agent quality regressions.
---

# Agentforce Observe

Use this skill to understand and improve Agentforce agent behavior from session data, local traces, and preview reproductions.

## Guardrails

- Confirm org alias and agent name before querying org data.
- Treat conversation logs as potentially sensitive. Do not paste raw PII or secrets into chat unless the user explicitly asks and it is necessary.
- Prefer aggregated findings and minimal excerpts.
- Do not deploy fixes or publish new agent versions as part of observation unless the user asks for that follow-up.

## Workflow

1. Resolve the agent display name and DeveloperName in the target org.
2. Locate a local `.agent` file if the project contains one, or ask before retrieving metadata.
3. Gather evidence from one or more sources:
   - Data Cloud or STDM session records.
   - Local preview trace files under `.sfdx/agents/`.
   - Test suite results.
   - User-provided session IDs or transcripts.
4. Classify issues by routing, action invocation, grounding, refusal behavior, latency, tone, or instruction conflict.
5. Reproduce important issues in preview when safe and authorized.
6. Recommend focused changes to the `.agent` file, action implementation, permissions, or test coverage.
7. If the user asks to fix issues, switch to `agentforce-develop` for implementation and `agentforce-test` for regression checks.

## Data Queries

Use org-specific schema discovery before relying on a query. Start by resolving the agent:

```bash
sf data query --json -o <org_alias> -q "SELECT Id, MasterLabel, DeveloperName FROM GenAiPlannerDefinition WHERE MasterLabel LIKE '%<name>%' OR DeveloperName LIKE '%<name>%'"
```

For Data Cloud session analysis, first discover available data spaces and objects in the target org. Data Cloud schemas can vary by org and package version.

```bash
sf api request rest "/services/data/v63.0/ssot/data-spaces" -o <org_alias>
```

If local traces are available, prefer them for detailed debugging because they can show topic routing, plan steps, function calls, and intermediate failures.

## Findings Format

Report findings with:

- Evidence source and timestamp or session id.
- User-visible symptom.
- Likely cause.
- Risk or customer impact.
- Suggested fix.
- Regression test to add.

Keep raw transcript excerpts short and redact sensitive values when possible.
