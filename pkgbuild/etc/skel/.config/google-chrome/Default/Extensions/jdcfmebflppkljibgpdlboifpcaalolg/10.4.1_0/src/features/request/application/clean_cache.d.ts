import { BffCachedRouteRepository } from '../domain';
declare class CleanCache {
    readonly bffCachedRoutesRepository: BffCachedRouteRepository;
    constructor(bffCachedRoutesRepository: BffCachedRouteRepository);
    execute(newValue: any, oldValue: any): Promise<void>;
}
export default CleanCache;
