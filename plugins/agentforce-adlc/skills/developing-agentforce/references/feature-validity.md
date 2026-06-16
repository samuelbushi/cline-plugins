# Feature Validity by Context

> Key distinction: Many action metadata properties are valid on action definitions with targets (`flow://`, `apex://`) but NOT on utility actions (`@utils.transition`).
>
> Use this as a companion to `actions-reference.md`, not a replacement.

| Feature | On `@utils.transition` | On action definitions with `target:` | Notes |
|---------|------------------------|---------------------------------------|-------|
| `label:` on subagents | [MISSING] | [OK] | Valid on subagent blocks |
| `label:` on actions | [MISSING] | [OK] | Valid on Level 1 action definitions |
| `label:` on I/O fields | [MISSING] | [OK] | Valid on inputs/outputs |
| `require_user_confirmation:` | [MISSING] | [OK] | Compiles; runtime no-op |
| `include_in_progress_indicator:` | [MISSING] | [OK] | Shows spinner during action execution |
| `progress_indicator_message:` | [MISSING] | [OK] | Works on both `flow://` and `apex://` |
| `output_instructions:` | [MISSING] | ? Untested | Not tested on target-backed actions |
| `always_expect_input:` | [MISSING] | [MISSING] | NOT implemented anywhere |

What works on `@utils.transition` actions:
```yaml
actions:
   go_next: @utils.transition to @subagent.next
      description: "Navigate to next subagent"   # [OK] ONLY description works
```

What works on action definitions with `target:`:
```yaml
actions:
   process_order:
      label: "Process Order"                            # [OK] Display label
      description: "Process the customer's order"       # [OK] LLM description
      require_user_confirmation: True                   # [OK] Compiles (runtime issue)
      include_in_progress_indicator: True               # [OK] Shows spinner
      progress_indicator_message: "Processing..."       # [OK] Custom spinner message
      inputs:
         order_id: string
            label: "Order ID"                           # [OK] I/O display label
            description: "The order identifier"
      outputs:
         status: string
            label: "Order Status"                       # [OK] I/O display label
            description: "Current order status"
      target: "apex://OrderProcessor"
```