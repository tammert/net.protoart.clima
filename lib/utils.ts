
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
