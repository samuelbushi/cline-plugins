---
name: postman-docs
description: Generate, improve, and publish API documentation from local OpenAPI specs or Postman collections.
---

# API Documentation

Analyze, improve, and publish API documentation from OpenAPI specs and Postman collections.

## Prerequisites

The Postman MCP Server must be connected for Postman operations. Local spec analysis works without MCP. If needed, tell the user: "Run `postman-setup` skill to configure the Postman MCP Server."

## Workflow

### Step 1: Find the Source

Use the Postman MCP workspace-listing tool to get the user's workspace ID. If multiple workspaces exist, ask which to use.

Check for API definitions in this order:

Local specs:
- Search for `/openapi.{json,yaml,yml}`, `/swagger.{json,yaml,yml}`

Postman specs:
- Call `getAllSpecs` with the workspace ID to find specs in Postman
- Call `getSpecDefinition` to pull the full spec

Postman collections:
- Use the Postman MCP collection-listing tool with the `workspace` parameter
- Call `getCollection` for full detail

### Step 2: Analyze Documentation Completeness

Read the spec/collection and assess:

```
Documentation Coverage: 60%
  Endpoints with descriptions:     8/15
  Parameters with descriptions:    22/45
  Endpoints with examples:         3/15
  Error responses documented:      2/15
  Authentication documented:       Yes
  Rate limits documented:          No
```

### Step 3: Generate or Improve

Sparse spec: Generate documentation for each endpoint:
- Operation summary and description
- Parameter table (name, type, required, description)
- Request body schema with examples
- Response schemas with examples for each status code
- Error response documentation
- Authentication requirements per endpoint

Partial spec: Fill the gaps:
- Add missing descriptions (infer from naming and schemas)
- Generate realistic examples from schemas
- Add error responses
- Document authentication and rate limits

### Step 4: Apply Changes

Ask the user which output they want:

1. Update the spec file - Write improved docs back into the OpenAPI spec
2. Update in Postman - Use `updateCollectionRequest` to add descriptions and examples to each request
3. Publish public docs - Call `publishDocumentation` with:
   - `collectionId`: the collection's unique ID
   - `customColor` and `customization` for branding
   - Returns a public URL for the docs
   - To unpublish later, call `unpublishDocumentation` with the collection ID
4. Generate markdown - Create a `docs/api-reference.md` file for the project

Before applying any option, summarize the target files or Postman resources and ask for approval. Publishing public documentation requires separate explicit confirmation because it returns a public URL.

### Step 5: Sync Spec and Collection

If both a spec and collection exist, keep them in sync:
- Ask before calling `syncCollectionWithSpec` to update collection from spec. Async (HTTP 202). Poll `getCollectionUpdatesTasks` for completion. Only supports OpenAPI 3.0.
- Ask before calling `syncSpecWithCollection` to update spec from collection changes or before writing synced spec content locally.

## Error Handling

- MCP not configured: Local markdown docs can be generated without MCP. For Postman publishing: "Run `postman-setup` skill to configure the Postman MCP Server."
- 401 Unauthorized: "Postman authentication failed. Re-authorize the `postman` MCP server through Cline's MCP authorization flow."
- Invalid spec: Report parse errors and offer to fix common YAML/JSON syntax issues.
- Plan limitations: "Publishing documentation may require a paid Postman plan. Check https://www.postman.com/pricing/"
- Too many results: Ask the user to specify a collection by name.
