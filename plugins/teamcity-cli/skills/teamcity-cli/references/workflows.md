# Common Workflows

## Contents

- Inspecting a build from a TeamCity URL
- Investigating a build failure
- Starting and monitoring builds
- Personal builds (local changes)
- Finding jobs and projects
- Working with build artifacts
- Build metadata (pin/unpin, tag, comment)
- Managing the build queue
- Managing job and project parameters
- Validating Kotlin DSL locally
- Project connections (GitHub App, Docker)
- VCS roots
- Project settings (export & status)
- Secure tokens
- Managing agents
- Remote agent access (term, exec)
- Managing agent pools
- Failure classification
- Build chain debugging
- Fixing a build failure
- Monitoring builds until green
- Test reliability analysis
- Working with pipelines
- Tips
- Troubleshooting

## Inspecting a Build from a TeamCity URL

When a user provides a TeamCity URL, parse it and map to `teamcity` commands.

__Format 1: Specific build__ - `https://host/buildConfiguration/ConfigId/12345`
```bash
# Extract build ID (last numeric path segment): 12345
teamcity run view 12345
# If failed:
teamcity run log 12345 --failed --raw
teamcity run tests 12345 --failed
```

__Format 2: Build configuration__ - `https://host/buildConfiguration/ConfigId`
```bash
# Extract config ID (last non-numeric path segment): ConfigId
teamcity run list --job ConfigId
```

__Format 3: Project__ - `https://host/project/ProjectId`
```bash
# Extract project ID: ProjectId
teamcity job list --project ProjectId
```

Strip query params (`?mode=builds`) and fragments (`#all-projects`) before parsing.

## Investigating a Build Failure

When a build has __FAILURE__ status, proactively suggest: `teamcity run log <id> --failed` (failure summary), `teamcity run tests <id> --failed` (failed tests), `teamcity run changes <id>` (triggering changes).

For __composite/matrix builds__ (snapshot dependencies, no agent), find failed children with `teamcity run list --status failure` and appropriate filters.

1. __Find the failed build:__
   ```bash
   teamcity run list --status failure -n 10
   ```

2. __View build details:__
   ```bash
   teamcity run view <run-id>
   ```

3. __Check the build log:__
   ```bash
   teamcity run log <run-id> --raw
   ```

   Always use `--raw` to avoid interactive terminal formatting. Dump the output to a temp file to re-read it as needed.

   For failed steps only:
   ```bash
   teamcity run log <run-id> --failed
   ```

4. __View test results:__
   ```bash
   teamcity run tests <run-id>
   ```

   For failed tests only:
   ```bash
   teamcity run tests <run-id> --failed
   ```

5. __See what changes triggered the build:__
   ```bash
   teamcity run changes <run-id>
   ```

## Starting and Monitoring Builds

> __Always use `--watch`__ when starting builds to wait until the build finishes before proceeding.
> __Always verify the branch name__ - do not guess. Check with `git branch` or `teamcity run list --job <job-id>` to see valid branches.

__Start a build:__
```bash
teamcity run start <job-id> --watch
```

__Start with specific branch:__
```bash
teamcity run start <job-id> --branch feature/my-branch --watch
```

__Start with parameters:__
```bash
teamcity run start <job-id> -P "param1=value1" -P "param2=value2"
```

__Start with env vars and system properties:__
```bash
teamcity run start <job-id> -P version=1.0 -S build.number=123 -E CI=true
```

__Start and watch:__
```bash
teamcity run start <job-id> --watch
teamcity run start <job-id> --watch --timeout 30m
```

__Start with comment and tags:__
```bash
teamcity run start <job-id> --comment "Release build" --tag release --tag v1.0
```

__Start with clean checkout and rebuild deps:__
```bash
teamcity run start <job-id> --clean --rebuild-deps --top
```

__Dry run (see what would be triggered):__
```bash
teamcity run start <job-id> --dry-run
```

__Watch an existing build:__
```bash
teamcity run watch <run-id>
```

__Stream logs while watching:__
```bash
teamcity run watch <run-id> --logs
```

__Watch with timeout:__
```bash
teamcity run watch <run-id> --timeout 30m --quiet
```

__Wait for completion and get JSON result (for scripting):__
```bash
teamcity run start <job-id> --watch --json
teamcity run watch <run-id> --json
```

