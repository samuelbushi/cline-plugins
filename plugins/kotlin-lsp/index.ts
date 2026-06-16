import { spawn } from "node:child_process";
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	rmSync,
	statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { isAbsolute, join, relative, resolve } from "node:path";
import {
	type AgentPlugin,
	type AgentToolContext,
	createTool,
} from "@cline/core";

type BuildSystem = "auto" | "gradle" | "maven" | "kotlinc";

type CommandSpec = {
	buildSystem: Exclude<BuildSystem, "auto">;
	command: string;
	args: string[];
	cwd: string;
	note: string;
	tempDir?: string;
	shell?: boolean;
};

type CommandResult = {
	exitCode: number | null;
	signal: NodeJS.Signals | null;
	timedOut: boolean;
	stdout: string;
	stderr: string;
};

const DEFAULT_TIMEOUT_MS = 60_000;
const MIN_TIMEOUT_MS = 10_000;
const MAX_TIMEOUT_MS = 180_000;
const MAX_OUTPUT_CHARS = 20_000;
const MAX_KOTLIN_FILES = 500;
const SKIP_DIRS = new Set([
	".git",
	".gradle",
	".idea",
	"build",
	"node_modules",
	"out",
	"target",
]);

function asObject(value: unknown): Record<string, unknown> {
	return value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};
}

function asString(value: unknown): string | undefined {
	return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
	return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function parseBuildSystem(value: unknown): BuildSystem {
	if (
		value === "auto" ||
		value === "gradle" ||
		value === "maven" ||
		value === "kotlinc" ||
		value === undefined
	) {
		return value ?? "auto";
	}
	throw new Error("buildSystem must be one of: auto, gradle, maven, kotlinc");
}

function clampTimeout(timeoutMs: number | undefined): number {
	if (!timeoutMs) return DEFAULT_TIMEOUT_MS;
	const timeout = Math.trunc(timeoutMs);
	return Math.min(Math.max(timeout, MIN_TIMEOUT_MS), MAX_TIMEOUT_MS);
}

function isWithinDirectory(parent: string, child: string): boolean {
	const rel = relative(parent, child);
	return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

function resolveTargetPath(baseCwd: string, inputPath: string | undefined) {
	const base = resolve(baseCwd);
	const target = inputPath ? resolve(base, inputPath) : base;
	if (!isWithinDirectory(base, target)) {
		throw new Error(`path must stay inside the workspace: ${base}`);
	}
	if (!existsSync(target)) {
		throw new Error(`path does not exist: ${target}`);
	}
	return target;
}

function findNearestBuildRoot(
	startPath: string,
	workspaceRoot: string,
	buildSystem: BuildSystem,
): { root: string; buildSystem: Exclude<BuildSystem, "auto" | "kotlinc"> } | undefined {
	let dir = statSync(startPath).isDirectory()
		? startPath
		: resolve(startPath, "..");
	while (isWithinDirectory(workspaceRoot, dir)) {
		const hasGradle =
			existsSync(join(dir, "settings.gradle")) ||
			existsSync(join(dir, "settings.gradle.kts")) ||
			existsSync(join(dir, "build.gradle")) ||
			existsSync(join(dir, "build.gradle.kts")) ||
			existsSync(join(dir, "gradlew")) ||
			existsSync(join(dir, "gradlew.bat"));
		const hasMaven =
			existsSync(join(dir, "pom.xml")) ||
			existsSync(join(dir, "mvnw")) ||
			existsSync(join(dir, "mvnw.cmd"));

		if ((buildSystem === "auto" || buildSystem === "gradle") && hasGradle) {
			return { root: dir, buildSystem: "gradle" };
		}
		if ((buildSystem === "auto" || buildSystem === "maven") && hasMaven) {
			return { root: dir, buildSystem: "maven" };
		}

		const parent = resolve(dir, "..");
		if (parent === dir) return undefined;
		dir = parent;
	}
	return undefined;
}

function findWrapper(
	startRoot: string,
	workspaceRoot: string,
	unixName: string,
	winName: string,
): string | undefined {
	let dir = startRoot;
	while (isWithinDirectory(workspaceRoot, dir)) {
		const localName = process.platform === "win32" ? winName : unixName;
		const localPath = join(dir, localName);
		if (existsSync(localPath)) return localPath;
		const parent = resolve(dir, "..");
		if (parent === dir) return undefined;
		dir = parent;
	}
	return undefined;
}

function executableInProject(
	projectRoot: string,
	workspaceRoot: string,
	unixName: string,
	winName: string,
	fallbackName: string,
) {
	return findWrapper(projectRoot, workspaceRoot, unixName, winName) ?? fallbackName;
}

function collectKotlinFiles(root: string): string[] {
	const files: string[] = [];
	function walk(dir: string) {
		if (files.length > MAX_KOTLIN_FILES) return;
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, entry.name);
			if (entry.isDirectory()) {
				if (!SKIP_DIRS.has(entry.name)) walk(path);
			} else if (entry.isFile() && entry.name.endsWith(".kt")) {
				files.push(path);
			}
		}
	}
	walk(root);
	return files;
}

