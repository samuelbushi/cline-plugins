# kotlin-lsp

Adds Kotlin compile diagnostics for Cline workspaces.

## What It Does

Registers `kotlin_build_diagnostics(path?, buildSystem?, timeoutMs?)`. The tool detects a Kotlin project and runs one bounded diagnostics command:

- JVM-style Gradle: `gradlew` or `gradle --no-daemon --console=plain classes`
- Maven: `mvnw` or `mvn -q -DskipTests compile`
- Plain Kotlin: `kotlinc` for small `.kt` source trees without a build file

This is a Cline-native diagnostic tool, not a persistent Kotlin LSP server. It gives Cline practical compiler feedback without pretending the host has generic LSP support.

## Install

```bash
cline plugin install kotlin-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/kotlin-lsp --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Check the Kotlin compile errors in this Gradle project before editing the service.
```

## Requirements

- A project-compatible JDK.
- JVM-style Gradle, Maven, `gradlew`, `mvnw`, or `kotlinc`, depending on the project.
- Any dependency downloads or build credentials required by the project build.

## Security Notes

Gradle and Maven builds can execute project-defined build logic, wrapper scripts, and plugins. Use this plugin only in trusted workspaces, and review build files before running diagnostics in unfamiliar repositories.
