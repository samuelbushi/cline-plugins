# Remember

Remember gives Cline a lightweight workspace handoff. It saves one concise note for the current workspace and injects it into future sessions as continuity context.

## Install

```bash
cline plugin install remember
```

For local development:

```bash
cline plugin install ./plugins/remember --cwd .
```

## Usage

Run `/remember` near the end of a session. Cline will summarize the current state and save the handoff with the `save_handoff` tool. The next session in the same workspace receives that note as context.

You can also manage the note directly:

```text
/remember status
/remember clear
/remember Working on auth refactor. Next: finish tests in apps/api.
```

## Cline Primitives

- Command: `/remember` starts a handoff save, shows status, clears the saved note, or saves direct text.
- Tool: `save_handoff` writes the current handoff into Cline's data directory.
- Rule: saved handoff content is injected into future sessions for the same workspace.

## Storage

Handoffs are stored under:

```text
${CLINE_DATA_DIR:-~/.cline/data}/plugins/remember/<workspace-key>/remember.md
```

The plugin does not write to the project repository by default, does not capture full transcripts, does not call another model, and does not push backups.
