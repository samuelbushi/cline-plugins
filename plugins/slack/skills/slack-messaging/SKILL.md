---
name: slack-messaging
description: Compose, draft, review, and safely send Slack messages or canvases using Slack mrkdwn. Use when the user asks to write an announcement, standup, channel reply, thread reply, message draft, or Slack canvas.
---

# Slack Messaging Best Practices

Use this skill whenever composing, drafting, or helping the user write Slack
messages, including messages created through the Slack MCP server.

Slack sends content to real people. Always show the exact text and destination
to the user before creating a draft, sending a message, replying in a thread, or
sharing a canvas. Prefer draft creation when available.

## Formatting

Slack MCP accepts Slack mrkdwn. Use familiar markdown-style syntax when
composing messages:

| Format | Syntax |
|--------|--------|
| Bold | `*text*` |
| Italic | `_text_` |
| Strikethrough | `~text~` |
| Code inline | `` `code` `` |
| Code block | `` ```code``` `` |
| Quote | `> text` |
| Link | `<url|display text>` |
| Bulleted list | `- item` |
| Numbered list | `1. item` |

Slack message mrkdwn does not support markdown tables, markdown headings, or
markdown image embedding. Avoid those unless creating a canvas and the MCP
tool explicitly supports the target format.

## Message Structure Guidelines

- Lead with the point. Put the most important information in the first line.
  Many people read Slack on mobile or in notifications where only the first
  line shows.
- Keep it short. Aim for 1-3 short paragraphs. If the message is long,
  consider using a canvas instead.
- Use line breaks generously. Separate distinct thoughts with blank lines.
- Use bullet points for lists. Anything with three or more items should be a
  list, not a run-on sentence.
- Emphasize key information with `*bold*` for names, dates, deadlines, and
  action items.

## Thread Vs. Channel Etiquette

- Reply in threads when responding to a specific message to keep the main
  channel clean.
- Use broadcast replies only when the reply contains information everyone in
  the channel needs to see.
- Post in the channel, not a thread, when starting a new topic, making an
  announcement, or asking a question to the whole group.
- Do not start a new thread to continue an existing conversation. Find and
  reply to the original message.

## Tone And Audience

- Match the tone to the channel. `#general` is usually more formal than
  `#random`.
- Use emoji reactions instead of reply messages for simple acknowledgments when
  appropriate, but do not claim to add reactions unless a Slack MCP tool for
  reactions is available.
- For announcements, use a clear structure: context, key info, call to action.
