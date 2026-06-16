---
name: box-legal-workflows
description: Use this skill for Box-backed legal workflow design, including confidentiality, risk frameworks, human review, Box AI governance, collaboration roles, metadata strategy, and legal matter workflow patterns.
---

# Box Legal Workflows

Use this skill for legal operations workflows that store, review, route, or analyze legal documents in Box.

## Core Principles

- This is workflow assistance, not legal advice. Keep attorney or authorized human review in the loop.
- Preserve confidentiality. Confirm who can access matter folders, generated summaries, metadata, and shared links before creating or changing them.
- Use Box permissions, metadata, retention, and audit trails intentionally. Do not use ad hoc folder structures when the organization already has matter templates.
- Prefer Box AI for in-platform summarization or extraction when enabled and appropriate. Ask before exporting or routing legal document contents to external AI.
- Write summaries and metadata only after the user confirms the target folder, metadata template, and review process.

## Risk Framing

When rating legal workflow risk, separate:

- Document completeness risk.
- Conflict, sanctions, or regulatory risk.
- Confidentiality and privilege risk.
- External access risk.
- Deadline or notice-period risk.
- Missing approval or human-review risk.

Label ratings as workflow triage, not legal conclusions.

## Collaboration Roles

- Confirm the matter team, external counsel, auditors, clients, buyers, sellers, or reviewers before granting access.
- Use least-privilege roles and time-bound external access where possible.
- Ask before adding collaborators, creating shared links, or using organization-visible hubs.

## Metadata Strategy

- Ask whether a Box metadata template already exists.
- Do not invent template keys, field names, or legal risk taxonomies when the organization has standards.
- Prefer structured metadata for matter type, counterparty, jurisdiction, dates, owner, risk level, status, and review outcome.
- Confirm before writing metadata back to Box.

## Human Review

Require explicit human approval before:

- Accepting or rejecting a client or matter.
- Assigning final legal risk ratings.
- Sharing diligence or contract summaries externally.
- Creating engagement letters, notices, or legal recommendations.
- Granting external deal-room access.
