# turnstile-spin (skill)

End-to-end setup skill for Cloudflare Turnstile. Loads when an agent is asked to add Turnstile, set up CAPTCHA, or protect a form from bots.

This is a mirror of the canonical docs page at [`developers.cloudflare.com/turnstile/spin`](https://developers.cloudflare.com/turnstile/spin/). If the two disagree, the docs page wins.

## Layout

| File                              | Purpose                                                                |
| --------------------------------- | ---------------------------------------------------------------------- |
| `SKILL.md`                        | Main wizard instructions for the agent                                 |
| `references/vanilla-html.md`      | Code snippet for static / vanilla HTML projects                        |
| `references/nextjs-app.md`        | Code snippet for Next.js App Router projects                           |
| `references/nextjs-pages.md`      | Code snippet for Next.js Pages Router projects                         |
| `references/astro.md`             | Code snippet for Astro projects                                        |
| `references/sveltekit.md`         | Code snippet for SvelteKit projects                                    |
| `references/hugo.md`              | Code snippet for Hugo projects                                         |
| `tests/validation.md`             | Validation cases matching the MVP rows in the PRD                      |

## How Cline loads it

This skill is bundled with the Cline Cloudflare plugin. Install or enable the plugin rather than copying the skill into a project-local skills directory.

## Source Notes

The canonical Turnstile Spin docs live at `developers.cloudflare.com/turnstile/spin`. This bundled Cline copy includes small compatibility edits for plugin packaging and secret handling.

## Related

- [Canonical docs page](https://developers.cloudflare.com/turnstile/spin/)
- [`cloudflare/turnstile-siteverify`](https://github.com/cloudflare/turnstile-siteverify)  -  the managed Worker that this skill deploys
- [`cloudflare/skills`](https://github.com/cloudflare/skills)  -  root index for all Cloudflare agent skills
