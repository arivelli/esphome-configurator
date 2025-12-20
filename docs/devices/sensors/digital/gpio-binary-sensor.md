# Device: GPIO binary sensor (switch / float / dry contact)

## Overview

A GPIO binary sensor is used to read a digital on/off state from a GPIO pin.

Typical use cases:

- Wall switch (momentary or latching)
- Float switch (tank level)
- Reed switch (door/window)
- Generic dry contact

In `esphome-configurator` this maps to:

- Type: `binary_sensor`
- Subtype: `gpio`

## Wiring

### Typical dry contact

- Connect one side of the contact to **GND**.
- Connect the other side to the selected **GPIO**.
- Enable a pull-up (internal where possible, or external if needed).

### Notes

- Use a **common ground** between the external circuit and the ESP32.
- If using long cables, consider shielding and routing away from mains/pump wiring.

## Electrical notes

- ESP32 GPIO is **3.3V logic**.
- Some pins (e.g. input-only pins) may not support internal pull-ups; in that case add an external pull-up resistor.

## ESPHome

This is typically represented as:

- `binary_sensor:`
  - `platform: gpio`
  - `pin:` (number + input + optional pullup)
  - optional `filters:` for debouncing

## Debouncing

Mechanical contacts bounce. Use filters such as delayed on/off.

## Troubleshooting

- If the sensor reads random values: the pin may be floating; add pull-up/pull-down.
- If the logic is inverted: set `inverted: true`.
