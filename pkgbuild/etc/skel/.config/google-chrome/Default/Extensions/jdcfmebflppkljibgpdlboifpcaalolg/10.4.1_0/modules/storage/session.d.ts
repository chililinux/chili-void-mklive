export function get(key: any): Promise<any>;
/**
 * Sets data in the session storage with a specified key.
 *
 * @param {string} key - The key to store the data under.
 * @param {object} data - The data to be stored in the session storage.
 * @param {number} [expiration] - The expiration time in minutes for the data (optional).
 * @returns {Promise<object>} - The stored data object with the expiration time.
 *
 * @example
 * const data = { customerId: '123', name: 'E{json}' };
 * const expiration = 60; // Expiration time in minutes
 *
 * const result = await set('user_data', data, expiration);
 * console.log(result); // { customerId: '123', name: 'E{json}', expiration: '1669352740000' }
 *
 * @throws {Error} If an error occurs while storing the data.
 */
export function set(key: string, data: object, expiration?: number | undefined): Promise<object>;
export function remove(key: any): any;
export function clear(): any;
