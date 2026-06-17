#!/usr/bin/env node
/* eslint-disable */
/**
 * Scans local Cline session artifacts and reports token usage, cache behavior,
 * session timelines, subagent sessions, and expensive prompts.
 *
 * The analyzer reads the local file-session store:
 *   $CLINE_SESSION_DATA_DIR or ~/.cline/data/sessions
 *
 * It intentionally does not query Cline cloud history. If the local session
 * index is absent, the report is empty and explains which directory was read.
 */

import fs from "node:fs"
import os from "node:os"
import path from "node:path"

const argv = process.argv.slice(2)

function flag(name, dflt) {
  const i = argv.indexOf(name)
  if (i === -1) return dflt
  const v = argv[i + 1]
  return v === undefined || v.startsWith("--") ? true : v
}

const DEFAULT_ROOT =
  process.env.CLINE_SESSION_DATA_DIR?.trim() ||
  path.join(os.homedir(), ".cline", "data", "sessions")
const ROOT = path.resolve(String(flag("--dir", DEFAULT_ROOT)))
const AS_JSON = argv.includes("--json")
const TOP_N = parseInt(String(flag("--top", "15")), 10)
const SINCE_LABEL = flag("--since", "7d")
const SINCE = parseSince(SINCE_LABEL)
const CACHE_BREAK_THRESHOLD = parseInt(String(flag("--cache-break", "100000")), 10)

function parseSince(value) {
  if (!value || value === "all") return null
  const m = /^(\d+)([dh])$/.exec(String(value))
  if (m) {
    const unitMs = m[2] === "d" ? 86400000 : 3600000
    return new Date(Date.now() - Number(m[1]) * unitMs)
  }
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? null : d
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"))
  } catch {
    return undefined
  }
}

function num(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}

function pct(numerator, denominator) {
  return denominator > 0 ? Number((100 * numerator / denominator).toFixed(1)) : 0
}

function hours(ms) {
  return Number(Math.max(0, ms / 3600000).toFixed(2))
}

function projectName(row) {
  return row?.workspaceRoot || row?.workspace_root || row?.cwd || "(unknown workspace)"
}

function rowStartedMs(row) {
  const ms = Date.parse(row?.startedAt || row?.started_at || "")
  return Number.isNaN(ms) ? undefined : ms
}

function rowEndedMs(row) {
  const ms = Date.parse(row?.endedAt || row?.ended_at || row?.updatedAt || "")
  return Number.isNaN(ms) ? undefined : ms
}

function rowSessionId(row) {
  return row?.sessionId || row?.session_id || ""
}

function rowIsSubagent(row) {
  return Boolean(row?.isSubagent || row?.is_subagent)
}

function rowAgentId(row) {
  return row?.agentId || row?.agent_id || ""
}

function rowTeamName(row) {
  return row?.teamName || row?.team_name || ""
}

function messageTs(message, fallbackMs) {
  if (typeof message?.ts === "number" && Number.isFinite(message.ts)) {
    return message.ts
  }
  const raw = message?.timestamp || message?.createdAt
  const ms = Date.parse(raw || "")
  return Number.isNaN(ms) ? fallbackMs : ms
}

function messageText(message) {
  const content = message?.content
  if (typeof content === "string") return content.trim()
  if (!Array.isArray(content)) return ""
  return content
    .map((block) => {
      if (typeof block === "string") return block
      if (block?.type === "text" && typeof block.text === "string") return block.text
      if (block?.text && typeof block.text === "string") return block.text
      return ""
    })
    .filter(Boolean)
    .join("\n")
    .trim()
}

function toolNames(message) {
  const content = message?.content
  if (!Array.isArray(content)) return []
  const names = []
  for (const block of content) {
    const name = block?.name || block?.toolName || block?.tool_name
    if (
      (block?.type === "tool_use" || block?.type === "tool-call" || block?.type === "tool_call") &&
      typeof name === "string" &&
      name.trim()
    ) {
      names.push(name.trim())
    }
  }
  return names
}

function emptyStats() {
  return {
    sessionIds: new Set(),
    api_calls: 0,
    input_tokens: {
      total: 0,
      uncached: 0,
      cache_create: 0,
      cache_read: 0,
      pct_cached: 0,
    },
    output_tokens: 0,
    cost: 0,
    human_messages: 0,
    wall_ms: 0,
    cache_breaks_over_100k: 0,
    subagent: {
      calls: 0,
      tokens: 0,
      avg_tokens_per_call: 0,
    },
    span_from: undefined,
    span_to: undefined,
  }
}

