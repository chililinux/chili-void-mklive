import { HttpClient } from '../../../../shared/lib/http';
import StaticFileGateway from './static_file_gateway';
declare class StaticFileHTTPGateway implements StaticFileGateway {
    readonly httpClient: HttpClient;
    constructor(httpClient: HttpClient);
    get(path: string): Promise<JSON | undefined>;
}
export default StaticFileHTTPGateway;
