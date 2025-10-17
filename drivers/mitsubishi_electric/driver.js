"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
class ClimaControlDriver extends homey_1.default.Driver {
    async onInit() {
        this.log('ClimaControl Driver has been initialized');
    }
    async onPairListDevices() {
        const discoveryStrategy = this.getDiscoveryStrategy();
        const discoveryResults = discoveryStrategy.getDiscoveryResults();
        const devices = Object.values(discoveryResults).map((discoveryResult) => {
            return {
                name: discoveryResult.host,
                data: {
                    id: discoveryResult.id,
                },
                store: {
                    address: discoveryResult.address,
                    port: discoveryResult.port,
                }
            };
        });
        this.log("Returning devices:", devices.length);
        return devices;
    }
}
module.exports = ClimaControlDriver;
