# outputai

Bundle Output.ai workflow-development skills as an installable Cline plugin.

## What It Does

Installs a focused workbench for Output SDK projects. The plugin bundles 49 granular skills that help Cline plan durable LLM workflows, implement them with Output SDK conventions, debug local runs and traces, manage encrypted credentials safely, design evaluation datasets and judges, operate Output CLI workflows, migrate older projects, and review common SDK patterns.

This plugin does not start services, install packages, register MCP servers, or run Output CLI commands at install time. It only provides skills and a lightweight routing rule.

## Install

```bash
cline plugin install outputai
```

For local development from this repository:

```bash
cline plugin install ./plugins/outputai --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Plan a new Output SDK workflow that enriches inbound support tickets, calls our customer API, and produces a triage recommendation with eval coverage.
```

Cline uses the bundled Output.ai skills to gather requirements, design steps and schemas, plan prompts and evaluators, and keep implementation work aligned with Output SDK conventions. For implementation, debugging, credentials, evals, and workflow execution, Cline can switch to the matching granular `output-*` skill instead of relying on a single broad guide.

## Requirements

- An Output SDK project when you want to inspect, build, or run workflows.
- The Output CLI and project dependencies when you ask Cline to execute workflow commands.
- Provider, API, database, or third-party credentials needed by the workflow itself.

## Security Notes

The skills include guidance for encrypted credentials and workflow execution. Cline should ask before editing credential files, starting services, running live workflows, resetting or stopping workflow runs, or writing generated workflow files. Avoid pasting plaintext secrets, full encrypted credential contents, or large trace payloads into chat.
