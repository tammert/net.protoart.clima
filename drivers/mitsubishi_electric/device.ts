import Homey from 'homey';
import ClimateControlDevice from '../../lib/baseDevice';
import {MitsubishiElectricStatus} from "../../lib/apiClient";

module.exports = class MitsubishiElectricDevice extends ClimateControlDevice {
    async onInit() {
        this.apiEndpoints = {
            power: 'power',
            set_temperature: 'set_temperature',
            operating_mode: 'mode',
            fan_speed: 'fan',
            vane_mode: 'vane',
            wide_vane_mode: 'widevane'
        };

        this.brand = "me"
        await super.onInit();

        // Get initial status
        await this.updateStatus();

        // Poll for status every 60 seconds
        this.pollingInterval = this.homey.setInterval(async () => {
            await this.updateStatus();
        }, 60000);

        this.log('MitsubishiElectricDevice has been initialized');
    }

    async updateStatus() {
        try {
            const status: MitsubishiElectricStatus = await this.apiClient.getStatus();
            await super.updateStatus(status);

            // brand-specific capabilities
            await this.setCapabilityValue(`${this.brand}_wide_vane_mode`, status.heatpump.widevane);
            await this.setCapabilityValue(`${this.brand}_defrost_active`, status.heatpump.defrost);
            await this.setCapabilityValue('meter_power', status.heatpump.tpcns);
            await this.setCapabilityValue('measure_power', status.heatpump.pinp);
            if (status.heatpump.tout != 0) {
                // 0 is used for "absent" value, so we can't use it as the real 0°C
                await this.setCapabilityValue('measure_temperature.outside', status.heatpump.tout);
            }
        } catch (error) {
            this.error('failed to update status:', error);
        }
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('MitsubishiElectricDevice has been added');
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name: string) {
        this.log('MitsubishiElectricDevice was renamed');
    }
};
