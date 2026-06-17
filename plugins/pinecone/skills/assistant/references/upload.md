# Upload Files

Upload files or directory contents to a Pinecone Assistant.

Supported formats: `.md`, `.txt`, `.pdf`, `.docx`, `.json`
Not supported: Source code (`.py`, `.js`, `.ts`, etc.) - Assistant is optimized for natural language documents.

## Arguments

- `--assistant` (required): Assistant name
- `--source` (required): File path or directory to upload
- `--patterns` (optional): Comma-separated glob patterns - default: `*.md,*.txt,*.pdf,*.docx,*.json`
- `--exclude` (optional): Directories to exclude - default: `node_modules,.venv,.git,build,dist`
- `--metadata` (optional): JSON string of additional metadata
- `--dry-run` (optional): Preview matching files without uploading
- `--yes` (optional): Skip the confirmation prompt after the user has approved the upload

## Workflow

1. Parse arguments. If missing, list assistants and ask the user to select.
2. Use Glob to preview files. Show count and types.
3. If code files detected: Warn user and automatically filter them out:
   ```
     Found 50 Python files. Assistant works with documents only - I'll skip the code files.
   Found 25 Markdown and 8 PDF files to upload instead.
   ```
4. Ask the user to confirm before proceeding.
5. Execute:
   ```bash
   cd <pinecone-assistant-skill-directory>
   uv run scripts/upload.py \
     --assistant "assistant-name" \
     --source "./docs" \
     --patterns "*.md,*.pdf" \
     --dry-run

   # After the user approves the preview:
   uv run scripts/upload.py \
     --assistant "assistant-name" \
     --source "./docs" \
     --patterns "*.md,*.pdf" \
     --yes
   ```
6. Show progress and results. Remind user files are being indexed.

## Default Exclusions

`node_modules`, `.venv`, `venv`, `.git`, `build`, `dist`, `__pycache__`, `.next`, `.cache`

## Metadata Best Practices

```bash
--metadata '{"source":"github","repo":"owner/repo","branch":"main"}'
```

## Troubleshooting

No files found - check patterns match file types in directory; verify path exists.
Upload failures - check file format is supported; try smaller batches.
>100 files - ask user if they want to be more selective; suggest `./docs` subdirectory.
