# In DEV - NOT WORKING YET - Homebridge-Phantom-Devialet-Bridge

homebridge-plugin for Devialet Phantom with Dialog.
Inspire from the initial Denon and Marantz AVR control homebridge plugin ( https://github.com/stfnhmplr/homebridge-denon-marantz-avr ) and phantom-bridge ( https://github.com/da2001/phantom-bridge ): Thanks to them, we'll have just a few work to do in order to manage Phantom devialet Volume via Dialog.

This is a curent Dev and it's not working yet. we expect the plugin to be fuctional within the next month.

# Installation
Follow the instruction in [NPM](https://www.npmjs.com/package/homebridge) for the homebridge server installation. The plugin is published through [NPM](https://www.npmjs.com/package/homebridge-phantom-devialet-bridge) and should be installed "globally" by typing:

    sudo npm install -g homebridge-phantom-devialet-bridge

# Configuration

config.json

Example:

    {
      "bridge": {
          "name": "Homebridge",
          "username": "CC:22:3D:E3:CE:51",
          "port": 51826,
          "pin": "031-45-154"
      },
      "description": "This is an example configuration file for homebridge Devialet Phantom Dialog plugin",
      "hint": "Always paste into jsonlint.com validation page before starting your homebridge, saves a lot of frustration",
      "accessories": [
          {
              "accessory": "DevialetDialog",
              "name": "Phatom Living room",
              "ip": "192.168.0.99",
              "defaultVolume": 30,
              "minVolume": 10,
              "maxVolume": 75,
              "doPolling": true,
              "pollingInterval": 60
          }
      ]
  }

### notes
If you are interested in setting the volume of your Phantom(s) with Siri, Only remember to not tell Siri "Set the light in the Living room to 100 %" ;) : we suggest, in homekit, to put your Devialet Light switch in a different Room in order to not have bad surprise setting something like "Turn on all light in the Living Room" :)

homebridge-phantom-devialet-bridge was written by Jeremy and the contribution of Steven
homebridge-marantz-volume was written by Robert Vorthman (thanks!)
phantom-bridge was written by DA2001 ( thanks ! )
