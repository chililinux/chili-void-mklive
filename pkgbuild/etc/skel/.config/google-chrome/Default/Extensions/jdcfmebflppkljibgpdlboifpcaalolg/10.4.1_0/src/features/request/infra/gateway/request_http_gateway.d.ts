import { HttpClient } from '../../../../shared/lib/http';
import { AuthorizeClients, RequestGateway } from '../../domain';
import { Params } from '../../domain/gateways/request_gateway';
declare class RequestHTTPGateway implements RequestGateway {
    readonly httpClient: HttpClient;
    authorizedClients: AuthorizeClients[];
    constructor(httpClient: HttpClient);
    protected authorizeClient(): Promise<void>;
    protected refreshToken(): Promise<void>;
    get({ endpoint, queryParams, authorizedClients }: Params): Promise<any>;
    post({ endpoint, body, authorizedClients }: Params): Promise<any>;
}
export default RequestHTTPGateway;
