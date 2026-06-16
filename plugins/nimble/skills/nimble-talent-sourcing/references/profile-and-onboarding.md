# Profile & Onboarding

Nimble business workflows can use a lightweight profile and optional memory under `~/.nimble/`. Keep this state outside the user's project unless they explicitly ask for a workspace file.

## Profile Path

```text
~/.nimble/business-profile.json
```

Example shape:

```json
{
  "company": {
    "name": "Acme Corp",
    "domain": "acme.com",
    "description": "Enterprise SaaS platform"
  },
  "industry_keywords": ["project management", "team collaboration"],
  "competitors": [
    { "name": "WidgetCo", "domain": "widgetco.com", "category": "project-management" }
  ],
  "preferences": {
    "output_format": "bullet-points"
  },
  "last_runs": {}
}
```

## First-Run Flow

1. Check whether `~/.nimble/business-profile.json` exists.
2. If missing, ask only for the minimum needed fields for the requested workflow.
3. Ask before creating or updating the profile.
4. Write only non-secret business context. Do not store API keys, OAuth tokens, cookies, contact exports, or raw extraction payloads.

## Transport Setup

Recommended Cline setup:

```bash
cline plugin install nimble
```

The plugin registers the `nimble` MCP server. The user completes OAuth through Cline's MCP authorization flow when prompted.

CLI fallback:

```bash
npm i -g @nimble-way/nimble-cli
export NIMBLE_API_KEY=<set outside chat>
```

Never ask the user to paste a Nimble API key into chat. If a key is missing or invalid, ask them to set or rotate it outside chat and retry.

## Memory Use

Use `~/.nimble/memory/` for optional cross-session reports:

- `reports/` for timestamped outputs.
- `competitors/`, `companies/`, `people/`, or `positioning/` for entity notes.
- `index.md` files for short catalogs.

Ask before writing persistent memory. Keep memory factual, sourced, and easy to delete.
