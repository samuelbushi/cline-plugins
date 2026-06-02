import { mkdir, writeFile } from "node:fs/promises"
import { dirname, isAbsolute, relative, resolve } from "node:path"
import { type AgentPlugin, createTool } from "@cline/sdk"

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
const DEFAULT_MODEL =
	process.env.IMAGE_MODEL?.trim() || "google/gemini-3-pro-image-preview"

const VALID_ASPECT_RATIOS = [
	"1:1", "2:3", "3:2", "3:4", "4:3",
	"4:5", "5:4", "9:16", "16:9", "21:9",
] as const
type AspectRatio = (typeof VALID_ASPECT_RATIOS)[number]

const VALID_SIZES = ["1K", "2K", "4K"] as const
type ImageSize = (typeof VALID_SIZES)[number]

const INPUT_KEYS = new Set(["prompt", "output", "aspect_ratio", "size"])

interface GenerateImageInput {
	prompt: string
	output?: string
	aspect_ratio?: AspectRatio
	size?: ImageSize
}

interface SavedImage {
	path: string
	bytes: number
	mimeType: string
}

interface GenerateImageOutput {
	model: string
	saved: SavedImage[]
	message?: string
}

interface OpenRouterImage {
	image_url?: { url?: string }
}

interface OpenRouterChoice {
	message?: {
		content?: string
		images?: OpenRouterImage[]
	}
}

interface OpenRouterResponse {
	choices?: OpenRouterChoice[]
	error?: { message?: string } | string
}

function messageFromCaught(error: unknown): string {
	return error instanceof Error ? error.message : String(error)
}

function isInsideRoot(root: string, target: string): boolean {
	const relativePath = relative(root, target)
	return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath))
}

function resolveOutputPath(workspaceRoot: string | undefined, output: string | undefined): string {
	const fallback = `nanobanana-${Date.now()}.png`
	const raw = output?.trim() || fallback
	const root = resolve(workspaceRoot && workspaceRoot.trim() ? workspaceRoot : process.cwd())
	const target = isAbsolute(raw) ? resolve(raw) : resolve(root, raw)
	if (!isInsideRoot(root, target)) {
		throw new Error("output must resolve inside the workspace root")
	}
	return target
}

function extensionForMime(mime: string): string {
	if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg"
	if (mime.includes("webp")) return "webp"
	if (mime.includes("gif")) return "gif"
	return "png"
}

function withIndexSuffix(path: string, index: number, ext: string): string {
	const dot = path.lastIndexOf(".")
	const stem = dot === -1 ? path : path.slice(0, dot)
	return `${stem}_${index + 1}.${ext}`
}

function parseDataUrl(dataUrl: string): { mime: string; buffer: Buffer } {
	const match = /^data:([^;,]+)(;base64)?,(.*)$/s.exec(dataUrl)
	if (!match) {
		throw new Error("Model returned a malformed image data URL")
	}
	const mime = match[1] || "image/png"
	const isBase64 = Boolean(match[2])
	const payload = match[3]
	const buffer = isBase64
		? Buffer.from(payload, "base64")
		: Buffer.from(decodeURIComponent(payload), "utf8")
	return { mime, buffer }
}

