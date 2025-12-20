# NodeMCU-32S V1 board (RJ45 breakout)

## Scope

Board-level documentation for the NodeMCU-32S V1 carrier used by `esphome-configurator`.

## RJ45 pinout (TIA/EIA-568B / T568B)

| Pin | Color (T568B) | Function |
| --- | --- | --- |
| 1 | White/Orange | 3.3V |
| 2 | Orange | 5V |
| 3 | White/Green | GND |
| 4 | Blue | GND |
| 5 | White/Blue | I/O 4 |
| 6 | Green | I/O 3 |
| 7 | White/Brown | I/O 2 |
| 8 | Brown | I/O 1 |

## Port to GPIO mapping

| Port | Pin 1 | Pin 2 | Pin 3 | Pin 4 | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | GPIO23 | GPIO19 | GPIO22 | GPIO21 | |
| 2 | GPIO18 | GPIO04 | GPIO17 | GPIO16 | |
| 3 | GPIO32 | GPIO26 | GPIO33 | GPIO25 | |
| 4 | GPIO27 | GPIO13 | GPIO14 | GPIO12 | |
| IN | GPIO34 | GPIO39 | GPIO35 | GPIO36 | Input-only pins |
| AUX | GPIO00 | GPIO02 | GPIO05 | GPIO15 | ESP32 strapping pins (use with care) |

## Electrical notes

- ESP32 GPIOs are **3.3V logic** and generally **not 5V tolerant**.
- `IN` port GPIOs are input-only (34/35/36/39).
- `AUX` port includes strapping pins; avoid external circuits that force their state during boot.
