---
name: intercom-customer-360
description: Build a customer profile from Intercom contact, company, and conversation data. Use when the user asks for a customer profile, account summary, customer 360, or a summary of a customer's support history.
---

# Intercom Customer 360

Create a comprehensive customer profile from Intercom data. Prefer an email address when available; it is usually the most reliable identifier.

## Workflow

1. Identify the customer.
   - Search contacts by exact email when provided.
   - For a company, use company-specific MCP tools such as `list_companies` or `get_company`, and search contacts by email domain when useful.
   - If multiple candidates match, ask the user to choose.
2. Fetch details.
   - Fetch the full contact profile.
   - Fetch associated company records when available.
   - Search conversations for the contact or company.
3. Read the right conversations.
   - Fetch full threads for open, recent, escalated, or representative conversations.
   - If there are many conversations, summarize the most recent 10 to 15 and group older ones by theme.
4. Produce the profile.

## Output Shape

Use this structure:

```md
Customer Profile
- Contact:
- Company:
- Plan or segment:
- Last seen or last contacted:

Conversation History
| ID | State | Channel | Updated | Topic |

Key Themes
- ...

Timeline
- ...

Open Items
- ...

Next Steps
- ...
```

## Quality Bar

- Always include conversation IDs for claims based on a thread.
- Separate facts from interpretation.
- Note missing data, stale state, or pagination limits.
- Do not expose unnecessary personal data beyond what the task requires.
