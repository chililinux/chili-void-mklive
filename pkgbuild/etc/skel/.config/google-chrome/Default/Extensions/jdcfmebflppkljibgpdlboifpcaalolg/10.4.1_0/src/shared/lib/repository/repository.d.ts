interface Repository {
    get<T>(key: string): Promise<T | any>;
    save(key: string, data: any, expiration?: number): Promise<void>;
    getAll<T>(): Promise<any | T>;
    remove(key: string): Promise<void>;
}
export default Repository;
