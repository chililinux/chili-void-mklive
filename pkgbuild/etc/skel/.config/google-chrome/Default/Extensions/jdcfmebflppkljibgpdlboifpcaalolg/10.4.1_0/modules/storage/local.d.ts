export function get(key: any): Promise<any>;
export function set(key: any, value: any, { expiration }?: {
    expiration: any;
}): Promise<any>;
export function remove(key: any): Promise<any>;
export function clear(): Promise<any>;
export function observe(key: string | undefined, callback: any): void;
export function unobserve(id?: string): any;
