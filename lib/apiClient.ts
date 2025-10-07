import fetch from 'node-fetch';

export interface HeatpumpStatus {
    heatmin: number;
    heatmax: number;
    coolmin: number;
    coolmax: number;
    power: 'on' | 'off';
    mode: 'heat' | 'cool' | 'auto' | 'fan' | 'dry';
    set_temperature: number;
    actual_temperature: number;
    tinp: string;
    oper: boolean;
    isee: boolean;
    optime: number;
    tout: number;
    pinp: number;
    fan: string;
    vane: string;
    widevane: string;
    tpcns: number;
}

export interface StatusResponse {
    heatpump: HeatpumpStatus;
}

class ApiClient {
    private readonly baseUrl: string;

    constructor(private readonly address: string, private readonly port: number) {
        this.baseUrl = `http://${address}:${port}`;
    }

    async getStatus(): Promise<any> {
      try {
        const response = await fetch(`${this.baseUrl}/control`);
        const data = await response.json() as StatusResponse;
        return data;
      } catch (error) {
        throw new Error(`Failed to get status: ${error}`);
      }
    }

    async setPower(powerOn: boolean): Promise<boolean> {
      try {
        const powerValue = powerOn ? 'on' : 'off';
        const response = await fetch(`${this.baseUrl}/control?cmd=heatpump&power=${powerValue}`, {
          method: 'GET',
        });

        // Check if the request was successful
        if (response.ok) {
          return true;
        }
        throw new Error(`HTTP error! status: ${response.status}`);

      } catch (error) {
        throw new Error(`Failed to set power: ${error}`);
      }
    }

    async setMode(mode: 'heat' | 'cool' | 'auto' | 'fan' | 'dry'): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/control?cmd=heatpump&mode=${mode}`, {
                method: 'GET',
            });

            if (response.ok) {
                return true;
            }
            throw new Error(`HTTP error! status: ${response.status}`);

        } catch (error) {
            throw new Error(`Failed to set mode: ${error}`);
        }
    }

    async setTemperature(temperature: number): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/control?cmd=heatpump&set_temperature=${temperature}`, {
                method: 'GET',
            });

            if (response.ok) {
                return true;
            }
            throw new Error(`HTTP error! status: ${response.status}`);

        } catch (error) {
            throw new Error(`Failed to set temperature: ${error}`);
        }
    }
}

export default ApiClient;
