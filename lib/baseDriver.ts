import Homey from 'homey';

class ClimateControlDriver extends Homey.Driver {
    protected brand!: string

    async onInit() {
        // generate brand-specific names for the capabilities
        const operatingModeCapabilityName = `${this.brand}_operating_mode`
        const fanSpeedCapabilityName = `${this.brand}_fan_speed`
        const vaneModeCapabilityName = `${this.brand}_vane_mode`
        const wideVaneModeCapabilityName = `${this.brand}_wide_vane_mode`

        // Trigger ("When...") flow card listeners are auto-generated

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
    }

    async onPairListDevices() {
        const discoveryStrategy = this.getDiscoveryStrategy();
        const discoveryResults = discoveryStrategy.getDiscoveryResults();

        const devices = Object.values(discoveryResults).map((discoveryResult: any) => {
            return {
                name: discoveryResult.txt.friendly_name,
                data: {
                    id: discoveryResult.id,
                },
                store: {
                    address: discoveryResult.address,
                    port: discoveryResult.port,
                    path: discoveryResult.txt.path,
                }
            };
        });

        this.log("returning devices:", devices.length);
        return devices;
    }
}

export default ClimateControlDriver;
