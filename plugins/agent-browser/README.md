# agent-browser

Bundle the agent-browser web and Electron automation skill as an installable Cline plugin.

## What It Does

Installs the `agent-browser` skill. The skill guides agents to drive a real browser (and Electron apps) from the terminal with the `agent-browser` CLI: navigate pages, snapshot the accessibility tree into stable refs, click and type against those refs, extract DOM data, take screenshots, and do visual QA.

The skill is reactive about setup. If the `agent-browser` CLI is not installed, it installs the package globally with npm. If the browser binary has not been downloaded yet, it runs `agent-browser install` once and retries. For command details it defers to the version-matched docs the CLI ships via `agent-browser skills get core --full`.

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
