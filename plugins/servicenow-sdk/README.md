# servicenow-sdk

Bundle ServiceNow Fluent SDK documentation guidance as an installable Cline plugin.

## What It Does

Installs the `now-sdk-explain` skill. The skill guides Cline to use `npx @servicenow/sdk explain` before creating, editing, building, or deploying ServiceNow Fluent SDK applications, with a peek-first workflow to avoid loading the wrong documentation topic.

## Install

```bash
cline plugin install servicenow-sdk
```

For local development from this repository:

```bash
cline plugin install ./plugins/servicenow-sdk --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Use the ServiceNow SDK docs to add a BusinessRule to this Fluent app.
```

```text
Explain the right Fluent SDK structure before we create a new table.
```

Cline automatically uses the `now-sdk-explain` skill when ServiceNow, Fluent, or `now-sdk` work comes up.

## Requirements

- Node and `npx` available.
- `@servicenow/sdk` version 4.6.0 or newer when using the `explain` command.
- ServiceNow credentials or instance access only when the user asks to authenticate, deploy, transform, or perform other live instance operations.

## Security Notes

The documentation lookup command can download the ServiceNow SDK package through `npx`. ServiceNow instance URLs, credentials, OAuth tokens, and generated app artifacts should be treated as sensitive and should not be printed, committed, or persisted without explicit user approval.
