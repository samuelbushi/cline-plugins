---
name: intercom-analysis
description: Analyze Intercom conversations, contacts, and companies through the Intercom MCP server. Use when the user asks about support trends, customer issues, open conversations, contact lookup, company context, or patterns in Intercom data.
---

# Intercom Analysis

Use the Intercom MCP server to inspect support data and produce grounded summaries. Keep the work read-oriented unless the user explicitly asks for a separate setup task.

## Tool Model

Use MCP tools from the server named `intercom`. In Cline SDK contexts, flattened tool names are prefixed like `intercom__<tool>`.

Tool names may vary slightly by host, but the common surface is:

- Search conversations or contacts.
- Fetch a conversation by ID for the full thread.
- Fetch a contact by ID for profile attributes, tags, companies, and recent activity.
- List or fetch companies with company-specific tools such as `list_companies` or `get_company`.
- Fetch a known object by ID when search already returned an ID.
- Create or update Help Center articles when the user explicitly asks to manage article content.

Start with search, then fetch full objects before drawing conclusions. Search snippets alone are not enough for incident analysis or theme counts.

## Pattern Analysis

When the user asks for support trends or common issues:

1. Clarify scope if needed: time window, product area, state, segment, region, or customer set.
2. Search for a representative set of conversations. Fetch full threads for the most relevant results.
3. Group issues by topic, feature area, symptom, error message, and resolution path.
4. Quantify carefully. Say how many conversations you reviewed and whether more pages may exist.
5. Present a concise report:
   - Theme table with counts.
   - Top issues with representative conversation IDs.
   - Recommended actions such as docs, bug investigation, routing changes, or macro updates.

## Customer Investigation

When the user asks about a specific customer:

1. Search contacts by exact email first. If they gave a company, search by company name or email domain.
2. Fetch the contact profile and relevant companies.
3. Search and fetch recent or open conversations for that contact or company.
4. Build a timeline with conversation IDs, dates, states, and outcomes.
5. Identify unresolved items and whether similar issues appear for other customers.

## Guardrails

- Treat conversation content as sensitive customer data.
- Cite Intercom object IDs so the user can verify in the inbox.
- State data limits: page count reviewed, filters used, and whether results are live current state.
- If search returns nothing, broaden the query before concluding there is no data.
- Do not claim to have updated Intercom unless an explicit mutation tool was used at the user's request.
- Do not create or update Help Center articles without showing the proposed content and getting approval.
