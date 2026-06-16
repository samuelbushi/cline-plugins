# save-to-spotify

Create polished audio episodes and save them to Spotify from Cline.

## What It Does

This plugin bundles the `save-to-spotify` skill and its reference material for producing audio episodes with TTS narration, cover art, show notes, rich timeline chapters, in-player images, external links, Spotify entity cards, and uploads through the `save-to-spotify` CLI.

The skill can also guide raw media saves, show and episode management, timeline updates, Spotify catalog URI lookups, and audio assembly workflows.

## Install

```bash
cline plugin install save-to-spotify
```

For local development from this repository:

```bash
cline plugin install ./plugins/save-to-spotify --cwd .
```

## Requirements

- The `save-to-spotify` CLI for authentication, uploads, show/episode management, and timeline updates.
- Spotify authentication through the CLI before uploads or private account operations.
- A user-selected TTS provider and `ffmpeg`/`ffprobe` for generated audio workflows.
- API keys or local models only when the user chooses paid or external TTS/image providers.
- Rights to reproduce and transform the source content into an audio episode.

## Security Notes

The bundled skill asks for explicit user confirmation before installing the CLI, authenticating with Spotify, uploading audio, creating shows, updating timelines, generating paid TTS or images, fetching third-party sources, or publishing QR/shareable outputs. Keep Spotify tokens, source media, generated audio, and unpublished episode metadata out of logs and commits.

## Attribution

The bundled skill material is derived from Spotify's `save-to-spotify` plugin materials, licensed under Apache-2.0. See `NOTICE.save-to-spotify`.
