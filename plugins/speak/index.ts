import {
	accessSync,
	constants,
	mkdtempSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { spawn } from "node:child_process";
import type { AgentPlugin } from "@cline/sdk";

const PLUGIN_NAME = "speak";
const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE_ID = "TX3LPaxmHKxFdv7VOQHJ";
const DEFAULT_MODEL_ID = "eleven_flash_v2_5";
const DEFAULT_OUTPUT_FORMAT = "mp3_44100_128";
const DEFAULT_MAX_CHARS = 3000;
const DEFAULT_PLAYERS = ["afplay", "ffplay", "mpg123", "mpg321", "play"];
const CONTINUATION_NOTICE = "Response continues in the terminal.";

let missingApiKeyWarningShown = false;

const SPEECH_WORKER_SCRIPT = String.raw`
const { mkdir, readFile, rm, stat, writeFile } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const { basename, dirname, join } = require("node:path");
const { spawn } = require("node:child_process");

const LOCK_STALE_MS = 10 * 60 * 1000;
const LOCK_RETRY_MS = 200;

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
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
				// Ignore stale lock cleanup races.
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
	return new Promise((resolve, reject) => {
		const child = spawn(player, playerArgs(player, filePath), {
			stdio: "ignore",
		});
		child.on("error", reject);
		child.on("close", (code) => {
			if (code === 0) {
				resolve();
				return;
			}
			reject(new Error("audio player exited with code " + (code ?? "unknown")));
		});
	});
}

async function synthesizeSpeech(payload) {
	const apiKey = process.env.ELEVENLABS_API_KEY;
	if (!apiKey) {
		return Buffer.alloc(0);
	}

	const url = payload.ttsUrl + "/" + encodeURIComponent(payload.voiceId) + "?output_format=" + encodeURIComponent(payload.outputFormat);
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
		const body = (await response.text()).replace(/\s+/g, " ").trim();
		const detail = body ? ": " + body.slice(0, 300) : "";
		throw new Error("ElevenLabs returned HTTP " + response.status + detail);
	}

	return Buffer.from(await response.arrayBuffer());
}

async function main() {
	const payloadPath = process.argv[2];
	if (!payloadPath) {
		return;
	}

	const workerDir = dirname(payloadPath);
	let releaseLock = async () => {};
	try {
		const payload = JSON.parse(await readFile(payloadPath, "utf8"));
		if (
			typeof payload.text !== "string" ||
			typeof payload.player !== "string" ||
			typeof payload.voiceId !== "string" ||
			typeof payload.modelId !== "string" ||
			typeof payload.outputFormat !== "string" ||
			typeof payload.ttsUrl !== "string"
		) {
			return;
		}

		releaseLock = await acquireLock();
		const audio = await synthesizeSpeech(payload);
		if (audio.length === 0) {
			return;
		}

		const audioPath = join(workerDir, "response.mp3");
		await writeFile(audioPath, audio);
		await playFile(payload.player, audioPath);
	} finally {
		await releaseLock().catch(() => undefined);
		await rm(workerDir, { recursive: true, force: true }).catch(() => undefined);
	}
}

main().catch(() => {
	process.exitCode = 1;
});
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
	return limitText(
		normalized,
		envPositiveInt("ELEVENLABS_TTS_MAX_CHARS", DEFAULT_MAX_CHARS),
	);
}

function isExplicitPath(command: string): boolean {
	return command.includes("/") || command.includes("\\");
}

function canExecute(path: string): boolean {
	try {
		accessSync(path, constants.X_OK);
		return true;
	} catch {
		return false;
	}
}

function commandExists(command: string): boolean {
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
			if (canExecute(join(directory, `${command}${extension}`))) {
				return true;
			}
		}
	}

	return false;
}

function resolvePlayer(): string | undefined {
	const configured = env("ELEVENLABS_TTS_PLAYER");
	if (configured) {
		if (commandExists(configured)) {
			return configured;
		}
		log(`configured player was not found or is not executable: ${configured}`);
	}

	for (const player of DEFAULT_PLAYERS) {
		if (commandExists(player)) {
			return player;
		}
	}

	return undefined;
}

function cleanupWorkerDir(workerDir: string): void {
	rmSync(workerDir, { recursive: true, force: true });
}

function launchSpeechWorker(text: string): void {
	if (!env("ELEVENLABS_API_KEY")) {
		warnMissingApiKeyOnce();
		return;
	}

	const player = resolvePlayer();
	if (!player) {
		log(
			"no supported audio player found. Install afplay, ffplay, mpg123, mpg321, or play, or set ELEVENLABS_TTS_PLAYER.",
		);
		return;
	}

	const workerDir = mkdtempSync(join(tmpdir(), "cline-speak-worker-"));
	const workerPath = join(workerDir, "worker.cjs");
	const payloadPath = join(workerDir, "payload.json");

	try {
		writeFileSync(workerPath, SPEECH_WORKER_SCRIPT, { mode: 0o700 });
		writeFileSync(
			payloadPath,
			JSON.stringify({
				text,
				player,
				voiceId: env("ELEVENLABS_VOICE_ID") ?? DEFAULT_VOICE_ID,
				modelId: env("ELEVENLABS_MODEL_ID") ?? DEFAULT_MODEL_ID,
				outputFormat: DEFAULT_OUTPUT_FORMAT,
				ttsUrl: ELEVENLABS_TTS_URL,
			}),
			{ mode: 0o600 },
		);

		const child = spawn(process.execPath, [workerPath, payloadPath], {
			detached: true,
			stdio: "ignore",
			env: process.env,
		});
		child.on("error", (error: unknown) => {
			cleanupWorkerDir(workerDir);
			const message = error instanceof Error ? error.message : String(error);
			log(`failed to start speech worker: ${message}`);
		});
		child.unref();
	} catch (error) {
		cleanupWorkerDir(workerDir);
		const message = error instanceof Error ? error.message : String(error);
		log(`failed to prepare speech worker: ${message}`);
	}
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

			launchSpeechWorker(text);
			return undefined;
		},
	},
};

export { plugin };
export default plugin;
