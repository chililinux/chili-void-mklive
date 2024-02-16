import RequestGateway, { Params } from '../domain/gateways/request_gateway';
import { BffCachedRouteRepository } from '../domain';
declare class BffExtensionRequest {
    readonly gateway: RequestGateway;
    readonly repository: BffCachedRouteRepository;
    constructor(gateway: RequestGateway, repository: BffCachedRouteRepository);
    execute(params: Params): Promise<any>;
}
export default BffExtensionRequest;
