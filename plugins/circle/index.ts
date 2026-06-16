import type { AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "circle"

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["mcp", "skills", "rules"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "circle-codegen",
			transport: {
				type: "streamableHttp",
				url: "https://api.circle.com/v1/codegen/mcp",
			},
		})

		api.registerRule({
			id: "circle:funds-and-credentials",
			source: PLUGIN_NAME,
			content: [
				"Circle workflows can move real funds, sign transactions, deploy contracts, accept legal terms, expose wallet balances, and use paid services.",
				"Before any write, transfer, bridge, swap, Gateway deposit or withdrawal, paid x402 call, contract deployment, contract write, wallet creation, spending-limit change, or mainnet action, state the amount, token, chain, recipient or contract, fees or price, and exact command or API call, then ask for explicit approval.",
				"Do not accept Circle terms, privacy policies, spending policies, or other legal agreements on the user's behalf. Hand the user the exact command or UI path so they can perform legal acceptance themselves.",
				"Never ask the user to paste private keys, entity secrets, persistent API keys, seed phrases, recovery phrases, or session tokens into chat. If local secrets are required, instruct the user to store them in their own environment or secret manager.",
				"OTP codes and one-time wallet challenges should be entered by the user in their own terminal or Circle UI. Do not ask the user to paste them into chat unless they explicitly choose that path after seeing the privacy tradeoff.",
				"Prefer read-only discovery, documentation lookup, estimates, balances, and dry-run checks before money-moving operations. If a paid call or transaction fails after authorization, check status before retrying to avoid double spending.",
			].join("\n"),
		})
	},
}

export default plugin
