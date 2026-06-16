---
name: aws-agents-build
description: Add capabilities to an existing AWS AgentCore project, including memory, app invocation, VPC access, multi-agent orchestration, migration, browser tools, code interpreter, model changes, and teardown planning.
---

# AWS Agents Build

Use this skill when an existing AgentCore project needs new capabilities.

## Operating Rules

- Ask before changing project files, running AgentCore commands, provisioning resources, deleting resources, or changing AWS account state.
- Read local project configuration before recommending changes.
- Prefer a narrow change that supports the user's stated workflow over adding every available AgentCore feature.
- Keep secrets and credential material out of code, logs, commits, and chat.

## Workflow

1. Find and read project context:

   ```sh
   find . -maxdepth 4 -path "*/agentcore/agentcore.json" -print
   ```

2. If no project is found, ask whether to use `aws-agents-get-started` first or point Cline at the existing project.
3. Identify the capability:
   - Memory for cross-session context.
   - App integration for calling the agent from a web, mobile, or backend app.
   - VPC access for private databases or internal APIs.
   - Multi-agent orchestration for specialist agents or A2A flows.
   - Migration from an existing Bedrock Agent or framework.
   - Browser tool or code interpreter for controlled runtime capabilities.
   - Teardown or resource removal.
4. Use `awsknowledge` for current AWS guidance when the exact config shape or service limit matters.
5. Make a short plan that names the resources, files, and commands involved.
6. Only execute mutating commands after the user confirms the plan.

## Safety Checks

- For VPC work, call out subnets, security groups, egress expectations, and private service dependencies.
- For memory, call out retention, tenant boundaries, and whether cross-account policies are needed.
- For multi-agent work, make delegation boundaries explicit so the orchestrator and specialists do not duplicate responsibilities.
- For teardown, list resources that will be removed and ask for explicit confirmation before running any delete command.
