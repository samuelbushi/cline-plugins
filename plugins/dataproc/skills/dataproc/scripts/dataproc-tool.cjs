#!/usr/bin/env node

const { spawn } = require("node:child_process")
const os = require("node:os")

const tools = new Set(["list_clusters", "get_cluster", "list_jobs", "get_job"])

function usage() {
	console.error("Usage: node dataproc-tool.cjs <tool-name> '<json-params>'")
	console.error("Tools: list_clusters, get_cluster, list_jobs, get_job")
}

const [toolName, params = "{}"] = process.argv.slice(2)

if (!tools.has(toolName)) {
	usage()
	process.exit(2)
}

if (!process.env.DATAPROC_PROJECT || !process.env.DATAPROC_REGION) {
	console.error("DATAPROC_PROJECT and DATAPROC_REGION must be set in the environment.")
	process.exit(2)
}

try {
	JSON.parse(params)
} catch (error) {
	console.error(`Invalid JSON params: ${error instanceof Error ? error.message : String(error)}`)
	process.exit(2)
}

const command = os.platform() === "win32" ? "npx.cmd" : "npx"
const args = [
	"--yes",
	"@toolbox-sdk/server@1.1.0",
	"--log-level",
	"error",
	"--prebuilt",
	"dataproc",
	"invoke",
	toolName,
	"--user-agent-metadata",
	"cline-plugin-dataproc",
	params,
]

const child = spawn(command, args, {
	shell: os.platform() === "win32",
	stdio: "inherit",
	env: process.env,
})

child.on("close", (code) => {
	process.exit(code ?? 1)
})

child.on("error", (error) => {
	console.error(`Error executing Dataproc Toolbox helper: ${error instanceof Error ? error.message : String(error)}`)
	process.exit(1)
})
