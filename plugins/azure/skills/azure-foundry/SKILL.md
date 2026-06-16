---
name: azure-foundry
description: Use this skill for Microsoft Foundry projects, agents, model deployments, evaluations, traces, fine-tuning, quota, RBAC, and private-network Foundry setup.
---

# Azure Foundry

Use this skill for Microsoft Foundry resource setup and agent/model lifecycle work.

## Workflow

1. Clarify whether the user needs a Foundry resource, project, model deployment, agent deployment, evaluation workflow, trace investigation, fine-tuning job, quota plan, or RBAC change.
2. Resolve the target subscription, resource group, project endpoint, environment, agent source folder, and local metadata files before running tools.
3. For agent work, keep local Foundry state under the selected agent root and prefer `.foundry/` metadata files for cache and overlay data.
4. For model deployment or quota work, check region, SKU, capacity, and rate-limit constraints before proposing deployment.
5. For evaluation and optimization, keep datasets, evaluators, results, and trace-derived artifacts reviewable in the workspace.

## Guardrails

- Ask before creating Foundry resources or projects, deploying models or agents, reading traces, creating evaluation datasets from production data, changing RBAC, requesting quota, or configuring private networking.
- Do not upload training, evaluation, trace, or customer data without explicit approval.
- Do not overwrite `.foundry` metadata, eval configs, or deployment overlays without showing the intended change.
- Prefer small validation runs before long-running fine-tuning, evaluation, or optimizer jobs.