## Personal Builds (Local Changes)

> __Kotlin DSL caveat:__ `--local-changes` does __not__ include changes to Kotlin DSL (`.teamcity/`). Always push Kotlin DSL changes to the remote before running the build.

__Run build with local git changes:__
```bash
teamcity run start <job-id> --local-changes
```

__Run build from a patch file:__
```bash
teamcity run start <job-id> --local-changes changes.patch
```

__Personal build with specific branch:__
```bash
teamcity run start <job-id> --personal --branch my-feature --watch
```

__Skip auto-push:__
```bash
teamcity run start <job-id> --local-changes --no-push
```

## Finding Jobs and Projects

__List all projects:__
```bash
teamcity project list
```

__List sub-projects:__
```bash
teamcity project list --parent <project-id>
```

__Create a project:__
```bash
teamcity project create <name>
teamcity project create <name> --id <id> --parent <parent-id>
```

__List jobs in a project:__
```bash
teamcity job list --project <project-id>
```

__View job details:__
```bash
teamcity job view <job-id>
```

__Search for a job by name:__
```bash
teamcity job list --json | jq '.[] | select(.name | contains("deploy"))'
```

## Working with Build Artifacts

__List artifacts from a build:__
```bash
teamcity run artifacts <run-id>
```

__List artifacts from latest build of a job:__
```bash
teamcity run artifacts --job <job-id>
```

__Download all artifacts:__
```bash
teamcity run download <run-id>
```

__Download to specific directory:__
```bash
teamcity run download <run-id> -o ./artifacts
```

__Download a subdirectory:__
```bash
teamcity run download <run-id> --path build/assets
```

__Download specific artifact pattern:__
```bash
teamcity run download <run-id> --artifact "*.jar"
```

__Combine path and pattern:__
```bash
teamcity run download <run-id> --path build/assets -a "*.js"
```

## Build Metadata

__Pin a build (prevent cleanup):__
```bash
teamcity run pin <run-id> --comment "Release candidate"
```

__Unpin a build:__
```bash
teamcity run unpin <run-id>
```

__Tag a build:__
```bash
teamcity run tag <run-id> deployed production
```

__Remove tags:__
```bash
teamcity run untag <run-id> deployed
```

__Add a comment:__
```bash
teamcity run comment <run-id> "Verified by QA"
```

__View existing comment:__
```bash
teamcity run comment <run-id>
```

__Delete a comment:__
```bash
teamcity run comment <run-id> --delete
```

## Managing the Build Queue

__View queued builds:__
```bash
teamcity queue list
```

__Filter queue by job:__
```bash
teamcity queue list --job <job-id>
```

__Move a build to top of queue:__
```bash
teamcity queue top <run-id>
```

__Remove from queue:__
```bash
teamcity queue remove <run-id>
```

__Approve a build waiting for approval:__
```bash
teamcity queue approve <run-id>
```

## Managing Job and Project Parameters

__List job parameters:__
```bash
teamcity job param list <job-id>
```

__Set a parameter:__
```bash
teamcity job param set <job-id> MY_PARAM "my value"
```

__Set a secure parameter:__
```bash
teamcity job param set <job-id> SECRET_KEY "____" --secure
```

__Get a parameter:__
```bash
teamcity job param get <job-id> MY_PARAM
```

__Delete a parameter:__
```bash
teamcity job param delete <job-id> MY_PARAM
```

Project parameters work the same way with `teamcity project param`.

## Validating Kotlin DSL Locally

__Always use `teamcity project settings validate`__ to verify Kotlin DSL - never generic `mvn compile`.

Under the hood it runs `mvn teamcity-configs:generate` (or `./mvnw` when available) inside the `.teamcity/` directory, which is the only correct DSL validation step. Generic Maven commands like `mvn compile` do __not__ validate TeamCity DSL and will give misleading results.
The optional positional argument is only a filesystem path to `.teamcity`; do __not__ pass a TeamCity project ID/name, and do __not__ invent `--dir`.

```bash
# Preferred - auto-detects .teamcity dir and Maven wrapper
teamcity project settings validate

# Explicit path
teamcity project settings validate ./path/to/.teamcity

# Show full Maven output for debugging
teamcity project settings validate --verbose
```

