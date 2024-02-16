export function get(flagName: any): Promise<boolean | null>;
export function fetchFlags(): Promise<boolean>;
export function filter(flags: any, flagName: any): boolean | null;
export function getFlags(): Promise<any>;
export function setFlags(flags: any): Promise<void>;
