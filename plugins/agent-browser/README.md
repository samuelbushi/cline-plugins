# agent-browser

Bundle the agent-browser web and Electron automation skill as an installable Cline plugin.

## What It Does

Installs the `agent-browser` skill. The skill is a self-contained driver guide for the [`agent-browser`](https://github.com/vercel-labs/agent-browser) CLI: it carries the full command reference inline (navigation, snapshots with `@eN` refs, interactions, waits, screenshots, Electron automation, sessions, and gotchas) so the agent can drive a real browser and Electron apps from the terminal without loading anything else at runtime.

If the CLI is not installed, the skill tells the agent to install it globally (`npm i -g agent-browser`) and download Chrome once (`agent-browser install`).

## Install

```bash
cline plugin install agent-browser
```

For local development from this repository:

```bash
cline plugin install ./plugins/agent-browser --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Open news.ycombinator.com, grab the titles and links of the top 5 stories, and take a screenshot.
```

Cline automatically uses the `agent-browser` skill to open the page, snapshot it, extract the data, and capture a screenshot.

## Requirements

- Node and npm available so the skill can install the `agent-browser` CLI globally when it is missing.
- A one-time browser binary download via `agent-browser install` (the skill runs this on first use). On Linux, `agent-browser install --with-deps` installs the needed system libraries.

## Security Notes

The skill drives a real browser and can run shell commands to install the CLI and browser binaries. It only installs the public `agent-browser` package and its browser binaries, and it does not persist credentials. Treat any cookies or login state saved through the CLI as secrets.
