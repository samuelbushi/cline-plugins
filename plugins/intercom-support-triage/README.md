# intercom-support-triage

Status: internal example
Source: Cline internal examples

Fetches Intercom support conversations and posts triage summaries to Slack.

## What It Does

Registers `fetch_intercom_conversations` and `post_slack_summary`. The intended workflow is to fetch recent Intercom conversations, classify them, then post grouped Slack blocks with links back to Intercom.

## Install

```bash
cline plugin install intercom-support-triage
```

For local development from this repository:

```bash
cline plugin install ./plugins/intercom-support-triage --cwd .
```

## Requirements

- `INTERCOM_API_TOKEN`
- `SLACK_BOT_TOKEN`
- `SLACK_CHANNEL`, unless each tool call provides a channel override.

## Security Notes

This plugin reads support content from Intercom and posts summaries to Slack. Only enable it in workspaces authorized for customer support data.

