# Example: Database Migration Implementation

> Before executing any Notion write, update, task creation, status change, or comment shown in this example, draft the proposed change, show it to the user, and continue only after explicit approval.

User Request: "Plan and implement the database migration for user preferences schema"

## Workflow

### 1. Find & Fetch Spec

```
the Notion MCP search tool -> Found "User Preferences Schema Migration Spec"
the Notion MCP fetch tool -> Extracted requirements
```

Spec Summary: Migrate from JSON blob to structured schema for better performance and data integrity.

### 2. Parse Requirements

- Current: JSONB preferences column
- Target: Separate `user_preferences` and `notification_preferences` tables
- Must maintain: Backward compatibility during migration
- Performance: Support 1M+ users with zero downtime

### 3. Create Implementation Plan

```
the Notion MCP page-write tool
pages: [{
  properties: {
    title: "Implementation Plan: User Preferences Migration"
  },
  content: "[Full implementation plan with phases]"
}]
```

Plan included:

- Phase 1: Create new tables with indexes
- Phase 2: Backfill data from JSONB
- Phase 3: Dual-write mode (both old and new)
- Phase 4: Switch reads to new schema
- Phase 5: Drop old JSONB column

### 4. Find Task Database & Create Tasks

```
the Notion MCP search tool -> Found "Engineering Tasks" database
the Notion MCP fetch tool -> Got schema (Task, Status, Priority, Assignee, etc.)

the Notion MCP page-write tool
parent: { data_source_id: "collection://xyz" }
pages: [
  {
    properties: {
      "Task": "Write migration SQL scripts",
      "Status": "To Do",
      "Priority": "High",
      "Sprint": "Sprint 25"
    },
    content: "## Context\nPart of User Preferences Migration...\n\n## Acceptance Criteria\n- [ ] Migration script creates tables\n- [ ] Indexes defined..."
  },
  // ... 4 more tasks
]
```

Tasks created:

1. Write migration SQL scripts
2. Implement backfill job
3. Add dual-write logic to API
4. Update read queries
5. Rollback plan & monitoring

### 5. Track Progress

Regular updates to implementation plan with status, blockers, and completion notes.

## Key Outputs

Implementation Plan Page (linked to spec)
5 Tasks in Database (with dependencies, acceptance criteria)
Progress Tracking (updated as work progresses)

## Success Factors

- Broke down complex migration into clear phases
- Created tasks with specific acceptance criteria
- Established dependencies (Phase 1 -> 2 -> 3 -> 4 -> 5)
- Zero-downtime approach with rollback plan
- Linked all work back to original spec
