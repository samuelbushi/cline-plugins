import type { AgentPlugin } from "@cline/core";

const PLUGIN_NAME = "legalzoom";

const LEGALZOOM_RULE = [
	"LegalZoom is active. Treat legal workflows as high-stakes assistance, not legal advice.",
	"AI-generated contract or business-legal analysis must be framed as informational and should be reviewed by a qualified legal professional before the user relies on it.",
	"Never fabricate LegalZoom service interactions. Attorney consultation status, entitlements, topics, availability, booking IDs, document attachment status, and cart actions must come from real LegalZoom MCP tool results.",
	"Before sending user-provided matter details, phone numbers, document text, uploaded-file content, or AI summaries to LegalZoom MCP tools, tell the user what will be shared and get explicit confirmation.",
	"If a LegalZoom MCP tool is unavailable, unauthenticated, unauthorized, or fails, stop that service workflow at the failure point, explain what happened plainly, and offer to continue with AI-only analysis or have the user visit LegalZoom directly.",
	"Only say an attorney consultation is confirmed after a successful LegalZoom MCP booking response. Never generate fake confirmation numbers or imply a human attorney has reviewed anything unless the tool response says so.",
].join("\n");

function withUserInput(prompt: string, input: string): string {
	const trimmed = input.trim();
	if (!trimmed) {
		return prompt;
	}
	return `${prompt}\n\nUser supplied input:\n${trimmed}`;
}

function reviewContractPrompt(input: string): string {
	return withUserInput(
		[
			"Review the contract or agreement the user provides.",
			"",
			"This is AI-only analysis. Do not call LegalZoom MCP tools, do not book attorney review, and do not imply that a LegalZoom attorney has reviewed the document.",
			"",
			"Ask for the contract if it was not supplied. If useful, ask for the user's role, deal size, governing jurisdiction, and priority concerns, but do not block on missing optional context.",
			"",
			"Produce a practical contract review with:",
			"- Agreement type, parties, governing law, and user role if known.",
			"- Overall risk: green, yellow, or red.",
			"- Key findings with provision references, risk level, confidence, practical impact, and what is typical.",
			"- Suggested revisions for material yellow or red findings.",
			"- Clear next steps.",
			"",
			"Recommend attorney review when there are red findings, low confidence on material clauses, regulated subject matter, multi-jurisdiction complexity, unusual terms, high deal value, or the user asks for legal advice. If attorney review is warranted, suggest `/attorney-assist` as a next step instead of attempting that workflow here.",
		].join("\n"),
		input,
	);
}

function attorneyAssistPrompt(input: string): string {
	return withUserInput(
		[
			"Help the user connect with a LegalZoom attorney using the LegalZoom MCP tools.",
			"",
			"First verify the relevant LegalZoom account and attorney-consultation access through MCP tools. If the tool call fails or access cannot be verified, stop and explain the issue without guessing.",
			"",
			"Collect the minimum context an attorney needs: the user's specific questions, applicable state or jurisdiction, phone number for a scheduled call, and any documents or AI analysis that should be summarized for the attorney.",
			"",
			"Before sending user-provided matter details, phone numbers, document text, uploaded-file content, or AI summaries to LegalZoom MCP tools, tell the user what will be shared and get explicit confirmation.",
			"",
			"Use LegalZoom MCP tools to find consultation topics, validate location, retrieve attorney availability, and book only after the user selects a real available slot. Present attorney names and status exactly as returned by LegalZoom MCP tools; only use licensed attorney language if the tool response includes that status.",
			"",
			"Do not fabricate topics, availability, attorney names, session IDs, cart actions, or confirmation details. If any MCP step fails, stop at that point, report the failure plainly, and offer alternatives such as continuing with AI-only analysis or visiting LegalZoom directly.",
			"",
			"After a successful booking, summarize what was submitted, the jurisdiction, the selected attorney and time, the returned confirmation/session identifier, and any document-upload next step from the tool response.",
		].join("\n"),
		input,
	);
}

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["mcp", "commands", "rules"],
	},

	setup(api) {
		api.registerMcpServer({
			name: "legalzoom",
			transport: {
				type: "streamableHttp",
				url: "https://www.legalzoom.com/mcp/claude/v1",
			},
			metadata: {
				description:
					"LegalZoom MCP tools for attorney consultation and legal-service workflows.",
			},
		});

		api.registerRule({
			id: `${PLUGIN_NAME}:legal-service-boundary`,
			source: PLUGIN_NAME,
			content: LEGALZOOM_RULE,
		});

		api.registerCommand({
			name: "review-contract",
			description:
				"Run an AI-only contract review with risk findings and attorney-review recommendations.",
			handler: (input) => ({ submitPrompt: reviewContractPrompt(input) }),
		});

		api.registerCommand({
			name: "attorney-assist",
			description:
				"Use LegalZoom MCP tools to help connect the user with an attorney consultation.",
			handler: (input) => ({ submitPrompt: attorneyAssistPrompt(input) }),
		});
	},
};

export { plugin };
export default plugin;
