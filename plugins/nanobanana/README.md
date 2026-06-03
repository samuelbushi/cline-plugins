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

## Example Usage

After installation, ask Cline:

```text
Generate a 16:9 product mockup image for our release notes and save it to assets/release-hero.png.
```

Cline can call `generate_image` with the requested prompt, aspect ratio, output path, and image size, then save the generated image inside the workspace.

## Requirements

- `OPENROUTER_API_KEY`
- Optional `IMAGE_MODEL` to override the default model.

## Security Notes

Output paths are resolved inside the workspace root. The plugin refuses paths that escape the workspace.
