# Playground

Playground adds a Cline skill for building self-contained interactive HTML playgrounds. These are single-file tools with controls, live preview, and generated prompt output that users can copy into a follow-up Cline request.

## Cline Primitives

- Skill: `playground` guides Cline through choosing a playground type, loading a matching template, and creating a standalone HTML file.
- Templates: bundled references cover design playgrounds, data explorers, concept maps, document critique tools, diff review tools, and code architecture maps.

## Install

```bash
cline plugin install playground
```

For local development from this repository:

```bash
cline plugin install ./plugins/playground --cwd .
```

## Example Usage

After installation, ask Cline:

```text
Create an interactive playground for choosing the dashboard layout, density, and color treatment. Include a live preview and a prompt I can copy back into Cline.
```

## Requirements

No external service, API key, or install-time dependency is required. Generated playgrounds should inline their CSS and JavaScript and avoid CDN dependencies so they can be opened directly from the local file system.

## Trust Boundaries

Generated playgrounds may embed snippets from the user's code, documents, diffs, schemas, or data samples. Keep sensitive content out of generated HTML unless the user explicitly wants it included, and remind users that the resulting file is portable.

## License

Bundled playground skill content and templates are provided under the license in `LICENSE.playground`.
