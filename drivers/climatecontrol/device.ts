import Homey, {Device} from 'homey';
import ApiClient from "../../lib/apiClient";

module.exports = class ClimateControlDevice extends Homey.Device {
    private apiClient!: ApiClient
    private pollInterval?: NodeJS.Timeout;

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        this.log('ClimateControlDevice has been initialized');
        // Get the device's IP address from store
        const address = this.getStoreValue('address');
        const port = this.getStoreValue('port');

        this.log('device address:', `${address}:${port}`);

        // Initialize API client
        this.apiClient = new ApiClient(address, port);

        // onoff
        if (!this.hasCapability('onoff')) {
            await this.addCapability('onoff');
        }
        this.registerCapabilityListener('onoff', async (value: boolean) => {
            this.log('onoff capability changed to:', value);

            try {
                await this.apiClient.setPower(value);
                this.log('power set successfully to:', value);
                await this.updateStatus();
            } catch (error) {
                this.error('failed to set power:', error);
                throw new Error(`failed to turn ${value ? 'on' : 'off'}: ${error}`);
            }
        });

        // thermostat_mode
        if (!this.hasCapability('thermostat_mode')) {
            await this.addCapability('thermostat_mode');
        }
        this.registerCapabilityListener('thermostat_mode', async (value: string) => {
            this.log('thermostat_mode capability changed to:', value);

            try {
                await this.apiClient.setMode(value as 'auto' | 'cool' | 'heat' | 'dry' | 'fan');
                this.log('mode set successfully to:', value);
                await this.updateStatus();
            } catch (error) {
                this.error('failed to set mode:', error);
                throw new Error(`failed to set mode to ${value}: ${error}`);
            }
        });

        // target_temperature
        if (!this.hasCapability('target_temperature')) {
            await this.addCapability('target_temperature');
        }
        this.registerCapabilityListener('target_temperature', async (value: number) => {
            this.log('target_temperature capability changed to:', value);

            try {
                await this.apiClient.setTemperature(value);
                this.log('temperature set successfully to:', value);
                await this.updateStatus();
            } catch (error) {
                this.error('failed to set temperature:', error);
                throw new Error(`failed to set temperature to ${value}: ${error}`);
            }
        });

        // fan_mode
        if (!this.hasCapability('fan_mode')) {
            await this.addCapability('fan_mode');
        }
        this.registerCapabilityListener('fan_mode', async (value: string) => {
            this.log('fan_mode capability changed to:', value);

            try {
                await this.apiClient.setFanSpeed(value as 'auto' | 'silent' | 'low' | 'med' | 'high' | 'superhigh');
                this.log('fan speed set successfully to:', value);
                await this.updateStatus();
            } catch (error) {
                this.error('failed to set fan speed:', error);
                throw new Error(`failed to set fan speed to ${value}: ${error}`);
            }
        });

        // swing_mode
        if (!this.hasCapability('swing_mode')) {
            await this.addCapability('swing_mode');
        }
        this.registerCapabilityListener('swing_mode', async (value: string) => {
            this.log('swing_mode capability changed to:', value);

            try {
                await this.apiClient.setSwingMode(value as 'auto' | 'swing' | '1' | '2' | '3' | '4' | '5');
                this.log('swing mode set successfully to:', value);
                await this.updateStatus();
            } catch (error) {
                this.error('failed to set swing mode:', error);
                throw new Error(`failed to set swing mode to ${value}: ${error}`);
            }
        });

        // Get initial status
        await this.updateStatus();

        // Poll for status every 60 seconds
        const pollingInterval = this.homey.settings.get('pollingInterval') || 60000;
        this.pollInterval = this.homey.setInterval(async () => {
            await this.updateStatus();
        }, pollingInterval);
    }

    async updateStatus() {
        try {
            const status = await this.apiClient.getStatus();
            if (Homey.env.NODE_ENV === 'development') {
                this.log('status received', status);
            }

            // Update capabilities
            const isPowerOn = status.heatpump.power === 'on';
            await this.setCapabilityValue('onoff', isPowerOn);
            await this.setCapabilityValue('thermostat_mode', status.heatpump.mode);
            await this.setCapabilityValue('target_temperature', status.heatpump.set_temperature);
            await this.setCapabilityValue('fan_mode', status.heatpump.fan);
            await this.setCapabilityValue('swing_mode', status.heatpump.vane);
            await this.setCapabilityValue('meter_power', status.heatpump.tpcns);
            await this.setCapabilityValue('measure_power', status.heatpump.pinp);
            await this.setCapabilityValue('measure_temperature', status.sensor.thermometer.tact ? status.sensor.thermometer.tact : status.heatpump.actual_temperature);
            await this.setCapabilityValue('measure_battery', status.sensor.thermometer.batt ? status.sensor.thermometer.batt : 0);
            await this.setCapabilityValue('measure_humidity', status.sensor.thermometer.hact ? status.sensor.thermometer.hact : 0);
        } catch (error) {
            this.error('failed to update status:', error);
        }
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('ClimateControlDevice has been added');
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name: string) {
        this.log('ClimateControlDevice was renamed');
    }

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        this.log('ClimateControlDevice has been deleted');
    }

};
