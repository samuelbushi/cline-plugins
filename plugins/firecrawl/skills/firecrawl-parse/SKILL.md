---
name: firecrawl-parse
description: |
  Extract and convert local files such as PDF, DOCX, DOC, ODT, RTF, XLSX, XLS, or HTML into clean markdown saved to disk with Firecrawl. Use when the user explicitly asks to use Firecrawl for local file parsing, AI summaries, or document Q&A. Confirm before uploading any local file to Firecrawl.
---

# firecrawl parse

Turn a local document into clean markdown on disk. Supports PDF, DOCX, DOC, ODT, RTF, XLSX, XLS, HTML/HTM/XHTML.

## When to use

- You have a file on disk (not a URL) and want its text as markdown
- User drops a PDF/DOCX and explicitly approves uploading it to Firecrawl for parsing
- Use `scrape` instead when the source is a URL

## Quick start

Confirm the user is comfortable uploading the local file to Firecrawl before every parse operation. Do not infer approval merely because the user attached or referenced a local file.

Always save to `.firecrawl/` with `-o` - parsed docs can be hundreds of KB and blow up context if streamed to stdout. Ask before adding `.firecrawl/` to `.gitignore`.

```bash
mkdir -p .firecrawl

# File -> markdown
firecrawl parse ./paper.pdf -o .firecrawl/paper.md

# AI summary
firecrawl parse ./paper.pdf -S -o .firecrawl/paper-summary.md

# Ask a question about the doc
firecrawl parse ./paper.pdf -Q "What are the main conclusions?" \
  -o .firecrawl/paper-qa.md
```

Then `head`, `grep`, `rg` etc., or incrementally read the file - don't load the whole thing at once.

## Options

| Option                 | Description                             |
| ---------------------- | --------------------------------------- |
| `-S, --summary`        | AI-generated summary                    |
| `-Q, --query <prompt>` | Ask a question about the parsed content |
| `-o, --output <path>`  | Output file path - always use this  |
| `-f, --format <fmt>`   | `markdown` (default), `html`, `summary` |
| `--timeout <ms>`       | Timeout for the parse job               |
| `--timing`             | Show request duration                   |

## Tips

- Quote paths with spaces: `firecrawl parse "./My Doc.pdf" -o .firecrawl/mydoc.md`.
- Max upload size: 50 MB per file.
- Credits: ~1 per PDF page; HTML is 1 flat.
- Check `.firecrawl/` before re-parsing the same file.
- To check your credit balance (recommended for batch processing and similar workflows), use the `firecrawl credit-usage` command.

## See also

- [firecrawl-scrape](../firecrawl-scrape/SKILL.md) - same idea for URLs
