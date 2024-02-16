export = Cookies;
declare class Cookies {
    constructor(partner: any);
    partner: any;
    list(): Promise<any>;
    add(name: any, value: any, { expiration }?: {
        expiration: any;
    }): Promise<any>;
    get(name: any): Promise<any>;
    remove(name: any, url?: string): Promise<any>;
    clear(): Promise<any>;
}
