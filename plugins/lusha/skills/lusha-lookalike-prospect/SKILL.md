---
name: lusha-lookalike-prospect
description: Use Lusha lookalike search to expand from at least five reference companies or contacts, then enrich the best-fit prospects.
---

# Lusha Lookalike Prospect

Use this skill when the user wants more companies like their best customers, similar contacts, account expansion, or lookalike prospecting.

## Workflow

1. Count the provided reference companies or contacts.
2. Require at least five references before calling lookalike tools. If fewer are provided, ask for the remaining number needed.
3. Determine mode:
   - Company mode for domains, company LinkedIn URLs, or company names
   - Contact mode for emails, profile URLs, contact ids, or name plus company
4. For company names without domains, use `lusha__companies_search` without reveal data to resolve domains before lookalike search.
5. Call `lusha__lookalike_companies` or `lusha__lookalike_contacts` with the confirmed seed set.
6. For company-mode results, ask for the target role when missing, then use `lusha__prospecting_contact_search` to find decision makers.
7. Reveal selected contacts with `lusha__prospecting_contact_enrich`, asking first when the credit cost is high or the batch is large.

## Output

Show the reference set used, unresolved references, and lookalike results:

| # | Company | Contact | Title | Direct phone | Mobile phone | Work email | Fit reason |
|---|---------|---------|-------|--------------|--------------|------------|------------|

End with lookalikes found, contacts enriched, verified-phone count, and credits consumed when available.

## Guardrails

- Do not run lookalike search with fewer than five references.
- Ask before excluding or deduplicating against user-supplied customer lists.
- Mark missing phones as not available.
