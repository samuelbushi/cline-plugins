---
name: apollo-sequence-load
description: Prepare and safely enroll approved Apollo contacts into an outreach sequence, including candidate search, preview, enrichment, dedupe, sender selection, and confirmation.
---

# Apollo Sequence Load

Use this skill when the user wants to add Apollo contacts or prospects to an outreach sequence.

## Safety First

Sequence enrollment can trigger outbound messages depending on Apollo sequence and sending-account settings. Always require explicit confirmation before creating contacts or adding anyone to a sequence.

## Workflow

1. Parse the target audience, desired contact count, sequence name, and any sender requirement.
2. If the user asks to list sequences, list available sequences and stop.
3. Resolve the target sequence through Apollo MCP. If there are multiple matches, ask the user to choose.
4. Resolve the sending account. If there are multiple senders, show choices and ask the user to choose.
5. Search for candidate contacts or use the lead list already in the conversation.
6. Show a preview table before enrichment or enrollment.
7. Resolve existing contacts and dedupe the candidate list before enrichment where Apollo MCP supports it.
8. State the expected credit usage and outbound risk, then ask for confirmation.
9. After confirmation, enrich only approved leads that still need enrichment, create missing contacts as needed, and add only the approved contacts to the selected sequence.
10. Return an enrollment summary with contact count, sequence, sender, credits used, and any failures.

## Preview Table

| # | Name | Title | Company | Location | Reason |
| --- | --- | --- | --- | --- | --- |

## Confirmation Language

Before enrollment, use a direct confirmation prompt:

```text
Confirm that you want me to enrich these N leads and add them to the sequence "Sequence Name" from sender@example.com. This may consume about N Apollo credits, and outbound may begin depending on the sequence settings.
```

## Guardrails

- Do not infer approval from earlier broad intent. Require a final confirmation after showing the exact sequence, sender, volume, and contacts.
- Default to small batches.
- Deduplicate before enrichment, contact creation, or enrollment where possible.
- If a contact is already active in another sequence, do not force enrollment unless the user explicitly approves that risk.
