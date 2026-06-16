---
name: fiftyone-troubleshooting
description: Use when diagnosing FiftyOne problems such as missing datasets, App startup failures, MongoDB errors, dataset persistence issues, video codec problems, missing operators, plugin failures, or notebook connectivity.
---

# FiftyOne Troubleshooting

Use this skill to diagnose and fix common FiftyOne issues.

## Rules

- Diagnose before changing anything.
- Explain the root cause and proposed fix.
- Ask before modifying config, deleting state, killing processes, installing packages, editing shell profiles, or changing datasets.
- Never use raw MongoDB commands to fix FiftyOne state.
- Use FiftyOne APIs as the source of truth.
- Verify after applying any approved fix.

## Diagnostic Quick Check

```bash
python - <<'PY'
import fiftyone as fo
print("version", fo.__version__)
print("datasets", fo.list_datasets())
print("plugins_dir", fo.config.plugins_dir)
print("database_uri", fo.config.database_uri)
PY
```

Check running processes only when relevant:

```bash
ps aux | grep fiftyone
```

Ask before stopping processes.

## Common Areas

- Dataset disappeared: check persistent flag, database name, environment variables, and active Python environment.
- App will not open: check port conflicts, stale server processes, browser access, and logs.
- MongoDB errors: use FiftyOne diagnostics and config, not direct database mutation.
- Video codecs: inspect file codecs and installed media tooling.
- Operators missing: list plugins and operators dynamically, then enable or install only after approval.
- Notebook connection issues: confirm kernel environment matches the environment running FiftyOne.
