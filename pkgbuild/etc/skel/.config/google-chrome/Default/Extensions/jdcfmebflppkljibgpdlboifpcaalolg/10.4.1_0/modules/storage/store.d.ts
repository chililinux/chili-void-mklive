export function set(key: any, value: any, expirationTimestamp: any): Promise<any>;
export function get(key: any): Promise<any>;
export function remove(key: any): Promise<any>;
export function clearAll(): Promise<any>;
export function observe(key: any, callback: any): void;
export function removeExpiredKeys(): Promise<any>;
/**
* Returns the key which holds the expiration value for the specified
* item key.
*/
export function expirationKeyOf(itemKey: any): string;
