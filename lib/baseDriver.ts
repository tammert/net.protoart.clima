import Homey from 'homey';

class ClimateControlDriver extends Homey.Driver {
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

export default ClimateControlDriver;
