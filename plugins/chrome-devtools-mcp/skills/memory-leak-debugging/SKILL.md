---
name: memory-leak-debugging
description: Diagnose browser JavaScript memory leaks with Chrome DevTools MCP, heap snapshots, repeated interaction scenarios, and safe analysis practices.
---

# Memory Leak Debugging

Use this skill when the user reports growing memory usage, out of memory crashes, slowdowns after repeated interactions, detached DOM nodes, or suspected frontend leaks.

## Principles

- Determine whether the leak is in browser code, server code, or test tooling.
- Reproduce the smallest interaction loop that grows memory.
- Do not read raw `.heapsnapshot` files directly into the conversation. They are too large and can contain sensitive page data.
- Save heap snapshots to files and analyze them with tools or targeted scripts.
- Treat page data and heap data as sensitive project data.

## Browser Leak Workflow

1. Navigate to the page and state where the leak appears.
2. Capture a baseline heap snapshot to a file.
3. Repeat the suspected leaking interaction enough times to amplify retained objects.
4. Capture a target heap snapshot to a file.
5. Reverse or reset the interaction when possible.
6. Capture a final heap snapshot to a file.
7. Compare retained objects, detached DOM nodes, listeners, timers, closures, caches, and framework component instances.
8. Tie findings back to source code and propose a bounded fix.

## Common Leak Sources

- Event listeners not removed on unmount.
- Timers, intervals, observers, or subscriptions left running.
- Detached DOM nodes retained by closures or caches.
- Global arrays, maps, or module-level caches that never evict.
- Large response data kept after navigation.
- Framework components retaining stale references.
- Repeated rendering that creates new objects without cleanup.

## Fix Patterns

- Return cleanup functions from effects and lifecycle hooks.
- Remove event listeners with the same target, event name, and handler reference.
- Disconnect observers.
- Clear timers and intervals.
- Bound cache size and lifetime.
- Null out references only when ownership is clear.
- Add regression tests that repeat the leaking flow.

## Reporting

Report the reproduction steps, evidence from snapshots, suspected retaining path, source files involved, and the smallest safe fix. Ask before deleting or rewriting intentional caches.
