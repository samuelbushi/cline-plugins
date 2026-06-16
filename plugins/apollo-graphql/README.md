# apollo-graphql

GraphOS MCP access and Apollo GraphQL skills for building clients, servers, routers, federated schemas, connectors, operations, and AI-ready GraphQL APIs from Cline.

## What It Does

Registers the `apollo-graphos-tools` MCP server at `https://mcp.apollographql.com`. The server gives Cline access to Apollo GraphQL documentation and GraphOS graph-building tools through Streamable HTTP.

Installs these bundled skills:

- `apollo-client-react`: Apollo Client workflows for React applications.
- `apollo-server`: Apollo Server schema, resolver, context, auth, data source, and plugin guidance.
- `apollo-router`: Apollo Router configuration, operation safety, telemetry, headers, caching, and traffic shaping.
- `apollo-federation`: federated subgraph schema design, entities, directives, and composition troubleshooting.
- `apollo-connectors`: Apollo Connectors schema patterns for integrating REST APIs into GraphQL.
- `apollo-rover`: Rover CLI workflows for schema checks, graph management, and local supergraph development.
- `apollo-mcp-server`: Apollo MCP Server setup patterns for exposing GraphQL operations as MCP tools.
- `apollo-graphql-schema`: GraphQL schema design, pagination, naming, nullability, errors, and security.
- `apollo-graphql-operations`: GraphQL query, mutation, fragment, variable, and codegen patterns.
- `apollo-mobile-clients`: Apollo iOS and Apollo Kotlin client guidance for mobile teams.
- `apollo-router-rust-plugins`: Rust guidance for Apollo Router plugin work.

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
- Apollo GraphQL, GraphOS, Rover, Router, or client-library dependencies only for workflows that use those tools in the project.
- GraphOS account access or credentials may be required for graph-specific Rover or GraphOS operations.

Because `apollo-graphos-tools` is a remote MCP server with no static headers, Cline may offer OAuth authorization during interactive installation. In non-interactive installs, run `cline mcp` after installation and authorize `apollo-graphos-tools` if the server requires authentication for the workflow you want.

## Security Notes

GraphOS MCP tools and the bundled skills can surface schema details, operation names, graph configuration, headers, auth patterns, API endpoints, telemetry conventions, and deployment topology.

Use normal workspace trust rules before enabling this plugin on private GraphQL projects. Do not paste GraphOS API keys, router shared secrets, service tokens, persisted query manifests, private schemas, or customer data into committed files.

For Apollo MCP Server work, prefer explicit operation lists, persisted queries, or other bounded tool definitions over unconstrained schema execution when exposing production APIs to agents.

This plugin does not register a GraphQL language server. Cline does not yet support importing generic LSP declarations from plugin metadata, so GraphQL language-server support should be handled by a dedicated Cline-native tool plugin later.

The MCP server is installed as plugin-owned configuration. Removing the plugin removes the `apollo-graphos-tools` entry that this plugin created.
