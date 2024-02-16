interface StaticFileRepository {
    get: (key: string) => Promise<any>;
    save: (key: string, data: any, expiration?: number) => Promise<void>;
}
export default StaticFileRepository;