function touchSpan(stats, ms) {
  if (!Number.isFinite(ms)) return
  const iso = new Date(ms).toISOString()
  if (!stats.span_from || iso < stats.span_from) stats.span_from = iso
  if (!stats.span_to || iso > stats.span_to) stats.span_to = iso
}

function addSession(stats, row, sessionTokens) {
  stats.sessionIds.add(rowSessionId(row) || "(unknown)")
  const started = rowStartedMs(row)
  const ended = rowEndedMs(row) ?? started
  if (started !== undefined && ended !== undefined) {
    stats.wall_ms += Math.max(0, ended - started)
    touchSpan(stats, started)
    touchSpan(stats, ended)
  }
  if (rowIsSubagent(row)) {
    stats.subagent.calls += 1
    stats.subagent.tokens += sessionTokens
  }
}

function addUsage(stats, usage) {
  stats.api_calls += 1
  stats.input_tokens.total += usage.input
  stats.input_tokens.uncached += usage.uncached
  stats.input_tokens.cache_create += usage.cacheWrite
  stats.input_tokens.cache_read += usage.cacheRead
  stats.output_tokens += usage.output
  stats.cost += usage.cost
  if (usage.uncached >= CACHE_BREAK_THRESHOLD) {
    stats.cache_breaks_over_100k += 1
  }
  touchSpan(stats, usage.ts)
}

function addPromptMessage(stats) {
  stats.human_messages += 1
}

function finalizeStats(stats) {
  const input = stats.input_tokens
  input.pct_cached = pct(input.cache_read, input.total)
  stats.sessions = stats.sessionIds.size
  delete stats.sessionIds
  stats.hours = {
    wall_clock: hours(stats.wall_ms),
    active: hours(stats.wall_ms),
  }
  delete stats.wall_ms
  stats.subagent.avg_tokens_per_call =
    stats.subagent.calls > 0
      ? Math.round(stats.subagent.tokens / stats.subagent.calls)
      : 0
  stats.span = stats.span_from && stats.span_to
    ? { from: stats.span_from, to: stats.span_to }
    : null
  delete stats.span_from
  delete stats.span_to
  return stats
}

function usageFromMessage(message, fallbackTs) {
  const metrics = message?.metrics
  if (!metrics) return undefined
  const input = Math.max(0, num(metrics.inputTokens))
  const output = Math.max(0, num(metrics.outputTokens))
  const cacheRead = Math.max(0, num(metrics.cacheReadTokens))
  const cacheWrite = Math.max(0, num(metrics.cacheWriteTokens))
  if (input === 0 && output === 0 && cacheRead === 0 && cacheWrite === 0) {
    return undefined
  }
  return {
    input,
    output,
    cacheRead,
    cacheWrite,
    uncached: Math.max(0, input - cacheRead - cacheWrite),
    cost: Math.max(0, num(metrics.cost)),
    ts: messageTs(message, fallbackTs),
  }
}

function slashCommand(text) {
  const match = /^\/([a-zA-Z0-9][\w:-]*)\b/.exec(text.trim())
  return match ? `/${match[1]}` : undefined
}

function contextAround(users, index) {
  if (index < 0) return []
  return users.slice(Math.max(0, index - 2), index + 3).map((item) => ({
    text: item.text.slice(0, 1200),
    ts: new Date(item.ts).toISOString(),
    calls: item.calls,
    here: item.index === index,
  }))
}

function makeBucket(map, key) {
  if (!map[key]) map[key] = emptyStats()
  return map[key]
}

function sessionRowsFromIndex(root) {
  const index = readJson(path.join(root, "sessions.index.json"))
  if (index?.sessions && typeof index.sessions === "object") {
    return Object.values(index.sessions)
  }
  const rows = []
  for (const entry of safeReadDir(root)) {
    if (!entry.isDirectory()) continue
    const sessionId = entry.name
    const manifestPath = path.join(root, sessionId, `${sessionId}.json`)
    const manifest = readJson(manifestPath)
    if (!manifest || typeof manifest !== "object") continue
    rows.push(manifestToRow(manifest, sessionId))
  }
  return rows
}

function safeReadDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }
}

