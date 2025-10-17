import Homey from 'homey';
import ApiClient, {FanSpeedEnum, OperatingModeEnum, VaneModeEnum, WideVaneModeEnum} from "../../lib/apiClient";

module.exports = class ClimateControlDevice extends Homey.Device {
    private apiClient!: ApiClient

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        this.log('ClimateControlDevice has been initialized');

        // Get the device's IP address from store
        const address = this.getStoreValue('address');
        const port = this.getStoreValue('port');
        const path = this.getStoreValue('path');

        this.log('device address:', `${address}:${port}${path}`);

        // Initialize API client
        this.apiClient = new ApiClient(address, port, path);

        // Get initial status
        await this.updateStatus();

        // onoff
        if (!this.hasCapability('onoff')) {
            await this.addCapability('onoff');
        }
        this.registerCapabilityListener('onoff', async (value: boolean) => {
            this.log('onoff capability changed to:', value);

            try {
                await this.apiClient.setPower(value);
                await this.setCapabilityValue('onoff', value);
                this.log('power set successfully to:', value);
            } catch (error) {
                this.error('failed to set power:', error);
                throw new Error(`failed to turn ${value ? 'on' : 'off'}: ${error}`);
            }
        });

        // operating_mode
        if (!this.hasCapability('operating_mode')) {
            await this.addCapability('operating_mode');
        }
        this.registerCapabilityListener('operating_mode', async (value: string) => {
            this.log('operating_mode capability changed to:', value);

            try {
                await this.apiClient.setOperatingMode(value as OperatingModeEnum);
                await this.setCapabilityValue('operating_mode', value);
                this.log('operating mode set successfully to:', value);
            } catch (error) {
                this.error('failed to set operating mode:', error);
                throw new Error(`failed to set operating mode to ${value}: ${error}`);
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
                await this.setCapabilityValue('target_temperature', value);
                this.log('temperature set successfully to:', value);
            } catch (error) {
                this.error('failed to set temperature:', error);
                throw new Error(`failed to set temperature to ${value}: ${error}`);
            }
        });

        // fan_speed
        if (!this.hasCapability('fan_speed')) {
            await this.addCapability('fan_speed');
        }
        this.registerCapabilityListener('fan_speed', async (value: string) => {
            this.log('fan_speed capability changed to:', value);

            try {
                await this.apiClient.setFanSpeed(value as FanSpeedEnum);
                await this.setCapabilityValue('fan_speed', value);
                this.log('fan speed set successfully to:', value);
            } catch (error) {
                this.error('failed to set fan speed:', error);
                throw new Error(`failed to set fan speed to ${value}: ${error}`);
            }
        });

        // vane_mode
        if (!this.hasCapability('vane_mode')) {
            await this.addCapability('vane_mode');
        }
        this.registerCapabilityListener('vane_mode', async (value: string) => {
            this.log('vane_mode capability changed to:', value);

            try {
                await this.apiClient.setVaneMode(value as VaneModeEnum);
                await this.setCapabilityValue('vane_mode', value);
                this.log('vane mode set successfully to:', value);
            } catch (error) {
                this.error('failed to set vane mode:', error);
                throw new Error(`failed to set vane mode to ${value}: ${error}`);
            }
        });

        // wide_vane_mode
        if (!this.hasCapability('wide_vane_mode')) {
            await this.addCapability('wide_vane_mode');
        }
        this.registerCapabilityListener('wide_vane_mode', async (value: string) => {
            this.log('wide_vane_mode capability changed to:', value);

            try {
                await this.apiClient.setWideVaneMode(value as WideVaneModeEnum);
                await this.setCapabilityValue('wide_vane_mode', value);
                this.log('wide vane set successfully to:', value);
            } catch (error) {
                this.error('failed to set wide vane:', error);
                throw new Error(`failed to set wide vane to ${value}: ${error}`);
            }
        });

        // Poll for status every 60 seconds
        this.homey.setInterval(async () => {
            await this.updateStatus();
        }, 60000);
    }

    async updateStatus() {
        try {
            const status = await this.apiClient.getStatus();
            if (Homey.env.NODE_ENV === 'development') {
                this.log('status received:\n', status);
            }

            // Update capabilities
            await this.setCapabilityValue('onoff', status.heatpump.power === 'on');
            await this.setCapabilityValue('operating_mode', status.heatpump.mode);
            await this.setCapabilityValue('target_temperature', status.heatpump.set_temperature);
            await this.setCapabilityValue('fan_speed', status.heatpump.fan);
            await this.setCapabilityValue('vane_mode', status.heatpump.vane);
            await this.setCapabilityValue('wide_vane_mode', status.heatpump.widevane);
            await this.setCapabilityValue('meter_power', status.heatpump.tpcns);
            await this.setCapabilityValue('measure_power', status.heatpump.pinp);
            await this.setCapabilityValue('measure_temperature', status.sensor.thermometer.tact ? status.sensor.thermometer.tact : status.heatpump.actual_temperature);
            if (status.heatpump.tout != 0) {
                // 0 is used for "absent" value, so we can't use it as the real 0°C
                await this.setCapabilityValue('measure_temperature.outside', status.heatpump.tout);
            }
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

    // when the IP address changes, persists the new value in the store
    onDiscoveryAddressChanged(discoveryResult: any) {
        if (Homey.env.NODE_ENV === 'development') {
            this.log('onDiscoveryAddressChanged:\n', discoveryResult);
        }

        const address: string = discoveryResult.address
        this.setStoreValue('address', address).then(r => {return true})
        this.apiClient = new ApiClient(address, discoveryResult.port, discoveryResult.txt.path);
        this.log(`updated ${this.getName()} IP address to ${address}`)
    }
};
