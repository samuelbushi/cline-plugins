import { constants } from "node:fs";
import { access } from "node:fs/promises";
import { spawn, type ChildProcess } from "node:child_process";
import { tmpdir } from "node:os";
import { basename, delimiter, join } from "node:path";
import type { AgentPlugin } from "@cline/sdk";

const PLUGIN_NAME = "speak";
const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE_ID = "TX3LPaxmHKxFdv7VOQHJ";
const DEFAULT_MODEL_ID = "eleven_flash_v2_5";
const DEFAULT_OUTPUT_FORMAT = "mp3_44100_128";
const DEFAULT_MAX_CHARS = 3000;
const DEFAULT_PLAYERS = ["afplay", "ffplay", "mpg123", "mpg321", "play"];
const CONTINUATION_NOTICE = "Response continues in the terminal.";
const DETACHED_WORKER_STDIO: ["pipe", "ignore", "ignore"] = [
	"pipe",
	"ignore",
	"ignore",
];

let missingApiKeyWarningShown = false;

interface SpeechWorkerPayload {
	text: string;
	player: string;
	voiceId: string;
	modelId: string;
	outputFormat: string;
	ttsUrl: string;
}

const SPEECH_WORKER_SCRIPT = String.raw`
const { mkdir, mkdtemp, rm, stat, writeFile } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const { basename, join } = require("node:path");
const { spawn } = require("node:child_process");

const LOCK_STALE_MS = 10 * 60 * 1000;
const LOCK_RETRY_MS = 200;

function delay(ms) {
	return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

function readStdin() {
	return new Promise((resolveRead, rejectRead) => {
		let body = "";
		process.stdin.setEncoding("utf8");
		process.stdin.on("data", (chunk) => {
			body += chunk;
		});
		process.stdin.on("error", rejectRead);
		process.stdin.on("end", () => resolveRead(body));
	});
}

function isObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requiredString(value, field) {
	if (typeof value !== "string" || value.length === 0) {
		throw new Error(field + " must be a non-empty string");
	}
	return value;
}

function parsePayload(raw) {
	const parsed = JSON.parse(raw);
	if (!isObject(parsed)) {
		throw new Error("payload must be an object");
	}
	return {
		text: requiredString(parsed.text, "text"),
		player: requiredString(parsed.player, "player"),
		voiceId: requiredString(parsed.voiceId, "voiceId"),
		modelId: requiredString(parsed.modelId, "modelId"),
		outputFormat: requiredString(parsed.outputFormat, "outputFormat"),
		ttsUrl: requiredString(parsed.ttsUrl, "ttsUrl"),
	};
}

async function acquireLock() {
	const lockDir = join(tmpdir(), "cline-speak-audio.lock");
	while (true) {
		try {
			await mkdir(lockDir);
			return async () => {
				await rm(lockDir, { recursive: true, force: true });
			};
		} catch (error) {
			if (!error || error.code !== "EEXIST") {
				throw error;
			}
			try {
				const info = await stat(lockDir);
				if (Date.now() - info.mtimeMs > LOCK_STALE_MS) {
					await rm(lockDir, { recursive: true, force: true });
					continue;
				}
			} catch {
			}
			await delay(LOCK_RETRY_MS);
		}
	}
}

function playerArgs(player, filePath) {
	const command = basename(player).toLowerCase();
	if (command === "ffplay") {
		return ["-nodisp", "-autoexit", "-loglevel", "quiet", filePath];
	}
	return [filePath];
}

function playFile(player, filePath) {
	return new Promise((resolvePlay, rejectPlay) => {
		const child = spawn(player, playerArgs(player, filePath), {
			stdio: "ignore",
		});
		child.on("error", rejectPlay);
		child.on("close", (code) => {
			if (code === 0) {
				resolvePlay();
				return;
			}
			rejectPlay(new Error("audio player exited with code " + (code ?? "unknown")));
		});
	});
}

async function synthesizeSpeech(payload) {
	const apiKey = process.env.ELEVENLABS_API_KEY;
	if (!apiKey) {
		return Buffer.alloc(0);
	}

	const url =
		payload.ttsUrl +
		"/" +
		encodeURIComponent(payload.voiceId) +
		"?output_format=" +
		encodeURIComponent(payload.outputFormat);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "audio/mpeg",
			"xi-api-key": apiKey,
		},
		body: JSON.stringify({
			text: payload.text,
			model_id: payload.modelId,
			voice_settings: {
				stability: 0.45,
				similarity_boost: 0.8,
				style: 0.2,
				use_speaker_boost: true,
				speed: 1.03,
			},
		}),
	});

	if (!response.ok) {
		throw new Error("ElevenLabs returned HTTP " + response.status);
	}

	return Buffer.from(await response.arrayBuffer());
}

async function main() {
	let payload;
	try {
		payload = parsePayload(await readStdin());
	} catch {
		process.exitCode = 1;
		return;
	}

	let releaseLock = async () => {};
	let tempDir;
	try {
		releaseLock = await acquireLock();
		const audio = await synthesizeSpeech(payload);
		if (audio.length === 0) {
			return;
		}

		tempDir = await mkdtemp(join(tmpdir(), "cline-speak-audio-"));
		const audioPath = join(tempDir, "response.mp3");
		await writeFile(audioPath, audio);
		await playFile(payload.player, audioPath);
	} catch {
		process.exitCode = 1;
	} finally {
		await releaseLock().catch(() => undefined);
		if (tempDir) {
			await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
		}
	}
}

main();
`;

