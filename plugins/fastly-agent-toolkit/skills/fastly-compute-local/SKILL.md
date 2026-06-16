---
name: fastly-compute-local
description: Use for local Fastly Compute development and testing with `fastly compute serve`, Viceroy, or Fastlike. Covers WASM builds, local backends, `fastly.toml`, stores, dictionaries, secrets, profiling, Rust tests, and safe local simulation before deploy.
---

# Fastly Compute Local

Use this skill when developing or testing Fastly Compute applications locally. Prefer local checks before deploy.

## Choose The Runtime

- Use `fastly compute serve` for the standard Fastly CLI local workflow.
- Use Viceroy directly when the project needs explicit control over the local runtime, Rust tests, Component Model adaptation, or `fastly.toml` debugging.
- Use Fastlike when the user wants a Go-based local runtime, deeper Compute ABI inspection, hot reload, custom geolocation data, or profiling support.

## Standard Flow

```bash
fastly compute build
fastly compute serve
```

For Viceroy:

```bash
cargo install --locked viceroy
fastly compute build
viceroy -C fastly.toml bin/main.wasm
```

For Fastlike:

```bash
go install fastlike.dev/cmd/fastlike@latest
fastlike -backend localhost:8000 bin/main.wasm
```

Only install missing tools after the user agrees.

## Local Configuration

- Confirm every backend the app calls is declared for local runtime.
- Prefer local or staging backends during development. Avoid proxying local tests to production origins unless the user explicitly asks and understands the traffic implications.
- For Viceroy, backends and stores belong under `[local_server]` in `fastly.toml`.
- Dictionaries, config stores, secret stores, KV stores, ACLs, and geolocation test data should use local files or fixtures.
- Default ports differ. Viceroy commonly serves on `127.0.0.1:7676`; Fastlike defaults to a local bind address that can be configured.

## Safety

- Build and serve locally before `fastly compute deploy`.
- Ask before deploying.
- Do not print secret store values or API tokens.
- Treat profiler UIs as sensitive if they expose headers, bodies, backend calls, or heap data. Bind to loopback or require auth.

## Debug Checklist

- Does the project build a WASM output where the runtime expects it?
- Does `fastly.toml` include the right package metadata, local backends, and store definitions?
- Are backend names in code identical to configured backend names?
- Are tests using local fixture data instead of production traffic?
- Are runtime errors from missing backends, missing stores, invalid WASM, or unsupported host calls?
- Is the deploy target service and environment explicit?
