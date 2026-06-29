---
name: clickhouse
description: Connect to and query ClickHouse (a local server or a ClickHouse Cloud service) from the terminal. For ClickHouse Cloud analytics, use clickhousectl cloud service query with explicit CH_API_KEY and CH_API_SECRET credentials plus a service name or ID; do not require CH_QUERY_API_URL. For local or host/port servers, use clickhousectl local client. Use saved-query Query API endpoint URLs only when the user explicitly provides an endpoint for the exact preconfigured query needed. Use when the user wants to run SQL against ClickHouse, explore schemas and tables, inspect Cloud services, or authenticate. For building a local dev environment or deploying to Cloud, defer to the official ClickHouse skills (see Scope).
---

# ClickHouse Connection and Queries

Pick the right access path for the target:

| Target | Path |
| ------ | ---- |
| ClickHouse Cloud analytics | `clickhousectl cloud service query` with explicit `CH_API_KEY` / `CH_API_SECRET` and service `--name` or `--id` |
| Local server or any host/port | `clickhousectl local client` |
| Saved-query Query API endpoint URL | Only for the exact preconfigured query or parameterized query exposed by that endpoint |

Do not require or recommend `CH_QUERY_API_URL` for the analyst workflow. Saved-query Query API endpoint URLs are not the default path for open-ended analysis or schema exploration.

This skill does not use the ClickHouse MCP server.

## Scope

This skill is for connecting and querying. For these other flows, use the bundled official ClickHouse skills (siblings in this directory) instead of reinventing them:

- Setting up a local dev environment from scratch (install ClickHouse, init a project, start a server, create schema): `../clickhousectl-local-dev/`.
- Deploying to or migrating into ClickHouse Cloud (create a service, migrate schema, provision an app user): `../clickhousectl-cloud-deploy/`.
- Writing or optimizing non-trivial SQL, or the agent schema-discovery and query-safety workflow: `../clickhouse-best-practices/`.
- Running SQL on local files or remote sources without a server: `../chdb-sql/`.

These are vendored from https://github.com/ClickHouse/agent-skills (Apache-2.0). They can also be installed standalone with `clickhousectl skills` or `npx skills add clickhouse/agent-skills`.

---

## Path A: ClickHouse Cloud - clickhousectl with API key/secret

Use `clickhousectl cloud service query` with explicit per-user ClickHouse Cloud API credentials. This path supports the analyst workflow's ad-hoc SQL, including schema discovery, previews, metric queries, and sanity checks, without asking the user for a Query API endpoint URL.

Do not require or recommend `CH_QUERY_API_URL` for open-ended analysis. Saved-query Query API endpoint URLs are a narrow exception for preconfigured queries only.

### Credentials

Read from the local environment:

```bash
CH_API_KEY    # required - ClickHouse Cloud API key ID
CH_API_SECRET # required - ClickHouse Cloud API key secret
CH_SERVICE    # required unless passing --id - ClickHouse Cloud service name
CH_SERVICE_ID # required unless passing --name - ClickHouse Cloud service ID
CH_DATABASE   # optional - target database
```

If `CH_API_KEY` or `CH_API_SECRET` is missing, stop and tell the user:

```text
Missing ClickHouse Cloud API credentials.
Set CH_API_KEY and CH_API_SECRET in your local environment.
Use your per-user ClickHouse Cloud API key. Do not paste secrets into chat.
```

If neither `CH_SERVICE` nor `CH_SERVICE_ID` is available, ask the user which ClickHouse Cloud service to query.

Never print `CH_API_SECRET`.

### Running queries

Use a service name or service ID. Prefer service ID when available because names can be ambiguous.

By service name:

```bash
clickhousectl cloud service query \
  --api-key "$CH_API_KEY" \
  --api-secret "$CH_API_SECRET" \
  --name "$CH_SERVICE" \
  ${CH_DATABASE:+--database "$CH_DATABASE"} \
  -q "SELECT 1 AS ok" \
  --format JSONEachRow
```

By service ID:

```bash
clickhousectl cloud service query \
  --api-key "$CH_API_KEY" \
  --api-secret "$CH_API_SECRET" \
  --id "$CH_SERVICE_ID" \
  ${CH_DATABASE:+--database "$CH_DATABASE"} \
  -q "SELECT 1 AS ok" \
  --format JSONEachRow
```

Expected connectivity-check output:

```json
{"ok":1}
```

Prefer `--format JSONEachRow`, `CSV`, or `TabSeparated` when you need to parse results in a later step. SQL precedence for query commands is `--query` > `--queries-file` > stdin.

### Query endpoint provisioning note

`clickhousectl cloud service query` runs SQL over the Cloud Query API and does not require a local `clickhouse-client` binary or database password. Depending on local state, the first query for a service may provision or reuse a per-service query endpoint binding managed by `clickhousectl`. Use explicit per-user API credentials and avoid shared/default credentials.

If a workflow must fail instead of provisioning missing query-endpoint state, add `--no-auto-enable` and surface the error to the user. Do not silently retry without it.

### Read-only guardrails (defense-in-depth)

Before sending any query, check that the first SQL token is not one of:

```text
INSERT, ALTER, DROP, TRUNCATE, CREATE, DELETE, SYSTEM, OPTIMIZE, RENAME, GRANT, REVOKE
```

If it is, refuse. The real enforcement layer should be least-privilege credentials and service-side access controls - client-side checks are defense-in-depth only.

### Error handling

Surface the full command error and exit status on errors, but redact secrets. Do not retry silently.

### Saved-query Query API endpoint URLs - narrow exception

Use a ClickHouse Cloud saved-query Query API endpoint URL only when the user explicitly provides an endpoint for the exact saved query or parameterized saved query needed. Do not use this path for schema discovery or open-ended analyst SQL.

When using this exception:

- Treat the endpoint URL as required and endpoint-specific; do not invent or require `CH_QUERY_API_URL` as part of the default analyst setup.
- Confirm that the saved query's semantics, parameters, and output format match the user's request.
- Do not send arbitrary `{ "sql": "..." }` payloads; the endpoint runs its configured query.
- Keep credentials in local environment variables and never print secrets.

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
- Add `--format JSONEachRow` or another machine-readable output format you intend to parse downstream.

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
- For Cloud analytics: use explicit per-user `CH_API_KEY` / `CH_API_SECRET` credentials with `clickhousectl cloud service query`. If required connection details are missing, stop and prompt the user to set them. Do not fall back to shared or default credentials.
- For saved-query Query API endpoint URLs: use only an explicit endpoint provided for the exact query needed; do not require or recommend `CH_QUERY_API_URL` for the default analyst workflow.
- For local servers: no cloud credentials needed.
- `clickhousectl cloud auth logout` clears saved clickhousectl OAuth tokens and API keys.
