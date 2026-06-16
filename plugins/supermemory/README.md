# supermemory

Gives Cline persistent, cross-session memory backed by [Supermemory](https://supermemory.ai).

## What It Does

Registers a `supermemory` tool the agent can call to store and retrieve knowledge, plus two automatic behaviors:

- Tool: `supermemory` supports `add`, `search`, `list`, `forget`, `profile`, and `help` modes, scoped to either the current project or the user (cross-project).
- Recall: on the first turn of a session, the user profile and recent project memories are fetched and injected into the model request so the agent starts with relevant context.
- Nudge: when a message asks the agent to remember something (for example "remember that we run lint before committing"), the agent is prompted to persist it with the `supermemory` tool.

Memories are scoped with hashed container tags. The project tag is derived from the workspace path; the user tag is derived from your git email (falling back to the OS username). No raw email or path is sent to Supermemory.

This is the memory and recall port of the OpenCode Supermemory plugin. Memory-aware compaction is not included in this version (Cline's plugin API does not expose a compaction hook); it may be added later.

## Install

```bash
cline plugin install supermemory
```

For local development from this repository:

```bash
cline plugin install ./plugins/supermemory --cwd .
```

## Requirements

- `SUPERMEMORY_API_KEY` in the plugin host environment. Without it the tool returns an error and recall is disabled. Get a key at https://supermemory.ai.
- A model provider key is still required for CLI inference.

## Example Usage

After installation, with `SUPERMEMORY_API_KEY` set, ask Cline:

```text
Remember that this project deploys from the release branch only.
```

Cline will call `supermemory` with `mode: "add"` to save it. Later, in a new session:

```text
How do we deploy this project?
```

The deploy preference is recalled from project memory and surfaced to the agent.

## Configuration

Environment variables:

- `SUPERMEMORY_API_KEY` required. Enables the plugin.
- `SUPERMEMORY_API_URL` optional. Overrides the Supermemory base URL.
- `SUPERMEMORY_DEBUG` optional. When set, writes a debug log to `~/.cline-supermemory.log`.

Optional config file at `<CLINE_DATA_DIR>/plugins/supermemory/config.json` (or `.jsonc`) can override defaults such as `similarityThreshold`, `maxMemories`, `maxProjectMemories`, `injectProfile`, `containerTagPrefix`, `keywordPatterns`, and `autoRecallEveryPrompt`. `CLINE_DATA_DIR` defaults to `~/.cline/data`.

## Privacy and Security Notes

- Memory contents are sent to the Supermemory service over HTTPS. Do not store secrets.
- Text wrapped in `<private>...</private>` is redacted before a memory is stored. A fully private memory is rejected.
- Container tags are SHA-256 hashes; the raw git email and workspace path are not transmitted.
- The agent decides what to save. Review what gets stored if you handle sensitive material.
