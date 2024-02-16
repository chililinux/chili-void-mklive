import Repository from './repository';
declare class CookiesRepository implements Repository {
    readonly browser: any;
    readonly domain: string;
    readonly url: string;
    constructor(browser: any, domain: string);
    get(key: string): Promise<any>;
    save(key: string, data: any, expirationDate?: number): Promise<void>;
    remove(key: string): Promise<void>;
    getAll(): Promise<any>;
}
export default CookiesRepository;
