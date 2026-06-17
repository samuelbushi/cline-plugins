---
name: slack-search
description: Search Slack messages, files, channels, threads, and users through the Slack MCP server. Use when the user asks to find Slack discussions, summarize channel activity, locate files, identify people, or gather Slack context before answering.
---

# Slack Search

Use this skill whenever you need to find information in Slack, including when a
user asks to locate messages, conversations, files, channels, or people.

Slack search can expose private workspace content. Start with public channels
unless the user explicitly asks for private channels, DMs, or group DMs. Ask
before widening the scope to private content.

## Search Tools Overview

| Tool | Use When |
|------|----------|
| `slack_search_public` | Searching public channels only. |
| `slack_search_public_and_private` | Searching public channels, private channels, DMs, and group DMs after user approval. |
| `slack_search_channels` | Finding channels by name or description. |
| `slack_search_users` | Finding people by name, email, or role. |

## Search Strategy

### Start Broad, Then Narrow

1. Begin with a simple keyword or natural language question.
2. If there are too many results, add filters such as `in:`, `from:`, or date
   ranges.
3. If there are too few results, remove filters and try synonyms or related
   terms.

### Choose The Right Search Mode

- Natural language questions are best for fuzzy, conceptual searches where you
  do not know exact keywords, such as "What is the deadline for project X?"
- Keyword search is best for specific content, such as `project X deadline`.

### Use Multiple Searches

Do not rely on a single search for complex questions.

- Search for the topic first.
- Then search for specific people's contributions.
- Then search in specific channels when the relevant channels are known.

## Search Modifiers Reference

### Location Filters

- `in:channel-name` searches within a specific channel.
- `in:<#C123456>` searches in a channel by ID.
- `-in:channel-name` excludes a channel.
- `in:<@U123456>` searches in DMs with a user.

### User Filters

- `from:<@U123456>` searches messages from a specific user by ID.
- `from:username` searches messages from a user by Slack username.
- `to:me` searches messages sent directly to the current user.

### Content Filters

- `is:thread` searches only threaded messages.
- `has:pin` searches pinned messages.
- `has:link` searches messages containing links.
- `has:file` searches messages with file attachments.
- `has::emoji:` searches messages with a specific reaction.

### Date Filters

- `before:YYYY-MM-DD` searches messages before a date.
- `after:YYYY-MM-DD` searches messages after a date.
- `on:YYYY-MM-DD` searches messages on a specific date.
- `during:month` searches messages during a specific month, such as
  `during:january`.

### Text Matching

- `"exact phrase"` matches an exact phrase.
- `-word` excludes messages containing a word.
- `wild*` uses wildcard matching. Use at least three characters before `*`.

## File Search

To search for files, use the `content_types="files"` parameter with type
filters:

- `type:images` for image files.
- `type:documents` for documents.
- `type:pdfs` for PDF files.
- `type:spreadsheets` for spreadsheet files.
- `type:canvases` for Slack canvases.

Example: `content_types="files" type:pdfs budget after:2025-01-01`

## Following Up On Results

After finding relevant messages:

- Use `slack_read_thread` to get full thread context for threaded messages.
- Use `slack_read_channel` with `oldest` and `latest` timestamps to read
  surrounding messages for context.
- Use `slack_read_user_profile` to identify who a user is when their ID appears
  in results.

## Common Pitfalls

- Boolean operators do not work. `AND`, `OR`, and `NOT` are not supported. Use
  spaces for implicit AND and `-` for exclusion.
- Parentheses do not work. Do not try to group search terms with `()`.
- Search is not real-time. Very recent messages may not appear in search
  results. Use `slack_read_channel` for the most recent messages.
- Private channel access needs user approval. Use
  `slack_search_public_and_private` only when the user approved that scope.
