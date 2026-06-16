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
import {
	isAbsolute,
	join,
	relative,
	resolve,
} from "node:path";
import {
	type AgentPlugin,
	type AgentToolContext,
	createTool,
} from "@cline/core";

type BuildSystem = "auto" | "maven" | "gradle" | "javac";

type CommandSpec = {
	buildSystem: Exclude<BuildSystem, "auto">;
	command: string;
	args: string[];
	cwd: string;
	note?: string;
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
const MAX_JAVA_FILES = 500;
const SKIP_DIRS = new Set([
	".git",
	".gradle",
	".idea",
	".mvn",
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
		value === "maven" ||
		value === "gradle" ||
		value === "javac" ||
		value === "auto" ||
		value === undefined
	) {
		return value ?? "auto";
	}
	throw new Error("buildSystem must be one of: auto, maven, gradle, javac");
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
): { root: string; buildSystem: Exclude<BuildSystem, "auto"> } | undefined {
	let dir = statSync(startPath).isDirectory() ? startPath : resolve(startPath, "..");
	while (isWithinDirectory(workspaceRoot, dir)) {
		const hasMaven =
			existsSync(join(dir, "pom.xml")) ||
			existsSync(join(dir, "mvnw")) ||
			existsSync(join(dir, "mvnw.cmd"));
		const hasGradle =
			existsSync(join(dir, "build.gradle")) ||
			existsSync(join(dir, "build.gradle.kts")) ||
			existsSync(join(dir, "gradlew")) ||
			existsSync(join(dir, "gradlew.bat"));

		if ((buildSystem === "auto" || buildSystem === "maven") && hasMaven) {
			return { root: dir, buildSystem: "maven" };
		}
		if ((buildSystem === "auto" || buildSystem === "gradle") && hasGradle) {
			return { root: dir, buildSystem: "gradle" };
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
	const wrapper = findWrapper(projectRoot, workspaceRoot, unixName, winName);
	if (wrapper) return wrapper;
	const localName = process.platform === "win32" ? winName : unixName;
	const localPath = join(projectRoot, localName);
	if (existsSync(localPath)) {
		return localPath;
	}
	return fallbackName;
}

function collectJavaFiles(root: string): string[] {
	const files: string[] = [];
	function walk(dir: string) {
		if (files.length > MAX_JAVA_FILES) return;
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const path = join(dir, entry.name);
			if (entry.isDirectory()) {
				if (!SKIP_DIRS.has(entry.name)) walk(path);
			} else if (entry.isFile() && entry.name.endsWith(".java")) {
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
	const wantsMaven = buildSystem === "auto" || buildSystem === "maven";
	const wantsGradle = buildSystem === "auto" || buildSystem === "gradle";
	const nearestBuildRoot = findNearestBuildRoot(
		targetPath,
		workspaceRoot,
		buildSystem,
	);

	if (wantsMaven && nearestBuildRoot?.buildSystem === "maven") {
		const root = nearestBuildRoot.root;
		const command = executableInProject(
			root,
			workspaceRoot,
			"mvnw",
			"mvnw.cmd",
			"mvn",
		);
		return {
			buildSystem: "maven",
			command,
			args: ["-q", "-DskipTests", "compile"],
			cwd: root,
			shell: process.platform === "win32" && command.endsWith(".cmd"),
			note: "Runs Maven compile with tests skipped. If the project or a parent directory has mvnw, this uses the project wrapper.",
		};
	}
	if (buildSystem === "maven") {
		throw new Error("No pom.xml or Maven wrapper found for the requested path");
	}

	if (wantsGradle && nearestBuildRoot?.buildSystem === "gradle") {
		const root = nearestBuildRoot.root;
		const command = executableInProject(
			root,
			workspaceRoot,
			"gradlew",
			"gradlew.bat",
			"gradle",
		);
		return {
			buildSystem: "gradle",
			command,
			args: ["--no-daemon", "--console=plain", "classes"],
			cwd: root,
			shell: process.platform === "win32" && command.endsWith(".bat"),
			note: "Runs Gradle classes. If the project or a parent directory has gradlew, this uses the project wrapper.",
		};
	}
	if (buildSystem === "gradle") {
		throw new Error("No Gradle build file or wrapper found for the requested path");
	}

	const javacRoot = statSync(targetPath).isDirectory()
		? targetPath
		: resolve(targetPath, "..");
	const javaFiles = collectJavaFiles(javacRoot);
	if (javaFiles.length === 0) {
		throw new Error("No Java files found for javac diagnostics");
	}
	if (javaFiles.length > MAX_JAVA_FILES) {
		throw new Error(
			`Found more than ${MAX_JAVA_FILES} Java files; use Maven or Gradle for this project`,
		);
	}

	const tempDir = mkdtempSync(join(tmpdir(), "cline-java-diagnostics-"));
	const classesDir = join(tempDir, "classes");
	mkdirSync(classesDir, { recursive: true });
	return {
		buildSystem: "javac",
		command: "javac",
		args: ["-Xlint:all", "-d", classesDir, ...javaFiles],
		cwd: javacRoot,
		tempDir,
		note: "Runs javac directly for small Java source trees without Maven or Gradle. Dependency-aware projects should use their build system.",
	};
}

function truncateOutput(text: string): string {
	if (text.length <= MAX_OUTPUT_CHARS) return text;
	return `${text.slice(0, MAX_OUTPUT_CHARS).trimEnd()}\n\n[truncated]`;
}

function runCommand(spec: CommandSpec, timeoutMs: number): Promise<CommandResult> {
	return new Promise((resolveRun, reject) => {
		const child = spawn(spec.command, spec.args, {
			cwd: spec.cwd,
			env: { ...process.env, NO_COLOR: "1", TERM: "dumb" },
			shell: spec.shell,
			stdio: ["ignore", "pipe", "pipe"],
		});

		let stdout = "";
		let stderr = "";
		let timedOut = false;

		const timeout = setTimeout(() => {
			timedOut = true;
			child.kill("SIGTERM");
		}, timeoutMs);

		child.stdout?.on("data", (chunk) => {
			stdout = truncateOutput(stdout + chunk.toString());
		});
		child.stderr?.on("data", (chunk) => {
			stderr = truncateOutput(stderr + chunk.toString());
		});
		child.on("error", reject);
		child.on("close", (exitCode, signal) => {
			clearTimeout(timeout);
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

async function javaBuildDiagnostics(
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
	name: "jdtls-lsp",
	manifest: { capabilities: ["tools"] },

	setup(api) {
		api.registerTool(
			createTool({
				name: "java_build_diagnostics",
				description:
					"Run Java compile diagnostics for the current workspace. Detects Maven, Gradle, or small javac-only projects and returns bounded stdout/stderr.",
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
							enum: ["auto", "maven", "gradle", "javac"],
							description:
								"Build system to use. Defaults to auto-detecting Maven, then Gradle, then javac.",
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
					return javaBuildDiagnostics(input, context);
				},
			}),
		);
	},
};

export { plugin };
export default plugin;
