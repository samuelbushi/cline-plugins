---
name: outputai-sdk-patterns
description: Review or write Output SDK implementation details. Use for workflow structure, steps, schemas, prompt files, HTTP clients, model selection, error handling, code style, and common SDK mistakes.
---

# Output.ai SDK Patterns

Use this skill for implementation review and small changes inside Output SDK projects.

## Workflow Determinism

Allowed in `workflow.ts`:

- Calling steps and evaluators.
- Deterministic branching and loops over known inputs.
- Passing typed data between steps.

Avoid in `workflow.ts`:

- HTTP calls, database calls, file I/O, or direct provider calls.
- `Date.now()`, random values, UUID generation, or clock-dependent behavior.
- Dynamic imports or process inspection.
- Reading secrets directly.

Put those operations in steps.

## Steps

Good steps:

- Have one clear external responsibility.
- Declare input and output schemas.
- Use traced clients such as `@outputai/http` when appropriate.
- Set retries and timeouts intentionally.
- Throw validation or fatal errors for permanent failures.
- Let transient errors surface so framework retry policies can work.

Avoid broad catch blocks. Catch only known error classes when converting to a clearer permanent error.

## Schemas

- Import `z` from `@outputai/core` unless project docs prove another source is required.
- Keep schemas close to the workflow in `types.ts`.
- Export inferred TypeScript types.
- Use `.describe()` on fields that guide LLM structured output.
- Reuse shared schemas only when they are truly shared across workflows.

## Prompts

Prompt files usually combine YAML frontmatter with message content. Follow local examples first.

Guidance:

- Use provider and model conventions already present in the project.
- Do not update model IDs from memory. Check existing conventions or ask to verify current provider options.
- When using schema-enforced structured output, prompts should describe quality and reasoning, not duplicate JSON structure.
- Use Liquid variables consistently and keep example inputs realistic.
- Separate system-level behavior, user task, context, and examples when the prompt is complex.

## HTTP Clients

Shared clients belong in `src/shared/clients/` when more than one step uses them.

Client guidance:

- Read secrets through `@outputai/credentials`.
- Add clear timeout and retry behavior.
- Preserve useful API error details without logging secrets.
- Return typed data to steps.
- Keep endpoint paths and request bodies easy to test.

## Common Fixes

- Zod mismatch: import `z` from `@outputai/core` consistently.
- Missing schemas: add input and output schemas to the step boundary.
- Direct I/O in workflow: move the operation into a step.
- Swallowed retry: remove catch blocks that hide transient errors.
- Prompt/schema drift: let schema define output shape and prompt define quality.
- Secret leakage: move secret reads to credentials and redact logs.
- Expensive run loop: use cached evals or targeted reset instead of full live workflow execution.

## Review Output

For reviews, report:

- Blocking correctness issues.
- Safety or credential risks.
- Determinism and retry concerns.
- Schema and prompt drift.
- The smallest fix that preserves the project style.
