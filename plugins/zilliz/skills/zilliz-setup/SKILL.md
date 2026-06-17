---
name: zilliz-setup
description: Use when the user needs to install zilliz-cli, log in to Zilliz Cloud, configure credentials, or set the active cluster context. Also use when any other skill reports a missing prerequisite.
---

## Cline Compatibility

Use Cline command and file tools for this workflow. Ask before installing or upgrading `zilliz-cli`, running authentication commands, changing shell profiles, writing credentials, or performing mutating or cost-affecting Zilliz operations. Never ask the user to paste API keys into chat; have them authenticate in their own terminal or environment.

## Prerequisites
Before running any zilliz-cli command, verify the following in order:
1. CLI installed? Run `zilliz --version` first. If it is missing or the user explicitly wants an upgrade, show the installer command, explain that it downloads and runs a remote shell script, and ask for approval before running it.
2. Logged in? Run `zilliz auth status`. If not logged in, guide through login (see below).
3. Context set? (Only for data-plane operations) Run `zilliz context current`. If no context, guide through context setup.
## Commands Reference
### Install / Upgrade CLI
Only run this after the user explicitly approves the remote installer:

```bash
curl -fsSL https://raw.githubusercontent.com/zilliztech/zilliz-cli/master/install.sh | bash
```
Verify installation:
```bash
zilliz --version
```
### Authentication
IMPORTANT: Login commands (`zilliz login`, `zilliz configure`) require an interactive terminal and CANNOT run inside Cline. Always instruct the user to run these in their own terminal.
Check if already logged in:
```bash
zilliz auth status
```
If not logged in, tell the user to open their own terminal and run one of the following:
Option 1: Browser-based login (OAuth) -- full feature access
```
zilliz login
```
- Opens a browser for authentication
- Retrieves user info, organization data, and API keys
- Use `--no-browser` in headless environments (displays a URL to visit manually)
Option 2a: API Key via login command
```
zilliz login --api-key
```
Option 2b: API Key via configure (legacy)
```
zilliz configure
```
- Prompts for an API key (found in Zilliz Cloud console under API Keys)
- Limitations compared to OAuth login:
  - Organization switching not available
  - On Serverless clusters: database management, user/role management may be restricted
  - Some control-plane operations may require OAuth login
Option 3: Environment variable
User can add to their shell profile (`.zshrc` / `.bashrc`):
```
export ZILLIZ_API_KEY=<your-api-key>
```
After the user completes authentication, verify by running:
```bash
zilliz auth status
```
### Configure Subcommands
These commands read or mutate persistent local credentials and CLI configuration. Show the exact action first and ask for explicit approval before running anything except `zilliz configure list` or `zilliz configure get <key>`.

```bash
zilliz configure              # Interactive API key setup
zilliz configure list          # Show all config values
zilliz configure set <key> <value>  # Set a config value
zilliz configure get <key>     # Get a config value
zilliz configure clear         # Clear all credentials
```
### Switch Organization
These commands require an interactive terminal. Instruct the user to run in their own terminal:
```
# Interactive selection
zilliz auth switch
# Direct switch by org ID
zilliz auth switch <org-id>
```
### Logout
Ask for explicit approval before logging out because this changes the user's persistent auth state.

```bash
zilliz logout
```
### Set Cluster Context
Data-plane commands (collection, vector, index, etc.) require an active cluster context.
Context changes are persistent. Confirm the target cluster/database and ask for explicit approval before running `zilliz context set`.

```bash
# Set by cluster ID (endpoint auto-resolved)
zilliz context set --cluster-id <cluster-id>
# Set with explicit endpoint
zilliz context set --cluster-id <cluster-id> --endpoint <url>
# Change database (default: "default")
zilliz context set --database <db-name>
```
### View Current Context
```bash
zilliz context current
```
## Output Format
All zilliz-cli commands support `--output json` for structured, machine-readable output. Use this when you need to parse results programmatically:
```bash
zilliz cluster list --output json
zilliz collection describe --name <name> --output json
```
Available formats: `json`, `table`, `text`. Default is `text`.
## Cluster Type Differences
Different cluster types have different feature support:
| Feature | Free | Serverless | Dedicated |
|---|---|---|---|
| Collection CRUD | Yes | Yes | Yes |
| Vector search/query | Yes | Yes | Yes |
| Database create/drop | No | No | Yes |
| User/role management | No | Limited | Yes |
| Backup management | No | Yes | Yes |
| Cluster modify | No | No | Yes |
When a command fails with a permissions error, check the cluster type first -- the feature may not be available on that cluster type.
## Troubleshooting
- "command not found" after install: Check that the install directory (e.g., `~/.local/bin`) is in your PATH. If the user wants to install or upgrade, show the installer command and ask before running it.
- "not authenticated" errors: Run `zilliz auth status` to check login state. Tokens may have expired -- re-run login in your own terminal.
- Context errors (no cluster set): Run `zilliz context current` to verify. If the cluster was deleted or suspended, set a new context with `zilliz context set --cluster-id <id>`.
- Permission or "not supported" errors: Check the cluster type -- some operations are only available on Dedicated clusters (see Cluster Type Differences table above).
- Network or timeout errors: Verify the cluster is RUNNING with `zilliz cluster describe --cluster-id <id>`. Suspended clusters reject data-plane requests.
## Guidance
- Always check prerequisites before executing any command.
- If a prerequisite fails, fix it before proceeding -- do not skip ahead.
- NEVER run `zilliz login`, `zilliz configure`, or `zilliz auth switch` (without arguments) inside Cline -- they require interactive input. Always instruct the user to run these in their own terminal.
- NEVER ask the user to paste API keys into the chat -- this is a security risk. Guide them to configure credentials in their own terminal instead.
- After the user reports login is complete, verify with `zilliz auth status`.
- After setting context, verify with `zilliz context current`.
- For data-plane commands in other skills, always verify context is set first.
- When a command fails unexpectedly, consider whether the cluster type or auth mode may be the cause.