If you need the raw Maven command (e.g., in CI without the CLI installed):
```bash
./mvnw teamcity-configs:generate -f .teamcity/pom.xml   # prefer wrapper
mvn teamcity-configs:generate -f .teamcity/pom.xml       # fallback
```

## Project Connections

Connections give jobs credentials for external services (GitHub, Docker registries, AWS, ...) without storing secrets per-job. Required before creating a VCS root that authenticates via OAuth.

__Inspect existing connections in a project:__
```bash
teamcity project connection list --project <project-id>
```

### Connecting a GitHub repository (GitHub App)

> __Always use this path for GitHub.__ Don't `vcs create --auth password` with a personal access token - PATs tie infrastructure to one human, leak in job logs, and can't be revoked centrally. The four-step flow below produces a non-personal "Refreshable access token" tied to a service-identity App, which is what the TeamCity UI's "Sign in to GitHub App" button creates.

Creates a fresh GitHub App via GitHub's manifest flow - credentials are captured automatically, no PAT involved. Lets jobs clone, post commit statuses, and comment on PRs.

__1. Create the connection__ (one browser click on github.com):

```bash
teamcity project connection create github-app -p <project-id>
# prompts: Connection name (default "GitHub App"), GitHub organization (blank for personal)
# browser auto-redirects to GitHub's "Create GitHub App" page; click Create.
# CLI captures App ID, client ID, secret, PEM, owner URL.
```

The output prints `Next steps:` with follow-up commands and the install link. Capture the `PROJECT_EXT_NN` from the success line.

__2. Authorize as the current TeamCity user__ (stores a token for `(connection × user)`):

```bash
teamcity project connection authorize PROJECT_EXT_NN -p <project-id>
# browser opens TeamCity's OAuth page -> click Authorize on GitHub -> tab self-closes.
```

__3. Install the App on a repo__ (one-time, per repo, on github.com):

Open the printed install link `https://github.com/apps/<slug>/installations/new`, pick repos, click Install.

> Steps 2 and 3 are independent - order doesn't matter. Both must complete before step 4: Authorize provides the user token TeamCity uses for API calls; Install grants the App access to the repo. `vcs create` will fail without either.

__4. Create the VCS root using the connection:__

```bash
teamcity project vcs create -p <project-id> \
  --auth token \
  --connection-id PROJECT_EXT_NN \
  --url https://github.com/<owner>/<repo>.git
```

TeamCity auto-fills `authMethod=ACCESS_TOKEN`, `username=oauth2`, and the proper `tokenId` from the connection's stored token. No manual property setup needed; the resulting VCS root uses a non-personal "Refreshable access token" - exactly what the UI's "Sign in to GitHub App" produces.

__Non-interactive (agent) variant - bring your own GitHub App credentials:__

```bash
echo "$GH_APP_CLIENT_SECRET" | teamcity project connection create github-app \
  -p <project-id> --no-manifest \
  --name "Backend" \
  --owner my-org \
  --app-id 1234567 \
  --client-id Iv1.abc \
  --private-key-file /path/to/key.pem \
  --stdin
```

Skips the manifest browser flow; use when a human has already registered the App and stored its credentials in a vault.

### Connecting a Docker registry

For pushing images to GHCR, Docker Hub, or a private registry. Uses static credentials - always use a service account / robot user, never a personal password.

```bash
echo "$REGISTRY_TOKEN" | teamcity project connection create docker \
  -p <project-id> \
  --name "GHCR" \
  --url https://ghcr.io \
  --username my-org \
  --stdin
```

Interactive variant prompts for each field; password is read via a secret prompt (never echoed). The connection is referenced from the Docker Image Builder runner and the `docker-support` build feature via its ID; configure those in the UI or Kotlin DSL.

### Removing a connection

```bash
teamcity project connection delete PROJECT_EXT_NN -p <project-id>
teamcity project connection delete PROJECT_EXT_NN -p <project-id> --yes   # skip confirm
```

VCS roots and build features that reference the deleted connection break - clean those up first.

__Gotchas:__
- `vcs create --auth token` test connection returns "Malformed request" if the user hasn't authorized yet. The CLI prints a tip pointing at `connection authorize`. Run that, then retry.
- The App's per-repo install (step 2) is mandatory; without it, clones return 404 even with a valid connection.
- Connections in a parent project are inherited by sub-projects - don't recreate the same connection in nested projects.
- For Docker on AWS-managed ECR, prefer an AWS connection with role-based federation over Docker credentials.

