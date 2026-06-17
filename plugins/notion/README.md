# notion

Use Notion from Cline for workspace search, page creation, database updates, task workflows, and structured documentation.

## What It Does

This plugin registers the Notion remote MCP server and bundles Notion skills for:

- Capturing decisions, discussions, procedures, FAQs, and team knowledge into structured Notion pages.
- Preparing meeting materials from existing workspace context and creating pre-read or agenda pages.
- Searching, synthesizing, and documenting research from Notion pages and databases.
- Turning product or technical specs into implementation plans and task records.

It also adds namespaced slash commands for common actions such as `/notion-search`, `/notion-find`, `/notion-create-page`, `/notion-database-query`, `/notion-create-task`, `/notion-create-database-row`, `/notion-tasks-setup`, `/notion-tasks-plan`, `/notion-tasks-build`, and `/notion-explain-diff`.

## Install

```bash
cline plugin install notion
```

For local development from this repository:

```bash
cline plugin install ./plugins/notion --cwd .
```

## Requirements

- A Notion account and workspace access.
- MCP OAuth through Cline for the registered `notion` server.
- User approval before creating pages, inserting rows, updating pages, changing task statuses, writing task plans, posting progress updates, or modifying task-board/database structure.

## Security Notes

This plugin does not read or modify Notion during installation. Live workflows can access private workspace pages and databases, so the bundled rule treats Notion content as untrusted, asks before writes, avoids background comment polling, and requires clarification when multiple pages or databases match.

## Attribution

The bundled Notion workflow skill material is derived from Notion plugin material published by Notion Labs under MIT. See `LICENSE.notion` and `NOTICE.notion.md`.
