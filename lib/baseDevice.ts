import Homey from 'homey';
import ApiClient, {ApiEndpoints} from "./apiClient";

class ClimateControlDevice extends Homey.Device {
    protected apiClient!: ApiClient
    protected apiEndpoints!: ApiEndpoints
    protected brand!: string

    async onInit() {
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
        if (this.hasCapability('operating_mode')) {
            await this.removeCapability('operating_mode');
        }
        if (!this.hasCapability(`${this.brand}_operating_mode`)) {
            await this.addCapability(`${this.brand}_operating_mode`);
        }
        this.registerCapabilityListener(`${this.brand}_operating_mode`, async (value: string) => {
            this.log('operating_mode capability changed to:', value);

            try {
                await this.apiClient.setOperatingMode(value);
                await this.setCapabilityValue(`${this.brand}_operating_mode`, value);
                this.log('operating mode set successfully to:', value);
            } catch (error) {
                this.error('failed to set operating mode:', error);
                throw new Error(`failed to set operating mode to ${value}: ${error}`);
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

        // fan_speed
        if (this.hasCapability('fan_speed')) {
            await this.removeCapability('fan_speed');
        }
        if (!this.hasCapability(`${this.brand}_fan_speed`)) {
            await this.addCapability(`${this.brand}_fan_speed`);
        }
        this.registerCapabilityListener(`${this.brand}_fan_speed`, async (value: string) => {
            this.log('fan_speed capability changed to:', value);

            try {
                await this.apiClient.setFanSpeed(value);
                await this.setCapabilityValue(`${this.brand}_fan_speed`, value);
                this.log('fan speed set successfully to:', value);
            } catch (error) {
                this.error('failed to set fan speed:', error);
                throw new Error(`failed to set fan speed to ${value}: ${error}`);
            }
        });

        // vane_mode
        if (this.hasCapability('vane_mode')) {
            await this.removeCapability('vane_mode');
        }
        if (!this.hasCapability(`${this.brand}_vane_mode`)) {
            await this.addCapability(`${this.brand}_vane_mode`);
        }
        this.registerCapabilityListener(`${this.brand}_vane_mode`, async (value: string) => {
            this.log('vane_mode capability changed to:', value);

            try {
                await this.apiClient.setVaneMode(value);
                await this.setCapabilityValue(`${this.brand}_vane_mode`, value);
                this.log('vane mode set successfully to:', value);
            } catch (error) {
                this.error('failed to set vane mode:', error);
                throw new Error(`failed to set vane mode to ${value}: ${error}`);
            }
        });

        // wide_vane_mode
        if (this.hasCapability('wide_vane_mode')) {
            await this.removeCapability('wide_vane_mode');
        }
        if (!this.hasCapability(`${this.brand}_wide_vane_mode`)) {
            await this.addCapability(`${this.brand}_wide_vane_mode`);
        }
        this.registerCapabilityListener(`${this.brand}_wide_vane_mode`, async (value: string) => {
            this.log('wide_vane_mode capability changed to:', value);

            try {
                await this.apiClient.setWideVaneMode(value);
                await this.setCapabilityValue(`${this.brand}_wide_vane_mode`, value);
                this.log('horizontal vane set successfully to:', value);
            } catch (error) {
                this.error('failed to set horizontal vane:', error);
                throw new Error(`failed to set horizontal vane to ${value}: ${error}`);
            }
        });

        // capabilities added later might need to be added to older devices
        if (this.hasCapability('defrost_active')) {
            await this.removeCapability('defrost_active');
        }
        if (!this.hasCapability(`${this.brand}_defrost_active`)) {
            await this.addCapability(`${this.brand}_defrost_active`);
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
}

export default ClimateControlDevice;
