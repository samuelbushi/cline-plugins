---
name: duckdb-session
description: Attach DuckDB database files and maintain project-scoped DuckDB session state. Use when the user wants reusable database attachments, repeated queries across a project, or a shared DuckDB init file.
---

# DuckDB Session

Use a state file when the user wants repeated DuckDB work across several queries.

## State file locations

Check for an existing state file:

```sh
test -f .duckdb-skills/state.sql && echo ".duckdb-skills/state.sql"
PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
PROJECT_ID="$(printf '%s' "$PROJECT_ROOT" | tr '/' '-')"
test -f "$HOME/.duckdb-skills/$PROJECT_ID/state.sql" && echo "$HOME/.duckdb-skills/$PROJECT_ID/state.sql"
```

If no state file exists, ask where to store it:

- `.duckdb-skills/state.sql` in the project, optionally gitignored.
- `$HOME/.duckdb-skills/<project-id>/state.sql` outside the repository.

Ask before writing `.gitignore` or appending state.

## Attach a database

Resolve the database path and validate it:

```sh
DB_PATH="/absolute/path/to/data.duckdb"
duckdb "$DB_PATH" -c "PRAGMA version;"
```

Choose an alias from the filename, then append idempotent state:

```sql
ATTACH IF NOT EXISTS '/absolute/path/to/data.duckdb' AS data;
USE data;
```

Do not overwrite `state.sql`. Append only after checking for duplicate `ATTACH` lines and alias conflicts.

## Verify

```sh
duckdb -init ".duckdb-skills/state.sql" -csv <<'SQL'
SHOW DATABASES;
SELECT table_name, estimated_size
FROM duckdb_tables()
ORDER BY table_name;
SQL
```

Report the state path, database alias, available tables, and any failures.
