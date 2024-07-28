# esphome-configurator

The main goal of this project is to fill the gap between esp32 and esphome providing you with a simple board and a piece of software to easily plug and set up your devices
## We expect to launch the first alpha version by end of July 2023!!!
### Context
[**ESP32**](https://www.espressif.com/en/products/socs/esp32) is a series of low-cost, low-power system on a chip microcontrollers with integrated Wi-Fi and dual-mode Bluetooth

[**NodeMCU**](https://www.nodemcu.com/index_en.html) is an open-source firmware and development kit that helps you to prototype your IOT product within a few Lua script lines

[**ESPHome**](https://esphome.io/)  is a system to control your ESP8266/ESP32 and RP2040 by simple yet powerful configuration files and control them remotely through Home Automation systems.

The combination of the 3 previous ones (especially if used with [**home assistant**](https://www.home-assistant.io/)) provides us with a powerful tool very easy to use with almost no need of technical knowledge, neither of programming nor of electronics.

Even so, the connection of the input and output pins of the nodemcu with the relay modules or other devices can generate great confusion as there is neither a simple order nor a human-friendly (physical) interface. 

**THAT IS THE GAP THAT THIS PROJECT AIMS TO FILL**



## The board

Until now we only support [nodemcu esp32s](https://docs.platformio.org/en/latest/boards/espressif32/nodemcu-32s.html) devices (Thanks [Ivan Ferreyra](https://www.instagram.com/ivanelectric90/) for this first version). 

Feel free to contribute with other boards or even with a new version of this one. by following the general rules of the project you should be able to use the software with any board you want.

As you can see on the following picture the board make use of 6 rj45 ports (not ethernet ports) all with the same schema having 4 I/Os + 3.3v,5v and 2GND by jack.



### RJ45 Jacks

- The pins of first 4 jacks could be used as Input or Output. 
- The IN jack could only be used for inputs.
- Finally the AUX could be used carefully since have strapping pins (check ESP32 website for more information)

![esphome configurator board preview](/assets/board.jpg)

## The Application

Since all we need to do is configure esphome, which uses yaml files, the application is just a web interface to those yaml files.

It provide us with a form to setup the metadata of the project

![esphome configurator project metadata preview](/assets/project.png)

The organization of the interface elements allows us to configure our pins in an orderly and easily understandable by humans, without having to worry about the GPIO number (or use a magnifying glass to look at the tiny silkscreens on the board)

![esphome configurator ports preview](/assets/ports.png)

In addition to the pin configuration, the interface has a form for the common data of each device such as wifi connection and other necessary metadata.

![esphome configurator common data preview](/assets/common.png)

## Project Setup
### Requirements
<!-- ordered list of requirements -->  
- [git](https://git-scm.com/)
- [nodejs](https://nodejs.org/en/) >= 14.17.0
- [npm](https://www.npmjs.com/) >= 6.14.13

### Install nodejs dependencies
```sh
npm install
```
### Compile and Hot-Reload for Development on port 5174
```sh
npm run dev
```
### Run server side on port 3000 (to read/write configuration files)
```sh
node src/server.js
```

