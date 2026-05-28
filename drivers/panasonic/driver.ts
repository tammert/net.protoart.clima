import ClimateControlDriver from '../../lib/baseDriver';

module.exports = class PanasonicDriver extends ClimateControlDriver {
    async onInit() {
        this.brand = "pana"
        await super.onInit();
        this.log('PanasonicDriver has been initialized');
    }
}
