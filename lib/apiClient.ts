import fetch from 'node-fetch';
import {boolToOnOff} from "./utils";

// Generic
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
    external: {
        temperature: number,
        humidity: number,
    }
}

// LG
export type LGOperatingModeEnum = 'auto' | 'cool' | 'dry' | 'heat' | 'fan'
export type LGFanSpeedEnum = 'auto' | 'slow' | 'low' | 'med' | 'high'
export type LGVaneModeEnum = 'default' | '1' | '2' | '3' | '4' | '5' | '6'

export interface LGHeatPump {
    heatmin: number;
    heatmax: number;
    coolmin: number;
    coolmax: number;
    power: boolean;
    mode: LGOperatingModeEnum;
    set_temperature: number;
    tinp: string; // temperature input
    oper: boolean; // operation
    fan: LGFanSpeedEnum;
    vane1: LGVaneModeEnum; // vertical swing, horizontal vane
    vane2: string;
    vane3: string;
    dred: number; // days run?
    opdata: {
        modelou: number; // model outdoor unit
        modeliu: number; // model indoor unit
        capacity: number;
        Tpipein: number; // temperature pipe in
        Tpipeout: number; // temperature pipe out
        Tpipemid: number; // temperature pipe middle
        oilchgw: boolean; // oil change warning
        defrost: boolean;
        preheat: boolean;
        error_code: number;
        iufanhrsrun: number; // indoor unit fan hours run
        iuhrsrun: number; // indoor unit hours run
    },
    autodry: boolean;
    energy_saving: boolean;
    hswing: boolean; // horizontal swing
    vswing: boolean; // vertical swing
    purifier: boolean;
    humidifier: boolean;
    swirl: boolean;
    actual_temperature: number;
}

export interface LGStatus {
    heatpump: LGHeatPump;
    sensor: Sensor;
}

// Mitsubishi Electric
export type MitsubishiElectricOperatingModeEnum = 'auto' | 'cool' | 'dry' | 'heat' | 'fan'
export type MitsubishiElectricFanSpeedEnum = 'auto' | 'silent' | 'low' | 'med' | 'high' | 'superhigh'
export type MitsubishiElectricVaneModeEnum = 'auto' | 'swing' | '1' | '2' | '3' | '4' | '5'
export type MitsubishiElectricWideVaneModeEnum = 'auto' | 'swing' | 'maxleft' | 'left' | 'middle' | 'right' | 'maxright'

export interface MitsubishiElectricHeatPump {
    heatmin: number;
    heatmax: number;
    coolmin: number;
    coolmax: number;
    power: boolean;
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

export interface MitsubishiElectricStatus {
    heatpump: MitsubishiElectricHeatPump;
    sensor: Sensor;
}

// Mitsubishi Heavy Industries
export type MitsubishiHeavyIndustriesOperatingModeEnum = 'auto' | 'cool' | 'dry' | 'heat' | 'fan'
export type MitsubishiHeavyIndustriesFanSpeedEnum = 'auto' | '1' | '2' | '3' | '4'
export type MitsubishiHeavyIndustriesVaneModeEnum = 'swing' | '1' | '2' | '3' | '4'
export type MitsubishiHeavyIndustriesWideVaneModeEnum = 'swing' | '1' | '2' | '3' | '4' | '5' | '6' | '7'

export interface MitsubishiHeavyIndustriesHeatPump {
    heatmin: number;
    heatmax: number;
    coolmin: number;
    coolmax: number;
    set_temperature: number;
    tinp: string; // temperature input
    power: boolean;
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
        ou_fan: number; // outdoor fan speed
        protection: string;
        tdsh: number;
        compr_run_time: number;
        iu_run_time: number;
        iu_fan: number;
        set_temperature: number;
        mode: number;
        consumption: number; // kWh since... something
        return_air: number;
        current: number; // current in Amps?
        outdoor: number; // outdoor temperature
        thi_r1: number; // Temperature Heat exchanger Indoor 1
        thi_r3: number; // Temperature Heat exchanger Indoor 2
        thi_r2: number; // Temperature Heat exchanger Indoor 3
        compr_freq: number; // Compressor Frequency
        tho_r1: number; // Temperature Heat exchanger Outdoor 1
    };
    oper: boolean; // operation
    error_code: number;
    actual_temperature: number;
}

export interface MitsubishiHeavyIndustriesStatus {
    heatpump: MitsubishiHeavyIndustriesHeatPump;
    sensor: Sensor;
}

// Panasonic
export type PanasonicOperatingModeEnum = 'auto' | 'cool' | 'dry' | 'heat' | 'fan'
export type PanasonicFanSpeedEnum = 'auto' | 'silent' | 'low' | 'med' | 'high' | 'superhigh'
export type PanasonicVaneModeEnum = 'auto' | 'swing' | '1' | '2' | '3' | '4' | '5'
export type PanasonicWideVaneModeEnum = 'auto' | 'swing' | 'maxleft' | 'left' | 'middle' | 'right' | 'maxright'
export type PanasonicPresetEnum = 'normal' | 'powerful' | 'quiet'