function extractErrorMessage(value: unknown): string | undefined {
	if (!value) return undefined
	if (typeof value === "string") return value
	if (isRecord(value)) {
		const message = value.message
		if (typeof message === "string") return message
	}
	return undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isAspectRatio(value: string): value is AspectRatio {
	return (VALID_ASPECT_RATIOS as readonly string[]).includes(value)
}

function isImageSize(value: string): value is ImageSize {
	return (VALID_SIZES as readonly string[]).includes(value)
}

function parseGenerateImageInput(input: unknown): GenerateImageInput {
	if (!isRecord(input)) {
		throw new Error("generate_image input must be an object")
	}
	const extraKeys = Object.keys(input).filter((key) => !INPUT_KEYS.has(key))
	if (extraKeys.length > 0) {
		throw new Error(`generate_image input has unsupported field(s): ${extraKeys.join(", ")}`)
	}

	const prompt = typeof input.prompt === "string" ? input.prompt.trim() : undefined
	if (!prompt) {
		throw new Error("generate_image input.prompt must be a non-empty string")
	}

	let output: string | undefined
	if (input.output !== undefined) {
		if (typeof input.output !== "string") {
			throw new Error("generate_image input.output must be a string")
		}
		output = input.output
	}

	let aspect_ratio: AspectRatio | undefined
	if (input.aspect_ratio !== undefined) {
		if (typeof input.aspect_ratio !== "string" || !isAspectRatio(input.aspect_ratio)) {
			throw new Error(
				`generate_image input.aspect_ratio must be one of: ${VALID_ASPECT_RATIOS.join(", ")}`,
			)
		}
		aspect_ratio = input.aspect_ratio
	}

	let size: ImageSize | undefined
	if (input.size !== undefined) {
		if (typeof input.size !== "string" || !isImageSize(input.size)) {
			throw new Error(`generate_image input.size must be one of: ${VALID_SIZES.join(", ")}`)
		}
		size = input.size
	}

	return { prompt, output, aspect_ratio, size }
}

const generateImageTool = (workspaceRoot: string | undefined) =>
	createTool<unknown, GenerateImageOutput | { error: string }>({
		name: "generate_image",
		description:
			"Generate an image from a text prompt using Google's nano-banana " +
			"(Gemini 3 Pro image) model via OpenRouter and save it to disk. " +
			"Use when the user asks for an image, illustration, mockup, diagram, " +
			"or any visual asset. The saved file path is returned so you can show it " +
			"to the user or reference it in follow-up edits. " +
			"Requires OPENROUTER_API_KEY in the plugin host environment.",
		inputSchema: {
			type: "object",
			properties: {
				prompt: {
					type: "string",
					description:
						"What to draw. Be specific about subject, style, framing, and color. " +
						"Long prompts work better than short ones.",
				},
				output: {
					type: "string",
					description:
						"Optional path to save the image. Relative paths resolve from the " +
						"workspace root. Defaults to nanobanana-<timestamp>.png in the workspace root. " +
						"Must stay inside the workspace root.",
				},
				aspect_ratio: {
					type: "string",
					enum: [...VALID_ASPECT_RATIOS],
					description: "Aspect ratio of the generated image. Defaults to 1:1.",
				},
				size: {
					type: "string",
					enum: [...VALID_SIZES],
					description: "Image resolution. Defaults to 1K.",
				},
			},
			required: ["prompt"],
			additionalProperties: false,
		},
		timeoutMs: 120_000,
		retryable: false,
		execute: async (rawInput) => {
			const apiKey = process.env.OPENROUTER_API_KEY?.trim()
			if (!apiKey) {
				return { error: "Set OPENROUTER_API_KEY to use generate_image" }
			}

			let input: GenerateImageInput
			try {
				input = parseGenerateImageInput(rawInput)
			} catch (err) {
				return { error: messageFromCaught(err) }
			}

			const aspectRatio = input.aspect_ratio ?? "1:1"
			const size = input.size ?? "1K"
			let outputPath: string
			try {
				outputPath = resolveOutputPath(workspaceRoot, input.output)
			} catch (err) {
				return { error: messageFromCaught(err) }
			}

			const payload = {
				model: DEFAULT_MODEL,
				messages: [{ role: "user", content: input.prompt }],
				modalities: ["image", "text"],
				image_config: { aspect_ratio: aspectRatio, image_size: size },
			}

			let response: Response
			try {
				response = await fetch(OPENROUTER_ENDPOINT, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${apiKey}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(payload),
				})
			} catch (err) {
				return { error: `Network error calling OpenRouter: ${messageFromCaught(err)}` }
			}

			const rawBody = await response.text()
			let body: OpenRouterResponse
			try {
				body = rawBody ? (JSON.parse(rawBody) as OpenRouterResponse) : {}
			} catch {
				return { error: `OpenRouter returned non-JSON (${response.status}): ${rawBody.slice(0, 200)}` }
			}

			if (!response.ok) {
				const msg = extractErrorMessage(body.error) ?? response.statusText
				return { error: `OpenRouter HTTP ${response.status}: ${msg}` }
			}
			if (body.error) {
				return { error: `OpenRouter error: ${extractErrorMessage(body.error) ?? "unknown"}` }
			}

			const choice = body.choices?.[0]
			const images = choice?.message?.images ?? []
			if (images.length === 0) {
				return {
					error:
						"Model returned no images. It may have refused or returned text only. " +
						`Model said: ${choice?.message?.content ?? "(no text)"}`,
				}
			}

			const saved: SavedImage[] = []
			try {
				await mkdir(dirname(outputPath), { recursive: true })

				for (let i = 0; i < images.length; i++) {
					const dataUrl = images[i]?.image_url?.url
					if (!dataUrl) continue
					const { mime, buffer } = parseDataUrl(dataUrl)
					const ext = extensionForMime(mime)
					const target = images.length === 1 ? outputPath : withIndexSuffix(outputPath, i, ext)
					await writeFile(target, buffer)
					saved.push({ path: target, bytes: buffer.length, mimeType: mime })
				}
			} catch (err) {
				return { error: messageFromCaught(err) }
			}

			if (saved.length === 0) {
				return { error: "Images in response had no usable data URLs" }
			}

			return {
				model: DEFAULT_MODEL,
				saved,
				message: choice?.message?.content?.trim() || undefined,
			}
		},
	})

let workspaceRoot: string | undefined

const plugin: AgentPlugin = {
	name: "nanobanana",
	manifest: { capabilities: ["tools"] },

	setup(api, ctx) {
		workspaceRoot = ctx.workspaceInfo?.rootPath
		api.registerTool(generateImageTool(workspaceRoot))
	},
}

export default plugin
