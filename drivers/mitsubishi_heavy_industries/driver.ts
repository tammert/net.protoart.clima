import ClimateControlDriver from '../../lib/baseDriver';

module.exports = class MitsubishiHeavyIndustriesDriver extends ClimateControlDriver {
    async onInit() {
        this.brand = "mhi"
        await super.onInit();
        this.log('MitsubishiHeavyIndustriesDriver has been initialized');
    }

    async onPairListDevices() {
        return super.onPairListDevices();
    }
}
