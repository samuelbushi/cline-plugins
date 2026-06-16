---
name: qdrant-clients-sdk
description: "Qdrant provides client SDKs for various programming languages, allowing easy integration with Qdrant deployments."
---

# Qdrant Clients SDK

Qdrant has the following officially supported client SDK packages. Install or add one only when the user asks you to wire Qdrant into a project, or when the existing project already needs that dependency.

- Python -- [qdrant-client](https://github.com/qdrant/qdrant-client), package `qdrant-client`
- JavaScript / TypeScript -- [qdrant-js](https://github.com/qdrant/qdrant-js), package `@qdrant/js-client-rest`
- Rust -- [rust-client](https://github.com/qdrant/rust-client), crate `qdrant-client`
- Go -- [go-client](https://github.com/qdrant/go-client), module `github.com/qdrant/go-client`
- .NET -- [qdrant-dotnet](https://github.com/qdrant/qdrant-dotnet), package `Qdrant.Client`
- Java -- [java-client](https://github.com/qdrant/java-client), Maven artifact `io.qdrant:client`


## API Reference

All interaction with Qdrant can happen through the REST API or gRPC API. We recommend using the REST API if you are using Qdrant for the first time or working on a prototype.

* REST API - [OpenAPI Reference](https://api.qdrant.tech/api-reference) - [GitHub](https://github.com/qdrant/qdrant/blob/master/docs/redoc/master/openapi.json)
* gRPC API - [gRPC protobuf definitions](https://github.com/qdrant/qdrant/tree/master/lib/api/src/grpc/proto)

## Code examples

Use the SDK and API references above to choose the right client. If a task needs current examples beyond the bundled skill, ask before fetching external Qdrant docs or snippet search results.
