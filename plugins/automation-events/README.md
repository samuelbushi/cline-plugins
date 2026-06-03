# automation-events

Shows how plugins can register and emit automation events.

## What It Does

Registers a local automation event type. When `CLINE_LOCAL_EVENT_INTERVAL_MS` is set, the plugin emits periodic demo events into the host automation bridge.

## Install

```bash
cline plugin install automation-events
```

For local development from this repository:

```bash
cline plugin install ./plugins/automation-events --cwd .
```

## Example Usage

After installation, run Cline with `CLINE_LOCAL_EVENT_INTERVAL_MS` set and ask:

```text
Wait for the local automation event and summarize the payload when it arrives.
```

Cline receives the event through the automation bridge registered by `automation-events` and can react to it in the session.

## Requirements

- Optional `CLINE_LOCAL_EVENT_INTERVAL_MS` for periodic demo events.

## Security Notes

This is a demo event source. Keep the interval unset unless you are testing automation ingestion.
