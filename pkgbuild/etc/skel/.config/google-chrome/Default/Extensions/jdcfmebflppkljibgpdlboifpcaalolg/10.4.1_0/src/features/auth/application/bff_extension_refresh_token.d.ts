import { TokenGateway, TokenRepository } from '../domain';
declare class BffExtensionRefreshToken {
    readonly repository: TokenRepository;
    readonly gateway: TokenGateway;
    constructor(repository: TokenRepository, gateway: TokenGateway);
    execute(): Promise<string | void>;
}
export default BffExtensionRefreshToken;
