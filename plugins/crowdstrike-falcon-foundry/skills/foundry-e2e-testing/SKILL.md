---
name: foundry-e2e-testing
description: Add and maintain Playwright end-to-end tests for Falcon Foundry apps using Foundry test helpers, page objects, fixtures, app install setup, and CI-safe credentials.
when_to_use: "Use when the user asks for e2e tests, Playwright tests, app install tests, browser automation tests, CI test setup, or end-to-end coverage for a Falcon Foundry app."
---

# Foundry E2E Testing

End-to-end tests are opt-in. Do not add browser tests to every Foundry app unless the user asks or the risk justifies it.

## Test setup

- Put tests under `e2e/`.
- Use Playwright and Foundry test helpers when available.
- Keep `.env.sample` as a committed template and keep real `.env` files gitignored.
- Use GitHub Actions secrets or the user's secret store for CI credentials.
- Do not print passwords, TOTP secrets, session cookies, screenshots with customer data, or downloaded evidence in chat.

## Writing tests

- Cover the critical install, navigation, configuration, and app-specific workflows.
- Prefer stable selectors and page objects over brittle text or CSS selectors.
- For configuration screens, model the wizard explicitly.
- Keep tests deterministic and avoid relying on live customer data unless the user provides a safe test tenant.

## Running tests

- Ask before running browser tests that log into Falcon, mutate app state, incur usage, or require TOTP.
- Do not run long interactive tests just to prove the plugin exists.
- If a browser test fails, preserve traces or screenshots only if they do not contain sensitive information.

## CI

- Separate app install setup from test execution where possible.
- Use least-privilege test accounts.
- Keep credentials in CI secrets, not repo files.
- Document required env vars in `.env.sample` without real values.
