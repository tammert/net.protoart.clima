import Homey from 'homey';

class ClimateControlDriver extends Homey.Driver {
    protected brand!: string

    async onInit() {
        // generate brand-specific names for the capabilities
        const operatingModeCapabilityName = `${this.brand}_operating_mode`
        const fanSpeedCapabilityName = `${this.brand}_fan_speed`
        const vaneModeCapabilityName = `${this.brand}_vane_mode`
        const wideVaneModeCapabilityName = `${this.brand}_wide_vane_mode`
        const defrostCapabilityName = `${this.brand}_defrost_active`

        // Trigger ("When...") flow card listeners
        this.homey.flow.getTriggerCard(`${operatingModeCapabilityName}_changed`).registerRunListener(async (args, state) => {
            return args[operatingModeCapabilityName] === args.device.getCapabilityValue(operatingModeCapabilityName);
        });
        this.homey.flow.getTriggerCard(`${fanSpeedCapabilityName}_changed`).registerRunListener(async (args, state) => {
            return args[fanSpeedCapabilityName] === args.device.getCapabilityValue(fanSpeedCapabilityName);
        });
        this.homey.flow.getTriggerCard(`${vaneModeCapabilityName}_changed`).registerRunListener(async (args, state) => {
            return args[vaneModeCapabilityName] === args.device.getCapabilityValue(vaneModeCapabilityName);
        });
        this.homey.flow.getTriggerCard(`${wideVaneModeCapabilityName}_changed`).registerRunListener(async (args, state) => {
            return args[wideVaneModeCapabilityName] === args.device.getCapabilityValue(wideVaneModeCapabilityName);
        });
        this.homey.flow.getTriggerCard(`${defrostCapabilityName}_true`).registerRunListener(async (args, state) => {
            return args.device.getCapabilityValue(defrostCapabilityName);
        });
        this.homey.flow.getTriggerCard(`${defrostCapabilityName}_false`).registerRunListener(async (args, state) => {
            return !args.device.getCapabilityValue(defrostCapabilityName);
        });

        // Condition ("And...") flow card listeners
        this.homey.flow.getConditionCard(`${operatingModeCapabilityName}_is`).registerRunListener(async (args, state) => {
            return args[operatingModeCapabilityName] === args.device.getCapabilityValue(operatingModeCapabilityName);
        });
        this.homey.flow.getConditionCard(`${fanSpeedCapabilityName}_is`).registerRunListener(async (args, state) => {
            return args[fanSpeedCapabilityName] === args.device.getCapabilityValue(fanSpeedCapabilityName);
        });
        this.homey.flow.getConditionCard(`${vaneModeCapabilityName}_is`).registerRunListener(async (args, state) => {
            return args[vaneModeCapabilityName] === args.device.getCapabilityValue(vaneModeCapabilityName);
        });
        this.homey.flow.getConditionCard(`${wideVaneModeCapabilityName}_is`).registerRunListener(async (args, state) => {
            return args[wideVaneModeCapabilityName] === args.device.getCapabilityValue(wideVaneModeCapabilityName);
        });

        // Action ("Then...") flow card listeners
        this.homey.flow.getActionCard(`${operatingModeCapabilityName}_set`).registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener(operatingModeCapabilityName, args[operatingModeCapabilityName]);
        });
        this.homey.flow.getActionCard(`${fanSpeedCapabilityName}_set`).registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener(fanSpeedCapabilityName, args[fanSpeedCapabilityName]);
        });
        this.homey.flow.getActionCard(`${vaneModeCapabilityName}_set`).registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener(vaneModeCapabilityName, args[vaneModeCapabilityName]);
        });
        this.homey.flow.getActionCard(`${wideVaneModeCapabilityName}_set`).registerRunListener(async (args, state) => {
            await args.device.triggerCapabilityListener(wideVaneModeCapabilityName, args[wideVaneModeCapabilityName]);
        });
        this.homey.flow.getActionCard(`${this.brand}_remote_temperature_set`).registerRunListener(async (args, state) => {
            await args.device.apiClient.setRemoteTemperature(args['remote_temperature']);
        });
    }

    async onPairListDevices() {
        const discoveryStrategy = this.getDiscoveryStrategy();
        const discoveryResults = discoveryStrategy.getDiscoveryResults();

        if (Homey.env.NODE_ENV === 'development') {
            this.log('onPairListDevices:\n', discoveryStrategy);
        }

        const devices = Object.values(discoveryResults).map((discoveryResult: any) => {
            return {
                name: discoveryResult.txt.friendly_name,
                data: {
                    id: discoveryResult.id,
                    model: discoveryResult.txt.model,
                },
                store: {
                    address: discoveryResult.address,
                    port: discoveryResult.port,
                    path: discoveryResult.txt.path,
                }
            };
        });

        // return only devices matching the brand
        const pattern = new RegExp(`^${this.brand.toUpperCase()}_`);
        return devices.filter(device => {
            return device.data.model && pattern.test(device.data.model);
        });
    }
}

export default ClimateControlDriver;
