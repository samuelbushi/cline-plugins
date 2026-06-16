---
name: agentforce-secure
description: Use this skill when planning or running authorized security reviews, prompt-injection checks, OWASP LLM checks, red-team tests, or hardening work for Salesforce Agentforce agents.
---

# Agentforce Secure

Use this skill for authorized security assessment and hardening of Salesforce Agentforce agents.

## Authorization First

Before any live security probe, confirm:

- The user is authorized to test the target org and agent.
- The org alias, agent name, and environment type are explicit.
- The test mode and scope are approved.
- The user understands that probes may exercise live actions in the org.

Do not run prompt-injection, data-exfiltration, destructive-action, or excessive-agency probes against production unless the user explicitly confirms production scope.

## Security Categories

Plan coverage across these areas:

- Prompt injection and instruction override attempts.
- Sensitive information disclosure.
- System prompt and hidden policy leakage.
- Excessive agency, unauthorized actions, or privilege escalation.
- Unsafe output handling such as HTML, SQL, command, URL, or path injection.
- Misinformation and unsupported claims.
- Unbounded consumption, recursion, or cost-amplification behavior.

## Workflow

1. Resolve the target org and Agentforce agent.
2. Confirm whether the assessment is quick, full, or focused on specific risks.
3. Present the proposed probe categories and sample probes for approval.
4. Start an Agentforce preview session only after approval.
5. Send probes with controlled pacing and keep a record of each response.
6. Review traces when available to confirm actions, data access, and refusal behavior.
7. Grade findings by impact, exploitability, and whether a real org action was attempted.
8. Recommend concrete changes to Agent Script instructions, action allowlists, data scopes, or confirmation gates.
9. Rerun only the relevant probes after fixes.

## Useful Commands

```bash
sf config get target-org --json
sf data query --json -o <org_alias> -q "SELECT Id, MasterLabel, DeveloperName FROM GenAiPlannerDefinition WHERE MasterLabel LIKE '%<name>%' OR DeveloperName LIKE '%<name>%'"
sf agent preview start --json --authoring-bundle <Developer_Name> -o <org_alias>
sf agent preview send --json --session-id <session_id> --authoring-bundle <Developer_Name> --utterance "<probe>" -o <org_alias>
sf agent preview end --json --session-id <session_id> --authoring-bundle <Developer_Name> -o <org_alias>
```

## Hardening Guidance

- Move irreversible or high-impact actions behind explicit user confirmation.
- Narrow action permissions and data access to the agent's purpose.
- Add grounded refusal behavior for requests outside the agent scope.
- Require source-backed answers for knowledge-grounded agents.
- Avoid revealing internal instructions, tool names, credentials, tenant details, or trace internals.
- Add regression tests for every confirmed security finding.
