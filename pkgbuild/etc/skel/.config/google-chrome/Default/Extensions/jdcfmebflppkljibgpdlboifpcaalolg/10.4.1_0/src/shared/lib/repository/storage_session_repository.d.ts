import Repository from './repository';
declare class StorageSessionRepository implements Repository {
    readonly browser: any;
    constructor(browser: any);
    get(key: string): Promise<any>;
    save(key: string, data: any): Promise<void>;
    remove(key: string): Promise<void>;
    getAll(): Promise<any[]>;
}
export default StorageSessionRepository;
