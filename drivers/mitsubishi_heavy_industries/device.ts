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
            if (Homey.env.NODE_ENV === 'development') {
                this.log('status received:\n', status);
            }

            await this.setCapabilityValue('onoff', status.heatpump.power === 'on');
            await this.setCapabilityValue(`${this.brand}_operating_mode`, status.heatpump.mode);
            await this.setCapabilityValue(`${this.brand}_fan_speed`, status.heatpump.fan);
            await this.setCapabilityValue(`${this.brand}_vane_mode`, status.heatpump.vane);
            await this.setCapabilityValue(`${this.brand}_wide_vane_mode`, status.heatpump.vanelr);
            await this.setCapabilityValue(`${this.brand}_defrost_active`, status.heatpump.op.defrost);
            await this.setCapabilityValue('target_temperature', status.heatpump.set_temperature);
            await this.setCapabilityValue('meter_power', status.heatpump.op.consumption);
            await this.setCapabilityValue('measure_power', status.heatpump.op.current * 230); // current in Amps, approximate W by using 230V
            await this.setCapabilityValue('measure_temperature', status.sensor.thermometer.tact ? status.sensor.thermometer.tact : status.heatpump.actual_temperature);
            if (status.heatpump.op.outdoor != 0) {
                // 0 is used for "absent" value, so we can't use it as the real 0°C
                await this.setCapabilityValue('measure_temperature.outside', status.heatpump.op.outdoor);
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
