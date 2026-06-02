# bundled-skills-demo

Status: demo
Source: Cline internal examples

Package plugin used to verify bundled skill discovery.

## What It Does

Registers the `bundled_skills_info` tool and ships one bundled skill, `plugin-skill-smoke-test`. The tool confirms the plugin loaded; the skill confirms plugin-installed skills are discovered.

## Install

```bash
cline plugin install bundled-skills-demo
cline config skills
```

For local development from this repository:

```bash
cline plugin install ./plugins/bundled-skills-demo --cwd .
```

## Requirements

- A Cline host with plugin package and bundled skill discovery support.
- No API keys or external services.

## Security Notes

This is a smoke test plugin. It should not be promoted as an end-user feature.

