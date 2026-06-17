# sonarqube

SonarQube integration for Cline code quality, security, coverage, duplication, dependency risk, and quality gate workflows.

## What It Adds

This plugin registers the local SonarQube MCP server through the SonarQube CLI and bundles workflow skills for common SonarQube tasks. Installing or enabling the plugin may start the MCP server immediately; `/sonar-integrate` is the explicit setup and verification workflow for CLI auth, project context, and troubleshooting. It also adds slash commands for setup, listing projects and issues, fixing findings, checking quality gates, analyzing files, coverage, duplication, and dependency risks.

The source integration includes host-specific startup hooks for status reporting. This Cline plugin intentionally does not run those hooks at startup; status checks are explicit through `/sonar-integrate`.

## Install

```bash
cline plugin install sonarqube
```

For local development:

```bash
cline plugin install ./plugins/sonarqube --cwd .
```

## Cline Primitives

- MCP: `sonarqube` starts `sonar run mcp` through the local SonarQube CLI.
- Skills: SonarQube setup, project discovery, issue search, issue fixing, quality gate, analysis, coverage, duplication, and dependency-risk workflows.
- Commands: `/sonar-integrate`, `/sonar-list-projects`, `/sonar-list-issues`, `/sonar-fix-issue`, `/sonar-quality-gate`, `/sonar-analyze`, `/sonar-coverage`, `/sonar-duplication`, and `/sonar-dependency-risks`.
- Rules: safety guidance for authentication, external analysis, code upload, source changes, and untrusted SonarQube output.

## Requirements

- SonarQube CLI (`sonar`) installed and available on `PATH`.
- A SonarQube Cloud, SonarQube Server, or Community Build account.
- `sonar auth login` completed for the target SonarQube instance.
- A container runtime supported by the SonarQube MCP server when `sonar run mcp` needs one.
- Project configuration such as `sonar-project.properties` or a known project key for project-specific workflows.
- The MCP server runs with the cwd of the workspace used when installing or enabling the plugin. Install or re-enable it from the workspace you want SonarQube to inspect.

## Trust Boundaries

SonarQube analysis can inspect source code, upload code or metadata depending on the workflow, and return security-sensitive findings. Review commands before running installs, authentication, project configuration changes, uploads, or code modifications.

## License Notes

The SonarQube workflow skill files in `skills/**` contain SonarSource-distributed material under the Sonar Source-Available License v1.0. See `LICENSE.sonarqube`. The Cline plugin wrapper files remain under this collection's normal license unless otherwise noted.
