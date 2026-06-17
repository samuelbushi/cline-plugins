# skill-creator

Skill authoring workflow for creating, improving, validating, packaging, and reviewing Cline skills.

## What It Adds

This plugin ships the `skill-creator` skill with bundled schemas, grading rubrics, packaging utilities, and a static review viewer for skill eval outputs. It helps turn repeated workflows into reusable Cline skills while preserving examples, references, scripts, and trust boundaries.

## Cline Primitives

- Skills: one bundled `skill-creator` skill for skill design, editing, eval planning, review, and packaging.
- Bundled resources: local Python helpers for basic validation, `.skill` packaging, benchmark aggregation, and optional static review HTML generation.

## Requirements

- Python 3 if you want to run the bundled helper scripts.
- No API keys, MCP servers, install-time network calls, or background services.

## Safety Notes

The plugin does not automatically run generated code or external services. Generated scripts, package installs, browser launches, network calls, and writes outside the skill directory should stay explicit user-approved actions.
