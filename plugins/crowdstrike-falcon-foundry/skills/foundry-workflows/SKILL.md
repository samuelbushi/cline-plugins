---
name: foundry-workflows
description: Create Falcon Fusion SOAR workflow YAML for Foundry apps, including triggers, actions, CEL expressions, function calls, API integration calls, pagination, and error handling.
when_to_use: "Use when the user wants to create or modify a Foundry workflow, Fusion SOAR automation, on-demand workflow, trigger, action chain, CEL expression, or workflow call to a function or API integration."
---

# Foundry Workflows

Use workflows for automation and orchestration. Create workflow scaffolding with the Foundry CLI, then refine the generated YAML.

## Workflow flow

1. Clarify trigger type, inputs, target Falcon data, external systems, and desired side effects.
2. Create the workflow with the CLI and `--no-prompt`.
3. Edit generated workflow YAML, keeping manifest references coordinated.
4. Use functions for custom transformation or branching that is too complex for workflow actions.
5. Use API integration operations for third-party calls instead of embedding credentials.
6. Validate the app before deployment.

## CEL and variables

- Use Foundry's expected variable syntax for data access.
- Prefer null-safe expressions for optional values.
- Be careful with pagination tokens. A missing field may not behave like `null` in every workflow expression.
- Keep loop conditions explicit and add guards against infinite loops.

## Calling functions and integrations

- Functions should return workflow-friendly JSON with clear success and error fields.
- API integration actions should reference operation IDs and platform-managed credentials.
- Do not store secrets in workflow YAML.

## Error handling

- Decide whether each failure should stop the workflow, branch to a fallback, or be logged and suppressed.
- Avoid broad retries that can loop forever or hammer third-party APIs.
- Include enough status detail for operators without leaking secrets or customer data.

## Common mistakes

- Hand-writing workflow directories and manifest entries instead of using the CLI.
- Guessing action names or trigger schemas.
- Embedding raw credentials in action configuration.
- Shipping loops without pagination exit conditions.
