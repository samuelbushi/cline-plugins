# microsoft-docs

Adds the Microsoft Learn MCP server to Cline.

## What It Does

Registers a `microsoft-learn` MCP server at `https://learn.microsoft.com/api/mcp`. The Microsoft Learn MCP server helps Cline search official Microsoft documentation, fetch Microsoft Learn pages, and find official Microsoft and Azure code samples.

## Install

```bash
cline plugin install microsoft-docs
```

For local development from this repository:

```bash
cline plugin install ./plugins/microsoft-docs --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Use Microsoft Learn to find the official Azure Functions timeout limits and cite the relevant page.
```

Cline can use the registered Microsoft Learn MCP server when it is available in the MCP runtime.

## Requirements

- Network access to `https://learn.microsoft.com/api/mcp`.
- No Microsoft account or API key is required for the public Microsoft Learn MCP server.
- No existing manual MCP server named `microsoft-learn`. If one already exists, Cline leaves the manual entry alone and the plugin does not replace it.

## Security Notes

Microsoft Learn MCP tools send documentation searches, page URLs, code-sample queries, and surrounding task context to Microsoft Learn. Avoid including secrets, customer data, or private code in queries unless you are comfortable with Microsoft Learn handling that content.
