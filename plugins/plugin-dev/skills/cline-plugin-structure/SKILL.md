---
name: cline-plugin-structure
description: This skill should be used when the user asks to create, scaffold, review, or simplify a Cline plugin, choose between single-file and package plugin shape, configure package.json cline.plugins entries, declare manifest capabilities, or organize plugin directories.
---

# Cline Plugin Structure

Use this skill to design the smallest maintainable Cline plugin shape for the requested behavior.

## Start With The User Value

Before choosing files, identify what the installed plugin should add for a Cline user:

- A callable tool
- A slash command
- A prompt rule
- A runtime hook
- A message builder
- A provider
- An MCP server registration
- Bundled skills or reference material
- A subagent preset or workflow pattern supported by the target Cline host

Do not translate another plugin format 1:1. Pick the Cline shape that is least surprising for the user installing it.

## Choose The Shape

Use a single TypeScript file when the plugin only needs code and host-provided packages:

```text
my-plugin.ts
```

This is usually right for remote MCP registrations, simple commands, rules, hooks, message builders, and small tools.

Use a package plugin when there is a real packaging reason:

```text
plugins/my-plugin/
  package.json
  index.ts
  README.md
  skills/
    my-skill/
      SKILL.md
  assets/
  references/
```

Package shape is justified for bundled skills, templates, examples, reference files, npm dependencies, local MCP server packages, multiple entries, or install metadata.

## Package Discovery Contract

Package plugins need `package.json` with `type: "module"` and a `cline.plugins` entry:

```json
{
  "name": "my-plugin",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "description": "One sentence describing the plugin.",
  "exports": {
    ".": "./index.ts"
  },
  "cline": {
    "plugins": [
      {
        "paths": ["./index.ts"],
        "capabilities": ["commands", "skills"]
      }
    ]
  },
  "peerDependencies": {
    "@cline/sdk": "*"
  },
  "peerDependenciesMeta": {
    "@cline/sdk": {
      "optional": true
    }
  }
}
```

The package name should match the plugin directory slug in curated collections.

## Runtime Manifest

The default export is an `AgentPlugin`:

```ts
import type { AgentPlugin } from "@cline/sdk"

const plugin: AgentPlugin = {
  name: "my-plugin",
  manifest: {
    capabilities: ["commands"],
  },
  setup(api, ctx) {
    api.registerCommand({
      name: "do-work",
      description: "Run the workflow.",
      handler: (input) => ({
        reply: "Starting workflow.",
        submitPrompt: input,
      }),
    })
  },
}

export default plugin
```

Declare every capability that setup uses. If a plugin registers a command, include `commands`. If it registers a rule, include `rules`. If it has runtime hooks, include `hooks` and define the matching `hooks` object.

## Path Rules

Use `ctx.workspaceInfo?.rootPath` for user project files. The Cline CLI can set `--cwd` without changing `process.cwd()`, and editor hosts do not share a single process working directory.

Use `import.meta.url` only to locate files inside the plugin package, such as bundled templates or scripts.

## Installation Behavior

Plugin setup should be registration-only. Avoid install-time side effects:

- Do not run networked or third-party code just because the plugin loaded.
- Do not write credentials into project files.
- Do not mutate the workspace unless a user-invoked command or tool explicitly asks for it.
- Do not register duplicate surfaces when one clean default is enough.

## Review Checklist

Before shipping, check:

- Is every file intentional?
- Does each primitive map to a real Cline capability?
- Is package shape justified?
- Are commands written as instructions for the agent?
- Are credentials and external actions clearly gated?
- Does the README explain what the plugin adds and what it requires?
