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
        const operatingModeChangedTrigger = this.getTriggerCardSafe(`${operatingModeCapabilityName}_changed`)
        if (operatingModeChangedTrigger) {
            operatingModeChangedTrigger.registerRunListener(async (args, state) => {
                return args[operatingModeCapabilityName] === args.device.getCapabilityValue(operatingModeCapabilityName);
            });
        }

        const fanSpeedChangedTrigger = this.getTriggerCardSafe(`${fanSpeedCapabilityName}_changed`)
        if (fanSpeedChangedTrigger) {
            fanSpeedChangedTrigger.registerRunListener(async (args, state) => {
                return args[fanSpeedCapabilityName] === args.device.getCapabilityValue(fanSpeedCapabilityName);
            });
        }

        const vaneModeChangedTrigger = this.getTriggerCardSafe(`${vaneModeCapabilityName}_changed`)
        if (vaneModeChangedTrigger) {
            vaneModeChangedTrigger.registerRunListener(async (args, state) => {
                return args[vaneModeCapabilityName] === args.device.getCapabilityValue(vaneModeCapabilityName);
            });
        }

        const wideVaneModeChangedTrigger = this.getTriggerCardSafe(`${wideVaneModeCapabilityName}_changed`)
        if (wideVaneModeChangedTrigger) {
            wideVaneModeChangedTrigger.registerRunListener(async (args, state) => {
                return args[wideVaneModeCapabilityName] === args.device.getCapabilityValue(wideVaneModeCapabilityName);
            });
        }

        const defrostTrueTrigger = this.getTriggerCardSafe(`${defrostCapabilityName}_true`)
        if (defrostTrueTrigger) {
            defrostTrueTrigger.registerRunListener(async (args, state) => {
                return args.device.getCapabilityValue(defrostCapabilityName);
            });
        }

        const defrostFalseTrigger = this.getTriggerCardSafe(`${defrostCapabilityName}_false`)
        if (defrostFalseTrigger) {
            defrostFalseTrigger.registerRunListener(async (args, state) => {
                return !args.device.getCapabilityValue(defrostCapabilityName);
            });
        }

        // Condition ("And...") flow card listeners
        const operatingModeIsCondition = this.getConditionCardSafe(`${operatingModeCapabilityName}_is`)
        if (operatingModeIsCondition) {
            operatingModeIsCondition.registerRunListener(async (args, state) => {
                return args[operatingModeCapabilityName] === args.device.getCapabilityValue(operatingModeCapabilityName);
            });
        }

        const fanSpeedIsCondition = this.getConditionCardSafe(`${fanSpeedCapabilityName}_is`)
        if (fanSpeedIsCondition) {
            fanSpeedIsCondition.registerRunListener(async (args, state) => {
                return args[fanSpeedCapabilityName] === args.device.getCapabilityValue(fanSpeedCapabilityName);
            });
        }

        const vaneModeIsCondition = this.getConditionCardSafe(`${vaneModeCapabilityName}_is`)
        if (vaneModeIsCondition) {
            vaneModeIsCondition.registerRunListener(async (args, state) => {
                return args[vaneModeCapabilityName] === args.device.getCapabilityValue(vaneModeCapabilityName);
            });
        }

        const wideVaneModeIsCondition = this.getConditionCardSafe(`${wideVaneModeCapabilityName}_is`)
        if (wideVaneModeIsCondition) {
            wideVaneModeIsCondition.registerRunListener(async (args, state) => {
                return args[wideVaneModeCapabilityName] === args.device.getCapabilityValue(wideVaneModeCapabilityName);
            });
        }

        const defrostIsCondition = this.getConditionCardSafe(`${defrostCapabilityName}_is`)
        if (defrostIsCondition) {
            defrostIsCondition.registerRunListener(async (args, state) => {
                return args.device.getCapabilityValue(defrostCapabilityName);
            });
        }

        // Action ("Then...") flow card listeners
        const operatingModeSetAction = this.getActionCardSafe(`${operatingModeCapabilityName}_set`)
        if (operatingModeSetAction) {
            operatingModeSetAction.registerRunListener(async (args, state) => {
                await args.device.triggerCapabilityListener(operatingModeCapabilityName, args[operatingModeCapabilityName]);
            });
        }

        const fanSpeedSetAction = this.getActionCardSafe(`${fanSpeedCapabilityName}_set`)
        if (fanSpeedSetAction) {
            fanSpeedSetAction.registerRunListener(async (args, state) => {
                await args.device.triggerCapabilityListener(fanSpeedCapabilityName, args[fanSpeedCapabilityName]);
            });
        }

        const vaneModeSetAction = this.getActionCardSafe(`${vaneModeCapabilityName}_set`)
        if (vaneModeSetAction) {
            vaneModeSetAction.registerRunListener(async (args, state) => {
                await args.device.triggerCapabilityListener(vaneModeCapabilityName, args[vaneModeCapabilityName]);
            });
        }

        const wideVaneModeSetAction = this.getActionCardSafe(`${wideVaneModeCapabilityName}_set`)
        if (wideVaneModeSetAction) {
            wideVaneModeSetAction.registerRunListener(async (args, state) => {
                await args.device.triggerCapabilityListener(wideVaneModeCapabilityName, args[wideVaneModeCapabilityName]);
            });
        }

        const remoteTemperatureSetAction = this.getActionCardSafe(`${this.brand}_remote_temperature_set`)
        if (remoteTemperatureSetAction) {
            remoteTemperatureSetAction.registerRunListener(async (args, state) => {
                await args.device.apiClient.setRemoteTemperature(args['remote_temperature']);
            });
        }

        const restartAction = this.getActionCardSafe(`${this.brand}_restart`)
        if (restartAction) {
            restartAction.registerRunListener(async (args, state) => {
                await args.device.apiClient.restart();
            });
        }
    }

    private getTriggerCardSafe(id: string) {
        try {
            return this.homey.flow.getTriggerCard(id);
        } catch (e) {
            return null;
        }
    }

    private getConditionCardSafe(id: string) {
        try {
            return this.homey.flow.getConditionCard(id);
        } catch (e) {
            return null;
        }
    }

    private getActionCardSafe(id: string) {
        try {
            return this.homey.flow.getActionCard(id);
        } catch (e) {
            return null;
        }
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

        // return only air-to-air devices matching the brand
        const brandPrefix = this.brand.toUpperCase();
        const primaryPattern = new RegExp(`^${brandPrefix}_ATA_.*`);
        const fallbackPattern = new RegExp(`^${brandPrefix}_[^_]+_ATA_.*`);

        return devices.filter(device => {
            const model = device.data.model;

            if (!model) {
                return false;
            }

            const matchesPrimaryPattern = primaryPattern.test(model);
            const matchesFallbackPattern = fallbackPattern.test(model);

            return matchesPrimaryPattern || matchesFallbackPattern;
        });
    }
}

export default ClimateControlDriver;
