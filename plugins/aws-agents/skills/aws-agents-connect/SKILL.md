---
name: aws-agents-connect
description: Connect an AWS AgentCore agent to external APIs, Lambda tools, MCP servers, Gateway targets, outbound credentials, and Cedar tool-access policies.
---

# AWS Agents Connect

Use this skill when the user wants an AgentCore agent to call tools, APIs, Lambda functions, MCP servers, or other services.

## Operating Rules

- Do not store or print API keys, OAuth tokens, JWTs, or AWS credentials.
- Ask before creating Gateway resources, credentials, targets, policies, Lambda functions, or AWS account changes.
- Prefer Gateway targets for external APIs and tool access when they reduce credential exposure in agent code.
- Use Cedar policies for tool restrictions when access needs to depend on user, role, tenant, amount, environment, or request attributes.

## Workflow

1. Read `agentcore/agentcore.json` if present and identify existing gateways, targets, credentials, and framework.
2. Clarify what the user is connecting:
   - External MCP server.
   - Lambda function.
   - OpenAPI service.
   - API Gateway REST API.
   - Direct service integration that may need a wrapper first.
3. Identify auth type and where credentials should live:
   - AWS IAM or SigV4.
   - OAuth.
   - API key.
   - No auth.
4. Use `awsknowledge` when current Gateway, MCP, or Cedar syntax matters.
5. Draft the minimal integration path and list the exact files, resources, and commands.
6. Ask for confirmation before running commands that create credentials, mutate Gateway targets, deploy Lambda, or update policies.

## Review Points

- Avoid putting outbound credentials in agent prompts, source files, or logs.
- Explain which tools the agent will gain and which users or sessions can call them.
- For Cedar, include sample allow and deny cases before applying the policy.
- For MCP, avoid registering duplicate servers if the project already has a working equivalent.
