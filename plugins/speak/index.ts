import { constants } from "node:fs";
import { access, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, delimiter, join } from "node:path";
import { spawn } from "node:child_process";
import type { AgentPlugin } from "@cline/sdk";

const PLUGIN_NAME = "speak";
const ELEVENLABS_TTS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_VOICE_ID = "bIHbv24MWmeRgasZH58o";
const DEFAULT_MODEL_ID = "eleven_flash_v2_5";
const DEFAULT_OUTPUT_FORMAT = "mp3_44100_128";
const DEFAULT_MAX_CHARS = 3000;
const DEFAULT_PLAYERS = ["afplay", "ffplay", "mpg123", "mpg321", "play"];
const CONTINUATION_NOTICE = "Response continues in the terminal.";

let playbackQueue: Promise<void> = Promise.resolve();
let missingApiKeyWarningShown = false;

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

function playerArgs(player: string, filePath: string): string[] {
	const command = basename(player).toLowerCase();
	if (command === "ffplay") {
		return ["-nodisp", "-autoexit", "-loglevel", "quiet", filePath];
	}
	return [filePath];
}

function playFile(player: string, filePath: string): Promise<void> {
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
			reject(new Error(`audio player exited with code ${code ?? "unknown"}`));
		});
	});
}

async function synthesizeSpeech(text: string): Promise<Buffer> {
	const apiKey = env("ELEVENLABS_API_KEY");
	if (!apiKey) {
		warnMissingApiKeyOnce();
		return Buffer.alloc(0);
	}

	const voiceId = env("ELEVENLABS_VOICE_ID") ?? DEFAULT_VOICE_ID;
	const modelId = env("ELEVENLABS_MODEL_ID") ?? DEFAULT_MODEL_ID;
	const url = `${ELEVENLABS_TTS_URL}/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(DEFAULT_OUTPUT_FORMAT)}`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "audio/mpeg",
			"xi-api-key": apiKey,
		},
		body: JSON.stringify({
			text,
			model_id: modelId,
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
		const detail = body ? `: ${body.slice(0, 300)}` : "";
		throw new Error(`ElevenLabs returned HTTP ${response.status}${detail}`);
	}

	return Buffer.from(await response.arrayBuffer());
}

async function speakText(text: string): Promise<void> {
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

	const audio = await synthesizeSpeech(text);
	if (audio.length === 0) {
		return;
	}
	const tempDir = await mkdtemp(join(tmpdir(), "cline-elevenlabs-"));
	const audioPath = join(tempDir, "response.mp3");
	try {
		await writeFile(audioPath, audio);
		await playFile(player, audioPath);
	} finally {
		await rm(tempDir, { recursive: true, force: true });
	}
}

function enqueueSpeech(text: string): Promise<void> {
	const next = playbackQueue
		.catch(() => undefined)
		.then(() => speakText(text))
		.catch((error: unknown) => {
			const message = error instanceof Error ? error.message : String(error);
			log(message);
		});
	playbackQueue = next;
	return next;
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
				"When producing user-facing text, respond in a natural conversational style that sounds good when read aloud.",
				"Prefer concise, direct sentences and avoid stiff report-like phrasing unless the user asks for it.",
				"Keep structure useful, but do not over-format simple replies.",
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

			return enqueueSpeech(text);
		},
	},
};

export { plugin };
export default plugin;
