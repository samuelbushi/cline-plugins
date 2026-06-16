---
name: lusha-prospect
description: Build a targeted Lusha lead list from an ICP or persona, resolve filters, reveal selected contacts, and summarize credit use.
---

# Lusha Prospect

Use this skill when the user asks to build a lead list, find decision makers, prospect an ICP, or identify contacts to call in a market segment.

## Workflow

1. Parse the ICP into contact filters and company filters.
2. Use free-form job titles directly as `jobTitles`.
3. Resolve structured filters before search:
   - Contact departments, seniority, countries, and locations through `lusha__prospecting_contact_filters`
   - Company industry, size, revenue, location, technology, and intent topics through `lusha__prospecting_company_filters`
4. If the ICP is too broad, ask one clarifying question before searching.
5. Search companies first when account criteria are present, then search contacts scoped to those companies.
6. Treat search results as previews. Before revealing a large batch, sum the available reveal credits and ask the user to confirm.
7. Use `lusha__prospecting_contact_enrich` for the selected contacts and reveal only the fields needed for the user's workflow.

## Output

Show applied filters first, then a lead table:

| # | Name | Title | Company | Direct phone | Mobile phone | Work email | Signal or fit |
|---|------|-------|---------|--------------|--------------|------------|---------------|

End with:

- Results found
- Contacts revealed
- Contacts with verified phones
- Credits consumed when available
- Suggested next step, such as refine filters, add intent, run `lusha-signal-prospect`, or export as CSV

## Guardrails

- Do not pass guessed natural-language values into structured filters.
- Ask before high-credit reveals.
- Mark missing phones as not available instead of leaving cells blank.
