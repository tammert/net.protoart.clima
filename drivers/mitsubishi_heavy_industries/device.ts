import Homey from 'homey';
import ClimateControlDevice from '../../lib/baseDevice';
import {MitsubishiHeavyIndustriesStatus} from "../../lib/apiClient";

module.exports = class MitsubishiHeavyIndustriesDevice extends ClimateControlDevice {
    async onInit() {
        this.apiEndpoints = {
            power: 'power',
            set_temperature: 'set_temperature',
            operating_mode: 'mode',
            fan_speed: 'fan',
            vane_mode: 'vane',
            wide_vane_mode: 'vanelr'
        };

        this.brand = "mhi"
        await super.onInit();

        // Get initial status
        await this.updateStatus();

        // Poll for status every 60 seconds
        this.pollingInterval = this.homey.setInterval(async () => {
            await this.updateStatus();
        }, 60000);

        this.log('MitsubishiHeavyIndustriesDevice has been initialized');
    }

    async updateStatus() {
        try {
            const status: MitsubishiHeavyIndustriesStatus = await this.apiClient.getStatus();
            await super.updateStatus(status);

            // brand-specific capabilities
            await this.setCapabilityValue(`${this.brand}_wide_vane_mode`, status.heatpump.vanelr);
            await this.setCapabilityValue(`${this.brand}_defrost_active`, status.heatpump.op.defrost);
            await this.setCapabilityValue('meter_power', status.heatpump.op.consumption);
            await this.setCapabilityValue('measure_power', status.heatpump.op.current * 230); // current in Amps, approximate W by using 230V
            if (status.heatpump.op.outdoor != 0) {
                // 0 is used for "absent" value, so we can't use it as the real 0°C
                await this.setCapabilityValue('measure_temperature.outside', status.heatpump.op.outdoor);
            }
        } catch (error) {
            this.error('failed to update status:', error);
        }
    }

    /**
     * onAdded is called when the user adds the device, called just after pairing.
     */
    async onAdded() {
        this.log('MitsubishiHeavyIndustriesDevice has been added');
    }

    /**
     * onRenamed is called when the user updates the device's name.
     * This method can be used this to synchronise the name to the device.
     * @param {string} name The new name
     */
    async onRenamed(name: string) {
        this.log('MitsubishiHeavyIndustriesDevice was renamed');
    }
};
