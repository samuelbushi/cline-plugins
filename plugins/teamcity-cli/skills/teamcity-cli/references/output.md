# Output Formats

Most commands support multiple output formats for different use cases.

## Available Formats

| Format          | Flag          | Use Case                       |
|-----------------|---------------|--------------------------------|
| Table (default) | none          | Human-readable, colored output |
| Plain text      | `--plain`     | Scripting, parsing             |
| JSON            | `--json`      | Programmatic access            |
| No color        | `--no-color`  | Logs, CI environments          |
| No header       | `--no-header` | Clean output for piping        |

## JSON Output

__Default JSON (all fields):__
```bash
teamcity run list --json
```

__List available fields:__
```bash
teamcity run list --json=
```

__Select specific fields:__
```bash
teamcity run list --json=id,status,webUrl
```

__Nested fields (dot notation):__
```bash
teamcity run list --json=id,buildType.name,triggered.user.username
```

## Available JSON Fields by Command

| Command        | Example fields                                                                                                                                                                                        |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `run list`     | `id`, `number`, `status`, `state`, `branchName`, `buildTypeId`, `buildType.name`, `buildType.projectName`, `triggered.type`, `triggered.user.name`, `agent.name`, `startDate`, `finishDate`, `webUrl` |
| `job list`     | `id`, `name`, `projectName`, `projectId`, `paused`, `href`, `webUrl`                                                                                                                                  |
| `project list` | `id`, `name`, `description`, `parentProjectId`, `href`, `webUrl`                                                                                                                                      |
| `queue list`   | `id`, `buildTypeId`, `state`, `branchName`, `queuedDate`, `buildType.name`, `triggered.user.name`, `webUrl`                                                                                           |
| `agent list`   | `id`, `name`, `connected`, `enabled`, `authorized`, `pool.name`, `webUrl`                                                                                                                             |
| `pool list`    | `id`, `name`, `maxAgents`                                                                                                                                                                             |
| `pipeline list`| `id`, `name`, `webUrl`, `parentProject.id`, `parentProject.name`, `headBuildType.id`, `jobs.count`                                                                                                    |

Run `teamcity <command> --json=` to see all available fields for that command.

## Scripting Examples

__Get build IDs of failed builds:__
```bash
teamcity run list --status failure --plain --no-header | awk '{print $2}'
```

__JSON with jq:__
```bash
teamcity run list --json | jq '.[] | {id, status, branch}'
```

__Get build IDs that failed (JSON):__
```bash
teamcity run list --status failure --json=id | jq -r '.[].id'
```

__Export runs to CSV:__
```bash
teamcity run list --json=id,status,branchName | jq -r '.[] | [.id,.status,.branchName] | @csv'
```

__Filter builds by pattern:__
```bash
teamcity run list --json | jq '.[] | select(.branch | contains("feature"))'
```

__Count builds by status:__
```bash
teamcity run list --json | jq 'group_by(.status) | map({status: .[0].status, count: length})'
```

__Get web URLs for queued builds:__
```bash
teamcity queue list --json=webUrl | jq -r '.[].webUrl'
```

## Environment Variables

For non-interactive use (CI/CD, scripts):

```bash
export TEAMCITY_URL="https://teamcity.example.com"
export TEAMCITY_TOKEN="your-api-token"

# Commands will use these automatically
teamcity run list
```

Environment variables always take precedence over config file settings.

Other supported variables:
- `TEAMCITY_GUEST=1` - use guest authentication
- `TEAMCITY_RO=1` - read-only mode (block write operations)
- `TEAMCITY_NO_UPDATE=1` - disable automatic update checks
- `NO_COLOR` or `TEAMCITY_NO_COLOR` - disable colored output

## Combining with Other Tools

__Open in browser:__
```bash
teamcity run view <id> -w
```

__Pipe to less with color:__
```bash
teamcity run list | less -R
```

__Watch and notify:__
```bash
teamcity run watch <id> && notify-send "Build complete"
```
