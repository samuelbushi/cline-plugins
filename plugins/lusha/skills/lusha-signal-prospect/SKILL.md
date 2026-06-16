---
name: lusha-signal-prospect
description: Find companies or contacts triggered by Lusha buying signals, then identify and enrich the right decision makers.
---

# Lusha Signal Prospect

Use this skill when the user starts from a trigger such as funding, hiring growth, headcount change, executive movement, promotion, or company change.

## Workflow

1. Decide whether the user wants company signals or contact signals.
2. Discover valid signal filters through the Lusha tools before searching:
   - Company signal directories through `lusha__signals_company_filters`
   - Contact signal directories through `lusha__signals_contact_filters`
3. Map the user's trigger to a live signal identifier. If the mapping is unclear, present the closest options and ask for confirmation.
4. Search the matching companies or contacts with the selected signal and date range.
5. Pull signal detail for the shortlist with `lusha__signals_companies_get`, `lusha__signals_companies_search`, `lusha__signals_contacts_get`, or `lusha__signals_contacts_search` as appropriate.
6. For company signals, ask for the target role if it is missing, then use `lusha__prospecting_contact_search` to find decision makers at those companies.
7. Reveal selected contacts with `lusha__prospecting_contact_enrich`, asking first when the credit cost is high or the batch is large.

## Output

State the signal used and the date window, then show:

| # | Company or contact | Signal | Signal date | Target person | Title | Direct phone | Mobile phone | Work email |
|---|--------------------|--------|-------------|---------------|-------|--------------|--------------|------------|

End with matched count, enriched count, verified-phone count, and credits consumed when available.

## Guardrails

- Never invent signal identifiers. Validate them with the live filter tools.
- Do not reveal contacts until the target role and shortlist are clear.
- Surface signal dates so the user can judge freshness.
