import Homey from 'homey';

class ClimateControlDriver extends Homey.Driver {
    protected brand!: string

    async onInit() {
        // Trigger ("When...") flow card listeners are auto-generated

        // Condition ("And...") flow card listeners
        this.homey.flow.getConditionCard(`${this.brand}_operating_mode_is`).registerRunListener(async (args, state) => {
            return args.operating_mode === args.device.getCapabilityValue("operating_mode");
        });
        this.homey.flow.getConditionCard(`${this.brand}_fan_speed_is`).registerRunListener(async (args, state) => {
            return args.fan_speed === args.device.getCapabilityValue("fan_speed");
        });
        this.homey.flow.getConditionCard(`${this.brand}_vane_mode_is`).registerRunListener(async (args, state) => {
            return args.vane_mode === args.device.getCapabilityValue("vane_mode");
        });
        this.homey.flow.getConditionCard(`${this.brand}_wide_vane_mode_is`).registerRunListener(async (args, state) => {
            return args.wide_vane_mode === args.device.getCapabilityValue("wide_vane_mode");
        });

        // Action ("Then...") flow card listeners
        this.homey.flow.getActionCard(`${this.brand}_operating_mode_set`).registerRunListener(async (args, state) => {
            this.homey.log(`${this.brand}_operating_mode_set`)
            await args.device.triggerCapabilityListener('operating_mode', args.operating_mode);
        });
        this.homey.flow.getActionCard(`${this.brand}_fan_speed_set`).registerRunListener(async (args, state) => {
            this.homey.log(`${this.brand}_operating_mode_set`)
            await args.device.triggerCapabilityListener('fan_speed', args.fan_speed);
        });
        this.homey.flow.getActionCard(`${this.brand}_vane_mode_set`).registerRunListener(async (args, state) => {
            this.homey.log(`${this.brand}_vane_mode_set`)
            await args.device.triggerCapabilityListener('vane_mode', args.vane_mode);
        });
        this.homey.flow.getActionCard(`${this.brand}_wide_vane_mode_set`).registerRunListener(async (args, state) => {
            this.homey.log(`${this.brand}_wide_vane_mode_set`)
            await args.device.triggerCapabilityListener('wide_vane', args.wide_vane);
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
