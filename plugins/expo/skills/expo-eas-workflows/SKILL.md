---
name: expo-eas-workflows
description: Use when creating or editing `.eas/workflows` YAML files, EAS CI/CD pipelines, release automation, preview builds, workflow triggers, or workflow validation.
---

# Expo EAS Workflows

Use this skill for EAS CI/CD workflow files.

## Workflow Files

- Workflows live in `.eas/workflows/*.yml` or `.eas/workflows/*.yaml`.
- Inspect existing workflow files before adding a new one.
- Keep workflow names, triggers, jobs, secrets, and environment names aligned with the release process.
- Prefer small workflows that map to real team actions: preview build, production build, submit, update, deploy, or test.

## Current Schema

- EAS Workflows evolves. Use the Expo MCP or current Expo workflow schema before relying on exact job fields.
- Validate generated YAML against the current schema when possible.
- Do not invent runner names, job types, or expression contexts from memory.

## CI Design

- Separate pull request preview workflows from production release workflows.
- Use explicit triggers and guarded manual inputs for store submissions or production deploys.
- Put secrets in the EAS or CI secret store, not in YAML.
- Keep destructive release jobs behind manual dispatch, branch filters, or environment gates.

## Review Before Writing

- Confirm target platform, profile, branch, environment, and artifact destination.
- Confirm whether the workflow should build, submit, publish an update, deploy web, run tests, or only validate.
- If a workflow would submit to an app store or publish a production update, ask the user before creating or running that path.
