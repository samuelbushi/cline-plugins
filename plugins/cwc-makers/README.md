# cwc-makers

Guide setup and app iteration for the Code-with-Claude Makers Cardputer kit and Cardputer-class M5Stack ESP32 boards.

## What It Adds

- A `/maker-setup` command that starts an intentional Cline workflow for provisioning a Cardputer-class M5Stack ESP32 device.
- The `m5-onboard` skill for device detection, firmware flashing, app installation, platform requirements, and hardware-specific gotchas.
- The `cardputer-buddy` skill for iterating on MicroPython apps after the device has already been provisioned.

The plugin does not run installers, clone repositories, install Python packages, flash firmware, or access serial devices during plugin installation. Those actions happen only if the user asks Cline to perform them during a session.

## Requirements

- A Code-with-Claude Makers Cardputer, Cardputer-Adv, or compatible Cardputer-class M5Stack ESP32 device connected over USB-C.
- Python 3.10 or newer.
- Git, or curl plus tar for downloading the project source.
- Internet access for the setup project, firmware downloads, and optional Python package installation.
- Device permissions for `/dev/ttyUSB*` or `/dev/ttyACM*` on Linux when applicable.

## Trust Boundaries

Firmware flashing changes the connected hardware. Cline should confirm the target device, port, model, and user intent before running flashing commands.

The setup flow may install Python packages such as `esptool` into the user's Python environment. It should explain that first and wait for confirmation.

The setup project is fetched from an external repository. Cline should ask which ref to use, explain when the user chooses a mutable default branch, and inspect fetched scripts before running them.

The Cardputer-Adv download-mode step requires a physical button sequence. Cline should relay the instruction and wait for the user before continuing.

## Install

```bash
cline plugin install cwc-makers
```

For local development from this repository:

```bash
cline plugin install ./plugins/cwc-makers --cwd .
```
