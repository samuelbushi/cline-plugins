---
name: output-meta-pre-flight
description: Pre-flight validation checks for Output SDK workflow operations. Ensures conventions are followed, requirements are gathered, and quality gates are passed before workflow execution.
---

# Pre-Flight Rules for Output SDK Workflows

## Execution Requirements

- Steps may name an intended role in a `subagent=""` XML attribute. In Cline, use that role as guidance for the perspective to apply. If Cline subagents are available and useful, you may delegate; otherwise perform the work directly.
- Process all XML blocks sequentially and completely
- Execute every numbered step in the process_flow EXACTLY as specified

## Output SDK Knowledge Check
Ensure you have a deep understanding of the Output SDK and its capabilities. If not, use the `output-meta-project-context` skill and read it carefully.

## Output SDK Conventions Check

Before proceeding with any workflow operation, verify:

- ES Modules: All imports MUST use `.js` extension for ESM modules
- HTTP Client: NEVER use axios directly - always use @outputai/http wrapper
- LLM Client: NEVER use a direct llm call - always use @outputai/llm wrapper
- Worker Restarts: If the project has a worker process and the user wants to run or verify workflows, ask before restarting it. Prefer the project's documented command.
- Documentation: If the project has a documented workflow-doc generation command, ask before running it after modifications.

## Requirements Gathering Strategy

### Smart Defaults Application
When information is not explicitly provided, apply these defaults:
- Retry Policies: 3 attempts with exponential backoff (1s initial, 10s max)
- Model selection: Run [`output-dev-model-selection`](../output-dev-model-selection/SKILL.md) to pick the current default for the chosen provider. Don't pin a specific model ID here - the listing changes faster than the docs.
- Error Handling: ApplicationFailure patterns with appropriate error types
- Performance: Optimize for clarity and maintainability over raw speed
- Timeouts: 30 seconds for activities, 5 minutes for workflows

### Critical Information Requirements
Only stop to ask for clarification on:
- Ambiguous input/output structures that cannot be inferred from context
- Specific API keys or services not commonly used in the project
- Non-standard error handling or recovery requirements
- Complex orchestration patterns requiring specific sequencing
- External dependencies not already in the project

## Template Processing Rules

- Use exact templates as provided in each step
- Replace all template variables with actual values:
  - `` - The workflow being planned
  - `` - Root project directory path
  - `` - User-provided requirements
  - `` - Current date in YYYY-MM-DD format
  - `` - Current Output SDK version

## Quality Gates

Before proceeding past pre-flight:
1. Confirm all required context is available
2. Verify understanding of the workflow's purpose
3. Check for existing similar workflows to use as patterns
4. Ensure Output SDK conventions are understood
5. Validate that named role perspectives are covered, either directly or through available Cline subagents

## Plan Creation Rules

- Complex tasks can be tracked in chat, Cline's task plan, or a workflow plan file depending on user preference.
- Only create `.outputai/plans` files after the user asks for or approves file output.
- If writing a plan file, name the folder with the date, workflow name, and task name. e.g. `2025_12_16_simple_sum_workflow_creation_plan/PLAN.md`.
- If implementation progress needs a durable file, ask before creating a `TASK.md` next to the plan.
- Use a markdown todo list to track plan progress when a file is appropriate.
