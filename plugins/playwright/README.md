# playwright

Register the Playwright MCP server in Cline.

## What It Does

Adds the `playwright` MCP server through the pinned `@playwright/mcp` package bundled with this plugin.

The server lets Cline use Playwright browser automation tools for page navigation, screenshots, form interaction, and end-to-end testing workflows when the Playwright runtime can launch a browser on the current machine.

## Install

```bash
cline plugin install playwright
```

For local development from this repository:

```bash
cline plugin install ./plugins/playwright --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Open the local app, click through the login flow, and report any console errors.
```

Cline can use the registered Playwright MCP server when it is available in the MCP runtime.

## Requirements

- Node.js.
- Browser support depends on the Playwright MCP package and the current machine.
- Installing the plugin installs `@playwright/mcp` and its Playwright dependencies.

## Security Notes

The Playwright MCP server can open browser windows, interact with pages, capture screenshots, and access page content. It runs the bundled `@playwright/mcp` package installed with this plugin. Review requested tool calls before using it on sensitive sites or logged-in sessions.
