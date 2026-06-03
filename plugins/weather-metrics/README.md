# weather-metrics

Demonstrates tool registration and runtime metrics hooks.

## What It Does

Registers a mock `get_weather` tool and logs run, tool, token, and cost metrics through lifecycle hooks. It is useful as a starting point for plugin authors.

## Install

```bash
cline plugin install weather-metrics
```

For local development from this repository:

```bash
cline plugin install ./plugins/weather-metrics --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Get the weather for San Francisco while I test plugin tool calls and runtime metrics.
```

Cline can call the demo `get_weather` tool and the plugin logs run, tool, token, and cost metrics through lifecycle hooks.

## Requirements

- No API keys or external services.

## Security Notes

This is an example plugin. It logs runtime metadata, so review logs before using it in private workflows.
