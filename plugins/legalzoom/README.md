# legalzoom

Adds LegalZoom legal-workflow assistance to Cline.

## What It Does

Registers the `legalzoom` MCP server at `https://www.legalzoom.com/mcp/claude/v1` for LegalZoom service workflows such as attorney-consultation eligibility, consultation topics, attorney availability, and review requests.

It also adds two slash commands:

- `/review-contract`: starts an AI-only contract review workflow with risk-scored findings, suggested revisions, and attorney-review recommendations.
- `/attorney-assist`: starts a LegalZoom MCP-backed workflow for connecting with an attorney consultation.

The plugin includes a prompt rule that keeps LegalZoom service actions grounded in real MCP tool responses. Cline must not fabricate attorney availability, booking confirmations, entitlement results, or other service responses.

## Install

```bash
cline plugin install legalzoom
```

For local development from this repository:

```bash
cline plugin install ./plugins/legalzoom --cwd .
```

## Requirements

- A LegalZoom account.
- LegalZoom MCP authentication when Cline prompts for it.
- A LegalZoom plan that includes attorney consultations for `/attorney-assist` workflows.

## Security Notes

Contract text, conversation summaries, document metadata, and consultation context may be sent to LegalZoom MCP tools when the user asks for LegalZoom service workflows. Do not use the MCP workflow with documents or matters you do not intend to share with LegalZoom.

AI contract analysis is informational assistance, not legal advice. Users should rely on a qualified legal professional for legal decisions.
