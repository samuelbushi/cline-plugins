---
name: outputai-project-context
description: Understand an existing Output SDK or Output.ai workflow project. Use when the user asks about project structure, available workflows, conventions, prompts, steps, credentials, services, or where to make a change.
---

# Output.ai Project Context

Use this skill to orient before planning, editing, or debugging an Output SDK project.

## First Pass

Inspect only the files needed to answer the current question. Prefer targeted reads over broad repository sweeps.

Look for:

- `package.json` and lockfiles to identify Output SDK package versions and available scripts.
- `src/workflows/*/workflow.ts` for workflow orchestration.
- `src/workflows/*/steps.ts` or `src/workflows/*/steps/*.ts` for external I/O and retryable work.
- `src/workflows/*/types.ts` for Zod schemas and exported types.
- `src/workflows/*/prompts/*.prompt` for LLM prompt configuration.
- `src/workflows/*/scenarios/*.json` for runnable inputs and examples.
- `src/workflows/*/evaluators.ts` or `src/workflows/*/evaluators/*.ts` for quality checks.
- `src/shared/clients/*` for API clients.
- `config/credentials*.yml.enc`, `config/credentials.key`, and workflow credential files only when the user asks about credentials.

Do not read decrypted secrets or private data just to build context.

## Core Mental Model

Output SDK workflows should keep orchestration deterministic. The workflow function decides order and control flow. Steps perform external I/O, file access, HTTP calls, database calls, LLM calls, and other work that needs tracing, retries, and isolation.

Common project pieces:

- `workflow.ts`: calls steps, evaluators, and deterministic control flow.
- `steps.ts`: defines step functions with schemas, retry policy, timeout, and I/O.
- `types.ts`: owns input and output schemas. Import `z` from `@outputai/core`.
- `prompts/*.prompt`: prompt frontmatter and message templates for LLM steps.
- `scenarios/*.json`: representative inputs for local runs and tests.
- `evaluators.ts`: runtime or offline quality checks.
- `config/credentials*.yml.enc`: encrypted secret storage.

## Routing

After context discovery, switch to the narrow skill:

- New workflow or large feature: `outputai-plan-workflow`.
- Implementing a plan: `outputai-build-workflow`.
- Runtime failure or wrong output: `outputai-debug-workflow`.
- Credential setup or secret access: `outputai-credentials`.
- Evaluation datasets, judges, or audit: `outputai-evals`.
- Code review, prompt files, schemas, HTTP clients, or common errors: `outputai-sdk-patterns`.

## Context Report

When reporting context, include:

- Detected Output SDK package and version when visible.
- Workflow names and directories relevant to the task.
- The files you inspected.
- Any missing or ambiguous project convention.
- The next skill or concrete next step.

Avoid dumping full file contents unless the user asks.
