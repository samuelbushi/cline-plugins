---
name: outputai-build-workflow
description: Implement an Output SDK workflow from an approved plan. Use when creating or editing workflow.ts, steps, schemas, prompts, scenarios, evaluators, and shared clients.
---

# Output.ai Workflow Build

Use this skill after there is an approved plan or a clear user request to implement a specific Output SDK change.

## Preflight

Before editing:

- Confirm the target workflow directory and file list.
- Read nearby workflow examples in the project.
- Check package versions and existing lint or test scripts.
- Identify credentials that will be referenced, but do not read secret values.
- Identify whether this is a new workflow, a change to an existing workflow, or a migration.

## File Layout

Prefer the project convention. If none exists, use:

```text
src/workflows/<workflow_name>/
  workflow.ts
  steps.ts
  types.ts
  prompts/
    <step_name>.prompt
  scenarios/
    basic.json
  evaluators.ts
```

Use shared clients under `src/shared/clients/` only when more than one workflow or step needs them.

## Implementation Rules

- Import `z`, `step`, and workflow error classes from `@outputai/core` when the project uses those APIs.
- Keep external I/O in steps, not workflow orchestration.
- Put LLM calls in steps or helper functions that run inside steps.
- Use explicit step names that match trace/debug expectations.
- Give each step a narrow responsibility.
- Use retryable errors for transient failures and fatal or validation errors for permanent user/data problems.
- Avoid catch blocks that swallow framework retry behavior. Catch only to add context or convert known permanent failures.
- Avoid `Date.now()`, randomness, dynamic imports, file reads, or network calls in workflow code.
- Keep prompts colocated with the workflow unless the project has a shared prompt convention.

## Schema Rules

- Define reusable schemas in `types.ts`.
- Export TypeScript types from schemas.
- Give user-facing fields clear `.describe()` text when they guide LLM structured output.
- Do not import `z` directly from `zod` unless the project has deliberately standardized on that and Output SDK compatibility has been checked.

## Prompt Rules

- Use frontmatter fields consistent with existing project prompt files.
- Prefer existing provider and model family unless the user asked to change model strategy.
- Do not hard-code dated model IDs from memory. If a model must be updated, inspect project conventions or ask to verify current provider options.
- For structured output, rely on schemas for shape and use prompt text for quality, constraints, and decision criteria.
- Use Liquid variables consistently and include examples only when they improve behavior.

## Finish

After editing, run the smallest safe static verification that exists in the project:

- Typecheck or lint if project scripts exist.
- Unit tests or static checks that do not call external services.
- Cached/offline evals when they do not execute live workflows or providers.

Ask before starting services, executing workflows, calling providers, saving fresh eval outputs, or running commands that use live credentials.
