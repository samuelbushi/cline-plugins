# jdtls-lsp

Adds Java compile diagnostics for Cline workspaces.

## What It Does

Registers `java_build_diagnostics(path?, buildSystem?, timeoutMs?)`. The tool detects a Java project and runs one bounded diagnostics command:

- Maven: `mvnw` or `mvn -q -DskipTests compile`
- Gradle: `gradlew` or `gradle --no-daemon --console=plain classes`
- Plain Java: `javac -Xlint:all` for small source trees without a build file

This is a Cline-native diagnostic tool, not a persistent Eclipse JDT.LS language server. It gives Cline a practical way to check Java compiler errors and warnings without pretending the host has generic LSP support.

## Install

```bash
cline plugin install jdtls-lsp
```

For local development from this repository:

```bash
cline plugin install ./plugins/jdtls-lsp --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Check the Java compile errors in this project before changing the service layer.
```

Cline can call `java_build_diagnostics` when it needs compiler feedback for Maven, Gradle, or small javac-only Java projects.

## Requirements

- A project-compatible JDK.
- Maven, Gradle, `mvnw`, `gradlew`, or `javac`, depending on the project.
- Any dependency downloads or build credentials required by the project build.

## Security Notes

Maven and Gradle builds can execute project-defined build logic, including wrapper scripts and plugins. Use this plugin only in trusted workspaces, and review build files before running diagnostics in unfamiliar repositories.
