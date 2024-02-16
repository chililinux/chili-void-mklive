import { Repository } from '../../../../shared/lib/repository';
import { TokenRepository } from '../../domain';
declare class CustomerTokenCookiesRepository implements TokenRepository {
    readonly repository: Repository;
    private static KEY;
    constructor(repository: Repository);
    get(): Promise<string>;
    save(token: string): Promise<void>;
    remove(): Promise<void>;
}
export default CustomerTokenCookiesRepository;
