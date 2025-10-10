"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const apiClient_1 = __importDefault(require("../../lib/apiClient"));
module.exports = class ClimaControlDevice extends homey_1.default.Device {
    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        this.log('ClimaControlDevice has been initialized');
        // Get the device's IP address from store
        const address = this.getStoreValue('address');
        const port = this.getStoreValue('port');
        this.log('Device address:', `${address}:${port}`);
        // Initialize API client
        this.apiClient = new apiClient_1.default(address, port);
        // Register capability listener for onoff
        this.registerCapabilityListener('onoff', async (value) => {
            this.log('onoff capability changed to:', value);
            try {
                await this.apiClient.setPower(value);
                this.log('Power set successfully to:', value);
                await this.updateStatus();
            }
            catch (error) {
                this.error('Failed to set power:', error);
                throw new Error(`Failed to turn ${value ? 'on' : 'off'}: ${error}`);
            }
        });
        // Register capability listener for thermostat_mode
        this.registerCapabilityListener('thermostat_mode', async (value) => {
            this.log('thermostat_mode capability changed to:', value);
            try {
                await this.apiClient.setMode(value);
                this.log('Mode set successfully to:', value);
                await this.updateStatus();
            }
            catch (error) {
                this.error('Failed to set mode:', error);
                throw new Error(`Failed to set mode to ${value}: ${error}`);
            }
        });
        // Register capability listener for target_temperature
        this.registerCapabilityListener('target_temperature', async (value) => {
            this.log('target_temperature capability changed to:', value);
            try {
                await this.apiClient.setTemperature(value);
                this.log('Temperature set successfully to:', value);
                await this.updateStatus();
            }
            catch (error) {
                this.error('Failed to set temperature:', error);
                throw new Error(`Failed to set temperature to ${value}: ${error}`);
            }
        });
        // Get initial status
        await this.updateStatus();
        // Poll for status every 60 seconds
        this.pollInterval = this.homey.setInterval(async () => {
            await this.updateStatus();
        }, 60000);
    }
    async updateStatus() {
        try {
            const status = await this.apiClient.getStatus();
            this.log('Status received', status.heatpump);
            // Update capabilities
            const isPowerOn = status.heatpump.power === 'on';
            await this.setCapabilityValue('onoff', isPowerOn);
            await this.setCapabilityValue('thermostat_mode', status.heatpump.mode);
            await this.setCapabilityValue('target_temperature', status.heatpump.set_temperature);
            await this.setCapabilityValue('measure_temperature', status.heatpump.actual_temperature);
        }
        catch (error) {
            this.error('Failed to update status:', error);
        }
    }
    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('ClimaControlDevice has been added');
    }
    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name) {
        this.log('ClimaControlDevice was renamed');
    }
    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        this.log('ClimaControlDevice has been deleted');
    }
};
