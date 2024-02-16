import { TokenRepository } from '../domain';
declare class GetCustomerToken {
    readonly repository: TokenRepository;
    constructor(repository: TokenRepository);
    execute(): Promise<string>;
}
export default GetCustomerToken;
