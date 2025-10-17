import fetch from 'node-fetch';

// Generic
export type PowerEnum = 'on' | 'off';

// Mitsubishi Electric
export type MitsubishiElectricOperatingModeEnum = 'auto' | 'cool' | 'dry' | 'heat' | 'fan'
export type MitsubishiElectricFanSpeedEnum = 'auto' | 'silent' | 'low' | 'med' | 'high' | 'superhigh'
export type MitsubishiElectricVaneModeEnum = 'auto' | 'swing' | '1' | '2' | '3' | '4' | '5'
export type MitsubishiElectricWideVaneModeEnum = 'auto' | 'swing' | 'maxleft' | 'left' | 'middle' | 'right' | 'maxright'

// Mitsubishi Heavy Industries
export type MitsubishiHeavyIndustriesOperatingModeEnum = 'auto' | 'cool' | 'dry' | 'heat' | 'fan'
export type MitsubishiHeavyIndustriesFanSpeedEnum = 'auto' | '1' | '2' | '3' | '4'
export type MitsubishiHeavyIndustriesVaneModeEnum = 'swing' | '1' | '2' | '3' | '4'
export type MitsubishiHeavyIndustriesWideVaneModeEnum = 'swing' | '1' | '2' | '3' | '4' | '5' | '6' | '7'

export interface MitsubishiElectricHeatpump {
    heatmin: number;
    heatmax: number;
    coolmin: number;
    coolmax: number;
    power: PowerEnum;
    mode: MitsubishiElectricOperatingModeEnum;
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
    fan: MitsubishiElectricFanSpeedEnum;
    vane: MitsubishiElectricVaneModeEnum;
    widevane: MitsubishiElectricWideVaneModeEnum;
    tpcns: number; // total power consumption
    actual_temperature: number;
}

export interface MitsubishiHeavyIndustriesHeatpump {
    heatmin: number;
    heatmax: number;
    coolmin: number;
    coolmax: number;
    set_temperature: number;
    tinp: string; // temperature input
    power: PowerEnum;
    mode: MitsubishiHeavyIndustriesOperatingModeEnum;
    fan: MitsubishiHeavyIndustriesFanSpeedEnum;
    vane: MitsubishiHeavyIndustriesVaneModeEnum;
    vanelr: MitsubishiHeavyIndustriesWideVaneModeEnum;
    auto3d: boolean; // 3D auto
    peak_cut: number;
    silent_mode: boolean;
    op: {
        iu_capacity: number;
        ou_eev1: number;
        td: number;
        defrost: boolean; // defrost active
        ou_fan: number;
        protection: string;
        tdsh: number;
        compr_run_time: number;
        iu_run_time: number;
        iu_fan: number;
        set_temperature: number;
        mode: number;
        consumption: number; // power use in kW?
        return_air: number;
        current: number;
        outdoor: number; // outdoor temperature
        thi_r1: number;
        thi_r3: number;
        thi_r2: number;
        compr_freq: number;
        tho_r1: number;
    };
    oper: boolean; // operation
    error_code: number;
    actual_temperature: number;
}

export interface Sensor {
    thermometer: {
        mac: string,
        name: string,
        batt: number, // battery percentage
        hact: number, // humidity actual
        rssi: number, // signal strength
        tact: number, // temperature actual
        last: number // last seen seconds ago
    };
}

export interface MitsubishiElectricStatus {
    heatpump: MitsubishiElectricHeatpump;
    sensor: Sensor;
}

export interface MitsubishiHeavyIndustriesStatus {
    heatpump: MitsubishiHeavyIndustriesHeatpump;
    sensor: Sensor;
}

export interface ApiEndpoints {
    power: string;
    fan_speed: string;
    set_temperature: string;
    operating_mode: string;
    vane_mode: string;
    wide_vane_mode: string;
}

class ApiClient {
    private readonly apiUrl: string;
    private readonly apiEndpoints: ApiEndpoints;

    constructor(private readonly address: string, private readonly port: number, private readonly path: string, private readonly endpoints: ApiEndpoints) {
        this.apiUrl = `http://${address}:${port}${path}`;
        this.apiEndpoints = endpoints;
    }

    async getMitsubishiElectricStatus(): Promise<any> {
        try {
            const response = await fetch(`${this.apiUrl}`);
            const data = await response.json() as MitsubishiElectricStatus;
            return data;
        } catch (error) {
            throw new Error(`Failed to get status: ${error}`);
        }
    }

    async setPower(powerOn: boolean): Promise<boolean> {
        try {
            const powerValue = powerOn ? 'on' : 'off';
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&${this.apiEndpoints.power}=${powerValue}`, {
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

    async setOperatingMode(mode: any): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&${this.apiEndpoints.operating_mode}=${mode}`, {
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
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&${this.apiEndpoints.set_temperature}=${temperature}`, {
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

    async setFanSpeed(fan_speed: any): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&${this.apiEndpoints.fan_speed}=${fan_speed}`, {
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

    async setVaneMode(vane_mode: any): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&${this.apiEndpoints.vane_mode}=${vane_mode}`, {
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

    async setWideVaneMode(wide_vane_mode: any): Promise<boolean> {
        try {
            const response = await fetch(`${this.apiUrl}?cmd=heatpump&${this.apiEndpoints.wide_vane_mode}=${wide_vane_mode}`, {
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
