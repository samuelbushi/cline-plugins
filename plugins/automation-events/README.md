# automation-events

Status: demo
Source: Cline SDK examples

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

## Requirements

- Optional `CLINE_LOCAL_EVENT_INTERVAL_MS` for periodic demo events.

## Security Notes

This is a demo event source. Keep the interval unset unless you are testing automation ingestion.

