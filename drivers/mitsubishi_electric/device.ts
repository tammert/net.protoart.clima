import ClimateControlDevice from '../../lib/baseDevice';
import {MitsubishiElectricStatus} from "../../lib/apiClient";
import {toBoolean} from "../../lib/utils";

module.exports = class MitsubishiElectricDevice extends ClimateControlDevice {
    async onInit() {
        this.apiEndpoints = {
            power: 'power',
            set_temperature: 'set_temperature',
            operating_mode: 'mode',
            fan_speed: 'fan',
            vane_mode: 'vane',
            wide_vane_mode: 'widevane',
            remote_temperature: 'remote_temperature'
        };

        this.brand = "me"
        await super.onInit();
        await super.migrateCapabilities(
            [],
            []
        )

        // Start polling
        await this.startPolling(this.getSetting("polling_interval") || 1 as number)

        this.log('MitsubishiElectricDevice has been initialized');
    }

    async updateStatus() {
        try {
            const status: MitsubishiElectricStatus = await this.apiClient.getStatus();
            await this.updateStatusBase(status);

            // brand-specific capabilities
            await this.setCapabilityValue(`${this.brand}_vane_mode`, status.heatpump.vane);
            await this.setCapabilityValue(`${this.brand}_wide_vane_mode`, status.heatpump.widevane);
            await this.setCapabilityValue(`${this.brand}_defrost_active`, toBoolean(status.heatpump.defrost));
            await this.setCapabilityValue('meter_power', status.heatpump.tpcns);
            await this.setCapabilityValue('measure_power', status.heatpump.pinp);
            if (status.heatpump.oper || status.heatpump.tout != 0) {
                // outside temperature is only reported when the unit is on
                await this.setCapabilityValue('measure_temperature.outside', status.heatpump.tout);
            }
        } catch (error) {
            this.error('failed to update status:', error);
            await this.setUnavailable(error instanceof Error ? error.message : "Unknown error");
        }
    }

    async onAdded() {
        this.log('MitsubishiElectricDevice has been added');
    }

    async onRenamed(name: string) {
        this.log('MitsubishiElectricDevice was renamed');
    }
};
