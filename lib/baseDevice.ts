import Homey from 'homey';
import ApiClient, {ApiEndpoints} from "./apiClient";

class ClimateControlDevice extends Homey.Device {
    protected apiClient!: ApiClient
    protected apiEndpoints!: ApiEndpoints

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
        this.registerCapabilityListener('operating_mode', async (value: string) => {
            this.log('operating_mode capability changed to:', value);

            try {
                await this.apiClient.setOperatingMode(value);
                await this.setCapabilityValue('operating_mode', value);
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
        this.registerCapabilityListener('fan_speed', async (value: string) => {
            this.log('fan_speed capability changed to:', value);

            try {
                await this.apiClient.setFanSpeed(value);
                await this.setCapabilityValue('fan_speed', value);
                this.log('fan speed set successfully to:', value);
            } catch (error) {
                this.error('failed to set fan speed:', error);
                throw new Error(`failed to set fan speed to ${value}: ${error}`);
            }
        });

        // vane_mode
        this.registerCapabilityListener('vane_mode', async (value: string) => {
            this.log('vane_mode capability changed to:', value);

            try {
                await this.apiClient.setVaneMode(value);
                await this.setCapabilityValue('vane_mode', value);
                this.log('vane mode set successfully to:', value);
            } catch (error) {
                this.error('failed to set vane mode:', error);
                throw new Error(`failed to set vane mode to ${value}: ${error}`);
            }
        });

        // wide_vane_mode
        this.registerCapabilityListener('wide_vane_mode', async (value: string) => {
            this.log('wide_vane_mode capability changed to:', value);

            try {
                await this.apiClient.setWideVaneMode(value);
                await this.setCapabilityValue('wide_vane_mode', value);
                this.log('wide vane set successfully to:', value);
            } catch (error) {
                this.error('failed to set wide vane:', error);
                throw new Error(`failed to set wide vane to ${value}: ${error}`);
            }
        });
    }

    // when the IP address changes, persists the new value in the store
    onDiscoveryAddressChanged(discoveryResult: any) {
        if (Homey.env.NODE_ENV === 'development') {
            this.log('onDiscoveryAddressChanged:\n', discoveryResult);
        }

        const address: string = discoveryResult.address
        this.setStoreValue('address', address).then(r => {return true})
        this.apiClient = new ApiClient(address, discoveryResult.port, discoveryResult.txt.path, this.apiEndpoints);
        this.log(`updated ${this.getName()} IP address to ${address}`)
    }
}

export default ClimateControlDevice;
