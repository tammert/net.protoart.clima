import ClimateControlDriver from '../../lib/baseDriver';

module.exports = class MitsubishiHeavyIndustriesDriver extends ClimateControlDriver {
    async onInit() {
        this.brand = "mhi"
        await super.onInit();

        // MHI-specific trigger ("When...") flow card listeners
        this.homey.flow.getTriggerCard('mhi_silent_mode_true').registerRunListener(async (args, state) => {
            return args.device.getCapabilityValue('mhi_silent_mode');
        });
        this.homey.flow.getTriggerCard('mhi_silent_mode_false').registerRunListener(async (args, state) => {
            return !args.device.getCapabilityValue('mhi_silent_mode');
        });

        // MHI-specific condition ("And...") flow card listeners
        this.homey.flow.getConditionCard('mhi_silent_mode_is').registerRunListener(async (args, state) => {
            return args.device.getCapabilityValue('mhi_silent_mode');
        });

        // MHI-specific action ("Then...") flow card listeners
        this.homey.flow.getActionCard('mhi_silent_mode_set').registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener('mhi_silent_mode', args.boolean);
        });

        this.log('MitsubishiHeavyIndustriesDriver has been initialized');
    }
}
