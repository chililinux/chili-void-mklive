import { TokenRepository } from '../domain';
import { TokenGateway } from '../domain';
declare class CustomerRefrehToken {
    readonly repository: TokenRepository;
    readonly gateway: TokenGateway;
    constructor(repository: TokenRepository, gateway: TokenGateway);
    execute(): Promise<string>;
}
export default CustomerRefrehToken;
