---
name: aws-agents-harden
description: Review AWS AgentCore production readiness, including IAM scope, inbound auth, secrets, session lifecycle, input validation, quotas, throttling, rate limits, and cold-start risk.
---

# AWS Agents Harden

Use this skill when the user wants an AgentCore agent ready for production.

## Operating Rules

- Treat IAM, auth, secrets, quotas, and production traffic changes as high-impact. Ask before changing them.
- Do not accept broad permissions as production-ready without calling out the risk.
- Do not print raw secret, token, credential, or private key values from config, logs, scripts, or shell output.
- Keep the review tied to the user's actual project and threat model.
- Use `awsknowledge` for current service limits, auth patterns, and production guidance.

## Workflow

1. Read project config and identify runtime, framework, network mode, memory, Gateway targets, credentials, and evaluators.
2. Ask for production context:
   - Who can invoke the agent.
   - Tenant or customer boundaries.
   - Expected request rate and latency needs.
   - Data sensitivity.
   - Required audit or compliance controls.
3. Review these areas:
   - IAM least privilege for Bedrock, runtime, logs, memory, Gateway, and data sources.
   - Inbound auth with JWT, SigV4, or service-to-service controls.
   - Outbound credential storage and rotation.
   - Secret handling in code, logs, prompts, and CI.
   - Session lifecycle and cleanup.
   - Rate limits, quotas, retries, and backpressure.
   - Input validation and tool authorization.
   - Cold start and dependency initialization.
4. Produce a prioritized checklist with concrete fixes.
5. Ask before applying any change.

## Good Output

Separate findings into must fix before launch, should fix soon, and acceptable for now. Include why each item matters and the smallest practical remediation.
