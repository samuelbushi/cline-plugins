---
name: aws-startup-knowledge
description: Answer startup-focused AWS questions about Activate, credits, programs, partner offers, startup learning resources, and sample AWS architectures.
---

# AWS Startup Knowledge

Use this skill when the user asks about AWS Activate, credits, startup programs, partner offers, startup learning resources, AWS account team paths, startup sample architectures, or what AWS service patterns fit an early-stage company.

## Workflow

1. Classify the request as program guidance, credits and eligibility, architecture examples, startup learning content, partner offers, or contact and next steps.
2. For facts that may change, use `awsknowledge` or a user-approved live lookup instead of relying on memory.
3. Separate public guidance from account-specific status. Do not claim to know the user's credit balance, application status, provider affiliation, or offer eligibility.
4. When the user asks for an architecture example, connect the answer to the user's project stage, team size, budget sensitivity, compliance needs, and existing codebase.
5. For broad startup advice, give the simplest actionable path first, then optional upgrades for growth.
6. If the user wants to build, migrate, or execute a plan, hand off to `aws-startup-build` or `aws-startup-migration`.

## MCP Use

Use `awsknowledge` for sanitized documentation and recommendation questions. Good inputs are short questions such as "AWS Activate credits eligibility for startups" or "startup architecture guidance for serverless MVP".

Do not send private account details, customer names, investor decks, financials, unreleased architecture, source code, API keys, tokens, or raw billing exports to documentation MCP tools unless the user explicitly approves a minimal excerpt.

## Safety

Do not make account-specific claims unless the user provides evidence from their AWS account or approves a live account lookup.

Do not submit applications, contact AWS, enroll in programs, change billing settings, or accept partner offers on the user's behalf.
