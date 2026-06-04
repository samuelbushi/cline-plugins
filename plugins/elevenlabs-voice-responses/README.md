# elevenlabs-voice-responses

Speaks Cline replies out loud with ElevenLabs text to speech.

## What It Does

Registers a conversational response rule and an `afterRun` hook. When a Cline turn completes successfully, the plugin sends the final assistant reply to ElevenLabs, saves the returned MP3 to a temporary file, plays it with a local audio player, then removes the temporary file.

The only required configuration is `ELEVENLABS_API_KEY`. Voice, model, output format, playback detection, and reply length limits have defaults.

## Install

```bash
cline plugin install elevenlabs-voice-responses
```

For local development from this repository:

```bash
cline plugin install ./plugins/elevenlabs-voice-responses --cwd .
```

## Setup

Create an ElevenLabs API key at:

```text
https://elevenlabs.io/app/settings/api-keys
```

Add it to your zsh environment:

```bash
echo 'export ELEVENLABS_API_KEY="your-api-key"' >> ~/.zshrc
source ~/.zshrc
```

Restart Cline CLI after updating your shell environment so the plugin process can read the key.

## Defaults

- Voice: Charlotte, `XB0fDUnXU5powFXDhCwa`
- Model: `eleven_flash_v2_5`
- Output format: `mp3_44100_128`
- Max spoken text: `3000` characters per reply
- Audio players checked in order: `afplay`, `ffplay`, `mpg123`, `mpg321`, `play`

If no supported player is installed, the agent run still completes and the plugin logs setup guidance.

## Optional Overrides

```bash
export ELEVENLABS_VOICE_ID="XB0fDUnXU5powFXDhCwa"
export ELEVENLABS_MODEL_ID="eleven_flash_v2_5"
export ELEVENLABS_TTS_MAX_CHARS="3000"
export ELEVENLABS_TTS_PLAYER="ffplay"
```

`ELEVENLABS_TTS_PLAYER` should be a command name or executable path. If you use `ffplay`, the plugin supplies quiet audio playback flags automatically.

## Audio Player Setup

macOS includes `afplay`.

On systems without a default MP3 player, install one of:

```bash
brew install ffmpeg
brew install mpg123
```

or on Debian or Ubuntu:

```bash
sudo apt-get install ffmpeg
sudo apt-get install mpg123
```

## Security Notes

Assistant reply text is sent to ElevenLabs for speech generation. Do not enable this plugin for workflows where replies may contain secrets, customer data, private code, or other sensitive information that should not be sent to ElevenLabs.

Keep your API key in your shell environment or another local secret store. Do not commit it to a repository.
