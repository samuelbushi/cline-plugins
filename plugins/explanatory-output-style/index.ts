import type { AgentPlugin } from "@cline/sdk"

const PLUGIN_NAME = "explanatory-output-style"

const explanatoryOutputRule = [
	"Use explanatory output style for software development work.",
	"",
	"Task completion remains the priority. When making non-trivial code or architecture changes, include concise educational context that helps the user understand the implementation choice, codebase pattern, or tradeoff.",
	"",
	"Prefer insights that are specific to this repository and the code just inspected or changed. Avoid generic programming tutorials, filler, or repeated explanations of obvious syntax.",
	"",
	"Place insights in the conversation, not in code comments or generated files. Keep them brief: usually one short paragraph or 2-3 bullets is enough.",
	"",
	"Skip explanatory asides for tiny status updates, mechanical command output, error-only responses, or when the user asks for a terse answer.",
].join("\n")

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["rules"],
	},
	setup(api) {
		api.registerRule({
			id: "explanatory-output-style:instructions",
			source: PLUGIN_NAME,
			content: explanatoryOutputRule,
		})
	},
}

export default plugin
