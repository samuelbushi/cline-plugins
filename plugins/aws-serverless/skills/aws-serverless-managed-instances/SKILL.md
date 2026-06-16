---
name: aws-serverless-managed-instances
description: Evaluate and migrate predictable Lambda workloads to AWS Lambda Managed Instances, including concurrency, cost, capacity providers, thread safety, and rollout planning.
---

# AWS Serverless Managed Instances

Use this skill when the user mentions Lambda Managed Instances, LMI, dedicated instance Lambda, capacity providers, predictable high-volume workloads, cold start reduction, multi-concurrency Lambda, Graviton migration, or Lambda versus EC2 cost tradeoffs.

## Workflow

1. Confirm whether LMI is available for the user's target region, account, runtime, and workload requirements.
2. Gather workload profile: average and peak concurrency, request duration, memory, CPU intensity, I/O behavior, traffic predictability, latency goals, current Lambda cost, and availability targets.
3. Compare standard Lambda, provisioned concurrency, SnapStart where applicable, ECS or EC2, and LMI. Do not assume LMI is cheaper.
4. Identify thread-safety and concurrency risks before recommending migration:
   - Shared globals
   - Mutable caches
   - Connection pools
   - Hardcoded `/tmp` paths
   - Non-thread-safe libraries
   - Per-invocation credentials or context leakage
5. Recommend a gradual rollout through versions and weighted aliases. Start in non-production and compare metrics before full cutover.
6. Define alarms for throttles, CPU, memory, errors, latency, queue age, and cost anomalies.
7. Include rollback steps and a decommission plan only after metrics prove the migration is stable.

## MCP Use

Use `aws-serverless-mcp` for Lambda guidance and generated templates only after narrowing the request. Avoid sending full production code or logs. Use sanitized metrics and approved identifiers.

## Safety

Ask before creating capacity providers, changing function configuration, publishing versions, shifting aliases, changing VPC settings, changing IAM roles, reading production metrics or logs, or making cost-bearing changes.

Do not recommend minimum capacity without an explicit cost ceiling and availability goal. Explain the tradeoff between warm capacity, multi-AZ resilience, and idle cost.