function manifestToRow(manifest, fallbackSessionId) {
  return {
    ...manifest,
    sessionId: manifest.sessionId || manifest.session_id || fallbackSessionId,
    startedAt: manifest.startedAt || manifest.started_at,
    endedAt: manifest.endedAt || manifest.ended_at,
    updatedAt: manifest.updatedAt || manifest.updated_at,
    workspaceRoot: manifest.workspaceRoot || manifest.workspace_root,
    teamName: manifest.teamName || manifest.team_name,
    agentId: manifest.agentId || manifest.agent_id,
    isSubagent: manifest.isSubagent || manifest.is_subagent,
    messagesPath: manifest.messagesPath || manifest.messages_path,
  }
}

function discoverMessagePath(root, row) {
  const configuredPath =
    typeof row.messagesPath === "string" && row.messagesPath.trim()
      ? row.messagesPath.trim()
      : typeof row.messages_path === "string" && row.messages_path.trim()
        ? row.messages_path.trim()
        : ""
  if (configuredPath) {
    const absolute = path.isAbsolute(configuredPath)
      ? configuredPath
      : path.resolve(root, configuredPath)
    if (fs.existsSync(absolute)) return absolute
  }
  const id = rowSessionId(row)
  if (!id) return undefined
  const candidate = path.join(root, id, `${id}.messages.json`)
  return fs.existsSync(candidate) ? candidate : undefined
}

function loadSessions(root) {
  const rows = sessionRowsFromIndex(root)
  return rows.map((row) => ({
    row,
    messagesPath: discoverMessagePath(root, row),
  }))
}

function dayKey(ms) {
  return new Date(ms).toISOString().slice(0, 10)
}

function dayName(isoDate) {
  return new Date(`${isoDate}T00:00:00.000Z`).toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  })
}

function minuteOfDay(ms) {
  const d = new Date(ms)
  return d.getHours() * 60 + d.getMinutes()
}

function addDaySession(days, row, tokens) {
  const started = rowStartedMs(row)
  if (started === undefined) return
  const ended = rowEndedMs(row) ?? started
  const key = dayKey(started)
  const bucket = days.get(key) || {
    date: key,
    dow: dayName(key),
    tokens: 0,
    sessions: [],
    peak: 0,
    peak_at_min: 0,
  }
  bucket.tokens += tokens
  bucket.sessions.push({
    id: rowSessionId(row),
    project: projectName(row),
    start_min: minuteOfDay(started),
    end_min: Math.max(minuteOfDay(started) + 1, minuteOfDay(ended)),
    tokens,
  })
  days.set(key, bucket)
}

function computePeaks(day) {
  const events = []
  for (const s of day.sessions) {
    events.push([s.start_min, 1])
    events.push([s.end_min, -1])
  }
  let cur = 0
  for (const [minute, delta] of events.sort((a, b) => a[0] - b[0] || b[1] - a[1])) {
    cur += delta
    if (cur > day.peak) {
      day.peak = cur
      day.peak_at_min = minute
    }
  }
  day.sessions.sort((a, b) => a.start_min - b.start_min)
  return day
}

const overall = emptyStats()
const byProject = {}
const bySubagentType = {}
const bySkill = {}
const promptMap = new Map()
const cacheBreaks = []
const days = new Map()

let rowsSeen = 0
let filesRead = 0
let messagesSeen = 0

