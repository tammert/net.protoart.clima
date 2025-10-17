import ClimateControlDriver from '../../lib/basedriver';

module.exports = class MitsubishiElectricDriver extends ClimateControlDriver {
    async onInit() {
        await super.onInit();
    }

    async onPairListDevices() {
        return super.onPairListDevices();
    }
}
