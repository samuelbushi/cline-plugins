# Cline Plugins

Official curated plugins for Cline.

This repository is the default collection behind keyword installs:

```bash
cline plugin install web-search
cline plugin install branch-protector
cline plugin install agents-squad
```

Each plugin lives in `plugins/<slug>`. The directory name is the install keyword, so `plugins/web-search` installs with `cline plugin install web-search`.

## Plugins

| Plugin | What it adds |
| --- | --- |
| `agents-squad` | Background subagents with presets, skills, and shared handoffs. |
| `automation-events` | Demo automation events emitted from a plugin. |
| `background-terminal` | Long-running shell jobs with polling and cleanup tools. |
| `branch-protector` | A hook that blocks protected branch pushes unless explicitly allowed. |
| `bundled-skills-demo` | A package plugin that proves bundled skill discovery works. |
| `custom-compaction` | Provider message compaction through a plugin message builder. |
| `env-blocker` | A hook that blocks reads of secret `.env` files. |
| `gitignore-read-files-guard` | A hook that blocks file access to `.gitignore` ignored paths. |
| `intercom-support-triage` | Intercom conversation triage tools for support workflows. |
| `mac-notify` | macOS notifications when a Cline run completes. |
| `nanobanana` | Image generation through OpenRouter and Gemini image models. |
| `typescript-lsp` | TypeScript language service `goto_definition` support. |
| `weather-metrics` | Demo weather tool plus runtime metrics hooks. |
| `web-search` | Exa-backed web search as a Cline tool. |

## Install From Source

For local development, install one plugin directory at a time:

```bash
cline plugin install ./plugins/web-search --cwd .
```

## Contributing

See `CONTRIBUTING.md`. Run validation before opening a PR:

```bash
npm run validate
```
