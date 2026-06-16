---
name: triage-issue
description: Use when triaging a bug report, error message, production issue, support report, or suspected duplicate in Jira.
---

# Triage Issue

Use this skill when the user asks whether a bug already exists, wants similar issues found, or wants help creating a well-structured Jira bug.

## Extract Signal

Identify:

- Error signature, exception, status code, or log phrase.
- Component, service, app, or feature.
- Environment, version, region, tenant, or platform.
- User-visible symptom and impact.
- Reproduction steps if available.

## Duplicate Search

Run several narrow searches instead of one broad search:

- Error-signature search.
- Component or service search.
- Symptom search.
- Recent open bugs in the target project.
- Resolved issues if the user asks whether it has happened before.

Prefer short key phrases over full stack traces in JQL text search.

## Triage Decision

Classify findings as:

- Likely duplicate.
- Possibly related.
- Historical but resolved.
- No useful match found.

Explain why, with issue keys and short evidence.

## Creating Or Updating Jira

Ask for confirmation before creating a new bug or commenting on an existing issue. Before asking, show the proposed summary, description, severity, affected area, reproduction steps, evidence, and linked related issues.

Also ask for confirmation before linking duplicates, changing status, priority, severity, assignee, labels, components, or editing any existing issue fields.
