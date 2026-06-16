import type { AgentPlugin } from "@cline/sdk"

const rule = [
	"Postiz operations can publish, schedule, edit, delete, or analyze content across connected social accounts.",
	"When using Postiz, verify authentication before API work, keep API keys and OAuth credentials out of chat and commits, and ask before persisting any credential.",
	"Ask before running `postiz auth:login` because the device flow stores OAuth credentials in the user's home directory.",
	"Ask for explicit user confirmation before creating scheduled posts, promoting drafts to scheduled posts, deleting posts, changing post status, connecting missing platform content, or uploading user media.",
	"Never pass a raw local file path or arbitrary external URL as post media. Upload media with the user's Postiz CLI first and use the returned Postiz media URL/path.",
	"Treat integration IDs, group IDs, platform settings, analytics exports, and post content as user data. Avoid broad exports or account-wide changes unless the user asked for that scope.",
].join("\n")

const plugin: AgentPlugin = {
	name: "postiz",
	manifest: {
		capabilities: ["skills", "rules"],
	},
	setup(api) {
		api.registerRule({
			id: "postiz-safety",
			source: "postiz",
			content: rule,
		})
	},
}

export default plugin
