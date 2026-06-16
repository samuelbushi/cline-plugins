# agentforce-adlc

Agentforce Agent Development Life Cycle skills for Cline users building, testing, securing, and observing Salesforce Agentforce agents.

## What It Adds

This plugin bundles four detailed skills for working with Salesforce Agentforce agents:

- `developing-agentforce`: design, author, validate, preview, deploy, publish, and activate Agent Script authoring bundles.
- `testing-agentforce`: create preview checks, structured test suites, and CI-oriented regression coverage.
- `securing-agentforce`: run authorized OWASP LLM Top 10-style red-team assessments using bundled payloads and runner scripts.
- `observing-agentforce`: inspect session traces, Data Cloud session records, preview reproductions, and bundled STDM Apex helpers to improve agent behavior.

The plugin does not install hooks or run Salesforce commands by itself. It gives Cline workflow guidance, bundled Agent Script examples, reference docs, Python helper scripts, and guardrails for using the local Salesforce CLI in projects where Agentforce work is already configured.

It also registers a Cline rule that treats org data, traces, retrieved metadata, test payloads, generated code, and helper output as untrusted, and requires explicit approval before live org access, metadata deployment, publish/activate, security probes, or bundled helper script execution.

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
Use the developing-agentforce skill to design a service agent for order status questions.
```

```text
Use the testing-agentforce skill to build a preview smoke test plan for the CaseTriage authoring bundle.
```

## Requirements

- Salesforce CLI `sf` with Agentforce commands available.
- Python 3.9+ for bundled helper scripts; the security runner also needs `pyyaml`.
- An authenticated Salesforce org and an explicit target org alias.
- Agentforce, Agent Script, and metadata permissions appropriate for the requested task.
- User approval before running org reads, publishing, activating, deploying metadata, copying bundled Apex helpers, running live security probes, using live actions, or making production-affecting changes.

## Security Notes

These skills can guide Cline toward commands that read org metadata, preview live agents, run test conversations, invoke REST APIs with Salesforce CLI auth, deploy Salesforce metadata, and copy bundled support code into a project. Review the command plan before allowing shell execution, and use sandbox or development orgs unless production access is explicitly intended.

Bundled Agentforce ADLC material is licensed separately; see `LICENSE.agentforce-adlc`.
