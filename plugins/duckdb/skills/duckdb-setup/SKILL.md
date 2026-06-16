---
name: duckdb-setup
description: Install, verify, or update DuckDB CLI and extensions. Use when DuckDB is missing, an extension is missing, the user asks to install DuckDB, or a DuckDB command fails due to extension setup.
---

# DuckDB Setup

Use this skill when a DuckDB workflow needs the CLI or extensions.

## Check first

```sh
command -v duckdb
duckdb --version
```

If DuckDB is missing, tell the user what command you plan to run and ask before installing.

Common install options:

```sh
# macOS with Homebrew
brew install duckdb

# Linux
curl -fsSL https://install.duckdb.org | sh

# Windows
winget install DuckDB.cli
```

## Extensions

Install or load extensions only when needed for the requested task:

| Need | DuckDB setup |
| --- | --- |
| HTTPS, S3, R2, GCS | `INSTALL httpfs; LOAD httpfs;` |
| Spatial files and functions | `INSTALL spatial; LOAD spatial;` |
| Excel files | `INSTALL excel; LOAD excel;` |
| SQLite files | `INSTALL sqlite_scanner; LOAD sqlite_scanner;` |
| H3 indexes | `INSTALL h3 FROM community; LOAD h3;` |

Ask before installing extensions from community repositories.

## Safety

- Do not run upgrade commands without user approval.
- Do not print secrets or credentials.
- Prefer one DuckDB command that loads only the extensions needed for the task.
- If a command fails, report the exact missing extension or install error and suggest the minimal fix.
