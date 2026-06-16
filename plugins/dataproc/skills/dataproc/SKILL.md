---
name: dataproc
description: Use when the user asks Cline to inspect, troubleshoot, or plan changes for Google Cloud Dataproc clusters and jobs, including Spark or Hadoop workload status, cluster health, job failures, and safe Dataproc lifecycle planning.
---

# Dataproc

Use this skill for Google Cloud Dataproc cluster and job workflows. Favor read-only inspection first, state assumptions clearly, and ask before running commands that create, update, delete, submit, cancel, or otherwise mutate cloud resources.

## Requirements

- Google Cloud Application Default Credentials must be available to the Cline process.
- `DATAPROC_PROJECT` must identify the Google Cloud project.
- `DATAPROC_REGION` must identify the Dataproc region.
- The Dataproc API must be enabled.
- Read-only inspection requires Dataproc Viewer or equivalent permissions. Lifecycle operations require stronger project permissions such as Dataproc Editor, but only when the user explicitly asks Cline to execute those changes.

Never ask the user to paste credentials or tokens into chat. If authentication is missing, ask them to configure ADC or environment variables outside the conversation and rerun the task.

## Helper Script

This skill includes one helper script for read-oriented Dataproc Toolbox calls:

```bash
node <skill-dir>/scripts/dataproc-tool.cjs <tool-name> '<json-params>'
```

Available tool names:

- `list_clusters`
- `get_cluster`
- `list_jobs`
- `get_job`

Examples:

```bash
node <skill-dir>/scripts/dataproc-tool.cjs list_clusters '{"pageSize":20}'
node <skill-dir>/scripts/dataproc-tool.cjs list_jobs '{"filter":"status.state = ERROR","pageSize":20}'
node <skill-dir>/scripts/dataproc-tool.cjs get_cluster '{"clusterName":"example-cluster"}'
node <skill-dir>/scripts/dataproc-tool.cjs get_job '{"jobId":"example-job"}'
```

Resolve `<skill-dir>` to this skill directory before running the script. The script validates `DATAPROC_PROJECT` and `DATAPROC_REGION`, passes the current environment through to the Dataproc Toolbox command, and invokes `npx --yes @toolbox-sdk/server@1.1.0 --prebuilt dataproc`, so it may need network access the first time it runs.

## Workflow

1. Identify the target project, region, cluster, and job from the user's request. If project or region is missing and cannot be read from `DATAPROC_PROJECT` / `DATAPROC_REGION`, ask for it.
2. Classify the request as read-only inspection, troubleshooting, planning, or mutation.
3. For read-only inspection, use the helper script when it answers the question directly. Keep result sizes bounded with filters and page sizes.
4. For troubleshooting, gather the smallest useful context first: cluster state, job state, driver output location, relevant labels, job type, and recent error messages.
5. For lifecycle operations, produce the exact `gcloud dataproc ...` command or config change first, explain the impact, and wait for explicit approval before executing.
6. Report findings with concrete resource names, project, region, state, and next action. Call out uncertainty when the available data does not prove the cause.

## Safety Rules

- Do not create, update, delete, stop, start, submit, cancel, or drain Dataproc resources without explicit user approval in the current conversation.
- Prefer filters over broad unbounded list calls.
- Do not print access tokens, credential file contents, or secret environment variables.
- Treat production clusters as sensitive. If the target environment is unclear, ask before running a mutating command.
- When using `gcloud`, include `--project` and `--region` explicitly whenever possible.

## Common Tasks

List clusters:

```bash
node <skill-dir>/scripts/dataproc-tool.cjs list_clusters '{"pageSize":20}'
```

Find failed jobs:

```bash
node <skill-dir>/scripts/dataproc-tool.cjs list_jobs '{"filter":"status.state = ERROR","pageSize":20}'
```

Inspect one cluster:

```bash
node <skill-dir>/scripts/dataproc-tool.cjs get_cluster '{"clusterName":"CLUSTER_NAME"}'
```

Inspect one job:

```bash
node <skill-dir>/scripts/dataproc-tool.cjs get_job '{"jobId":"JOB_ID"}'
```

Plan a job submission:

```bash
gcloud dataproc jobs submit pyspark JOB_FILE \
  --project "$DATAPROC_PROJECT" \
  --region "$DATAPROC_REGION" \
  --cluster CLUSTER_NAME
```

Show this command to the user with the concrete values and wait for approval before running it.
