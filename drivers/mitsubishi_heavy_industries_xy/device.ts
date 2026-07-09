import ClimateControlDevice from '../../lib/baseDevice';
import {MitsubishiHeavyIndustriesXyStatus} from "../../lib/apiClient";

module.exports = class MitsubishiHeavyIndustriesXyDevice extends ClimateControlDevice {
    async onInit() {
        this.apiEndpoints = {
            power: 'power',
            set_temperature: 'set_temperature',
            operating_mode: 'mode',
            fan_speed: 'fan',
            vane_mode: 'vane',
            remote_temperature: 'remote_temperature',
        };

        this.brand = "mhi_xy"
        await super.onInit();

        // Start polling
        await this.startPolling(this.getSetting("polling_interval") || 1 as number)

        this.log('MitsubishiHeavyIndustriesXyDevice has been initialized');
    }

    async updateStatus() {
        try {
            const status: MitsubishiHeavyIndustriesXyStatus = await this.apiClient.getStatus();
            await this.updateStatusBase(status);

            // brand-specific capabilities
            await this.setCapabilityValue(`${this.brand}_vane_mode`, status.heatpump.vane);
        } catch (error) {
            this.error('failed to update status:', error);
            await this.setUnavailable(error instanceof Error ? error.message : "Unknown error");
        }
    }
};
