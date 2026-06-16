import type { AgentPlugin } from "@cline/sdk"

const setupPrompt = [
	"# FiftyOne Setup",
	"",
	"Help the user verify their FiftyOne environment.",
	"",
	"Checklist:",
	"- Confirm Python environment and whether FiftyOne is installed.",
	"- Treat `fiftyone-mcp-server` as optional; only configure it when the user wants live MCP tools.",
	"- If the MCP server is requested and unavailable, ask before installing with `pip install fiftyone-mcp-server`.",
	"- If the user wants MCP tools, guide them to add a stdio MCP server named `fiftyone` with the full path to that environment's `fiftyone-mcp` executable.",
	"- Prefer read-only checks first: list datasets, inspect versions, and verify the FiftyOne App can launch.",
	"- Do not modify datasets, delete samples, install packages, or change shell configuration without explicit user approval.",
	"- Use the `fiftyone-setup` skill for the detailed environment and MCP setup flow.",
].join("\n");

const quickstartPrompt = [
	"# FiftyOne Quickstart",
	"",
	"Guide the user through a first useful FiftyOne workflow.",
	"",
	"Start with setup:",
	"- Verify Python and FiftyOne first with read-only Python SDK checks.",
	"- If FiftyOne MCP tools are already configured, use them for live dataset actions.",
	"- If MCP is not available, continue with Python SDK/CLI guidance unless the user specifically wants to install and configure `fiftyone-mcp-server`.",
	"",
	"Then ask which path they want:",
	"1. Dataset workflow: use `fiftyone-dataset-import`, `fiftyone-dataset-curation`, `fiftyone-find-duplicates`, `fiftyone-embeddings-visualization`, or `fiftyone-dataset-export`.",
	"2. Model workflow: use `fiftyone-dataset-inference`, `fiftyone-model-evaluation`, or `fiftyone-zoo-remote-model`.",
	"3. Developer workflow: use `fiftyone-develop-plugin`, `fiftyone-generate-data-lens-connector`, `fiftyone-voodo-design`, `fiftyone-create-notebook`, `fiftyone-eval-plugin`, or `fiftyone-code-style`.",
	"4. Maintenance workflow: use `fiftyone-troubleshoot` or `fiftyone-issue-triage`.",
	"",
	"Use the bundled FiftyOne skills that match the selected path. Ask before mutating datasets, installing packages, exporting data, pushing to Hugging Face, or changing plugin/config files.",
].join("\n");

const plugin: AgentPlugin = {
	name: "fiftyone",
	manifest: {
		capabilities: ["skills", "commands"],
	},

	setup(api) {
		api.registerCommand({
			name: "fiftyone-help",
			description:
				"Show FiftyOne setup guidance and available Cline workflows.",
			handler: () => ({
				reply: "Opening FiftyOne help.",
				submitPrompt: setupPrompt,
			}),
		});

		api.registerCommand({
			name: "fiftyone-quickstart",
			description:
				"Start a guided FiftyOne workflow for datasets, models, or plugin development.",
			handler: (input) => ({
				reply: "Starting FiftyOne quickstart.",
				submitPrompt: input.trim()
					? `${quickstartPrompt}\n\nUser goal: ${input.trim()}`
					: quickstartPrompt,
			}),
		});
	},
}

export default plugin
