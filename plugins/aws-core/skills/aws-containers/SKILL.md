---
name: aws-containers
description: Build, deploy, debug, and operate AWS container workloads with ECS, Fargate, ECR, App Runner, task definitions, service scaling, logging, FireLens, ECS Exec, deployment failures, and production readiness.
---

# AWS Containers

Use this skill for AWS container workloads on ECS, Fargate, ECR, and App Runner.

## Operating Rules

- Ask before pushing images, creating repositories, deploying services, changing desired counts, running ECS Exec, or reading logs.
- Do not print secrets from task definitions, environment variables, logs, or container output.
- Use `aws-mcp` when current runtime versions, service limits, or error behavior matters.
- Before querying `aws-mcp`, reduce the request to a sanitized docs or API question. Do not include secrets, account IDs, customer data, private code, log payloads, billing details, or confidential architecture.
- Confirm account, region, cluster, service, and image tag before live actions.

## Workflow

1. Identify the target: ECR image, ECS task definition, ECS service, Fargate platform, App Runner service, or logging pipeline.
2. For deployments, inspect Dockerfile, image tag strategy, task definition, IAM roles, networking, health checks, and logs.
3. For failures, separate image build, image pull, task startup, health check, network, IAM, and application errors.
4. For scaling, identify metric, desired count, min and max capacity, deployment circuit breaker, and rollback strategy.
5. For ECS Exec, ask for confirmation and explain that it opens an interactive path into a running task.

## Safety Checks

- Prefer immutable image tags for production.
- Scope task roles and execution roles separately.
- Avoid logging secrets and redact env vars before summarizing.
- Check public subnet, security group, and load balancer exposure.
