# Device: YF-DN50 water flow sensor

## Overview

YF-DN50 is a turbine-type water flow sensor typically providing a pulse output whose frequency is proportional to flow rate.

## Specs

- Working range: 10–200 L/min
- Operating voltage: 3.5–24 VDC

## Datasheet notes (useful for calibration)

The YF-DN50 datasheet states the pulse relationship:

- `frequency (Hz) = 0.2 × Q (L/min)` (±3%)

Derivation:

- `pulses/min = Hz × 60 = 12 × Q`
- since `Q` is liters per minute, this implies an initial approximation of:
  - `pulses_per_liter ≈ 12`

## Wiring

### Typical 3-wire harness

- **V+**: sensor supply (3.5–24V)
- **GND**: ground
- **SIGNAL**: pulse output (commonly NPN/open-collector)

### Recommended ESP32 wiring (3.3V logic)

- Connect sensor **GND** to ESP32 **GND** (common reference).
- Connect sensor **SIGNAL** directly to an ESP32 input pin (for this board: `IN` port pin 1 = GPIO34).
- Add a **10k pull-up** from SIGNAL to **3.3V**.

> Avoid pulling SIGNAL up to 5V.

### Safe level interfacing (recommended)

Some YF-DN50 variants may output a 5V logic-high when powered at 5V (datasheet lists `output pulse high level > 4.5V` when `Vcc = 5V`). To avoid any risk to ESP32 GPIOs:

- Prefer a **level shifter** between SIGNAL and the ESP32.
  - **Resistor divider** (simple): e.g. 10k (top) + 20k (bottom) to scale 5V -> ~3.3V.
  - **Transistor/MOSFET level shifter** (robust): NPN + pull-up to 3.3V.

If the output is confirmed to be **open-collector/open-drain**, you can instead:

- power the sensor at 5V
- pull up SIGNAL to **3.3V** with a resistor

Only use this method if you verify with a meter/scope that the sensor does not actively drive SIGNAL to 5V.

## Electrical notes

- If SIGNAL is left floating (disconnected), ESP32 inputs may read noise as pulses.
- Long UTP runs near pumps/relays can inject EMI; a pull-up and clean grounding usually helps.

## ESPHome

Recommended component: `pulse_meter`.

### Conversion constant

`pulse_meter` reports pulses/min. Convert to L/min using:

`L/min = pulses_per_minute / pulses_per_liter`

The correct `pulses_per_liter` depends on the sensor model and installation and should be calibrated.

Recommended initial value for YF-DN50 (from datasheet relationship):

- `pulses_per_liter: 12`

## Calibration

### Procedure (volume-based)

1. Run water into a container/reference meter.
2. Measure real volume `V_real` (liters).
3. Read ESPHome/HA totalized volume `V_reported` (liters) for the same interval.
4. Update the factor:

`new_pulses_per_liter = old_pulses_per_liter * (V_reported / V_real)`

Repeat until error is acceptable.

## Troubleshooting

- **Non-zero flow when disconnected**: input pin floating; add pull-up/pull-down or disable the sensor until wired.
- **Flow too low by a constant factor**: conversion constant (`pulses_per_liter`) is wrong.
- **Unstable readings near motors**: improve grounding, route cable away from power, consider shielding.

## References

- Vendor label / product listing for YF-DN50
