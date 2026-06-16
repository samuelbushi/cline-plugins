import { spawn } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { type AgentPlugin, createTool } from "@cline/core";

interface LiquidThemeDiagnosticsInput {
	path?: string;
	timeoutMs?: number;
}

interface LiquidThemeDiagnosticsOutput {
	command: string;
	cwd: string;
	exitCode: number | null;
	signal: string | null;
	timedOut: boolean;
	stdout: string;
	stderr: string;
}

const DEFAULT_TIMEOUT_MS = 55_000;
const MAX_TIMEOUT_MS = 55_000;
const MAX_OUTPUT_CHARS = 20_000;

let workspaceRoot = process.cwd();

function clampTimeout(value: unknown): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return DEFAULT_TIMEOUT_MS;
	}
	return Math.min(Math.max(Math.trunc(value), 1_000), MAX_TIMEOUT_MS);
}

function asString(value: unknown): string | undefined {
	return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseInput(input: unknown): LiquidThemeDiagnosticsInput {
	if (!input || typeof input !== "object") {
		return {};
	}
	const record = input as Record<string, unknown>;
	return {
		path: asString(record.path),
		timeoutMs:
			typeof record.timeoutMs === "number" ? record.timeoutMs : undefined,
	};
}

function assertWithinWorkspace(path: string): void {
	const rel = relative(workspaceRoot, path);
	if (rel.startsWith("..") || isAbsolute(rel)) {
		throw new Error("path must stay inside the active workspace");
	}
}

function resolveThemeDirectory(rawPath: string | undefined): string {
	const target = rawPath
		? isAbsolute(rawPath)
			? resolve(rawPath)
			: resolve(workspaceRoot, rawPath)
		: workspaceRoot;
	assertWithinWorkspace(target);
	if (!existsSync(target)) {
		throw new Error(`Theme path does not exist: ${target}`);
	}
	if (!statSync(target).isDirectory()) {
		throw new Error(`Theme path must be a directory: ${target}`);
	}
	return target;
}

function appendBoundedOutput(
	current: string,
	chunk: unknown,
	onTruncated: () => void,
): string {
	const next = current + String(chunk);
	if (next.length <= MAX_OUTPUT_CHARS) {
		return next;
	}
	onTruncated();
	return next.slice(-MAX_OUTPUT_CHARS);
}

function formatBoundedOutput(text: string, truncated: boolean): string {
	const trimmed = text.trim();
	return truncated ? `[truncated earlier output]\n${trimmed}` : trimmed;
}

async function runThemeCheck(
	cwd: string,
	timeoutMs: number,
): Promise<LiquidThemeDiagnosticsOutput> {
	return await new Promise((resolvePromise, reject) => {
		const child = spawn("shopify", ["theme", "check"], {
			cwd,
			detached: process.platform !== "win32",
			stdio: ["ignore", "pipe", "pipe"],
		});

		let stdout = "";
		let stderr = "";
		let stdoutTruncated = false;
		let stderrTruncated = false;
		let timedOut = false;
		let settled = false;

		const finish = (
			exitCode: number | null,
			signal: NodeJS.Signals | null,
		): void => {
			if (settled) {
				return;
			}
			settled = true;
			clearTimeout(timer);
			resolvePromise({
				command: "shopify theme check",
				cwd,
				exitCode,
				signal,
				timedOut,
				stdout: formatBoundedOutput(stdout, stdoutTruncated),
				stderr: formatBoundedOutput(stderr, stderrTruncated),
			});
		};

		const killProcess = (): void => {
			timedOut = true;
			if (process.platform !== "win32" && child.pid) {
				try {
					process.kill(-child.pid, "SIGTERM");
				} catch {}
			} else {
				child.kill("SIGTERM");
			}
			setTimeout(() => {
				if (settled) {
					return;
				}
				if (process.platform !== "win32" && child.pid) {
					try {
						process.kill(-child.pid, "SIGKILL");
					} catch {}
				} else {
					child.kill("SIGKILL");
				}
			}, 2_000).unref();
		};

		const timer = setTimeout(killProcess, timeoutMs);

		child.stdout?.on("data", (chunk) => {
			stdout = appendBoundedOutput(stdout, chunk, () => {
				stdoutTruncated = true;
			});
		});
		child.stderr?.on("data", (chunk) => {
			stderr = appendBoundedOutput(stderr, chunk, () => {
				stderrTruncated = true;
			});
		});
		child.on("error", (error) => {
			settled = true;
			clearTimeout(timer);
			reject(
				error instanceof Error && "code" in error && error.code === "ENOENT"
					? new Error(
							"Shopify CLI was not found. Install @shopify/cli and make sure `shopify` is on PATH.",
						)
					: error,
			);
		});
		child.on("close", finish);
	});
}

const liquidThemeDiagnostics = createTool<
	LiquidThemeDiagnosticsInput,
	LiquidThemeDiagnosticsOutput
>({
	name: "liquid_theme_diagnostics",
	description:
		"Run `shopify theme check` in a Shopify Liquid theme directory and return bounded diagnostics output.",
	inputSchema: {
		type: "object",
		properties: {
			path: {
				type: "string",
				description:
					"Optional theme directory inside the workspace. Defaults to the workspace root.",
			},
			timeoutMs: {
				type: "number",
				description:
					"Optional timeout in milliseconds. Defaults to 55000 and is capped at 55000.",
			},
		},
		additionalProperties: false,
	},
	retryable: false,
	async execute(rawInput) {
		const input = parseInput(rawInput);
		const cwd = resolveThemeDirectory(input.path);
		return await runThemeCheck(cwd, clampTimeout(input.timeoutMs));
	},
});

const plugin: AgentPlugin = {
	name: "shopify-liquid",
	manifest: {
		capabilities: ["tools", "skills"],
	},

	setup(api, ctx) {
		workspaceRoot = ctx.workspaceInfo?.rootPath?.trim() || process.cwd();
		api.registerTool(liquidThemeDiagnostics);
	},
};

export { plugin };
export default plugin;