## VCS Roots

For questions like "which repository URL and default branch does project `<id>` use", always discover attached VCS roots first, then inspect a concrete root.

__List VCS roots in a project:__
```bash
teamcity project vcs list --project <project-id>
```

__View VCS root details:__
```bash
teamcity project vcs view <vcs-root-id>
```

__Required sequence for project VCS inspection:__
1. Run `teamcity project vcs list --project <project-id>` to get valid root IDs.
2. Run `teamcity project vcs view <vcs-root-id>` for URL, default branch, auth method, and other properties.
3. Do not guess VCS root IDs.
4. Do not use `teamcity project view` or `teamcity project settings status` as a substitute for VCS root details.

__Create a VCS root:__
```bash
# Preferred for GitHub: use a GitHub App connection (see Project Connections above).
teamcity project vcs create -p <project-id> \
  --auth token --connection-id <connection-id> \
  --url https://github.com/<owner>/<repo>.git

# Other auth methods (use only when there is no usable connection).
teamcity project vcs create -p <project-id> --url <url> --auth anonymous
teamcity project vcs create -p <project-id> --url <url> --auth password --username U --stdin <<<"$PAT"
teamcity project vcs create -p <project-id> --url <url> --auth ssh-key --ssh-key-name my-key
```

> __For GitHub repositories, always prefer the GitHub App connection path__ (`--auth token --connection-id <id>`). Pasting a personal access token via `--auth password` works but is an anti-pattern: PATs are tied to a single human, leak via job logs, and can't be revoked centrally. Use the [Connecting a GitHub repository](#connecting-a-github-repository-github-app) workflow before falling back to PAT auth.

__Delete a VCS root:__
```bash
teamcity project vcs delete <vcs-root-id>
teamcity project vcs delete <vcs-root-id> --yes   # skip confirmation
```

## Project Settings (Export & Status)

__Check versioned settings sync status (requires server connection):__
```bash
teamcity project settings status <project-id>
```

__Export project settings as Kotlin DSL:__
```bash
teamcity project settings export <project-id>
```

__Export as XML:__
```bash
teamcity project settings export <project-id> --xml -o settings.zip
```

## Secure Tokens

__Store a secret and get a token reference:__
```bash
teamcity project token put <project-id> "my-secret-password"
```

__Store from stdin (for piping):__
```bash
echo -n "my-secret" | teamcity project token put <project-id> --stdin
```

__Retrieve a token value (requires System Admin):__
```bash
teamcity project token get <project-id> "credentialsJSON:abc123..."
```

## Managing Agents

__List all agents:__
```bash
teamcity agent list
```

__List connected agents only:__
```bash
teamcity agent list --connected
```

__Filter agents by pool:__
```bash
teamcity agent list --pool Default
```

__View agent details:__
```bash
teamcity agent view <agent-id>
```

__See what jobs an agent can run:__
```bash
teamcity agent jobs <agent-id>
```

__See why jobs are incompatible with an agent:__
```bash
teamcity agent jobs <agent-id> --incompatible
```

__Enable/disable an agent:__
```bash
teamcity agent enable <agent-id>
teamcity agent disable <agent-id>
```

__Authorize/deauthorize an agent:__
```bash
teamcity agent authorize <agent-id>
teamcity agent deauthorize <agent-id>
```

__Move agent to a different pool:__
```bash
teamcity agent move <agent-id> <pool-id>
```

__Reboot an agent:__
```bash
teamcity agent reboot <agent-id>
```

__Reboot after current build finishes:__
```bash
teamcity agent reboot <agent-id> --graceful
```

## Remote Agent Access

__Open interactive shell on an agent:__
```bash
teamcity agent term <agent-id>
```

__Execute a command on an agent:__
```bash
teamcity agent exec <agent-id> "ls -la"
```

__Execute with timeout:__
```bash
teamcity agent exec <agent-id> --timeout 10m -- long-running-script.sh
```

## Managing Agent Pools

__List all pools:__
```bash
teamcity pool list
```

__View pool details:__
```bash
teamcity pool view <pool-id>
```

__Link a project to a pool:__
```bash
teamcity pool link <pool-id> <project-id>
```

__Unlink a project from a pool:__
```bash
teamcity pool unlink <pool-id> <project-id>
```

