---
name: forge-app-review
description: Review an Atlassian Forge app before release. Use for pre-deploy checks of manifest wiring, resolver/frontend matching, scopes, dependencies, tests, deploy readiness, reliability, and obvious security or cost risks.
---

# Forge App Review

Use this skill for broad release-readiness review of a Forge app.

## Scope

This is a general review. Hand off to `forge-security-review` for deep security audit, `forge-cost-optimizer` for detailed consumption tuning, and `forge-debugger` for a known failure.

## Workflow

1. Read `manifest.yml` or `manifest.yaml`.
2. Read `package.json` and relevant package scripts.
3. Inspect backend handlers, resolvers, triggers, web triggers, remotes, and storage usage.
4. Inspect UI Kit or Custom UI entry points, bridge calls, loading states, and error handling.
5. Check tests, README, deploy scripts, and local verification commands when present.
6. Produce findings ordered by release risk.

## Checks

- Manifest modules reference existing handlers and resources.
- Function keys, resolver names, and frontend `invoke()` calls match.
- Scopes match real API usage and are not broader than needed.
- External fetch permissions and remotes match outbound calls.
- Web triggers, scheduled triggers, and product triggers have clear security and operational intent.
- Package versions and scripts fit the Forge runtime and build setup.
- The primary app flow can be tested before deploy.

## Output

Return a concise review with:

- Readiness: ready, needs changes, or blocked.
- Highest-risk area.
- Files inspected.
- Prioritized findings with file evidence and specific recommendations.
- Specialist handoffs if security, cost, or debugging needs deeper work.

Do not modify files unless the user explicitly asks for fixes.
