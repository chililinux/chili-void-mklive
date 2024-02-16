import { Repository } from '../../../../shared/lib/repository';
import { FixedExtensionRepository } from '../../domain/repositories';
declare class FixedExtensionStorageRepository implements FixedExtensionRepository {
    readonly repository: Repository;
    static KEY: string;
    constructor(repository: Repository);
    get(key?: string): Promise<any>;
    save(data: any, expiresIn?: number): Promise<void>;
}
export default FixedExtensionStorageRepository;
