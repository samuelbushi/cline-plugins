---
name: aws-amplify-workflow
description: Plan and implement AWS Amplify Gen 2 full-stack app workflows, including auth, data, storage, functions, APIs, AI features, frontend integration, sandbox validation, and deployment. Use for Amplify Gen 2 projects or when the user mentions amplify, ampx, defineBackend, defineAuth, defineData, defineStorage, amplify_outputs, Cognito, AppSync, DynamoDB, S3, or Amplify Hosting.
---

# AWS Amplify Workflow

Use this skill for AWS Amplify Gen 2 work. Do not use it for Amplify Gen 1 CLI projects, standalone CDK or SAM stacks, or direct Bedrock work without Amplify AI features.

## Operating Rules

- Ask before installing packages, scaffolding projects, editing infrastructure files, running `npx ampx`, deploying, setting secrets, creating IAM roles, or invoking AWS APIs.
- Use the `aws-mcp` server when available for current Amplify and AWS guidance instead of guessing.
- Keep credentials, tokens, secret values, and `amplify_outputs.json` out of commits and chat.
- Prefer the existing project framework and package manager. Default to TypeScript for Gen 2 backend code.
- If the user only wants backend work, do not add frontend integration unless asked.

## Phase 1: Identify Project Shape

1. Inspect for Gen 2 signals before changing files:

   ```sh
   find . -maxdepth 4 \( -path "*/amplify/backend.ts" -o -name "amplify_outputs.json" -o -name "package.json" \) -print
   ```

2. If `amplify/.config/` exists without `amplify/backend.ts`, treat it as Gen 1 and stop with a migration recommendation.
3. Identify framework and runtime:
   - React, Next.js, Vue, Angular, React Native, Flutter, Swift, or Android.
   - App Router or Pages Router for Next.js.
   - Expo or bare React Native for React Native.
4. If the user says "build an app" without web or mobile context, ask which target they want. For unspecified web apps, React with Vite is a reasonable default after saying so.

## Phase 2: Plan Backend Work

Route to the requested feature set:

- Auth: Cognito sign-in, MFA, social login, SAML or OIDC, passwordless flows, and user attributes.
- Data: AppSync and DynamoDB models, relationships, indexes, authorization rules, subscriptions, and server-side access.
- Storage: S3 buckets, public, protected, and private paths, access rules, upload and download flows.
- Functions and APIs: Lambda functions, custom resolvers, scheduled functions, HTTP APIs, environment variables, and secrets.
- AI: Amplify AI Kit conversation or generation routes through Bedrock.
- Advanced: custom CDK resources, geo, PubSub, or custom outputs.

Before implementation, summarize the files to change and commands to run. Wait for approval before mutating files or account state.

## Phase 3: Apply Changes

- Backend resources live under `amplify/` and are composed from `amplify/backend.ts` with `defineBackend`.
- Generated outputs belong in `amplify_outputs.json`. Treat it as generated local or CI output, not source to hand-edit.
- Use Amplify Gen 2 packages and APIs rather than Gen 1 CLI patterns.
- For auth, ask which login method the user wants. Do not assume.
- For data auth, make unauthenticated or broad access explicit and call out the risk.
- For storage, verify path rules and access subjects carefully before writing code.
- For functions, use `secret()` for sensitive values and avoid plain text environment secrets.

## Phase 4: Frontend Integration

- Configure Amplify in the correct app entry point for the framework.
- Use `aws-amplify/auth`, `aws-amplify/data`, and `aws-amplify/storage` modular imports.
- For Next.js server-side access, prefer the Amplify Next.js adapter rather than browser clients on the server.
- For UI components, include the required Amplify UI CSS imports.
- Clean up subscriptions and long-running upload or download tasks.

## Phase 5: Sandbox And Deployment

- Ask before running sandbox or deployment commands.
- In agent or CI environments, prefer one-shot commands over watch mode.
- Confirm AWS profile, region, app id, branch, and expected resource changes before deployment.
- Use ephemeral CI credentials where possible. Do not create or store long-lived access keys.
- If deployment fails, collect the exact error and relevant config before retrying.

## Good Output

Return a phase-based plan, then a concise change summary. Call out any AWS account actions, generated files, credentials, costs, or security tradeoffs before asking to run commands.
