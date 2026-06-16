---
name: duckdb-query
description: Run bounded DuckDB SQL against attached databases or ad-hoc data files. Use when the user asks data questions, provides SQL, asks for summaries, or wants analysis over CSV, Parquet, JSON, DuckDB, SQLite, or other supported files.
---

# DuckDB Query

Use DuckDB for local analytical SQL. Prefer bounded, inspectable queries and avoid dumping huge result sets into the conversation.

## Choose the mode

- Ad-hoc file mode: query a file path or glob directly with `duckdb :memory:`.
- Session mode: use an existing `.duckdb-skills/state.sql` or `$HOME/.duckdb-skills/<project>/state.sql` created by `duckdb-session`.
- Database file mode: query a `.duckdb` file directly if the user points to one.

## Check DuckDB

```sh
command -v duckdb
duckdb --version
```

If missing, use `duckdb-setup`.

## Bound the work

Before running a broad query:

- Inspect schema with `DESCRIBE`.
- Use `count()` or `SUMMARIZE` for high-level shape.
- Add `LIMIT` for row previews.
- Warn before running unbounded queries on very large local files or remote data.

Ad-hoc local file pattern:

```sh
duckdb :memory: -csv <<'SQL'
DESCRIBE FROM 'data.parquet';
SELECT count() AS row_count FROM 'data.parquet';
FROM 'data.parquet' LIMIT 20;
SQL
```

Resolve file paths inside the workspace before querying. Do not disable external access immediately before direct file scans; that can block DuckDB from reading the file.

Session pattern:

```sh
duckdb -init ".duckdb-skills/state.sql" -csv <<'SQL'
SELECT table_name, estimated_size
FROM duckdb_tables()
ORDER BY table_name;
SQL
```

## DuckDB idioms

Prefer:

- `FROM table WHERE ...` for simple selects.
- `GROUP BY ALL` and `ORDER BY ALL`.
- `SELECT * EXCLUDE (...)` and `SELECT * REPLACE (...)`.
- `UNION ALL BY NAME`.
- `SUMMARIZE table_name`.
- `PIVOT` and `UNPIVOT`.
- `arg_max`, `max(col, n)`, and `FILTER` for compact aggregates.

## Error handling

- Missing CLI or extension: use `duckdb-setup`.
- Table not found: list `duckdb_tables()` and suggest likely names.
- File not found: use normal Cline file tools or a targeted `find` within the workspace.
- Persistent SQL uncertainty: use `duckdb-docs` with the exact error terms.
