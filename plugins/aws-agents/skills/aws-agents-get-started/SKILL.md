---
name: aws-agents-get-started
description: Choose an AgentCore framework, check prerequisites, and scaffold a first AI agent project on AWS. Use when the user wants to create a new AWS agent, compare Strands or LangGraph style options, set up AgentCore local development, or understand the first deploy path.
---

# AWS Agents Get Started

Use this skill when the user wants to start an AWS AgentCore project or understand the first working path from local code to a deployed agent.

## Operating Rules

- Treat account access and project creation as approval-gated actions. Ask before installing tools, running `agentcore create`, creating files outside the workspace, deploying, or invoking AWS APIs.
- Use the `awsknowledge` MCP when available for current AWS service guidance instead of guessing.
- Keep credentials out of commands, source files, logs, and chat. Use AWS profiles, environment variables, or secret managers.
- Do not run networked setup commands just to check that a package exists. Explain what you plan to run and why.

## Workflow

1. Clarify whether the user is exploring or ready to create a project.
2. Inspect the workspace for an existing AgentCore project before scaffolding:

   ```sh
   find . -maxdepth 4 -path "*/agentcore/agentcore.json" -print
   ```

3. If the user is exploring, compare likely framework choices in practical terms:
   - Strands for AWS-native agent workflows and tool integrations.
   - LangGraph for explicit graph control and stateful orchestration.
   - Existing app framework when the user is migrating code they already own.
4. If the user is ready, confirm the project name, runtime, region, AWS profile, and framework.
5. Before creating anything, verify local prerequisites only after the user approves:

   ```sh
   aws --version
   agentcore --version
   node --version
   python --version
   ```

6. Generate or run scaffold commands only after the user confirms the exact target directory and account context.
7. After scaffolding, explain the next useful command, likely local dev, validation, or deploy preflight. Do not deploy unless the user explicitly asks.

## Good Output

End with concrete next steps and any commands the user approved. If a prerequisite is missing, give the smallest fix and stop before account mutation.
