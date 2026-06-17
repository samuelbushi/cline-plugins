---
name: stripe-projects
description: >
  Use when the user explicitly asks for Stripe Projects, projects.dev, Stripe
  provider catalog browsing, Stripe-mediated service provisioning, or managing a
  service already provisioned through Stripe Projects. Do not use for generic
  infrastructure setup, API-key retrieval, or service signup unless the user
  asks to use Stripe Projects as the provisioning surface.

---

## Stripe Projects - Service Provisioning

Provision third-party services (databases, auth, hosting, analytics, caching, AI, observability) and retrieve API keys/tokens using the Stripe Projects CLI plugin.

## Workflow

### Step 1: Ensure Stripe CLI + Projects Plugin

Check if the Stripe CLI is available:

```bash
which stripe && stripe --version
```

If not installed or below version 1.40.0:

- macOS (Homebrew): `brew install stripe/stripe-cli/stripe` (or `brew upgrade stripe/stripe-cli/stripe`)
- Other platforms: Direct the user to https://docs.stripe.com/stripe-cli/install for up-to-date instructions.

Do not install or upgrade the Stripe CLI automatically. Explain the command and wait for explicit user approval before running any install or upgrade.

Then ensure the Projects plugin is installed:

```bash
stripe plugin install projects
```

Ask for confirmation before installing the Projects plugin because this changes the user's local Stripe CLI environment.

### Step 2: Search the Catalog

Confirm the requested provider/service exists:

```bash
stripe projects search <query> --json
```

If `result_count` is 0, inform the user the service was not found and stop.

If the user's request is vague (for example, "I need a database"), browse the catalog to suggest options:

```bash
stripe projects catalog --json
```

### Step 3: Initialize a Project

Check if a project is already initialized:

```bash
stripe projects status --json
```

If not initialized:

```bash
stripe projects init --yes
```

(do not use `--json` for this command)

If the CLI output indicates a browser was opened for authentication, stop and clearly tell the user to complete sign-in in their browser. Don't run further commands until they confirm they're done.

Before running `stripe projects init --yes`, explain that this initializes local Projects state and may authenticate through the browser. Wait for explicit approval.

### Step 4: Continue with the Stripe Projects CLI

Use the CLI output, `stripe projects --help`, and JSON commands as the source of truth for adding services, managing credentials, and configuring the project. Do not rely on source-host skill installation paths.

Before `stripe projects add`, `stripe projects link`, or any command that provisions a third-party service or writes credentials, show the provider, service, target project, expected env var names, and any pricing or account-linking implications. Continue only after explicit approval.

### Step 5: Summarize and Suggest

After a successful service addition, provide output in this format:

| Field    | Value                                  |
| -------- | -------------------------------------- |
| Provider | `<provider name>`                      |
| Service  | `<service type>`                       |
| Tier     | `<tier>`                               |
| Env vars | `<variable names only - never values>` |

Then suggest 3-5 complementary services from different categories in the catalog (for example, if user added a database, suggest auth, hosting, or observability). Only reference services that actually appear in `stripe projects catalog --json` output - never fabricate commands or provider names.

## CLI as Source of Truth

The CLI manages all state under `.projects/` and generates `.env` files. Don't hand-edit these files. If you need to inspect project state, use the appropriate CLI command:

| Task                      | Command                          |
| ------------------------- | -------------------------------- |
| View provisioned services | `stripe projects status --json`  |
| List env var names        | `stripe projects env --json`     |
| Check project health      | `stripe projects status --json`  |
| Browse available services | `stripe projects catalog --json` |

Only inspect `.projects/` or `.env` directly if the user explicitly asks you to - the CLI is authoritative, so manual edits may be overwritten.

## Error Handling

| Error code             | Cause                           | Recovery                                                                                   |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------ |
| `PROVIDER_NOT_LINKED`  | Provider requires OAuth linking | Run `stripe projects link <provider>` - this may open a browser                            |
| `UNKNOWN_ERROR`        | Unexpected failure              | Show a redacted summary of the error and suggest running with `--debug` only if needed; do not reveal credentials, env values, account IDs, or request payloads |
| Service not in catalog | Query returned 0 results        | Inform user; suggest `stripe projects catalog --json` to browse alternatives               |
| CLI not found          | Stripe CLI not installed        | Install using Homebrew (macOS) or follow https://docs.stripe.com/stripe-cli/install        |
