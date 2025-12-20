# Device: Dallas 1-Wire temperature sensor (DS18B20)

## Overview

Dallas/Maxim 1-Wire temperature sensors (e.g. DS18B20) can be connected on a single GPIO using the 1-Wire bus.

In `esphome-configurator` this maps to:

- Type: `sensor`
- Subtype: `dallas`

## Wiring

- **VDD**: 3.3V (recommended) or 5V depending on the sensor/module.
- **GND**: common ground with ESP32.
- **DQ (data)**: to a GPIO.
- Add a **4.7k pull-up** from DQ to 3.3V.

## Electrical notes

- Keep wiring short when possible.
- For long runs, use twisted pair, avoid parallel runs with mains.

## ESPHome

Typical structure:

- `one_wire:` with a GPIO pin
- `sensor:` entries using `platform: dallas_temp` per device address

## Troubleshooting

- If no devices are detected: check pull-up resistor and wiring.
- If readings are unstable: improve wiring, reduce cable length, or adjust update intervals.
