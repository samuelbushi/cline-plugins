---
name: cline-plugin-hooks
description: This skill should be used when the user asks to create or review Cline runtime hooks, block risky tool calls, observe model or tool events, port file-hook behavior into a plugin, or decide whether hook behavior is safe to ship.
---

# Cline Plugin Hooks

Use this skill to author typed Cline runtime hooks for reusable plugin behavior.

## Runtime Hooks

Cline plugins can declare `hooks` in the manifest and add a `hooks` object:

```ts
const plugin: AgentPlugin = {
  name: "branch-guard",
  manifest: {
    capabilities: ["hooks"],
  },
  hooks: {
    beforeTool({ toolCall, input }) {
      if (toolCall.toolName !== "run_commands") return undefined
      return undefined
    },
  },
}
```

Hooks run inside the agent runtime. Use them for behavior that belongs to the plugin and should apply consistently when installed.

## Good Hook Use Cases

Hooks are a good fit for:

- Blocking dangerous tool calls.
- Redacting sensitive tool output.
- Adding telemetry or local logs with clear consent.
- Applying consistent policy before model calls or tool execution.
- Emitting notifications after a run.

Hooks are not a good fit for surprise automation. Avoid hooks that mutate files, call external services, or run commands merely because a session started.

## Common Stages

- `beforeRun`: prepare per-session state.
- `afterRun`: notify or summarize after terminal status.
- `beforeModel`: inspect or adjust model requests.
- `afterModel`: inspect model output before tools run.
- `beforeTool`: block or gate risky tool calls.
- `afterTool`: redact or post-process results.
- `onEvent`: observe runtime events.

## State

Capture session data in setup and use it in hooks. Prefer `ctx.workspaceInfo?.rootPath` over `process.cwd()`.

If a host may run multiple sessions in one process, key state by `ctx.session?.sessionId` instead of using one global variable.

## Blocking Tool Calls

When blocking, return a stop result with a clear reason:

```ts
beforeTool({ toolCall, input }) {
  if (toolCall.toolName !== "run_commands") return undefined
  const commands = Array.isArray((input as { commands?: unknown }).commands)
    ? (input as { commands: string[] }).commands
    : []
  if (commands.some((command) => command.includes("git push --force"))) {
    return {
      stop: true,
      reason: "Blocked force push. Ask the user for an explicit safer workflow.",
    }
  }
  return undefined
}
```

Keep matching conservative and explain what the user can do next.

## Porting File Hooks

When adapting shell hook behavior:

- Prefer a typed runtime hook over a shell script.
- Preserve only the behavior that is valuable for Cline users.
- Remove tool-specific environment variables and event names.
- Do not run bundled scripts automatically unless that is the plugin's explicit purpose.
- Treat hook input and external command output as untrusted data.

## Review Checklist

Before shipping a hook plugin:

- Does the README explain the hook behavior?
- Are false positives tolerable?
- Does the hook avoid credential leakage?
- Are external writes or network calls absent or clearly gated?
- Does `manifest.capabilities` include `hooks`?
