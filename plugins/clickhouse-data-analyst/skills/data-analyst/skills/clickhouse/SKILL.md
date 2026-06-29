---
name: clickhouse
description: Connect to and query ClickHouse (a local server or a ClickHouse Cloud service) from the terminal. For ClickHouse Cloud production analytics, use the direct Query API with CH_API_KEY and CH_API_SECRET. For local or host/port servers, use the clickhousectl CLI. Use when the user wants to run SQL against ClickHouse, explore schemas and tables, inspect Cloud services, or authenticate. For building a local dev environment or deploying to Cloud, defer to the official ClickHouse skills (see Scope).
---

# ClickHouse Connection and Queries

Two access paths - pick the right one for the target:

| Target | Path |
| ------ | ---- |
| ClickHouse Cloud (production analytics) | Direct Query API - `CH_API_KEY` / `CH_API_SECRET` via `curl` |
| Local server or any host/port | clickhousectl CLI - `clickhousectl local client` |

Do not use `clickhousectl cloud service query` for production analytics. It auto-provisions per-service query-endpoint keys on first use, which creates key sprawl and fails without local state.

This skill does not use the ClickHouse MCP server.

## Scope

This skill is for connecting and querying. For these other flows, use the bundled official ClickHouse skills (siblings in this directory) instead of reinventing them:

- Setting up a local dev environment from scratch (install ClickHouse, init a project, start a server, create schema): `../clickhousectl-local-dev/`.
- Deploying to or migrating into ClickHouse Cloud (create a service, migrate schema, provision an app user): `../clickhousectl-cloud-deploy/`.
- Writing or optimizing non-trivial SQL, or the agent schema-discovery and query-safety workflow: `../clickhouse-best-practices/`.
- Running SQL on local files or remote sources without a server: `../chdb-sql/`.

These are vendored from https://github.com/ClickHouse/agent-skills (Apache-2.0). They can also be installed standalone with `clickhousectl skills` or `npx skills add clickhouse/agent-skills`.

---

## Path A: ClickHouse Cloud - Direct Query API (production analytics)

### Credentials

Read from the local environment:

```bash
CH_API_KEY       # required - ClickHouse Cloud API key ID
CH_API_SECRET    # required - ClickHouse Cloud API key secret
CH_QUERY_API_URL # optional - override the default endpoint
```

If `CH_API_KEY` or `CH_API_SECRET` is missing, stop and tell the user:

```text
Missing ClickHouse Query API credentials.
Set CH_API_KEY and CH_API_SECRET in your local environment.
Use your per-user ClickHouse Cloud API key. Do not use a shared key
or clickhousectl cloud service query for production analytics.
```

Never print `CH_API_SECRET`.

### Running queries

```bash
curl -X POST -s \
  --user "$CH_API_KEY:$CH_API_SECRET" \
  "${CH_QUERY_API_URL:-<your-query-api-endpoint>}?format=JSONEachRow" \
  -H 'Content-Type: application/json' \
  -d '{ "sql": "SELECT 1 AS ok" }'
```

> Replace `<your-query-api-endpoint>` with your org's ClickHouse Cloud Query API endpoint URL, or set `CH_QUERY_API_URL` in the environment.

Output format: `JSONEachRow` - parse line-by-line; each non-empty line is a JSON object.

Connectivity check:

```bash
curl -X POST -s \
  --user "$CH_API_KEY:$CH_API_SECRET" \
  "${CH_QUERY_API_URL:-<your-query-api-endpoint>}?format=JSONEachRow" \
  -H 'Content-Type: application/json' \
  -d '{ "sql": "SELECT 1 AS ok" }'
# Expected: {"ok":1}
```

### Read-only guardrails (defense-in-depth)

Before sending any query, check that the first SQL token is not one of:

```text
INSERT, ALTER, DROP, TRUNCATE, CREATE, DELETE, SYSTEM, OPTIMIZE, RENAME, GRANT, REVOKE
```

If it is, refuse. The real enforcement layer is the read-only endpoint database role in ClickHouse Cloud - client-side checks are defense-in-depth only.

### Error handling

