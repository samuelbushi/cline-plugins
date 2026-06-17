# slack

Slack workspace integration for searching messages, reading channel context, drafting communications, and creating channel summaries through Cline.

## What It Adds

This plugin registers the Slack remote MCP server and bundles skills for Slack search and Slack message composition. It also adds slash commands for common Slack workflows: summarizing a channel, finding discussions, drafting announcements, generating standups, and creating multi-channel digests.

## Cline Primitives

- MCP: `slack` connects to Slack's remote MCP endpoint at `https://mcp.slack.com/mcp`.
- Skills: `slack-search` guides channel, message, file, user, and thread searches; `slack-messaging` guides Slack mrkdwn and message etiquette.
- Commands: `/slack-summarize-channel`, `/slack-find-discussions`, `/slack-draft-announcement`, `/slack-standup`, and `/slack-channel-digest` submit focused Slack workflow prompts.
- Rules: Slack workspace safety guidance asks before private-channel or DM searches and requires explicit approval before posting, drafting, editing, or sharing Slack content.

## Requirements

- A Slack workspace where the Slack MCP integration is approved by the workspace administrator.
- OAuth authorization for the `slack` MCP server after installation. Interactive Cline installs can prompt for MCP OAuth; non-interactive installs may require authorizing the server later from Cline's MCP/plugin configuration UI.
- Network access to Slack's MCP endpoint.

## Safety Notes

Slack can expose private workspace content and can send messages to real people. Search private channels, DMs, or group DMs only when the user asks for that scope. Review exact message/canvas text and destination with the user before creating drafts or publishing anything.

## License Notes

Bundled Slack workflow guidance includes MIT-licensed material from Slack Technologies, LLC. See `LICENSE`.