for (const { row, messagesPath } of loadSessions(ROOT)) {
  rowsSeen += 1
  const started = rowStartedMs(row)
  if (SINCE && started !== undefined && started < SINCE.getTime()) {
    continue
  }

  const payload = messagesPath ? readJson(messagesPath) : undefined
  const messages = Array.isArray(payload?.messages) ? payload.messages : []
  if (messagesPath && Array.isArray(payload?.messages)) filesRead += 1
  messagesSeen += messages.length

  const project = projectName(row)
  const projectStats = makeBucket(byProject, project)
  const subagentLabel = rowIsSubagent(row)
    ? (rowAgentId(row) || rowTeamName(row) || row.source || "subagent")
    : undefined
  const subagentStats = subagentLabel
    ? makeBucket(bySubagentType, subagentLabel)
    : undefined

  const users = []
  let currentUserIndex = -1
  let sessionTokens = 0

  for (const message of messages) {
    const fallbackTs = started ?? Date.now()
    if (message?.role === "user") {
      const text = messageText(message)
      if (text) {
        currentUserIndex = users.length
        users.push({
          index: currentUserIndex,
          text,
          ts: messageTs(message, fallbackTs),
          calls: 0,
        })
        addPromptMessage(overall)
        addPromptMessage(projectStats)
        if (subagentStats) addPromptMessage(subagentStats)
      }
      continue
    }

    if (message?.role !== "assistant") continue
    const usage = usageFromMessage(message, fallbackTs)
    const tools = toolNames(message)
    if (usage) {
      sessionTokens += usage.input + usage.output
      addUsage(overall, usage)
      addUsage(projectStats, usage)
      if (subagentStats) addUsage(subagentStats, usage)

      const user = users[currentUserIndex]
      if (user) {
        user.calls += 1
        const sessionId = rowSessionId(row)
        const key = `${sessionId || "session"}:${user.index}`
        const prompt = promptMap.get(key) || {
          text: user.text,
          ts: new Date(user.ts).toISOString(),
          project,
          session: sessionId,
          api_calls: 0,
          subagent_calls: rowIsSubagent(row) ? 1 : 0,
          input: { uncached: 0, cache_create: 0, cache_read: 0 },
          output: 0,
          total_tokens: 0,
          context: [],
        }
        prompt.api_calls += 1
        prompt.input.uncached += usage.uncached
        prompt.input.cache_create += usage.cacheWrite
        prompt.input.cache_read += usage.cacheRead
        prompt.output += usage.output
        prompt.total_tokens += usage.input + usage.output
        prompt.context = contextAround(users, user.index)
        promptMap.set(key, prompt)

        const command = slashCommand(user.text)
        if (command) {
          const commandStats = makeBucket(bySkill, command)
          commandStats.human_messages += 1
          addUsage(commandStats, usage)
          commandStats.sessionIds.add(sessionId)
        }

        if (usage.uncached >= CACHE_BREAK_THRESHOLD) {
          cacheBreaks.push({
            ts: new Date(usage.ts).toISOString(),
            session: sessionId,
            project,
            kind: rowIsSubagent(row) ? "subagent" : "main",
            agentType: subagentLabel,
            uncached: usage.uncached,
            total: usage.input,
            context: contextAround(users, user.index),
          })
        }
      }
    }

    for (const tool of tools) {
      const toolStats = makeBucket(bySkill, `tool:${tool}`)
      toolStats.sessionIds.add(rowSessionId(row))
      toolStats.api_calls += 1
    }
  }

  addSession(overall, row, sessionTokens)
  addSession(projectStats, row, sessionTokens)
  if (subagentStats) addSession(subagentStats, row, sessionTokens)
  addDaySession(days, row, sessionTokens)
}

const result = {
  generated_at: new Date().toISOString(),
  root: ROOT,
  since: SINCE_LABEL === "all" ? null : SINCE_LABEL,
  source: "cline-local-sessions",
  scan: {
    rows_seen: rowsSeen,
    message_files_read: filesRead,
    messages_seen: messagesSeen,
  },
  overall: finalizeStats(overall),
  by_project: Object.fromEntries(
    Object.entries(byProject).map(([key, value]) => [key, finalizeStats(value)])
  ),
  by_subagent_type: Object.fromEntries(
    Object.entries(bySubagentType).map(([key, value]) => [key, finalizeStats(value)])
  ),
  by_skill: Object.fromEntries(
    Object.entries(bySkill).map(([key, value]) => [key, finalizeStats(value)])
  ),
  by_day: [...days.values()].map(computePeaks).sort((a, b) => a.date.localeCompare(b.date)),
  top_prompts: [...promptMap.values()]
    .sort((a, b) => b.total_tokens - a.total_tokens)
    .slice(0, TOP_N),
  cache_breaks: cacheBreaks
    .sort((a, b) => b.uncached - a.uncached)
    .slice(0, 100),
}

function safeJsonForHtml(value) {
  return JSON.stringify(value, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

if (AS_JSON) {
  process.stdout.write(`${safeJsonForHtml(result)}\n`)
} else {
  const total = result.overall.input_tokens.total + result.overall.output_tokens
  process.stdout.write([
    `Cline session report source: ${ROOT}`,
    `Sessions: ${result.overall.sessions}`,
    `API calls: ${result.overall.api_calls}`,
    `Tokens: ${total}`,
    `Cache read: ${result.overall.input_tokens.pct_cached}% of input`,
    `Message files read: ${result.scan.message_files_read}`,
  ].join("\n") + "\n")
}
