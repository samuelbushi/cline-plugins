---
name: session-report
description: Generate an explorable HTML report of local Cline session usage from persisted session artifacts.
---

# Session Report

Produce a self-contained HTML report of local Cline usage and save it to the current working directory.

## Steps

1. Get data. Run the bundled analyzer. The default window is the last 7 days; honor a different range if the user passed one, such as `24h`, `30d`, or `all`. The script `analyze-sessions.mjs` lives in the same directory as this SKILL.md, so use its absolute path:
   ```sh
   REPORT_JSON=$(mktemp "${TMPDIR:-/tmp}/cline-session-report.XXXXXX.json")
   node <skill-dir>/analyze-sessions.mjs --json --since 7d > "$REPORT_JSON"
   ```
   For all-time, pass `--since all`.

   The analyzer reads `CLINE_SESSION_DATA_DIR` when set, otherwise `~/.cline/data/sessions`. Use `--dir <path>` only when the user explicitly points you at a different Cline session data directory.

2. Read `$REPORT_JSON`. Skim `scan`, `overall`, `by_project`, `by_subagent_type`, `by_skill`, `cache_breaks`, and `top_prompts`. If `scan.message_files_read` is `0`, tell the user which directory was scanned and stop unless they provide a different Cline session data directory.

3. Copy the template, which is also bundled alongside this SKILL.md, to the output path in the current working directory:
   ```sh
   cp <skill-dir>/template.html ./session-report-$(date +%Y%m%d-%H%M).html
   ```

4. Edit the output file. Preserve the template's JS/CSS:
   - Replace the contents of `<script id="report-data" type="application/json">` with the full JSON from step 1. The page's JS renders the hero total, all tables, bars, and drill-downs from this blob automatically.
   - Fill the `<!-- AGENT: anomalies -->` block with 3-5 one-line findings. Express figures as a percentage of total tokens wherever possible. Total tokens are `overall.input_tokens.total + overall.output_tokens`. One line per finding, exact markup:
     ```html
     <div class="take bad"><div class="fig">41.2%</div><div class="txt"><b>cc-monitor</b> consumed 41% of the week across just 3 sessions</div></div>
     ```
     Classes: `.take bad` for waste/anomalies (red), `.take good` for healthy signals (green), `.take info` for neutral facts (blue). The `.fig` is one short number (a %, a count, or a multiplier like `12x`). The `.txt` is one plain-English sentence naming the project/skill/prompt; wrap the subject in `<b>`. Look for: a project or skill eating a disproportionate share, cache-hit <85%, a single prompt >2% of total, subagent types averaging >1M tokens/call, cache breaks clustering.
   - Fill the `<!-- AGENT: optimizations -->` block (at the bottom of the page) with 1-4 `<div class="callout">` suggestions tied to specific rows (e.g. "`/weekly-status` spawned 7 subagents for 8.1% of total - scope it to fewer parallel agents").
   - Do not restructure existing sections.

5. Report the saved file path to the user. Do not open it or render it.
6. Delete `$REPORT_JSON` after the HTML report has been written.

## Notes

- The template is the source of interactivity (sorting, expand/collapse, block-char bars). Your job is data + narrative, not markup.
- Keep commentary terse and specific - reference actual project names, numbers, timestamps from the JSON.
- The analyzer JSON is escaped for safe embedding in an HTML script tag. Preserve those escape sequences when copying it into the template.
- `top_prompts` attributes assistant metric rows to the closest preceding user message in the same persisted session.
- Cline's `inputTokens` is already normalized as full input size. Do not add `cacheReadTokens` or `cacheWriteTokens` back on top when calculating totals.
- If the JSON is >2MB, trim `top_prompts` to 100 entries and `cache_breaks` to 100 before embedding (they should already be capped).
