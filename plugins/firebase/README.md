# firebase

Register the Firebase MCP server in Cline.

## What It Does

Adds the `firebase` MCP server through the pinned `firebase-tools` package bundled with this plugin.

The server lets Cline use Firebase tools for supported project workflows such as inspecting and managing Firebase resources from the Firebase CLI MCP runtime.

When Cline provides a workspace path, the plugin runs Firebase from that workspace and passes it to Firebase with `--dir` so Firebase discovers project configuration from the user's workspace rather than the plugin install directory.

## Install

From your Firebase project root:

```bash
cline plugin install firebase --cwd .
```

For local development from this repository:

```bash
cline plugin install ./plugins/firebase --cwd /path/to/firebase/project
```

## Example Usage

After installation, ask Cline:

```text
Use Firebase to inspect this project's configured services and summarize the available backend resources.
```

Cline can use the registered Firebase MCP server when it is available in the MCP runtime.

## Requirements

- Node.js 20 or newer.
- Firebase project configuration in the workspace for project-aware tools.
- Firebase project access for the resources you want Cline to inspect or modify.
- Firebase authentication through the Firebase CLI environment.
- Installing the plugin installs the full `firebase-tools` package and its dependencies.

## Security Notes

Firebase MCP tools can inspect or change cloud resources depending on your account, project permissions, and selected action. It runs the bundled `firebase-tools` package installed with this plugin. Review requested tool calls before allowing changes to production projects.
