---
name: foundry-collections
description: Design Falcon Foundry collections, JSON schemas, indexes, CRUD access, FQL search patterns, RBAC, and workflow sharing.
when_to_use: "Use when the user wants to create a Foundry collection, define a JSON schema, store app data, query collection records, or design collection access patterns."
---

# Foundry Collections

Collections are Foundry-managed data stores for app state and enrichment data. Use them before adding custom storage logic unless the app has a specific reason to do otherwise.

## Design flow

1. Confirm the collection's purpose, retention expectations, read paths, write paths, and tenant or user isolation needs.
2. Choose a name using Foundry-compatible characters. Keep names stable because app code and workflows reference them.
3. Write a JSON Schema that is strict enough for validation and flexible enough for expected evolution.
4. Mark fields that need filtering or search as indexable.
5. Create the collection with the CLI instead of hand-writing manifest entries.
6. Validate the app before writing dependent functions, workflows, or UI.

## Schema guidance

- Prefer explicit object schemas with required fields for invariants.
- Keep optional fields truly optional and document when they appear.
- Use stable IDs and timestamps for synchronization.
- Avoid storing secrets, raw credentials, or large blobs in collections.
- Use collection RBAC and direct API settings deliberately.

## Access patterns

- UI code should call Foundry APIs or app functions rather than bypassing app authorization decisions.
- Functions can use collection APIs for CRUD and search. Check error result shapes before assuming bytes or JSON.
- Workflows need collection sharing configured before they can read or write collection data.
- For search, use indexed fields and FQL expressions. Do not rely on broad scans.

## Common mistakes

- Creating directories or manifest entries manually instead of using the CLI.
- Forgetting to make workflow access explicit.
- Indexing every field without a read path.
- Returning collection data containing secrets or unnecessary customer data.
