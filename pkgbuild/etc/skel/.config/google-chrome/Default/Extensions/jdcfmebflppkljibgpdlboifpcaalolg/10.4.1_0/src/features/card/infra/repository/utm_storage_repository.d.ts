import { Repository } from '../../../../shared/lib/repository';
import { UtmRepository } from '../../domain/repositories';
declare class UtmStorageRepository implements UtmRepository {
    readonly repository: Repository;
    static KEY: string;
    constructor(repository: Repository);
    get(): Promise<string>;
    save(context: string): Promise<void>;
    remove(): Promise<void>;
}
export default UtmStorageRepository;
