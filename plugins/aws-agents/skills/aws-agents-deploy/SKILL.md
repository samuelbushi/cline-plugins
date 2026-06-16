---
name: aws-agents-deploy
description: Validate and deploy AWS AgentCore agents, diagnose failed deploys, and plan rollback, version pinning, or canary release steps.
---

# AWS Agents Deploy

Use this skill when the user is ready to deploy an AgentCore agent or needs help with a failed deployment.

## Operating Rules

- Never deploy, roll back, delete, or change AWS resources without explicit user confirmation.
- Confirm AWS profile, account, region, target environment, and expected cost or blast radius before deployment commands.
- Prefer preflight checks and local file inspection before live account actions.
- Treat deployment errors as diagnostic evidence. Do not retry repeatedly without identifying what changed.

## Workflow

1. Read local deployment context:

   ```sh
   find . -maxdepth 4 \( -path "*/agentcore/agentcore.json" -o -path "*/agentcore/aws-targets.json" \) -print
   ```

2. Determine whether the user wants:
   - Preflight validation.
   - First deploy.
   - Failed deploy diagnosis.
   - Rollback or version pinning.
   - Canary release planning.
3. For preflight, inspect config files and propose read-only checks first.
4. Before any live deploy command, ask the user to confirm account, region, and target.
5. If diagnosing failure, collect the exact error, relevant config, and recent command output. Use `awsknowledge` for service-specific errors.
6. For rollback, identify the desired previous version and the consequences before running any command.

## Good Output

Provide a short deploy readiness result:

- Ready, with the exact command awaiting approval.
- Not ready, with the smallest fixes.
- Failed, with likely root cause and next diagnostic command.
