---
name: cortex-run
description: Run an explicit Snowflake Cortex Code CLI workflow. Use only when the user invokes /cortex-run or clearly asks Cline to use Cortex Code for Snowflake work.
user-invocable: true
metadata:
  author: Snowflake
  version: 1.0.0
---

# Cortex Code Explicit Invocation

Use this skill when the user explicitly wants Cortex Code to handle a
Snowflake, Cortex AI, SQL, governance, data quality, dynamic table, or Snowpark
request.

Do not use Cortex Code for unrelated local code, git, frontend, file editing,
or non-Snowflake database work. For ambiguous data requests, ask whether the
user wants Cortex Code or normal Cline handling.

## Step 1: Verify CLI

Run a non-mutating check first:

```bash
command -v cortex && cortex --version
```

If `cortex` is not found, use the `cortex-setup` skill. Stop the workflow until
the CLI is installed and the user confirms they want to continue.

## Step 2: Clarify The Prompt

The prompt after `/cortex-run` is the request to send to Cortex Code. If it is
empty or ambiguous, ask what Snowflake task the user wants Cortex Code to do.

Include only relevant Snowflake context from the current Cline conversation.
Do not include unrelated project files, secrets, credentials, or private chat
history.

## Step 3: Choose A Safe Mode

Start conservative:

| Mode | Use when |
|------|----------|
| Read-only | SHOW, DESCRIBE, SELECT, exploration, analysis, object discovery, governance inspection. |
| Read-write | CREATE, ALTER, INSERT, UPDATE, DELETE, MERGE, dynamic table creation, deployment, or file writes. |

Before read-write work, show the planned command and ask for explicit approval.
If production tables, billing-sensitive warehouses, governance policies, or
access controls may be affected, ask the user to confirm the target account,
role, warehouse, database, schema, and object names.

## Step 4: Run Cortex Code

Use the local Cortex CLI. Prefer a direct headless prompt and the smallest
allowed tool set that can satisfy the task.

Read-only example:

```bash
cortex -p "show me accessible databases and schemas" \
  --output-format stream-json \
  --allowed-tools "snowflake_sql_execute"
```

Read-write example after user approval:

```bash
cortex -p "create a dynamic table for approved daily sales aggregation" \
  --output-format stream-json \
  --allowed-tools "snowflake_sql_execute"
```

If the user's Cortex CLI version supports a more restrictive permission mode,
use it. Do not pass broad or dangerous approval flags unless the user explicitly
asks for that mode and understands the trust boundary.

## Step 5: Return Results

Summarize Cortex output in Cline:

- Show final answers and SQL results in readable form.
- Call out created or modified Snowflake objects.
- Include errors and likely fixes.
- Present any follow-up SQL or shell commands for review before running them.

## Follow-up Turns

If the Cortex CLI reports a session id and supports resuming, use resume only
when the user continues the same Cortex task. Start fresh when the user switches
accounts, warehouses, databases, schemas, or topics.
