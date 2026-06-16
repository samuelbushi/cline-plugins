---
name: apollo-router-rust-plugins
description: Build Apollo Router native Rust plugins with safe service hooks, request and response handling, configuration, telemetry, tests, and idiomatic Rust patterns.
---

# Apollo Router Rust Plugins

Use this skill when the user is writing or reviewing Apollo Router native Rust plugins.

## Workflow

1. Identify the router version, plugin crate layout, service hook target, config schema, and test harness.
2. Read existing plugin registration, config deserialization, service hooks, and telemetry before editing.
3. Keep plugin behavior narrow and explicit. Prefer configuration over hardcoded environment behavior.
4. Handle request, response, and error paths without panics.
5. Add tests for enabled and disabled config, expected request changes, error propagation, and telemetry output.
6. Keep async code cancellation-safe and avoid blocking the router runtime.

## Rust Guidance

- Use strong types for configuration and request state.
- Prefer `Result` propagation with actionable errors.
- Avoid unnecessary cloning of large request or response bodies.
- Keep shared state behind appropriate concurrency primitives.
- Instrument meaningful spans and attributes without leaking secrets.

## Guardrails

- Do not log authorization headers, cookies, tokens, or full request bodies by default.
- Do not alter all traffic globally when the requested behavior applies to one route, subgraph, or operation class.
- Do not use unsafe Rust unless the project already has a reviewed reason.
