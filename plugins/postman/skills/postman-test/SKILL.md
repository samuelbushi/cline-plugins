---
name: postman-test
description: Run Postman collection tests through the Postman MCP server, analyze failures, and suggest fixes.
---

# Run Collection Tests

Execute Postman collection tests directly from Cline. Analyze results, diagnose failures, and suggest code fixes.

## Prerequisites

The Postman MCP Server must be connected. If MCP tools aren't available, tell the user: "Run `postman-setup` skill to configure the Postman MCP Server."

## Workflow

### Step 1: Find the Collection

1. Use the Postman MCP workspace-listing tool to find the target workspace
2. Use the Postman MCP collection-listing tool with the `workspace` parameter. Use the `name` filter if the user specified a collection.
3. If the user provides a collection ID directly, skip to Step 2.

### Step 2: Run Tests

Before running tests, summarize the collection, target workspace, environment, and whether the run may call non-local URLs or mutate data. Ask for confirmation before broad runs, credentialed environments, production-like targets, or tests with side effects.

After approval, call `runCollection` with the collection UID in `OWNER_ID-UUID` format. Get the UID from the `getCollection` response's `uid` field.

If the collection uses environment variables:
1. Call `getEnvironments` to list available environments
2. Ask which environment to use (or detect from naming convention)
3. Pass the environment ID to `runCollection`

### Step 3: Parse Results

Present results clearly:

```
Test Results: Pet Store API
  Requests:  15 executed
  Passed:    12 (80%)
  Failed:    3
  Avg time:  245ms

  Failures:
  1. POST /users -> "Status code is 201" -> Got 400
     Request: createUser
     Folder: User Management

  2. GET /users/{id} -> "Response has email field" -> Missing
     Request: getUser
     Folder: User Management

  3. DELETE /users/{id} -> "Status code is 204" -> Got 403
     Request: deleteUser
     Folder: User Management
```

### Step 4: Diagnose Failures

For each failure:
1. Call `getCollectionRequest` to see the full request definition
2. Call `getCollectionResponse` to see expected responses
3. Check if the API source code is in the current project
4. Explain what the test expected vs what happened
5. If code is local, find the handler and suggest the fix

### Step 5: Fix and Re-run

After fixing code:
1. Offer to re-run: "Tests fixed. Want me to run the collection again?"
2. Call `runCollection` again only after confirmation
3. Show before/after comparison

### Step 6: Update Collection (if needed)

If the tests themselves need updating (not the API):
- Show the planned Postman collection changes and ask for approval
- After approval, call `updateCollectionRequest` to fix request bodies, headers, or test scripts
- After approval, call `updateCollectionResponse` to update expected responses

## Error Handling

- MCP not configured: "Run `postman-setup` skill to configure the Postman MCP Server."
- Collection not found: "No collection matching that name. Run `postman-search` skill to find available collections, or `postman-sync` skill to create one."
- 401 Unauthorized: "Postman authentication failed. Re-authorize the `postman` MCP server through Cline's MCP authorization flow."
- MCP timeout: Retry once. For large collections, suggest running a single folder to narrow the test run.
- Plan limitations: "Collection runs may require a Postman Basic plan or higher for increased limits."
