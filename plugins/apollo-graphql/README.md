# apollo-graphql

GraphOS MCP access and Apollo GraphQL skills for building clients, servers, routers, federated schemas, connectors, operations, and AI-ready GraphQL APIs from Cline.

## What It Does

Registers the `apollo-graphos-tools` MCP server at `https://mcp.apollographql.com`. The server gives Cline access to Apollo GraphQL documentation and GraphOS graph-building tools through Streamable HTTP.

Installs a detailed Apollo GraphQL skill pack with bundled references, templates, and helper scripts:

- `apollo-client`: Apollo Client 4 workflows for React applications.
- `apollo-server`: Apollo Server 5 schema, resolver, context, auth, data source, and plugin guidance.
- `apollo-router`: Apollo Router v1/v2 configuration, operation safety, telemetry, headers, caching, traffic shaping, templates, and validation checklists.
- `apollo-federation`: federated subgraph schema design, entities, directives, and composition troubleshooting.
- `apollo-connectors`: Apollo Connectors schema patterns for integrating REST APIs into GraphQL.
- `apollo-rover`: Rover CLI workflows for schema checks, graph management, local supergraph development, and bounded schema exploration.
- `apollo-mcp-server`: Apollo MCP Server setup patterns for exposing GraphQL operations as MCP tools.
- `apollo-graphql-schema`: GraphQL schema design, pagination, naming, nullability, errors, and security.
- `apollo-graphql-operations`: GraphQL query, mutation, fragment, variable, and codegen patterns.
- `apollo-ios`: Apollo iOS setup, codegen, operations, caching, interceptors, subscriptions, and testing.
- `apollo-kotlin`: Apollo Kotlin setup, operations, normalized cache, and v4-to-v5 migration guidance.
- `apollo-router-plugin-creator`: Apollo Router native Rust plugin service hooks and plugin structure.
- `apollo-rust-best-practices`: Rust ownership, error handling, testing, generics, docs, and performance guidance for Router plugin work.
- `apollo-mobile-clients`: Cline router skill that sends mobile GraphQL tasks to `apollo-ios` or `apollo-kotlin`.
- `apollo-router-rust-plugins`: Cline router skill that combines Router plugin creation with Apollo's Rust best-practices guidance.

The plugin also adds an Apollo safety rule for GraphOS credentials, private schemas, Rover publishes/checks, Router production changes, response caching, and production GraphQL execution.

## Install

```bash
cline plugin install apollo-graphql
```

For local development from this repository:

```bash
cline plugin install ./plugins/apollo-graphql --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Review this Apollo Client query and update it for Apollo Client 4 patterns.
```

or:

```text
Design a federated GraphQL schema for these product and inventory services, then explain the composition risks.
```

## Requirements

- A Cline build with plugin MCP registration support.
- Network access to `https://mcp.apollographql.com`.
- Apollo GraphQL, GraphOS, Rover, Router, client-library, Swift, Kotlin, Rust, or Node dependencies only for workflows that use those tools in the project.
- GraphOS account access or credentials may be required for graph-specific Rover or GraphOS operations.

Because `apollo-graphos-tools` is a remote MCP server with no static headers, Cline may offer OAuth authorization during interactive installation. In non-interactive installs, run `cline mcp` after installation and authorize `apollo-graphos-tools` if the server requires authentication for the workflow you want.

## Security Notes

GraphOS MCP tools and the bundled skills can surface schema details, operation names, graph configuration, headers, auth patterns, API endpoints, telemetry conventions, and deployment topology.

Use normal workspace trust rules before enabling this plugin on private GraphQL projects. Do not paste GraphOS API keys, router shared secrets, service tokens, persisted query manifests, private schemas, or customer data into committed files.

For Apollo MCP Server work, prefer explicit operation lists, persisted queries, or other bounded tool definitions over unconstrained schema execution when exposing production APIs to agents.

This plugin does not register a GraphQL language server. Cline does not yet support importing generic LSP declarations from plugin metadata, so GraphQL language-server support should be handled by a dedicated Cline-native tool plugin later.

The MCP server is installed as plugin-owned configuration. Removing the plugin removes the `apollo-graphos-tools` entry that this plugin created.

## Attribution

Bundled Apollo GraphQL skill material is adapted from Apollo GraphQL's MIT-licensed agent skills and Rust best-practices material. See `NOTICE.apollo-graphql` and `LICENSE.apollo-graphql`.
