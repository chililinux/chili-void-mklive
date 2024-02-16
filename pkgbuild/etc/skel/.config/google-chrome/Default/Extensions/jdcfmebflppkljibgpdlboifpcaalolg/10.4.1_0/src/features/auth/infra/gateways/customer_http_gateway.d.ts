import { HttpClient } from '../../../../shared/lib/http';
import { TokenGateway } from '../../domain';
declare class CustomerHTTPGateway implements TokenGateway {
    readonly httpClient: HttpClient;
    constructor(httpClient: HttpClient);
    get(): Promise<void>;
}
export default CustomerHTTPGateway;
