---
name: fastly-cli
description: Use when running or drafting Fastly CLI commands for services, versions, domains, backends, VCL snippets, logging, TLS, Compute, stores, stats, auth, cache purging, NGWAF, and account inspection.
---

# Fastly CLI

Use the `fastly` CLI for Fastly operations when it supports the task. Draft commands carefully; several subcommands are nested in non-obvious places.

## Safety

- Prefer read-only commands first, such as `fastly service list`, `fastly service describe`, `fastly stats`, and `fastly whoami`.
- Ask before commands that mutate services, activate versions, purge cache, deploy Compute packages, alter TLS, edit logging, change WAF/rate limit rules, or modify account access.
- Do not run `fastly auth show --reveal` or token-printing commands in a terminal transcript. Prefer implicit Fastly CLI credential resolution, a named stored profile, or `FASTLY_API_TOKEN` supplied by the user's environment. Disable shell tracing and avoid debug output around token-bearing commands.
- Use `--json` for scripts when the command supports it. Do not assume `--json` is global; it is command-specific.

## Command Patterns

- Most service resources are under `fastly service`, not top-level commands.
- Domain management is usually `fastly service domain ...`, not `fastly domain ...`.
- Logging endpoints are under `fastly service logging ...`.
- Version-scoped changes should use `--version active --autoclone` unless the user explicitly chooses a version.
- Boolean flags are bare. Use `--use-ssl`, not `--use-ssl true`.
- Target services by `--service-id`, `-s`, or `--service-name`. Prefer service ID in automation.

## Inspection Commands

```bash
fastly whoami
fastly service list --json
fastly service describe --service-id "$FASTLY_SERVICE_ID" --json
fastly service version list --service-id "$FASTLY_SERVICE_ID" --json
fastly stats historical --service-id "$FASTLY_SERVICE_ID" --by day --from "2026-02-01" --to "2026-03-01" --json
```

## Common Mutating Shape

Only run after confirmation:

```bash
fastly service backend create \
  --service-id "$FASTLY_SERVICE_ID" \
  --version active \
  --autoclone \
  --name origin \
  --address origin.example.com \
  --port 443 \
  --use-ssl \
  --override-host www.example.com \
  --ssl-cert-hostname origin.example.com \
  --ssl-sni-hostname origin.example.com
```

After a versioned mutation, identify the newly editable version and ask before activation.

## Compute Commands

```bash
fastly compute init
fastly compute build
fastly compute serve
fastly compute deploy
```

Build and serve locally before deploy when possible. Ask before deploying.

## Troubleshooting

- `version is locked`: retry with `--autoclone` or clone the active version first.
- 403 on a command: verify account role, service access, token scope, and whether the command path is the service-scoped one.
- Newly activated services can briefly return "Domain Not Found" while propagating. Wait and retry before changing configuration.
- KV store reads can be eventually consistent. Use retry loops instead of assuming immediate read-after-write.
