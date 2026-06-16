---
name: chrome-devtools-troubleshooting
description: Troubleshoot Chrome DevTools MCP startup, Chrome launch, page connection, missing tool, sandbox, and browser target issues.
---

# Chrome DevTools Troubleshooting

Use this skill when Chrome DevTools MCP fails to start, cannot list pages, cannot navigate, loses the browser target, has missing tools, or returns connection errors.

## First Checks

1. Read the exact error message.
2. Check whether Chrome is installed and available.
3. Check whether the task needs local Chrome launch, an existing browser URL, or a remote debugging endpoint.
4. Check whether the requested tool category is enabled.
5. Avoid repeated blind retries.

## Common Symptoms

### Could not find DevToolsActivePort

This usually means an automatic connection expected a running debuggable Chrome instance but could not find one. Confirm the intended Chrome channel is running and remote debugging is enabled before changing configuration.

### Empty page list or unexpected blank profile

The server may have launched an isolated or separate Chrome profile. That is safe by default, but it will not include the user's logged-in browser state.

### Missing extension tools

Extension tools require the server to be started with extension tooling enabled. The default Cline plugin configuration does not enable extension tools because they broaden browser access and are not needed for normal page debugging.

### Only a small tool set appears

The MCP client may be restricting tools, or the server may be running in a slim or limited mode. Check the actual MCP settings entry and tool list.

### Protocol timeouts or target closed

The page may have crashed, navigated, opened a modal, triggered a download, or closed the target. List pages again, select the right page, and capture a fresh snapshot.

## Diagnostics

Use the smallest diagnostic that answers the question:

- `list_pages` to confirm the server can see browser targets.
- `new_page` with a simple local or public test URL to check launch.
- `take_snapshot` to confirm the page is responsive.
- `list_console_messages` for page errors.
- A temporary log file only when startup errors need deeper inspection.

Do not run broad debug commands against private pages unless the user agrees.

## When To Ask The User

Ask for confirmation before:

- connecting to an existing browser profile
- inspecting authenticated pages
- changing MCP configuration manually
- enabling extension tooling
- disabling browser sandbox flags
- sharing logs that may contain local paths, URLs, headers, or page data
