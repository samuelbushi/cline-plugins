# Oracle Database Plugin

Oracle Database tools and skills for querying, schema inspection, query-plan analysis, session monitoring, object health checks, and tablespace diagnostics.

This plugin registers Cline tools backed by the Oracle Database prebuilt connector from `@toolbox-sdk/server`. Installation adds the pinned Toolbox dependency but does not connect to any database or execute SQL. Tool calls use the package-local Toolbox binary; if dependencies are missing, the tools fail with a reinstall message rather than downloading code at runtime.

## Requirements

Set these environment variables before starting Cline:

- `ORACLE_CONNECTION_STRING`
- `ORACLE_USERNAME`
- `ORACLE_PASSWORD`
- `ORACLE_WALLET` optional
- `ORACLE_USE_OCI` optional

Basic queries require `CREATE SESSION`. Session, storage, and SQL-resource diagnostics may require read privileges on Oracle dynamic performance and data dictionary views.

## Trust Boundaries

Oracle query results, schemas, execution plans, session data, and tablespace diagnostics can contain private operational data. The plugin rule asks for bounded reads by default and explicit approval before SQL that can mutate data, metadata, privileges, sessions, or database state.

`oracle_execute_sql` is read-only by default. Side-effecting SQL goes through `oracle_execute_mutation_sql`, which requires an explicit confirmation field after user approval.

## Attribution

The Oracle Database workflow is based on Oracle Database agent skill material licensed under Apache-2.0. See `LICENSE.oracledb`.
