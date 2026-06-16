# Plugin Dev

Plugin Dev is a Cline plugin authoring toolkit. It adds a guided `/create-plugin` workflow and bundled skills for choosing the right Cline primitives, structuring plugin files, writing skills and commands, registering MCP servers, authoring hooks, managing plugin state, and adapting subagent-style workflows.

## Cline Primitives

- Slash command: `/create-plugin` starts an end-to-end plugin design workflow. It helps clarify the user value, pick primitives, choose single-file versus package shape, implement, review, and smoke test.
- Skills: seven bundled skills cover Cline plugin structure, skill authoring, command workflows, runtime hooks, MCP integration, settings and state, and subagent presets.

## Requirements

This plugin has no external service requirement and runs without credentials. It is intended for repositories that build or review Cline plugins and assumes the active workspace has access to the Cline SDK or plugin examples when implementation begins.

The command does not write files or run setup by itself. It submits a structured prompt to the current Cline session, and any file edits, installs, command execution, or network access still happen through the normal Cline tool flow and approval policy.
