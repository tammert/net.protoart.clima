# Homey App for ClimateControl by ProtoART

## Overview
This project contains the source code for the Homey App 'ClimateControl'. ClimateControl modules are ESP32 devices which are inserted into the indoor air conditioning units. This App allows Homey to control ClimateControl modules by interacting with the exposed REST APIs.

## Architecture
ClimateControl supports different brands. This App uses different Drivers for each of the air conditioner brands. Each indoor air conditioner unit should have a ClimateControl module installed, which maps to a Homey Device.

To keep the code DRY, there are generic base classes (found in `/lib`) which are reused between the different brand Drivers.

Most capabilities are custom, this is by design (to keep them neatly separated between the different brands, which generally have different options).

## Technical details
The App is written in TypeScript, using the v3 Homey SDK. Discovery is handled via mDNS, which is emitted by the ClimateControl devices. 

## Development
* validate changes the `validate` make target is available
* example JSONs emitted by the REST APIs are available, per brand, in the `/json` directory
