import { HttpClient } from '../../../shared/lib/http';
import { Configuration, FixedExtensionRepository } from '../domain';
declare class GetConfiguration {
    readonly httpClient: HttpClient;
    readonly fixedExtensionRepository: FixedExtensionRepository;
    constructor(httpClient: HttpClient, fixedExtensionRepository: FixedExtensionRepository);
    execute(): Promise<Configuration>;
}
export default GetConfiguration;