## Failure Classification

When a build fails, classify the failure before attempting a fix. The classification determines the fix strategy.

__Decision tree:__

1. __Is the build composite (no agent, has snapshot dependencies)?__
   - Yes -> The composite build itself has no logs. Drill into child builds to find the actual failure. Use `teamcity run list --status failure` filtered to the relevant job tree.
2. __Is the failure transient or permanent?__
   - Transient: infrastructure timeouts, agent disconnects, OOM on agent, flaky tests (same code passes on retry). Fix: retry with `teamcity run restart <id>`.
   - Permanent: compilation errors, test failures correlated with code changes, config errors. Fix: change code or config.
3. __Is the failure in code, versioned settings, or server config?__
   - Code: fix in repo, verify with `--local-changes`, push.
   - Versioned settings (Kotlin DSL): fix in repo, validate with `teamcity project settings validate`, push. Cannot use `--local-changes`.
   - Pipeline YAML: fix in repo, validate with `teamcity pipeline validate`, push. Cannot use `--local-changes`.
   - Server config: fix via TeamCity UI or API. Not in repo.

__Default:__ treat unknown failures as permanent until proven otherwise.

__Gotchas:__
- Composite builds have empty logs - always drill to child failures first.
- A build can fail with "no compatible agents" - this is server config, not code.
- `--local-changes` does NOT include Kotlin DSL or pipeline YAML stored in repo.

## Build Chain Debugging

TeamCity's snapshot dependency chains are unique - no competitor has this. When a build in a chain fails, the failure cascades upstream, so multiple builds may show as failed.

__Find the root failure:__

```bash
# View the dependency tree for a specific build run (shows statuses)
teamcity run tree <run-id>

# Use --json for programmatic analysis
teamcity run tree <run-id> --json
```

`run tree` shows the actual build runs with their statuses, so you can immediately see which dependency failed. Use `job tree` if you need the job-level (build configuration) dependency structure instead.

__Key principle:__ The first failure in the chain (the deepest dependency that failed) is the root cause, not the last. Work bottom-up.

__Steps:__
1. Start from the build the user reported.
2. Run `teamcity run tree <run-id>` to see the full dependency tree with statuses.
3. Find the deepest build in the tree that has a failure status (not just "Snapshot dependency build failed").
4. That's your root cause. Investigate its logs: `teamcity run log <id> --failed --raw`

__Gotchas:__
- Builds that fail only because a dependency failed show "Snapshot dependency build failed" - skip these and go deeper.
- Restarting the top-level build won't help if the root child is still broken.
- Use `run tree` (shows actual builds with statuses) for debugging failures. Use `job tree` (shows build configuration structure) for understanding the dependency graph.

## Fixing a Build Failure

End-to-end workflow for diagnosing and fixing a CI failure. Equivalent to GitHub's `gh-fix-ci`.

### Step 1: Find and diagnose

```bash
# Get the failed build details
teamcity run view <run-id>

# Get the failure log (always use --raw, dump to temp file)
teamcity run log <run-id> --failed --raw > /tmp/build-failure.log

# Check failed tests
teamcity run tests <run-id> --failed

# See what changes triggered the build
teamcity run changes <run-id>
```

### Step 2: Classify the failure

