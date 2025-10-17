import Homey from 'homey';
import ClimateControlDevice from '../../lib/baseDevice';

module.exports = class MitsubishiElectricDevice extends ClimateControlDevice {

    /**
     * onInit is called when the device is initialized.
     */
    async onInit() {
        this.log('MitsubishiElectricDevice has been initialized');

        this.apiEndpoints = {
            power: 'power',
            set_temperature: 'set_temperature',
            fan_speed: 'fan',
            operating_mode: 'mode',
            vane_mode: 'vane',
            wide_vane_mode: 'widevane'
        };

        await super.onInit();

        // Get initial status
        await this.updateStatus();

        // Poll for status every 60 seconds
        this.homey.setInterval(async () => {
            await this.updateStatus();
        }, 60000);
    }

    async updateStatus() {
        try {
            const status = await this.apiClient.getMitsubishiElectricStatus();
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
            await this.setCapabilityValue('defrost_active', status.heatpump.defrost);
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

    /**
     * onDeleted is called when the user deleted the device.
     */
    async onDeleted() {
        this.log('MitsubishiElectricDevice has been deleted');
    }
};
