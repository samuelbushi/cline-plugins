---
name: lusha-enrich-contact
description: Look up one business contact in Lusha and return a call-ready contact card with verified phones, email, company context, and relevant signals.
---

# Lusha Enrich Contact

Use this skill when the user asks for a named person's business contact details, phone number, work email, LinkedIn-based lookup, or enrichment for one contact.

## Workflow

1. Extract the strongest identifier from the request:
   - Email address
   - LinkedIn profile URL
   - First name, last name, and company name or domain
2. If the user only gave a role and company, first use `lusha__prospecting_contact_search` to find candidates. Ask the user to choose when there are multiple plausible matches.
3. For an unambiguous identifier, call `lusha__contacts_search` with enrichment enabled so the lookup and reveal happen once.
4. For ambiguous matches, preview first, show the top candidates, then call `lusha__prospecting_contact_enrich` only for the confirmed contact.
5. If a Lusha contact id is available, call `lusha__signals_contacts_get` to check recent role or company-change signals.

## Output

Lead with phone availability before email:

| Field | Value |
|-------|-------|
| Name | |
| Title | |
| Company | |
| Direct phone | |
| Mobile phone | |
| Work email | |
| Location | |
| Signals | |

Do not show blank rows. If no verified phone is available, say that directly.

## Guardrails

- Do not reveal the same contact twice.
- If the tool reports reveal credits, include the cost in the summary.
- Do not infer personal data that Lusha did not return.
