# Vibe Prospecting

Vibe Prospecting gives Cline a guided workflow for B2B company and contact research. The bundled skill covers lead-list creation, company and prospect matching, contact enrichment, business events, technology stack filters, market sizing, and CSV export workflows through the `@vibeprospecting/vpai` CLI.

## Cline Primitives

- Skill: `vibe-prospecting` teaches Cline how to use the Vibe Prospecting CLI safely, including schema discovery, controlled-vocabulary autocomplete, session chaining, enrichment, event fetches, and sample-first validation.
- Rule: `vibe-prospecting:prospecting-safety` keeps CLI execution, authentication, full-scale lead fetches, contact enrichment, and CSV exports behind explicit user intent and approval.

## Requirements

Use requires Node/npm access for `npx @vibeprospecting/vpai@latest` and Vibe Prospecting authentication. Prefer session-scoped `VP_API_KEY`; only run persistent `vpai config --api-key` or browser login after the user approves durable auth. The plugin does not install or run the CLI during plugin installation.

Prospect records, emails, phone numbers, business events, and exports should be treated as sensitive business data. The workflow samples five entities first and waits for explicit approval before running a full export.