export interface PanasonicHeatPump {
    heatmin: number;
    heatmax: number;
    coolmin: number;
    coolmax: number;
    power: boolean;
    mode: PanasonicOperatingModeEnum;
    set_temperature: number;
    tinp: string; // temperature input
    op: {
        tout: number; // temperature outside
        pinp: number; // power input
        defrost: boolean; // defrost active
    };
    fan: PanasonicFanSpeedEnum;
    vane: PanasonicVaneModeEnum;
    widevane: PanasonicWideVaneModeEnum;
    milddry: boolean;
    nanoex: boolean;
    eco: boolean;
    econavi: boolean;
    preset: PanasonicPresetEnum;
    actual_temperature: number;
}

export interface PanasonicStatus {
    heatpump: PanasonicHeatPump;
    sensor: Sensor;
}

export interface ApiEndpoints {
    power: string;
    fan_speed: string;
    set_temperature: string;
    operating_mode: string;
    vane_mode: string;
    wide_vane_mode?: string;
    remote_temperature: string;
    silent_mode?: string;
    autodry?: string;
    purifier?: string;
    energy_saving?: string;
    hswing?: string;
    vswing?: string;
    milddry?: string;
    nanoex?: string;
    eco?: string;
    econavi?: string;
    preset?: string;
}

class ApiClient {
    private readonly apiUrl: string;
    private readonly apiEndpoints: ApiEndpoints;

    constructor(private readonly address: string, private readonly port: number, private readonly path: string, private readonly endpoints: ApiEndpoints) {
        this.apiUrl = `http://${this.address}:${this.port || 80}${this.path || '/control'}`;
        this.apiEndpoints = this.endpoints;
    }

    async getStatus<T>(): Promise<T> {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json() as T;
        } catch (error) {
            throw new Error(`Failed to get status: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private async setHeatpumpParam(endpointKey: keyof ApiEndpoints, value: string | number | boolean): Promise<boolean> {
        const endpoint = this.apiEndpoints[endpointKey];
        if (!endpoint) {
            throw new Error(`Endpoint for ${endpointKey} not defined for this brand`);
        }

        const valStr = typeof value === 'boolean' ? boolToOnOff(value) : value.toString();

        try {
            const url = new URL(this.apiUrl);
            url.searchParams.append('cmd', 'heatpump');
            url.searchParams.append(endpoint, valStr);

            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return true;
        } catch (error) {
            throw new Error(`Failed to set ${endpointKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async setPower(powerOn: boolean): Promise<boolean> {
        return this.setHeatpumpParam('power', powerOn);
    }

    async setOperatingMode(mode: any): Promise<boolean> {
        return this.setHeatpumpParam('operating_mode', mode);
    }

    async setTemperature(temperature: number): Promise<boolean> {
        return this.setHeatpumpParam('set_temperature', temperature);
    }

    async setFanSpeed(fan_speed: any): Promise<boolean> {
        return this.setHeatpumpParam('fan_speed', fan_speed);
    }

    async setVaneMode(vane_mode: any): Promise<boolean> {
        return this.setHeatpumpParam('vane_mode', vane_mode);
    }

    async setWideVaneMode(wide_vane_mode: any): Promise<boolean> {
        return this.setHeatpumpParam('wide_vane_mode', wide_vane_mode);
    }

    async setRemoteTemperature(temperature: number): Promise<boolean> {
        return this.setHeatpumpParam('remote_temperature', temperature);
    }

    async setSilentMode(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('silent_mode', enabled);
    }

    async setAutodry(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('autodry', enabled);
    }

    async setPurifier(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('purifier', enabled);
    }

    async setEnergySaving(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('energy_saving', enabled);
    }

    async setHSwing(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('hswing', enabled);
    }

    async setVSwing(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('vswing', enabled);
    }

    async setMildDry(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('milddry', enabled);
    }

    async setNanoEx(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('nanoex', enabled);
    }

    async setEco(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('eco', enabled);
    }

    async setEcoNavi(enabled: boolean): Promise<boolean> {
        return this.setHeatpumpParam('econavi', enabled);
    }

    async setPreset(preset: PanasonicPresetEnum): Promise<boolean> {
        return this.setHeatpumpParam('preset', preset);
    }

    getTemperatureFromStatus(status: any): number {
        if (status.sensor && status.sensor.thermometer && status.sensor.thermometer.tact) {
            return status.sensor.thermometer.tact
        }
        if (status.sensor && status.sensor.external && status.sensor.external.temperature) {
            return status.sensor.external.temperature
        }
        return status.heatpump.actual_temperature;
    }
}

export default ApiClient;
