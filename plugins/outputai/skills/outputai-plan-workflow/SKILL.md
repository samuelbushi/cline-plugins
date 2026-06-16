---
name: outputai-plan-workflow
description: Plan a new Output SDK workflow or a major workflow change. Use before creating workflow files, adding steps, designing prompts, integrating external services, or adding eval coverage.
---

# Output.ai Workflow Planning

Use this skill when the user asks to create, build, generate, scaffold, or substantially change an Output SDK workflow.

## Planning Contract

Do not jump straight to implementation. Produce a plan the user can review, then implement only after approval or a clear request to continue.

Recommended plan location when writing a file:

```text
.outputai/plans/YYYY_MM_DD_<workflow_name>_<task_name>/PLAN.md
```

If the user only wants a chat plan, keep it in chat and do not create files.

## Requirements

Ask for missing information that materially affects behavior:

- Workflow purpose and trigger.
- Input shape and source.
- Expected output shape and downstream consumer.
- External APIs, databases, files, queues, or services.
- Credentials and environments.
- Latency, cost, retry, timeout, and failure expectations.
- Quality criteria and examples of good and bad output.
- Whether offline evals are required.

If requirements are vague but low-risk defaults are reasonable, state the assumptions before continuing.

## Plan Structure

Use this structure:

```md
# <Workflow Name> Plan

## Goal
What the workflow must accomplish.

## Inputs and Outputs
Input schema, output schema, and notable validation rules.

## Workflow Shape
Step-by-step orchestration, including branching and parallelism.

## Steps
For each step: responsibility, input, output, retries, timeout, and failure mode.

## Prompts
Prompt files needed, model-selection criteria, variables, and output schema usage.

## Credentials and External Services
Credential keys, API clients, and environment requirements.

## Evaluation
Scenarios, datasets, runtime evaluators, offline evals, and acceptance criteria.

## Implementation Files
Exact files to create or modify.

## Open Questions
Questions that block implementation or should be confirmed before live execution.
```

## Design Rules

- Keep workflow code deterministic. Put HTTP calls, database calls, file I/O, and LLM calls inside steps.
- Define schemas in `types.ts`; import `z` from `@outputai/core`.
- Prefer typed step boundaries. Every non-trivial step should declare input and output schemas.
- Use `@outputai/http` for HTTP clients so requests are traced and retried consistently.
- Use `@outputai/credentials` for secrets. Do not hard-code keys or rely on ad-hoc `process.env` reads inside workflow logic.
- Prompts should focus on task quality and content. When structured output is enforced by schema, do not duplicate JSON shape instructions in prose.
- Plan evals before implementation when output quality matters.

## Handoff

End with one of:

- "Ready to implement" plus the exact files to edit.
- "Needs user decision" plus the blocking questions.
- "Needs project context" plus the files or commands to inspect next.
