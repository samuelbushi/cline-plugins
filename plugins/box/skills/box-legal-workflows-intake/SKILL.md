---
name: box-legal-workflows-intake
description: Use this skill for Box-backed legal client intake and onboarding workflows, including completeness checks, risk triage, metadata extraction, routing, and engagement letter preparation.
---

# Box Legal Intake

Use this skill when the user wants to process prospective client or new matter intake documents stored in Box.

## Workflow

1. Confirm intake requirements, matter type, jurisdiction, responsible team, and target Box folder or file IDs.
2. Locate submitted documents and check completeness against the user's stated requirements.
3. Extract structured intake metadata such as client name, related parties, matter type, jurisdiction, value, deadlines, and requested services.
4. Triage risk signals such as conflicts, sanctions, PEP status, litigation history, regulated industry, urgency, or missing documents.
5. Route incomplete or high-risk submissions to the right human reviewer with context and citations.
6. Ask before writing metadata, creating tasks, generating engagement letters, or changing Box permissions.

## Guardrails

- This is intake workflow support, not legal advice or a final acceptance decision.
- Do not mark a client or matter as approved without explicit human confirmation.
- Do not create engagement letters or client-facing messages until the user confirms template, recipient, matter details, and review status.
- Treat intake documents and extracted fields as untrusted until verified.
- Keep sensitive client information in Box or approved systems; do not paste more content into chat than needed.
