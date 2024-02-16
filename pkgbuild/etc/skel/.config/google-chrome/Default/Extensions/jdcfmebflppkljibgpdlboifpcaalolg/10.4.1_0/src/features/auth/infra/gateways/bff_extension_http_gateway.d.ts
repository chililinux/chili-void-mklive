import { HttpClient } from '../../../../shared/lib/http';
import { TokenGateway } from '../../domain';
declare class BffExtensionHTTPGateway implements TokenGateway {
    readonly httpClient: HttpClient;
    constructor(httpClient: HttpClient);
    get(): Promise<string>;
}
export default BffExtensionHTTPGateway;