function env(name: string): string | undefined {
	const value = process.env[name]?.trim();
	return value && value.length > 0 ? value : undefined;
}

function envPositiveInt(name: string, fallback: number): number {
	const value = env(name);
	if (!value) {
		return fallback;
	}
	const parsed = Number.parseInt(value, 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function log(message: string): void {
	console.warn(`[${PLUGIN_NAME}] ${message}`);
}

function warnMissingApiKeyOnce(): void {
	if (missingApiKeyWarningShown) {
		return;
	}
	missingApiKeyWarningShown = true;
	log(
		[
			"ELEVENLABS_API_KEY is not set, so spoken replies are disabled.",
			"Create a key at https://elevenlabs.io/app/settings/api-keys, then run:",
			`echo 'export ELEVENLABS_API_KEY="your-api-key"' >> ~/.zshrc`,
			"source ~/.zshrc",
			"Restart Cline CLI after updating your shell.",
		].join("\n"),
	);
}

function normalizeForSpeech(text: string): string {
	return text.replace(/\s+/g, " ").trim();
}

function limitText(text: string, maxChars: number): string {
	if (text.length <= maxChars) {
		return text;
	}

	const suffix = ` ${CONTINUATION_NOTICE}`;
	const availableChars = Math.max(1, maxChars - suffix.length);
	return `${text.slice(0, availableChars).trimEnd()}${suffix}`;
}

function getTtsText(outputText: string): string | undefined {
	const normalized = normalizeForSpeech(outputText);
	if (!normalized) {
		return undefined;
	}
	const maxChars = envPositiveInt("ELEVENLABS_TTS_MAX_CHARS", DEFAULT_MAX_CHARS);
	return limitText(normalized, maxChars);
}

function isExplicitPath(command: string): boolean {
	return command.includes("/") || command.includes("\\");
}

async function canExecute(path: string): Promise<boolean> {
	try {
		await access(path, constants.X_OK);
		return true;
	} catch {
		return false;
	}
}

async function commandExists(command: string): Promise<boolean> {
	if (isExplicitPath(command)) {
		return canExecute(command);
	}

	const pathEnv = process.env.PATH ?? "";
	if (!pathEnv) {
		return false;
	}

	const extensions =
		process.platform === "win32"
			? (process.env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM").split(";")
			: [""];

	for (const directory of pathEnv.split(delimiter)) {
		if (!directory) {
			continue;
		}
		for (const extension of extensions) {
			if (await canExecute(join(directory, `${command}${extension}`))) {
				return true;
			}
		}
	}

	return false;
}

async function resolvePlayer(): Promise<string | undefined> {
	const configured = env("ELEVENLABS_TTS_PLAYER");
	if (configured) {
		if (await commandExists(configured)) {
			return configured;
		}
		log(`configured player was not found or is not executable: ${configured}`);
	}

	for (const player of DEFAULT_PLAYERS) {
		if (await commandExists(player)) {
			return player;
		}
	}

	return undefined;
}

function isNodeRuntime(value: string | undefined): boolean {
	const trimmed = value?.trim();
	if (!trimmed) {
		return false;
	}
	const name = basename(trimmed).toLowerCase();
	return (
		name === "node" ||
		name === "node.exe" ||
		name === "bun" ||
		name === "bun.exe"
	);
}

function resolveWorkerRuntime(): string {
	for (const candidate of [
		env("CLINE_JS_RUNTIME_PATH"),
		process.execPath,
		env("BUN_EXEC_PATH"),
		env("npm_node_execpath"),
		env("NODE"),
	]) {
		if (isNodeRuntime(candidate)) {
			return candidate;
		}
	}
	return "node";
}

function errorCode(error: unknown): string | undefined {
	if (!error || typeof error !== "object" || !("code" in error)) {
		return undefined;
	}
	const code = (error as { code?: unknown }).code;
	return typeof code === "string" ? code : undefined;
}

function writeToChildStdin(child: ChildProcess, payload: string): Promise<void> {
	const stdin = child.stdin;
	if (!stdin) {
		return Promise.resolve();
	}
	return new Promise((resolveWrite, rejectWrite) => {
		const onError = (error: Error) => {
			stdin.off("error", onError);
			const code = errorCode(error);
			if (code === "EPIPE" || code === "ERR_STREAM_DESTROYED") {
				resolveWrite();
				return;
			}
			rejectWrite(error);
		};
		stdin.once("error", onError);
		stdin.end(payload, (error?: Error | null) => {
			stdin.off("error", onError);
			if (!error) {
				resolveWrite();
				return;
			}
			const code = errorCode(error);
			if (code === "EPIPE" || code === "ERR_STREAM_DESTROYED") {
				resolveWrite();
				return;
			}
			rejectWrite(error);
		});
	});
}

async function spawnSpeechWorker(payload: SpeechWorkerPayload): Promise<void> {
	const child = spawn(resolveWorkerRuntime(), ["-e", SPEECH_WORKER_SCRIPT], {
		cwd: process.cwd(),
		detached: true,
		env: process.env,
		stdio: DETACHED_WORKER_STDIO,
	});

	await new Promise<void>((resolveSpawn, rejectSpawn) => {
		child.once("spawn", () => resolveSpawn());
		child.once("error", rejectSpawn);
	});
	await writeToChildStdin(child, JSON.stringify(payload));
	child.unref();
}

async function launchSpeechWorker(text: string): Promise<void> {
	if (!env("ELEVENLABS_API_KEY")) {
		warnMissingApiKeyOnce();
		return;
	}

	const player = await resolvePlayer();
	if (!player) {
		log(
			"no supported audio player found. Install afplay, ffplay, mpg123, mpg321, or play, or set ELEVENLABS_TTS_PLAYER.",
		);
		return;
	}

	await spawnSpeechWorker({
		text,
		player,
		voiceId: env("ELEVENLABS_VOICE_ID") ?? DEFAULT_VOICE_ID,
		modelId: env("ELEVENLABS_MODEL_ID") ?? DEFAULT_MODEL_ID,
		outputFormat: DEFAULT_OUTPUT_FORMAT,
		ttsUrl: ELEVENLABS_TTS_URL,
	});
}

const plugin: AgentPlugin = {
	name: PLUGIN_NAME,
	manifest: {
		capabilities: ["rules", "hooks"],
	},

	setup(api) {
		api.registerRule({
			id: `${PLUGIN_NAME}:conversational-output`,
			source: PLUGIN_NAME,
			content: [
				"Speak is active, so every normal user-facing response should sound like a brief spoken reply.",
				"Keep normal replies to at most three sentences total.",
				"Do not use bullet lists, numbered lists, tables, headings, or report-like summaries unless the user explicitly asks for that format or the task cannot be answered clearly without it.",
				"Prefer casual, direct prose with contractions where natural.",
			].join("\n"),
		});
	},

	hooks: {
		afterRun({ result }) {
			if (result.status !== "completed") {
				return undefined;
			}

			const text = getTtsText(result.outputText);
			if (!text) {
				return undefined;
			}

			return launchSpeechWorker(text).catch((error: unknown) => {
				const message = error instanceof Error ? error.message : String(error);
				log(`failed to start speech worker: ${message}`);
			});
		},
	},
};

export { plugin };
export default plugin;
