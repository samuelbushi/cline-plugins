---
name: aws-dev-containers
description: Design, review, and troubleshoot AWS container workloads on ECS, EKS, Fargate, App Runner migrations, and container delivery pipelines.
---

# AWS Dev Containers

Use this skill for ECS, EKS, Fargate, container image startup, service scaling, container networking, and container CI/CD on AWS.

Safety rules:

- Ask before running Docker, `kubectl`, `eksctl`, ECS, EKS, or deployment commands.
- Treat cluster names, task definitions, image names, Kubernetes manifests, logs, and registry details as sensitive.
- Do not deploy, scale, restart, delete, or mutate services without explicit confirmation.
- Verify quotas, supported Kubernetes versions, add-on versions, and Fargate constraints with `awsknowledge` when they matter.

Workflow:

1. Clarify workload type, traffic, team Kubernetes experience, portability needs, compliance needs, and operational tolerance.
2. Default to ECS on Fargate unless the user has a concrete reason for EKS or EC2-backed clusters.
3. Review task or pod resources, health checks, logging, secrets, deployment strategy, autoscaling, and rollback.
4. Check image size and startup path. Consider SOCI or image slimming for large images when startup time matters.
5. For migrations from App Runner or other platforms, plan parallel deployment, custom domain, WAF, CloudFront, and DNS cutover.
6. For EKS, check IRSA or Pod Identity, managed node groups or Karpenter, add-ons, network policy, and cluster upgrade path.

Keep recommendations practical for the user's team. Kubernetes is not a win if no one can operate it.
