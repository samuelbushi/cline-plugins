# Superpowers

Superpowers bundles software development workflow skills for Cline: brainstorming, planning, test-driven development, systematic debugging, code review, git worktrees, branch finishing, and skill-writing guidance.

The plugin is skills-only plus a small compatibility rule. It does not register MCP servers or install startup hooks. Some skills describe subagent-heavy workflows; use those paths only when the active Cline host has suitable subagent support, otherwise fall back to the single-session alternatives described in the skills.

## Requirements

- No API key is required.
- Some workflows may ask to create branches, worktrees, docs, tests, or local helper servers. Treat those as normal project-changing actions and confirm intent before running them.
- Superpowers skill names use Cline's namespaced skill form, for example `superpowers:systematic-debugging`, to avoid collisions with other workflow skills.
- The bundled skills preserve upstream workflow examples and helper scripts; inspect them before execution and prefer project-local, user-approved actions.

## License

The bundled Superpowers skill material is MIT licensed. See `LICENSE.superpowers`.
