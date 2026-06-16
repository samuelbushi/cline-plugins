# postman

Postman API lifecycle workflows for Cline. The plugin connects Cline to the Postman MCP server and adds guidance for collections, OpenAPI specs, tests, mock servers, documentation, API search, and agent-readiness reviews.

## What It Does

Registers the Postman remote MCP server and installs a compact `/postman` command. The bundled skills guide Cline through setup, workspace discovery, API search, spec-to-collection sync, OpenAPI generation, local Postman CLI usage, request sending, collection runs, mock and docs workflows, security reviews, API client generation, MCP limitations, and agent-readiness analysis.

## Install

```bash
cline plugin install postman
```

For local development from this repository:

```bash
cline plugin install ./plugins/postman --cwd .
```

## Example Usage

After installation, ask Cline:

```text
/postman sync my OpenAPI spec to Postman and create a draft environment for local development
```

Or:

```text
/postman audit this API for agent-readiness and security issues
```

## Requirements

- A Postman account.
- Postman MCP authorization through Cline's MCP OAuth flow when using cloud Postman tools.
- `POSTMAN_API_KEY` only if the user explicitly chooses API-key based local CLI tooling.
- The local `postman-cli` package only for local request sending, collection runs, spec linting, or git-synced Postman files.

## Security Notes

The plugin does not store Postman credentials, add static API-key headers, install the Postman CLI, or run commands at install time. Cline should ask before creating or changing Postman resources, deleting resources, publishing docs, exposing mocks publicly, running broad tests, writing generated clients or specs, or sending requests to non-local URLs.

## License Notes

The bundled Postman skill material is licensed under Apache-2.0. See `LICENSE.postman-plugin`.
