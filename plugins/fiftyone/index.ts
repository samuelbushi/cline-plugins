import type { AgentPlugin } from "@cline/sdk"

const setupPrompt = [
	"# FiftyOne Setup",
	"",
	"Help the user verify their FiftyOne environment.",
	"",
	"Checklist:",
	"- Confirm Python environment and whether FiftyOne is installed.",
	"- Confirm `fiftyone-mcp-server` is installed in the same environment.",
	"- If the MCP server is unavailable, ask before installing with `pip install fiftyone-mcp-server`.",
	"- If the user wants MCP tools, guide them to add a stdio MCP server named `fiftyone` with the full path to that environment's `fiftyone-mcp` executable.",
	"- Prefer read-only checks first: list datasets, inspect versions, and verify the FiftyOne App can launch.",
	"- Do not modify datasets, delete samples, install packages, or change shell configuration without explicit user approval.",
].join("\n");

const quickstartPrompt = [
	"# FiftyOne Quickstart",
	"",
	"Guide the user through a first useful FiftyOne workflow.",
	"",
	"Start with setup:",
	"- Verify whether FiftyOne MCP tools are already available by listing datasets.",
	"- If MCP is not available, help the user install `fiftyone-mcp-server` and explicitly configure the full `fiftyone-mcp` executable path.",
	"",
	"Then ask which path they want:",
	"1. Dataset user workflow: import or load data, inspect schema, run inference, launch the App, find duplicates or visualize embeddings.",
	"2. Model workflow: apply a model, evaluate predictions, inspect false positives and false negatives.",
	"3. Developer workflow: create or review a custom FiftyOne plugin, operator, panel, notebook, or remote zoo model.",
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