Use the [Failure Classification](#failure-classification) decision tree above.

### Step 3: Fix

__For code failures:__
1. Read the relevant source files and understand the error.
2. Make the fix.
3. Verify locally if possible (run tests, compile, lint).
4. Verify on TeamCity without committing:
   ```bash
   teamcity run start <job-id> --local-changes --watch
   ```
5. Once green, commit and push.

__For versioned settings failures (Kotlin DSL):__
1. Fix the DSL code in `.teamcity/`.
2. Validate locally:
   ```bash
   teamcity project settings validate
   ```
3. Push the fix (cannot use `--local-changes` for DSL).

__For pipeline YAML failures:__
- __Server-stored pipelines:__ pull -> fix -> validate -> push:
  ```bash
  teamcity pipeline pull <pipeline-id> -o /tmp/pipeline.yml
  # edit /tmp/pipeline.yml
  teamcity pipeline validate /tmp/pipeline.yml
  teamcity pipeline push <pipeline-id> /tmp/pipeline.yml
  ```
- __VCS-stored pipelines__ (`.teamcity.yml` in repo): edit the file directly, validate, then ask before committing or pushing:
  ```bash
  # edit .teamcity.yml
  teamcity pipeline validate .teamcity.yml
  # commit and push only after explicit user approval
  ```
  (`pull`/`push` commands fail for VCS-backed pipelines - edit the repo file instead.)

__For server config failures:__
1. Identify the misconfiguration from the logs.
2. Fix via TeamCity UI or `teamcity api`.
3. Restart the build: `teamcity run restart <run-id>`

### Guardrails

- Never delete or skip failing tests to make the build green.
- Never disable linting or static analysis steps.
- Never force-push to fix a build.
- If the fix requires changes outside your expertise, document the diagnosis and escalate.

__Gotchas:__
- Always use `--raw` for logs and dump to a temp file - build logs can be very large and lose formatting without `--raw`.
- `--local-changes` does NOT include Kotlin DSL or pipeline YAML stored in repo. Always push DSL changes before running.
- Composite builds have no logs of their own - drill to the child that actually failed.
- If the build fails with a different error after your fix, that's a new failure - re-diagnose from step 1.

## Monitoring Builds Until Green

Loop workflow for watching a build, fixing failures, and retrying. In Cline, keep this explicit and user-steered: do not run an autonomous background fixer, and ask before build starts/restarts, TeamCity server mutations, commits, or pushes.

### Loop

1. __Start or watch the build:__
   ```bash
   teamcity run start <job-id> --branch <branch> --watch
   # or watch an existing build:
   teamcity run watch <run-id>
   ```

2. __If the build succeeds:__ done.

3. __If the build fails:__ run the [Fixing a Build Failure](#fixing-a-build-failure) workflow above.

4. __After pushing the fix:__
   - If the job has a VCS trigger, a new build starts automatically. Poll until a build with a higher ID than the failed one appears, then watch it:
     ```bash
     # Poll for a build on the pushed commit:
     teamcity run list --job <job-id> --branch <branch> --revision @head -n 1 --json
     # Repeat until a result appears (or ~30s pass).
     # If no new build appears, start one manually:
     teamcity run start <job-id> --branch <branch> --watch
     ```
   - If no VCS trigger, start a new build manually:
     ```bash
     teamcity run start <job-id> --branch <branch> --watch
     ```

5. __Repeat__ from step 2.

### Stop conditions

- __Success:__ the build is green.
- __Max attempts reached:__ stop after 3 fix attempts. Each attempt must make different changes - if you're repeating the same fix, something deeper is wrong.
- __Unfixable issue:__ server config problem, missing agent, infrastructure failure, or a failure outside the scope of code changes.
- __Same failure after fix:__ if the exact same error appears after your fix, re-examine the diagnosis - the fix may not have addressed the root cause.

__Gotchas:__
- A VCS trigger fires only when new commits are pushed to a monitored branch. If the job doesn't have a VCS trigger configured, you must start builds manually with `teamcity run start`.
- After pushing, wait a few seconds before listing runs - the trigger needs time to pick up the change.
- Watch for "build already running" - if a build is queued or running for the same branch, watch it instead of starting a new one.

## Test Reliability Analysis

Identify flaky tests by cross-referencing failures across builds. Equivalent to CircleCI's `find_flaky_tests`.

### Identify potentially flaky tests

```bash
# Get failed tests from the current build
teamcity run tests <run-id> --failed --json > /tmp/failed-tests.json

# Check if the same tests failed in recent builds
teamcity run list --job <job-id> --status failure -n 5 --json

# For each recent failed build, get its failed tests
teamcity run tests <other-run-id> --failed --json
```

### Cross-reference with code changes

```bash
# Check what changed between builds
teamcity run changes <run-id>
```

__Flaky test indicators:__
- Test fails intermittently across builds without corresponding code changes.
- Test passes on retry (restart) without any code change.
- Test fails on one agent but passes on another (environment-dependent).

### What to do with flaky tests

1. Document the flaky test: name, frequency, suspected cause.
2. If `teamcity test mute` becomes available, ask before using it and include a tracking issue in the comment.
3. Otherwise, document the suspected flaky test in the relevant issue or follow-up note.
4. Never delete, skip, or mute a flaky test without explicit user approval and a tracking issue - it may be catching real intermittent bugs.

__Gotchas:__
- A test that fails only on certain agents may be environment-dependent, not flaky. Check agent properties with `teamcity agent view <id>`.
- Some test frameworks report different test names on failure vs success (e.g., parameterized tests). Normalize test names before comparing.
- Large test suites may need `--json` output piped through `jq` for efficient filtering.

## Working with Pipelines

Pipelines are YAML-first build configurations. Unlike jobs (build configs) that are configured via UI or Kotlin DSL, pipelines are defined in a `.teamcity.yml` file. Each pipeline is a TeamCity project containing multiple jobs.

__List pipelines:__
```bash
teamcity pipeline list
teamcity pipeline list --project <project-id>
```

__View pipeline details:__
```bash
teamcity pipeline view <pipeline-id>
teamcity pipeline view <pipeline-id> --web   # open in browser
```

__Create a pipeline from YAML:__
```bash
# --vcs-root is required in non-interactive (agent) usage
teamcity pipeline create my-pipeline --project <project-id> --vcs-root <vcs-root-id>

# From a specific file
teamcity pipeline create my-pipeline --project <project-id> --vcs-root <vcs-root-id> --file pipeline.yml
```

__Validate pipeline YAML before pushing:__
```bash
# Validates against server schema (cached locally for 24h)
teamcity pipeline validate

# Validate a specific file
teamcity pipeline validate my-pipeline.yml

# Force re-fetch schema from server
teamcity pipeline validate --refresh-schema
```

__Pull/push pipeline YAML (edit-in-place workflow):__
```bash
# Download current YAML
teamcity pipeline pull <pipeline-id> -o .teamcity.yml

# Edit the file...

# Validate before pushing
teamcity pipeline validate .teamcity.yml

# Upload changes
teamcity pipeline push <pipeline-id> .teamcity.yml
```

__Delete a pipeline:__
```bash
teamcity pipeline delete <pipeline-id>
teamcity pipeline delete <pipeline-id> --yes   # skip confirmation
```

__Gotchas:__
- If the pipeline stores YAML in VCS (versioned settings), `pull` and `push` will return an error - edit the YAML directly in the repo instead.
- `pipeline push` does NOT validate - always run `pipeline validate` first.
- `pipeline create` requires `--project` and `--vcs-root` in non-interactive mode - pipelines always belong to a parent project and VCS root.
- The default YAML file is `.teamcity.yml` in the current directory.

## Tips

1. __Use `--json` for programmatic access__ - Parse with `jq` for complex queries

1. __Use `teamcity api` as escape hatch__ - When a specific command doesn't exist, use raw API access

1. __Environment variables__ - If overriding with env vars, set both `TEAMCITY_URL` and `TEAMCITY_TOKEN`; `TEAMCITY_URL` alone bypasses stored auth

1. __Open in browser__ - Most view commands support `-w` to open in web browser

1. __Auto-detection from DSL__ - When working in a project with Kotlin DSL config, the server URL is auto-detected from `.teamcity/pom.xml`

1. __Multiple servers__ - Use `TEAMCITY_URL` env var to switch between servers, or `teamcity auth login --server <url>` to add servers

## Troubleshooting

| Symptom                      | Likely Cause              | Action                                                                                  |
|------------------------------|---------------------------|-----------------------------------------------------------------------------------------|
| `401 Unauthorized`           | Invalid or expired token  | Run `teamcity auth status` to check; re-login with `teamcity auth login`                |
| `403 Forbidden`              | Insufficient permissions  | Build config may require different access rights; check with TeamCity admin             |
| `404 Not Found`              | Build deleted or wrong ID | Verify the build ID/URL; the build may have been cleaned up                             |
| Connection refused / timeout | Server unreachable        | Check if TeamCity instance is accessible; verify server URL with `teamcity auth status` |
| `Not authenticated`          | `TEAMCITY_URL` set without matching token, or no auth configured | Unset `TEAMCITY_URL` to use stored auth from `teamcity auth login`, or set both `TEAMCITY_URL` and `TEAMCITY_TOKEN` |
| `No server configured`       | Missing auth config       | Run `teamcity auth login -s <url>` or set `TEAMCITY_URL` and `TEAMCITY_TOKEN` env vars  |
| `Network access blocked by sandbox` | Sandbox proxy blocking outbound requests | Add the server domain to the sandbox `allowedDomains`, or exclude `teamcity` from sandboxing |
