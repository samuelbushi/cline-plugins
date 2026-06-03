# mac-notify

Sends a macOS notification when a Cline run completes.

## What It Does

Registers an `afterRun` hook. On macOS, successful runs trigger a native notification with a short completion summary. Other platforms no-op.

## Install

```bash
cline plugin install mac-notify
```

For local development from this repository:

```bash
cline plugin install ./plugins/mac-notify --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Run the test suite and let me know when the task is complete.
```

When the Cline run completes on macOS, `mac-notify` sends a native notification with a short completion summary.

## Requirements

- macOS for notifications.
- No API keys or external services.

## Security Notes

Notification text can include task output. Avoid enabling it if completion summaries may contain sensitive information.
