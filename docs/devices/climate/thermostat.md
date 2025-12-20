# Device: Thermostat (ESPHome climate)

## Overview

A thermostat is a control loop that uses a temperature sensor to drive an actuator (heater/cooler) to maintain a target temperature.

Typical use cases:

- Electric heater / boiler enable
- Gas heater enable (through a relay interface)
- Fan/ventilation based temperature control

## Required building blocks

- **Temperature sensor** (e.g. DS18B20 / Dallas 1-Wire)
- **Actuator** (typically a relay driven from a GPIO)

## Wiring

### Temperature sensor (example: DS18B20)

- See: `devices/sensors/temperature/dallas-1wire.md`

### Heater actuator (relay)

- Use a 3.3V-compatible relay module.
- Connect:
  - ESP32 GPIO -> relay input
  - ESP32 GND -> relay GND (common)
  - Relay VCC as required by the module

## Electrical notes

- Thermostat outputs often control inductive loads (pumps/fans). Keep wiring separated and consider EMI mitigation.
- Always share GND between ESP32 and the low-voltage side of the relay module.

## ESPHome

Thermostats are represented under `climate:`.

A minimal thermostat requires:

- `platform: thermostat`
- `sensor:` pointing to a temperature sensor entity id
- at least one action, e.g. `heat_action:` + `idle_action:`

## How to model it in esphome-configurator

In the current implementation, the thermostat is attached to a GPIO row:

- Type: `climate`
- Subtype: `thermostat`

The thermostat needs to reference a temperature sensor. Because temperature sensors may be defined outside of the GPIO row (or via custom YAML), the thermostat expects the `sensor:` field to be provided via the **Extra** YAML field.

Example `Extra` (conceptual):

- `sensor: <temperature_sensor_id>`

## Troubleshooting

- If the heater never turns on: verify relay wiring and that the referenced `sensor:` exists.
- If it oscillates: adjust target temperatures and/or add hysteresis settings.
