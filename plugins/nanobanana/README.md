# nanobanana

Generates images through OpenRouter and saves them into the workspace.

## What It Does

Registers `generate_image`, which sends a text prompt to an image-capable Gemini model through OpenRouter. The tool accepts an output path, aspect ratio, and image size, then writes the returned image files inside the workspace root.

## Install

```bash
cline plugin install nanobanana
```

For local development from this repository:

```bash
cline plugin install ./plugins/nanobanana --cwd .
```

## Requirements

- `OPENROUTER_API_KEY`
- Optional `IMAGE_MODEL` to override the default model.

## Security Notes

Output paths are resolved inside the workspace root. The plugin refuses paths that escape the workspace.

