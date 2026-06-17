# vercel

Vercel platform guidance for Cline. This plugin adds the official Vercel MCP server, a broad Vercel skill pack, and guarded slash commands for common deployment and project operations.

## Cline Primitives

- MCP: registers the `vercel` Streamable HTTP MCP server at `https://mcp.vercel.com`. The server uses Vercel OAuth and, when the Vercel MCP server accepts the Cline client, gives Cline access to platform context such as docs, projects, deployments, and logs according to the account permissions granted during authorization. If OAuth is unavailable for the client, the bundled skills and CLI workflows still work without MCP.
- Skills: bundles Vercel-focused skills for Next.js, Vercel CLI, deployments and CI/CD, environment variables, Marketplace integrations, AI SDK, AI Gateway, Workflow, Functions, storage, routing middleware, firewall, Turbopack, shadcn/ui, React best practices, and end-to-end verification.
- Commands: adds `/vercel-bootstrap`, `/vercel-deploy`, `/vercel-env`, `/vercel-marketplace`, and `/vercel-status`. The commands route common workflows into the relevant bundled skills and keep risky operations behind confirmation gates.
- Rules: adds Vercel platform safety guidance for deploys, production changes, environment variables, domains, firewall rules, Marketplace provisioning, logs, and secrets.

## Requirements

- A Cline host with plugin MCP, bundled skill, command, and rule support.
- A Vercel account for MCP authorization and live platform operations.
- Vercel CLI on PATH for CLI-backed workflows such as deploys, env management, project linking, and Marketplace integration flows.
- Project-specific permissions for the target Vercel team, project, deployment, domains, environment variables, and integrations.

## Notes

The plugin does not run Vercel CLI commands at install time, does not start background hooks, and does not send telemetry. Live deploys, production promotions, rollbacks, environment mutations, Marketplace provisioning, domain changes, and firewall changes require explicit user approval before execution.
