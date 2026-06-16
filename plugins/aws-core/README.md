# AWS Core

AWS Core adds the shared AWS MCP server and broad Cline skills for building, deploying, operating, and troubleshooting applications on AWS.

## What It Adds

- `aws-mcp` MCP: a shared AWS documentation MCP server launched through `uvx mcp-proxy-for-aws@1.6.0`.
- Skills for Amazon Bedrock, Amplify Gen 2, billing and cost, CDK, CloudFormation, containers, IAM, messaging and streaming, observability, AWS SDK for JavaScript v3, AWS SDK for Python, AWS SDK for Swift, and serverless workloads.

## Requirements

- `uvx` for the AWS MCP proxy.
- AWS CLI and configured AWS credentials for live account inspection or AWS API calls.
- Service-specific CLIs or runtimes only when the user asks for that workflow, such as CDK, SAM, Docker, Node.js, Python, or Swift tooling.

## Install

```bash
cline plugin install aws-core
```

For local development from this repository:

```bash
cline plugin install ./plugins/aws-core --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Review this CDK stack for replacement risk and production readiness, then show me the exact checks you want to run before any deploy.
```

Cline can use the AWS MCP for current AWS guidance and the bundled skills to route to the right AWS domain, inspect local project files, and ask before live account actions.

## Security Notes

Installing this plugin registers the shared AWS MCP and installs skills. It does not start the MCP, install `uvx`, run AWS commands, create resources, deploy stacks, change IAM, read logs, query billing data, or incur cost on install.

When the MCP is used, queries and context are sent to the remote AWS MCP service through the local proxy. Do not include secrets, customer data, private code, confidential architecture details, or regulated data in MCP queries.

The skills should ask before installing tools, running live AWS CLI or SDK calls, deploying or destroying resources, changing IAM, creating budgets, querying billing data, invoking models, reading account logs, creating dashboards, setting secrets, or running commands that can incur cost.
