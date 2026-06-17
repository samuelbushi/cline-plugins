# Cline Tool Mapping

Superpowers skills may refer to tool names from other coding-agent hosts. In Cline, use the closest available Cline capability:

| Skill references | Cline equivalent |
|-----------------|------------------|
| `Skill` tool | Use Cline's `skills` tool with `skill: "superpowers:<skill-name>"` or the bare skill name when unambiguous. |
| `Task` tool / dispatch subagent | Use Cline subagent support when available. If unavailable, use `superpowers:executing-plans` and execute sequentially in the current session. |
| Multiple `Task` calls in parallel | Dispatch independent Cline subagents in parallel only when the host supports it and their work will not conflict. |
| `TodoWrite` | Use Cline's task plan or checklist mechanism. |
| `Read`, `Write`, `Edit` | Use Cline's file tools. |
| `Bash` | Use Cline's shell command tool. |

Namespaced skill names with `:` are supported by Cline. Use the full `superpowers:<skill-name>` form when clarity matters.

When a skill asks for a platform-specific workflow that Cline cannot perform directly, preserve the underlying intent and choose the safest Cline-native equivalent. Ask the user before creating worktrees, committing, pushing, opening browser/server processes, or running third-party helper scripts.
