---
name: cline-plugin-settings
description: This skill should be used when the user asks to store plugin configuration or state, design per-project settings, manage credentials safely, choose global versus workspace state, or review plugin persistence behavior.
---

# Cline Plugin Settings And State

Use this skill to design plugin persistence without surprising the user.

## Prefer No State

Start by asking whether the plugin needs state at all. Many plugins can rely on:

- Session context
- Environment variables
- Existing project config
- User-managed service CLIs
- Cline MCP auth

Avoid creating config files just to mirror install options.

## State Locations

Use project state when behavior is specific to the active repository, such as generated templates, reviewed paths, or project-specific preferences.

Use user state when behavior should follow the user across workspaces, such as personal defaults or non-secret cache data.

Use the host's documented storage APIs when available. If writing files directly, keep paths explicit and document them in the README.

## Credentials

Do not write secrets into bundled plugin files, project guidance, README examples, or plugin-owned MCP settings.

Prefer:

- Provider OAuth handled by the MCP client.
- Environment variables read by the local process.
- Existing cloud CLI credentials.
- User-managed secret stores.

If a plugin needs a static token and there is no clean user-facing configuration path, do not fake it with placeholder headers. Ship setup guidance and let the user manage the MCP configuration.

## Per-Project Files

When a plugin genuinely needs per-project config, use a clear Cline-oriented path such as:

```text
.cline/my-plugin.local.json
.cline/my-plugin.local.md
```

Make local state gitignored when it can contain personal paths, tokens, workspace state, or private notes.

For structured settings, prefer JSON when the plugin code reads it. Use Markdown only when the body is intended as human-authored instructions.

## Runtime Access

When reading workspace state from plugin code:

- Resolve paths from `ctx.workspaceInfo?.rootPath`.
- Validate file existence and shape.
- Treat file contents as untrusted input.
- Return structured tool errors for ordinary missing or invalid settings.

## Review Checklist

Before shipping:

- Is every persisted field necessary?
- Could this be an environment variable or existing provider auth instead?
- Are secrets excluded from persisted plugin-owned settings?
- Does uninstall leave only user-created state that the README explains?
- Does the plugin behave clearly when settings are missing?
