import Homey from 'homey';
import ClimateControlDevice from '../../lib/baseDevice';
import {LGStatus} from "../../lib/apiClient";

module.exports = class LGDevice extends ClimateControlDevice {
    async onInit() {
        this.apiEndpoints = {
            power: 'power',
            set_temperature: 'set_temperature',
            operating_mode: 'mode',
            fan_speed: 'fan',
            vane_mode: 'vane1',
            wide_vane_mode: 'vane0',
            remote_temperature: 'remote_temperature'
        };

        this.brand = "lg"
        await super.onInit();

        // Start polling
        await this.startPolling(this.getSetting("polling_interval") || 1 as number)

        this.log('LGDevice has been initialized');
    }

    async updateStatus() {
        try {
            const status: LGStatus = await this.apiClient.getStatus();
            await super.updateStatus(status);

            // brand-specific capabilities
            await this.setCapabilityValue(`${this.brand}_vane_mode`, status.heatpump.vane0);
            await this.setCapabilityValue(`${this.brand}_wide_vane_mode`, status.heatpump.vane1);
            await this.setCapabilityValue(`${this.brand}_defrost_active`, status.heatpump.opdata.defrost);
        } catch (error) {
            this.error('failed to update status:', error);
        }
    }

    async onAdded() {
        this.log('LGDevice has been added');
    }

    async onRenamed(name: string) {
        this.log('LGDevice was renamed');
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
