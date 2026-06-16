---
name: apollo-enrich-lead
description: Enrich a lead in Apollo from a name, company, email, LinkedIn URL, title, or other identifier, then present a contact card with company context and safe next actions.
---

# Apollo Enrich Lead

Use this skill for one-off lead lookup and enrichment.

## Workflow

1. Extract every identifier the user provided: name, company, domain, email, LinkedIn URL, job title, location, or seniority.
2. If the identifier is ambiguous, search first and show the top candidates. Ask the user to pick before enrichment when multiple people could match.
3. Before any credit-consuming enrichment or contact reveal, tell the user what will likely consume credits and ask for confirmation.
4. Enrich the selected person through Apollo MCP using the most specific identifiers available.
5. Enrich the company when firmographic context would help the user decide what to do next.
6. Present the result as a contact card, omitting fields Apollo did not return.
7. Offer safe next actions such as saving the contact, finding colleagues, finding similar people, or preparing a sequence-load preview.

## Contact Card

Use this shape when data is available:

| Field | Detail |
| --- | --- |
| Name | Full name |
| Title | Role and seniority |
| Company | Company name and domain |
| Location | City, state, country |
| Email | Work or revealed email |
| Phone | Direct, mobile, or corporate phone |
| LinkedIn | Profile URL |
| Company context | Industry, size, revenue, funding, HQ, or technologies |
| Suggested next step | One practical action |

## Guardrails

- Never reveal or enrich more contacts than the user requested.
- Confirm before revealing personal emails, phone numbers, or any other credit-consuming data.
- Confirm before creating contacts or adding them to sequences.
- Treat enriched contact data as sensitive. Do not write it into committed files.
