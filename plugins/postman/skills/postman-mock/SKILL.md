---
name: postman-mock
description: Create or inspect Postman mock servers from collections or specs, including example generation and integration guidance.
---

# Create Mock Servers

Spin up a Postman mock server from a collection or spec. Get a working mock URL for frontend development, integration testing, or demos.

## Prerequisites

The Postman MCP Server must be connected. If MCP tools aren't available, tell the user: "Run `postman-setup` skill to configure the Postman MCP Server."

## Workflow

### Step 1: Find the Source

Use the Postman MCP workspace-listing tool to get the user's workspace ID. If multiple workspaces exist, ask which to use.

From existing collection:
- Use the Postman MCP collection-listing tool with the `workspace` parameter
- Select the target collection

From local spec:
- Find OpenAPI spec in the project
- Import it first only after user approval:
  1. Summarize the target workspace, spec file, generated collection name, and cloud resources that will be created
  2. Call `createSpec` with `workspaceId`, `name`, `type`, and `files`
  3. Call `generateCollection`. Async (HTTP 202). Poll `getGeneratedCollectionSpecs` or `getSpecCollections` for completion. Note: `getAsyncSpecTaskStatus` may return 403 on some plans.

### Step 2: Check for Examples

Mock servers serve example responses. Call `getCollection` and check if requests have saved responses.

If examples are missing:
```
Your collection doesn't have response examples. Mock servers need
these to know what to return.

I can generate realistic examples from your schemas and save them
to the Postman collection. Confirm before I change the collection.
```

For each request without examples:
1. Call `getCollectionRequest` to get the schema
2. Generate a realistic example response from the schema
3. Show the planned example responses and ask for approval
4. After approval, call `createCollectionResponse` to save the examples

### Step 3: Check for Existing Mocks

Before creating a new mock, call `getMocks` to check if one already exists for this collection. If found, call `getMock` to get its URL and present it. Only create a new mock if none exists or the user explicitly wants a new one.

### Step 4: Create Mock Server

Call `createMock` with:
- Workspace ID
- Collection UID in `ownerId-collectionId` format (from `getCollection` response's `uid` field)
- Environment ID (if applicable)
- Name: `<api-name> Mock`
- Private: true by default

Ask before creating the mock. If the user wants a public mock, ask for a separate explicit approval before setting public access or publishing it.

### Step 5: Present Mock URL

```
Mock server created: "Pet Store API Mock"
  URL: https://<mock-id>.mock.pstmn.io
  Status: Active

  Try it:
    curl https://<mock-id>.mock.pstmn.io/pets
    curl https://<mock-id>.mock.pstmn.io/pets/1
    curl -X POST https://<mock-id>.mock.pstmn.io/pets -d '{"name":"Buddy"}'

  The mock serves example responses from your collection.
  Update examples in Postman to change mock behavior.
```

### Step 6: Integration

```
Quick integration:

  # Add to your project .env
  API_BASE_URL=https://<mock-id>.mock.pstmn.io

  # Or in your frontend config
  const API_URL = process.env.API_BASE_URL || 'https://<mock-id>.mock.pstmn.io';
```

### Step 7: Publish (optional)

If the user wants the mock publicly accessible:
- After explicit approval, call `publishMock` to make it available without authentication
- Useful for demos, hackathons, or public documentation
- Call `unpublishMock` to make it private again
- Require explicit confirmation before publishing because public mocks can expose API shape, examples, and test data.

## Error Handling

- MCP not configured: "Run `postman-setup` skill to configure the Postman MCP Server."
- No examples in collection: Offer to generate from schemas (Step 2), then ask before saving examples. If no schemas either, ask the user to provide sample responses.
- 401 Unauthorized: "Postman authentication failed. Re-authorize the `postman` MCP server through Cline's MCP authorization flow."
- MCP timeout: Retry once. If it still fails, check https://status.postman.com for outages.
- Plan limitations: "Mock server creation may require a Postman Basic plan or higher for increased usage limits."
