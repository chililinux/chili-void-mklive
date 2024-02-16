import { Repository } from '../../../../shared/lib/repository';
import { BffCachedRouteRepository } from '../../domain/repositories';
declare class BffCachedRouteStorageRepository implements BffCachedRouteRepository {
    readonly repository: Repository;
    static KEY: string;
    constructor(repository: Repository);
    save(endpoint: string, data: any, expiresIn: number): Promise<void>;
    get(endpoint: string): Promise<{
        data: any;
        expiresIn: number;
    }>;
    clean(): Promise<void>;
}
export default BffCachedRouteStorageRepository;
