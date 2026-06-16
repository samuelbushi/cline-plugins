---
name: forge-security-review
description: Perform a white-box security review of Atlassian Forge apps. Use for authz review, tenant isolation, web trigger hardening, injection checks, egress/remotes review, secrets handling, Rovo action risks, or security audit requests.
---

# Forge Security Review

Use this skill for security-focused review of Forge apps.

## Workflow

1. Read `manifest.yml` first.
2. Map modules, web triggers, scheduled triggers, Rovo modules, remotes, external fetch permissions, scopes, resources, and runtime.
3. Map frontend entry points to bridge calls and backend resolvers.
4. Trace privileged paths from input to authorization checks to product API calls, storage, external fetches, and logs.
5. Validate findings with code evidence. Do not report scanner output or suspicious strings as confirmed vulnerabilities without exploitability.
6. Do not modify app code unless the user asks for fixes.

## Review Areas

- AuthN and AuthZ: missing resolver checks, unsafe `api.asApp()` usage, display-condition bypass, and scope overreach.
- Tenant isolation: global state, caches, storage keys, warm starts, and cross-site data mixing.
- Injection: XSS, SQL or query injection, SSRF, command execution, prototype pollution, and unsafe HTML rendering.
- Egress and remotes: wildcard fetch permissions, redirects, untrusted domains, and missing allowlists.
- Web triggers and public entry points: authentication, replay, rate limiting, and payload validation.
- Secrets and storage: hardcoded credentials, leaked environment values, excessive logging, and insecure app storage patterns.
- Rovo agents and actions: privilege escalation, unsafe tool/action exposure, and prompt-injection paths from Atlassian content.
- Dependencies and static analysis: run tools only when useful and approved.

## Output

Return confirmed findings ordered by severity with:

- Evidence path and line.
- Attack path or abuse scenario.
- Impact.
- Recommended fix.
- Residual assumptions or evidence gaps.

Keep hardening notes separate from confirmed vulnerabilities.
