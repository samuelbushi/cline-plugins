---
name: outputai-credentials
description: Work with Output SDK encrypted credentials safely. Use when initializing credentials, adding API keys, wiring env vars, diagnosing missing credentials, or reviewing secret handling.
---

# Output.ai Credentials

Use this skill for Output SDK credential setup and secret-handling review.

## Rules

- Never ask the user to paste secrets into chat unless there is no safer option.
- Do not read, print, or summarize plaintext credentials unless the user explicitly requests it.
- Ask before editing encrypted credential files, key files, `.env` files, or shell profiles.
- Treat `config/credentials.key` as a plaintext decryption secret. Do not print it, commit it, copy it into chat, or create it without checking that the project ignores it.
- Prefer `@outputai/credentials` inside workflow code instead of direct secret reads.
- Keep credential paths stable and descriptive, for example `stripe.api_key` or `anthropic.api_key`.

## Common Files

```text
config/credentials.yml.enc
config/credentials/<environment>.yml.enc
config/credentials.key
src/workflows/<workflow>/credentials.yml.enc
```

Per-workflow credentials can override global credentials. Environment-specific credentials can override defaults depending on project configuration.

## CLI Shapes

Use the project script if one exists. Otherwise common commands are:

```bash
npx output credentials init
npx output credentials init -e production
npx output credentials edit
npx output credentials edit -e staging
npx output credentials edit -w <workflowName>
npx output credentials get <path>
```

Commands that show or get plaintext secret values require explicit user approval.

## Code Pattern

Typical usage:

```ts
import { credentials } from "@outputai/credentials"

const apiKey = credentials.require("service.api_key")
const region = credentials.get("aws.region", "us-east-1")
```

Use `require` for mandatory secrets so missing configuration fails loudly. Use `get` with a default only for genuinely optional values.

## Environment Variable Wiring

Some projects map credential paths to environment variables for worker startup or provider SDKs. When changing this:

- Prefer a documented project convention.
- Avoid duplicating secret values across files.
- Verify worker startup logs without printing secret values.
- Confirm which environment is active before editing.

## Troubleshooting

- `MissingKeyError`: the encryption key is not available. Check the expected key file or environment variable setup.
- `MissingCredentialError`: the credential path does not exist in the active credential scope.
- Wrong value at runtime: check workflow-specific overrides and environment-specific files before changing global credentials.
- Secret appears in logs: remove direct logging, redact tool output, and move secret reads behind `@outputai/credentials`.