function createCommandSpec(
	targetPath: string,
	workspaceRoot: string,
	buildSystem: BuildSystem,
): CommandSpec {
	const nearestBuildRoot = findNearestBuildRoot(
		targetPath,
		workspaceRoot,
		buildSystem,
	);

	if (nearestBuildRoot?.buildSystem === "gradle") {
		const command = executableInProject(
			nearestBuildRoot.root,
			workspaceRoot,
			"gradlew",
			"gradlew.bat",
			"gradle",
		);
		return {
			buildSystem: "gradle",
			command,
			args: ["--no-daemon", "--console=plain", "classes"],
			cwd: nearestBuildRoot.root,
			shell: process.platform === "win32" && command.endsWith(".bat"),
			note: "Runs Gradle classes for JVM-style Kotlin builds. If the project or a parent directory has gradlew, this uses the project wrapper.",
		};
	}
	if (buildSystem === "gradle") {
		throw new Error("No Gradle build file or wrapper found for the requested path");
	}

	if (nearestBuildRoot?.buildSystem === "maven") {
		const command = executableInProject(
			nearestBuildRoot.root,
			workspaceRoot,
			"mvnw",
			"mvnw.cmd",
			"mvn",
		);
		return {
			buildSystem: "maven",
			command,
			args: ["-q", "-DskipTests", "compile"],
			cwd: nearestBuildRoot.root,
			shell: process.platform === "win32" && command.endsWith(".cmd"),
			note: "Runs Maven compile with tests skipped. If the project or a parent directory has mvnw, this uses the project wrapper.",
		};
	}
	if (buildSystem === "maven") {
		throw new Error("No pom.xml or Maven wrapper found for the requested path");
	}

	const kotlincRoot = statSync(targetPath).isDirectory()
		? targetPath
		: resolve(targetPath, "..");
	const kotlinFiles = collectKotlinFiles(kotlincRoot);
	if (kotlinFiles.length === 0) {
		throw new Error("No .kt files found for kotlinc diagnostics");
	}
	if (kotlinFiles.length > MAX_KOTLIN_FILES) {
		throw new Error(
			`Found more than ${MAX_KOTLIN_FILES} Kotlin files; use Gradle or Maven for this project`,
		);
	}

	const tempDir = mkdtempSync(join(tmpdir(), "cline-kotlin-diagnostics-"));
	const outDir = join(tempDir, "classes");
	mkdirSync(outDir, { recursive: true });
	return {
		buildSystem: "kotlinc",
		command: "kotlinc",
		args: ["-d", outDir, ...kotlinFiles],
		cwd: kotlincRoot,
		tempDir,
		note: "Runs kotlinc directly for small Kotlin source trees without Gradle or Maven. Dependency-aware projects should use their build system.",
	};
}

function appendBoundedOutput(current: string, chunk: unknown): string {
	const next = current + String(chunk);
	if (next.length <= MAX_OUTPUT_CHARS) return next;
	const marker = "[truncated earlier output]\n";
	return marker + next.slice(-(MAX_OUTPUT_CHARS - marker.length));
}

