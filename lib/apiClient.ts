import fetch from 'node-fetch';

export type OperatingModeEnum = 'auto' | 'cool' | 'dry' | 'heat' | 'fan'
export type FanSpeedEnum = 'auto' | 'silent' | 'low' | 'med' | 'high' | 'superhigh'
export type VaneModeEnum = 'auto' | 'swing' | '1' | '2' | '3' | '4' | '5'
export type WideVaneModeEnum = 'auto' | 'swing' | 'maxleft' | 'left' | 'middle' | 'right' | 'maxright'

export interface HeatpumpStatus {
    heatmin: number;
    heatmax: number;
    coolmin: number;
    coolmax: number;
    power: 'on' | 'off';
    mode: OperatingModeEnum;
    set_temperature: number;
    tinp: string; // temperature input
    oper: boolean; // operation
    isee: boolean; // 3D i-see sensor
    optime: number; // operation time
    filter: boolean, // filter need replacement
    defrost: boolean, // defrost active
    hotadjust: boolean, // hot adjust (preheat)
    standby: boolean, // standby
    tout: number; // temperature outside
    pinp: number; // power input
    fault_code: string;
    fan: FanSpeedEnum;
    vane: VaneModeEnum;
    widevane: WideVaneModeEnum;
    tpcns: number; // total power consumption
    actual_temperature: number;
}

export interface Thermometer {
    mac: string,
    name: string,
    batt: number, // battery percentage
    hact: number, // humidity actual
    rssi: number, // signal strength
    tact: number, // temperature actual
    last: number // last seen seconds ago
}

export interface Sensor {
    thermometer: Thermometer;
}

export interface StatusResponse {
    heatpump: HeatpumpStatus;
    sensor: Sensor;
}

class ApiClient {
    private readonly apiUrl: string;

    constructor(private readonly address: string, private readonly port: number, private readonly path: string) {
        this.apiUrl = `http://${address}:${port}${path}`;
    }

    async getStatus(): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}`);
            const data = await response.json() as StatusResponse;
            return data;
        } catch (error) {
            throw new Error(`Failed to get status: ${error}`);
        }
    }

    async setPower(powerOn: boolean): Promise<boolean> {
        try {
            const powerValue = powerOn ? 'on' : 'off';
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&power=${powerValue}`, {
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

    async setOperatingMode(mode: OperatingModeEnum): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&mode=${mode}`, {
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
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&set_temperature=${temperature}`, {
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

    async setFanSpeed(fan_speed: FanSpeedEnum): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&fan=${fan_speed}`, {
                method: 'GET',
            });

            if (response.ok) {
                return true;
            }
            throw new Error(`HTTP error! status: ${response.status}`);

        } catch (error) {
            throw new Error(`Failed to set fan mode: ${error}`);
        }
    }

    async setVaneMode(vane_mode: VaneModeEnum): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&vane=${vane_mode}`, {
                method: 'GET',
            });

            if (response.ok) {
                return true;
            }
            throw new Error(`HTTP error! status: ${response.status}`);

        } catch (error) {
            throw new Error(`Failed to set swing mode: ${error}`);
        }
    }

    async setWideVaneMode(wide_vane_mode: WideVaneModeEnum): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&widevane=${wide_vane_mode}`, {
                method: 'GET',
            });

            if (response.ok) {
                return true;
            }
            throw new Error(`HTTP error! status: ${response.status}`);

        } catch (error) {
            throw new Error(`Failed to set swing mode: ${error}`);
        }
    }
}

export default ApiClient;
