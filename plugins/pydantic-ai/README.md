# pydantic-ai

Pydantic AI agent-building guidance for Cline.

## What It Does

Installs the `building-pydantic-ai-agents` skill with reference material for building Python agents using Pydantic AI. The skill covers agents, tools, structured output, capabilities, lifecycle hooks, streaming, testing, debugging, and multi-agent patterns.

## Install

```bash
cline plugin install pydantic-ai
```

For local development from this repository:

```bash
cline plugin install ./plugins/pydantic-ai --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Build a Pydantic AI agent with a weather tool and deterministic tests.
```

## Requirements

- Python 3.10 or newer for projects that run Pydantic AI code.
- The user's project chooses and installs its own `pydantic-ai` dependency.
- Model provider credentials are only needed when the user asks Cline to run or test live agent calls.

## Security Notes

This plugin ships documentation and skills only. It does not install Python packages, register MCP servers, start services, read credentials, or call model providers at install time. Some bundled references describe optional Pydantic AI MCP, provider-native web, code execution, and A2A patterns; those are guidance for user-requested implementation work, not plugin behavior.

## License Notes

The bundled `building-pydantic-ai-agents` skill is MIT licensed by Pydantic. See `LICENSE.pydantic-ai`.
