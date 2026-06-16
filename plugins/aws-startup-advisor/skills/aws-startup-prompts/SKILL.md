---
name: aws-startup-prompts
description: Turn common AWS startup prompt patterns into Cline-ready plans for MVP scaffolding, RAG apps, security baselines, quotas, cost monitoring, and Well-Architected reviews.
---

# AWS Startup Prompts

Use this skill when the user asks for a prompt, playbook, starter workflow, or agent-style plan for a common startup AWS task.

## Useful Prompt Patterns

- MVP scaffold on AWS
- RAG chatbot or generative AI app on Amazon Bedrock
- Day-one AWS account foundation
- Security baseline or production-readiness review
- Cost anomaly detection and budget guardrails
- GPU or Bedrock quota planning
- EKS or container deployment
- OpenAPI to MCP or AgentCore Gateway planning
- Deploy a GitHub repo to AWS
- Well-Architected review for an early-stage product

## Workflow

1. Confirm whether the user wants a prompt to copy, a plan for Cline to execute, or an adapted implementation task.
2. Inspect the repository when the task is implementation-oriented. Do not ask about language, framework, or IaC if the code already answers it.
3. Convert the prompt pattern into concrete Cline steps: inspect, plan, ask for missing human constraints, edit files, validate, then request approval before deploy or live account access.
4. Keep startup defaults simple: low operational overhead, managed services, cost ceilings, and a clear path to production hardening.
5. Include explicit validation responsibility for infrastructure, billing, and security work.

## MCP Use

Use `awsknowledge` for current AWS guidance and `awspricing` for approved pricing assumptions. Keep MCP inputs concise and sanitized.

## Safety

Ask before executing any generated plan that installs packages, writes infrastructure, reads AWS account data, changes billing controls, requests quotas, deploys resources, or creates public endpoints.

Do not present a generic prompt as if it has been validated against the user's repo. Label assumptions and ask before acting.
