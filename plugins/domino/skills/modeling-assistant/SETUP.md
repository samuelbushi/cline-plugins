# Complete Modeling Assistant Setup Guide

This guide covers setup for the Domino modeling assistant. The Domino MCP Server is bundled with this plugin and starts automatically - no manual cloning, installation, or MCP configuration is required.

Inside a Domino workspace: Project and auth context are auto-detected. Confirm whether the project is Git-backed or DFS-backed before syncing files. Skip straight to [Step 3: Test the Integration](#step-3-test-the-integration).

Outside Domino (laptop): You need to set two environment variables and create a project settings file. Follow the full guide below.

## Prerequisites

- Domino Data Lab account with API access
- Cline or another MCP-enabled assistant
- Python 3.11+
- `uv` package manager ([install guide](https://github.com/astral-sh/uv))
- Git

## Step 1: Set Domino Credentials (Laptop Only)

> Skip this step if you are working inside a Domino workspace. Authentication is handled automatically via ephemeral tokens.

### Generate API Key

1. Log into Domino
2. Go to Account Settings (click your profile icon)
3. Navigate to API Keys
4. Click Generate New Key
5. Copy and save the key securely

### Set Environment Variables

Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
export DOMINO_API_KEY="your_api_key_here"
export DOMINO_HOST="https://your-domino.company.com"
```

Then reload your shell:

```bash
source ~/.zshrc  # or ~/.bashrc
```

The plugin's bundled MCP server picks these up automatically from the environment passed to Cline - no `.env` file is needed.

## Step 2: Configure Your Project (Laptop Only)

> Skip this step if you are working inside a Domino workspace. The project owner and project name are detected from platform environment variables.

### Create Project Settings

In your Domino project directory, create `domino_project_settings.md`:

```markdown
# Domino Project Settings

## Project Information
- Project Owner: your-username
- Project Name: your-project-name

## Default Configuration
- Compute Environment: Default Python 3.10
- Hardware Tier: small-k8s

## Data Locations
- Input data: /mnt/data/
- Imported datasets: /mnt/imported/data/
- Output artifacts: /mnt/artifacts/

## Notes
- For Git-backed projects, Domino jobs only see committed code that is available to Domino
- Ask before committing or pushing
- Use MLflow for experiment tracking
```

## Step 3: Test the Integration

### Create a Test Script

In your project, create `test_domino.py`:

```python
import os
print("Hello from Domino!")
print(f"Project: {os.environ.get('DOMINO_PROJECT_NAME', 'unknown')}")
print(f"User: {os.environ.get('DOMINO_STARTING_USERNAME', 'unknown')}")
```

### Make the Script Available to Domino

For Git-backed projects, Domino jobs only see committed code that is available to Domino. Ask before committing or pushing. If the user confirms, commit and push the test script using the project's normal Git workflow.

For DFS-backed projects, use the Domino MCP file sync tools to upload the explicit `test_domino.py` content before running the job.

### Run via Your AI Assistant

Prompt:
```
Run test_domino.py as a Domino job
```

The MCP server should:
1. Create a Domino job
2. Execute the script
3. Return the output

## Step 4: Set Up Domino Environment (Optional)

### Option A: Domino Standard Environment with AI Tools (Recommended)

If your Domino instance has the Standard Environment with AI Tools available, use that - it comes preconfigured with everything needed for the modeling assistant workflow. No additional setup required.

In your Domino project:

1. Go to Settings → Compute Environment
2. Select the Standard Environment with AI Tools from the list

### Option B: Custom Vibe Modeling Image (Fallback)

If you don't have access to the Standard Environment with AI Tools, use the custom Docker image instead.

In your Domino project:

1. Go to Settings → Compute Environment
2. Create new environment with base image:
   ```
   quay.io/domino/field:vibe-modeling
   ```

This image includes:
- MCP server dependencies
- Common ML libraries
- Preconfigured for modeling assistant workflows

## Workflow Example

### Complete Modeling Assistant Session

1. Start in your AI assistant with your project open

2. Analyze data (prompt):
   ```
   Load the sales data from /mnt/data/sales.csv and show me
   a summary of the key metrics
   ```

3. Assistant creates script, commits, runs in Domino

4. Review results returned through MCP

5. Iterate on analysis (prompt):
   ```
   Now create a visualization of sales by region and save it
   to /mnt/artifacts/sales_by_region.png
   ```

6. Train a model (prompt):
   ```
   Train a random forest model to predict sales using the
   processed data. Log the results to MLflow.
   ```

7. All work is tracked in Domino's experiment manager

## Troubleshooting

### "MCP server not found" or tools not appearing

1. Ensure `uv` is installed and in your PATH
2. Restart Cline after installing the plugin
3. Check that the Domino plugin is installed and enabled
4. Inspect Cline plugin or MCP startup logs for initialization errors

### "Unauthorized" errors

1. Workspace: This shouldn't happen - auth is automatic. Restart the workspace if it persists.
2. Laptop: Verify `DOMINO_API_KEY` and `DOMINO_HOST` are set in your shell environment (`echo $DOMINO_API_KEY`)

### "Project not found"

1. Workspace: Project info is auto-detected. Check that `DOMINO_PROJECT_OWNER` and `DOMINO_PROJECT_NAME` env vars are set.
2. Laptop: Check that `domino_project_settings.md` exists in your project root with the correct owner and project name.

### Jobs fail immediately

1. Check compute environment is available
2. Verify hardware tier is valid
3. Review Domino job logs for errors

## Next Steps

- [SKILL.md](./SKILL.md) - Overview of modeling assistant capabilities and MCP server tool reference
- [Domino Blueprints](https://domino.ai/resources/blueprints/vibe-modeling) - Official documentation
