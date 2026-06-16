---
name: search-company-knowledge
description: Use when searching Confluence, Jira, Compass, or internal Atlassian knowledge to answer questions about systems, processes, architecture, incidents, specs, or terminology.
---

# Search Company Knowledge

Use this skill when the user asks what something means, how an internal process works, where a system is documented, or what company knowledge exists about a topic.

## Search Strategy

- Extract the core search terms, including system names, acronyms, project names, services, owners, and error terms.
- Prefer broad Atlassian search first when the relevant product is unclear.
- Narrow to Confluence pages for documentation-heavy questions.
- Narrow to Jira issues for implementation history, incidents, known bugs, and decisions.
- Narrow to Compass for services, ownership, dependencies, and operational metadata.

## Answering

- Cite the page, issue, or component used as evidence.
- Distinguish documented facts from inference.
- Prefer current or recently updated pages when results conflict.
- Mention stale or conflicting sources instead of hiding them.
- Do not quote or expose more private content than needed to answer the task.

## When To Ask

Ask the user to clarify when:

- Multiple similarly named projects or spaces match.
- The question needs access to a specific restricted space.
- The user asks for an action based on ambiguous search results.

## Safety

Search is read-only, but results may contain confidential company data. Keep summaries scoped to the user request and avoid dumping large documents into the conversation.
