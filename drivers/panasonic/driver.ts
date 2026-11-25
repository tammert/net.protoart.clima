import ClimateControlDriver from '../../lib/baseDriver';

module.exports = class PanasonicDriver extends ClimateControlDriver {
    async onInit() {
        this.brand = "pana"
        await super.onInit();

        // Panasonic-specific boolean mode ("Then..."/"And..."/"When...") flow card listeners
        for (const mode of ['pana_milddry', 'pana_nanoex', 'pana_eco', 'pana_econavi']) {
            this.homey.flow.getTriggerCard(`${mode}_true`).registerRunListener(async (args, state) => {
                return args.device.getCapabilityValue(mode);
            });
            this.homey.flow.getTriggerCard(`${mode}_false`).registerRunListener(async (args, state) => {
                return !args.device.getCapabilityValue(mode);
            });
            this.homey.flow.getConditionCard(`${mode}_is`).registerRunListener(async (args, state) => {
                return args.device.getCapabilityValue(mode);
            });
            this.homey.flow.getActionCard(`${mode}_set`).registerRunListener(async (args, state) => {
                await args.device.triggerCapabilityListener(mode, args.boolean);
            });
        }

        this.log('PanasonicDriver has been initialized');
    }
}
