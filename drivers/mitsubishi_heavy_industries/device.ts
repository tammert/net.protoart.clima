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
            wide_vane_mode: 'vanelr',
            remote_temperature: 'remote_temperature'
        };

        this.brand = "mhi"
        await super.onInit();

        // Start polling
        await this.startPolling(this.getSetting("polling_interval") || 1 as number)

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
            if (status.heatpump.oper || status.heatpump.op.outdoor != 0) {
                // outside temperature is only reported when the unit is on
                await this.setCapabilityValue('measure_temperature.outside', status.heatpump.op.outdoor);
            }
        } catch (error) {
            this.error('failed to update status:', error);
        }
    }

    async onAdded() {
        this.log('MitsubishiHeavyIndustriesDevice has been added');
    }

    async onRenamed(name: string) {
        this.log('MitsubishiHeavyIndustriesDevice was renamed');
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
