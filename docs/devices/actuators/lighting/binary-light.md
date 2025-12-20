# Device: Binary light (on/off)

## Overview

A binary light is a simple on/off light entity controlled by a GPIO output.

In `esphome-configurator` this is typically:

- Type: `output`
- Subtype: `light`

The generated YAML usually includes:

- an `output:` entry (platform `gpio`)
- a `light:` entry (platform `binary`)

## Wiring

Same wiring considerations as a relay output: use an appropriate driver stage.

## ESPHome

- `output:` gpio
- `light:`
  - `platform: binary`
  - `output: <output_id>`

## Troubleshooting

- Inverted behavior: use `inverted: true` on the gpio output.
