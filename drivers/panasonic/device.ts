import Homey from 'homey';
import ClimateControlDevice from '../../lib/baseDevice';
import {PanasonicStatus} from "../../lib/apiClient";
import {toBoolean} from "../../lib/utils";

module.exports = class PanasonicDevice extends ClimateControlDevice {
    async onInit() {
        this.apiEndpoints = {
            power: 'power',
            set_temperature: 'set_temperature',
            operating_mode: 'mode',
            fan_speed: 'fan',
            vane_mode: 'vane',
            wide_vane_mode: 'widevane',
            remote_temperature: 'remote_temperature',
            milddry: 'milddry',
            nanoex: 'nanoex',
            eco: 'eco',
            econavi: 'econavi',
            preset: 'preset'
        };

        this.brand = "pana"
        await super.onInit();
        await super.migrateCapabilities(
            [],
            []
        )

        // Register brand-specific capability listeners
        this.registerCapabilityListener(`${this.brand}_milddry`, async (value: boolean) => {
            await this.apiClient.setMildDry(value);
        });
        this.registerCapabilityListener(`${this.brand}_nanoex`, async (value: boolean) => {
            await this.apiClient.setNanoEx(value);
        });
        this.registerCapabilityListener(`${this.brand}_eco`, async (value: boolean) => {
            await this.apiClient.setEco(value);
        });
        this.registerCapabilityListener(`${this.brand}_econavi`, async (value: boolean) => {
            await this.apiClient.setEcoNavi(value);
        });
        this.registerCapabilityListener(`${this.brand}_preset`, async (value: string) => {
            await this.apiClient.setPreset(value as any);
        });

        // Start polling
        await this.startPolling(this.getSetting("polling_interval") || 1 as number)

        this.log('PanasonicDevice has been initialized');
    }

    async updateStatus() {
        try {
            const status: PanasonicStatus = await this.apiClient.getStatus();
            await super.updateStatus(status);

            // brand-specific capabilities
            await this.setCapabilityValue(`${this.brand}_vane_mode`, status.heatpump.vane);
            await this.setCapabilityValue(`${this.brand}_wide_vane_mode`, status.heatpump.widevane);
            await this.setCapabilityValue(`${this.brand}_defrost_active`, toBoolean(status.heatpump.op.defrost));
            await this.setCapabilityValue(`${this.brand}_milddry`, toBoolean(status.heatpump.milddry));
            await this.setCapabilityValue(`${this.brand}_nanoex`, toBoolean(status.heatpump.nanoex));
            await this.setCapabilityValue(`${this.brand}_eco`, toBoolean(status.heatpump.eco));
            await this.setCapabilityValue(`${this.brand}_econavi`, toBoolean(status.heatpump.econavi));
            await this.setCapabilityValue(`${this.brand}_preset`, status.heatpump.preset);

            await this.setCapabilityValue('measure_power', status.heatpump.op.pinp);
            await this.setCapabilityValue('measure_temperature.outside', status.heatpump.op.tout);
        } catch (error) {
            this.error('failed to update status:', error);
        }
    }

    async onAdded() {
        this.log('PanasonicDevice has been added');
    }

    async onRenamed(name: string) {
        this.log('PanasonicDevice was renamed');
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
