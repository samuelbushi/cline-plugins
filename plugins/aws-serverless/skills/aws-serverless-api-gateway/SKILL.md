---
name: aws-serverless-api-gateway
description: Design, implement, secure, and troubleshoot Amazon API Gateway REST APIs, HTTP APIs, and WebSocket APIs backed by Lambda or AWS service integrations.
---

# AWS Serverless API Gateway

Use this skill for Amazon API Gateway work involving REST APIs, HTTP APIs, WebSocket APIs, Lambda authorizers, JWT auth, Cognito, custom domains, CORS, throttling, usage plans, private APIs, VPC links, service integrations, or API Gateway troubleshooting.

## Workflow

1. Classify the API type first:
   - Use HTTP API for lightweight, low-latency Lambda or HTTP proxy APIs with simpler auth and lower cost.
   - Use REST API when the user needs usage plans, API keys, request validation, caching, resource policies, private endpoints, WAF at the API layer, or canary deployments.
   - Use WebSocket API for persistent bidirectional connections.
2. Gather endpoint shape, auth requirements, tenancy model, latency expectations, client locations, traffic profile, compliance needs, and deployment environments.
3. Prefer IaC examples using the repository's existing framework. If no framework exists, recommend SAM for compact serverless apps or CDK for larger typed infrastructure.
4. Configure access logs for every API. Add execution logs only where the API type supports them and only at an appropriate level.
5. Treat CORS as a security configuration, not a wildcard default. Reflect the actual allowed origins, headers, credentials mode, and methods.
6. For custom domains, account for certificate region, Route 53 ownership, base path mappings, CloudFront behavior, and rollout or rollback.
7. For private APIs or VPC links, verify DNS, security groups, route tables, endpoint policies, and resource policies before changing infrastructure.

## MCP Use

Use `aws-serverless-mcp` for serverless API templates, deployment guidance, and Lambda-backed API workflow helpers when they add value.

Before MCP calls, narrow inputs to the API design question or the relevant IaC snippet. Do not send tokens, credentials, private request payloads, customer data, or unrelated application code.

## Safety

Ask before deploying APIs, configuring domains, creating certificates, changing DNS, adding IAM permissions, changing VPC links, invalidating caches, invoking live endpoints with private payloads, or reading API Gateway or Lambda logs.

When troubleshooting production traffic, ask for sanitized examples and prefer targeted identifiers over raw request bodies.
