import Homey from 'homey';
import ClimateControlDevice from '../../lib/baseDevice';
import {LGStatus} from "../../lib/apiClient";
import {toBoolean} from "../../lib/utils";

module.exports = class LGDevice extends ClimateControlDevice {
    async onInit() {
        this.apiEndpoints = {
            power: 'power',
            set_temperature: 'set_temperature',
            operating_mode: 'mode',
            fan_speed: 'fan',
            vane_mode: 'vane',
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
        this.registerApiCapabilityListener(`${this.brand}_autodry`, 'setAutodry', 'autodry');
        this.registerApiCapabilityListener(`${this.brand}_purifier`, 'setPurifier', 'purifier');
        this.registerApiCapabilityListener(`${this.brand}_energy_saving`, 'setEnergySaving', 'energy saving');
        this.registerApiCapabilityListener(`${this.brand}_hswing`, 'setHSwing', 'horizontal swing');
        this.registerApiCapabilityListener(`${this.brand}_vswing`, 'setVSwing', 'vertical swing');

        // Start polling
        await this.startPolling(this.getSetting("polling_interval") || 1 as number)

        this.log('LGDevice has been initialized');
    }

    async updateStatus() {
        try {
            const status: LGStatus = await this.apiClient.getStatus();
            await this.updateStatusBase(status);

            // brand-specific capabilities
            await this.setCapabilityValue(`${this.brand}_vane_mode`, status.heatpump.vane1);
            await this.setCapabilityValue(`${this.brand}_defrost_active`, toBoolean(status.heatpump.opdata.defrost));
            await this.setCapabilityValue(`${this.brand}_autodry`, toBoolean(status.heatpump.autodry));
            await this.setCapabilityValue(`${this.brand}_purifier`, toBoolean(status.heatpump.purifier));
            await this.setCapabilityValue(`${this.brand}_energy_saving`, toBoolean(status.heatpump.energy_saving));
            await this.setCapabilityValue(`${this.brand}_hswing`, toBoolean(status.heatpump.hswing));
            await this.setCapabilityValue(`${this.brand}_vswing`, toBoolean(status.heatpump.vswing));
        } catch (error) {
            this.error('failed to update status:', error);
            await this.setUnavailable(error instanceof Error ? error.message : "Unknown error");
        }
    }

    async onAdded() {
        this.log('LGDevice has been added');
    }

    async onRenamed(name: string) {
        this.log('LGDevice was renamed');
    }
};
