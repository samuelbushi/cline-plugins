---
name: buildkite-migration
description: Use when migrating CI/CD to Buildkite, converting GitHub Actions, Jenkins, CircleCI, Bitbucket Pipelines, GitLab CI, Harness, or Bitrise configs, planning Buildkite equivalents, or using `bk pipeline convert`.
---

# Buildkite Migration

Use this skill to plan and convert CI/CD pipelines to Buildkite.

## Conversion Tool

`bk pipeline convert` can convert common CI config files to Buildkite YAML. It sends the source pipeline file to a Buildkite conversion API, so ask before using it on private or sensitive CI configuration.

```bash
bk pipeline convert -F .github/workflows/ci.yml
bk pipeline convert -F .circleci/config.yml
bk pipeline convert -F Jenkinsfile
bk pipeline convert -F bitbucket-pipelines.yml
bk pipeline convert -F .gitlab-ci.yml --vendor gitlab
```

No Buildkite login is needed for conversion, but installing the `bk` CLI is required.

## Migration Workflow

1. Identify the current CI provider and all config files.
2. Inventory jobs, dependencies, secrets, caches, artifacts, approvals, deployment gates, and branch filters.
3. Convert the source config or draft Buildkite YAML manually.
4. Review ordering, because Buildkite runs parallel steps by default.
5. Replace provider-specific marketplace actions, orbs, pipes, and shared libraries with Buildkite plugins or scripts.
6. Move secrets into Buildkite secrets, OIDC, or the target cloud secret manager.
7. Run a small preflight or branch-only pipeline before replacing production CI.

## Provider Notes

- GitHub Actions jobs map to Buildkite steps. `needs` maps to `depends_on`.
- Jenkins stages map to command steps or groups. Extract complex Groovy into scripts.
- CircleCI orbs usually map to Buildkite plugins or shell scripts.
- Bitbucket `pipe:` entries map to plugins or commands.
- GitLab stages and `rules:` map to dependencies and `if:` conditions.

## Review Checklist

- Plugin versions are pinned.
- Runtime variables use the correct `$` or `$$` interpolation.
- Deploys are branch-gated or approval-gated.
- Secrets are not embedded in YAML.
- Cache keys are tied to manifest files.
- Artifact paths match generated files.
- Commands are readable and not obfuscated.
