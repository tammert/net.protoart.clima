import Homey from 'homey';

class ClimaControlDriver extends Homey.Driver {
    async onInit() {
        this.log('ClimaControl Driver has been initialized');
    }

    async onPairListDevices() {
        const discoveryStrategy = this.getDiscoveryStrategy();
        const discoveryResults = discoveryStrategy.getDiscoveryResults();

        const devices = Object.values(discoveryResults).map((discoveryResult: any) => {
            return {
                name: discoveryResult.host,
                data: {
                    id: discoveryResult.id,
                },
                store: {
                    address: discoveryResult.address,
                    port: discoveryResult.port,
                }
            };
        });

        this.log("Returning devices:", devices.length);
        return devices;
    }
}

module.exports = ClimaControlDriver;
