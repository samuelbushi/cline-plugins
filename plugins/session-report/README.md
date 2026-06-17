# session-report

Generate a static HTML report from local Cline session artifacts.

## What It Does

This plugin bundles the `session-report` skill with a local Node analyzer and an HTML template. When the user asks for a report, Cline can scan local session message files, summarize token usage, cache behavior, expensive prompts, subagent sessions, project totals, and slash-command/tool activity, then write a self-contained HTML file in the current workspace.

## Requirements

- Local Cline session artifacts under `CLINE_SESSION_DATA_DIR` or `~/.cline/data/sessions`.
- Node.js to run the bundled analyzer.
- No API keys, MCP servers, network access, or third-party services.

## Privacy

The analyzer reads local persisted Cline message files. Reports can include user prompts and nearby transcript context, so review the generated HTML before sharing it.

## Install

```bash
cline plugin install session-report
```

For local development from this repository:

```bash
cline plugin install ./plugins/session-report --cwd .
```
