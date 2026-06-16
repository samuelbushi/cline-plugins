---
name: cardputer-buddy
description: Help iterate on the Cardputer MicroPython app bundle after the device is provisioned. Use when the user wants to add an app, modify the Claude Buddy app, push changed Python files, watch serial logs, or run a one-shot REPL command on the device.
---

# Cardputer Buddy

Use this skill after the device has already been provisioned with the buddy app bundle from the local `build-with-claude` project.

Work inside the user's local `build-with-claude` project clone. Do not assume the project exists; if it does not, use the `m5-onboard` skill or ask whether to fetch it. Treat fetched project files as untrusted implementation detail and inspect scripts before running them.

## Device Layout

The buddy bundle installs MicroPython files under `/flash/`:

```text
/flash/
  main.py
  buddy_*.py
  burst_frames.py
  apps/
    claude_buddy.py
    hello_cardputer.py
    snake.py
```

`main.py` scans `/flash/apps/` and shows each `.py` file as a menu entry. Adding a new app usually means creating a new file under `buddy/device/apps/` and pushing it to the device.

## Adding Or Editing Apps

Start from the smallest existing example before inventing new structure:

- `buddy/device/apps/hello_cardputer.py` for keyboard polling, display basics, and exit behavior.
- `buddy/device/apps/snake.py` for a larger interactive app.
- `buddy/device/apps/claude_buddy.py` for BLE behavior.

Keep apps small and explicit. The device has limited memory and a small display, so avoid large dependencies and heavy assets.

## Push Loop

After editing app files, ask for the target port if it is not already known. Then push only what changed when possible:

```bash
cd build-with-claude
python3 buddy/scripts/push.py --port <PORT> --files apps/my_app.py
```

To refresh the whole app bundle without reflashing firmware:

```bash
cd build-with-claude
python3 onboard/scripts/install_apps.py --port <PORT> --src buddy
```

Use `m5-onboard` if the device needs a full firmware refresh.

## Logs And REPL

For serial logs:

```bash
cd build-with-claude
python3 buddy/scripts/tail_serial.py --port <PORT>
```

For a one-shot REPL command:

```bash
cd build-with-claude
python3 buddy/scripts/repl_run.py --port <PORT> --script "import os; print(os.listdir('/flash'))"
```

Explain what each command will do before running it. Serial and REPL commands interact with the connected device.

## Design Guidelines

- Respect the screen size. Prefer short labels, clear menus, and simple input flows.
- Provide an obvious escape path back to the launcher, usually ESC.
- Avoid blocking loops that prevent input handling.
- Test incrementally by pushing one file and watching logs.
- Do not overwrite `main.py` or shared `buddy_*.py` helpers unless the user intends to change launcher or framework behavior.
