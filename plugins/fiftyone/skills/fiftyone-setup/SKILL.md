---
name: fiftyone-setup
description: Use when setting up or verifying FiftyOne, the FiftyOne MCP server, Python environments, the FiftyOne App, dataset visibility, or local plugin availability.
---

# FiftyOne Setup

Use this skill before live FiftyOne dataset work or when the MCP server is unavailable.

## Rules

- Prefer read-only checks first.
- Keep Python environment, virtualenv, conda env, and shell `PATH` explicit.
- Ask before installing packages, changing shell config, editing FiftyOne config, or starting long-running services.
- Do not print secrets from environment variables or notebook outputs.

## Workflow

1. Identify the Python environment the user wants to use.
2. Check whether FiftyOne is installed:

```bash
python -c "import fiftyone as fo; print(fo.__version__)"
```

3. Check whether the MCP server is installed in that same environment:

```bash
python -m pip show fiftyone-mcp-server
which fiftyone-mcp
```

4. If missing, ask before installing:

```bash
python -m pip install fiftyone-mcp-server
```

5. If the user wants MCP tools, configure a stdio MCP server named `fiftyone` with the full path to the target environment's `fiftyone-mcp` executable.
6. Verify MCP access by listing datasets if the `fiftyone` MCP tools are available.

## Health Checks

Use read-only checks:

```bash
python - <<'PY'
import fiftyone as fo
print("version", fo.__version__)
print("datasets", fo.list_datasets())
print("plugins_dir", fo.config.plugins_dir)
PY
```

If the App is relevant, ask before launching it. The App starts a local service and may open a browser.
