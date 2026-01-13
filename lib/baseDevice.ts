import Homey from 'homey';
import ApiClient, {ApiEndpoints} from "./apiClient";

class ClimateControlDevice extends Homey.Device {
    protected apiClient!: ApiClient
    protected apiEndpoints!: ApiEndpoints
    protected brand!: string
    protected pollingInterval!: NodeJS.Timeout;

    async onInit() {
        // generate brand-specific names for the capabilities
        const operatingModeCapabilityName = `${this.brand}_operating_mode`
        const fanSpeedCapabilityName = `${this.brand}_fan_speed`
        const vaneModeCapabilityName = `${this.brand}_vane_mode`
        const wideVaneModeCapabilityName = `${this.brand}_wide_vane_mode`

        // Get the device's IP address from store
        const address = this.getStoreValue('address');
        const port = this.getStoreValue('port');
        const path = this.getStoreValue('path');

        this.log('device address:', `${address}:${port}${path}`);

        // Initialize API client
        this.apiClient = new ApiClient(address, port, path, this.apiEndpoints);

        // onoff
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
        this.registerCapabilityListener(operatingModeCapabilityName, async (value: string) => {
            this.log('operating_mode capability changed to:', value);

            try {
                await this.apiClient.setOperatingMode(value);
                await this.setCapabilityValue(operatingModeCapabilityName, value);
                this.log('operating mode set successfully to:', value);
            } catch (error) {
                this.error('failed to set operating mode:', error);
                throw new Error(`failed to set operating mode to ${value}: ${error}`);
            }
        });

        // fan_speed
        this.registerCapabilityListener(fanSpeedCapabilityName, async (value: string) => {
            this.log('fan_speed capability changed to:', value);

            try {
                await this.apiClient.setFanSpeed(value);
                await this.setCapabilityValue(fanSpeedCapabilityName, value);
                this.log('fan speed set successfully to:', value);
            } catch (error) {
                this.error('failed to set fan speed:', error);
                throw new Error(`failed to set fan speed to ${value}: ${error}`);
            }
        });

        // vane_mode
        this.registerCapabilityListener(vaneModeCapabilityName, async (value: string) => {
            this.log('vane_mode capability changed to:', value);

            try {
                await this.apiClient.setVaneMode(value);
                await this.setCapabilityValue(vaneModeCapabilityName, value);
                this.log('vane mode set successfully to:', value);
            } catch (error) {
                this.error('failed to set vane mode:', error);
                throw new Error(`failed to set vane mode to ${value}: ${error}`);
            }
        });

        // wide_vane_mode
        this.registerCapabilityListener(wideVaneModeCapabilityName, async (value: string) => {
            this.log('wide_vane_mode capability changed to:', value);

            try {
                await this.apiClient.setWideVaneMode(value);
                await this.setCapabilityValue(wideVaneModeCapabilityName, value);
                this.log('horizontal vane set successfully to:', value);
            } catch (error) {
                this.error('failed to set horizontal vane:', error);
                throw new Error(`failed to set horizontal vane to ${value}: ${error}`);
            }
        });

        // target_temperature
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

        // new capability options in v0.7.0
        try {
            this.getCapabilityOptions(`${this.brand}_defrost_active`)
        } catch (error) {
            this.log(`adding insights to ${this.brand}_defrost_active`)
            await this.setCapabilityOptions(`${this.brand}_defrost_active`, {insights: true});
        }
    }

    async updateStatus(status: any) {
        if (Homey.env.NODE_ENV === 'development') {
            this.log('status received:\n', status);
        }

        try {
            // check if a wireless temperature sensor is connected - set capabilities accordingly
            const capabilities = this.getCapabilities()
            if (status.sensor && status.sensor.thermometer) {
                if (!capabilities.includes('measure_battery')) {
                    this.log('adding capability for measure_battery');
                    await this.addCapability('measure_battery');
                }
                if (!capabilities.includes('measure_humidity')) {
                    this.log('adding capability for measure_humidity');
                    await this.addCapability('measure_humidity');
                }
            } else {
                if (capabilities.includes('measure_battery')) {
                    this.log('removing capability for measure_battery');
                    await this.removeCapability('measure_battery')
                }
                if (capabilities.includes('measure_humidity')) {
                    this.log('removing capability for measure_humidity');
                    await this.removeCapability('measure_humidity')
                }
            }

            // generic capabilities
            await this.setCapabilityValue('onoff', status.heatpump.power === 'on');
            await this.setCapabilityValue(`${this.brand}_operating_mode`, status.heatpump.mode);
            await this.setCapabilityValue(`${this.brand}_fan_speed`, status.heatpump.fan);
            await this.setCapabilityValue('target_temperature', status.heatpump.set_temperature);
            await this.setCapabilityValue('measure_temperature', this.apiClient.getTemperatureFromStatus(status));

            if (status.sensor && status.sensor.thermometer && status.sensor.thermometer.name != '-') {
                await this.setCapabilityValue('measure_humidity', status.sensor.thermometer.hact);
                await this.setCapabilityValue('measure_battery', status.sensor.thermometer.batt);
            }
        } catch (error) {
            this.error('failed to update status:', error);
        }
    }

    // when the IP address changes, persists the new value in the store
    async onDiscoveryAddressChanged(discoveryResult: any) {
        if (Homey.env.NODE_ENV === 'development') {
            this.log('onDiscoveryAddressChanged:\n', discoveryResult);
        }

        const address: string = discoveryResult.address
        await this.setStoreValue('address', address)
        this.apiClient = new ApiClient(address, discoveryResult.port, discoveryResult.txt.path, this.apiEndpoints);
        this.log(`updated ${this.getName()} IP address to ${address}`)
    }

    async onDeleted() {
        if (this.pollingInterval) {
            this.homey.clearInterval(this.pollingInterval);
        }

        this.log('ClimateControlDevice has been deleted');
    }
}

export default ClimateControlDevice;
