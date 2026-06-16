---
name: debug-optimize-lcp
description: Debug and optimize Largest Contentful Paint with Chrome DevTools MCP performance traces, network analysis, and targeted frontend fixes.
---

# Debug And Optimize LCP

Use this skill when the user asks about slow page loads, Largest Contentful Paint, Core Web Vitals, hero image loading, render blocking resources, or main content appearing too late.

## LCP Targets

- Good: 2.5 seconds or less.
- Needs improvement: more than 2.5 seconds and up to 4.0 seconds.
- Poor: more than 4.0 seconds.

LCP is the time from navigation start until the largest visible image or text block renders.

## Debugging Workflow

1. Navigate to the target page.
2. Record a performance trace with reload so the full page load is captured.
3. Inspect trace insights for LCP breakdown, document latency, render blocking resources, and LCP discovery.
4. Identify the LCP element with trace output and targeted `evaluate_script` when needed.
5. Use network tools to inspect the LCP resource request, timing, size, priority, and cache behavior.
6. Map the bottleneck to a specific code, asset, server, or rendering fix.
7. Rerun the trace after changes to verify the bottleneck moved or improved.

## LCP Subparts

Every LCP result is usually explained by four parts:

| Subpart | What it measures | Common fix |
| --- | --- | --- |
| TTFB | Time until first byte of HTML | cache, edge rendering, backend latency, fewer redirects |
| Resource load delay | Time before the LCP resource starts loading | discover image earlier, remove lazy loading, preload |
| Resource load duration | Time to download the LCP resource | compress, resize, CDN, modern image format |
| Element render delay | Time after resource load before render | reduce render blocking CSS or JS, SSR main content |

The delay subparts should usually be close to zero.

## Common Fixes

- Do not lazy-load the LCP image.
- Use a normal `src` on the LCP image when possible.
- Add `fetchpriority="high"` to the LCP image.
- Preload the LCP image when it is not discoverable early in HTML.
- Serve correctly sized responsive images.
- Use WebP or AVIF when supported.
- Inline critical CSS or reduce blocking CSS.
- Defer non-critical JavaScript.
- Render the main content in the initial HTML when possible.
- Improve server response time and cacheability.

## Verification

Do not stop at a single audit score. Compare before and after traces, including the LCP element and subpart timings. If lab results are inconsistent, explain the variance and use repeated measurements.
