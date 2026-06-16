---
name: figma-diagrams
description: Generate accurate FigJam diagrams with Figma MCP by grounding Mermaid diagrams in code, docs, or user-provided process details.
---

# Figma Diagrams

Use this skill when the user asks to create or update a diagram in Figma or FigJam, including architecture diagrams, flowcharts, sequence diagrams, entity relationship diagrams, state machines, and Gantt charts.

## Workflow

1. Gather source truth before writing Mermaid. Read code, docs, tickets, schemas, or user-provided notes that describe the system.
2. Choose the diagram type:
   - Architecture or service topology: flowchart with service, datastore, queue, client, and external boundaries.
   - API calls or auth flows: sequence diagram.
   - Database models: entity relationship diagram.
   - State transitions: state diagram.
   - Schedule or rollout: Gantt chart.
3. Keep Mermaid syntax conservative. Use simple node ids, quoted labels for special characters, and no HTML.
4. Do not invent missing entities or edges. Leave gaps visible or ask a focused question.
5. Use `figma__generate_diagram` to create the base diagram.
6. Reuse the same FigJam file for iterations when the user is refining one diagram.
7. Use `figma__use_figma` only when the diagram needs extra labels, sections, callouts, or layout work beyond base Mermaid output.

## Guardrails

- Do not use diagram generation for unsupported chart types. Offer a FigJam board or manual canvas composition instead.
- Ask before creating many diagrams or replacing an existing FigJam board.
- Keep diagrams readable for humans. Prefer a smaller accurate diagram over a dense generated map of every code symbol.
