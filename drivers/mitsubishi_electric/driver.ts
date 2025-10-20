import ClimateControlDriver from '../../lib/baseDriver';

module.exports = class MitsubishiElectricDriver extends ClimateControlDriver {
    async onInit() {
        this.brand = "me"
        await super.onInit();
        this.log('MitsubishiElectricDriver has been initialized');
    }

    async onPairListDevices() {
        return super.onPairListDevices();
    }
}
