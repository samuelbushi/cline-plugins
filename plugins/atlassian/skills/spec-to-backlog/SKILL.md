---
name: spec-to-backlog
description: Use when converting a Confluence spec, product requirements document, design note, or pasted requirements into Jira epics, stories, tasks, or bugs.
---

# Spec To Backlog

Use this skill when the user wants to turn a spec into Jira backlog items.

## Workflow

1. Get the source spec from a Confluence URL, title search, local file, or pasted text.
2. Identify the target Jira project key and available issue types.
3. Analyze the spec and produce a proposed breakdown without creating tickets.
4. Present the epic and child ticket plan to the user.
5. Ask for explicit confirmation before creating anything.
6. Create the parent epic first, then child issues linked to it.
7. Return the created issue keys and links.

## Breakdown Quality

- Keep tickets independently testable.
- Group frontend, backend, infrastructure, documentation, and testing work logically.
- Include acceptance criteria.
- Include technical notes only when they are actionable.
- Avoid tiny implementation chores and vague tickets.
- Call out open questions, dependencies, and out-of-scope work.

## Confirmation Gate

Before creating Jira issues, summarize:

- Target Jira project.
- Issue types to create.
- Epic title.
- Child ticket summaries.
- Any assumptions, dependencies, and out-of-scope items.

Do not create, update, link, or bulk-create tickets until the user approves the exact plan.
