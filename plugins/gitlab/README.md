# gitlab

Adds the GitLab.com MCP server to Cline.

## What It Does

Registers a `gitlab` MCP server at `https://gitlab.com/api/v4/mcp`. The GitLab.com MCP server helps Cline work with repositories, issues, merge requests, CI/CD pipelines, wikis, and other GitLab.com DevOps workflows available to the authenticated GitLab.com account.

## Install

```bash
cline plugin install gitlab
```

For local development from this repository:

```bash
cline plugin install ./plugins/gitlab --cwd .
```

## Example Usage

After installation and any required GitLab authorization, ask Cline:

```text
Use GitLab to summarize the open merge requests for this project and highlight failed pipelines.
```

Cline can use the registered GitLab MCP server when it is available in the MCP runtime.

## Requirements

- Network access to `https://gitlab.com/api/v4/mcp`.
- A GitLab.com account with access to the projects, issues, merge requests, pipelines, and wiki pages you want Cline to inspect or update.
- OAuth authorization through Cline's MCP auth flow when required by the GitLab MCP server.
- No existing manual MCP server named `gitlab`. If one already exists, Cline leaves the manual entry alone and the plugin does not replace it.
- This plugin targets GitLab.com. For self-managed GitLab instances, configure that instance's MCP endpoint manually.

## Security Notes

GitLab MCP tools can read or change repository, issue, merge request, pipeline, and wiki data depending on your account permissions and selected tool call. Review requested actions before allowing changes to source code, CI/CD settings, issues, merge requests, or other GitLab resources.
