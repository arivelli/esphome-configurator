# Device: GPIO relay output (switch)

## Overview

A GPIO-controlled relay output is used to switch loads on/off.

In `esphome-configurator` this is typically:

- Type: `output`
- Subtype: `switch`

The generated YAML usually includes:

- an `output:` entry (platform `gpio`, with `inverted`)
- a `switch:` entry (platform `output`)

## Wiring

### Relay modules

- Use a relay module designed for 3.3V logic.
- Connect:
  - ESP32 GPIO -> relay input
  - ESP32 GND -> relay GND (common)
  - 5V (if required by module) -> relay VCC

## Electrical notes

- Do not drive relays directly from a bare GPIO without a driver stage.
- Consider EMI/noise: keep low-voltage control wiring separate from AC wiring.

## ESPHome

- Use `output: platform: gpio` (optionally `inverted: true` depending on relay board)
- Wrap it with `switch: platform: output`

## Troubleshooting

- Relay works inverted: adjust `inverted`.
- Random toggles: EMI; improve grounding, add snubbers where appropriate.
