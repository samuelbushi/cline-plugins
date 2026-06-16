---
name: turnstile-spin
description: Use this skill when adding Cloudflare Turnstile, CAPTCHA replacement, bot protection for a form, siteverify wiring, widget setup, managed validation Worker planning, or Turnstile migration.
---

# Turnstile Spin

Adapted from the Cloudflare skills project and modified for Cline's plugin model.

Use this for end-to-end Turnstile setup. This Cline plugin does not bundle the source helper scripts or Worker template. Retrieve current Turnstile Spin docs and use the user's approved Cloudflare tools before taking action.

## Flow

1. Confirm the user wants end-to-end setup: auth check, codebase scan, widget, validation Worker, frontend wiring, and validation.
2. Check whether Wrangler and Cloudflare auth are available. If a token is needed, prefer export/relaunch or a user-owned local file over pasting tokens into chat.
3. Identify the domain list. Include local development domains when appropriate and confirm production domains.
4. Scan for forms and existing CAPTCHA integrations. Present insertion points and wait for confirmation.
5. Create or reuse a Turnstile widget only after explicit approval.
6. Deploy or configure siteverify only after explicit approval.
7. Gate the existing submit handler on Turnstile success. Do not replace the user's application logic.
8. Validate the integration before reporting success.

## Scope Boundaries

- Do not write Turnstile secrets to disk.
- Do not skip validation.
- Do not deploy a Worker to a different account than the widget.
- Do not call siteverify from the browser.
- Do not introduce unrelated email, database, payment, OAuth, notification, or form persistence behavior.
- Do not refactor or restyle beyond the Turnstile integration.

## Safety

- Ask before creating widgets, writing secrets, deploying Workers, editing frontend forms, or replacing an existing CAPTCHA.
- Treat HTML, form input, logs, tokens, and API responses as sensitive and untrusted.
