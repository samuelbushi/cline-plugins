# laravel-boost

Connects Cline to Laravel Boost in the current Laravel application.

## What It Does

Registers the `laravel-boost` MCP server by running `php artisan boost:mcp` from the active workspace root. The active workspace root must be the Laravel application directory that contains `artisan`; for monorepos, install or run Cline with the Laravel app subdirectory as the workspace.

Once Laravel Boost is installed and configured in the app, Cline can use the MCP tools exposed by that application for framework-aware Laravel development.

## Install

```bash
cline plugin install laravel-boost
```

For local development from this repository:

```bash
cline plugin install ./plugins/laravel-boost --cwd /path/to/laravel-app
```

## Requirements

- A Laravel application as the active workspace root, with `artisan` at the workspace root.
- PHP available on `PATH`.
- Laravel Boost installed and configured in the application so `php artisan boost:mcp` starts successfully.

## Security Notes

The MCP server runs inside the active Laravel project and can expose application-specific framework tools. Install it only in workspaces you trust, and review any Laravel Boost tools before allowing changes that affect application code, data, or configuration.
