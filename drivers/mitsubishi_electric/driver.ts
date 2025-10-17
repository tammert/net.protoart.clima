import ClimateControlDriver from '../../lib/baseDriver';

module.exports = class MitsubishiElectricDriver extends ClimateControlDriver {
    async onInit() {
        await super.onInit();
    }

    async onPairListDevices() {
        return super.onPairListDevices();
    }
}
