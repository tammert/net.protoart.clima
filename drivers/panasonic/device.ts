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
        this.registerApiCapabilityListener(`${this.brand}_milddry`, 'setMildDry', 'mild dry');
        this.registerApiCapabilityListener(`${this.brand}_nanoex`, 'setNanoEx', 'nanoex');
        this.registerApiCapabilityListener(`${this.brand}_eco`, 'setEco', 'eco');
        this.registerApiCapabilityListener(`${this.brand}_econavi`, 'setEcoNavi', 'econavi');
        this.registerApiCapabilityListener(`${this.brand}_preset`, 'setPreset', 'preset');

        // Start polling
        await this.startPolling(this.getSetting("polling_interval") || 1 as number)

        this.log('PanasonicDevice has been initialized');
    }

    async updateStatus() {
        try {
            const status: PanasonicStatus = await this.apiClient.getStatus();
            await this.updateStatusBase(status);

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
            await this.setUnavailable(error instanceof Error ? error.message : "Unknown error");
        }
    }

    async onAdded() {
        this.log('PanasonicDevice has been added');
    }

    async onRenamed(name: string) {
        this.log('PanasonicDevice was renamed');
    }
};
