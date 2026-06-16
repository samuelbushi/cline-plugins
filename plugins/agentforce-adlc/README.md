# agentforce-adlc

Agentforce Agent Development Life Cycle skills for Cline.

## What It Adds

This plugin bundles four skills for working with Salesforce Agentforce agents:

- `agentforce-develop`: design, author, validate, preview, deploy, publish, and activate Agent Script authoring bundles.
- `agentforce-test`: create preview checks, structured test suites, and CI-oriented regression coverage.
- `agentforce-secure`: plan authorized OWASP-style red-team checks for live Agentforce agents.
- `agentforce-observe`: inspect session traces, Data Cloud session records, and preview reproductions to improve agent behavior.

The plugin does not install hooks or run Salesforce commands by itself. It gives Cline workflow guidance and guardrails for using the local Salesforce CLI in projects where Agentforce work is already configured.

## Install

```bash
cline plugin install agentforce-adlc
cline config skills
```

For local development from this repository:

```bash
cline plugin install ./plugins/agentforce-adlc --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Use the agentforce-develop skill to design a service agent for order status questions.
```

```text
Use the agentforce-test skill to build a preview smoke test plan for the CaseTriage authoring bundle.
```

## Requirements

- Salesforce CLI `sf` with Agentforce commands available.
- An authenticated Salesforce org and an explicit target org alias.
- Agentforce, Agent Script, and metadata permissions appropriate for the requested task.
- User approval before publishing, activating, running live security probes, or making production-affecting changes.

## Security Notes

These skills can guide Cline toward commands that read org metadata, preview live agents, run test conversations, and deploy Salesforce metadata. Review the command plan before allowing shell execution, and use sandbox or development orgs unless production access is explicitly intended.
