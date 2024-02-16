import Repository from './repository';
declare class StorageRepository implements Repository {
    readonly browser: any;
    KEY: string;
    constructor(browser: any, key: string);
    get(key: string): Promise<any>;
    save(key: string, data: any): Promise<void>;
    remove(key: string): Promise<void>;
    getAll(): Promise<any[]>;
}
export default StorageRepository;
