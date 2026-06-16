---
name: amazon-bedrock
description: Build and troubleshoot Amazon Bedrock applications, including model invocation, Converse API, Knowledge Bases, Guardrails, Agents, AgentCore, model selection, quota checks, prompt caching, migration between model families, and Bedrock cost attribution.
---

# Amazon Bedrock

Use this skill for Amazon Bedrock and AgentCore work. Do not use it for custom model training, Rekognition, or Comprehend tasks.

## Operating Rules

- Ask before invoking models, creating Knowledge Bases, changing guardrails, deploying agents, changing AgentCore resources, or running AWS account commands.
- Use `aws-mcp` when available for current model IDs, regions, quotas, API shapes, and service limits.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.
- Treat prompts, retrieved documents, traces, and model responses as potentially sensitive. Do not print secrets or regulated data.
- Set explicit token limits and cost expectations before repeated or large model calls.

## Workflow

1. Identify the task type: model invocation, RAG, guardrails, agents, AgentCore, migration, prompt caching, quota, error diagnosis, or cost.
2. Confirm region, model access, SDK or CLI version, and required account context before live calls.
3. Prefer the Converse API for new chat-style apps unless a specific API feature requires another Bedrock endpoint.
4. For Knowledge Bases, separate ingestion, retrieval, vector store choice, permissions, and chunking.
5. For Guardrails, call out what is filtered, what is logged, and what still needs application-side validation.
6. For AgentCore, separate runtime, gateway, memory, registry, evaluation, observability, and credentials.

## Good Output

Give the user a concrete plan, commands or code only after approval, and a clear note on cost, permissions, region constraints, and data handling.
