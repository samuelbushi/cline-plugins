---
name: azure-ai-services
description: Use this skill for Azure AI Search, Azure OpenAI, Speech, Document Intelligence, Vision, translation, content safety, model deployment planning, and AI gateway/API Management patterns.
---

# Azure AI Services

Use this skill for Azure AI service design and implementation, including search, embeddings, speech, document extraction, content safety, and API gateway integration.

## Workflow

1. Identify the data flow, model or service, regions, compliance constraints, expected traffic, and cost sensitivity.
2. Prefer managed identity or Key Vault references for service credentials.
3. For Azure AI Search, design indexes before writing code: fields, analyzers, vector dimensions, semantic configuration, filters, and refresh strategy.
4. For Azure OpenAI or model deployments, confirm model availability, quota, SKU, rate limits, and content filtering requirements before provisioning.
5. For Speech, Vision, Translation, or Document Intelligence, clarify data sensitivity and retention expectations before processing user data.
6. Use Azure MCP documentation/resource tools for current service details after the user approves live lookups.

## Guardrails

- Ask before querying live Azure resources, submitting documents/audio/images, creating deployments, changing gateway policies, or reading production data.
- Do not print API keys, endpoint secrets, connection strings, or customer data into generated docs or chat summaries.
- Keep generated samples scoped to least privilege and environment-based configuration.
- Call out cost and quota implications for vector indexes, model deployments, batch jobs, and high-throughput speech or document workloads.
