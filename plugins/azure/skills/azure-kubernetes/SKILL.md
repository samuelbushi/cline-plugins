---
name: azure-kubernetes
description: Use this skill for AKS planning, deployment, scaling, GPU/AI workloads, networking, ingress, identity, observability, and Kubernetes troubleshooting on Azure.
---

# Azure Kubernetes

Use this skill for AKS and Kubernetes workloads that run on Azure.

## Workflow

1. Identify cluster ownership: existing AKS cluster, new cluster, local manifests, Helm chart, Kustomize overlay, or Terraform/Bicep-managed infrastructure.
2. Inspect manifests and deployment config before touching a live cluster.
3. For new clusters, plan node pools, regions/zones, networking, ingress, private cluster needs, workload identity, secrets, autoscaling, and cost controls.
4. For AI/GPU workloads, confirm quota, VM family availability, driver/runtime needs, and fallback capacity.
5. For troubleshooting, prefer read-only diagnostics first: events, pod status, logs, resource requests/limits, ingress, service endpoints, and identity bindings.

## Guardrails

- Ask before running `kubectl` against a live cluster, applying manifests, changing node pools, scaling workloads, changing ingress/DNS, or reading production logs.
- Do not assume the current kube-context is safe. Show the cluster/context before live operations.
- Do not expose secrets from Kubernetes resources, Azure Key Vault, environment variables, or logs.
- Prefer `kubectl diff`, Helm dry-run, and Terraform/Bicep plans before apply.