| HTTP status | Likely cause | Action |
| ----------- | ------------ | ------ |
| `{"ok":1}` | Success | Proceed |
| 401 | Wrong key ID or secret; extra whitespace; key disabled | Re-check credentials |
| 403 | Key not authorized on this endpoint; IP allowlist | Confirm key is in endpoint's authorized list |
| 4xx/5xx | Query error or service issue | Surface full error body to user |

Surface the full HTTP status and response body on errors. Do not retry silently.

---

## Path B: Local or host/port server - clickhousectl CLI

### Step 1: Ensure clickhousectl is installed

```bash
which clickhousectl
```

If not found, install it (downloads the right build for the OS, installs to `~/.local/bin/clickhousectl`, and creates a `chctl` alias):

```bash
curl -fsSL https://clickhouse.com/cli | sh
```

If the command is still not found after install, `~/.local/bin` is not on PATH for this session:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### Step 2: Identify the target

Decide what you are querying before connecting.

List local servers and their ports:

```bash
clickhousectl local server list
```

### Step 3: Run queries

Local named server (uses `clickhouse-client`):

```bash
clickhousectl local client --name <server> -q "SHOW TABLES"
clickhousectl local client --name <server> -q "SELECT count() FROM events" --format JSONEachRow
clickhousectl local client --name <server> --queries-file query.sql
```

Any reachable host/port:

```bash
clickhousectl local client --host myhost --port 9000 -q "SELECT 1"
```

Prefer `--format` (e.g. `JSONEachRow`, `CSV`, `TabSeparated`) when you need to parse results in a later step. SQL precedence: `--query` > `--queries-file` > stdin.

---

## Safe query practices

Keep queries safe, explainable, and bounded - regardless of which path you use.

1. Discover schema/table shape if unknown: `SHOW DATABASES`, `SHOW TABLES`, `DESCRIBE TABLE <t>`.
2. Draft SQL using documented definitions when available (see `../reading-data-dict/`).
3. Explain what the SQL does before expensive execution.
4. Preview first when returning rows: `LIMIT 10` or `LIMIT 100`.
5. Prefer aggregate queries for metrics; avoid dumping high-cardinality raw data.
6. Confirm with the user before long-running, broad, or expensive scans.
7. Return the SQL with results so the user can inspect and reuse it.

Safety checks:

- Avoid accidental cross joins; use explicit join keys and know why the join is valid.
- Filter by time window whenever possible.
- Avoid `SELECT *` except tiny schema previews.
- Check row counts before exporting large result sets.
- Add `--format` or `?format=JSONEachRow` for machine-readable output you intend to parse downstream.

## Bounded queries and large tables

Large fact tables can time out or exceed memory even for seemingly simple sanity checks. Keep exploratory and validation queries bounded unless there is strong evidence the table is small.

- Avoid unbounded freshness checks such as full-table `count()`, `uniqExact(...)`, or broad `min/max` scans on large fact tables. Prefer bounded recent-window checks, partition-aware filters, table metadata, or known date/key ranges, for example `WHERE report_date >= today() - 7`.
- For a quick metric over "last N days" from a daily aggregate table, default to completed report dates when appropriate and state that assumption; mention alternatives such as rolling N hours or including today if ambiguous.
- If an exact aggregate exceeds memory or times out, retry with smaller bounded chunks only when chunking preserves correctness. Daily counts can be queried week-by-week and concatenated because each date belongs to exactly one chunk.
- Do not chunk-and-sum distinct users across chunks unless the requested grain makes chunks independent. Weekly unique users cannot be produced by summing daily unique users, because a user can appear on multiple days.
- Document chunk boundaries, why the combined result remains exact, and the original failure mode in the SQL notes or artifact metadata.
- If no exact bounded fallback is safe, ask whether an approximate aggregate such as `uniq(...)`, a shorter window, or a different grain is acceptable.

## Result package

When returning query results, include:

- the SQL executed
- row count or aggregate count
- sample output or artifact path
- data freshness or observed time range
- caveats and the next query if needed

## Auth and secret handling

- Never print API keys, secrets, or passwords into the conversation or commit them.
- For Cloud: use `CH_API_KEY` / `CH_API_SECRET` from local environment variables. If missing, stop and prompt the user to set them. Do not fall back to shared or default credentials.
- For local servers: no cloud credentials needed.
- `clickhousectl cloud auth logout` clears saved clickhousectl OAuth tokens and API keys.
