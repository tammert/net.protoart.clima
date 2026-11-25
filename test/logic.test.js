// Tests for the pure logic that parses device JSON and filters pairing.
// Run with `npm test` (compiles TypeScript to .homeybuild first).
const { test } = require('node:test');
const assert = require('node:assert');
const { toBoolean, modelMatchesBrand } = require('../.homeybuild/lib/utils.js');
const ApiClient = require('../.homeybuild/lib/apiClient.js').default;

test('toBoolean accepts only the documented truthy values', () => {
    for (const truthy of [true, 'true', 'on', '1', 1]) {
        assert.strictEqual(toBoolean(truthy), true, `${JSON.stringify(truthy)} should be true`);
    }
    for (const falsy of [false, 'off', '0', 0, '', null, undefined]) {
        assert.strictEqual(toBoolean(falsy), false, `${JSON.stringify(falsy)} should be false`);
    }
});

test('modelMatchesBrand claims its own models and no other brand\'s', () => {
    // brand IDs as set in each drivers/*/driver.ts; model families per the ProtoART
    // knowledge base, incl. the HW_ prefix and version-suffixed variants seen in /json
    const models = {
        lg: ['LG_CNREMO_ATA_WIFI', 'HW_LG_CNREMO_ATA_WIFI'],
        me: ['ME_CN105_ATA_WIFI'],
        mhi: ['MHI_CNS_ATA_WIFI', 'MHI_ATA_WIFI'],
        mhi_xy: ['MHI_XY_ATA_WIFI', 'HW_MHI_XY_ATA_WIFI', 'MHI_XY_ATA_WIFI_V1_1'],
        pana: ['PANA_CNCNT_ATA_WIFI'],
    };
    for (const [brand, own] of Object.entries(models)) {
        for (const model of own) {
            assert.strictEqual(modelMatchesBrand(brand, model), true, `${brand} should claim ${model}`);
        }
        for (const [other, theirs] of Object.entries(models)) {
            if (other === brand) continue;
            for (const model of theirs) {
                assert.strictEqual(modelMatchesBrand(brand, model), false, `${brand} must not claim ${model}`);
            }
        }
    }
    assert.strictEqual(modelMatchesBrand('lg', ''), false);
});

test('modelMatchesBrand only claims air-to-air (ATA) boards', () => {
    assert.strictEqual(modelMatchesBrand('me', 'ME_CN105_ATW_WIFI'), false); // water board
    // XY is only special in the brand position, not anywhere in the model string
    assert.strictEqual(modelMatchesBrand('lg', 'LG_CNREMO_XY_ATA_WIFI'), true);
    // brands missing from the table fall back to a single-token prefix
    assert.strictEqual(modelMatchesBrand('futur', 'FUTUR_BOARD_ATA_WIFI'), true);
});

test('getTemperatureFromStatus keeps 0 C readings and falls back when no sensor', () => {
    const client = new ApiClient('127.0.0.1', 80, '/control', {});
    const status = (sensor, actual) => ({ sensor, heatpump: { actual_temperature: actual } });
    assert.strictEqual(client.getTemperatureFromStatus(status({ thermometer: { tact: 0 } }, 21)), 0);
    assert.strictEqual(client.getTemperatureFromStatus(status({ external: { temperature: 0 } }, 21)), 0);
    assert.strictEqual(client.getTemperatureFromStatus(status({ thermometer: { tact: 19.5 } }, 21)), 19.5);
    assert.strictEqual(client.getTemperatureFromStatus(status(undefined, 21)), 21);
});
