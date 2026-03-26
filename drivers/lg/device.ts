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
            remote_temperature: 'remote_temperature',
            autodry: 'autodry',
            purifier: 'purifier',
            energy_saving: 'energy_saving',
            hswing: 'hswing',
            vswing: 'vswing'
        };

        this.brand = "lg"
        await super.onInit();
        await super.migrateCapabilities(
            ['lg_autodry', 'lg_purifier', 'lg_energy_saving', 'lg_hswing', 'lg_vswing'],
            ['lg_wide_vane_mode']
        )

        // LG specific listeners
        this.registerCapabilityListener(`${this.brand}_autodry`, async (value: boolean) => {
            this.log('autodry capability changed to:', value);

            try {
                await this.apiClient.setAutodry(value);
                await this.setCapabilityValue(`${this.brand}_autodry`, value);
                this.log('autodry set successfully to:', value);
            } catch (error) {
                this.error('failed to set autodry:', error);
                throw new Error(`failed to set autodry to ${value}: ${error}`);
            }
        });

        this.registerCapabilityListener(`${this.brand}_purifier`, async (value: boolean) => {
            this.log('purifier capability changed to:', value);

            try {
                await this.apiClient.setPurifier(value);
                await this.setCapabilityValue(`${this.brand}_purifier`, value);
                this.log('purifier set successfully to:', value);
            } catch (error) {
                this.error('failed to set purifier:', error);
                throw new Error(`failed to set purifier to ${value}: ${error}`);
            }
        });

        this.registerCapabilityListener(`${this.brand}_energy_saving`, async (value: boolean) => {
            this.log('energy_saving capability changed to:', value);

            try {
                await this.apiClient.setEnergySaving(value);
                await this.setCapabilityValue(`${this.brand}_energy_saving`, value);
                this.log('energy saving set successfully to:', value);
            } catch (error) {
                this.error('failed to set energy saving:', error);
                throw new Error(`failed to set energy saving to ${value}: ${error}`);
            }
        });

        this.registerCapabilityListener(`${this.brand}_hswing`, async (value: boolean) => {
            this.log('hswing capability changed to:', value);

            try {
                await this.apiClient.setHSwing(value);
                await this.setCapabilityValue(`${this.brand}_hswing`, value);
                this.log('horizontal swing set successfully to:', value);
            } catch (error) {
                this.error('failed to set horizontal swing:', error);
                throw new Error(`failed to set horizontal swing to ${value}: ${error}`);
            }
        });

        this.registerCapabilityListener(`${this.brand}_vswing`, async (value: boolean) => {
            this.log('vswing capability changed to:', value);

            try {
                await this.apiClient.setVSwing(value);
                await this.setCapabilityValue(`${this.brand}_vswing`, value);
                this.log('vertical swing set successfully to:', value);
            } catch (error) {
                this.error('failed to set vertical swing:', error);
                throw new Error(`failed to set vertical swing to ${value}: ${error}`);
            }
        });

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
            await this.setCapabilityValue(`${this.brand}_defrost_active`, status.heatpump.opdata.defrost);
            await this.setCapabilityValue(`${this.brand}_autodry`, status.heatpump.autodry);
            await this.setCapabilityValue(`${this.brand}_purifier`, status.heatpump.purifier);
            await this.setCapabilityValue(`${this.brand}_energy_saving`, status.heatpump.energy_saving);
            await this.setCapabilityValue(`${this.brand}_hswing`, status.heatpump.hswing);
            await this.setCapabilityValue(`${this.brand}_vswing`, status.heatpump.vswing);
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
