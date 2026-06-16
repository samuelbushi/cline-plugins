---
name: aws-dev-iac-review
description: Scaffold, validate, diagram, and review AWS infrastructure-as-code across CDK, Terraform, CloudFormation, SAM, and Pulumi.
---

# AWS Dev IaC Review

Use this skill when creating IaC structure, reviewing infrastructure code, generating architecture diagrams from IaC, or scanning templates for correctness, cost, and security issues.

Safety rules:

- Ask before running local scanners, CDK, Terraform, SAM, Pulumi, or AWS commands.
- Treat IaC, plan output, generated diagrams, ARNs, account IDs, and secrets in state files as sensitive.
- Do not run `terraform apply`, `cdk deploy`, `sam deploy`, stack updates, or destructive commands unless explicitly requested and confirmed.
- Use `awsiac` for template validation only with approved files or snippets.

Workflow:

1. Identify IaC framework, environment, target account, and whether the task is scaffold, review, diagram, or validation.
2. For scaffolding, create a small conventional structure with environment separation, reusable modules or constructs, and deployment scripts.
3. For review, inspect changed IaC first, then run approved scanners such as `awsiac`, `checkov`, `cfn-nag`, `tfsec`, `terraform validate`, or `cdk diff`.
4. Check IAM least privilege, public exposure, encryption, logging, backup, lifecycle policies, and cost traps.
5. Generate diagrams in Mermaid or concise ASCII when helpful, but keep them tied to actual resources.
6. Report findings by severity with concrete remediation and exact file references.

Prefer reviewing plans and generated templates before deployment. A clean deploy is not the same as a safe architecture.
