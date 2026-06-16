---
name: agentforce-test
description: Use this skill when writing, running, or interpreting Agentforce preview smoke tests, structured test specs, regression suites, or CI checks.
---

# Agentforce Test

Use this skill to plan and run Agentforce agent testing with Salesforce CLI preview sessions and test suite commands.

## Guardrails

- Verify the target org before running tests.
- Present the test plan before executing it. Do not silently run generated test utterances.
- Prefer realistic utterances over keyword probes.
- Cover routing branches, action paths, guardrail behavior, and failure paths.
- Read trace output after each preview test. The response text alone is not proof that the right action ran.
- Do not publish, activate, or modify production agents as part of testing unless the user explicitly requests that workflow.

## Preview Smoke Tests

Use preview testing for quick checks during draft development.

1. Confirm org alias and authoring bundle API name.
2. Start a preview session:

```bash
sf agent preview start --json --authoring-bundle <Developer_Name> -o <org_alias>
```

3. Send each approved test utterance:

```bash
sf agent preview send --json --session-id <session_id> --authoring-bundle <Developer_Name> --utterance "<utterance>" -o <org_alias>
```

4. End the session:

```bash
sf agent preview end --json --session-id <session_id> --authoring-bundle <Developer_Name> -o <org_alias>
```

5. Inspect local traces, usually under `.sfdx/agents/<Developer_Name>/sessions/<session_id>/traces/`.

## Test Plan Checklist

Include these categories when they apply:

- Happy path for every supported user goal.
- One or more natural-language variants per routing branch.
- Missing, ambiguous, or malformed user input.
- Action success and action failure behavior.
- Off-topic and unsafe requests.
- Multi-turn handoff or clarification flows.
- Regression cases for recently fixed bugs.

## Structured Test Suites

Use structured tests when the team needs repeatable checks in CI or before release.

```bash
sf agent test create --json --spec <test_spec.yaml> --api-name <SuiteName> -o <org_alias>
sf agent test run --json --api-name <SuiteName> --wait 10 --result-format json -o <org_alias>
```

When creating a test spec, keep expected outcomes tied to observable behavior, not exact phrasing unless phrasing is part of the product requirement.

## Result Analysis

- Separate routing failures, action failures, instruction-following failures, and data availability issues.
- For action failures, test the Apex or Flow action directly when practical.
- For conversation failures, update the `.agent` file first, then validate and rerun the smallest failing test set.
- Record new regression utterances after every meaningful fix.
