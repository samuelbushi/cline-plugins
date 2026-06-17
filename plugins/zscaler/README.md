# Zscaler

Zscaler connects Cline to the Zscaler Zero Trust Exchange for security operations, access policy review, tenant troubleshooting, application onboarding, digital experience analysis, attack surface review, and microsegmentation posture workflows.

## Cline Primitives

- MCP: registers the pinned `zscaler-mcp@0.12.7` stdio server through `uvx`. The server exposes Zscaler tools for ZPA, ZIA, ZDX, ZCC, EASM, Z-Insights, ZMS, ZID, and related Zero Trust Exchange services.
- Skills: bundles 42 Zscaler workflow skills across private access, internet access, digital experience, client connector, external attack surface, analytics, and microsegmentation operations.
- Commands: adds `/zscaler-*` slash commands for the most common workflows, including user troubleshooting, app/location onboarding, SSL audits, URL access checks, attack surface review, incident investigation, ZDX health reports, and ZPA policy/resource creation flows.
- Rules: `zscaler:safety` keeps read operations scoped, treats MCP output as untrusted, explains service/tool conventions, and approval-gates write tools, activation, deep traces, OTP retrieval, report file writes, and destructive actions.

## Requirements

- `uvx` must be available on PATH so Cline can start `zscaler-mcp@0.12.7`.
- Zscaler OneAPI credentials must be available to the Cline process: `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET`, `ZSCALER_CUSTOMER_ID`, and `ZSCALER_VANITY_DOMAIN`.
- By default, the Zscaler MCP server is read-only. To enable write tools, start Cline with `ZSCALER_MCP_WRITE_ENABLED=true` and an explicit `ZSCALER_MCP_WRITE_TOOLS` allowlist such as `zpa_create_*,zia_create_url_filtering_rule`.

The plugin does not run the MCP server, connect to Zscaler, mutate tenant configuration, generate OTPs, activate ZIA changes, start diagnostics, or write report files during installation.

## Install

```bash
cline plugin install zscaler
```

For local development from this repository:

```bash
cline plugin install ./plugins/zscaler --cwd .
```

## Examples

```text
/zscaler-troubleshoot-user alice@example.com cannot access payroll.example.com
/zscaler-check-access Finance group youtube.com
/zscaler-audit-ssl show SSL bypass exceptions for AI tools
/zscaler-review-attack-surface focus critical findings
/zscaler-onboard-app payroll.internal.example.com:443 for Finance users
```

## Safety

Zscaler tools can expose security posture, user/device data, policy configuration, incident context, and administrative actions. Keep searches scoped, list/get current state before changes, ask before broad tenant scans or report file writes, and require explicit approval before create, update, delete, activation, OTP, deep trace, or other tenant-impacting operations.
