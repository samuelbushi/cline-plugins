---
name: knowledge-catalog-discovery
description: Use this skill to search and inspect Google Cloud Knowledge Catalog or Dataplex metadata, including catalog entries, entry context, data asset metadata, aspect types, tables, datasets, views, owners, and governance aspects.
---

# Knowledge Catalog Discovery

Use this skill when the user wants to discover or inspect Google Cloud Knowledge Catalog metadata.

## Requirements

Before live catalog access:

- Make sure a project or scope is known. If the user does not provide one, use `DATAPLEX_PROJECT` as `projects/$DATAPLEX_PROJECT`.
- Make sure Node and npm are available before using `npx`.
- Let the first bounded toolbox read reveal Application Default Credential, API enablement, IAM, or quota failures, then report the exact failure.

If credentials or project context are missing, ask the user for the missing setup instead of guessing.

## Execution Model

Use the official toolbox server through `npx` only when live catalog data is needed:

```bash
npx --yes @toolbox-sdk/server@1.1.0 --log-level error --prebuilt dataplex invoke <tool-name> '<json-args>'
```

This may download `@toolbox-sdk/server` on first use. Do not run it only to prove the plugin exists.

Set a Cline-specific user agent when useful:

```bash
npx --yes @toolbox-sdk/server@1.1.0 --log-level error --prebuilt dataplex --user-agent-metadata cline invoke search_entries '<json-args>'
```

## Tools

### search_entries

Searches catalog entries for data assets such as tables, datasets, and views.

Use this for broad discovery, but keep searches bounded:

```bash
npx --yes @toolbox-sdk/server@1.1.0 --log-level error --prebuilt dataplex invoke search_entries '{"query":"type:table customer orders","scope":"projects/my-project","pageSize":5,"orderBy":"relevance"}'
```

Arguments:

- `query`: required Dataplex search query. Prefer specific filters such as `type:table`, names, business terms, or owners.
- `scope`: optional `projects/<project-id>`, `projects/<project-number>`, or `organizations/<org-id>`. If omitted by the user and `DATAPLEX_PROJECT` is set, use `projects/$DATAPLEX_PROJECT`.
- `pageSize`: optional result count. Default to 5 for exploratory searches.
- `orderBy`: optional. Common values are `relevance`, `last_modified_timestamp`, and `last_modified_timestamp asc`.

Avoid broad unfiltered searches. If the user asks for a vague term, start with `pageSize:5` and refine from returned names and entry types.

### lookup_entry

Retrieves metadata for one specific entry resource name:

```bash
npx --yes @toolbox-sdk/server@1.1.0 --log-level error --prebuilt dataplex invoke lookup_entry '{"entry":"projects/my-project/locations/us/entryGroups/@bigquery/entries/table-entry","view":2}'
```

Arguments:

- `entry`: required entry resource name.
- `view`: optional. Use `2` for normal full metadata, `3` for custom aspect selection, or `4` when the user needs all aspects.
- `aspectTypes`: optional array of aspect type names. Use only with view `3`.

Use `lookup_entry` after `search_entries` finds a likely resource.

### lookup_context

Retrieves richer context and relationships for up to 10 resources in the same location:

```bash
npx --yes @toolbox-sdk/server@1.1.0 --log-level error --prebuilt dataplex invoke lookup_context '{"resources":["projects/my-project/locations/us/entryGroups/@bigquery/entries/table-entry"]}'
```

Use this to understand related assets, lineage-like context, or surrounding metadata after identifying candidate entries.

### search_aspect_types

Searches aspect types relevant to a term or governance concept:

```bash
npx --yes @toolbox-sdk/server@1.1.0 --log-level error --prebuilt dataplex invoke search_aspect_types '{"query":"pii","pageSize":5,"orderBy":"relevance"}'
```

Use this when the user asks about governance tags, business metadata, or custom aspects and you need to discover the right aspect type before requesting it from entries.

## Workflow

1. Clarify project, organization, location, and asset type when the request is ambiguous. If only project is missing and `DATAPLEX_PROJECT` is set, use `projects/$DATAPLEX_PROJECT`.
2. Start with `search_entries` using a specific query and small `pageSize`.
3. Use `lookup_entry` for the best candidates.
4. Use `lookup_context` when relationships or nearby resources matter.
5. Use `search_aspect_types` before requesting custom aspects by name.
6. Summarize entry names, resource names, asset types, owners, descriptions, aspects, and any uncertainty.

## Guardrails

- Do not perform catalog mutations from this skill.
- Do not run unbounded searches.
- Do not expose credentials or ADC token material.
- Do not assume a project if neither `DATAPLEX_PROJECT` nor the user provides one.
- Treat catalog metadata as sensitive company data.
- If a command fails due to credentials, IAM, API enablement, or quota, report the exact failure and stop.
