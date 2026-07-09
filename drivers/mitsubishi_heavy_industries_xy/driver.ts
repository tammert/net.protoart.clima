import ClimateControlDriver from '../../lib/baseDriver';

module.exports = class MitsubishiHeavyIndustriesXyDriver extends ClimateControlDriver {
    async onInit() {
        this.brand = "mhi_xy"
        await super.onInit();
        this.log('MitsubishiHeavyIndustriesXyDriver has been initialized');
    }
}
