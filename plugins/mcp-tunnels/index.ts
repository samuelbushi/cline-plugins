import type { AgentPlugin } from "@cline/sdk"

const DEFAULT_DEPLOYMENT_DIR = "./mcp-tunnel"

function formatTunnelPrompt(input: string): string {
	const requestedDir = input.trim().replace(/\s+/g, " ") || DEFAULT_DEPLOYMENT_DIR
	const deploymentDir = JSON.stringify(requestedDir)

	return `Guide me through creating an Anthropic MCP Tunnel Docker Compose setup.

Deployment directory: ${deploymentDir}

Operate carefully:

1. Explain that Anthropic MCP Tunnels are a research-preview way to expose a private MCP server through an outbound-only tunnel that depends on Cloudflare transport. Do not position this as a production hardening guide.
2. Do not ask me to paste the tunnel token into chat. The token is a live secret. If a token is needed, create a gitignored .env placeholder or ask me to export it in my shell, then verify only by checking that it is present without printing it.
3. Ask before creating files, generating certificates, running Docker, starting services, exposing a tunnel, deploying anything, or calling an external API.
4. Preflight Docker, Docker Compose, OpenSSL, and outbound connectivity requirements before writing files.
5. Tell me which Anthropic Console actions I must do myself: create the tunnel, copy the non-secret domain, keep the token secret, and upload the CA certificate.
6. Generate only local development artifacts in the deployment directory unless I explicitly ask for production or Kubernetes guidance.
7. If I already have an MCP server, route to that private upstream only after confirming its scheme, host, port, and path. If I do not, offer a tiny sample streamable HTTP MCP server for verification.
8. Keep private keys, .env files, generated cert data, and tunnel credentials out of git and out of chat.
9. Verify each stage before moving on: cert generation, CA registration, Compose config, cloudflared registration, proxy logs, and final reachable URL.
10. End with the deployment directory, configured route, tunnel domain, exact URL path, secret locations, and cleanup/rotation notes.

Use Cline's normal command and file tools only after the relevant approval is clear.`
}

const plugin: AgentPlugin = {
	name: "mcp-tunnels",
	manifest: {
		capabilities: ["commands"],
	},

	setup(api) {
		api.registerCommand({
			name: "create-docker-mcp-tunnel",
			description:
				"Guide Anthropic MCP Tunnel setup with Docker Compose, certificates, cloudflared, and a private MCP upstream.",
			handler: (input) => ({
				reply: "Starting a guided Anthropic MCP Tunnel Docker Compose setup.",
				submitPrompt: formatTunnelPrompt(input),
			}),
		})
	},
}

export default plugin