function runCommand(spec: CommandSpec, timeoutMs: number): Promise<CommandResult> {
	return new Promise((resolveRun, reject) => {
		const child = spawn(spec.command, spec.args, {
			cwd: spec.cwd,
			detached: process.platform !== "win32",
			env: { ...process.env, NO_COLOR: "1", TERM: "dumb" },
			shell: spec.shell,
			stdio: ["ignore", "pipe", "pipe"],
		});

		let stdout = "";
		let stderr = "";
		let timedOut = false;
		let killTimer: ReturnType<typeof setTimeout> | undefined;

		function killChild(signal: NodeJS.Signals) {
			if (!child.pid) return;
			try {
				if (process.platform === "win32") {
					child.kill(signal);
				} else {
					process.kill(-child.pid, signal);
				}
			} catch {
				// Best effort cleanup; the process may have already exited.
			}
		}

		const timeout = setTimeout(() => {
			timedOut = true;
			killChild("SIGTERM");
			killTimer = setTimeout(() => {
				killChild("SIGKILL");
			}, 2_000);
		}, timeoutMs);

		child.stdout?.on("data", (chunk) => {
			stdout = appendBoundedOutput(stdout, chunk);
		});
		child.stderr?.on("data", (chunk) => {
			stderr = appendBoundedOutput(stderr, chunk);
		});
		child.on("error", (error) => {
			clearTimeout(timeout);
			if (killTimer) clearTimeout(killTimer);
			reject(error);
		});
		child.on("close", (exitCode, signal) => {
			clearTimeout(timeout);
			if (killTimer) clearTimeout(killTimer);
			resolveRun({
				exitCode,
				signal,
				timedOut,
				stdout: stdout.trim(),
				stderr: stderr.trim(),
			});
		});
	});
}

async function kotlinBuildDiagnostics(
	input: unknown,
	context: AgentToolContext,
) {
	const args = asObject(input);
	const targetPath = resolveTargetPath(context.cwd, asString(args.path));
	const buildSystem = parseBuildSystem(args.buildSystem);
	const timeoutMs = clampTimeout(asNumber(args.timeoutMs));
	const spec = createCommandSpec(targetPath, resolve(context.cwd), buildSystem);

	try {
		const result = await runCommand(spec, timeoutMs);
		return {
			success: result.exitCode === 0 && !result.timedOut,
			buildSystem: spec.buildSystem,
			command: [spec.command, ...spec.args],
			cwd: spec.cwd,
			exitCode: result.exitCode,
			signal: result.signal,
			timedOut: result.timedOut,
			stdout: result.stdout,
			stderr: result.stderr,
			note: spec.note,
		};
	} finally {
		if (spec.tempDir) {
			rmSync(spec.tempDir, { recursive: true, force: true });
		}
	}
}

const plugin: AgentPlugin = {
	name: "kotlin-lsp",
	manifest: { capabilities: ["tools"] },

	setup(api) {
		api.registerTool(
			createTool({
				name: "kotlin_build_diagnostics",
				description:
					"Run Kotlin compile diagnostics for the current workspace. Detects JVM-style Gradle, Maven, or small kotlinc-only projects and returns bounded stdout/stderr.",
				inputSchema: {
					type: "object",
					properties: {
						path: {
							type: "string",
							description:
								"Workspace-relative file or directory to diagnose. Defaults to the workspace root.",
						},
						buildSystem: {
							type: "string",
							enum: ["auto", "gradle", "maven", "kotlinc"],
							description:
								"Build system to use. Defaults to auto-detecting JVM-style Gradle, then Maven, then kotlinc.",
						},
						timeoutMs: {
							type: "integer",
							description:
								"Timeout in milliseconds, clamped between 10000 and 180000. Defaults to 60000.",
						},
					},
					additionalProperties: false,
				},
				timeoutMs: MAX_TIMEOUT_MS + 5_000,
				retryable: false,
				async execute(input, context) {
					return kotlinBuildDiagnostics(input, context);
				},
			}),
		);
	},
};

export { plugin };
export default plugin;
