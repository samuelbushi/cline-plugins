# Looker

Looker adds read-only Cline workflows for business intelligence discovery and LookML development. It uses Google MCP Toolbox's prebuilt Looker operations through a single bounded Cline tool instead of shipping many duplicate wrapper scripts.

## Cline Primitives

- Tool: registers `looker_toolbox_read`, which invokes approved read-only Looker and Looker dev operations from `@toolbox-sdk/server@1.1.0`.
- Skills: bundles `looker-bi` for models, explores, dashboards, Looks, queries, and query URLs, plus `looker-lookml-dev` for LookML project, branch, file, validation, test, and connection inspection.

## Install

```bash
cline plugin install looker
```

For local development from this repository:

```bash
cline plugin install ./plugins/looker --cwd .
```

## Requirements

The tool requires Node.js and npm because it runs `npx --yes @toolbox-sdk/server@1.1.0` when invoked. It does not download or contact Looker during plugin installation. The first tool call may download and execute that pinned Toolbox package through npm.

Set Looker API credentials in the environment that starts Cline:

```bash
export LOOKER_BASE_URL=https://your-instance.looker.com
export LOOKER_CLIENT_ID=...
export LOOKER_CLIENT_SECRET=...
```

Optional environment variables supported by the Toolbox prebuilt include `LOOKER_VERIFY_SSL`, `LOOKER_USE_CLIENT_OAUTH`, `LOOKER_SHOW_HIDDEN_MODELS`, `LOOKER_SHOW_HIDDEN_EXPLORES`, and `LOOKER_SHOW_HIDDEN_FIELDS`.

The tool forwards only PATH/npm basics and `LOOKER_*` variables to Toolbox, not the full Cline environment. This first version intentionally exposes read-only discovery, query, run, validation, and metadata operations. It does not create dashboards, update LookML files, switch branches, delete resources, or deploy Looker content.
