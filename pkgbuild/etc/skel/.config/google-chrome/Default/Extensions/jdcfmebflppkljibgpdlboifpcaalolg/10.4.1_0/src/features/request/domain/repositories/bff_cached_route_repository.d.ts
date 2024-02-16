interface BffCachedRouteRepository {
    save(endpoint: string, data: any, expireIn: number): Promise<void>;
    get(endpoint: string): Promise<{
        data: any;
        expiresIn: number;
    }>;
    clean(): Promise<void>;
}
export default BffCachedRouteRepository;
