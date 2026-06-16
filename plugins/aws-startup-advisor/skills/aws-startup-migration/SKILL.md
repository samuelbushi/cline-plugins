---
name: aws-startup-migration
description: Plan GCP-to-AWS, OpenAI-to-Bedrock, Gemini-to-Bedrock, and agentic workload migrations with discovery, clarification, design, cost estimation, and artifacts.
---

# AWS Startup Migration

Use this skill when the user wants to migrate workloads from GCP to AWS, move AI workloads to Amazon Bedrock, replace OpenAI or Gemini dependencies with AWS services, or retarget agentic workloads to AWS.

## Workflow

1. Confirm migration source and target. Supported sources are GCP infrastructure, OpenAI or Gemini AI usage, and agentic framework workloads moving to AWS.
2. Require at least one discovery input before design: Terraform, app code, dependency manifests, cloud usage exports, billing exports, architecture diagrams, or a user-provided inventory.
3. Run phases in order: discover, clarify, design, estimate, generate artifacts. Do not skip clarify before design or estimates.
4. Preserve application architecture unless the user asks for modernization.
5. Prefer Terraform for generated migration artifacts unless the repo already uses CDK, SAM, Pulumi, or another clear IaC choice.
6. Estimate infrastructure costs from explicit assumptions and pricing lookups. Do not include human labor or professional services as dollar estimates.
7. For BigQuery, data warehouse, analytics, regulated data, or complex networking migrations, flag specialist review instead of pretending the migration is mechanical.
8. For AI provider migration, map by required modality, latency, quality, context window, tool use, compliance, and cost. Never claim one-to-one model parity without evaluation.

## MCP Use

Use `awspricing` for approved pricing lookups and `awsknowledge` for AWS service guidance. Keep queries scoped to sanitized service names, regions, dimensions, and assumptions.

## Safety

Ask before reading billing exports, cloud inventories, Terraform state, production configs, account IDs, customer data, prompts, model logs, or sensitive private source files, even when those files are inside the current repo.

Ask before generating deployable IaC, changing infrastructure, running cloud CLIs, requesting service quotas, or starting any migration step that can incur cost.

Do not print secrets or migration-sensitive business details. Keep generated artifacts in the workspace and call out assumptions clearly.
