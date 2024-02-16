import { TokenRepository } from '../domain';
import { TokenGateway } from '../domain';
declare class GetBffExtensionToken {
    readonly repository: TokenRepository;
    readonly gateway: TokenGateway;
    constructor(repository: TokenRepository, gateway: TokenGateway);
    execute(): Promise<string | void>;
}
export default GetBffExtensionToken;
