# knowledge-catalog

Adds Google Cloud Knowledge Catalog discovery workflows for Cline.

## What It Does

Installs the `knowledge-catalog-discovery` skill. The skill helps Cline search and inspect Google Cloud Knowledge Catalog and Dataplex metadata for data assets, entries, aspect types, and related context.

The plugin does not register an MCP server, does not run install-time setup, and does not bundle wrapper scripts. When a task needs live catalog data, the skill guides Cline to run the official toolbox command explicitly through the user's configured Google Cloud environment.

## Install

```bash
cline plugin install knowledge-catalog
```

For local development from this repository:

```bash
cline plugin install ./plugins/knowledge-catalog --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Find Knowledge Catalog entries related to customer orders in my analytics project and show the most relevant table metadata.
```

## Requirements

- A Google Cloud project with the Dataplex API enabled.
- Application Default Credentials available to the shell running Cline.
- `DATAPLEX_PROJECT` set to the default project when the request does not specify one.
- Node and npm available for `npx --yes @toolbox-sdk/server@1.1.0`.
- IAM permissions for catalog reads, such as Knowledge Catalog viewer access with `dataplex.projects.search`, `dataplex.entries.get`, and aspect type read permissions. Enabling the API may require separate Service Usage permissions.

## Security Notes

Knowledge Catalog can reveal metadata about datasets, tables, views, owners, tags, and governance aspects. The skill defaults to bounded searches, asks for scope when a request is ambiguous, and does not perform catalog mutations.

The toolbox command may download the `@toolbox-sdk/server` package through `npx` on first use. That does not happen during plugin installation.
