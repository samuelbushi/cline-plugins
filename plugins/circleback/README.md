# circleback

Adds the Circleback MCP server to Cline.

## What It Does

Registers a `circleback` MCP server at `https://app.circleback.ai/api/mcp`. The Circleback MCP server helps Cline search and use meeting notes, emails, calendar events, and other conversational context available to the authenticated Circleback account.

## Install

```bash
cline plugin install circleback
```

For local development from this repository:

```bash
cline plugin install ./plugins/circleback --cwd .
```

## Example Usage

After installation and any required Circleback authorization, ask Cline:

```text
Use Circleback to find the last meeting about this launch plan and summarize the decisions.
```

Cline can use the registered Circleback MCP server when it is available in the MCP runtime.

## Requirements

- Network access to `https://app.circleback.ai/api/mcp`.
- A Circleback account with access to the meetings, emails, calendar events, and conversational context you want Cline to inspect.
- OAuth authorization through Cline's MCP auth flow when required by the Circleback MCP server.
- No existing manual MCP server named `circleback`. If one already exists, Cline leaves the manual entry alone and the plugin does not replace it.

## Security Notes

Circleback MCP tools can read meeting notes, email metadata or content, calendar events, and related workspace context depending on your account permissions and selected tool call. Avoid sending or approving access to private conversations unless you are comfortable with Circleback and Cline using that context.
