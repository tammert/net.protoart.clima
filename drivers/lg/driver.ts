import ClimateControlDriver from '../../lib/baseDriver';

module.exports = class LGDriver extends ClimateControlDriver {
    async onInit() {
        this.brand = "lg"
        await super.onInit();

        // LG-specific trigger ("When...") flow card listeners
        this.homey.flow.getTriggerCard('lg_autodry_true').registerRunListener(async (args, state) => {
            return args.device.getCapabilityValue('lg_autodry');
        });
        this.homey.flow.getTriggerCard('lg_autodry_false').registerRunListener(async (args, state) => {
            return !args.device.getCapabilityValue('lg_autodry');
        });
        this.homey.flow.getTriggerCard('lg_purifier_true').registerRunListener(async (args, state) => {
            return args.device.getCapabilityValue('lg_purifier');
        });
        this.homey.flow.getTriggerCard('lg_purifier_false').registerRunListener(async (args, state) => {
            return !args.device.getCapabilityValue('lg_purifier');
        });
        this.homey.flow.getTriggerCard('lg_energy_saving_true').registerRunListener(async (args, state) => {
            return args.device.getCapabilityValue('lg_energy_saving');
        });
        this.homey.flow.getTriggerCard('lg_energy_saving_false').registerRunListener(async (args, state) => {
            return !args.device.getCapabilityValue('lg_energy_saving');
        });
        this.homey.flow.getTriggerCard('lg_hswing_true').registerRunListener(async (args, state) => {
            return args.device.getCapabilityValue('lg_hswing');
        });
        this.homey.flow.getTriggerCard('lg_hswing_false').registerRunListener(async (args, state) => {
            return !args.device.getCapabilityValue('lg_hswing');
        });
        this.homey.flow.getTriggerCard('lg_vswing_true').registerRunListener(async (args, state) => {
            return args.device.getCapabilityValue('lg_vswing');
        });
        this.homey.flow.getTriggerCard('lg_vswing_false').registerRunListener(async (args, state) => {
            return !args.device.getCapabilityValue('lg_vswing');
        });

        // LG-specific condition ("And...") flow card listeners
        this.homey.flow.getConditionCard('lg_autodry_is').registerRunListener(async (args, state) => {
            return args.lg_autodry === args.device.getCapabilityValue('lg_autodry');
        });
        this.homey.flow.getConditionCard('lg_purifier_is').registerRunListener(async (args, state) => {
            return args.lg_purifier === args.device.getCapabilityValue('lg_purifier');
        });
        this.homey.flow.getConditionCard('lg_energy_saving_is').registerRunListener(async (args, state) => {
            return args.lg_energy_saving === args.device.getCapabilityValue('lg_energy_saving');
        });
        this.homey.flow.getConditionCard('lg_hswing_is').registerRunListener(async (args, state) => {
            return args.lg_hswing === args.device.getCapabilityValue('lg_hswing');
        });
        this.homey.flow.getConditionCard('lg_vswing_is').registerRunListener(async (args, state) => {
            return args.lg_vswing === args.device.getCapabilityValue('lg_vswing');
        });

        // LG-specific action ("Then...") flow card listeners
        this.homey.flow.getActionCard('lg_autodry_set').registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener('lg_autodry', args.boolean);
        });
        this.homey.flow.getActionCard('lg_purifier_set').registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener('lg_purifier', args.boolean);
        });
        this.homey.flow.getActionCard('lg_energy_saving_set').registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener('lg_energy_saving', args.boolean);
        });
        this.homey.flow.getActionCard('lg_hswing_set').registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener('lg_hswing', args.boolean);
        });
        this.homey.flow.getActionCard('lg_vswing_set').registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener('lg_vswing', args.boolean);
        });

        this.log('LGDriver has been initialized');
    }
}
