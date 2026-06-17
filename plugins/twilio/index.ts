import type { AgentPlugin } from "@cline/sdk"

const twilioSafetyRule = [
	"Twilio and SendGrid workflows can send messages and email, place calls, verify users, change account configuration, handle personal data, and affect production traffic.",
	"Do not send SMS, WhatsApp, RCS, MMS, email, voice calls, OTPs, webhooks, or production traffic, change compliance or registration settings, buy or release numbers, rotate credentials, mutate account resources, or delete customer data without explicit user approval.",
	"Treat TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, Twilio API keys and secrets, SENDGRID_API_KEY, phone numbers, email addresses, message bodies, recordings, transcripts, verification codes, webhook payloads, and customer data as sensitive.",
	"Before implementing messaging, voice, email, or verification workflows, confirm consent, destination, region, environment, sender identity, expected cost, and applicable regulatory or compliance requirements.",
].join("\n")

const plugin: AgentPlugin = {
	name: "twilio",
	manifest: {
		capabilities: ["mcp", "skills", "rules"],
	},
	setup(api) {
		api.registerMcpServer({
			name: "twilio-docs",
			transport: {
				type: "streamableHttp",
				url: "https://mcp.twilio.com/docs",
			},
		})

		api.registerRule({
			id: "twilio-safety",
			source: "twilio",
			content: twilioSafetyRule,
		})
	},
}

export default plugin
