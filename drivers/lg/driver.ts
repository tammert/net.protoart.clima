import ClimateControlDriver from '../../lib/baseDriver';

module.exports = class LGDriver extends ClimateControlDriver {
    async onInit() {
        this.brand = "lg"
        await super.onInit();
        this.log('LGDriver has been initialized');
    }
}
