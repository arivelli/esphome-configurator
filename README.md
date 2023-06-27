# esphome-configurator

The main goal of this project is to fill the gap between esp32 and esphome providing you with a simple board and a piece of software to easily plug and set up your devices

## We expect to launch the first alpha version by end of July 2023"

## The board

Until now we only support nodemcu esp32s devices (Thanks Ivan for this first version). 

As you can see on the following picture the board make use of 6 rj45 ports (not ethernet ports) all with the same schema having 4 I/Os + 3.3v,5v and 2GND by jack.

### RJ45 Jacks

- The pins of first 4 jacks could be used as Input or Output. 
- The IN jack could only be used for inputs.
- Finally the AUX could be used carefully since have strapping pins (check ESP32 website for more information)

![esphome configurator board preview](/board/ports.jpg)

## The Application

The application is just a yaml parser + web interface

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
