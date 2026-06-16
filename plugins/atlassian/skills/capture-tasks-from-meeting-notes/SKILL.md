---
name: capture-tasks-from-meeting-notes
description: Use when extracting action items from meeting notes, Confluence pages, transcripts, or pasted notes and preparing Jira tasks for assigned work.
---

# Capture Tasks From Meeting Notes

Use this skill when the user wants meeting notes turned into Jira tasks or follow-up items.

## Inputs

Get notes from:

- A Confluence page URL.
- Pasted meeting notes.
- A local notes file.
- A transcript or summary supplied by the user.

If the source is unclear, ask whether to fetch a Confluence page or use pasted text.

## Extract Action Items

Look for:

- Mentions such as `@Name to do task`.
- Name plus action verb.
- Structured labels such as `Action`, `Action Item`, `TODO`, or checklist items.
- Owners in parentheses or after dashes.
- Due dates, blockers, dependencies, and related decisions.

Separate confirmed action items from possible follow-ups.

## Prepare Jira Tasks

For each proposed task, include:

- Proposed Jira summary.
- Owner or assignee candidate.
- Context from the meeting.
- Acceptance criteria or done condition.
- Due date if stated.
- Link back to the source notes when available.

## Confirmation Gate

Do not create Jira issues until the user approves the proposed task list, target project, issue type, assignees, and any due dates.
