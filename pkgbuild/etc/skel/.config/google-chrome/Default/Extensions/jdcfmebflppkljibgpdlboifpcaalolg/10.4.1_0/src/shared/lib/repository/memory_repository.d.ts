import Repository from './repository';
declare class MemoryRepository implements Repository {
    readonly repository: string;
    protected static Repository: any;
    constructor(repository: string, initialData: any);
    get(key: string): Promise<any>;
    save(key: string, data: any): Promise<void>;
    remove(key: string): Promise<void>;
    getAll(): Promise<any[]>;
}
export default MemoryRepository;
