---
name: postman-sync
description: Sync local API specs and Postman collections, including spec upload, collection generation, environments, and async task polling.
---

# Sync Collections

Keep Postman collections in sync with your API code. Create new collections from OpenAPI specs, update existing ones when specs change, or push manual endpoint changes.

## Prerequisites

The Postman MCP Server must be connected. If MCP tools aren't available, tell the user: "Run `postman-setup` skill to configure the Postman MCP Server."

## Workflow

### Step 1: Understand What Changed

Detect or ask:
- Is there a local OpenAPI spec? Search for `/openapi.{json,yaml,yml}`, `/swagger.{json,yaml,yml}`
- Did the user add/remove/modify endpoints?
- Is there an existing Postman collection to update, or do they need a new one?

### Step 2: Resolve Workspace

Use the Postman MCP workspace-listing tool to get the user's workspace ID. If multiple workspaces exist, ask which to use.

### Step 3: Find or Create the Collection

If updating an existing collection:
1. Use the Postman MCP collection-listing tool with the `workspace` parameter to list collections
2. Match by name or ask the user which collection
3. Call `getCollection` to get current state

If creating a new collection from a spec:
1. Read the local OpenAPI spec
2. Summarize the target workspace, spec name, collection name, environment variables, and planned Postman cloud changes, then ask for approval.
3. After approval, call `createSpec` with:
   - `workspaceId`: the workspace ID
   - `name`: from the spec's `info.title`
   - `type`: one of `OPENAPI:2.0`, `OPENAPI:3.0`, `OPENAPI:3.1`, `ASYNCAPI:2.0`
   - `files`: array of `{path, content}` objects
4. Call `generateCollection` from the spec. This is async (HTTP 202). Poll `getAsyncSpecTaskStatus` or `getGeneratedCollectionSpecs` until complete.
5. Call `createEnvironment` with variables extracted from the spec:
   - `base_url` from `servers[0].url`
   - Auth variables from `securitySchemes` (mark as `secret`)
   - Common path parameters

### Step 4: Sync

Spec to Collection (most common):
1. Summarize the spec file, target collection, target workspace, and expected collection/environment changes, then ask for approval.
2. After approval, call `createSpec` or `updateSpecFile` with local spec content.
3. Call `syncCollectionWithSpec` to update the collection. Async (HTTP 202). Poll `getCollectionUpdatesTasks` for completion.
4. Note: `syncCollectionWithSpec` only supports OpenAPI 3.0. For Swagger 2.0 or OpenAPI 3.1, use `updateSpecFile` and regenerate the collection.
5. Report what changed

Collection to Spec (reverse sync):
1. Ask before calling `syncSpecWithCollection` and before writing the updated spec to a local file.
2. Call `syncSpecWithCollection` to update the spec from collection changes.
3. Show the file path and major diff summary, then write the updated spec only after approval.

Manual updates (no spec):
For individual endpoint changes:
1. Summarize each planned create/update and ask before mutating the collection.
2. `createCollectionRequest` to add new endpoints
3. `updateCollectionRequest` to modify existing ones
4. `createCollectionFolder` to organize by resource
5. `createCollectionResponse` to add example responses

### Step 5: Confirm

```
Collection synced: "Pet Store API" (15 requests)
  Added:    POST /pets/{id}/vaccinations
  Updated:  GET /pets - added 'breed' filter parameter
  Removed:  (none)

  Environment: "Pet Store - Development" updated
  Spec Hub: petstore-v3.1.0 pushed
```

## Error Handling

- MCP not configured: "Run `postman-setup` skill to configure the Postman MCP Server."
- MCP timeout: Retry once. If `generateCollection` or `syncCollectionWithSpec` times out, the spec may be too large. Suggest breaking it into smaller specs by domain.
- 401 Unauthorized: "Postman authentication failed. Re-authorize the `postman` MCP server through Cline's MCP authorization flow."
- Invalid spec: Report specific parse errors with line numbers. Offer to fix common YAML/JSON syntax issues.
- Async operation stuck: If polling shows no progress after 30 seconds, inform the user and suggest checking the Postman app directly.
- Plan limitations: "Workspace creation may be limited on free plans. Using your default workspace instead."
