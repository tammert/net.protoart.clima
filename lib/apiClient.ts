import fetch from 'node-fetch';

export type ModeEnum = 'auto' | 'cool' | 'dry' | 'heat' | 'fan'
export type FanSpeedEnum = 'auto' | 'silent' | 'low' | 'med' | 'high' | 'superhigh'
export type VaneEnum = 'auto' | 'swing' | '1' | '2' | '3' | '4' | '5'
export type WideVaneEnum = 'auto' | 'swing' | 'maxleft' | 'left' | 'middle' | 'right' | 'maxright'

export interface HeatpumpStatus {
    heatmin: number;
    heatmax: number;
    coolmin: number;
    coolmax: number;
    power: 'on' | 'off';
    mode: ModeEnum;
    set_temperature: number;
    actual_temperature: number;
    tinp: string; // temperature input
    oper: boolean; // operation
    isee: boolean; // 3D i-see sensor
    optime: number; // operation time
    tout: number; // temperature outside
    pinp: number; // power input
    fan: FanSpeedEnum;
    vane: VaneEnum;
    widevane: WideVaneEnum;
    tpcns: number; // total power consumption
}

export interface Thermometer {
    "mac": string,
    "name": string,
    "batt": number, // battery percentage
    "hact": number, // humidity actual
    "rssi": number, // signal strength
    "tact": number, // temperature actual
    "last": number // last seen seconds ago
}

export interface Sensor {
    thermometer: Thermometer;
}

export interface StatusResponse {
    heatpump: HeatpumpStatus;
    sensor: Sensor;
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

    async setMode(mode: ModeEnum): Promise<boolean> {
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

    async setFanSpeed(fan_speed: FanSpeedEnum): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/control?cmd=heatpump&fan=${fan_speed}`, {
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

    async setSwingMode(swing_mode: VaneEnum): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/control?cmd=heatpump&vane=${swing_mode}`, {
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

    async setWideVane(wide_vane: WideVaneEnum): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/control?cmd=heatpump&widevane=${wide_vane}`, {
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
