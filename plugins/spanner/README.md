# spanner

Google Cloud Spanner workflow skills for exploring schema, listing tables and graphs, running read queries, and performing explicitly approved DML through the Spanner prebuilt Toolbox server.

## What It Adds

This plugin bundles the `spanner-data` skill with Node.js helper scripts for common Spanner data workflows:

- list tables and detailed table metadata
- list graph schemas and graph metadata
- execute read-only DQL SQL
- execute DML SQL after explicit user approval and `SPANNER_ALLOW_MUTATION=1`

The plugin does not register an MCP server or perform install-time Google Cloud calls. The helper scripts invoke `@toolbox-sdk/server@1.1.0` with `npx` only when the user asks Cline to run a Spanner workflow that needs live database access.

## Cline Primitives

- Skills: Spanner data exploration and SQL execution guidance with bundled helper scripts.
- Rules: Google Cloud credential handling, read-first workflow guidance, explicit approval for database mutations, and untrusted database-output handling.

## Requirements

- Node.js and `npx` available in the shell where Cline runs commands.
- Google Cloud Application Default Credentials configured for the target project.
- Spanner API enabled on the target Google Cloud project.
- IAM permissions appropriate for the requested task, typically Cloud Spanner Database Reader or Cloud Spanner Database User.
- `SPANNER_PROJECT`, `SPANNER_INSTANCE`, and `SPANNER_DATABASE` set in the Cline command environment or a workspace `.env` file.
- Optional `SPANNER_DIALECT`, set to `googlesql` or `postgresql`.
- `SPANNER_ALLOW_MUTATION=1` for DML execution through `execute_sql`.

## Trust Boundaries

Running the helper scripts sends SQL, project identifiers, instance identifiers, database identifiers, and query context to Google Cloud Spanner through the Toolbox server. Query results and schema metadata may contain private production data.

DQL and schema listing are read-oriented. DML can mutate data and must be confirmed before execution. The DML helper refuses to run unless `SPANNER_ALLOW_MUTATION=1` is set for that command. The helper scripts only import `SPANNER_PROJECT`, `SPANNER_INSTANCE`, `SPANNER_DATABASE`, `SPANNER_DIALECT`, and `GOOGLE_APPLICATION_CREDENTIALS` from workspace `.env` files before spawning `npx`. The first live helper-script run may download `@toolbox-sdk/server@1.1.0` through `npx`, so treat that as user-approved third-party code execution.

## License Notes

Bundled Spanner skill and helper script material is Apache-2.0 licensed. See `LICENSE.spanner`.
