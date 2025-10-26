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
            wide_vane_mode: 'widevane',
            remote_temperature: 'remote_temperature'
        };

        this.brand = "me"
        await super.onInit();

        // Start polling
        await this.startPolling(this.getSetting("polling_interval") || 1 as number)

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
            if (status.heatpump.oper || status.heatpump.tout != 0) {
                // outside temperature is only reported when the unit is on
                await this.setCapabilityValue('measure_temperature.outside', status.heatpump.tout);
            }
        } catch (error) {
            this.error('failed to update status:', error);
        }
    }

    async onAdded() {
        this.log('MitsubishiElectricDevice has been added');
    }

    async onRenamed(name: string) {
        this.log('MitsubishiElectricDevice was renamed');
    }

    async onSettings({oldSettings, newSettings, changedKeys}: {
        oldSettings: { [p: string]: boolean | string | number | undefined | null };
        newSettings: { [p: string]: boolean | string | number | undefined | null };
        changedKeys: string[]
    }): Promise<string | void> {
        if (Homey.env.NODE_ENV === 'development') {
            this.log('onSettings:\n', oldSettings, newSettings, changedKeys);
        }

        if (changedKeys.includes("polling_interval")) {
            this.pollingInterval.close()
            await this.startPolling(<number>newSettings["polling_interval"]);
        }
        if (changedKeys.includes("temperature_step_size")) {
            const opts = this.getCapabilityOptions("target_temperature")
            opts.step = newSettings["temperature_step_size"];
            await this.setCapabilityOptions("target_temperature", opts);
        }
    }

    async startPolling(pollingInterval: number) {
        await this.updateStatus();
        this.pollingInterval = this.homey.setInterval(async () => {
            await this.updateStatus();
        }, pollingInterval * 60000);
    }
};
