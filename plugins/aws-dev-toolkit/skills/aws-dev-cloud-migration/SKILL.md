---
name: aws-dev-cloud-migration
description: Plan migrations to AWS from Azure, GCP, App Runner, or other platforms using dependency discovery, service mapping, migration waves, and cutover planning.
---

# AWS Dev Cloud Migration

Use this skill when the user is migrating workloads to AWS, comparing cloud service equivalents, planning migration waves, or replacing an AWS service with a more suitable AWS target.

Safety rules:

- Ask before reading cloud inventories, running `aws`, `az`, `gcloud`, `kubectl`, Docker, Terraform, or database commands.
- Treat inventories, dependency maps, account IDs, project IDs, network ranges, costs, and cutover dates as sensitive.
- Do not create resources, change DNS, update IAM, or trigger cutover steps without explicit confirmation.
- Verify service mappings and regional availability with `awsknowledge` when they affect the plan.

Workflow:

1. Identify the source platform, target AWS account strategy, workload criticality, data gravity, dependencies, compliance constraints, and cutover tolerance.
2. Classify each workload with the 6Rs: rehost, replatform, refactor, repurchase, retain, retire.
3. Map source services to AWS targets and call out mismatches rather than pretending every service has a perfect equivalent.
4. Group migration waves by dependency, risk, and business priority.
5. Plan data migration, network connectivity, identity, observability, rollback, and validation.
6. Estimate effort and cost ranges with explicit assumptions.
7. Produce a cutover checklist only after the target architecture and rollback path are clear.

Prefer reversible migration steps and parallel runs before hard cutovers.
