
/**
 * Converts the given input into a boolean value based on specific criteria.
 * The method returns `true` if the input explicitly matches any of the following:
 * - `true` (boolean)
 * - `'true'` (string)
 * - `'on'` (string)
 * - `'1'` (string)
 * - `1` (number)
 * For any other input, the method returns `false`.
 *
 * @param {unknown} value The value to be converted to a boolean.
 * @return {boolean} The boolean representation of the input value.
 */
export function toBoolean(value: unknown): boolean {
    return value === true ||
        value === 'true' ||
        value === 'on' ||
        value === '1' ||
        value === 1;
}

export function boolToOnOff(value: boolean): string {
    return value ? "on" : "off";
}

// A driver claims a discovered model like `HW_MHI_XY_ATA_WIFI` by its word prefix;
// MHI must exclude MHI_XY models - they belong to their own driver. Air-to-air (ATA) only.
const MODEL_CLAIMS: { [brand: string]: { prefix: string; not?: string[] } } = {
    lg:     { prefix: 'LG_' },
    me:     { prefix: 'ME_' },
    mhi:    { prefix: 'MHI_', not: ['MHI_XY_'] },
    mhi_xy: { prefix: 'MHI_XY_' },
    pana:   { prefix: 'PANA_' },
};

export function modelMatchesBrand(brand: string, model: string): boolean {
    const claim = MODEL_CLAIMS[brand] ?? { prefix: brand.toUpperCase() + '_' };
    const id = model.replace(/^HW_/, '');
    return id.startsWith(claim.prefix)
        && !(claim.not ?? []).some(p => id.startsWith(p))
        && id.split('_').includes('ATA');
}
