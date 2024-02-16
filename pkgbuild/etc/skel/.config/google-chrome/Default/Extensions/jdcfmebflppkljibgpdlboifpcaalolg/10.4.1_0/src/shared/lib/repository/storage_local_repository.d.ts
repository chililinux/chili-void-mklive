import Repository from './repository';
declare class StorageLocalRepository implements Repository {
    readonly browser: any;
    constructor(browser: any);
    keyOfExpiration(key: string): string;
    get(key: string): Promise<any>;
    save(key: string, data: any, expiration?: number): Promise<void>;
    remove(key: string): Promise<void>;
    getAll(): Promise<any[]>;
}
export default StorageLocalRepository;
