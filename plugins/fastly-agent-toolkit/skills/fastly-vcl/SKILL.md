---
name: fastly-vcl
description: Use when writing, reviewing, linting, testing, simulating, formatting, or deploying Fastly VCL and XVCL. Covers Falco validation, XVCL compilation, VCL subroutine scope, cache behavior, redirects, headers, tables, Terraform VCL, and common Fastly VCL mistakes.
---

# Fastly VCL

Use this skill for `.vcl` and `.xvcl` work. Validate locally before proposing deployment.

## Tooling

- Use Falco to lint, format, test, and simulate Fastly VCL.
- Use XVCL when the project has `.xvcl` files or needs compile-time loops, constants, functions, includes, or reusable generated VCL.
- Compile XVCL to VCL before linting or simulation.

```bash
uvx xvcl main.xvcl -o main.vcl
falco lint -I ./vcl main.vcl
falco test -I ./vcl main.vcl
falco simulate -I ./vcl main.vcl
```

Do not treat linting as a runtime test. If the user asks to run VCL locally, use `falco simulate` and exercise it with curl.

## Deployment Safety

- Ask before uploading snippets, replacing VCL, cloning versions, or activating versions.
- Validate origin Host header and TLS SANs before changing backend or TLS fields.
- Prefer snippets or small changes over wholesale VCL replacement when the service already has custom code.
- Report the target service, version, files checked, and activation plan.

## VCL Rules To Remember

- `beresp.*` is available in `vcl_fetch`, not `vcl_deliver`.
- `resp.*` is available in `vcl_deliver`.
- Use `req.method`, not deprecated `req.request`.
- Time values need units, such as `86400s`.
- `synthetic` strings need long-string syntax: `synthetic {"text"}`.
- Fastly VCL redirects use the synthetic error pattern, not `return(redirect)`.
- Setting `beresp.ttl = 0s` still creates a zero-second cache object. Use `set beresp.cacheable = false;` to avoid caching.
- Set `Vary` in `vcl_fetch` before the object enters cache.
- Use `table` lookups for data-driven redirects or routing rather than long if/else chains.
- Prefer `subfield()` for exact cookie key parsing.

## XVCL Guidance

- XVCL directives are compile-time only. Constants do not become runtime VCL variables.
- Use `{{NAME}}` template expressions when emitting constants into VCL.
- Use `#for` loops for repeated backend, redirect, or header patterns.
- Keep generated VCL checked or inspectable so reviewers can see what will deploy.
- Always compile and validate the generated `.vcl` output before discussing activation.

## Review Checklist

- Does each subroutine use variables that are valid in that scope?
- Are cache, pass, hit, miss, and deliver paths explicit?
- Are Host, SNI, and certificate hostnames intentionally different if they differ?
- Are response headers set at the right phase for cache behavior?
- Are purges, redirects, and error status codes intentional?
- Is the change small enough to roll back quickly?
