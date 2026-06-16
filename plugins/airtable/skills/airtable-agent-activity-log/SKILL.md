---
name: airtable-agent-activity-log
description: Use this skill when the user wants an opt-in Airtable audit log for agent decisions, blockers, changes, or long-running workflows.
---

# Agent Activity Log

Use this skill to add an opt-in activity log table to an Airtable workflow.

## Consent First

Offer this only when the user is building an agent-driven, recurring, multi-step, or auditable workflow. Ask before creating the table.

Suggested wording:

```text
I can add an Agent activity log table so you can audit what I changed, why, and what got blocked. It is optional. Do you want that included?
```

## Table Shape

Create an `Agent activity log` table with:

- `Summary`: primary single-line text.
- `Timestamp`: created time.
- `Event type`: select values such as Read, Create, Update, Delete, Decision, Blocker, Question, Completion, Error.
- `Detail`: long text for reasoning and context.
- `Outcome`: select values such as Completed, Partial, Failed, Blocked.
- `Status`: select values such as Open, Acknowledged, Resolved, Stale.
- `Session ID`: text.
- `Target table`: select.
- `Target record URL`: URL fallback.

When a workflow touches a small stable set of tables, add linked-record fields for those tables so records can show their related activity log entries.

## Use

Log meaningful decisions, blockers, questions, errors, and completed changes. Do not log every read or tool call. At the end of a session, summarize outputs and unresolved items.
