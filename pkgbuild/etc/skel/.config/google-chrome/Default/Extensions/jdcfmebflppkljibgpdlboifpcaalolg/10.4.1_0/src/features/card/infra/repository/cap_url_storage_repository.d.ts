import { Repository } from '../../../../shared/lib/repository';
import { CapUrlRepository } from '../../domain';
declare class CapUrlStorageRepository implements CapUrlRepository {
    readonly repository: Repository;
    static KEY: string;
    constructor(repository: Repository);
    get(url: string): Promise<number>;
    save(expiresIn: number, url: string): Promise<void>;
    remove(url: string): Promise<void>;
}
export default CapUrlStorageRepository;
