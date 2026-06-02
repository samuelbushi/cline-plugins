# background-terminal

Status: demo
Source: Cline SDK examples

Runs long-lived shell commands in the background.

## What It Does

Registers `start_background_command`, `get_background_command`, and `delete_background_command`. Jobs write metadata and logs under the Cline data directory so an agent can start work, poll output, and clean up later.

## Install

```bash
cline plugin install background-terminal
```

For local development from this repository:

```bash
cline plugin install ./plugins/background-terminal --cwd .
```

## Requirements

- A shell environment.
- Optional `CLINE_DATA_DIR` to control where job metadata is stored.

## Security Notes

This plugin runs shell commands. Review requested commands carefully and use host tool approval policies in sensitive workspaces.

