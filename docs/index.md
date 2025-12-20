# Technical documentation

This directory contains technical documentation for the hardware + software ecosystem around `esphome-configurator`.

## Contents

- `boards/`: board-level documentation (RJ45 wiring, power rails, ports, GPIO mapping)
- `devices/`: device documentation organized by category (e.g. sensors, actuators). Each document follows a consistent structure.

## Devices

- `devices/sensors/`: sensors
  - `devices/sensors/digital/`: GPIO binary sensors (switches, float switches, dry contacts)
  - `devices/sensors/temperature/`: temperature sensors (Dallas 1-Wire)
  - `devices/sensors/flow/`: flow sensors (e.g. YF-DN50)
- `devices/actuators/`: actuators
  - `devices/actuators/relays/`: GPIO relay outputs (switch)
  - `devices/actuators/lighting/`: lights
- `devices/climate/`: climate devices (thermostats)
- `devices/templates/`: documentation templates

## Supported by the current UI

The current UI supports:

- `binary_sensor` / `gpio`
- `sensor` / `dallas`
- `output` / `switch`
- `output` / `light`

## Roadmap (devices used in Home Assistant config)

The following devices/platforms are used in `home_assistant_config/esphome/*.yaml` and should be considered for first-class support in the configurator UI (and corresponding docs):

### Climate

- `climate` / `thermostat`

### Covers

- `cover` / `time_based` (blind/curtain using open/close/stop actions + durations)
- `cover` / `template` (e.g. garage door trigger, optimistic)

### Flow / pulses

- `sensor` / `pulse_meter` (flow meters with `total:`)

### Energy metering

- `sensor` / `pzemac` (requires `uart` + `modbus`)
- `uart` (rx/tx pins, baud rate)
- `modbus`

### Lighting / PWM

- `output` / `ledc` (PWM)
- `light` / `rgb` (built from 3x `ledc` outputs)

### Automation helpers used in nodes

- `binary_sensor.gpio` actions (`on_press`, `on_state`) to toggle lights/covers/switches
- `switch.output` actions (`on_turn_on` interlocks, auto-off pulse)
