---
name: apollo-prospect
description: Turn an ideal customer profile into a ranked Apollo prospect plan and, after confirmation, use Apollo search or enrichment to produce approved company and lead lists with fit notes.
---

# Apollo Prospect

Use this skill when the user wants to find leads or accounts matching an ideal customer profile.

## Workflow

1. Parse the ICP into company filters and person filters.
2. Ask one or two clarifying questions if the request lacks a role, company type, geography, or size signal.
3. Build a search plan first, including target filters, volume, and which Apollo actions may consume credits.
4. Before any credit-consuming Apollo search or enrichment, state the expected action and likely credit impact, then ask for confirmation.
5. Search companies first when company fit matters. Search people directly when the user already supplied narrow person criteria.
6. Rank results using the user's stated priority: title match, seniority, industry, geography, headcount, technologies, funding, growth signal, or account relevance.
7. Show a preview after search and ask again before any additional enrichment or contact reveal that may consume credits.
8. Enrich only the approved number of leads.
9. Return a ranked table with fit rationale and practical next actions.

## Useful Filters

- Person: title, seniority, department, location, keywords, current company.
- Company: industry, employee range, location, funding, revenue, technologies, domain list, account stage.
- Workflow: target volume, required contact fields, sequence target, export format.

## Output

Use a table like:

| Rank | Name | Title | Company | Fit | Evidence | Next action |
| --- | --- | --- | --- | --- | --- | --- |

Keep fit labels simple:

- Strong: title, seniority, company profile, and geography match.
- Good: most required criteria match.
- Partial: useful lead but one important criterion is weak or unknown.

## Guardrails

- Do not run credit-consuming searches, enrichments, or contact reveals until the user confirms the specific action and approximate volume.
- Keep initial batches small unless the user explicitly asks for volume.
- Do not enroll prospects into outreach from this skill. Hand off to `apollo-sequence-load` after the user approves the lead list.
