---
name: buildkite-agent-runtime
description: Use for `buildkite-agent` commands inside running Buildkite jobs, including annotations, artifacts, meta-data, pipeline upload, OIDC tokens, locks, step attributes, secrets, redaction, and job environment behavior.
---

# Buildkite Agent Runtime

Use this skill for `buildkite-agent` commands that run inside Buildkite job steps. Do not run these commands locally unless the user is explicitly testing an agent environment.

## Common Commands

| Command | Use For |
| --- | --- |
| `buildkite-agent annotate` | show Markdown or HTML on the build page |
| `buildkite-agent artifact upload` | upload job artifacts |
| `buildkite-agent artifact download` | download artifacts from another job or build |
| `buildkite-agent meta-data set/get` | share build-scoped key-value data |
| `buildkite-agent pipeline upload` | add dynamic steps to the running build |
| `buildkite-agent oidc request-token` | request short-lived identity tokens |
| `buildkite-agent lock` | coordinate shared resources |
| `buildkite-agent secret get` | retrieve cluster secrets at runtime |
| `buildkite-agent redactor add` | redact sensitive values from logs |

## Patterns

Use stable annotation contexts so reruns replace the same annotation:

```bash
buildkite-agent annotate --style "error" --context "test-failures" < test-output.md
```

Use meta-data for small values needed by later steps:

```bash
buildkite-agent meta-data set "release-version" "$VERSION"
buildkite-agent meta-data get "release-version"
```

Use dynamic pipeline upload for generated steps:

```bash
scripts/generate-pipeline.sh | buildkite-agent pipeline upload
```

## OIDC And Secrets

Prefer OIDC or Buildkite-managed secrets over long-lived cloud keys in pipeline YAML. Keep audiences and claims narrow. Never echo tokens or secret values.

## Troubleshooting

- Missing environment variables usually mean the command is running outside a job or in the wrong hook phase.
- Artifact downloads need the correct glob, build, and step scope.
- Reused annotation contexts replace previous content unless append behavior is requested.
- Dynamic pipeline uploads fail when generated YAML is invalid or runtime variable interpolation uses the wrong `$` form.
