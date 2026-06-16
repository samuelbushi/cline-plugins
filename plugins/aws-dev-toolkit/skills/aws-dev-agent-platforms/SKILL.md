---
name: aws-dev-agent-platforms
description: Design and review AI agent platforms on AWS, including Amazon Bedrock, AgentCore, Strands Agents, knowledge bases, guardrails, observability, and MLOps.
---

# AWS Dev Agent Platforms

Use this skill when the user is building agents, RAG systems, Bedrock workloads, AgentCore deployments, Strands Agents projects, or ML platform workflows on AWS.

Safety rules:

- Ask before invoking models, creating Bedrock resources, deploying AgentCore runtimes, creating knowledge bases, reading private documents, or sending prompts to embedding or model services.
- Treat prompts, eval sets, source documents, traces, embeddings, account IDs, and model outputs as sensitive.
- Verify rapidly changing AWS facts with `awsknowledge` before naming model IDs, quotas, region support, pricing, API parameters, or AgentCore feature support.
- For docs lookups, sanitize the request. For live API calls, send only the minimum approved identifiers and payload.

Workflow:

1. Clarify the agent job, users, latency, data sources, tool needs, memory needs, evaluation bar, and deployment target.
2. Decide whether the workload needs direct Bedrock model calls, Bedrock Agents, AgentCore Runtime, Strands Agents, knowledge bases, guardrails, or a simpler service.
3. Pick the smallest model and orchestration surface likely to work, then explain when to upgrade.
4. Design IAM, network access, secrets, guardrails, tracing, logging, and evals from the start.
5. For prototypes, keep the tool set small and make every production gap explicit.
6. For production, recommend IaC, CI/CD, budgets, retry behavior, timeout limits, and rollback paths.
7. Use `awspricing` only after the user approves the service and region assumptions for the estimate.

Do not scaffold or deploy agent projects until the user confirms language, runtime, account, region, and cost expectations.
