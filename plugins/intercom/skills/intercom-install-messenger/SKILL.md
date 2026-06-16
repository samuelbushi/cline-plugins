---
name: intercom-install-messenger
description: Add the Intercom Messenger to a website or app with secure JWT identity verification. Use when the user asks to install Intercom chat, add the Intercom Messenger, or integrate Intercom into a frontend.
---

# Intercom Messenger Installation

Install the Messenger with server-signed identity verification by default. Only provide an insecure no-JWT installation if the user explicitly asks for it and acknowledges the impersonation risk.

## Required Inputs

Gather:

- Intercom workspace ID, also called app ID.
- Identity Verification Secret for authenticated users.
- Frontend framework and backend stack.
- Whether the workspace is US, EU, or Australia hosted, so you can set `api_base`.

Do not put the Identity Verification Secret in frontend code or commit it. Store it as a server-side environment variable such as `INTERCOM_IDENTITY_SECRET`.

## Secure Architecture

Use two parts:

1. Backend endpoint returns a short-lived JWT for the authenticated user.
2. Frontend fetches that JWT and boots Messenger with `intercom_user_jwt`.

Required JWT claims:

- `user_id`: stable unique user ID, required.
- `email`: recommended.
- `name`: recommended.
- `exp`: recommended, short lived such as two hours.

For Node/Express:

```js
import jwt from "jsonwebtoken"

app.get("/api/intercom-jwt", requireAuth, (req, res) => {
  const token = jwt.sign(
    {
      user_id: String(req.user.id),
      email: req.user.email,
      name: req.user.name,
      exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
    },
    process.env.INTERCOM_IDENTITY_SECRET,
    { algorithm: "HS256" },
  )
  res.json({ token })
})
```

Adapt this pattern to the user's backend. The endpoint must require authentication.

## Frontend Boot

Load the Messenger script for the workspace ID, then boot:

```js
const { token } = await fetch("/api/intercom-jwt", {
  credentials: "include",
}).then((response) => response.json())

window.Intercom("boot", {
  app_id: "WORKSPACE_ID",
  api_base: "https://api-iam.intercom.io",
  intercom_user_jwt: token,
})
```

For anonymous pages, boot with `app_id` and `api_base`.

On logout, call `Intercom("shutdown")` before clearing the app session so Messenger data does not leak between users.

For single-page apps, call `Intercom("update")` after route changes.

## Region

Add the corresponding Messenger API base to every boot call:

```js
api_base: "https://api-iam.intercom.io"
api_base: "https://api-iam.eu.intercom.io"
api_base: "https://api-iam.au.intercom.io"
```

Use only one, matching the workspace.

## Verification

After implementation:

- Confirm the Messenger script loads with the right workspace ID.
- Confirm the JWT endpoint returns HTTP 200 for an authenticated user.
- Log in as a test user, open the Messenger, and send a test message.
- In Intercom, confirm the conversation is attributed to the correct user.
- Enable and enforce identity verification in Intercom once the signed flow works.
