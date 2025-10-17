import Homey from 'homey';

class ClimateControlDriver extends Homey.Driver {
    async onInit() {
        // Condition ("And...") flow card listeners
        this.homey.flow.getConditionCard("fan_speed_is").registerRunListener(async (args, state) => {
            return args.fan_speed === args.device.getCapabilityValue("fan_speed");
        });
        this.homey.flow.getConditionCard("fan_speed_is_not").registerRunListener(async (args, state) => {
            return args.fan_speed !== args.device.getCapabilityValue("fan_speed");
        });
        this.homey.flow.getConditionCard("operating_mode_is").registerRunListener(async (args, state) => {
            return args.operating_mode === args.device.getCapabilityValue("operating_mode");
        });
        this.homey.flow.getConditionCard("operating_mode_is_not").registerRunListener(async (args, state) => {
            return args.operating_mode !== args.device.getCapabilityValue("operating_mode");
        });
        this.homey.flow.getConditionCard("vane_mode_is").registerRunListener(async (args, state) => {
            return args.vane_mode === args.device.getCapabilityValue("vane_mode");
        });
        this.homey.flow.getConditionCard("vane_mode_is_not").registerRunListener(async (args, state) => {
            return args.vane_mode !== args.device.getCapabilityValue("vane_mode");
        });
        this.homey.flow.getConditionCard("wide_vane_mode_is").registerRunListener(async (args, state) => {
            return args.wide_vane_mode === args.device.getCapabilityValue("wide_vane_mode");
        });
        this.homey.flow.getConditionCard("wide_vane_mode_is_not").registerRunListener(async (args, state) => {
            return args.wide_vane_mode !== args.device.getCapabilityValue("wide_vane_mode");
        });

        // Action ("Then...") flow card listeners
        this.homey.flow.getActionCard('set_fan_speed').registerRunListener(async (args, state) => {
            this.log("set_fan_speed triggered")
            await args.device.triggerCapabilityListener('fan_speed', args.fan_speed);
        });
        this.homey.flow.getActionCard('set_operating_mode').registerRunListener(async (args, state) => {
            this.log("set_operating_mode triggered")
            await args.device.triggerCapabilityListener('operating_mode', args.operating_mode);
        });
        this.homey.flow.getActionCard('set_vane_mode').registerRunListener(async (args, state) => {
            this.log("set_vane_mode triggered")
            await args.device.triggerCapabilityListener('vane_mode', args.vane_mode);
        });
        this.homey.flow.getActionCard('set_wide_vane_mode').registerRunListener(async (args, state) => {
            this.log("set_wide_vane_mode triggered")
            await args.device.triggerCapabilityListener('wide_vane', args.wide_vane);
        });

        this.log('ClimateControl Driver has been initialized');
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

module.exports = ClimateControlDriver;
