# vpai CLI - Login & Setup

Authenticate `npx @vibeprospecting/vpai@latest` before running any Vibe Prospecting workflow.

## Fast Path

If the user has a tenant API key, prefer session-scoped auth from an environment variable:

```bash
export VP_API_KEY="<tenant-api-key>"
VP_API_KEY="$VP_API_KEY" npx @vibeprospecting/vpai@latest --help
```

Do not print real keys, paste them into chat, or commit them to the workspace.

Only persist the key to the CLI config after the user explicitly approves durable auth:

```bash
npx @vibeprospecting/vpai@latest config --api-key "$VP_API_KEY"
```

## Browser Login

If the user does not have an API key and approves browser-based durable auth, use the CLI login flow:

```bash
npx @vibeprospecting/vpai@latest login
```

The CLI prints a browser URL and may print a user code. Ask the user to open the URL and approve the sign-in. Then poll for completion:

```bash
npx @vibeprospecting/vpai@latest login --poll
```

Repeat the poll until sign-in completes or until roughly two minutes have passed. If it does not complete, ask the user to verify the browser approval and retry the poll.

## Where Auth Lives

- The CLI stores durable auth in `~/.config/vpai/config.json` only after `config --api-key` or browser login.
- `VP_API_KEY` can be used for session-scoped auth without writing a key file.
- Keep exports, CSVs, and logs out of `~/.config/vpai/`; that directory is for CLI configuration only.

## Verify

```bash
npx @vibeprospecting/vpai@latest --help
```

If the tool list prints, the CLI is ready.

## Sign Out / Switch Account

```bash
npx @vibeprospecting/vpai@latest logout
```

Then repeat the API key or browser login flow.

## Troubleshooting

| Problem | Fix |
|---|---|
| `npx ... vpai` will not run | Verify Node.js and npm/npx are available, then retry. |
| `Not authenticated` | Provide `VP_API_KEY` for the command, or ask the user to approve persistent config/browser login. |
| Need to switch tenants | Run `npx @vibeprospecting/vpai@latest logout`, then authenticate again. |
| `--csv` write fails (`EACCES`) | Choose a workspace-writable output path or set `TMPDIR` to a writable temp directory. |
