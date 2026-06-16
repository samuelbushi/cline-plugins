---
name: fastly-ngwaf-audit
description: Use for read-oriented Fastly Next-Gen WAF audits, including workspace listing, enabled rule checks, login protection, credit card validation, gift card validation, missing signal detection, and identifying potentially uncovered login endpoints.
---

# Fastly NGWAF Audit

Use this skill to audit Fastly Next-Gen WAF posture. It is read-oriented by default.

## Requirements

- `FASTLY_API_TOKEN` with permission to read NGWAF workspaces and rules.
- `jq` for local JSON inspection.
- User confirmation before creating, enabling, disabling, or changing any WAF rule.

## Audit Workflow

1. List NGWAF workspaces.
2. Fetch rules for each workspace.
3. Check whether expected templated rules exist and are enabled.
4. Report missing or disabled rules by workspace.
5. If login protection is missing, optionally inspect recent request paths for login-like traffic.
6. Recommend remediation but ask before making changes.

## Read-Only Commands

List workspaces:

```bash
curl -s -H "Fastly-Key: $FASTLY_API_TOKEN" \
  "https://api.fastly.com/ngwaf/v1/workspaces?limit=200" \
  | jq '.data[] | {id, name}'
```

Fetch rules:

```bash
curl -s -H "Fastly-Key: $FASTLY_API_TOKEN" \
  "https://api.fastly.com/ngwaf/v1/workspaces/$WORKSPACE_ID/rules?limit=200"
```

Check a signal:

```bash
curl -s -H "Fastly-Key: $FASTLY_API_TOKEN" \
  "https://api.fastly.com/ngwaf/v1/workspaces/$WORKSPACE_ID/rules?limit=200" \
  | jq '[.data[] | select(.actions[].signal == "LOGINDISCOVERY") | {id, enabled}]'
```

Search for login-like request paths when login rules are missing:

```bash
curl -s -H "Fastly-Key: $FASTLY_API_TOKEN" \
  "https://api.fastly.com/ngwaf/v1/workspaces/$WORKSPACE_ID/requests?limit=100&page=1&q=from%3A-30min%20method%3APOST%20path%3A~%22%2Alogin%2A%22" \
  | jq -r '.data[].path' | sort | uniq -c
```

## Signals To Check

- Login protection: `LOGINDISCOVERY`, `LOGINATTEMPT`, `LOGINSUCCESS`, `LOGINFAILURE`.
- Credit card validation: `CC-VAL-ATTEMPT`, `CC-VAL-FAILURE`, `CC-VAL-SUCCESS`.
- Gift card validation: `GC-VAL-ATTEMPT`, `GC-VAL-FAILURE`, `GC-VAL-SUCCESS`.

## Report Format

For each workspace, report:

- Workspace ID and name.
- Missing signals.
- Disabled signals.
- Evidence from read-only API output.
- Suggested next action.
- Whether the next action requires a WAF change approval.
