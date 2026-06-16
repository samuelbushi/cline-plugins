---
name: generate-status-report
description: Use when generating project, sprint, weekly, daily, blocker, or executive status reports from Jira and optionally publishing them to Confluence.
---

# Generate Status Report

Use this skill when the user asks for a project update, sprint report, blocker summary, executive summary, or Confluence status page.

## Clarify Scope

Confirm missing details before publishing:

- Jira project key, filter, board, epic, or component.
- Reporting period.
- Audience, such as executives, delivery managers, team, or standup.
- Whether the output should stay in chat or be published to Confluence.
- Target Confluence space and page when publishing.

## Query Plan

Use focused Jira searches:

- Completed in the period.
- In progress.
- Blocked or at risk.
- High-priority unresolved work.
- Recently updated issues.
- Unassigned or stale issues when relevant.

Keep result limits bounded and paginate only when needed.

## Report Shape

Include:

- Overall status.
- Key accomplishments.
- Blockers and risks.
- Work in progress.
- Recently completed work.
- Upcoming priorities.
- Links to source issues or pages.

Match detail level to the audience. Executive summaries should be short and outcome-focused. Team reports can include issue-level detail.

## Publishing

Ask for explicit confirmation before creating or updating a Confluence page. Show the destination space, parent page if relevant, page title, and final content preview.
